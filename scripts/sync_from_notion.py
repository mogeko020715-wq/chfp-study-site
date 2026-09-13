#!/usr/bin/env python3
"""从 Notion 同步 CHFP 习题与知识点到学习网站（官方 API 版）。

数据源：
- 习题库数据库 投资规划 -> src/data/questions.ts
- 主页面 12 章节标题下的笔记块 -> src/data/knowledge.ts
数据变化时自动执行 npm run build。

Token 从环境变量 NOTION_TOKEN 或 app 目录下的 .env.notion 读取。
用法: python scripts/sync_from_notion.py
退出码: 0 成功(含无变化), 2 环境不可用(token 缺失/网络不通), 1 执行失败
"""
import json
import os
import re
import subprocess
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

APP = Path(__file__).resolve().parent.parent
NOTION_VERSION = "2022-06-28"
DATABASE_ID = "3b21b291-6e3b-80df-a4f5-e4f50209db5e"
MAIN_PAGE_ID = "3911b291-6e3b-8084-911e-e50928b00735"


def load_token() -> str:
    token = os.environ.get("NOTION_TOKEN", "").strip()
    if token:
        return token
    env = APP / ".env.notion"
    if env.exists():
        token = env.read_text().strip()
        if token:
            return token
    return ""


TOKEN = load_token()


def notion(method: str, path: str, body: dict | None = None, timeout: int = 30) -> dict:
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(
        f"https://api.notion.com/v1{path}",
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Notion-Version": NOTION_VERSION,
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        detail = e.read().decode()[:200]
        raise RuntimeError(f"Notion API {e.code}: {detail}")


def paginated_list(path: str, body: dict | None = None) -> list:
    items = []
    cursor = None
    while True:
        payload = dict(body or {})
        payload["page_size"] = 100
        if cursor:
            payload["start_cursor"] = cursor
        d = notion("POST" if body is not None or path.endswith("/query") else "GET", path, payload if path.endswith("/query") else None)
        items.extend(d.get("results", []))
        if not d.get("has_more"):
            return items
        cursor = d.get("next_cursor")


def get_children(block_id: str) -> list:
    items = []
    cursor = None
    while True:
        url = f"/blocks/{block_id}/children?page_size=100"
        if cursor:
            url += f"&start_cursor={cursor}"
        d = notion("GET", url)
        items.extend(d.get("results", []))
        if not d.get("has_more"):
            return items
        cursor = d.get("next_cursor")


def rich_text(arr) -> str:
    return "".join(x.get("plain_text", "") for x in (arr or []))


# ---------------- 习题同步 ----------------

def sync_questions() -> dict:
    pages = paginated_list(f"/databases/{DATABASE_ID}/query", {})
    old_dates = {}
    qt_path = APP / "src/data/questions.ts"
    if qt_path.exists():
        qt = qt_path.read_text()
        # 生成的文件格式固定：stem/answer/tags/date 各占一行
        for m in re.finditer(
            r'stem: ("(?:[^"\\]|\\.)*"),\n    answer: .*\n    tags: \[[^\]]*\],\n    date: ("(?:[^"\\]|\\.)*")',
            qt,
        ):
            old_dates[json.loads(m.group(1)).strip()] = json.loads(m.group(2))

    rows = []
    for p in pages:
        props = p.get("properties", {})
        stem = rich_text(props.get("题干", {}).get("title"))
        if not stem.strip():
            continue
        rows.append({
            "stem": stem,
            "answer": rich_text(props.get("知识点/答案", {}).get("rich_text")),
            "chapter": (props.get("章节", {}).get("select") or {}).get("name", ""),
            "theme": (props.get("主题", {}).get("select") or {}).get("name", ""),
            "tags": [o["name"] for o in props.get("tags", {}).get("multi_select", [])],
        })

    ch_order = {"概述": 0, "投资需求分析": 1, "基础资产": 2, "": 3}
    th_order = {"债券": 0, "股票": 1, "": 2}
    rows.sort(key=lambda x: (ch_order.get(x["chapter"], 9), th_order.get(x["theme"], 9), x["stem"]))

    lines = [
        "export interface Question {",
        "  stem: string",
        "  answer: string",
        "  tags: string[]",
        "  date: string",
        "  chapter: string",
        "  theme: string",
        "}",
        "",
        "export const questions: Question[] = [",
    ]
    js = lambda s: json.dumps(s, ensure_ascii=False)
    for x in rows:
        date = old_dates.get(x["stem"].strip(), "")
        lines.append("  {")
        lines.append(f"    stem: {js(x['stem'])},")
        lines.append(f"    answer: {js(x['answer'])},")
        lines.append(f"    tags: [{', '.join(js(t) for t in x['tags'])}],")
        lines.append(f"    date: {js(date)},")
        lines.append(f"    chapter: {js(x['chapter'])},")
        lines.append(f"    theme: {js(x['theme'])},")
        lines.append("  },")
    lines.append("]")
    lines.append("")
    return {"count": len(rows), "content": "\n".join(lines)}


# ---------------- 知识点同步 ----------------

TYPE_MAP = {
    "heading_2": "sub_header",
    "heading_3": "sub_sub_header",
    "bulleted_list_item": "bulleted_list",
    "numbered_list_item": "numbered_list",
    "to_do": "todo",
    "paragraph": "text",
    "table": "table",
    "table_row": "table_row",
}

# 容器/装饰块不输出条目（其子块已递归展开）
SKIP_TYPES = {"divider", "column_list", "column"}


def block_text(block: dict) -> str:
    t = block.get("type")
    payload = block.get(t) or {}
    arr = payload.get("title") or payload.get("rich_text") or []
    return rich_text(arr)


def block_cells(block: dict) -> list:
    """table_row -> 每个单元格的纯文本列表。"""
    payload = block.get("table_row") or {}
    return [rich_text(cell) for cell in payload.get("cells", [])]


def clean_title(t: str) -> str:
    t = re.sub(r"^[^\w一-鿿]+", "", t)
    t = re.sub(r"[（(][^（()）]*[）)]$", "", t)
    return t.strip()


def sync_knowledge() -> dict:
    top = get_children(MAIN_PAGE_ID)
    chapters = []
    for b in top:
        if b.get("type") != "heading_1":
            continue
        title = block_text(b)
        items: list = []

        def walk(parent_id: str, depth: int) -> None:
            for child in get_children(parent_id):
                t = child.get("type")
                if t in SKIP_TYPES:
                    if child.get("has_children"):
                        walk(child["id"], depth)
                    continue
                mapped = TYPE_MAP.get(t, t)
                item = {"type": mapped, "text": block_text(child), "depth": depth}
                if t == "table_row":
                    item["cells"] = block_cells(child)
                items.append(item)
                if child.get("has_children"):
                    walk(child["id"], depth + 1)

        walk(b["id"], 0)
        chapters.append({"title": clean_title(title), "items": items})

    lines = [
        "export interface KnowItem {",
        "  type: string",
        "  text: string",
        "  depth: number",
        "  cells?: string[]",
        "}",
        "",
        "export interface KnowledgeChapter {",
        "  title: string",
        "  items: KnowItem[]",
        "}",
        "",
        "// 投资规划 · 金融工具 12 章节知识点（同步自 Notion 主页面，同步时间 "
        + time.strftime("%Y-%m-%d") + "）",
        "export const knowledgeChapters: KnowledgeChapter[] = [",
    ]
    js = lambda s: json.dumps(s, ensure_ascii=False)
    for c in chapters:
        lines.append("  {")
        lines.append(f"    title: {js(c['title'])},")
        lines.append("    items: [")
        for it in c["items"]:
            if it["type"] == "table_row":
                cells = ", ".join(js(x) for x in it.get("cells", []))
                lines.append(f"      {{ type: {js(it['type'])}, text: {js(it['text'])}, depth: {it['depth']}, cells: [{cells}] }},")
            else:
                lines.append(f"      {{ type: {js(it['type'])}, text: {js(it['text'])}, depth: {it['depth']} }},")
        lines.append("    ],")
        lines.append("  },")
    lines.append("]")
    lines.append("")
    return {"count": sum(len(c["items"]) for c in chapters), "content": "\n".join(lines)}


def write_if_changed(rel: str, content: str, normalize=None) -> bool:
    p = APP / rel
    old = p.read_text() if p.exists() else None
    if old is not None:
        a = normalize(old) if normalize else old
        b = normalize(content) if normalize else content
        if a == b:
            return False
    p.write_text(content)
    return True


def main() -> int:
    if not TOKEN:
        print("缺少 NOTION_TOKEN：请设置环境变量或在 app 目录创建 .env.notion")
        return 2
    try:
        notion("GET", "/users/me", timeout=15)
    except Exception as e:
        print(f"Notion API 不可用：{e}")
        return 2
    try:
        q = sync_questions()
        k = sync_knowledge()
    except Exception as e:
        print(f"同步失败: {e}")
        return 1
    changed_q = write_if_changed("src/data/questions.ts", q["content"])
    changed_k = write_if_changed(
        "src/data/knowledge.ts", k["content"],
        normalize=lambda s: re.sub(r"同步时间 \d{4}-\d{2}-\d{2}", "同步时间 DATE", s),
    )
    if changed_q or changed_k:
        build = subprocess.run(["npm", "run", "build"], cwd=APP, capture_output=True, text=True, timeout=300)
        if build.returncode != 0:
            print("数据已更新但构建失败：\n" + build.stdout[-500:] + build.stderr[-500:])
            return 1
        print(f"已更新并构建：习题 {q['count']} 题{'（有变化）' if changed_q else ''}，知识点 {k['count']} 条{'（有变化）' if changed_k else ''}")
    else:
        print(f"无变化：习题 {q['count']} 题，知识点 {k['count']} 条")
    return 0


if __name__ == "__main__":
    sys.exit(main())

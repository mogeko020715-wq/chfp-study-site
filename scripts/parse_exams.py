#!/usr/bin/env python3
"""把三科模拟卷 PDF 解析成 src/data/exams.json。

题目 PDF：案例分块 → 题号 N. → 选项 A./B./C./D.（字母独占一行，内容在后续行）
答案 PDF：N.正确答案：XX → 答案解析：…（多行拼接）
"""
from __future__ import annotations

import json
import re
from pathlib import Path

import fitz

BASE = Path("/Users/maxine/Downloads/学习/理财规划考试")
OUT = Path(__file__).resolve().parent.parent / "src" / "data" / "exams.json"

SUBJECTS = [
    ("s1", "科目一 · 理财规划基础与家庭财务规划", "科目一 理财规划基础与家庭财务规划"),
    ("s2", "科目二 · 风险管理与保险规划", "科目二 风险管理与保险规划"),
    ("s3", "科目三 · 投资规划", "科目三 投资规划"),
]

CASE_RE = re.compile(r"案例[一二三四五六]：?")
SECTION_RE = re.compile(r"^[一二三四五六]、", re.M)
OPT_RE = re.compile(r"^([A-E])\.$")


def read_pdf(path: Path) -> str:
    doc = fitz.open(path)
    lines = []
    for pg in doc:
        for ln in pg.get_text().split("\n"):
            ln = ln.strip()
            if not ln:
                continue
            if re.fullmatch(r"\d{1,2}", ln):  # 页码
                continue
            lines.append(ln)
    return "\n".join(lines)


def split_cases(text: str) -> list[tuple[str, str]]:
    parts = CASE_RE.split(text)
    return [(f"案例{'一二三四五六'[i]}", parts[i + 1]) for i in range(len(parts) - 1)]


def split_questions(text: str) -> tuple[str, list[str]]:
    """返回（案例情景, 各题文本块）。题号格式：行首 N.（点后不能紧跟数字，避免把小数/百分比当题号）"""
    idxs = [m for m in re.finditer(r"^(\d+)\.(?!\d)", text, re.M)]
    if not idxs:
        return text.strip(), []
    scenario = text[: idxs[0].start()].strip()
    scenario = scenario.split("根据案例回答下列问题")[0].strip()
    scenario = scenario.split("根据资料回答下列问题")[0].strip()
    scenario = scenario.split("根据资料，回答下列问题")[0].strip()
    blocks = []
    for i, m in enumerate(idxs):
        end = idxs[i + 1].start() if i + 1 < len(idxs) else len(text)
        blocks.append(text[m.start():end].strip())
    return scenario, blocks


def parse_question(block: str) -> dict | None:
    m = re.match(r"(\d+)\.", block)
    no = int(m.group(1))
    lines = block[m.end():].split("\n")
    stem_parts: list[str] = []
    options: list[dict] = []
    cur_letter = None
    cur_text: list[str] = []
    for ln in lines:
        om = OPT_RE.match(ln)
        if om:
            if cur_letter:
                options.append({"letter": cur_letter, "text": "".join(cur_text)})
            cur_letter = om.group(1)
            cur_text = []
            continue
        # 兼容 A.内容同行（少见）
        om2 = re.match(r"^([A-E])\.\s*(\S.*)$", ln)
        if om2 and not cur_letter:
            cur_letter = om2.group(1)
            cur_text = [om2.group(2)]
            continue
        if cur_letter:
            cur_text.append(ln)
        else:
            stem_parts.append(ln)
    if cur_letter:
        options.append({"letter": cur_letter, "text": "".join(cur_text)})
    stem = "".join(stem_parts)
    stem = re.sub(r"\s+", " ", stem).strip()
    if not options:
        return None
    return {"no": no, "stem": stem, "options": options}


def parse_answers(text: str) -> dict:
    """返回 {section_idx: {case_idx: {no: {correct, explain}}}}"""
    out: dict[int, dict] = {}
    sections = SECTION_RE.split(text)[1:] or [text]
    for si, sec in enumerate(sections):
        sec_out: dict[int, dict] = {}
        # 案例内再分
        case_starts = [(m.start(), i) for i, m in enumerate(CASE_RE.finditer(sec))]
        if not case_starts:
            case_starts = [(0, 0)]
        for ci, (start, _) in enumerate(case_starts):
            end = case_starts[ci + 1][0] if ci + 1 < len(case_starts) else len(sec)
            seg = sec[start:end]
            qdict = {}
            for m in re.finditer(r"(\d+)\.正确答案：([A-E]+)\s*\n答案解析：", seg):
                qno = int(m.group(1))
                correct = m.group(2)
                exp_start = m.end()
                # 解析到下一题或段尾
                nxt = re.search(r"\n\d+\.正确答案：", seg[exp_start:])
                exp_end = exp_start + nxt.start() if nxt else len(seg)
                explain = seg[exp_start:exp_end]
                explain = re.sub(r"\s+", "", explain)
                qdict[qno] = {"correct": correct, "explain": explain}
            sec_out[ci] = qdict
        out[si] = sec_out
    return out


def main() -> None:
    subjects = []
    for sid, name, fname in SUBJECTS:
        qtext = read_pdf(BASE / f"{fname} - 题目.pdf")
        atext = read_pdf(BASE / f"{fname} - 答案.pdf")
        answers = parse_answers(atext)
        # 先按大题节切（一、单项选择题 / 二、多项选择题），再按案例切
        sec_matches = list(SECTION_RE.finditer(qtext))
        if sec_matches:
            sections = []
            for si, m in enumerate(sec_matches):
                end = sec_matches[si + 1].start() if si + 1 < len(sec_matches) else len(qtext)
                header = qtext[m.start():qtext.find("\n", m.start())].strip()
                # 标题去掉「一、」前缀与括号说明
                header = re.sub(r"^[一二三四五六]、", "", header).split("（")[0]
                sections.append((header, qtext[m.start():end]))
        else:
            sections = [("", qtext)]
        cases = []
        for si, (sec_title, sec) in enumerate(sections):
            case_parts = split_cases(sec)
            if not case_parts:
                case_parts = [("", sec)]
            for ci, (ctitle, ctext) in enumerate(case_parts):
                title = ctitle or sec_title
                scenario, blocks = split_questions(ctext)
                if not ctitle:
                    scenario = ""  # 无案例的板块不带情景文字
                qs = []
                for b in blocks:
                    q = parse_question(b)
                    if not q:
                        continue
                    a = answers.get(si, {}).get(ci, {}).get(q["no"], {})
                    q["correct"] = a.get("correct", "")
                    q["explain"] = a.get("explain", "")
                    qs.append(q)
                cases.append({"title": title, "scenario": scenario, "questions": qs})
        total = sum(len(c["questions"]) for c in cases)
        print(f"{name}: {len(cases)} 案例 · {total} 题")
        for c in cases:
            print(f"  {c['title']}: {len(c['questions'])} 题")
        subjects.append({"id": sid, "name": name, "total": total, "cases": cases})
    OUT.write_text(json.dumps({"subjects": subjects}, ensure_ascii=False), encoding="utf-8")
    print(f"\n写入 {OUT}（{OUT.stat().st_size / 1024:.0f} KB）")


if __name__ == "__main__":
    main()

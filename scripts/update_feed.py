#!/usr/bin/env python3
"""每日收盘后重建 public/feed.json 的日报数据（+ 周日汇总周报）。

数据源（均为公开行情接口，无需密钥）：
- 东方财富 push2：上证指数、黄金ETF（518880）、行业板块涨幅榜
- 腾讯 qt.gtimg.cn：美元/在岸人民币（whUSDCNY）

用法：
  python scripts/update_feed.py            # 生成今日日报（幂等，非交易日/已有数据则跳过）
  python scripts/update_feed.py --weekly   # 汇总本周周报（仅周日执行有效）
接口全部失败时静默退出（不写文件），前端会自动挂出「数据停在 X 日」横幅。
"""

from __future__ import annotations

import json
import sys
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FEED_PATH = ROOT / "public" / "feed.json"
CST = timezone(timedelta(hours=8))
KEEP_DAYS = 90
KEEP_WEEKS = 12

UA = {"User-Agent": "Mozilla/5.0 (feed-updater)"}


def get(url: str, encoding: str = "utf-8") -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.read().decode(encoding, errors="replace")


def em_quote(secid: str) -> tuple[float, float, float] | None:
    """东方财富实时行情：返回（最新价, 昨收, 涨跌幅%）"""
    url = (
        "https://push2.eastmoney.com/api/qt/stock/get"
        f"?invt=2&fltt=2&secid={secid}&fields=f43,f58,f60,f170"
    )
    d = json.loads(get(url)).get("data")
    if not d or d.get("f43") in (None, "-"):
        return None
    return float(d["f43"]), float(d["f60"]), float(d["f170"])


def em_top_sectors(n: int = 3) -> list[tuple[str, float]] | None:
    """东方财富行业板块涨幅前 n 名：返回 [（名称, 涨幅%）]"""
    url = (
        "https://push2.eastmoney.com/api/qt/clist/get"
        f"?fid=f3&po=1&pz={n}&pn=1&np=1&fltt=2&invt=2&fs=m:90+t:2&fields=f14,f3"
    )
    diff = (json.loads(get(url)).get("data") or {}).get("diff") or []
    out = [(x["f14"], float(x["f3"])) for x in diff if x.get("f14")]
    return out or None


def tencent_fx() -> tuple[float, float] | None:
    """腾讯外汇：美元/在岸人民币，返回（最新价, 涨跌幅%）"""
    raw = get("https://qt.gtimg.cn/q=whUSDCNY", encoding="gbk")
    fields = raw.split('"')[1].split("~")
    return float(fields[3]), float(fields[13])


def fmt_pct(p: float) -> str:
    return f"{p:+.2f}%"


def direction(p: float) -> str:
    return "上涨" if p >= 0 else "下跌"


def build_daily(date: str, index, gold, fx, sectors):
    """按既有模板生成 4 条日报 + 3 道实战题。"""
    daily, practice = [], []
    if index:
        price, _, pct = index
        daily.append({
            "id": f"d{date.replace('-', '')}-mkt-index", "date": date,
            "title": f"A股收盘：上证指数报 {price:.2f} 点（{fmt_pct(pct)}）",
            "summary": f"上证指数收报 {price:.2f} 点，{direction(pct)} {abs(pct):.2f}%。市场全貌与板块排行见下方条目与周报。",
            "source": "东方财富行情", "category": "大类资产", "modules": ["投资规划"],
            "points": ["股票市场 · 指数与市场结构"], "importance": 2,
            "dataDate": date, "auto": True, "price": price, "pct": pct,
        })
        practice.append({
            "id": f"p{date.replace('-', '')}-index", "date": date, "dataDate": date,
            "point": "股票市场 · 指数与市场结构",
            "question": f"{date} 上证指数收报 {price:.2f} 点（{fmt_pct(pct)}）。上证指数采用总市值加权，其涨跌主要由____决定。",
            "options": ["A. 上涨家数占比", "B. 大市值权重股表现", "C. 涨停个股数量", "D. 当日成交额"],
            "answer": "B",
            "explain": "总市值加权（派许加权）下，权重大的成分股对指数影响最大。所以会出现「指数涨但多数个股跌」的失真现象——指数 ≠ 全部股票。",
        })
    if gold:
        price, _, pct = gold
        daily.append({
            "id": f"d{date.replace('-', '')}-mkt-gold", "date": date,
            "title": f"黄金ETF收报 {price:.3f} 元（{fmt_pct(pct)}）",
            "summary": f"华安黄金ETF（跟踪国内金价）收报 {price:.3f} 元，{direction(pct)} {abs(pct):.2f}%。金价驱动因素复盘：美元指数、实际利率与避险需求。",
            "source": "东方财富行情", "category": "大类资产", "modules": ["投资规划"],
            "points": ["贵金属市场 · 影响黄金价格的因素"], "importance": 3,
            "dataDate": date, "auto": True, "price": price, "pct": pct,
        })
        practice.append({
            "id": f"p{date.replace('-', '')}-gold", "date": date, "dataDate": date,
            "point": "贵金属市场 · 影响黄金价格的因素",
            "question": f"{date} 黄金ETF {direction(pct)} {abs(pct):.2f}%。下列哪一项不是教材中影响金价的主要因素？",
            "options": ["A. 美元指数", "B. 实际利率", "C. 避险情绪", "D. 人民币汇率中间价形成机制"],
            "answer": "D",
            "explain": "金价三渠道：计价货币（美元）、机会成本（实际利率）、避险需求。人民币汇率形成机制不是金价驱动因素——做「不属于」类题时警惕相近概念干扰。",
        })
    if fx:
        price, pct = fx
        daily.append({
            "id": f"d{date.replace('-', '')}-mkt-fx", "date": date,
            "title": f"在岸人民币收报 {price:.4f}（{fmt_pct(pct)}）",
            "summary": f"美元/在岸人民币收报 {price:.4f}。汇率变动通过外贸企业汇兑损益与跨境资金流动影响市场，标价方法（直接/间接）是外汇章常考点。",
            "source": "腾讯财经行情", "category": "大类资产", "modules": ["理财规划基础", "投资规划"],
            "points": ["经济环境 · 利率与汇率的传导", "外汇市场 · 汇率标价方法"],
            "importance": 2, "dataDate": date, "auto": True, "price": price, "pct": pct,
        })
        updown = "上升" if pct >= 0 else "下降"
        practice.append({
            "id": f"p{date.replace('-', '')}-fx", "date": date, "dataDate": date,
            "point": "外汇市场 · 汇率标价方法",
            "question": f"{date} 在岸人民币（USDCNY）报 {price:.4f}，较前一日{updown} {abs(pct):.2f}%。按直接标价法，这意味着人民币____。",
            "options": ["A. 升值", "B. 贬值"],
            "answer": "B" if pct >= 0 else "A",
            "explain": f"直接标价法：数值上升 = 1 美元折合更多人民币 = 人民币贬值；数值下降 = 升值。当日数值{updown}，故人民币{'贬值' if pct >= 0 else '升值'}。考点：先判断标价法，再谈币值方向。",
        })
    if sectors:
        names = "、".join(f"{n}（{fmt_pct(p)}）" for n, p in sectors)
        detail = "；".join(f"{n} {fmt_pct(p)}" for n, p in sectors)
        daily.append({
            "id": f"d{date.replace('-', '')}-mkt-board-up", "date": date,
            "title": f"今日领涨板块：{names}",
            "summary": f"行业板块涨幅前三。{detail}。完整涨跌榜见周报。",
            "source": "东方财富行情", "category": "板块行业", "modules": [], "points": [],
            "importance": 3, "dataDate": date, "auto": True,
            "sectors": [{"name": n, "pct": p} for n, p in sectors],
        })
    return daily, practice


def next_sunday(today: datetime) -> str:
    return (today + timedelta(days=(6 - today.weekday()) % 7 or 7)).strftime("%Y-%m-%d")


def run_daily(feed: dict, now: datetime) -> bool:
    today = now.strftime("%Y-%m-%d")
    if any(d["date"] == today for d in feed["daily"]):
        print(f"日报 {today} 已存在，跳过")
        return False

    def safe(fn, *a):
        try:
            return fn(*a)
        except Exception as e:  # noqa: BLE001
            print(f"[warn] 数据源失败 {fn.__name__}: {e}", file=sys.stderr)
            return None

    index = safe(em_quote, "1.000001")
    gold = safe(em_quote, "1.518880")
    fx = safe(tencent_fx)
    sectors = safe(em_top_sectors)
    if not any([index, gold, fx, sectors]):
        print("所有数据源均不可用，不写文件")
        return False

    daily, practice = build_daily(today, index, gold, fx, sectors)
    feed["daily"].extend(daily)
    feed.setdefault("practice", []).extend(practice)
    cutoff = (now - timedelta(days=KEEP_DAYS)).strftime("%Y-%m-%d")
    feed["daily"] = [d for d in feed["daily"] if d["date"] >= cutoff]
    feed["practice"] = [p for p in feed["practice"] if p["date"] >= cutoff]
    feed["meta"]["updatedAt"] = now.isoformat(timespec="seconds")
    feed["meta"]["nextWeekly"] = next_sunday(now)
    print(f"日报 {today} 已生成：{len(daily)} 条资讯 + {len(practice)} 道实战题")
    return True


WHY = {
    "股票市场 · 指数与市场结构": "教材口径：指数是全市场的温度计，总市值加权意味着大市值公司对指数影响更大；板块轮动快于指数是常态。",
    "贵金属市场 · 影响黄金价格的因素": "教材口径：黄金以美元计价且不生息——美元指数走强、实际利率上升时金价承压；地缘风险升温时避险需求托底。本周金价表现是这套传导链的现实演绎。",
    "经济环境 · 利率与汇率的传导": "教材口径：利差驱动跨境资本流动，主要央行政策差会通过汇率渠道传导到国内资产价格。",
}


def week_pct(entries: list[dict]) -> tuple[float, float, float] | None:
    """从一周内日报的收盘价算复合周涨跌：返回（涨幅%, 首日收盘, 末日收盘）"""
    priced = sorted((e for e in entries if "price" in e), key=lambda e: e["date"])
    if len(priced) < 2:
        return None
    first, last = priced[0], priced[-1]
    pct = (last["price"] / first["price"] - 1) * 100
    return pct, first["price"], last["price"]


def run_weekly(feed: dict, now: datetime) -> bool:
    if now.weekday() != 6:
        print("非周日，跳过周报")
        return False
    monday = (now - timedelta(days=6)).date()
    dates = [(monday + timedelta(days=i)).isoformat() for i in range(7)]
    week_daily = [d for d in feed["daily"] if d["date"] in dates]
    if not week_daily:
        print("本周无日报数据，跳过周报")
        return False

    iso = now.isocalendar()
    wid = f"w{iso.year}w{iso.week:02d}"
    if any(w["id"] == wid for w in feed["weekly"]):
        print(f"周报 {wid} 已存在，跳过")
        return False
    label = f"{iso.year} 年第 {iso.week} 周（{monday.strftime('%m.%d')}–{now.strftime('%m.%d')}）"

    # 涨跌榜：统计本周日报里的领涨板块出现次数
    board: dict[str, dict] = {}
    for d in week_daily:
        for s in d.get("sectors", []):
            b = board.setdefault(s["name"], {"name": s["name"], "change": fmt_pct(s["pct"]), "days": 0})
            b["days"] += 1
            b["change"] = fmt_pct(s["pct"])  # 取最近一次领涨当日涨幅
    board_list = [
        {"name": b["name"], "change": b["change"], "note": f"周内 {b['days']} 天领涨"}
        for b in sorted(board.values(), key=lambda x: -x["days"])[:3]
    ]

    # 周度复合涨跌
    highlights = []
    by_id_suffix = {"mkt-index": "上证指数", "mkt-gold": "黄金ETF", "mkt-fx": "在岸人民币"}
    for suffix, name in by_id_suffix.items():
        entries = [d for d in week_daily if d["id"].endswith(suffix)]
        r = week_pct(entries)
        if not r:
            continue
        pct, p0, p1 = r
        d0 = entries[0]["date"][5:].replace("-", ".")
        d1 = entries[-1]["date"][5:].replace("-", ".")
        if suffix == "mkt-index":
            highlights.append(f"{name}周内{fmt_pct(pct)}（{d0} 收 {p0:.2f} → {d1} 收 {p1:.2f}，按日报收盘复合）")
        elif suffix == "mkt-gold":
            highlights.append(f"{name}周内{fmt_pct(pct)}，收 {p1:.3f} 元")
        else:
            highlights.append(f"{name}周内{fmt_pct(pct)}，收 {p1:.4f}（直接标价法下数值下降 = 人民币升值）")

    # 这条考什么：取本周最后一期指数/黄金/外汇日报
    exam_links = []
    for suffix in ("mkt-index", "mkt-gold", "mkt-fx"):
        entries = [d for d in week_daily if d["id"].endswith(suffix)]
        if not entries:
            continue
        last = entries[-1]
        point = last["points"][0] if last["points"] else ""
        why = WHY.get(point, "教材口径：结合对应章节的概念框架复盘这条新闻。")
        exam_links.append({"news": last["title"], "point": point, "why": why})

    # 小测：取本周最后一道指数实战题
    week_practice = [p for p in feed.get("practice", []) if p["date"] in dates and p["id"].endswith("-index")]
    quiz_src = week_practice[-1] if week_practice else None
    quiz = quiz_src and {
        "question": quiz_src["question"], "options": quiz_src["options"],
        "answer": quiz_src["answer"], "explain": quiz_src["explain"],
    }

    next_mon = now + timedelta(days=1)
    next_sun = now + timedelta(days=7)
    feed["weekly"].insert(0, {
        "id": wid, "week": label,
        "board": board_list or None,
        "highlights": highlights,
        "examLinks": exam_links,
        "quiz": quiz,
        "nextWeek": [
            f"下周 5 个交易日（{next_mon.strftime('%m.%d')}–{next_sun.strftime('%m.%d')}），日报每个交易日收盘后自动更新",
            "板块轮动延续性：本周高频领涨板块能否持续，是观察市场主线的窗口",
            "复习建议：把本周要闻对应的知识点（上方「这条考什么」）过一遍闪卡",
        ],
    })
    feed["weekly"] = feed["weekly"][:KEEP_WEEKS]
    print(f"周报 {label} 已生成")
    return True


def main() -> None:
    feed = json.loads(FEED_PATH.read_text(encoding="utf-8"))
    now = datetime.now(CST)
    changed = run_weekly(feed, now) if "--weekly" in sys.argv else run_daily(feed, now)
    if changed:
        FEED_PATH.write_text(json.dumps(feed, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("feed.json 已更新")


if __name__ == "__main__":
    main()

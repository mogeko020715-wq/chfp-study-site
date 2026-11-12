#!/usr/bin/env python3
"""题库剩余章节批量规则化改写。

规则（题干）：
  X是指：     → 什么是X？
  X包括：     → X包括哪些？
  X有：       → X有哪些？
  X分为：     → X可以分为哪些？
  X叫(什么)： → X叫什么？
  X的定义：   → X的定义是什么？
  X的比较：   → X有何区别？
  X的关系：   → X是什么关系？
  短词条：    → 什么是X？
  其他尾冒号  → 尾冒号换「？」
规则（答案）：序号 1）2）→ •；and→和；➡️→→；短答案补句号

输出 questions.ts 的修改 + 对照报告 /tmp/rewrite-report.txt 供人工审阅。
"""
import re
import sys
from pathlib import Path

PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "questions.ts"
DONE = {"概述", "投资需求分析"}

# 人工兜底：题干原文 → 改后题干（规则效果不好时用）
STEM_OVERRIDES: dict[str, str] = {
    "关于信托型私募基金：": "什么是信托型私募基金？",
    "关于债券的利率风险，有：": "债券的利率风险有哪些？",
    "关于债券票面利率：": "关于债券票面利率，需要掌握什么？",
    "关于可转债：": "什么是可转债？",
    "关于基金购买成本，收取费用相关：": "购买基金涉及哪些费用？",
    "关于开放式基金与封闭式基金：": "开放式基金与封闭式基金有何区别？",
    "关于我国沪、深两地证券交易所竞价方式的说法：": "我国沪、深两地证券交易所的竞价方式是什么？",
    "关于无记名股票的特点；": "无记名股票有哪些特点？",
    "关于无面额股票：": "什么是无面额股票？",
    "关于现金股利与股票股利对公司财务影响的不同": "现金股利与股票股利对公司财务的影响有何不同？",
    "关于私募基金的募集人数：": "私募基金的募集人数有何规定？",
    "在债券投资过程中，一定要注意债券的信用级别。关于目前在债券评级中常见的4C标准，具体上是指：": "债券评级中常见的 4C 标准具体指什么？",
    "关于基金评价方法": "基金评价方法有哪些？",
    "进行资产配置的过程中，关于构建最佳投资组合需要考虑的有哪两类方法：": "构建最佳投资组合时需要考虑哪两类方法？",
    "准备发行政策性金融债券的银行应根据实际需要，按照规定的要求和程序向哪个机构报送本单位发行政策性":
        "准备发行政策性金融债券的银行，应按规定的程序向哪个机构报送发行计划？",
    "国债的发行按是否有金融中介机构参与出售的标准来看，有直接发行与间接发行之分":
        "国债发行按是否有金融中介机构参与出售，可分为哪两种方式？",
    "上海股票市场于1993年6月1日增设了上证指数分类":
        "1993 年 6 月 1 日，上海股票市场增设了什么指数分类？",
    "现金流量表主要三大内容": "现金流量表主要包括哪三大内容？",
    "道氏理论的5个主要理论": "道氏理论的 5 个主要内容是什么？",
    "影响黄金价格的主要因素": "影响黄金价格的主要因素有哪些？",
    "最典型的国际金商": "最典型的国际金商有哪些？",
    "期现套利是指利用期货市场和现货市场之间不合理价差，通过在两个市场上进行_交易。待价差趋于合理而获利的交易":
        "什么是期现套利？",
    "目前世界上最大的黄金期货交易中心是": "目前世界上最大的黄金期货交易中心是哪个？",
    "一般来说，投资者或理财规划师在进行资产配置时先考察": "进行资产配置时，理财规划师一般先考察什么？",
    "资金在股票、债券和现金等金融资产之间的资金分配称之为": "资金在股票、债券和现金等金融资产之间的分配称为什么？",
    "假定某指数的期末价值为2423，期初价值为2011，则该期内的简单收益率为":
        "假定某指数期末价值为 2423、期初价值为 2011，该期内的简单收益率是多少？",
    "公募基金的税收": "公募基金的税收规定是什么？",
    "哪些持牌金融机构，通常具有良好的管理体系和治理机制，目前已经具备比较好的定性指标分析体系":
        "哪些持牌金融机构通常具有良好的管理体系、治理机制和比较好的定性指标分析体系？",
    "我国的金融衍生品": "我国的金融衍生品有哪些？",
    "投资基金的投资流程进行分析的角度都有": "分析投资基金的投资流程有哪些角度？",
    "黄金市场交易模式": "黄金市场的交易模式有哪些？",
}
# 人工兜底：题干原文 → 改后答案
ANSWER_OVERRIDES: dict[str, str] = {}


def rewrite_stem(s: str) -> str:
    if s in STEM_OVERRIDES:
        return STEM_OVERRIDES[s]
    t = s.strip()
    t = t.replace("【", "").replace("】", "")
    if t.endswith("？"):
        return t
    core = t
    if t.endswith("是指：") or t.endswith("是指:"):
        core = t[:-3]
        if len(core) > 12:
            return f"{core}，指的是什么？"
        return f"什么是{core}？"
    if t.endswith("包括：") or t.endswith("包括:"):
        core = t[:-3]
        return f"{core}包括哪些？"
    if t.endswith("种类：") or t.endswith("种类:"):
        core = t[:-3]
        return f"{core}有哪些种类？"
    if re.search(r"叫什么[：:]$", t):
        return t[:-1] + "？"
    if re.search(r"叫[：:]$", t):
        return t[:-1] + "什么？"
    if t.endswith("的定义：") or t.endswith("的定义:"):
        core = t[:-4]
        return f"{core}的定义是什么？"
    if t.endswith("的比较：") or t.endswith("的比较:"):
        core = t[:-4]
        return f"{core}有何区别？"
    if t.endswith("的关系：") or t.endswith("的关系:"):
        core = t[:-4]
        return f"{core}是什么关系？"
    if re.search(r"分为[：:]$", t):
        core = t[:-3]
        return f"{core}可以分为哪些？"
    if re.search(r"特点[：:]$", t):
        core = t[:-3]
        return f"{core}有哪些特点？"
    if re.search(r"有[：:]$", t):
        core = t[:-2]
        return f"{core}有哪些？"
    if t.endswith("：") or t.endswith(":"):
        core = t[:-1]
        # 短词条（无动词、长度短）按名词处理
        if len(core) <= 8 and not re.search(r"[是的为有叫分指]", core):
            return f"什么是{core}？"
        return core + "？"
    # 无尾冒号：裸词条 / 残缺句式
    if t.endswith("特点"):
        return t[:-2] + "有哪些特点？"
    if t.endswith("包括"):
        return t[:-2] + "包括哪些？"
    if t.endswith("分为"):
        return t[:-2] + "可以分为哪些？"
    if len(t) <= 10 and not re.search(r"[是的为有叫分指]", t):
        return f"什么是{t}？"
    return f"⚠️REVIEW⚠️ {t}"


def rewrite_answer(a: str, term: str = "") -> str:
    if not a:
        return a
    t = a.replace("\\n", "\n")
    t = t.replace("➡️", "→")
    # and 仅在中文字符之间替换
    t = re.sub(r"(?<=[\u4e00-\u9fff])and(?=[\u4e00-\u9fff])", "和", t)
    # 序号 1）2）/ 1. 2. / - → •
    lines = t.split("\n")
    out = []
    for ln in lines:
        ln = ln.strip()
        ln = re.sub(r"^\d+）\s*", "• ", ln)
        ln = re.sub(r"^\d+\)\s*", "• ", ln)
        ln = re.sub(r"^\d+\.\s*", "• ", ln)
        ln = re.sub(r"^-\s+", "• ", ln)
        out.append(ln)
    t = "\n".join(out).strip()
    # 名词题的答案以「是/指/由/也称」开头时，补上术语主语
    if term and len(term) <= 10 and re.match(r"^(是|指|由|也称)", t):
        t = term + t
    # 短答案补句号
    if len(t) <= 20 and not t.endswith(("。", "？", "！", "；")):
        t += "。"
    return t.replace("\n", "\\n")


def main() -> None:
    apply = "--apply" in sys.argv
    src = PATH.read_text(encoding="utf-8")
    recs = re.split(r"\n\s*\{\s*\n", src)
    report = []
    changed = 0
    out_recs = [recs[0]]
    for r in recs[1:]:
        def field(name):
            m = re.search(name + r': "((?:[^"\\]|\\.)*)"', r, re.S)
            return m.group(1) if m else None

        ch = field("chapter")
        stem = field("stem")
        ans = field("answer")
        if ch in DONE or stem is None:
            out_recs.append(r)
            continue
        new_stem = STEM_OVERRIDES.get(stem, None) or rewrite_stem(stem)
        # 名词题（短题干）把术语传给答案改写，用于补主语
        bare = stem.strip().replace("【", "").replace("】", "").rstrip("：:")
        term = bare if len(bare) <= 10 else ""
        new_ans = ANSWER_OVERRIDES.get(stem, None) or rewrite_answer(ans or "", term)
        if new_stem == stem and new_ans == (ans or ""):
            out_recs.append(r)
            continue
        changed += 1
        report.append(f"[{ch}]\n  Q- {stem}\n  Q+ {new_stem}\n  A- {(ans or '')[:100]}\n  A+ {new_ans[:100]}")
        r2 = r.replace(f'stem: "{stem}"', f'stem: "{new_stem}"', 1)
        if ans is not None and new_ans != ans:
            r2 = r2.replace(f'answer: "{ans}"', f'answer: "{new_ans}"', 1)
        out_recs.append(r2)
    Path("/tmp/rewrite-report.txt").write_text("\n\n".join(report), encoding="utf-8")
    print(f"改写 {changed} 条，报告见 /tmp/rewrite-report.txt")
    if apply:
        # 重新拼接：split 时吃掉了记录间的「\n  {\n」分隔符，原样补回
        PATH.write_text("\n  {\n".join(out_recs), encoding="utf-8")
        print("已写入 questions.ts")


if __name__ == "__main__":
    main()

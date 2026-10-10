import type { Question } from '@/data/questions'

/**
 * 题目 → 知识点 的关联规则（机制层）。
 * 渲染知识点页时，用 pointForQuestion 算出每题对应的知识点关键词，
 * 再以 pointTitle.includes(point) 匹配到当前知识点。
 * 扩充标注只需往 pointRules 里加规则，按「具体在前、宽泛在后」排序。
 */
export interface PointRule {
  /** 限定题目主题（q.theme），不填则不限制 */
  theme?: string
  /** 限定题目章节桶（q.chapter），不填则不限制 */
  chapter?: string
  /** 题干或答案中包含任一关键词即命中；空数组 = 主题内全部命中 */
  keywords: string[]
  /** 知识点标题包含此词即视为相关（要与 knowledge.ts 的 sub_header 对得上） */
  point: string
}

export const pointRules: PointRule[] = [
  // 债券市场
  { theme: '债券', keywords: ['国债', '政府债券'], point: '政府债券' },
  { theme: '债券', keywords: ['金融债'], point: '金融债券' },
  { theme: '债券', keywords: ['公司债', '企业债', '可转债', '可转换'], point: '公司债券' },
  { theme: '债券', keywords: ['国际债券', '外国债券', '欧洲债券', '武士债', '扬基债', '龙债券'], point: '国际债券' },
  // 外汇市场
  { theme: '外汇', keywords: ['即期'], point: '即期交易' },
  { theme: '外汇', keywords: ['远期', '升水', '贴水', '远期点'], point: '远期交易' },
  { theme: '外汇', keywords: ['期货'], point: '期货交易' },
  { theme: '外汇', keywords: ['期权'], point: '期权交易' },
  // 金融衍生品
  { theme: '期货和衍生品', keywords: ['远期合约', '远期'], point: '远期合约' },
  { theme: '期货和衍生品', keywords: ['期货合约', '保证金', '每日结算', '开仓', '平仓'], point: '期货合约' },
  { theme: '期货和衍生品', keywords: ['看涨', '看跌', '期权费', '执行价格', '行权'], point: '期权' },
  { theme: '期货和衍生品', keywords: ['互换', '掉期'], point: '互换' },
  { theme: '期货和衍生品', keywords: ['衍生品', '派生', '杠杆'], point: '基本概念' },
  // 贵金属市场（黄金主题仅 2 题，全部对黄金市场）
  { theme: '黄金', keywords: [], point: '黄金市场' },
  // 股票市场学习
  { theme: '股票', keywords: ['A股', 'B股', 'H股', 'N股', 'S股', '蓝筹股', '红筹', '创业板', '科创板', '按上市地点'], point: '股票的分类' },
  { theme: '股票', keywords: ['停牌', '摘牌', '集合竞价', '连续竞价', '涨跌幅', '二级市场', '交易所'], point: '核心要点总结' },
  // 金融工具概述
  { chapter: '概述', keywords: ['金融工具'], point: '定义' },
  { chapter: '概述', keywords: ['偿还期'], point: '偿还期' },
  { chapter: '概述', keywords: ['流动性'], point: '流动性' },
  { chapter: '概述', keywords: ['风险', '收益'], point: '四大特征' },
  { chapter: '概述', keywords: ['金融资产', '金融负债'], point: '关系理解' },
]

/** 返回题目关联的知识点关键词，无命中返回 null */
export function pointForQuestion(q: Question): string | null {
  for (const r of pointRules) {
    if (r.theme && q.theme !== r.theme) continue
    if (r.chapter && q.chapter !== r.chapter) continue
    if (r.keywords.length === 0) return r.point
    const text = q.stem + q.answer
    if (r.keywords.some((k) => text.includes(k))) return r.point
  }
  return null
}

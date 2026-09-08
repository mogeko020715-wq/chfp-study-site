import type { ReactNode } from 'react'
import ToolDefinitionDiagram from './ToolDefinition'
import ComparisonDiagram from './ComparisonDiagram'

/**
 * 知识点图解注册表：按「章节 + 知识点标题」匹配，命中即在知识点页展示图解并折叠原文。
 * 新增图解时在此添加一条映射即可；模板化的图解优先复用 ComparisonDiagram 等通用模板。
 */
export function diagramFor(chapterTitle: string, pointTitle: string): ReactNode | null {
  if (chapterTitle === '金融工具概述' && pointTitle.includes('定义')) {
    return <ToolDefinitionDiagram />
  }
  if (chapterTitle === '金融工具概述' && pointTitle.includes('偿还期')) {
    return (
      <ComparisonDiagram
        caption="图解 · 一个是时间本身，一个是能不能动"
        sides={[
          {
            name: '偿还期',
            tagline: '时间维度 · 我多久能拿回本金？',
            rows: [
              { label: '关注', value: '时间长度（多久到期）' },
              { label: '能否改变', value: '不能，合同签了就不变' },
              { label: '例子', value: '3 个月国债 → 3 个月后还本' },
            ],
          },
          {
            name: '流动性',
            tagline: '灵活维度 · 我现在急用能马上卖吗？',
            rows: [
              { label: '关注', value: '变现能力（能不能马上卖）' },
              { label: '能否改变', value: '受市场行情影响' },
              { label: '例子', value: '股票随时挂牌卖出（可能亏本）' },
            ],
          },
        ]}
        bottom="口诀：偿还期是「等多久」，流动性是「能不能不等」。"
      />
    )
  }
  return null
}

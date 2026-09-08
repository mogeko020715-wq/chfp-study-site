import type { KnowItem } from '@/data/knowledge'

function renderItem(item: KnowItem, numIdx: number) {
  const base = 'whitespace-pre-line leading-relaxed'
  switch (item.type) {
    case 'sub_header':
      return (
        <p className={`mt-5 font-semibold text-neutral-900 ${base}`}>{item.text}</p>
      )
    case 'sub_sub_header':
      return (
        <p className={`mt-3 text-sm font-semibold text-neutral-900 ${base}`}>{item.text}</p>
      )
    case 'callout':
      return (
        <div className={`my-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700 ${base}`}>
          {item.text}
        </div>
      )
    case 'bulleted_list':
      return (
        <p className={`${base} text-neutral-700 ${item.depth === 0 ? 'mt-1' : ''}`}
          style={{ paddingLeft: `${(item.depth + 1) * 1.1}rem`, textIndent: '-0.7rem' }}>
          <span className="text-neutral-400">· </span>
          {item.text}
        </p>
      )
    case 'numbered_list':
      return (
        <p className={`${base} mt-1 text-neutral-700`} style={{ paddingLeft: '1.1rem', textIndent: '-1.1rem' }}>
          <span className="text-neutral-400">{numIdx}. </span>
          {item.text}
        </p>
      )
    case 'quote':
      return (
        <p className={`mt-2 border-l-2 border-neutral-300 pl-3 text-neutral-600 italic ${base}`}>{item.text}</p>
      )
    case 'table':
    case 'table_row':
      return null // 由 renderItems 聚合成表格
    default:
      return (
        <p className={`mt-2 text-neutral-700 ${base}`}>{item.text}</p>
      )
  }
}

/** 将连续的 table/table_row 条目聚合渲染为表格，其余条目按原样渲染 */
export function renderNoteItems(items: KnowItem[]) {
  const out: React.ReactNode[] = []
  let num = 0
  let rows: string[][] = []
  const flushTable = (keyBase: number) => {
    if (rows.length === 0) return
    out.push(
      <table key={`t${keyBase}`} className="mt-3 w-full border-collapse text-sm">
        <tbody>
          {rows.map((cells, ri) => (
            <tr key={ri}>
              {cells.map((cell, ci) => (
                <td
                  key={ci}
                  className={`border border-neutral-200 px-2 py-1 align-top text-neutral-700 ${ri === 0 ? 'bg-neutral-50 font-medium' : ''}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
    rows = []
  }
  items.forEach((item, j) => {
    if (item.type === 'table') return // 表格开始标记，行数据在后续 table_row
    if (item.type === 'table_row') {
      rows.push(item.cells ?? [])
      return
    }
    flushTable(j)
    if (item.type === 'numbered_list') num += 1
    else if (item.type === 'sub_header') num = 0
    out.push(<div key={j}>{renderItem(item, num)}</div>)
  })
  flushTable(items.length)
  return out
}

// 教材页码（来自 Notion 章节标题）
export const chapterPages: Record<string, string> = {  金融工具概述: 'P90',
  货币市场: 'P91-93',
  股票市场学习: 'P94',
  债券市场: 'P99-103',
  外汇市场: 'P104',
  基金与证券投资基金: 'P105-108',
  金融衍生品: 'P109-112',
  贵金属市场: 'P111-112',
  商业银行: 'P113-116',
  证券公司: '专题',
  证券公司补充内容: '专题',
  保险公司: '专题',
}

export interface KnowledgePoint {
  title: string
  items: KnowItem[]
}

export interface ChapterSplit {
  intro: KnowItem[]
  points: KnowledgePoint[]
}

/** 按 sub_header 把章节笔记拆成知识点：首个 sub_header 之前的内容为导言 */
export function splitIntoPoints(items: KnowItem[]): ChapterSplit {
  const intro: KnowItem[] = []
  const points: KnowledgePoint[] = []
  let cur: KnowledgePoint | null = null
  for (const it of items) {
    if (it.type === 'sub_header') {
      cur = { title: it.text, items: [] }
      points.push(cur)
    } else if (cur) {
      cur.items.push(it)
    } else {
      intro.push(it)
    }
  }
  return { intro, points }
}

/** 章节 → 闪卡主题映射（有闪卡对应的章节才嵌入练习入口） */
export const chapterFlashGroup: Record<string, string> = {
  金融工具概述: '概述',
  债券市场: '债券',
  股票市场学习: '股票',
}

import { knowledgeChapters, type KnowItem } from '@/data/knowledge'

// 教材页码（来自 Notion 章节标题）
const pages: Record<string, string> = {
  金融工具概述: 'P90',
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
function renderItems(items: KnowItem[]) {
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

export default function ToolsRoadmap() {
  return (
    <section id="tools" className="scroll-mt-16 border-y border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">投资规划 · 金融工具学习路线</h2>
        <p className="mt-3 leading-relaxed text-neutral-600">
          12 章节知识点笔记同步自 Notion 主页面（2026-09-08）。点击章节展开完整笔记，配合下方闪卡记忆。
        </p>

        <ol className="mt-8 space-y-1">
          {knowledgeChapters.map((c, i) => (
            <li key={c.title}>
              <details className="group rounded-lg open:bg-white">
                <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white [&::-webkit-details-marker]:hidden">
                  <span className="w-6 shrink-0 text-right font-mono text-sm text-neutral-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-neutral-900">{c.title}</span>
                    <span className="mt-0.5 block text-sm text-neutral-500">
                      {pages[c.title] ?? ''} · {c.items.length} 条笔记
                    </span>
                  </span>
                </summary>
                <div className="px-6 pb-5 pt-1">{renderItems(c.items)}</div>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

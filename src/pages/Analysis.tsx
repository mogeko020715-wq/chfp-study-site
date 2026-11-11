import { useMemo } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, ArrowRight, BarChart3, FileText } from 'lucide-react'
import { useFeed } from '@/data/feed'
import { useArchive } from '@/data/archive'
import Nav from '@/sections/Nav'
import Footer from '@/sections/Footer'
import { useMastered } from '@/hooks/useMastered'

/** A股配色习惯：涨红跌绿 */
function PctText({ pct }: { pct: number }) {
  const cls = pct > 0 ? 'text-red-600' : pct < 0 ? 'text-green-600' : 'text-neutral-500'
  return (
    <span className={`font-mono ${cls}`}>
      {pct > 0 ? '+' : ''}
      {pct.toFixed(2)}%
    </span>
  )
}

function TickCell({ tick }: { tick?: { close: number; pct: number } }) {
  if (!tick) return <td className="px-3 py-2 text-sm text-neutral-300">—</td>
  return (
    <td className="px-3 py-2 text-sm">
      <span className="font-mono text-neutral-800">{tick.close}</span>{' '}
      <PctText pct={tick.pct} />
    </td>
  )
}

export default function AnalysisPage() {
  const { feed, error: feedErr } = useFeed()
  const { archive, error: arcErr } = useArchive()
  const { count } = useMastered()

  const records = archive?.records ?? []
  const latest = [...records].reverse()

  // 板块热度矩阵：按出现总天数取前 8 个板块，列为最近 10 个交易日
  const heat = useMemo(() => {
    const cols = latest.slice(0, 10).map((r) => r.date).sort()
    const freq = new Map<string, number>()
    for (const r of records) {
      for (const n of r.boardsUp) freq.set(n, (freq.get(n) ?? 0) + 1)
      for (const n of r.boardsDown) freq.set(n, (freq.get(n) ?? 0) + 1)
    }
    const rows = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
    return { cols, rows }
  }, [records, latest])

  const dailyDays = new Set((feed?.daily ?? []).map((d) => d.date)).size

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <Nav masteredCount={count} />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-20 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回学习框架
        </Link>

        <div className="mt-6 flex items-baseline justify-between gap-4">
          <h1 className="text-title sm:text-3xl">数据复盘</h1>
          {archive?.meta.updatedAt && (
            <span className="shrink-0 text-sm text-neutral-400">
              更新于 {archive.meta.updatedAt.slice(0, 16).replace('T', ' ')}
            </span>
          )}
        </div>
        <p className="text-body mt-3">
          所有日报 / 周报 / 季报的归档索引，加上行情数据的表格视图——报告看叙事，这里查数据。
        </p>

        {/* ===== 报告归档 ===== */}
        <h2 className="text-section mt-10 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          报告归档
        </h2>
        {feedErr && <p className="text-caption mt-2">feed.json 暂时不可用。</p>}
        {feed && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Link to="/news" className="card hover-lift px-5 py-4">
              <p className="text-sm text-neutral-500">日报</p>
              <p className="mt-1 text-2xl font-bold text-neutral-900">{feed.daily.length}</p>
              <p className="text-caption mt-1">覆盖 {dailyDays} 个交易日 · 近 14 天滚动</p>
            </Link>
            <Link to="/news" className="card hover-lift px-5 py-4">
              <p className="text-sm text-neutral-500">周报</p>
              <p className="mt-1 text-2xl font-bold text-neutral-900">{feed.weekly.length}</p>
              <p className="text-caption mt-1">
                {feed.weekly.map((w) => w.week.split('（')[0]).join(' / ')}
              </p>
            </Link>
            <Link to="/news" className="card hover-lift px-5 py-4">
              <p className="text-sm text-neutral-500">季报</p>
              <p className="mt-1 text-2xl font-bold text-neutral-900">{feed.quarterly.length}</p>
              <p className="text-caption mt-1">
                {feed.quarterly.length > 0
                  ? feed.quarterly.map((q) => q.quarter).join(' / ')
                  : '季度末自动生成'}
              </p>
            </Link>
          </div>
        )}

        {/* ===== 大类资产收盘表 ===== */}
        <h2 className="text-section mt-12 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          大类资产收盘
        </h2>
        <p className="text-caption mt-1">
          数据每日 17:07 自动归档，只增不淘汰；红色为上涨、绿色为下跌。
        </p>
        {arcErr && <p className="text-caption mt-2">archive.json 暂时不可用。</p>}
        {records.length > 0 && (
          <div className="card mt-4 overflow-x-auto">
            <table className="w-full border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-xs text-neutral-400">
                  <th className="px-3 py-2 font-medium">日期</th>
                  <th className="px-3 py-2 font-medium">上证指数</th>
                  <th className="px-3 py-2 font-medium">黄金ETF</th>
                  <th className="px-3 py-2 font-medium">USDCNY</th>
                </tr>
              </thead>
              <tbody>
                {latest.map((r) => (
                  <tr key={r.date} className="border-b border-neutral-100 last:border-0">
                    <td className="px-3 py-2 font-mono text-sm text-neutral-600">
                      {r.date}
                      {r.intraday && (
                        <span className="ml-1 rounded bg-neutral-100 px-1 text-xs text-neutral-500">
                          盘中
                        </span>
                      )}
                    </td>
                    <TickCell tick={r.index} />
                    <TickCell tick={r.gold} />
                    <TickCell tick={r.fx} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== 板块热度矩阵 ===== */}
        <h2 className="text-section mt-12">板块热度矩阵</h2>
        <p className="text-caption mt-1">
          板块进入当日领涨/领跌前三的次数：↑ 领涨（红）、↓ 领跌（绿）。一眼看出轮动主线。
        </p>
        {heat.rows.length > 0 && (
          <div className="card mt-4 overflow-x-auto">
            <table className="w-full border-collapse whitespace-nowrap text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-xs text-neutral-400">
                  <th className="px-3 py-2 font-medium">板块</th>
                  {heat.cols.map((c) => (
                    <th key={c} className="px-2 py-2 text-center font-mono font-medium">
                      {c.slice(5)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heat.rows.map(([name, total]) => (
                  <tr key={name} className="border-b border-neutral-100 last:border-0">
                    <td className="px-3 py-2 font-medium text-neutral-900">
                      {name}
                      <span className="ml-1 text-xs text-neutral-400">×{total}</span>
                    </td>
                    {heat.cols.map((c) => {
                      const rec = records.find((r) => r.date === c)
                      const up = rec?.boardsUp.includes(name)
                      const down = rec?.boardsDown.includes(name)
                      return (
                        <td key={c} className="px-2 py-2 text-center">
                          {up && <span className="text-red-600">↑</span>}
                          {down && <span className="text-green-600">↓</span>}
                          {!up && !down && <span className="text-neutral-200">·</span>}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Link
          to="/news"
          className="mt-10 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900"
        >
          去看带解读的日报 / 周报 / 季报
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </main>
      <Footer />
    </div>
  )
}

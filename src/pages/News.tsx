import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, BookOpenCheck, ExternalLink, Newspaper, AlertTriangle } from 'lucide-react'
import { useFeed, type FeedDaily, type FeedWeekly, type FeedQuarterly } from '@/data/feed'
import Nav from '@/sections/Nav'
import Footer from '@/sections/Footer'
import { useMastered } from '@/hooks/useMastered'
import { questions } from '@/data/questions'

type Tab = 'daily' | 'weekly' | 'quarterly'

const TABS: { key: Tab; label: string }[] = [
  { key: 'daily', label: '日报' },
  { key: 'weekly', label: '周报' },
  { key: 'quarterly', label: '季报' },
]

function SampleBadge() {
  return (
    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">示例数据</span>
  )
}

function ModuleTag({ name }: { name: string }) {
  return (
    <Link
      to={`/module/${encodeURIComponent(name)}`}
      className="rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 text-xs text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900"
    >
      {name}
    </Link>
  )
}

function DailyCard({ d }: { d: FeedDaily }) {
  return (
    <article className="card px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium leading-snug text-neutral-900">{d.title}</h3>
        {d.sample && <SampleBadge />}
      </div>
      <p className="text-body mt-2 text-[0.9375rem]">{d.summary}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600">
          {d.category}
        </span>
        {d.modules.map((m) => (
          <ModuleTag key={m} name={m} />
        ))}
      </div>
      {d.points.length > 0 && (
        <p className="mt-2 text-xs leading-relaxed text-neutral-400">📌 {d.points.join('；')}</p>
      )}
      <p className="mt-2 text-xs text-neutral-400">
        来源：{d.source}
        {d.dataDate && ` · 数据日 ${d.dataDate}`}
        {d.sourceUrl && (
          <a
            href={d.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-1 inline-flex items-center gap-0.5 hover:text-neutral-900"
          >
            原文 <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </p>
    </article>
  )
}

function WeeklyCard({ w }: { w: FeedWeekly }) {
  return (
    <article className="card px-5 py-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-section">考情周报 · {w.week}</h3>
        {w.sample && <SampleBadge />}
      </div>

      {w.board && w.board.length > 0 && (
        <>
          <h4 className="mt-5 flex items-center gap-1.5 text-sm font-medium text-neutral-900">
            📊 本周板块涨跌榜
          </h4>
          <table className="mt-2 w-full border-collapse text-sm">
            <tbody>
              {w.board.map((b) => (
                <tr key={b.name}>
                  <td className="border-b border-neutral-100 py-1.5 pr-2 font-medium text-neutral-900">
                    {b.name}
                  </td>
                  <td
                    className={`w-20 shrink-0 border-b border-neutral-100 py-1.5 text-right font-mono ${
                      b.change.startsWith('+')
                        ? 'text-red-600'
                        : b.change.startsWith('-') || b.change.startsWith('−')
                          ? 'text-green-600'
                          : 'text-neutral-600'
                    }`}
                  >
                    {b.change}
                  </td>
                  {b.note && (
                    <td className="border-b border-neutral-100 py-1.5 pl-3 text-neutral-500">
                      {b.note}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h4 className="mt-5 flex items-center gap-1.5 text-sm font-medium text-neutral-900">
        <Newspaper className="h-4 w-4" /> 本周要闻回顾
      </h4>
      <ol className="mt-2 space-y-1.5">
        {w.highlights.map((h, i) => (
          <li key={i} className="text-body flex gap-2 text-[0.9375rem]">
            <span className="shrink-0 text-neutral-400">{i + 1}.</span>
            <span>{h}</span>
          </li>
        ))}
      </ol>

      <h4 className="mt-6 flex items-center gap-1.5 text-sm font-medium text-neutral-900">
        <BookOpenCheck className="h-4 w-4" /> 这条考什么
      </h4>
      <div className="mt-2 space-y-3">
        {w.examLinks.map((e, i) => (
          <div key={i} className="rounded-lg bg-neutral-50 px-4 py-3">
            <p className="text-sm font-medium text-neutral-900">
              {e.news}
              <span className="ml-2 text-xs font-normal text-neutral-400">对应：{e.point}</span>
            </p>
            <p className="text-body mt-1 text-sm">{e.why}</p>
          </div>
        ))}
      </div>

      <h4 className="mt-6 text-sm font-medium text-neutral-900">✏️ 小测一下</h4>
      <div className="mt-2 rounded-lg border border-neutral-200 px-4 py-3">
        <p className="text-[0.9375rem] leading-relaxed text-neutral-800">{w.quiz.question}</p>
        <ul className="mt-2 space-y-1">
          {w.quiz.options.map((o) => (
            <li key={o} className="text-sm text-neutral-600">
              {o}
            </li>
          ))}
        </ul>
        <details className="mt-2">
          <summary className="text-caption cursor-pointer list-none hover:text-neutral-900 [&::-webkit-details-marker]:hidden">
            查看答案与解析 →
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700">
            <span className="font-medium text-neutral-900">答案：{w.quiz.answer}</span>
            <br />
            {w.quiz.explain}
          </p>
        </details>
      </div>

      {w.nextWeek && w.nextWeek.length > 0 && (
        <>
          <h4 className="mt-6 text-sm font-medium text-neutral-900">🔭 下周关注</h4>
          <ul className="mt-2 space-y-1">
            {w.nextWeek.map((n, i) => (
              <li key={i} className="text-sm text-neutral-600">
                · {n}
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  )
}

function QuarterlyCard({ q }: { q: FeedQuarterly }) {
  return (
    <article className="card px-5 py-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-section">考情季报 · {q.quarter}</h3>
        {q.sample && <SampleBadge />}
      </div>
      {q.trends.length > 0 && (
        <>
          <h4 className="mt-5 text-sm font-medium text-neutral-900">季度趋势</h4>
          <ul className="mt-2 space-y-1.5">
            {q.trends.map((t, i) => (
              <li key={i} className="text-body text-[0.9375rem]">
                · {t}
              </li>
            ))}
          </ul>
        </>
      )}
      {q.textbookAlerts.length > 0 && (
        <>
          <h4 className="mt-6 flex items-center gap-1.5 text-sm font-medium text-neutral-900">
            <AlertTriangle className="h-4 w-4 text-amber-600" /> 教材口径提示
          </h4>
          <div className="mt-2 space-y-3">
            {q.textbookAlerts.map((a, i) => (
              <div key={i} className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm font-medium text-amber-900">{a.topic}</p>
                <p className="mt-1 text-sm text-amber-900/80">教材：{a.textbook}</p>
                <p className="mt-1 text-sm text-amber-900/80">现实：{a.reality}</p>
                <p className="mt-1 text-sm font-medium text-amber-900">考试口径：{a.examNote}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  )
}

export default function NewsPage() {
  const { feed, error } = useFeed()
  const { count } = useMastered(questions.length)
  const [tab, setTab] = useState<Tab>('daily')

  const dailyByDate = useMemo(() => {
    const groups = new Map<string, FeedDaily[]>()
    for (const d of feed?.daily ?? []) {
      const arr = groups.get(d.date) ?? []
      arr.push(d)
      groups.set(d.date, arr)
    }
    return [...groups.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1))
  }, [feed])

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
          <h1 className="text-title sm:text-3xl">行业资讯 · 考情雷达</h1>
          {feed && <span className="shrink-0 text-sm text-neutral-400">更新于 {feed.meta.updatedAt.slice(0, 16).replace('T', ' ')}</span>}
        </div>
        <p className="text-body mt-3">
          每天扫一眼政策与市场动态，每条都挂上对应的课程板块——新闻即教材。板块标签可直接点进导学页。
        </p>

        <div className="mt-6 flex gap-2 border-b border-neutral-200">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm transition-colors ${
                tab === t.key
                  ? 'border-b-2 border-neutral-900 font-medium text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {error && (
            <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center">
              <p className="text-neutral-600">资讯数据暂时不可用</p>
              <p className="mt-1 text-sm text-neutral-500">feed.json 缺失或格式错误，请稍后再试。</p>
            </div>
          )}

          {!error && tab === 'daily' && (
            <>
              {dailyByDate.length === 0 && (
                <p className="py-10 text-center text-neutral-500">今日暂无更新</p>
              )}
              {dailyByDate.map(([date, items]) => (
                <section key={date}>
                  <h2 className="text-caption mt-6 font-mono first:mt-0">{date}</h2>
                  <div className="mt-2 space-y-3">
                    {items.map((d) => (
                      <DailyCard key={d.id} d={d} />
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}

          {!error && tab === 'weekly' && (
            <>
              {(feed?.weekly.length ?? 0) === 0 && (
                <p className="py-10 text-center text-neutral-500">
                  第一份周报生成中——每周日晚自动汇总本周日报。
                </p>
              )}
              <div className="space-y-4">
                {feed?.weekly.map((w) => <WeeklyCard key={w.id} w={w} />)}
              </div>
            </>
          )}

          {!error && tab === 'quarterly' && (
            <>
              {(feed?.quarterly.length ?? 0) === 0 && (
                <p className="py-10 text-center text-neutral-500">
                  季报随季度末自动生成，包含趋势梳理与「教材口径提示」。
                </p>
              )}
              <div className="space-y-4">
                {feed?.quarterly.map((q) => <QuarterlyCard key={q.id} q={q} />)}
              </div>
            </>
          )}
        </div>

        <p className="mt-10 text-center text-sm text-neutral-400">
          💡 这条资讯让你想到哪个考点？后续将支持从资讯一键跳到对应闪卡。
        </p>
      </main>
      <Footer />
    </div>
  )
}

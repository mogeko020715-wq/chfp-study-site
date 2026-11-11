import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, LayoutGrid, Route } from 'lucide-react'
import { modules, totalQuestions } from '@/data/course'
import { knowledgeChapters } from '@/data/knowledge'
import { curriculumStoryline, guideFor } from '@/data/guides'
import { QUESTION_COUNT } from '@/data/questionMeta'

const CONTENT_MODULE = '投资规划'

type View = 'story' | 'grid'

/** 课程框架：同一块内容，「一条线串讲」与「板块卡片」两种看法切换 */
export default function Curriculum() {
  const [view, setView] = useState<View>('story')

  return (
    <section id="framework" className="mx-auto max-w-3xl scroll-mt-16 px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-title">六大课程板块</h2>
        <div
          role="tablist"
          aria-label="课程框架视图切换"
          className="flex rounded-full border border-neutral-300 p-0.5"
        >
          {(
            [
              ['story', '一条线串讲', Route],
              ['grid', '板块卡片', LayoutGrid],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={view === key}
              onClick={() => setView(key)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm transition-colors ${
                view === key
                  ? 'bg-neutral-900 font-medium text-white'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-body mt-3">
        {view === 'story'
          ? '这六门课不是孤立的。把它们想象成给一个普通家庭做财务规划的标准流程，顺序和道理就都顺了：'
          : '点击板块进入导学：先用大白话把框架立起来，再往下钻章节笔记和闪卡。题量越大，越是复习的主战场。'}
      </p>

      {view === 'story' ? (
        <>
          <ol className="mt-8 space-y-0">
            {curriculumStoryline.map((s, i) => (
              <li key={s.module} className="relative flex gap-4 pb-5 last:pb-0">
                {i < curriculumStoryline.length - 1 && (
                  <span className="absolute left-[19px] top-11 h-[calc(100%-3rem)] w-px bg-neutral-200" />
                )}
                <span
                  aria-hidden="true"
                  className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-lg"
                >
                  {s.icon}
                </span>
                <div className="min-w-0 pt-1.5">
                  <p className="font-medium text-neutral-900">
                    <span className="mr-2 text-neutral-400">{s.role}</span>
                    {s.module}
                  </p>
                  <p className="text-body mt-1 text-[0.9375rem]">{s.plain}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="card hover-lift mt-8 flex items-center justify-between gap-3 bg-neutral-50 px-5 py-4">
            <p className="text-sm text-neutral-600">
              <span aria-hidden="true">💡 </span>复习时建议跟着这条线走：先框架、再笔记、后刷题。每个板块页顶部都有同款导学。
            </p>
            <Link
              to="/module/投资规划"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-neutral-900 hover:underline"
            >
              看一个样板
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </>
      ) : (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {modules.map((m) => {
            const pct = Math.round((m.questions / totalQuestions) * 100)
            const hasContent = m.name === CONTENT_MODULE
            const guide = guideFor(m.name)
            return (
              <Link
                key={m.name}
                to={`/module/${encodeURIComponent(m.name)}`}
                className="card hover-lift group block p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium text-neutral-900">{m.name}</h3>
                  <ArrowRight className="h-4 w-4 shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-900" />
                </div>
                {guide && (
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-neutral-500">
                    {guide.tagline}
                  </p>
                )}
                <p className="mt-2 text-sm text-neutral-400">
                  {m.chapters.length > 0 ? `${m.chapters.length} 章 · ` : ''}
                  {m.questions} 题 · 权重 {pct}%
                  {hasContent && ` · 已收录 ${knowledgeChapters.length} 章笔记 / ${QUESTION_COUNT} 张闪卡`}
                </p>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full rounded-full bg-neutral-800" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}

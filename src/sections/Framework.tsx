import { Link } from 'react-router'
import { modules, totalQuestions } from '@/data/course'
import { knowledgeChapters } from '@/data/knowledge'
import { questions } from '@/data/questions'
import { ArrowRight } from 'lucide-react'

const CONTENT_MODULE = '投资规划'

export default function Framework() {
  return (
    <section id="framework" className="mx-auto max-w-3xl scroll-mt-16 px-4 py-14 sm:px-6">
      <h2 className="text-title">六大课程板块</h2>
      <p className="text-body mt-3">
        点击板块进入章节视图。题量越大，越是复习的主战场；进度条表示该板块在总习题量中的权重。
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {modules.map((m) => {
          const pct = Math.round((m.questions / totalQuestions) * 100)
          const hasContent = m.name === CONTENT_MODULE
          return (
            <Link
              key={m.name}
              to={`/module/${encodeURIComponent(m.name)}`}
              className="card hover-lift group flex items-start justify-between gap-3 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium text-neutral-900">{m.name}</h3>
                <ArrowRight className="h-4 w-4 shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-900" />
              </div>
              <p className="mt-1.5 text-sm text-neutral-500">
                {m.chapters.length > 0 ? `${m.chapters.length} 章 · ` : ''}
                {m.questions} 题 · 权重 {pct}%
              </p>
              {hasContent && (
                <p className="mt-1 text-sm text-neutral-500">
                  {knowledgeChapters.length} 章笔记 · {questions.length} 张闪卡已收录
                </p>
              )}
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full rounded-full bg-neutral-800" style={{ width: `${pct}%` }} />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

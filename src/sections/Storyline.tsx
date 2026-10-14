import { Link } from 'react-router'
import { ArrowRight, Route } from 'lucide-react'
import { curriculumStoryline } from '@/data/guides'

/** 全课主线：把六大板块串成一个理财规划师服务一家人的流程 */
export default function Storyline() {
  return (
    <section className="mx-auto max-w-3xl scroll-mt-16 px-4 py-14 sm:px-6">
      <h2 className="text-title flex items-center gap-2">
        <Route className="h-5 w-5" />
        先把六大板块串成一条线
      </h2>
      <p className="text-body mt-3">
        这六门课不是孤立的。把它们想象成给一个普通家庭做财务规划的标准流程，顺序和道理就都顺了：
      </p>

      <ol className="mt-8 space-y-0">
        {curriculumStoryline.map((s, i) => (
          <li key={s.module} className="relative flex gap-4 pb-6 last:pb-0">
            {i < curriculumStoryline.length - 1 && (
              <span className="absolute left-[19px] top-11 h-[calc(100%-3rem)] w-px bg-neutral-200" />
            )}
            <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-lg">
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
          💡 复习时建议跟着这条线走：先框架、再笔记、后刷题。每个板块页顶部都有同款导学。
        </p>
        <Link
          to="/module/投资规划"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-neutral-900 hover:underline"
        >
          看一个样板
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  )
}

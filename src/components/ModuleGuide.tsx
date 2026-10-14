import { Link } from 'react-router'
import { ArrowDown, Compass, Lightbulb, ListOrdered, Map, Sparkles } from 'lucide-react'
import type { ModuleGuide } from '@/data/guides'

/** 板块导学：先用大白话把“这是什么、为什么学、知识怎么串”讲清楚，再往下钻细节 */
export default function ModuleGuideView({ guide }: { guide: ModuleGuide }) {
  return (
    <div className="mt-10 space-y-12">
      {/* 一句话定位 */}
      <section className="reading-col">
        <p className="text-body text-lg leading-relaxed">{guide.tagline}</p>
      </section>

      {/* 为什么学：生活场景 */}
      <section className="card bg-neutral-50 px-5 py-4">
        <p className="flex items-center gap-1.5 text-sm font-medium text-neutral-900">
          <Lightbulb className="h-4 w-4" />
          {guide.scenario.title}
        </p>
        <p className="text-body mt-2 text-[0.9375rem]">{guide.scenario.body}</p>
      </section>

      {/* 知识框架：分层结构图 */}
      <section>
        <h2 className="text-section flex items-center gap-2">
          <Map className="h-5 w-5" />
          知识框架
        </h2>
        <p className="text-caption mt-1">先看清板块内部的层次，再逐个章节击破。</p>
        <div className="mt-6">
          {guide.framework.map((layer, i) => (
            <div key={layer.title}>
              {i > 0 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-4 w-4 text-neutral-300" />
                </div>
              )}
              <div className="card px-5 py-4">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-medium text-neutral-900">
                    {layer.title}
                    {layer.subtitle && (
                      <span className="text-neutral-400"> · {layer.subtitle}</span>
                    )}
                  </span>
                </div>
                <ul className="mt-2.5 grid gap-2 sm:grid-cols-2">
                  {layer.nodes.map((n) => (
                    <li key={n.label} className="min-w-0">
                      <span className="block text-sm font-medium text-neutral-800">{n.label}</span>
                      {n.note && <span className="mt-0.5 block text-sm text-neutral-500">{n.note}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        {guide.frameworkNote && (
          <p className="text-caption mt-3 flex items-start gap-1.5">
            <Compass className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {guide.frameworkNote}
          </p>
        )}
      </section>

      {/* 学习路径 */}
      <section>
        <h2 className="text-section flex items-center gap-2">
          <ListOrdered className="h-5 w-5" />
          推荐学习路径
        </h2>
        <p className="text-caption mt-1">按这个顺序走，后面的章节会用到前面的概念。</p>
        <ol className="mt-6 space-y-0">
          {guide.path.map((step, i) => (
            <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
              {/* 竖线 */}
              {i < guide.path.length - 1 && (
                <span className="absolute left-[13px] top-8 h-[calc(100%-2rem)] w-px bg-neutral-200" />
              )}
              <span className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white font-mono text-xs text-neutral-600">
                {i + 1}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="font-medium text-neutral-900">{step.title}</p>
                <p className="text-body mt-1 text-[0.9375rem]">{step.why}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 核心概念预习 */}
      <section>
        <h2 className="text-section flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          核心概念预习
        </h2>
        <p className="text-caption mt-1">先用大白话认一遍脸，读笔记和刷题时就不陌生了。</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {guide.concepts.map((c) => (
            <div key={c.term} className="card px-4 py-3.5">
              <p className="font-medium text-neutral-900">{c.term}</p>
              <p className="text-body mt-1 text-sm">{c.plain}</p>
              {c.tip && <p className="mt-1.5 text-xs text-neutral-400">💡 {c.tip}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* 考试提示 */}
      <section className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <p className="text-sm font-medium text-amber-900">🎯 复习提示</p>
        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-amber-900/80">{guide.examTip}</p>
      </section>

      {/* 深入入口 */}
      <p className="text-center text-sm text-neutral-400">
        框架清楚了？往下进入
        <Link to="#chapters" className="text-neutral-600 underline underline-offset-4 hover:text-neutral-900">
          章节笔记
        </Link>
        ，或者回到
        <Link to="/" className="text-neutral-600 underline underline-offset-4 hover:text-neutral-900">
          全课主线
        </Link>
        看看别的板块。
      </p>
    </div>
  )
}

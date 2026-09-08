import { Link, useParams } from 'react-router'
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'
import { modules, totalQuestions, type CourseModule } from '@/data/course'
import { knowledgeChapters } from '@/data/knowledge'
import { chapterPages } from '@/components/ChapterNotes'
import Nav from '@/sections/Nav'
import Footer from '@/sections/Footer'
import { useMastered } from '@/hooks/useMastered'
import { questions } from '@/data/questions'

/** 拥有知识点笔记与闪卡的板块 */
const MODULE_WITH_CONTENT = '投资规划'

function ModuleHeader({ m }: { m: CourseModule }) {
  const pct = Math.round((m.questions / totalQuestions) * 100)
  return (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-title sm:text-3xl">{m.name}</h1>
        <span className="shrink-0 text-sm text-neutral-500">
          {m.questions} 题 · 权重 {pct}%
        </span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-neutral-100">
        <div className="h-full rounded-full bg-neutral-800" style={{ width: `${pct}%` }} />
      </div>
      {m.chapters.length > 0 && (
        <p className="mt-3 text-sm leading-relaxed text-neutral-500">{m.chapters.join(' · ')}</p>
      )}
      {m.note && <p className="mt-1 text-sm text-neutral-500">{m.note}</p>}
    </>
  )
}

function ChapterList() {
  const { count } = useMastered(questions.length)
  return (
    <>
      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-section">章节笔记</h2>
        <Link
          to="/flashcards"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900"
        >
          本章闪卡已掌握 {count} / {questions.length}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <p className="mt-1 text-sm text-neutral-500">
        {knowledgeChapters.length} 章 · {knowledgeChapters.reduce((s, c) => s + c.items.length, 0)} 条笔记，同步自
        Notion 学习库（2026-09-08）。点击章节进入知识点列表。
      </p>

      <ol className="mt-6 space-y-2">
        {knowledgeChapters.map((c, i) => (
          <li key={c.title}>
            <Link
              to={`/module/${encodeURIComponent(MODULE_WITH_CONTENT)}/chapter/${encodeURIComponent(c.title)}`}
              className="card hover-lift group flex items-center gap-3 px-4 py-3.5"
            >
              <span className="w-6 shrink-0 text-right font-mono text-sm text-neutral-400">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-neutral-900">{c.title}</span>
                <span className="mt-0.5 block text-sm text-neutral-500">
                  {chapterPages[c.title] ?? ''} · {c.items.length} 条笔记
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-900" />
            </Link>
          </li>
        ))}
      </ol>
    </>
  )
}

export default function ModulePage() {
  const { name = '' } = useParams()
  const m = modules.find((x) => x.name === name)
  const { count } = useMastered(questions.length)

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

        {m ? (
          <>
            <div className="mt-6">
              <ModuleHeader m={m} />
            </div>
            {m.name === MODULE_WITH_CONTENT ? (
              <ChapterList />
            ) : (
              <div className="mt-10 rounded-xl border border-dashed border-neutral-300 p-10 text-center">
                <BookOpen className="mx-auto h-6 w-6 text-neutral-400" />
                <p className="mt-3 text-neutral-600">该板块笔记尚未同步到本站</p>
                <p className="mt-1 text-sm text-neutral-500">
                  当前仅「{MODULE_WITH_CONTENT}」板块收录了章节笔记与闪卡，其余板块内容正在整理中。
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="mt-10 text-neutral-600">未找到该板块，请从首页进入。</p>
        )}
      </main>
      <Footer />
    </div>
  )
}

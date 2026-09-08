import { Link, useParams } from 'react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { knowledgeChapters } from '@/data/knowledge'
import { renderNoteItems, splitIntoPoints, chapterPages } from '@/components/ChapterNotes'
import Nav from '@/sections/Nav'
import Footer from '@/sections/Footer'
import { useMastered } from '@/hooks/useMastered'
import { questions } from '@/data/questions'

export default function ChapterPage() {
  const { title = '' } = useParams()
  const ch = knowledgeChapters.find((c) => c.title === title)
  const { count } = useMastered(questions.length)

  if (!ch) {
    return (
      <div className="min-h-screen bg-white text-neutral-900 antialiased">
        <Nav masteredCount={count} />
        <main className="mx-auto max-w-3xl px-4 pb-20 pt-20 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900">
            <ArrowLeft className="h-3.5 w-3.5" />
            返回学习框架
          </Link>
          <p className="mt-10 text-neutral-600">未找到该章节，请从板块页进入。</p>
        </main>
        <Footer />
      </div>
    )
  }

  const { intro, points } = splitIntoPoints(ch.items)

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <Nav masteredCount={count} />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-20 sm:px-6">
        <Link
          to={`/module/${encodeURIComponent('投资规划')}`}
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回投资规划
        </Link>

        <h1 className="text-title mt-6 sm:text-3xl">{ch.title}</h1>
        <p className="text-caption mt-2">
          {chapterPages[ch.title] ?? ''} · {ch.items.length} 条笔记
          {points.length > 0 && ` · ${points.length} 个知识点`} · 同步自 Notion 学习库（2026-09-08）
        </p>

        {intro.length > 0 && (
          <div className="card mt-6 bg-neutral-50 px-5 py-4">
            {renderNoteItems(intro)}
          </div>
        )}

        {points.length > 0 ? (
          <ol className="mt-8 space-y-2">
            {points.map((p, i) => (
              <li key={i}>
                <Link
                  to={`/module/${encodeURIComponent('投资规划')}/chapter/${encodeURIComponent(ch.title)}/point/${i}`}
                  className="card hover-lift group flex items-center gap-3 px-4 py-3.5"
                >
                  <span className="w-6 shrink-0 text-right font-mono text-sm text-neutral-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1 font-medium text-neutral-900">{p.title}</span>
                  <span className="shrink-0 text-sm text-neutral-500">{p.items.length} 条</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-900" />
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="card mt-8 px-5 py-4">{renderNoteItems(ch.items)}</div>
        )}
      </main>
      <Footer />
    </div>
  )
}

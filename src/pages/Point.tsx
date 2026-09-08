import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { knowledgeChapters } from '@/data/knowledge'
import { renderNoteItems, splitIntoPoints, chapterFlashGroup } from '@/components/ChapterNotes'
import { diagramFor } from '@/components/diagrams'
import FlashcardEmbed from '@/components/FlashcardEmbed'
import Nav from '@/sections/Nav'
import Footer from '@/sections/Footer'
import { useMastered } from '@/hooks/useMastered'
import { questions } from '@/data/questions'

const MODULE_NAME = '投资规划'

export default function PointPage() {
  const { title = '', idx = '0' } = useParams()
  const ch = knowledgeChapters.find((c) => c.title === title)
  const { count } = useMastered(questions.length)

  const split = ch ? splitIntoPoints(ch.items) : null
  const pi = Number.parseInt(idx, 10)
  const point = split && pi >= 0 && pi < split.points.length ? split.points[pi] : null

  if (!ch || !point) {
    return (
      <div className="min-h-screen bg-white text-neutral-900 antialiased">
        <Nav masteredCount={count} />
        <main className="mx-auto max-w-3xl px-4 pb-20 pt-20 sm:px-6">
          <Link
            to={`/module/${encodeURIComponent(MODULE_NAME)}`}
            className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            返回投资规划
          </Link>
          <p className="mt-10 text-neutral-600">未找到该知识点，请从章节页进入。</p>
        </main>
        <Footer />
      </div>
    )
  }

  const group = chapterFlashGroup[ch.title]
  const diagram = diagramFor(ch.title, point.title)
  const prev = pi > 0 ? pi - 1 : null
  const next = pi < split!.points.length - 1 ? pi + 1 : null
  const chapterBase = `/module/${encodeURIComponent(MODULE_NAME)}/chapter/${encodeURIComponent(ch.title)}`

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <Nav masteredCount={count} />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-20 sm:px-6">
        <nav className="flex items-center gap-1 text-sm text-neutral-500">
          <Link to="/" className="hover:text-neutral-900">
            学习框架
          </Link>
          <span className="text-neutral-300">/</span>
          <Link to={`/module/${encodeURIComponent(MODULE_NAME)}`} className="hover:text-neutral-900">
            {MODULE_NAME}
          </Link>
          <span className="text-neutral-300">/</span>
          <Link to={chapterBase} className="hover:text-neutral-900">
            {ch.title}
          </Link>
        </nav>

        <h1 className="text-title mt-6 sm:text-3xl">{point.title}</h1>
        <p className="text-caption mt-2">
          {ch.title} · 第 {pi + 1} / {split!.points.length} 个知识点 · {point.items.length} 条笔记
        </p>

        <div className="reading-col mt-6">
          {diagramFor(ch.title, point.title)}
          {diagram ? (
            <details className="mt-4">
              <summary className="text-caption cursor-pointer list-none hover:text-neutral-900 [&::-webkit-details-marker]:hidden">
                查看原始笔记（{point.items.length} 条）
              </summary>
              <div className="mt-3">{renderNoteItems(point.items)}</div>
            </details>
          ) : (
            renderNoteItems(point.items)
          )}
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-neutral-200 pt-6 text-sm">
          {prev !== null ? (
            <Link to={`${chapterBase}/point/${prev}`} className="text-neutral-500 hover:text-neutral-900">
              ← 上一个知识点
            </Link>
          ) : (
            <Link to={chapterBase} className="text-neutral-500 hover:text-neutral-900">
              ← 返回章节列表
            </Link>
          )}
          {next !== null && (
            <Link to={`${chapterBase}/point/${next}`} className="text-neutral-500 hover:text-neutral-900">
              下一个知识点 →
            </Link>
          )}
        </div>

        {group && <FlashcardEmbed group={group} />}
      </main>
      <Footer />
    </div>
  )
}

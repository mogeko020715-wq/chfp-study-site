import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { questions } from '@/data/questions'
import { pointForQuestion } from '@/data/questionPoints'

/** 知识点页底部：与本知识点相关的题目快闪练习（最多 3 道） */
export default function RelatedPractice({ pointTitle }: { pointTitle: string }) {
  const [flipped, setFlipped] = useState<number | null>(null)

  const related = questions.filter((q) => {
    const p = pointForQuestion(q)
    return p !== null && pointTitle.includes(p)
  })

  if (related.length === 0) return null
  const shown = related.slice(0, 3)

  return (
    <div className="mt-10 border-t border-neutral-200 pt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-section">练一练 · 本知识点相关题</h2>
        <Link
          to="/flashcards"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900"
        >
          全部 {related.length} 道 →
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {shown.map((q, i) => (
          <button
            key={i}
            onClick={() => setFlipped(flipped === i ? null : i)}
            className={`flashcard relative block min-h-32 w-full text-left ${flipped === i ? 'is-flipped' : ''}`}
            style={{ perspective: '1200px' }}
            aria-label="点击翻面"
          >
            <div className="flashcard-face card flex flex-col p-4">
              <span className="text-xs text-neutral-400">相关题 {i + 1} / {shown.length}</span>
              <p className="mt-2 text-sm leading-relaxed text-neutral-900">{q.stem}</p>
              <span className="mt-auto pt-2 text-xs text-neutral-400">点击看答案 →</span>
            </div>
            <div className="flashcard-face flashcard-back card flex flex-col bg-neutral-50 p-4">
              <span className="text-xs text-neutral-500">答案</span>
              <p className="mt-2 overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-neutral-800">
                {q.answer || '（答案待补充）'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

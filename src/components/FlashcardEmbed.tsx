import { useMemo, useState } from 'react'
import { questions } from '@/data/questions'
import { useMastered } from '@/hooks/useMastered'
import { Button } from '@/components/ui/button'
import { Check, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react'

/** 紧凑版闪卡练习器：只练习单个主题分组，嵌入知识点详情页 */
export default function FlashcardEmbed({ group }: { group: string }) {
  const { mastered, toggle } = useMastered(questions.length)
  const [order, setOrder] = useState<number[]>(() =>
    questions.map((_, i) => i).filter((i) => questions[i].chapter === group || questions[i].theme === group)
  )
  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const list = useMemo(() => order, [order])
  const cur = list.length > 0 ? list[Math.min(pos, list.length - 1)] : -1
  const q = cur >= 0 ? questions[cur] : null
  const done = q ? mastered.has(cur) : false

  if (list.length === 0) return null

  const go = (delta: number) => {
    setPos((p) => (p + delta + list.length) % list.length)
    setFlipped(false)
  }

  return (
    <div className="mt-10 border-t border-neutral-200 pt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-section">练一练 · {group}</h2>
        <span className="text-sm text-neutral-500">
          {Math.min(pos + 1, list.length)} / {list.length} · 已掌握 {list.filter((i) => mastered.has(i)).length}
        </span>
      </div>

      <div className="mt-4" style={{ perspective: '1200px' }}>
        <button
          onClick={() => setFlipped((f) => !f)}
          className={`flashcard relative block h-64 w-full text-left sm:h-56 ${flipped ? 'is-flipped' : ''}`}
          aria-label="点击翻面"
        >
          <div className="flashcard-face card flex flex-col p-5">
            <span className="text-sm text-neutral-500">问题</span>
            <p className="mt-3 overflow-y-auto leading-relaxed text-neutral-900">{q!.stem}</p>
            <span className="mt-auto pt-3 text-sm text-neutral-400">点击卡片查看答案 →</span>
          </div>
          <div className="flashcard-face flashcard-back card flex flex-col bg-neutral-50 p-5">
            <span className="text-sm text-neutral-500">答案 / 知识点</span>
            <p className="mt-3 overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-neutral-800">
              {q!.answer || '（答案待补充）'}
            </p>
            <span className="mt-auto pt-3 text-sm text-neutral-400">点击返回问题</span>
          </div>
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => go(-1)} aria-label="上一张">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => go(1)} aria-label="下一张">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setOrder([...order].sort(() => Math.random() - 0.5))
              setPos(0)
              setFlipped(false)
            }}
            aria-label="随机洗牌"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>
        <Button variant={done ? 'outline' : 'default'} onClick={() => toggle(cur, !done)}>
          <Check className="mr-1.5 h-4 w-4" />
          {done ? '取消掌握标记' : '标记为已掌握'}
        </Button>
      </div>
    </div>
  )
}

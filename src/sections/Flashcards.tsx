import { useMemo, useState } from 'react'
import { questions } from '@/data/questions'
import { useMastered } from '@/hooks/useMastered'
import { Button } from '@/components/ui/button'
import { Check, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react'

const ALL = '全部'
const groups = ['概述', '投资需求分析', '债券', '股票']
const tagOptions = [ALL, ...groups]

function matchGroup(q: (typeof questions)[number], g: string) {
  return q.chapter === g || q.theme === g
}

export default function Flashcards() {
  const { mastered, toggle } = useMastered(questions.length)
  const [filter, setFilter] = useState(ALL)
  const [order, setOrder] = useState<number[]>(() => questions.map((_, i) => i))
  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const list = useMemo(
    () => order.filter((i) => filter === ALL || matchGroup(questions[i], filter)),
    [order, filter]
  )
  const cur = list.length > 0 ? list[Math.min(pos, list.length - 1)] : -1
  const q = cur >= 0 ? questions[cur] : null
  const done = q ? mastered.has(cur) : false

  const shuffle = () => {
    setOrder([...order].sort(() => Math.random() - 0.5))
    setPos(0)
    setFlipped(false)
  }

  const go = (delta: number) => {
    if (list.length === 0) return
    setPos((p) => (p + delta + list.length) % list.length)
    setFlipped(false)
  }

  const switchFilter = (t: string) => {
    setFilter(t)
    setPos(0)
    setFlipped(false)
  }

  return (
    <section id="flashcards" className="reading-col mx-auto scroll-mt-16 px-4 py-14 sm:px-6">
      <h2 className="text-title">知识闪卡</h2>
      <p className="text-body mt-3">
        题目来自「投资规划」习题库全量 173 题，覆盖概述、投资需求分析、基础资产（债券 / 股票）。点击卡片翻面看答案，掌握进度自动保存在本机。
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {tagOptions.map((t) => (
          <button
            key={t}
            onClick={() => switchFilter(t)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              filter === t
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
            }`}
          >
            {t === ALL ? '全部' : t}
          </button>
        ))}
        <span className="ml-auto text-sm text-neutral-500">
          共 {list.length} 张 · 已掌握 {list.filter((i) => mastered.has(i)).length}
        </span>
      </div>

      {q ? (
        <>
          <div className="mt-5" style={{ perspective: '1200px' }}>
            <button
              onClick={() => setFlipped((f) => !f)}
              className={`flashcard relative block h-80 w-full text-left sm:h-72 ${flipped ? 'is-flipped' : ''}`}
              aria-label="点击翻面"
            >
              {/* 正面 */}
              <div className="flashcard-face card flex flex-col p-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">
                    {Math.min(pos + 1, list.length)} / {list.length}
                  </span>
                  <span className="flex items-center gap-2 text-neutral-500">
                    {[q.chapter, q.theme].filter(Boolean).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                    {q.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                    {done && (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <Check className="h-3.5 w-3.5" />
                        已掌握
                      </span>
                    )}
                  </span>
                </div>
                <p className="mt-6 overflow-y-auto text-lg leading-relaxed text-neutral-900">{q.stem}</p>
                <span className="mt-auto pt-4 text-sm text-neutral-400">点击卡片查看答案 →</span>
              </div>
              {/* 背面 */}
              <div className="flashcard-face flashcard-back card flex flex-col bg-neutral-50 p-6">
                <span className="text-sm text-neutral-500">答案 / 知识点</span>
                <p className="mt-4 overflow-y-auto whitespace-pre-line leading-relaxed text-neutral-800">
                  {q.answer || '（答案待补充，可回到 Notion 题库完善）'}
                </p>
                <span className="mt-auto pt-4 text-sm text-neutral-400">
                  {[q.chapter, q.theme].filter(Boolean).join(' · ') || '投资规划'}
                  {q.date ? ` · 掌握日期：${q.date}` : ''} · 点击返回问题
                </span>
              </div>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => go(-1)} aria-label="上一张">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => go(1)} aria-label="下一张">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={shuffle} aria-label="随机洗牌">
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>
            <Button variant={done ? 'outline' : 'default'} onClick={() => toggle(cur, !done)}>
              <Check className="mr-1.5 h-4 w-4" />
              {done ? '取消掌握标记' : '标记为已掌握'}
            </Button>
          </div>
        </>
      ) : (
        <p className="py-16 text-center text-neutral-500">该筛选条件下暂无卡片</p>
      )}
    </section>
  )
}

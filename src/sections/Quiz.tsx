import { useMemo, useState } from 'react'
import { questions } from '@/data/questions'
import { useMastered } from '@/hooks/useMastered'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Check, X } from 'lucide-react'

type Phase = 'recall' | 'revealed' | 'finished'

export default function Quiz() {
  const { toggle, reset, count } = useMastered(questions.length)
  const [order, setOrder] = useState<number[]>(() => questions.map((_, i) => i).sort(() => Math.random() - 0.5))
  const [pos, setPos] = useState(0)
  const [phase, setPhase] = useState<Phase>('recall')
  const [sessionHits, setSessionHits] = useState(0)
  const [sessionMiss, setSessionMiss] = useState(0)

  const total = order.length
  const cur = pos < total ? order[pos] : -1
  const q = cur >= 0 ? questions[cur] : null

  const pct = useMemo(() => Math.round(((pos + (phase === 'finished' ? 1 : 0)) / total) * 100), [pos, phase, total])

  const grade = (ok: boolean) => {
    toggle(cur, ok)
    if (ok) setSessionHits((v) => v + 1)
    else setSessionMiss((v) => v + 1)
    if (pos + 1 >= total) setPhase('finished')
    else {
      setPos((p) => p + 1)
      setPhase('recall')
    }
  }

  const restart = () => {
    setOrder(questions.map((_, i) => i).sort(() => Math.random() - 0.5))
    setPos(0)
    setPhase('recall')
    setSessionHits(0)
    setSessionMiss(0)
  }

  return (
    <section id="quiz" className="scroll-mt-16 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto reading-col px-4 py-14 sm:px-6">
        <h2 className="text-title">自测刷题</h2>
        <p className="text-body mt-3">
          随机顺序出题。先在心中默答，再揭晓答案并诚实自评——标记结果与闪卡进度互通。
        </p>

        <div className="card mt-8 p-6">
          {phase !== 'finished' && q ? (
            <>
              <div className="mb-2 flex items-center justify-between text-sm text-neutral-500">
                <span>
                  第 {pos + 1} / {total} 题
                </span>
                <span>
                  本组答对 {sessionHits} · 答错 {sessionMiss}
                </span>
              </div>
              <Progress value={pct} className="h-1.5" />

              <p className="mt-8 min-h-24 text-lg leading-relaxed text-neutral-900">{q.stem}</p>

              {phase === 'recall' ? (
                <div className="mt-8 flex justify-center">
                  <Button onClick={() => setPhase('revealed')}>心中已有答案，显示答案</Button>
                </div>
              ) : (
                <>
                  <div className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-5">
                    <p className="text-sm text-neutral-500">答案 / 知识点</p>
                    <p className="mt-2 whitespace-pre-line leading-relaxed text-neutral-800">
                      {q.answer || '（答案待补充）'}
                    </p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => grade(false)}
                      className="text-neutral-700"
                    >
                      <X className="mr-2 h-4 w-4" />
                      没答对，需巩固
                    </Button>
                    <Button onClick={() => grade(true)}>
                      <Check className="mr-2 h-4 w-4" />
                      答对了，已掌握
                    </Button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="py-6 text-center">
              <h3 className="text-xl font-bold text-neutral-900">本轮刷题完成</h3>
              <p className="mt-2 text-neutral-600">
                共 {total} 题：答对 {sessionHits}，答错 {sessionMiss}
                {sessionMiss + sessionHits > 0 &&
                  `，正确率 ${Math.round((sessionHits / (sessionHits + sessionMiss)) * 100)}%`}
              </p>
              <p className="mt-4 text-sm text-neutral-500">
                累计已掌握 <span className="font-medium text-neutral-900">{count}</span> / {questions.length} 题
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button onClick={restart}>再来一轮</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (window.confirm('确定清空全部掌握记录并重新开始吗？')) reset()
                  }}
                >
                  清空掌握记录
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

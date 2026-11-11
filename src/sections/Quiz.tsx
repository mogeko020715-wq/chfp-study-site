import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { questions } from '@/data/questions'
import { flashcardGroups } from '@/data/feed'
import { useMastered } from '@/hooks/useMastered'
import { useCardStore } from '@/hooks/useCardStore'
import {
  recordGrade,
  studyDaysKeyFor,
  todayStr,
  touchStudyDay,
  type Grade,
} from '@/lib/cardState'
import { getSession } from '@/lib/account'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

type Phase = 'recall' | 'revealed' | 'finished'
type Mode = 'rand' | 'wrong' | 'mock'
type Tier = 'unknown' | 'guess' | 'sure'

const ALL = '全部'
const MODES: { key: Mode; label: string; hint: string }[] = [
  { key: 'rand', label: '随机', hint: '全题库随机抽题' },
  { key: 'wrong', label: '错题重练', hint: '只练答错过的题' },
  { key: 'mock', label: '模拟卷', hint: '随机 50 题，模拟考场节奏' },
]
const MOCK_SIZE = 50
const TIERS: { key: Tier; grade: Grade; label: string; solid: boolean }[] = [
  { key: 'unknown', grade: 'again', label: '不会', solid: false },
  { key: 'guess', grade: 'hard', label: '蒙对的', solid: false },
  { key: 'sure', grade: 'good', label: '确定会', solid: true },
]
const chipCls = (on: boolean) =>
  `rounded-full border px-3 py-1 text-sm transition-colors ${
    on
      ? 'border-neutral-900 bg-neutral-900 text-white'
      : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
  }`

export default function Quiz() {
  const { toggle, reset, count } = useMastered(questions.length)
  const { state: cardState, replace } = useCardStore()
  const [searchParams] = useSearchParams()
  // 支持 ?n=10 快测：限制随机模式的题量
  const nParam = Number(searchParams.get('n'))
  const quickLimit = Number.isInteger(nParam) && nParam > 0 ? Math.min(nParam, questions.length) : 0

  const [mode, setMode] = useState<Mode>('rand')
  const [chapter, setChapter] = useState(ALL)

  const buildOrder = (m: Mode, ch: string): number[] => {
    let base = questions.map((_, i) => i)
    if (ch !== ALL) base = base.filter((i) => questions[i].chapter === ch || questions[i].theme === ch)
    if (m === 'wrong') {
      const state = cardState
      return base
        .filter((i) => (state[i]?.lapses ?? 0) > 0)
        .sort((a, b) => (state[b]?.lapses ?? 0) - (state[a]?.lapses ?? 0))
    }
    const shuffled = base.sort(() => Math.random() - 0.5)
    if (m === 'mock') return shuffled.slice(0, MOCK_SIZE)
    return quickLimit > 0 ? shuffled.slice(0, quickLimit) : shuffled
  }

  const [order, setOrder] = useState<number[]>(() => buildOrder('rand', ALL))
  const [pos, setPos] = useState(0)
  const [phase, setPhase] = useState<Phase>('recall')
  const [sessionHits, setSessionHits] = useState(0)
  const [sessionMiss, setSessionMiss] = useState(0)

  const total = order.length
  const cur = pos < total ? order[pos] : -1
  const q = cur >= 0 ? questions[cur] : null
  const today = todayStr()

  const pct = useMemo(() => Math.round(((pos + (phase === 'finished' ? 1 : 0)) / total) * 100), [pos, phase, total])

  const restartWith = (m: Mode, ch: string) => {
    setOrder(buildOrder(m, ch))
    setPos(0)
    setPhase('recall')
    setSessionHits(0)
    setSessionMiss(0)
  }

  /** 三档评分写入 SRS：不会→明天再来；蒙对→2 天后；确定会→正常间隔 */
  const grade = (tier: Tier) => {
    if (cur < 0) return
    const t = TIERS.find((x) => x.key === tier)!
    const { next, mastered: nowMastered, unmastered } = recordGrade(cardState, cur, t.grade, today)
    replace(next)
    touchStudyDay(studyDaysKeyFor(getSession()), today)
    if (nowMastered) toggle(cur, true)
    if (unmastered) toggle(cur, false)
    if (tier === 'unknown') setSessionMiss((v) => v + 1)
    else setSessionHits((v) => v + 1)
    if (pos + 1 >= total) setPhase('finished')
    else {
      setPos((p) => p + 1)
      setPhase('recall')
    }
  }

  return (
    <section id="quiz" className="scroll-mt-16 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto reading-col px-4 py-14 sm:px-6">
        <h2 className="text-title">自测刷题</h2>
        <p className="text-body mt-3">
          先在心中默答，揭晓后按「不会 / 蒙对 / 确定会」三档诚实自评——不会的题明天自动进入闪卡待复习队列。
          {quickLimit > 0 && mode === 'rand' && (
            <span className="ml-1 font-medium text-neutral-900">本轮为 {quickLimit} 题快测。</span>
          )}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-neutral-400">模式</span>
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              title={m.hint}
              onClick={() => {
                setMode(m.key)
                restartWith(m.key, chapter)
              }}
              className={chipCls(mode === m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-neutral-400">章节</span>
          {[ALL, ...flashcardGroups].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                setChapter(g)
                restartWith(mode, g)
              }}
              className={chipCls(chapter === g)}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="card mt-8 p-6">
          {phase !== 'finished' && q ? (
            <>
              <div className="mb-2 flex items-center justify-between text-sm text-neutral-500">
                <span>
                  第 {pos + 1} / {total} 题
                  {mode === 'mock' && ' · 模拟卷'}
                  {mode === 'wrong' && ' · 错题重练'}
                </span>
                <span>
                  本会 / 蒙对 {sessionHits} · 不会 {sessionMiss}
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
                  <p className="mt-4 text-center text-xs text-neutral-400">
                    诚实自评：不会 → 明天再来 · 蒙对 → 2 天后再见 · 确定会 → 正常间隔
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {TIERS.map((t) => (
                      <Button
                        key={t.key}
                        variant={t.solid ? 'default' : 'outline'}
                        onClick={() => grade(t.key)}
                        className={t.solid ? '' : 'text-neutral-700'}
                      >
                        {t.label}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : phase === 'finished' ? (
            <div className="py-6 text-center">
              <h3 className="text-xl font-bold text-neutral-900">本轮刷题完成</h3>
              <p className="mt-2 text-neutral-600">
                共 {total} 题：会 / 蒙对 {sessionHits}，不会 {sessionMiss}
                {sessionMiss + sessionHits > 0 &&
                  `，拿稳率 ${Math.round((sessionHits / (sessionHits + sessionMiss)) * 100)}%`}
              </p>
              {sessionMiss > 0 && (
                <p className="mt-1 text-sm text-neutral-500">不会的 {sessionMiss} 题已安排明天复习</p>
              )}
              <p className="mt-4 text-sm text-neutral-500">
                累计已掌握 <span className="font-medium text-neutral-900">{count}</span> / {questions.length} 题
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button onClick={() => restartWith(mode, chapter)}>再来一轮</Button>
                {mode !== 'wrong' && sessionMiss > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMode('wrong')
                      restartWith('wrong', chapter)
                    }}
                  >
                    立即重练错题
                  </Button>
                )}
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
          ) : (
            <div className="py-10 text-center">
              <p className="text-neutral-600">
                {mode === 'wrong' ? '还没有错题记录——答错的题会自动进入错题重练' : '该筛选条件下暂无题目'}
              </p>
              <Button variant="outline" className="mt-4" onClick={() => { setMode('rand'); restartWith('rand', chapter) }}>
                回到随机模式
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

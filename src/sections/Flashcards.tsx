import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { questions } from '@/data/questions'
import { useMastered } from '@/hooks/useMastered'
import { useCardStore } from '@/hooks/useCardStore'
import {
  dueCount,
  recordGrade,
  streakOf,
  studyDaysKeyFor,
  todayStr,
  touchStudyDay,
  type Grade,
} from '@/lib/cardState'
import { getSession } from '@/lib/account'
import { Button } from '@/components/ui/button'
import { Check, ChevronLeft, ChevronRight, Shuffle, Star } from 'lucide-react'

const ALL = '全部'
const groups = ['概述', '投资需求分析', '债券', '股票']
const tagOptions = [ALL, ...groups]

type Mode = 'seq' | 'rand' | 'due' | 'wrong' | 'star'
const MODES: { key: Mode; label: string; hint: string }[] = [
  { key: 'seq', label: '顺序', hint: '从头到尾过一遍' },
  { key: 'rand', label: '随机', hint: '打破位置记忆' },
  { key: 'due', label: '待复习', hint: '今天该复习的卡' },
  { key: 'wrong', label: '错题', hint: '只刷答错过的' },
  { key: 'star', label: '收藏', hint: '手动标星的卡' },
]

const GRADES: { key: Grade; label: string; keyHint: string; desc: string; solid: boolean }[] = [
  { key: 'again', label: '重来', keyHint: '1', desc: '1 天后', solid: true },
  { key: 'hard', label: '困难', keyHint: '2', desc: '2 天后', solid: false },
  { key: 'good', label: '良好', keyHint: '3', desc: '4 天后', solid: false },
  { key: 'easy', label: '轻松', keyHint: '4', desc: '7 天后', solid: true },
]

function matchGroup(q: (typeof questions)[number], g: string) {
  return q.chapter === g || q.theme === g
}

export default function Flashcards() {
  const { mastered, toggle } = useMastered(questions.length)
  const { state: cardState, replace } = useCardStore()
  const [filter, setFilter] = useState(ALL)
  const [mode, setMode] = useState<Mode>('seq')
  const [order, setOrder] = useState<number[]>(() => questions.map((_, i) => i))
  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const today = todayStr()
  const studyDays = useMemo(
    () => touchStudyDay(studyDaysKeyFor(getSession()), today),
    // 首次进入记录今天；之后随评分刷新
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cardState],
  )
  const streak = streakOf(studyDays, today)
  const studiedToday = useMemo(
    () => Object.values(cardState).filter((r) => r.last === today).length,
    [cardState, today],
  )
  const due = dueCount(cardState, questions.length, today)

  const list = useMemo(() => {
    const base = order.filter((i) => filter === ALL || matchGroup(questions[i], filter))
    switch (mode) {
      case 'due':
        return base
          .filter((i) => cardState[i] && cardState[i].next <= today)
          .sort((a, b) => cardState[a].next.localeCompare(cardState[b].next))
      case 'wrong':
        return base.filter((i) => (cardState[i]?.lapses ?? 0) > 0).sort((a, b) => (cardState[b]?.lapses ?? 0) - (cardState[a]?.lapses ?? 0))
      case 'star':
        return base.filter((i) => cardState[i]?.starred)
      default:
        return base
    }
  }, [order, filter, mode, cardState, today])

  const cur = list.length > 0 ? list[Math.min(pos, list.length - 1)] : -1
  const q = cur >= 0 ? questions[cur] : null
  const done = q ? mastered.has(cur) : false
  const rec = cur >= 0 ? cardState[cur] : undefined

  const clearTimer = () => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
  }

  const go = useCallback(
    (delta: number) => {
      if (list.length === 0) return
      clearTimer()
      setFeedback(null)
      setPos((p) => (p + delta + list.length) % list.length)
      setFlipped(false)
    },
    [list.length],
  )

  const switchMode = (m: Mode) => {
    setMode(m)
    setPos(0)
    setFlipped(false)
    setFeedback(null)
    clearTimer()
    if (m === 'rand') setOrder([...order].sort(() => Math.random() - 0.5))
    if (m === 'seq') setOrder(questions.map((_, i) => i))
  }

  const switchFilter = (t: string) => {
    setFilter(t)
    setPos(0)
    setFlipped(false)
  }

  const grade = useCallback(
    (g: Grade) => {
      if (cur < 0 || !flipped || feedback) return
      const { next, nextDate, mastered: nowMastered, unmastered } = recordGrade(cardState, cur, g, today)
      replace(next)
      touchStudyDay(studyDaysKeyFor(getSession()), today)
      if (nowMastered) toggle(cur, true)
      if (unmastered) toggle(cur, false)
      const days = Math.round((new Date(`${nextDate}T00:00:00`).getTime() - new Date(`${today}T00:00:00`).getTime()) / 86400000)
      setFeedback(`已记录 · ${days} 天后复习（${nextDate}）`)
      clearTimer()
      advanceTimer.current = setTimeout(() => {
        setFeedback(null)
        setPos((p) => (list.length > 0 ? p + 1 : p))
        setFlipped(false)
        advanceTimer.current = null
      }, 800)
    },
    [cur, flipped, feedback, cardState, replace, toggle, today, list.length],
  )

  // 键盘快捷键：空格翻面、←/→ 切卡、1-4 评分
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === ' ') {
        e.preventDefault()
        if (cur >= 0) setFlipped((f) => !f)
      } else if (e.key === 'ArrowLeft') {
        go(-1)
      } else if (e.key === 'ArrowRight') {
        go(1)
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        grade(GRADES[Number(e.key) - 1].key)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur, flipped, feedback, grade, go])

  return (
    <section id="flashcards" className="reading-col mx-auto scroll-mt-16 px-4 py-14 sm:px-6">
      <h2 className="text-title">知识闪卡</h2>
      <p className="text-body mt-3">
        题目来自「投资规划」习题库全量 {questions.length} 题，覆盖概述、投资需求分析、基础资产（债券 / 股票）。
        点击卡片或按空格翻面，翻面后用 1-4 评分，系统会按记忆曲线安排下次复习。
      </p>

      {/* 学习模式 */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-sm text-neutral-400">模式</span>
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => switchMode(m.key)}
            title={m.hint}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              mode === m.key
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
            }`}
          >
            {m.label}
          </button>
        ))}
        <span className="ml-auto text-sm text-neutral-500">
          今日已复习 {studiedToday} · 连续 {streak} 天 · 待复习 {due} 张
        </span>
      </div>

      {/* 章节筛选 */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-neutral-400">章节</span>
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
          <div className="relative mt-5" style={{ perspective: '1200px' }}>
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
                <span className="mt-auto pt-4 text-sm text-neutral-400">点击卡片或按空格查看答案 →</span>
              </div>
              {/* 背面 */}
              <div className="flashcard-face flashcard-back card flex flex-col bg-neutral-50 p-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">答案 / 知识点</span>
                  {(rec?.lapses ?? 0) > 0 && (
                    <span className="text-neutral-500">累计答错 {rec!.lapses} 次</span>
                  )}
                </div>
                <p className="mt-4 overflow-y-auto whitespace-pre-line leading-relaxed text-neutral-800">
                  {q.answer || '（答案待补充，可回到 Notion 题库完善）'}
                </p>
                <span className="mt-auto pt-4 text-sm text-neutral-400">
                  {[q.chapter, q.theme].filter(Boolean).join(' · ') || '投资规划'}
                  {q.date ? ` · 掌握日期：${q.date}` : ''} · 按 1-4 评分
                </span>
              </div>
            </button>
          </div>

          {/* 评分条（翻面后显示） */}
          <div className="mt-4 min-h-10">
            {flipped ? (
              feedback ? (
                <p className="text-center text-sm text-neutral-500">{feedback}</p>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {GRADES.map((g) => (
                    <button
                      key={g.key}
                      onClick={() => grade(g.key)}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
                        g.solid
                          ? 'border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-700'
                          : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500'
                      }`}
                    >
                      <span className="font-medium">{g.label}</span>
                      <span className={g.solid ? 'text-neutral-400' : 'text-neutral-400'}>{g.desc}</span>
                      <kbd
                        className={`rounded border px-1.5 text-xs ${
                          g.solid ? 'border-neutral-600 text-neutral-400' : 'border-neutral-300 text-neutral-400'
                        }`}
                      >
                        {g.keyHint}
                      </kbd>
                    </button>
                  ))}
                </div>
              )
            ) : (
              <p className="text-center text-sm text-neutral-400">翻面后评分：1 重来 · 2 困难 · 3 良好 · 4 轻松</p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
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
                onClick={() => switchMode('rand')}
                aria-label="随机洗牌"
                title="随机洗牌"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                variant={rec?.starred ? 'default' : 'outline'}
                size="icon"
                onClick={() =>
                  cur >= 0 &&
                  replace({
                    ...cardState,
                    [cur]: {
                      reps: rec?.reps ?? 0,
                      lapses: rec?.lapses ?? 0,
                      ease: rec?.ease ?? 2.0,
                      next: rec?.next ?? today,
                      last: rec?.last ?? today,
                      starred: !rec?.starred,
                    },
                  })
                }
                aria-label={rec?.starred ? '取消收藏' : '收藏'}
                title={rec?.starred ? '取消收藏' : '收藏'}
              >
                <Star className={`h-4 w-4 ${rec?.starred ? 'fill-current' : ''}`} />
              </Button>
            </div>
            <Button variant={done ? 'outline' : 'default'} onClick={() => toggle(cur, !done)}>
              <Check className="mr-1.5 h-4 w-4" />
              {done ? '取消掌握标记' : '标记为已掌握'}
            </Button>
          </div>
        </>
      ) : (
        <p className="py-16 text-center text-neutral-500">
          {mode === 'due'
            ? '今天没有待复习的卡——去顺序或随机模式学几张吧'
            : mode === 'wrong'
              ? '还没有错题——答错的卡会自动进入错题本'
              : mode === 'star'
                ? '还没有收藏的卡——点卡片下方的星标收藏'
                : '该筛选条件下暂无卡片'}
        </p>
      )}
    </section>
  )
}

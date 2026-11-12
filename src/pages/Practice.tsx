import { useEffect, useMemo, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, EyeOff, RotateCcw, X } from 'lucide-react'
import Nav from '@/sections/Nav'
import Footer from '@/sections/Footer'
import { practiceByCat, practiceCats, type PracticeItem, type PracticeOption } from '@/data/practice'
import { concepts } from '@/data/concepts'
import { demoComponents } from '@/components/concepts/demos'
import { useMastered } from '@/hooks/useMastered'
import { getSession } from '@/lib/account'

const ALL = '全部方向'
const STORE_PREFIX = 'chfp-practice-v1'

interface QState {
  wrongIds: string[]
  solved: boolean
}
interface Persist {
  cat: string
  pos: number
  qstate: Record<string, QState>
  attempts: number
  misses: number
}

function storeKey() {
  const s = getSession()
  return s ? `${STORE_PREFIX}:${s}` : STORE_PREFIX
}

function loadPersist(): Persist {
  try {
    const raw = localStorage.getItem(storeKey())
    if (raw) {
      const p = JSON.parse(raw) as Persist
      if (p && typeof p.pos === 'number' && p.qstate) return p
    }
  } catch {
    /* ignore */
  }
  return { cat: ALL, pos: 0, qstate: {}, attempts: 0, misses: 0 }
}

/** 按题目 id 做确定性洗牌：同一题任何时候选项顺序一致 */
function stableShuffle<T>(arr: T[], seedStr: string): T[] {
  let h = 2166136261
  for (let i = 0; i < seedStr.length; i += 1) {
    h ^= seedStr.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i -= 1) {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    const j = Math.abs(h) % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** 右侧面板：答对前锁定，答对后展示完整概念详情 */
function RevealPanel({ item, unlocked }: { item: PracticeItem; unlocked: boolean }) {
  const concept = concepts.find((c) => c.id === item.conceptId)
  if (!unlocked || !concept) {
    return (
      <div className="flex h-full min-h-64 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 text-neutral-400">
        <EyeOff className="h-5 w-5" />
        <p className="text-sm">答对后查看完整概念详情</p>
      </div>
    )
  }
  const Demo = demoComponents[concept.demo]
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
      <h3 className="text-lg font-semibold text-neutral-900">
        {concept.name}
        <span className="ml-2 text-sm font-normal text-neutral-400">{concept.en}</span>
      </h3>
      <p className="concept-quote mt-3 text-sm leading-relaxed text-neutral-600">{concept.quote}</p>
      <p className="mt-2 text-sm leading-relaxed text-neutral-800">{concept.answer}</p>
      <div className="mt-4 rounded-lg border border-neutral-100 bg-white px-4 py-4">
        <Demo />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-neutral-500">易错点：{concept.point}</p>
    </div>
  )
}

export default function PracticePage() {
  const { count } = useMastered()
  const init = useMemo(loadPersist, [])
  const [cat, setCat] = useState(init.cat)
  const [pos, setPos] = useState(init.pos)
  const [qstate, setQstate] = useState<Record<string, QState>>(init.qstate)
  const [attempts, setAttempts] = useState(init.attempts)
  const [misses, setMisses] = useState(init.misses)

  const list = useMemo(() => practiceByCat(cat === ALL ? null : cat), [cat])
  const clampedPos = Math.min(pos, list.length)
  const finished = clampedPos >= list.length
  const item = finished ? null : list[clampedPos]
  const cur: QState = (item && qstate[item.id]) || { wrongIds: [], solved: false }
  const options = useMemo<PracticeOption[]>(
    () => (item ? stableShuffle(item.options, item.id) : []),
    [item],
  )
  const solvedCount = list.filter((i) => qstate[i.id]?.solved).length

  // 进度持久化（按账号隔离，与闪卡进度同一套存储约定）
  useEffect(() => {
    const p: Persist = { cat, pos: clampedPos, qstate, attempts, misses }
    try {
      localStorage.setItem(storeKey(), JSON.stringify(p))
    } catch {
      /* ignore */
    }
  }, [cat, clampedPos, qstate, attempts, misses])

  const pick = (opt: PracticeOption) => {
    if (!item || cur.solved || cur.wrongIds.includes(opt.id)) return
    setAttempts((n) => n + 1)
    if (!opt.correct) setMisses((n) => n + 1)
    setQstate((prev) => {
      const q = prev[item.id] ?? { wrongIds: [], solved: false }
      return {
        ...prev,
        [item.id]: opt.correct
          ? { ...q, solved: true }
          : { ...q, wrongIds: [...q.wrongIds, opt.id] },
      }
    })
  }

  const goPrev = () => setPos((p) => Math.max(0, p - 1))
  const goNext = () => setPos((p) => Math.min(list.length, p + 1))

  const restart = (nextCat: string) => {
    setCat(nextCat)
    setPos(0)
    setQstate({})
    setAttempts(0)
    setMisses(0)
  }

  // 键盘：1/2/3 或 A/B/C 选选项，←/→ 切换题目
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === 'ArrowLeft') {
        goPrev()
        return
      }
      if (e.key === 'ArrowRight') {
        goNext()
        return
      }
      const idx = ['1', '2', '3'].includes(e.key)
        ? Number(e.key) - 1
        : ['a', 'b', 'c'].indexOf(e.key.toLowerCase())
      if (idx >= 0 && idx < options.length) pick(options[idx])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, cur.solved, cur.wrongIds, list.length])

  const chipCls = (on: boolean) =>
    `rounded-full border px-3 py-1 text-sm transition-colors ${
      on
        ? 'border-neutral-900 bg-neutral-900 text-white'
        : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
    }`

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <Nav masteredCount={count} />
      <main className="mx-auto max-w-5xl px-4 pt-12 pb-16 sm:px-6">
        <section className="py-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-title">实战练习</h2>
            <span className="text-sm text-neutral-500">
              {finished ? '已完成' : `第 ${clampedPos + 1} 题 / 共 ${list.length} 题`} · 已解锁 {solvedCount}
            </span>
          </div>
          <p className="text-body mt-2">
            场景化考题：答对才解锁右侧的完整概念详情；答错不公布答案，再想想。
            进度自动保存；键盘 1/2/3 选选项，←/→ 切换题目。
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {[ALL, ...practiceCats].map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => { setCat(c); setPos(0) }} className={chipCls(cat === c)}>
                {c === ALL ? `${ALL}（${practiceByCat(null).length}）` : c}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={goPrev}
                disabled={clampedPos === 0}
                aria-label="上一题"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-300 text-neutral-600 transition-colors hover:border-neutral-500 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={finished}
                aria-label="下一题"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-300 text-neutral-600 transition-colors hover:border-neutral-500 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {finished ? (
            <div className="card mt-8 p-10 text-center">
              <h3 className="text-xl font-bold text-neutral-900">本组练习完成</h3>
              <p className="mt-2 text-neutral-600">
                共 {list.length} 题 · 已解锁 {solvedCount} 题 · 尝试 {attempts} 次 · 答错 {misses} 次
                {attempts > 0 && ` · 一次通过率 ${Math.round(((attempts - misses) / attempts) * 100)}%`}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {solvedCount < list.length && (
                  <button
                    type="button"
                    onClick={() => {
                      const firstUnsolved = list.findIndex((i) => !qstate[i.id]?.solved)
                      setPos(firstUnsolved >= 0 ? firstUnsolved : 0)
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-85"
                  >
                    继续未解锁的 {list.length - solvedCount} 题 →
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => restart(cat)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-600 transition-colors hover:border-neutral-500"
                >
                  <RotateCcw className="h-4 w-4" />
                  清空进度再刷一遍
                </button>
              </div>
            </div>
          ) : (
            item && (
              <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
                {/* 左：题干与选项 */}
                <div>
                  <h3 className="text-xl leading-relaxed font-semibold text-neutral-900 sm:text-2xl">
                    {item.title}
                  </h3>
                  <div className="mt-6 space-y-2">
                    {options.map((opt, i) => {
                      const letter = 'ABC'[i]
                      const isWrongPick = cur.wrongIds.includes(opt.id)
                      const isRightPick = cur.solved && opt.correct
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={cur.solved || isWrongPick}
                          onClick={() => pick(opt)}
                          className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm leading-relaxed transition-colors ${
                            isRightPick
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                              : isWrongPick
                                ? 'border-rose-300 bg-rose-50 text-rose-900 opacity-70'
                                : 'border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-neutral-400'
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                              isRightPick
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : isWrongPick
                                  ? 'border-rose-400 bg-rose-400 text-white'
                                  : 'border-neutral-300 text-neutral-500'
                            }`}
                          >
                            {isRightPick ? <Check className="h-3 w-3" /> : isWrongPick ? <X className="h-3 w-3" /> : letter}
                          </span>
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>

                  {cur.wrongIds.length > 0 && !cur.solved && (
                    <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3" role="alert">
                      <p className="text-sm font-medium text-rose-700">还不对</p>
                      <p className="mt-1 text-sm leading-relaxed text-rose-900/90">
                        {cur.wrongIds
                          .map((id) => item.options.find((o) => o.id === id)?.feedback)
                          .filter(Boolean)
                          .pop()}
                      </p>
                    </div>
                  )}

                  {cur.solved && (
                    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3" role="status">
                      <p className="text-sm font-medium text-emerald-800">答对了</p>
                      <p className="mt-1 text-sm leading-relaxed text-emerald-900/90">
                        {item.options.find((o) => o.correct)?.feedback}
                      </p>
                      <button
                        type="button"
                        onClick={goNext}
                        className="mt-3 inline-flex items-center gap-1 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-85"
                      >
                        继续下一题 →
                      </button>
                    </div>
                  )}
                </div>

                {/* 右：锁定/解锁的概念详情 */}
                <RevealPanel item={item} unlocked={cur.solved} />
              </div>
            )
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

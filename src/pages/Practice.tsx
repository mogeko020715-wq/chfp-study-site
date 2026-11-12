import { useMemo, useState } from 'react'
import { Check, EyeOff, RotateCcw, X } from 'lucide-react'
import Nav from '@/sections/Nav'
import Footer from '@/sections/Footer'
import { practiceByCat, practiceCats, type PracticeItem, type PracticeOption } from '@/data/practice'
import { concepts } from '@/data/concepts'
import { demoComponents } from '@/components/concepts/demos'
import { useMastered } from '@/hooks/useMastered'

const ALL = '全部方向'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
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
  const [cat, setCat] = useState(ALL)
  const [pos, setPos] = useState(0)
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set())
  const [solved, setSolved] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [misses, setMisses] = useState(0)
  // 每次换题重新洗选项（答错重试期间保持顺序不变）
  const [orderSeed, setOrderSeed] = useState(0)

  const list = useMemo(() => practiceByCat(cat === ALL ? null : cat), [cat])
  const finished = pos >= list.length
  const item = finished ? null : list[pos]
  const options = useMemo<PracticeOption[]>(
    () => (item ? shuffle(item.options) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item?.id, orderSeed],
  )

  const pick = (opt: PracticeOption) => {
    if (!item || solved || wrongIds.has(opt.id)) return
    setAttempts((n) => n + 1)
    if (opt.correct) {
      setSolved(true)
    } else {
      setMisses((n) => n + 1)
      setWrongIds((prev) => new Set(prev).add(opt.id))
    }
  }

  const next = () => {
    setPos((p) => p + 1)
    setWrongIds(new Set())
    setSolved(false)
    setOrderSeed((s) => s + 1)
  }

  const restart = (nextCat: string) => {
    setCat(nextCat)
    setPos(0)
    setWrongIds(new Set())
    setSolved(false)
    setAttempts(0)
    setMisses(0)
    setOrderSeed((s) => s + 1)
  }

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
              {finished ? '已完成' : `第 ${pos + 1} 题 / 共 ${list.length} 题`}
            </span>
          </div>
          <p className="text-body mt-2">
            场景化考题：答对才解锁右侧的完整概念详情；答错不公布答案，再想想。
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {[ALL, ...practiceCats].map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => restart(c)} className={chipCls(cat === c)}>
                {c === ALL ? `${ALL}（${practiceByCat(null).length}）` : c}
              </button>
            ))}
          </div>

          {finished ? (
            <div className="card mt-8 p-10 text-center">
              <h3 className="text-xl font-bold text-neutral-900">本组练习完成</h3>
              <p className="mt-2 text-neutral-600">
                共 {list.length} 题 · 尝试 {attempts} 次 · 答错 {misses} 次
                {attempts > 0 && ` · 一次通过率 ${Math.round(((attempts - misses) / attempts) * 100)}%`}
              </p>
              <button
                type="button"
                onClick={() => restart(cat)}
                className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-85"
              >
                <RotateCcw className="h-4 w-4" />
                再刷一遍
              </button>
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
                      const isWrongPick = wrongIds.has(opt.id)
                      const isRightPick = solved && opt.correct
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={solved || isWrongPick}
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

                  {wrongIds.size > 0 && !solved && (
                    <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3" role="alert">
                      <p className="text-sm font-medium text-rose-700">还不对</p>
                      <p className="mt-1 text-sm leading-relaxed text-rose-900/90">
                        {[...wrongIds].map((id) => item.options.find((o) => o.id === id)?.feedback).filter(Boolean).pop()}
                      </p>
                    </div>
                  )}

                  {solved && (
                    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3" role="status">
                      <p className="text-sm font-medium text-emerald-800">答对了</p>
                      <p className="mt-1 text-sm leading-relaxed text-emerald-900/90">
                        {item.options.find((o) => o.correct)?.feedback}
                      </p>
                      <button
                        type="button"
                        onClick={next}
                        className="mt-3 inline-flex items-center gap-1 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-85"
                      >
                        继续下一题 →
                      </button>
                    </div>
                  )}
                </div>

                {/* 右：锁定/解锁的概念详情 */}
                <RevealPanel item={item} unlocked={solved} />
              </div>
            )
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

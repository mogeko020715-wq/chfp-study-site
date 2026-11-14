import { useEffect, useMemo, useState } from 'react'
import { Check, LockKeyhole, RotateCcw } from 'lucide-react'
import Nav from '@/sections/Nav'
import Footer from '@/sections/Footer'
import AccountDialog from '@/components/AccountDialog'
import { useAccount } from '@/hooks/useAccount'
import { useMastered } from '@/hooks/useMastered'
import {
  examSubjects,
  pointsFor,
  questionUid,
  type ExamQuestion,
  type ExamState,
} from '@/data/exams'

function examStoreKey(user: string | null) {
  return user ? `chfp-exam-v1:${user}` : 'chfp-exam-v1'
}

function loadExamState(user: string | null): ExamState {
  try {
    const raw = localStorage.getItem(examStoreKey(user))
    return raw ? (JSON.parse(raw) as ExamState) : {}
  } catch {
    return {}
  }
}

function ExamQuestionCard({
  q,
  uid,
  points,
  multi,
  record,
  loggedIn,
  onLogin,
  onSubmit,
  onReset,
}: {
  q: ExamQuestion
  uid: string
  points: number
  multi: boolean
  record?: { picked: string[]; correct: boolean }
  loggedIn: boolean
  onLogin: () => void
  onSubmit: (uid: string, picked: string[], correct: boolean) => void
  onReset: (uid: string) => void
}) {
  const [picked, setPicked] = useState<string[]>(record?.picked ?? [])
  const submitted = !!record

  useEffect(() => {
    setPicked(record?.picked ?? [])
  }, [uid, record?.picked])

  const toggle = (letter: string) => {
    if (submitted || !loggedIn) return
    if (multi) {
      setPicked((prev) =>
        prev.includes(letter) ? prev.filter((l) => l !== letter) : [...prev, letter].sort(),
      )
    } else {
      setPicked([letter])
    }
  }

  return (
    <article className="card p-5">
      <p className="text-[0.9375rem] leading-relaxed font-medium text-neutral-900">
        <span className="mr-2 text-neutral-400">{q.no}.</span>
        {q.stem}
        <span className="ml-2 text-xs font-normal text-neutral-400">{multi ? '多选' : '单选'} · {points} 分</span>
      </p>
      <div className="mt-3 space-y-2">
        {q.options.map((o) => {
          const selected = picked.includes(o.letter)
          const isCorrectOption = q.correct.includes(o.letter)
          const showCorrect = submitted && isCorrectOption
          const showWrongPick = submitted && selected && !isCorrectOption
          return (
            <button
              key={o.letter}
              type="button"
              disabled={!loggedIn || submitted}
              aria-pressed={selected}
              onClick={() => toggle(o.letter)}
              className={`flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left text-sm leading-relaxed transition-colors ${
                showCorrect
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : showWrongPick
                    ? 'border-rose-300 bg-rose-50 text-rose-900'
                    : selected
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-400'
              } ${!loggedIn ? 'opacity-70' : ''}`}
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${
                  selected ? 'border-current' : 'border-neutral-300'
                }`}
              >
                {selected && <Check className="h-3 w-3" />}
              </span>
              <span className="mr-1 shrink-0 text-neutral-500">{o.letter}.</span>
              {o.text}
            </button>
          )
        })}
      </div>

      {!loggedIn ? (
        <button
          type="button"
          onClick={onLogin}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600 transition-colors hover:border-neutral-500 hover:text-neutral-900"
        >
          <LockKeyhole className="h-3.5 w-3.5" />
          登录后作答
        </button>
      ) : submitted ? (
        <div className="mt-4">
          <p className={`text-sm font-medium ${record!.correct ? 'text-emerald-700' : 'text-rose-600'}`}>
            {record!.correct ? `答对了，+${points} 分` : '答错了，不得分'}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{q.explain}</p>
          <button
            type="button"
            onClick={() => onReset(uid)}
            className="mt-2 inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
          >
            <RotateCcw className="h-3 w-3" />
            重答本题
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={picked.length === 0}
          onClick={() =>
            onSubmit(uid, picked, [...picked].sort().join('') === [...q.correct].sort().join(''))
          }
          className="mt-3 rounded-lg bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-40"
        >
          提交本题
        </button>
      )}
    </article>
  )
}

export default function ExamsPage() {
  const { count } = useMastered()
  const { user } = useAccount()
  const [subjectId, setSubjectId] = useState('s1')
  const [caseIdx, setCaseIdx] = useState(0)
  const [dialog, setDialog] = useState(false)
  const [state, setState] = useState<ExamState>(() => loadExamState(user))

  // 账号切换时重新装载对应记录
  useEffect(() => {
    setState(loadExamState(user))
  }, [user])

  const subject = examSubjects.find((s) => s.id === subjectId)!
  const currentCase = subject.cases[caseIdx] ?? subject.cases[0]
  const [wrongOnly, setWrongOnly] = useState(false)

  // 本板块答错的题数与筛选后的题目列表
  const wrongCount = currentCase.questions.filter(
    (q) => state[questionUid(subjectId, caseIdx, q.no)]?.correct === false,
  ).length
  const shownQuestions = wrongOnly
    ? currentCase.questions.filter(
        (q) => state[questionUid(subjectId, caseIdx, q.no)]?.correct === false,
      )
    : currentCase.questions

  const score = useMemo(() => {
    const pts = pointsFor(subjectId)
    let got = 0
    let answered = 0
    for (const [uid, r] of Object.entries(state)) {
      if (uid.startsWith(`${subjectId}:`)) {
        answered += 1
        if (r.correct) got += pts
      }
    }
    return { got, answered }
  }, [state, subjectId])

  const submit = (uid: string, picked: string[], correct: boolean) => {
    const next = { ...state, [uid]: { picked, correct } }
    setState(next)
    try {
      localStorage.setItem(examStoreKey(user), JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }

  const resetQuestion = (uid: string) => {
    const next = { ...state }
    delete next[uid]
    setState(next)
    try {
      localStorage.setItem(examStoreKey(user), JSON.stringify(next))
    } catch {
      /* ignore */
    }
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
      <main className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <section className="py-8">
          <h2 className="text-title">真题试卷</h2>
          <p className="text-body mt-2">
            CHFP 三科模拟卷原题入库，登录后作答、即时判分，成绩按账号保存在本机。
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {examSubjects.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={subjectId === s.id}
                onClick={() => {
                  setSubjectId(s.id)
                  setCaseIdx(0)
                }}
                className={chipCls(subjectId === s.id)}
              >
                {s.name.split(' · ')[0]}
              </button>
            ))}
            <span className="ml-auto text-sm text-neutral-500">
              {score.answered} / {subject.total} 题 · 得分 <span className="font-semibold text-neutral-900">{score.got}</span> / 100
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {subject.cases.map((c, i) => (
              <button key={i} type="button" aria-pressed={caseIdx === i} onClick={() => { setCaseIdx(i); setWrongOnly(false) }} className={chipCls(caseIdx === i)}>
                {c.title || `第 ${i + 1} 部分`}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={wrongOnly}
              onClick={() => setWrongOnly((w) => !w)}
              disabled={wrongCount === 0 && !wrongOnly}
              className={`${chipCls(wrongOnly)} disabled:opacity-50`}
              title={wrongCount === 0 ? '本板块还没有答错的题' : '只看答错的题'}
            >
              只看错题{wrongCount > 0 && `（${wrongCount}）`}
            </button>
          </div>

          {currentCase.scenario && (
            <div className="card mt-5 bg-neutral-50 p-5">
              <p className="text-sm leading-relaxed whitespace-pre-line text-neutral-700">{currentCase.scenario}</p>
            </div>
          )}

          {!user && (
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <LockKeyhole className="h-4 w-4 shrink-0" />
              当前未登录：题目可浏览，登录后才可以作答与计分。
              <button
                type="button"
                onClick={() => setDialog(true)}
                className="ml-auto shrink-0 rounded-lg bg-neutral-900 px-3 py-1 text-xs font-medium text-white hover:opacity-85"
              >
                去登录
              </button>
            </div>
          )}

          <div className="mt-5 space-y-4">
            {shownQuestions.length === 0 ? (
              <p className="py-12 text-center text-neutral-500">
                {wrongOnly ? '本板块没有答错的题——保持住 🎉' : '暂无题目'}
              </p>
            ) : (
              shownQuestions.map((q) => {
                const uid = questionUid(subjectId, caseIdx, q.no)
                return (
                  <ExamQuestionCard
                    key={uid}
                    q={q}
                    uid={uid}
                    points={pointsFor(subjectId)}
                    multi={currentCase.multi}
                    record={state[uid]}
                    loggedIn={!!user}
                    onLogin={() => setDialog(true)}
                    onSubmit={submit}
                    onReset={resetQuestion}
                  />
                )
              })
            )}
          </div>
        </section>
      </main>
      <Footer />
      {dialog && <AccountDialog mode="login" onClose={() => setDialog(false)} />}
    </div>
  )
}

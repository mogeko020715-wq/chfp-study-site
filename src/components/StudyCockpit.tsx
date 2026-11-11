import { useMemo } from 'react'
import { Link } from 'react-router'
import { Flame, RotateCcw, ClipboardCheck } from 'lucide-react'
import { questions } from '@/data/questions'
import { flashcardGroups } from '@/data/feed'
import { useCardStore } from '@/hooks/useCardStore'
import { useMastered } from '@/hooks/useMastered'
import { dueCount, loadStudyDays, streakOf, studyDaysKeyFor, todayStr } from '@/lib/cardState'
import { getSession } from '@/lib/account'
import { Button } from '@/components/ui/button'

/** 老用户首屏驾驶舱：待复习数、连续天数、薄弱章节，一键继续学习 */
export default function StudyCockpit() {
  const { state } = useCardStore()
  const { count: masteredCount } = useMastered(questions.length)
  const today = todayStr()
  const due = dueCount(state, questions.length, today)
  const streak = streakOf(loadStudyDays(studyDaysKeyFor(getSession())), today)

  // 累计答错最多的章节/主题（取前 2 个，优先 theme）
  const weakest = useMemo(() => {
    const lapses = new Map<string, number>()
    for (const [k, r] of Object.entries(state)) {
      if (!r.lapses) continue
      const q = questions[Number(k)]
      const g = q && (q.theme || q.chapter)
      if (!g) continue
      lapses.set(g, (lapses.get(g) ?? 0) + r.lapses)
    }
    return [...lapses.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2)
  }, [state])

  return (
    <div className="card mt-8 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-neutral-900">今天学什么</h2>
        <span className="flex items-center gap-1 text-sm text-neutral-500">
          <Flame className="h-4 w-4 text-amber-500" />
          连续 {streak} 天
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
        <p className="text-sm text-neutral-500">
          <span className="text-2xl font-bold text-neutral-900">{due}</span> 张待复习
        </p>
        <p className="text-sm text-neutral-500">
          <span className="text-2xl font-bold text-neutral-900">{masteredCount}</span> / {questions.length} 已掌握
        </p>
      </div>

      {weakest.length > 0 && (
        <p className="mt-3 text-sm text-neutral-500">
          最近错题集中在
          {weakest.map(([g, n], i) => (
            <span key={g}>
              {i > 0 && '、'}
              {flashcardGroups.includes(g) ? (
                <Link
                  to={`/flashcards?f=${encodeURIComponent(g)}`}
                  className="font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900"
                >
                  {g}
                </Link>
              ) : (
                <span className="font-medium text-neutral-900">{g}</span>
              )}
              <span className="text-neutral-400">（错 {n} 次）</span>
            </span>
          ))}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <Button asChild>
          <Link to={due > 0 ? '/flashcards?m=due' : '/flashcards?m=rand'}>
            <RotateCcw className="mr-1.5 h-4 w-4" />
            {due > 0 ? `继续复习 ${due} 张` : '随机抽卡复习'}
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/quiz?n=10">
            <ClipboardCheck className="mr-1.5 h-4 w-4" />
            做 10 题小测
          </Link>
        </Button>
      </div>
    </div>
  )
}

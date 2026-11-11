import { lazy, Suspense } from 'react'
import { Link } from 'react-router'
import { modules, totalQuestions } from '@/data/course'
import { knowledgeChapters } from '@/data/knowledge'
import { QUESTION_COUNT } from '@/data/questionMeta'
import { useCardStore } from '@/hooks/useCardStore'
import { useMastered } from '@/hooks/useMastered'
import { Button } from '@/components/ui/button'

// 驾驶舱依赖题库数据，按需加载，首页首屏不再背题库
const StudyCockpit = lazy(() => import('@/components/StudyCockpit'))

export default function Hero() {
  const { state } = useCardStore()
  const { count } = useMastered()
  // 有任何学习记录即视为老用户：展示驾驶舱；否则保留新用户引导
  const hasProgress = Object.keys(state).length > 0 || count > 0

  return (
    <section id="top" className="border-b border-neutral-200 pt-14">
      <div className="mx-auto max-w-3xl px-4 pb-14 pt-14 sm:px-6">
        <h1 className="text-display">CHFP 二级理财规划师 · 知识学习站</h1>
        <p className="text-body mt-4">
          六大课程板块搭骨架，章节笔记填血肉，闪卡与自测巩固记忆。内容同步自 Notion 学习库，打开即学。
        </p>
        {hasProgress ? (
          <Suspense fallback={null}>
            <StudyCockpit />
          </Suspense>
        ) : (
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/flashcards">开始闪卡记忆</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/quiz">自测刷题</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/concepts">逛逛概念图鉴</Link>
            </Button>
          </div>
        )}
        <p className="mt-8 text-sm text-neutral-500">
          {modules.length} 大课程板块 · {knowledgeChapters.length} 个章节笔记 · 闪卡收录 {QUESTION_COUNT} 题 ·
          全科目配套习题 {totalQuestions.toLocaleString()} 道
        </p>
      </div>
    </section>
  )
}

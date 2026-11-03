import { useEffect, useState } from 'react'

// ===== 行业资讯数据源（资讯栏目策划方案 §4）=====
// feed.json 由定时任务每日写入 public/，前端只读不写。

export interface FeedDaily {
  id: string
  date: string
  title: string
  summary: string
  source: string
  sourceUrl?: string
  category: '宏观大事' | '大类资产' | '板块行业' | '数据日历'
  modules: string[]
  points: string[]
  importance: 1 | 2 | 3
  dataDate?: string
  sample?: boolean
}

export interface FeedBoardItem {
  name: string
  change: string
  note?: string
}

export interface FeedWeekly {
  id: string
  week: string
  board?: FeedBoardItem[]
  highlights: string[]
  examLinks: { news: string; point: string; why: string }[]
  quiz: { question: string; options: string[]; answer: string; explain: string }
  nextWeek?: string[]
  sample?: boolean
}

export interface FeedQuarterly {
  id: string
  quarter: string
  trends: string[]
  textbookAlerts: { topic: string; textbook: string; reality: string; examNote: string }[]
  sample?: boolean
}

export interface FeedPractice {
  id: string
  date: string
  dataDate?: string
  point: string
  question: string
  options: string[]
  answer: string
  explain: string
}

export interface Feed {
  meta: { version: number; updatedAt: string; nextWeekly?: string; nextQuarterly?: string }
  daily: FeedDaily[]
  weekly: FeedWeekly[]
  quarterly: FeedQuarterly[]
  practice?: FeedPractice[]
}

export function useFeed() {
  const [feed, setFeed] = useState<Feed | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    fetch(`${import.meta.env.BASE_URL}feed.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: Feed) => alive && setFeed(d))
      .catch(() => alive && setError(true))
    return () => {
      alive = false
    }
  }, [])

  return { feed, error }
}

/** 闪卡筛选分组（与 Flashcards 页的 chips 同源：题库的 chapter/theme 去重） */
import { questions } from '@/data/questions'

export const flashcardGroups: string[] = (() => {
  const seen: string[] = ['概述', '投资需求分析', '债券', '股票']
  for (const q of questions) {
    for (const g of [q.chapter, q.theme]) {
      if (g && g !== '基础资产' && !seen.includes(g)) seen.push(g)
    }
  }
  return seen
})()

/** 知识点文案 → 闪卡筛选分组（如「外汇市场 · 汇率标价方法」→ 外汇） */
export function flashGroupForPoint(point: string): string | null {
  // 「综合」过宽，不做跳转目标
  for (const g of flashcardGroups) {
    if (g !== '综合' && point.includes(g)) return g
  }
  return null
}

/** 取最近一个日期、importance=3 的条目用于首页公告栏 */
export function tickerItems(feed: Feed | null): FeedDaily[] {
  if (!feed || feed.daily.length === 0) return []
  const latest = feed.daily.reduce((a, b) => (a.date >= b.date ? a : b)).date
  return feed.daily.filter((d) => d.date === latest && d.importance >= 3)
}

/**
 * 闪卡学习状态：轻量间隔重复（SRS-lite），纯 localStorage 实现。
 * 按当前登录账号隔离存储；游客使用默认键。
 * 每张卡记录：连续答对次数、答错次数、简易度、下次复习日期。
 */

export type Grade = 'again' | 'hard' | 'good' | 'easy'

export interface CardRecord {
  reps: number // 连续答对次数（again 归零）
  lapses: number // 累计答错次数
  ease: number // 简易度（越高间隔越长）
  next: string // YYYY-MM-DD 下次复习日期
  last: string // YYYY-MM-DD 最近评分日期
  starred?: boolean // 收藏
}

export type CardStateMap = Record<number, CardRecord>

export const CARD_SYNC_EVENT = 'chfp-cardstate-sync'

const PREFIX = 'chfp-cardstate-v1'
const STUDY_DAYS_PREFIX = 'chfp-study-days'

export function cardStateKeyFor(name: string | null): string {
  return name ? `${PREFIX}:${name}` : PREFIX
}

export function studyDaysKeyFor(name: string | null): string {
  return name ? `${STUDY_DAYS_PREFIX}:${name}` : STUDY_DAYS_PREFIX
}

export function todayStr(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function addDays(base: string, days: number): string {
  const d = new Date(`${base}T00:00:00`)
  d.setDate(d.getDate() + days)
  return todayStr(d)
}

export function loadCardState(key: string): CardStateMap {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return {}
    return JSON.parse(raw) as CardStateMap
  } catch {
    return {}
  }
}

export function saveCardState(key: string, state: CardStateMap) {
  try {
    localStorage.setItem(key, JSON.stringify(state))
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(CARD_SYNC_EVENT))
}

/** 返回本次评分结果：下次复习日期、是否新掌握、是否取消掌握 */
export function recordGrade(
  state: CardStateMap,
  idx: number,
  grade: Grade,
  today = todayStr(),
): { next: CardStateMap; nextDate: string; mastered: boolean; unmastered: boolean } {
  const prev = state[idx]
  const reps = prev?.reps ?? 0
  const lapses = prev?.lapses ?? 0
  const ease = prev?.ease ?? 2.0

  let newReps = reps
  let newLapses = lapses
  let newEase = ease
  let days: number
  let unmastered = false
  switch (grade) {
    case 'again':
      newReps = 0
      newLapses = lapses + 1
      newEase = Math.max(1.3, ease - 0.2)
      days = 1 // 明天再出现
      unmastered = reps >= 3 // 之前已掌握则取消
      break
    case 'hard':
      days = 2
      newEase = Math.max(1.3, ease - 0.05)
      break
    case 'good':
      newReps = reps + 1
      days = Math.round(4 * Math.min(ease, 3))
      break
    case 'easy':
      newReps = reps + 1
      newEase = ease + 0.1
      days = Math.round(7 * Math.min(ease, 3))
      break
  }
  const mastered = newReps >= 3 && !unmastered
  const nextDate = addDays(today, Math.max(1, days))
  const next: CardStateMap = {
    ...state,
    [idx]: { reps: newReps, lapses: newLapses, ease: newEase, next: nextDate, last: today, starred: prev?.starred },
  }
  return { next, nextDate, mastered, unmastered }
}

/** 今日是否已学习过（用于连续天数统计） */
export function loadStudyDays(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

/** 记录今天学习过；返回更新后的日期数组 */
export function touchStudyDay(key: string, today = todayStr()): string[] {
  const days = loadStudyDays(key)
  if (days.includes(today)) return days
  const next = [...days, today].sort()
  try {
    localStorage.setItem(key, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  return next
}

/** 连续学习天数（今天或昨天为起点往前数） */
export function streakOf(days: string[], today = todayStr()): number {
  const set = new Set(days)
  let cursor = today
  if (!set.has(cursor)) {
    // 今天还没学，从昨天开始算
    cursor = addDays(today, -1)
    if (!set.has(cursor)) return 0
  }
  let n = 0
  while (set.has(cursor)) {
    n += 1
    cursor = addDays(cursor, -1)
  }
  return n
}

/** 待复习张数：已到或已过复习日期的卡 */
export function dueCount(state: CardStateMap, total: number, today = todayStr()): number {
  let n = 0
  for (let i = 0; i < total; i += 1) {
    const r = state[i]
    if (r && r.next <= today) n += 1
  }
  return n
}

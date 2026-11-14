import data from './exams.json'

export interface ExamOption {
  letter: string
  text: string
}
export interface ExamQuestion {
  no: number
  stem: string
  options: ExamOption[]
  /** 正确答案字母集合（单选为 1 个，多选/不定项为多个） */
  correct: string
  explain: string
}
export interface ExamCase {
  title: string
  scenario: string
  /** 题型按板块判定：多项/不定项板块为 true（全部多选） */
  multi: boolean
  questions: ExamQuestion[]
}
export interface ExamSubject {
  id: string
  name: string
  total: number
  cases: ExamCase[]
}

export const examSubjects = data.subjects as ExamSubject[]

/** 每题分值：科目三 50×2；科目一/二 100×1 */
export function pointsFor(subjectId: string): number {
  return subjectId === 's3' ? 2 : 1
}

export function questionUid(subjectId: string, caseIdx: number, no: number): string {
  return `${subjectId}:${caseIdx}:${no}`
}

export interface ExamRecord {
  picked: string[]
  correct: boolean
}
export type ExamState = Record<string, ExamRecord>

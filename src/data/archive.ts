import { useEffect, useState } from 'react'

// ===== 长期行情归档（数据复盘页数据源）=====
// archive.json 由行情日报任务每日追加（只增不淘汰），前端只读。

export interface AssetTick {
  close: number
  pct: number
}

export interface ArchiveRecord {
  date: string
  index?: AssetTick
  gold?: AssetTick
  fx?: AssetTick
  boardsUp: string[]
  boardsDown: string[]
  intraday?: boolean
}

export interface Archive {
  meta: { version: number; updatedAt?: string }
  records: ArchiveRecord[]
}

export function useArchive() {
  const [archive, setArchive] = useState<Archive | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    fetch(`${import.meta.env.BASE_URL}archive.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: Archive) => alive && setArchive(d))
      .catch(() => alive && setError(true))
    return () => {
      alive = false
    }
  }, [])

  return { archive, error }
}

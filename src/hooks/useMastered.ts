import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'chfp-mastered-v2'

function readMastered(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as number[])
  } catch {
    return new Set()
  }
}

/** 已掌握题目的下标集合，闪卡与自测共用，localStorage 持久化 */
export function useMastered(total: number) {
  const [mastered, setMastered] = useState<Set<number>>(() => readMastered())

  useEffect(() => {
    const onSync = () => setMastered(readMastered())
    window.addEventListener('chfp-mastered-sync', onSync)
    return () => window.removeEventListener('chfp-mastered-sync', onSync)
  }, [])

  const toggle = useCallback((idx: number, value?: boolean) => {
    setMastered((prev) => {
      const next = new Set(prev)
      const has = next.has(idx)
      const target = value ?? !has
      if (target && !has) next.add(idx)
      if (!target && has) next.delete(idx)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      } catch {
        /* ignore */
      }
      window.dispatchEvent(new Event('chfp-mastered-sync'))
      return next
    })
  }, [])

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setMastered(new Set())
    window.dispatchEvent(new Event('chfp-mastered-sync'))
  }, [])

  return { mastered, toggle, reset, count: mastered.size, total }
}

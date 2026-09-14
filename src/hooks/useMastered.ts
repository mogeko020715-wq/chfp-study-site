import { useCallback, useEffect, useState } from 'react'
import { ACCOUNT_CHANGE_EVENT, getSession, masteredKeyFor } from '@/lib/account'

function readMastered(key: string): Set<number> {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as number[])
  } catch {
    return new Set()
  }
}

/**
 * 已掌握题目的下标集合，闪卡与自测共用，localStorage 持久化。
 * 按当前登录账号隔离存储；游客使用默认键（兼容旧数据）。
 */
export function useMastered(total: number) {
  const scope = getSession()
  const storageKey = masteredKeyFor(scope)
  const [mastered, setMastered] = useState<Set<number>>(() => readMastered(storageKey))

  // 账号切换时重新装载对应进度
  useEffect(() => {
    setMastered(readMastered(storageKey))
  }, [storageKey])

  useEffect(() => {
    const onSync = () => setMastered(readMastered(masteredKeyFor(getSession())))
    window.addEventListener('chfp-mastered-sync', onSync)
    window.addEventListener(ACCOUNT_CHANGE_EVENT, onSync)
    return () => {
      window.removeEventListener('chfp-mastered-sync', onSync)
      window.removeEventListener(ACCOUNT_CHANGE_EVENT, onSync)
    }
  }, [])

  const toggle = useCallback(
    (idx: number, value?: boolean) => {
      setMastered((prev) => {
        const next = new Set(prev)
        const has = next.has(idx)
        const target = value ?? !has
        if (target && !has) next.add(idx)
        if (!target && has) next.delete(idx)
        try {
          localStorage.setItem(masteredKeyFor(getSession()), JSON.stringify([...next]))
        } catch {
          /* ignore */
        }
        window.dispatchEvent(new Event('chfp-mastered-sync'))
        return next
      })
    },
    [],
  )

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(masteredKeyFor(getSession()))
    } catch {
      /* ignore */
    }
    setMastered(new Set())
    window.dispatchEvent(new Event('chfp-mastered-sync'))
  }, [])

  return { mastered, toggle, reset, count: mastered.size, total }
}

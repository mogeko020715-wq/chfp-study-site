import { useCallback, useEffect, useState } from 'react'
import { ACCOUNT_CHANGE_EVENT, getSession } from '@/lib/account'
import {
  CARD_SYNC_EVENT,
  cardStateKeyFor,
  loadCardState,
  saveCardState,
  type CardStateMap,
  type Grade,
} from '@/lib/cardState'

/**
 * 闪卡学习状态（SRS-lite），照 useMastered 的模式：
 * 按当前登录账号隔离存储，账号切换 / 自定义事件时重新装载。
 */
export function useCardStore() {
  const scope = getSession()
  const storageKey = cardStateKeyFor(scope)
  const [state, setState] = useState<CardStateMap>(() => loadCardState(storageKey))

  useEffect(() => {
    setState(loadCardState(storageKey))
  }, [storageKey])

  useEffect(() => {
    const onSync = () => setState(loadCardState(cardStateKeyFor(getSession())))
    window.addEventListener(CARD_SYNC_EVENT, onSync)
    window.addEventListener(ACCOUNT_CHANGE_EVENT, onSync)
    return () => {
      window.removeEventListener(CARD_SYNC_EVENT, onSync)
      window.removeEventListener(ACCOUNT_CHANGE_EVENT, onSync)
    }
  }, [])

  /** 更新某张卡的记录（评分、收藏等），自动持久化并广播 */
  const update = useCallback((idx: number, patch: Partial<CardStateMap[number]>) => {
    const key = cardStateKeyFor(getSession())
    const old = loadCardState(key)
    const next: CardStateMap = { ...old, [idx]: { ...old[idx], ...patch } as CardStateMap[number] }
    saveCardState(key, next)
    setState(next)
  }, [])

  /** 写入整张状态表（recordGrade 的结果） */
  const replace = useCallback((next: CardStateMap) => {
    saveCardState(cardStateKeyFor(getSession()), next)
    setState(next)
  }, [])

  return { state, update, replace }
}

export type { Grade }

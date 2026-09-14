import { useEffect, useState } from 'react'
import { ACCOUNT_CHANGE_EVENT, getSession } from '@/lib/account'

/** 当前登录的本地账号；未登录为 null（游客） */
export function useAccount() {
  const [user, setUser] = useState<string | null>(() => getSession())

  useEffect(() => {
    const onChange = () => setUser(getSession())
    window.addEventListener(ACCOUNT_CHANGE_EVENT, onChange)
    return () => window.removeEventListener(ACCOUNT_CHANGE_EVENT, onChange)
  }, [])

  return { user }
}

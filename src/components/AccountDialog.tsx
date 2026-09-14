import { useState } from 'react'
import { KeyRound, LogOut, Trash2, User, X } from 'lucide-react'
import {
  accountCreatedAt,
  changePassword,
  deleteAccount,
  login,
  logout,
  register,
} from '@/lib/account'

type Mode = 'login' | 'register' | 'manage'

interface Props {
  mode: Mode
  onClose: () => void
}

const inputCls =
  'w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500'
const btnPrimary =
  'w-full rounded-lg bg-neutral-900 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85'
const btnGhost =
  'inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900'

/** 本地账号弹窗：登录 / 注册 / 账号管理 */
export default function AccountDialog({ mode: initialMode, onClose }: Props) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [name, setName] = useState('')
  const [pwd, setPwd] = useState('')
  const [pwd2, setPwd2] = useState('')
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [user, setUser] = useState(() => localStorage.getItem('chfp-session'))

  const resetMessages = () => {
    setError('')
    setMessage('')
  }

  const submit = async (fn: () => Promise<void>) => {
    setError('')
    setMessage('')
    try {
      await fn()
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : '操作失败，请重试')
      return false
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="card relative w-full max-w-sm bg-white p-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          className="absolute right-4 top-4 text-neutral-400 transition-colors hover:text-neutral-900"
        >
          <X className="h-4 w-4" />
        </button>

        {mode === 'manage' && user ? (
          <div>
            <h2 className="text-title flex items-center gap-2 text-xl">
              <User className="h-5 w-5" />
              {user}
            </h2>
            <p className="text-caption mt-1">
              注册于 {accountCreatedAt(user) ? new Date(accountCreatedAt(user)!).toLocaleDateString() : '—'}
              · 学习进度仅保存在本机浏览器
            </p>

            <div className="mt-5 border-t border-neutral-200 pt-4">
              <p className="text-section flex items-center gap-1.5 text-sm">
                <KeyRound className="h-4 w-4" />
                修改密码
              </p>
              <form
                className="mt-3 space-y-2"
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (newPwd.length < 4) return setError('新密码至少 4 位')
                  const ok = await submit(() => changePassword(user, oldPwd, newPwd))
                  if (ok) {
                    setMessage('密码已更新')
                    setOldPwd('')
                    setNewPwd('')
                  }
                }}
              >
                <input type="password" placeholder="原密码" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} className={inputCls} />
                <input type="password" placeholder="新密码（至少 4 位）" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className={inputCls} />
                <button type="submit" className={btnPrimary}>
                  更新密码
                </button>
              </form>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-4">
              <button
                type="button"
                className={btnGhost}
                onClick={() => {
                  logout()
                  setUser(null)
                  setMode('login')
                  resetMessages()
                }}
              >
                <LogOut className="h-3.5 w-3.5" />
                退出登录
              </button>
              {confirmDelete ? (
                <span className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-600">确认删除？进度将清除</span>
                  <button
                    type="button"
                    className="rounded-lg bg-red-600 px-2.5 py-1.5 text-sm font-medium text-white"
                    onClick={() => {
                      deleteAccount(user)
                      onClose()
                    }}
                  >
                    删除
                  </button>
                  <button type="button" className="text-neutral-500 hover:text-neutral-900" onClick={() => setConfirmDelete(false)}>
                    取消
                  </button>
                </span>
              ) : (
                <button type="button" className={`${btnGhost} text-red-600`} onClick={() => setConfirmDelete(true)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  删除账号
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-title text-xl">{mode === 'login' ? '登录' : '注册账号'}</h2>
            <p className="text-caption mt-1">本地账号，数据仅保存在本机浏览器，用于隔离学习进度</p>
            <form
              className="mt-4 space-y-2"
              onSubmit={async (e) => {
                e.preventDefault()
                if (mode === 'register' && pwd !== pwd2) return setError('两次输入的密码不一致')
                const ok = await submit(() => (mode === 'login' ? login(name, pwd) : register(name, pwd)))
                if (ok) onClose()
              }}
            >
              <input placeholder="用户名（2-20 个字符）" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} autoFocus />
              <input type="password" placeholder="密码（至少 4 位）" value={pwd} onChange={(e) => setPwd(e.target.value)} className={inputCls} />
              {mode === 'register' && (
                <input type="password" placeholder="再输入一次密码" value={pwd2} onChange={(e) => setPwd2(e.target.value)} className={inputCls} />
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}
              {message && <p className="text-sm text-neutral-600">{message}</p>}
              <button type="submit" className={btnPrimary}>
                {mode === 'login' ? '登录' : '注册并登录'}
              </button>
            </form>
            <p className="text-caption mt-3 text-center">
              {mode === 'login' ? (
                <>
                  还没有账号？
                  <button type="button" className="text-neutral-900 underline underline-offset-2" onClick={() => { setMode('register'); resetMessages() }}>
                    注册一个
                  </button>
                </>
              ) : (
                <>
                  已有账号？
                  <button type="button" className="text-neutral-900 underline underline-offset-2" onClick={() => { setMode('login'); resetMessages() }}>
                    直接登录
                  </button>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

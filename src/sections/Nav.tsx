import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { Moon, Sun, UserRound } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useAccount } from '@/hooks/useAccount'
import AccountDialog from '@/components/AccountDialog'

const links = [
  { to: '/', label: '学习框架' },
  { to: '/flashcards', label: '闪卡记忆' },
  { to: '/quiz', label: '自测刷题' },
]

export default function Nav({ masteredCount }: { masteredCount: number }) {
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggle } = useTheme()
  const { user } = useAccount()
  const [dialog, setDialog] = useState<'login' | 'manage' | null>(null)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${
        scrolled ? 'border-neutral-200 bg-white/90 backdrop-blur' : 'border-transparent bg-white'
      }`}
    >
      <div className="mx-auto flex h-12 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="text-sm font-semibold text-neutral-900">
          CHFP 学习站
        </Link>
        <nav className="hidden items-center gap-4 sm:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive ? 'font-medium text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDialog(user ? 'manage' : 'login')}
            className="flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <UserRound className="h-4 w-4" />
            {user ?? '登录'}
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? '切换到日间模式' : '切换到夜间模式'}
            className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 transition-colors hover:text-neutral-900"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <span className="text-sm text-neutral-500">
            已掌握 <span className="font-medium text-neutral-900">{masteredCount}</span>
          </span>
        </div>
      </div>
      {dialog && <AccountDialog mode={dialog} onClose={() => setDialog(null)} />}
    </header>
  )
}

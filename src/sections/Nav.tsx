import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router'

const links = [
  { to: '/', label: '学习框架' },
  { to: '/flashcards', label: '闪卡记忆' },
  { to: '/quiz', label: '自测刷题' },
]

export default function Nav({ masteredCount }: { masteredCount: number }) {
  const [scrolled, setScrolled] = useState(false)
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
        <span className="text-sm text-neutral-500">
          已掌握 <span className="font-medium text-neutral-900">{masteredCount}</span>
        </span>
      </div>
    </header>
  )
}

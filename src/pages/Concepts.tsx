import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Search, Star } from 'lucide-react'
import Nav from '@/sections/Nav'
import Footer from '@/sections/Footer'
import { conceptCategories, concepts, type Concept } from '@/data/concepts'
import { demoComponents } from '@/components/concepts/demos'
import { questions } from '@/data/questions'
import { useMastered } from '@/hooks/useMastered'

const FAV_KEY = 'chfp-concept-favs'

function loadFavs(): Set<string> {
  try {
    const raw = localStorage.getItem(FAV_KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function SectionLabel({ children }: { children: string }) {
  return <p className="mb-1 text-[11px] font-medium tracking-wide text-neutral-400">{children}</p>
}

function ConceptCard({
  concept,
  fav,
  highlighted,
  onToggleFav,
}: {
  concept: Concept
  fav: boolean
  highlighted: boolean
  onToggleFav: (id: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMounted(true)
        setInView(entry.isIntersecting)
      },
      { rootMargin: '240px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const Demo = demoComponents[concept.demo]

  return (
    <article
      id={`concept-${concept.id}`}
      className={`concept-card card flex flex-col p-5 transition-shadow hover:border-neutral-400 ${
        highlighted ? 'border-neutral-900 shadow-[0_0_0_3px_var(--shadow-lift)] ring-2 ring-neutral-900' : ''
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-neutral-900">
          {concept.name}
          <span className="ml-2 text-xs font-normal text-neutral-400">{concept.en}</span>
        </h3>
        <button
          type="button"
          onClick={() => onToggleFav(concept.id)}
          aria-label={fav ? '取消收藏' : '收藏'}
          title={fav ? '取消收藏' : '收藏'}
          className={`mt-0.5 shrink-0 transition-colors ${
            fav ? 'text-amber-500' : 'text-neutral-300 hover:text-neutral-500'
          }`}
        >
          <Star className={`h-4 w-4 ${fav ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="mb-3">
        <SectionLabel>考生原话</SectionLabel>
        <p className="concept-quote text-sm leading-relaxed text-neutral-600">{concept.quote}</p>
      </div>
      <div className="mb-4">
        <SectionLabel>白话说清</SectionLabel>
        <p className="text-sm leading-relaxed text-neutral-800">{concept.answer}</p>
      </div>

      <div className="mt-auto">
        <SectionLabel>动手演示</SectionLabel>
        <div
          ref={ref}
          className={`concept-demo flex min-h-44 items-center rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-4 ${
            inView ? '' : 'demo-paused'
          }`}
        >
          {mounted ? (
            <div className="concept-demo-body w-full">
              <Demo />
            </div>
          ) : (
            <span className="w-full text-center text-xs text-neutral-300">滚动到此处加载演示…</span>
          )}
        </div>
      </div>

      <div className="mt-3">
        <SectionLabel>易错点</SectionLabel>
        <p className="text-xs leading-relaxed text-neutral-500">{concept.point}</p>
      </div>
      {concept.flashFilter && (
        <Link
          to={`/flashcards?f=${encodeURIComponent(concept.flashFilter)}`}
          className="mt-2 inline-flex text-xs font-medium text-neutral-500 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900"
        >
          刷相关闪卡 →
        </Link>
      )}
    </article>
  )
}

export default function ConceptsPage() {
  const { count } = useMastered(questions.length)
  const [searchParams] = useSearchParams()
  const target = searchParams.get('c')
  const [cat, setCat] = useState<string>('全部')
  const [query, setQuery] = useState('')
  const [favs, setFavs] = useState<Set<string>>(loadFavs)

  // 从闪卡等页面带 ?c=概念id 跳转：滚动定位并高亮目标卡片
  useEffect(() => {
    if (!target) return
    const t = setTimeout(() => {
      document.getElementById(`concept-${target}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 150)
    return () => clearTimeout(t)
  }, [target])

  const toggleFav = (id: string) => {
    setFavs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      localStorage.setItem(FAV_KEY, JSON.stringify([...next]))
      return next
    })
  }

  const q = query.trim().toLowerCase()
  const list = concepts.filter((c) => {
    const inCat = cat === '全部' ? true : cat === '收藏' ? favs.has(c.id) : c.cat === cat
    if (!inCat) return false
    if (!q) return true
    return [c.name, c.en, c.quote, c.answer, c.point].some((t) => t.toLowerCase().includes(q))
  })

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <Nav masteredCount={count} />
      <main className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6">
        <section className="py-10">
          <h2 className="text-title">概念图鉴</h2>
          <p className="text-body mt-3 max-w-2xl">
            每张卡片四段式：考生原话 → 白话说清 → 动手演示 → 易错点。拖动滑块、点点按钮，把概念变成直觉。
          </p>

          <div className="relative mt-6 max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索概念、原话或易错点…"
              className="w-full rounded-lg border border-neutral-300 bg-white py-2 pr-3 pl-9 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {['全部', ...conceptCategories, '收藏'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setCat(t)}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  cat === t
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
                }`}
              >
                {t}
                {t === '收藏' && favs.size > 0 && <span className="ml-1 text-xs opacity-70">{favs.size}</span>}
              </button>
            ))}
            <span className="ml-auto text-sm text-neutral-500">共 {list.length} 个概念</span>
          </div>

          {list.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((c) => (
                <ConceptCard
                  key={c.id}
                  concept={c}
                  fav={favs.has(c.id)}
                  highlighted={target === c.id}
                  onToggleFav={toggleFav}
                />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-neutral-500">
              {query
                ? `没有找到与「${query}」相关的概念`
                : cat === '收藏'
                  ? '还没有收藏的概念——点卡片右上角的星标收藏'
                  : '该分类下暂无概念'}
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

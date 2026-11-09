import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Star } from 'lucide-react'
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

function ConceptCard({
  concept,
  fav,
  onToggleFav,
}: {
  concept: Concept
  fav: boolean
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
    <article className="concept-card card flex flex-col p-5 hover:border-neutral-400">
      <div className="mb-1 flex items-start justify-between gap-2">
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

      <p className="concept-quote mb-2 text-sm leading-relaxed text-neutral-600">{concept.quote}</p>
      <p className="mb-4 text-sm leading-relaxed text-neutral-800">{concept.answer}</p>

      <div
        ref={ref}
        className={`concept-demo mt-auto flex min-h-44 items-center rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-4 ${
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

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-xs leading-relaxed text-neutral-400">考点：{concept.point}</p>
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
  const [cat, setCat] = useState<string>('全部')
  const [favs, setFavs] = useState<Set<string>>(loadFavs)

  const toggleFav = (id: string) => {
    setFavs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      localStorage.setItem(FAV_KEY, JSON.stringify([...next]))
      return next
    })
  }

  const list = concepts.filter((c) => (cat === '全部' ? true : cat === '收藏' ? favs.has(c.id) : c.cat === cat))

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <Nav masteredCount={count} />
      <main className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6">
        <section className="py-10">
          <h2 className="text-title">概念图鉴</h2>
          <p className="text-body mt-3 max-w-2xl">
            每张卡片是一个核心概念：上面是考生最常问的原话，下面是可以上手拨弄的迷你演示——拖动滑块、点点按钮，把概念变成直觉。
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
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
                <ConceptCard key={c.id} concept={c} fav={favs.has(c.id)} onToggleFav={toggleFav} />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-neutral-500">还没有收藏的概念——点卡片右上角的星标收藏</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

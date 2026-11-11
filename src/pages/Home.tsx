import { useMastered } from '@/hooks/useMastered'
import Nav from '@/sections/Nav'
import Hero from '@/sections/Hero'
import Curriculum from '@/sections/Curriculum'
import NewsTicker from '@/components/NewsTicker'
import Footer from '@/sections/Footer'

export default function Home() {
  const { count } = useMastered()

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <Nav masteredCount={count} />
      <main>
        <div className="pt-12">
          <NewsTicker />
        </div>
        <Hero />
        <Curriculum />
      </main>
      <Footer />
    </div>
  )
}

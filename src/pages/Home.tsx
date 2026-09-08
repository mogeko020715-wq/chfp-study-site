import '../App.css'
import { questions } from '@/data/questions'
import { useMastered } from '@/hooks/useMastered'
import Nav from '@/sections/Nav'
import Hero from '@/sections/Hero'
import Framework from '@/sections/Framework'
import Footer from '@/sections/Footer'

export default function Home() {
  const { count } = useMastered(questions.length)

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <Nav masteredCount={count} />
      <main>
        <Hero />
        <Framework />
      </main>
      <Footer />
    </div>
  )
}

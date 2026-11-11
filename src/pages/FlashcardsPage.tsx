import Nav from '@/sections/Nav'
import Flashcards from '@/sections/Flashcards'
import Footer from '@/sections/Footer'
import { useMastered } from '@/hooks/useMastered'

export default function FlashcardsPage() {
  const { count } = useMastered()
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <Nav masteredCount={count} />
      <main className="pt-12">
        <Flashcards />
      </main>
      <Footer />
    </div>
  )
}

import Nav from '@/sections/Nav'
import Quiz from '@/sections/Quiz'
import Footer from '@/sections/Footer'
import { useMastered } from '@/hooks/useMastered'
import { questions } from '@/data/questions'

export default function QuizPage() {
  const { count } = useMastered(questions.length)
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <Nav masteredCount={count} />
      <main className="pt-12">
        <Quiz />
      </main>
      <Footer />
    </div>
  )
}

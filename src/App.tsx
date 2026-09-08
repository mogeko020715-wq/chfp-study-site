import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import ModulePage from './pages/Module'
import ChapterPage from './pages/Chapter'
import PointPage from './pages/Point'
import FlashcardsPage from './pages/FlashcardsPage'
import QuizPage from './pages/QuizPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/module/:name" element={<ModulePage />} />
      <Route path="/module/:name/chapter/:title" element={<ChapterPage />} />
      <Route path="/module/:name/chapter/:title/point/:idx" element={<PointPage />} />
      <Route path="/flashcards" element={<FlashcardsPage />} />
      <Route path="/quiz" element={<QuizPage />} />
    </Routes>
  )
}

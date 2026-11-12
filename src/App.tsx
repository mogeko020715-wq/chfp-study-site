import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'

const Home = lazy(() => import('./pages/Home'))
const ModulePage = lazy(() => import('./pages/Module'))
const ChapterPage = lazy(() => import('./pages/Chapter'))
const PointPage = lazy(() => import('./pages/Point'))
const ConceptsPage = lazy(() => import('./pages/Concepts'))
const PracticePage = lazy(() => import('./pages/Practice'))
const FlashcardsPage = lazy(() => import('./pages/FlashcardsPage'))
const QuizPage = lazy(() => import('./pages/QuizPage'))
const NewsPage = lazy(() => import('./pages/News'))
const AnalysisPage = lazy(() => import('./pages/Analysis'))

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/module/:name" element={<ModulePage />} />
        <Route path="/module/:name/chapter/:title" element={<ChapterPage />} />
        <Route path="/module/:name/chapter/:title/point/:idx" element={<PointPage />} />
        <Route path="/concepts" element={<ConceptsPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
      </Routes>
    </Suspense>
  )
}

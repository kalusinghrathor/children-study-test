'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, Trophy, CheckCircle2, XCircle, ArrowRight,
  ArrowLeft, RotateCcw, Brain, Zap, Target, Heart,
  ChevronRight, BarChart3, Clock, Award
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { questions, subjectInfo, type SubjectName, type Difficulty, type Question } from '@/lib/questions'

// ==================== TYPES ====================
type ViewMode = 'home' | 'test' | 'result'

interface TestConfig {
  subject: SubjectName | 'all'
  difficulty: Difficulty | 'all'
  count: number
}

// ==================== UTILITY ====================
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// ==================== MAIN COMPONENT ====================
export default function Home() {
  const [view, setView] = useState<ViewMode>('home')
  const [config, setConfig] = useState<TestConfig>({ subject: 'all', difficulty: 'all', count: 20 })
  const [testQuestions, setTestQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Map<number, number>>(new Map())
  const [showAnswer, setShowAnswer] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [testComplete, setTestComplete] = useState(false)

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => setTimer(t => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  // Get filtered questions count
  const getFilteredCount = useCallback((subject: SubjectName | 'all', difficulty: Difficulty | 'all') => {
    return questions.filter(q =>
      (subject === 'all' || q.subject === subject) &&
      (difficulty === 'all' || q.difficulty === difficulty)
    ).length
  }, [])

  const filteredCount = useMemo(() => getFilteredCount(config.subject, config.difficulty), [config.subject, config.difficulty, getFilteredCount])

  // Start test
  const startTest = useCallback(() => {
    const filtered = questions.filter(q =>
      (config.subject === 'all' || q.subject === config.subject) &&
      (config.difficulty === 'all' || q.difficulty === config.difficulty)
    )
    const shuffled = shuffleArray(filtered)
    const selected = shuffled.slice(0, Math.min(config.count, shuffled.length))
    setTestQuestions(selected)
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setAnswers(new Map())
    setShowAnswer(false)
    setTimer(0)
    setIsTimerRunning(true)
    setTestComplete(false)
    setView('test')
  }, [config])

  // Handle answer
  const handleAnswer = useCallback((optionIndex: number) => {
    if (showAnswer) return
    setSelectedAnswer(optionIndex)
    setShowAnswer(true)
    const newAnswers = new Map(answers)
    newAnswers.set(currentIndex, optionIndex)
    setAnswers(newAnswers)
  }, [showAnswer, answers, currentIndex])

  // Next question
  const nextQuestion = useCallback(() => {
    if (currentIndex < testQuestions.length - 1) {
      setCurrentIndex(i => i + 1)
      setSelectedAnswer(null)
      setShowAnswer(false)
    } else {
      setIsTimerRunning(false)
      setTestComplete(true)
      setView('result')
    }
  }, [currentIndex, testQuestions.length])

  // Previous question
  const prevQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1)
      const prevAnswer = answers.get(currentIndex - 1)
      setSelectedAnswer(prevAnswer !== undefined ? prevAnswer : null)
      setShowAnswer(prevAnswer !== undefined)
    }
  }, [currentIndex, answers])

  // Calculate results
  const getResults = useCallback(() => {
    let correct = 0
    let wrong = 0
    let skipped = 0
    testQuestions.forEach((q, i) => {
      const ans = answers.get(i)
      if (ans === undefined) skipped++
      else if (ans === q.answer) correct++
      else wrong++
    })
    return { correct, wrong, skipped, total: testQuestions.length }
  }, [testQuestions, answers])

  const restartTest = useCallback(() => {
    setView('home')
    setConfig({ subject: 'all', difficulty: 'all', count: 20 })
  }, [])

  // ==================== SUBJECT STATS ====================
  const subjectStats = useMemo(() => {
    return (Object.keys(subjectInfo) as SubjectName[]).map(key => {
      const info = subjectInfo[key]
      const total = questions.filter(q => q.subject === key).length
      const easy = questions.filter(q => q.subject === key && q.difficulty === 'easy').length
      const medium = questions.filter(q => q.subject === key && q.difficulty === 'medium').length
      const hard = questions.filter(q => q.subject === key && q.difficulty === 'hard').length
      return { ...info, key, total, easy, medium, hard }
    })
  }, [])

  // ==================== HOME VIEW ====================
  if (view === 'home') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
        {/* Header */}
        <header className="relative overflow-hidden bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center gap-4 md:gap-6">
              {/* Image in top-left corner */}
              <motion.div
                className="shrink-0"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              >
                <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src={process.env.NODE_ENV === 'production' ? '/children-study-test/images/hero-image.webp' : '/images/hero-image.webp'}
                    alt="Children Study Test"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Title text */}
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-1.5" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.15)' }}>
                    📚 Children Study Test
                  </h1>
                  <p className="text-white/90 text-sm md:text-lg font-medium mb-3">
                    {questions.length}+ Questions • Test Your Knowledge! 🎯
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {subjectStats.map(s => (
                      <span key={s.key} className={`${s.bg} ${s.color} px-2.5 py-1 rounded-full text-xs font-bold border ${s.border}`}>
                        {s.emoji} {s.name} ({s.total})
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-6">
          {/* Config Card */}
          <Card className="rounded-3xl border-2 border-orange-200 bg-white/80 backdrop-blur shadow-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400" />
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-500" /> Configure Your Test
              </h2>

              {/* Subject Selection */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-600 mb-2">📖 Select Subject</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setConfig(c => ({ ...c, subject: 'all' }))}
                    className={`p-3 rounded-2xl border-2 text-sm font-bold transition-all ${
                      config.subject === 'all'
                        ? 'border-orange-400 bg-orange-50 text-orange-700 shadow-md'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-orange-200'
                    }`}
                  >
                    🌟 All Subjects ({questions.length})
                  </button>
                  {subjectStats.map(s => (
                    <button
                      key={s.key}
                      onClick={() => setConfig(c => ({ ...c, subject: s.key }))}
                      className={`p-3 rounded-2xl border-2 text-sm font-bold transition-all ${
                        config.subject === s.key
                          ? `${s.border} ${s.bg} ${s.color} shadow-md`
                          : 'border-gray-200 bg-white text-gray-600 hover:border-orange-200'
                      }`}
                    >
                      {s.emoji} {s.name} ({s.total})
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-600 mb-2">📊 Select Difficulty</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'all' as const, label: '🌟 All', count: filteredCount },
                    { key: 'easy' as const, label: '🟢 Easy', count: questions.filter(q => (config.subject === 'all' || q.subject === config.subject) && q.difficulty === 'easy').length },
                    { key: 'medium' as const, label: '🟡 Medium', count: questions.filter(q => (config.subject === 'all' || q.subject === config.subject) && q.difficulty === 'medium').length },
                    { key: 'hard' as const, label: '🔴 Hard', count: questions.filter(q => (config.subject === 'all' || q.subject === config.subject) && q.difficulty === 'hard').length },
                  ].map(d => (
                    <button
                      key={d.key}
                      onClick={() => setConfig(c => ({ ...c, difficulty: d.key }))}
                      className={`p-3 rounded-2xl border-2 text-sm font-bold transition-all ${
                        config.difficulty === d.key
                          ? 'border-orange-400 bg-orange-50 text-orange-700 shadow-md'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-orange-200'
                      }`}
                    >
                      {d.label} ({d.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-600 mb-2">📝 Number of Questions</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[10, 20, 30, 50, 100, filteredCount].filter(count => count < filteredCount || count === filteredCount).filter((count, i, arr) => arr.indexOf(count) === i).map(count => (
                    <button
                      key={count}
                      onClick={() => setConfig(c => ({ ...c, count }))}
                      className={`p-2.5 rounded-2xl border-2 text-sm font-bold transition-all ${
                        config.count === count
                          ? 'border-orange-400 bg-orange-50 text-orange-700 shadow-md'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-orange-200'
                      }`}
                    >
                      {count >= filteredCount ? 'All' : count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <motion.button
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 text-white font-bold text-lg shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startTest}
              >
                <Zap className="inline w-5 h-5 mr-2" />
                Start Test — {Math.min(config.count, filteredCount)} Questions
              </motion.button>
            </div>
          </Card>

          {/* Subject Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {subjectStats.map((s, i) => (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className={`rounded-2xl border-2 ${s.border} ${s.bg} p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{s.emoji}</span>
                    <div>
                      <h3 className={`font-bold ${s.color}`}>{s.name}</h3>
                      <p className="text-xs text-gray-500">{s.total} Questions</p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">🟢 {s.easy}</span>
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">🟡 {s.medium}</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full">🔴 {s.hard}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </main>

        <footer className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 py-4 text-center text-white text-sm">
          Made with <Heart className="inline w-3 h-3" /> for Little Learners • {questions.length}+ Questions 🎯
        </footer>
      </div>
    )
  }

  // ==================== TEST VIEW ====================
  if (view === 'test') {
    const q = testQuestions[currentIndex]
    const results = getResults()
    const correctSoFar = results.correct
    const answeredSoFar = results.correct + results.wrong

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 overflow-x-hidden">
        {/* Top Bar */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-orange-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-y-1 mb-2">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="text-base sm:text-lg font-bold text-gray-800 shrink-0">
                  Q{currentIndex + 1}/{testQuestions.length}
                </span>
                <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold shrink-0 ${
                  q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {q.difficulty === 'easy' ? '🟢 Easy' : q.difficulty === 'medium' ? '🟡 Medium' : '🔴 Hard'}
                </span>
                <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${subjectInfo[q.subject].bg} ${subjectInfo[q.subject].color}`}>
                  {subjectInfo[q.subject].emoji} {subjectInfo[q.subject].name}
                </span>
                <span className={`sm:hidden px-1.5 py-0.5 rounded-full text-[10px] font-bold ${subjectInfo[q.subject].bg} ${subjectInfo[q.subject].color}`}>
                  {subjectInfo[q.subject].emoji}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span className="font-bold">{correctSoFar}</span>
                </div>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                  <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                  <span className="font-bold">{results.wrong}</span>
                </div>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 bg-orange-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
                  <span className="font-bold text-orange-700">{formatTime(timer)}</span>
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / testQuestions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Area */}
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="rounded-3xl border-2 border-orange-200 bg-white shadow-lg overflow-hidden mb-4">
                <div className="p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed mb-6">
                    {q.question}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((option, idx) => {
                      let optionStyle = 'bg-gray-50 border-gray-200 hover:bg-orange-50 hover:border-orange-300 text-gray-700'
                      let icon = (
                        <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600 shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                      )

                      if (showAnswer) {
                        if (idx === q.answer) {
                          optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-md shadow-emerald-100'
                          icon = <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
                        } else if (idx === selectedAnswer && idx !== q.answer) {
                          optionStyle = 'bg-red-50 border-red-400 text-red-800 shadow-md shadow-red-100'
                          icon = <XCircle className="w-8 h-8 text-red-500 shrink-0" />
                        } else {
                          optionStyle = 'bg-gray-50 border-gray-200 text-gray-400'
                        }
                      }

                      return (
                        <motion.button
                          key={idx}
                          className={`p-4 rounded-2xl border-2 text-left font-semibold transition-all duration-200 flex items-center gap-3 ${optionStyle}`}
                          whileHover={!showAnswer ? { scale: 1.02 } : {}}
                          whileTap={!showAnswer ? { scale: 0.98 } : {}}
                          onClick={() => handleAnswer(idx)}
                        >
                          {icon}
                          <span className="text-base">{option}</span>
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Explanation area */}
                  {showAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 p-4 rounded-2xl ${
                        selectedAnswer === q.answer
                          ? 'bg-emerald-50 border border-emerald-200'
                          : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <p className={`font-bold text-sm ${
                        selectedAnswer === q.answer ? 'text-emerald-700' : 'text-red-700'
                      }`}>
                        {selectedAnswer === q.answer
                          ? '✅ Correct! Well done! 🎉'
                          : `❌ Wrong! The correct answer is: ${String.fromCharCode(65 + q.answer)}. ${q.options[q.answer]}`
                        }
                      </p>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 border-gray-200 bg-white font-semibold text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {showAnswer && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={nextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentIndex === testQuestions.length - 1 ? 'View Results 🏆' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}

            {!showAnswer && (
              <button
                onClick={nextQuestion}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 border-gray-200 bg-white font-semibold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Skip <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Question Navigator */}
          <Card className="mt-6 rounded-2xl border border-gray-200 bg-white/80 p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-600">Question Navigator</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {testQuestions.map((_, i) => {
                const ans = answers.get(i)
                let dotStyle = 'bg-gray-100 border-gray-300 text-gray-400'
                if (i === currentIndex) dotStyle = 'bg-orange-100 border-orange-400 text-orange-700 ring-2 ring-orange-300'
                else if (ans !== undefined && ans === testQuestions[i].answer) dotStyle = 'bg-emerald-100 border-emerald-400 text-emerald-700'
                else if (ans !== undefined) dotStyle = 'bg-red-100 border-red-400 text-red-700'

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentIndex(i)
                      const existingAns = answers.get(i)
                      setSelectedAnswer(existingAns !== undefined ? existingAns : null)
                      setShowAnswer(existingAns !== undefined)
                    }}
                    className={`w-9 h-9 rounded-xl border-2 text-xs font-bold transition-all ${dotStyle}`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </Card>
        </main>
      </div>
    )
  }

  // ==================== RESULT VIEW ====================
  if (view === 'result') {
    const results = getResults()
    const percentage = results.total > 0 ? Math.round((results.correct / results.total) * 100) : 0
    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : percentage >= 40 ? 'D' : 'F'
    const gradeEmoji = percentage >= 80 ? '🏆' : percentage >= 60 ? '🌟' : percentage >= 40 ? '💪' : '📚'
    const gradeMessage = percentage >= 80 ? 'Outstanding!' : percentage >= 60 ? 'Great Job!' : percentage >= 40 ? 'Good Effort!' : 'Keep Practicing!'

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="rounded-3xl border-2 border-orange-200 bg-white shadow-xl overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400" />
              <div className="p-6 md:p-8 text-center">
                {/* Grade */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="text-7xl mb-3"
                >
                  {gradeEmoji}
                </motion.div>
                <h2 className="text-3xl font-black text-gray-800 mb-1">{gradeMessage}</h2>
                <p className="text-gray-500 mb-6">You completed the test in {formatTime(timer)}</p>

                {/* Score Circle */}
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke={percentage >= 60 ? '#22c55e' : percentage >= 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8"
                      strokeDasharray={`${percentage * 2.64} ${264 - percentage * 2.64}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-gray-800">{percentage}%</span>
                    <span className="text-sm text-gray-500">Score</span>
                  </div>
                </div>

                {/* Grade Badge */}
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-2xl bg-gradient-to-r from-orange-100 to-pink-100 border border-orange-200 mb-6">
                  <Award className="w-5 h-5 text-orange-600" />
                  <span className="text-lg font-bold text-orange-700">Grade: {grade}</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                    <div className="text-2xl font-black text-emerald-700">{results.correct}</div>
                    <div className="text-xs text-emerald-600 font-medium">Correct</div>
                  </div>
                  <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
                    <XCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
                    <div className="text-2xl font-black text-red-700">{results.wrong}</div>
                    <div className="text-xs text-red-600 font-medium">Wrong</div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <div className="text-2xl font-black text-gray-700">{results.skipped}</div>
                    <div className="text-xs text-gray-600 font-medium">Skipped</div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200">
                    <Clock className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                    <div className="text-2xl font-black text-orange-700">{formatTime(timer)}</div>
                    <div className="text-xs text-orange-600 font-medium">Time</div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-8 h-8 ${
                        i < Math.round(percentage / 20) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Review Answers */}
                <div className="text-left max-h-80 overflow-y-auto custom-scrollbar mb-6">
                  <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Review Answers
                  </h3>
                  {testQuestions.map((q, i) => {
                    const ans = answers.get(i)
                    const isCorrect = ans === q.answer
                    const isSkipped = ans === undefined
                    return (
                      <div key={i} className={`p-3 rounded-xl mb-2 border ${
                        isSkipped ? 'bg-gray-50 border-gray-200' :
                        isCorrect ? 'bg-emerald-50 border-emerald-200' :
                        'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-start gap-2">
                          <span className="text-sm">
                            {isSkipped ? '⏭️' : isCorrect ? '✅' : '❌'}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-700">Q{i + 1}: {q.question}</p>
                            {(isSkipped || !isCorrect) && (
                              <p className="text-xs text-emerald-600 mt-1">
                                ✓ Correct: {q.options[q.answer]}
                              </p>
                            )}
                            {!isSkipped && (
                              <p className={`text-xs ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                                {isCorrect ? '✓' : '✗'} Your answer: {q.options[ans!]}
                              </p>
                            )}
                            {isSkipped && (
                              <p className="text-xs text-gray-500">
                                ⏭️ Skipped
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.button
                    onClick={restartTest}
                    className="px-8 py-3 rounded-2xl border-2 border-orange-300 bg-orange-50 text-orange-700 font-bold hover:bg-orange-100 transition-all"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <RotateCcw className="inline w-4 h-4 mr-2" /> New Test
                  </motion.button>
                  <motion.button
                    onClick={startTest}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold shadow-lg"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Zap className="inline w-4 h-4 mr-2" /> Retry Same Config
                  </motion.button>
                </div>
              </div>
            </Card>
          </motion.div>
        </main>

        <footer className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 py-4 text-center text-white text-sm mt-auto">
          Made with <Heart className="inline w-3 h-3" /> for Little Learners 🎯
        </footer>
      </div>
    )
  }

  return null
}

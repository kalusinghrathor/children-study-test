'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, Trophy, BookOpen, Sparkles, ArrowRight, CheckCircle2,
  XCircle, Zap, Heart, GraduationCap, Crown, Target, Brain, Lightbulb
} from 'lucide-react'
import { Card } from '@/components/ui/card'

// ==================== TYPES ====================
interface Subject {
  id: string
  name: string
  icon: string
  image: string
  color: string
  bgColor: string
  borderColor: string
  shadowColor: string
  description: string
  lessons: number
  progress: number
}

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  subject: string
  emoji: string
}

interface FunFact {
  id: number
  fact: string
  emoji: string
  category: string
  color: string
}

// ==================== DATA ====================
const subjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    icon: '🧮',
    image: '/images/math-character.png',
    color: 'text-orange-600',
    bgColor: 'bg-gradient-to-br from-orange-200 via-orange-100 to-yellow-100',
    borderColor: 'border-orange-300',
    shadowColor: 'shadow-orange-200/50',
    description: 'Numbers, shapes & fun puzzles!',
    lessons: 12,
    progress: 45,
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    image: '/images/science-character.png',
    color: 'text-emerald-600',
    bgColor: 'bg-gradient-to-br from-emerald-200 via-emerald-100 to-teal-100',
    borderColor: 'border-emerald-300',
    shadowColor: 'shadow-emerald-200/50',
    description: 'Explore the amazing world!',
    lessons: 10,
    progress: 30,
  },
  {
    id: 'english',
    name: 'English',
    icon: '📖',
    image: '/images/english-character.png',
    color: 'text-purple-600',
    bgColor: 'bg-gradient-to-br from-purple-200 via-purple-100 to-pink-100',
    borderColor: 'border-purple-300',
    shadowColor: 'shadow-purple-200/50',
    description: 'Read, write & tell stories!',
    lessons: 15,
    progress: 60,
  },
  {
    id: 'hindi',
    name: 'Hindi',
    icon: '📝',
    image: '/images/hindi-character.png',
    color: 'text-amber-600',
    bgColor: 'bg-gradient-to-br from-amber-200 via-amber-100 to-yellow-100',
    borderColor: 'border-amber-300',
    shadowColor: 'shadow-amber-200/50',
    description: 'सीखो हिंदी, जानो भारत!',
    lessons: 14,
    progress: 25,
  },
  {
    id: 'art',
    name: 'Art & Craft',
    icon: '🎨',
    image: '/images/art-character.png',
    color: 'text-pink-600',
    bgColor: 'bg-gradient-to-br from-pink-200 via-pink-100 to-rose-100',
    borderColor: 'border-pink-300',
    shadowColor: 'shadow-pink-200/50',
    description: 'Create colorful masterpieces!',
    lessons: 8,
    progress: 70,
  },
  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    image: '/images/music-character.png',
    color: 'text-cyan-600',
    bgColor: 'bg-gradient-to-br from-cyan-200 via-cyan-100 to-sky-100',
    borderColor: 'border-cyan-300',
    shadowColor: 'shadow-cyan-200/50',
    description: 'Sing, dance & play instruments!',
    lessons: 6,
    progress: 50,
  },
]

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is 5 + 3?',
    options: ['6', '7', '8', '9'],
    correctAnswer: 2,
    subject: 'Math',
    emoji: '🧮',
  },
  {
    id: 2,
    question: 'Which planet is closest to the Sun?',
    options: ['Venus', 'Mercury', 'Earth', 'Mars'],
    correctAnswer: 1,
    subject: 'Science',
    emoji: '🔬',
  },
  {
    id: 3,
    question: 'What is the opposite of "Big"?',
    options: ['Huge', 'Small', 'Tall', 'Long'],
    correctAnswer: 1,
    subject: 'English',
    emoji: '📖',
  },
  {
    id: 4,
    question: 'How many colors are in a rainbow?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2,
    subject: 'Science',
    emoji: '🌈',
  },
  {
    id: 5,
    question: 'What shape has 4 equal sides?',
    options: ['Circle', 'Triangle', 'Square', 'Rectangle'],
    correctAnswer: 2,
    subject: 'Math',
    emoji: '⬛',
  },
  {
    id: 6,
    question: 'Which animal says "Moo"?',
    options: ['Dog', 'Cat', 'Cow', 'Duck'],
    correctAnswer: 2,
    subject: 'English',
    emoji: '🐄',
  },
  {
    id: 7,
    question: 'What do plants need to grow?',
    options: ['Candy', 'Sunlight & Water', 'Only Soil', 'Nothing'],
    correctAnswer: 1,
    subject: 'Science',
    emoji: '🌱',
  },
  {
    id: 8,
    question: 'What comes after the number 9?',
    options: ['8', '11', '10', '12'],
    correctAnswer: 2,
    subject: 'Math',
    emoji: '🔢',
  },
]

const funFacts: FunFact[] = [
  { id: 1, fact: 'Octopuses have three hearts! 💕', emoji: '🐙', category: 'Science', color: 'from-rose-400 to-pink-500' },
  { id: 2, fact: 'Honey never spoils! 🍯', emoji: '🍯', category: 'Science', color: 'from-amber-400 to-orange-500' },
  { id: 3, fact: 'A group of flamingos is called a "flamboyance"! 🦩', emoji: '🦩', category: 'English', color: 'from-pink-400 to-rose-500' },
  { id: 4, fact: 'The moon has moonquakes! 🌙', emoji: '🌙', category: 'Science', color: 'from-indigo-400 to-purple-500' },
  { id: 5, fact: 'Butterflies taste with their feet! 🦋', emoji: '🦋', category: 'Science', color: 'from-emerald-400 to-teal-500' },
  { id: 6, fact: 'Bananas are berries, but strawberries are not! 🍌', emoji: '🍌', category: 'Science', color: 'from-yellow-400 to-amber-500' },
  { id: 7, fact: 'The shortest war lasted only 38 minutes! ⚔️', emoji: '⚔️', category: 'History', color: 'from-red-400 to-rose-500' },
  { id: 8, fact: 'A day on Venus is longer than a year on Venus! 🪐', emoji: '🪐', category: 'Science', color: 'from-violet-400 to-purple-500' },
]

// ==================== COMPONENTS ====================

function FloatingStars() {
  // Deterministic positions based on index to avoid hydration mismatch
  const starPositions = [
    { left: 8, top: 12, delay: 0, duration: 3 },
    { left: 22, top: 5, delay: 0.5, duration: 2.5 },
    { left: 45, top: 18, delay: 1, duration: 3.5 },
    { left: 68, top: 8, delay: 1.5, duration: 2.8 },
    { left: 85, top: 15, delay: 0.3, duration: 3.2 },
    { left: 15, top: 45, delay: 0.8, duration: 2.6 },
    { left: 35, top: 55, delay: 1.2, duration: 3.8 },
    { left: 55, top: 42, delay: 0.2, duration: 2.4 },
    { left: 78, top: 50, delay: 1.8, duration: 3.1 },
    { left: 92, top: 38, delay: 0.7, duration: 2.9 },
    { left: 50, top: 75, delay: 1.4, duration: 3.3 },
    { left: 72, top: 82, delay: 0.9, duration: 2.7 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {starPositions.map((star, i) => (
        <div
          key={i}
          className="absolute animate-sparkle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        >
          <Sparkles className="w-4 h-4 text-yellow-300 opacity-60" />
        </div>
      ))}
    </div>
  )
}

function SubjectCard({ subject, index }: { subject: Subject; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      className="card-3d"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`card-3d-inner relative rounded-3xl border-2 ${subject.borderColor} ${subject.bgColor} p-6 cursor-pointer transition-all duration-300 ${subject.shadowColor}`}
        style={{
          boxShadow: isHovered
            ? `0 20px 40px rgba(0,0,0,0.12), 0 0 0 4px rgba(255,255,255,0.5)`
            : `0 8px 20px rgba(0,0,0,0.06)`,
          transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        }}
      >
        {/* Decorative corner stars */}
        <div className="absolute -top-2 -right-2 animate-bounce-slow">
          <span className="text-2xl">⭐</span>
        </div>

        {/* Character Image */}
        <div className="relative w-28 h-28 mx-auto mb-4">
          <div
            className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg"
            style={{
              boxShadow: isHovered ? '0 8px 25px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <img
              src={subject.image}
              alt={`${subject.name} character`}
              className="w-full h-full object-cover"
              style={{
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.4s ease',
              }}
            />
          </div>
          {/* Floating emoji */}
          <motion.div
            className="absolute -bottom-1 -right-1 text-3xl"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
          >
            {subject.icon}
          </motion.div>
        </div>

        {/* Subject Info */}
        <h3 className={`text-xl font-bold text-center mb-1 ${subject.color}`}>
          {subject.name}
        </h3>
        <p className="text-sm text-gray-500 text-center mb-3">{subject.description}</p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{subject.lessons} Lessons</span>
            <span>{subject.progress}%</span>
          </div>
          <div className="relative h-3 bg-white/60 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${
                subject.id === 'math' ? 'from-orange-400 to-yellow-400' :
                subject.id === 'science' ? 'from-emerald-400 to-teal-400' :
                subject.id === 'english' ? 'from-purple-400 to-pink-400' :
                subject.id === 'hindi' ? 'from-amber-400 to-orange-400' :
                subject.id === 'art' ? 'from-pink-400 to-rose-400' :
                'from-cyan-400 to-sky-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${subject.progress}%` }}
              transition={{ delay: 0.5 + index * 0.1, duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Start Button */}
        <motion.button
          className={`w-full mt-4 py-2.5 rounded-2xl font-bold text-sm btn-bubbly bg-gradient-to-r ${
            subject.id === 'math' ? 'from-orange-400 to-orange-500 text-white' :
            subject.id === 'science' ? 'from-emerald-400 to-emerald-500 text-white' :
            subject.id === 'english' ? 'from-purple-400 to-purple-500 text-white' :
            subject.id === 'hindi' ? 'from-amber-400 to-amber-500 text-white' :
            subject.id === 'art' ? 'from-pink-400 to-pink-500 text-white' :
            'from-cyan-400 to-cyan-500 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Let&apos;s Learn! <ArrowRight className="inline w-4 h-4 ml-1" />
        </motion.button>
      </div>
    </motion.div>
  )
}

function QuizSection() {
  const [currentQ, setCurrentQ] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [answered, setAnswered] = useState(false)

  const question = quizQuestions[currentQ]

  const handleAnswer = (index: number) => {
    if (answered) return
    setSelectedAnswer(index)
    setAnswered(true)
    if (index === question.correctAnswer) {
      setScore(prev => prev + 1)
    }
    setTimeout(() => {
      if (currentQ < quizQuestions.length - 1) {
        setCurrentQ(prev => prev + 1)
        setSelectedAnswer(null)
        setAnswered(false)
      } else {
        setQuizComplete(true)
      }
    }, 1500)
  }

  const restartQuiz = () => {
    setCurrentQ(0)
    setSelectedAnswer(null)
    setScore(0)
    setQuizComplete(false)
    setShowResult(false)
    setAnswered(false)
  }

  return (
    <div className="relative">
      <div className="absolute -top-6 -left-4 text-5xl animate-float">🧠</div>

      <Card className="relative overflow-hidden rounded-3xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 shadow-xl">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400" />

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-violet-800">Daily Brain Quiz!</h3>
                <p className="text-sm text-violet-500">Test your knowledge</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/70 rounded-2xl px-4 py-2 border border-violet-200">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-violet-700">{score}/{quizQuestions.length}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-violet-500 mb-1">
              <span>Question {currentQ + 1} of {quizQuestions.length}</span>
              <span>{Math.round(((currentQ + 1) / quizQuestions.length) * 100)}%</span>
            </div>
            <div className="h-2.5 bg-violet-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-400 to-pink-400 rounded-full transition-all duration-500"
                style={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {!quizComplete ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {/* Question */}
                <div className="bg-white/70 rounded-2xl p-5 mb-5 border border-violet-100 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{question.emoji}</span>
                    <div>
                      <span className="inline-block px-3 py-0.5 rounded-full bg-violet-100 text-violet-600 text-xs font-semibold mb-2">
                        {question.subject}
                      </span>
                      <h4 className="text-lg font-bold text-gray-800">{question.question}</h4>
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {question.options.map((option, idx) => {
                    let optionStyle = 'bg-white/60 border-violet-200 hover:bg-violet-50 hover:border-violet-300'

                    if (answered) {
                      if (idx === question.correctAnswer) {
                        optionStyle = 'bg-emerald-100 border-emerald-400 text-emerald-700'
                      } else if (idx === selectedAnswer && idx !== question.correctAnswer) {
                        optionStyle = 'bg-red-100 border-red-400 text-red-700'
                      }
                    }

                    return (
                      <motion.button
                        key={idx}
                        className={`p-4 rounded-2xl border-2 text-left font-semibold transition-all duration-200 ${optionStyle} ${
                          !answered ? 'cursor-pointer' : 'cursor-default'
                        }`}
                        whileHover={!answered ? { scale: 1.03 } : {}}
                        whileTap={!answered ? { scale: 0.97 } : {}}
                        onClick={() => handleAnswer(idx)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-sm font-bold text-violet-600 shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                          {answered && idx === question.correctAnswer && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />
                          )}
                          {answered && idx === selectedAnswer && idx !== question.correctAnswer && (
                            <XCircle className="w-5 h-5 text-red-500 ml-auto" />
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="text-6xl mb-4 animate-bounce-slow">🏆</div>
              <h4 className="text-2xl font-bold text-violet-800 mb-2">
                {score >= quizQuestions.length / 2 ? 'Amazing Job!' : 'Good Try!'}
              </h4>
              <p className="text-violet-600 mb-4">
                You got <span className="font-bold text-2xl text-violet-800">{score}</span> out of{' '}
                <span className="font-bold">{quizQuestions.length}</span> correct!
              </p>
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(quizQuestions.length)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-8 h-8 ${i < score ? 'text-yellow-400 fill-yellow-400 star-glow' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <motion.button
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-violet-400 to-purple-500 text-white font-bold btn-bubbly shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={restartQuiz}
              >
                Play Again! 🔄
              </motion.button>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  )
}

function FunFactsCarousel() {
  const [currentFact, setCurrentFact] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFact(prev => (prev + 1) % funFacts.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Card className="relative overflow-hidden rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 shadow-xl">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400" />

      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-amber-800">Fun Facts!</h3>
            <p className="text-sm text-amber-600">Did you know? 🤔</p>
          </div>
        </div>

        <div className="relative min-h-[120px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFact}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className={`bg-gradient-to-r ${funFacts[currentFact].color} rounded-2xl p-5 text-white shadow-lg`}>
                <div className="flex items-start gap-3">
                  <span className="text-4xl shrink-0">{funFacts[currentFact].emoji}</span>
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold mb-2">
                      {funFacts[currentFact].category}
                    </span>
                    <p className="text-lg font-bold leading-relaxed">{funFacts[currentFact].fact}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {funFacts.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === currentFact ? 'bg-amber-500 w-8' : 'bg-amber-200 hover:bg-amber-300'
              }`}
              onClick={() => setCurrentFact(i)}
            />
          ))}
        </div>
      </div>
    </Card>
  )
}

function StarProgress() {
  const totalStars = 50
  const earnedStars = 28
  const level = Math.floor(earnedStars / 10) + 1
  const starsForNextLevel = level * 10
  const progressInLevel = ((earnedStars % 10) / 10) * 100

  return (
    <Card className="relative overflow-hidden rounded-3xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 shadow-xl">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400" />

      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-rose-800">My Progress</h3>
            <p className="text-sm text-rose-600">Keep learning to earn stars!</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          {/* Level Card */}
          <div className="bg-white/70 rounded-2xl p-4 border border-rose-100 text-center">
            <div className="text-3xl mb-1">🏅</div>
            <div className="text-2xl font-bold text-rose-700">Level {level}</div>
            <div className="text-xs text-rose-500">Super Learner!</div>
          </div>

          {/* Stars Card */}
          <div className="bg-white/70 rounded-2xl p-4 border border-rose-100 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 star-glow" />
            </div>
            <div className="text-2xl font-bold text-rose-700">{earnedStars}</div>
            <div className="text-xs text-rose-500">of {totalStars} Stars</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white/70 rounded-2xl p-4 border border-rose-100 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-rose-700">Level {level} Progress</span>
            <span className="text-sm font-bold text-rose-600">
              {earnedStars % 10}/{starsForNextLevel - (level - 1) * 10}
            </span>
          </div>
          <div className="h-4 bg-rose-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressInLevel}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="flex flex-wrap gap-2">
          {[
            { emoji: '🌟', label: 'First Star', earned: true },
            { emoji: '📚', label: 'Bookworm', earned: true },
            { emoji: '🧮', label: 'Math Whiz', earned: true },
            { emoji: '🔬', label: 'Scientist', earned: false },
            { emoji: '🎨', label: 'Artist', earned: false },
            { emoji: '🏆', label: 'Champion', earned: false },
          ].map((badge, i) => (
            <motion.div
              key={i}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                badge.earned
                  ? 'bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-300 text-amber-700'
                  : 'bg-gray-100 border-gray-200 text-gray-400 opacity-50'
              }`}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <span>{badge.emoji}</span>
              <span>{badge.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function DailyChallenge() {
  const [streak, setStreak] = useState(5)
  const [challengeDone, setChallengeDone] = useState(false)

  return (
    <Card className="relative overflow-hidden rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 shadow-xl">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-emerald-800">Daily Challenge</h3>
            <p className="text-sm text-emerald-600">Complete today&apos;s mission!</p>
          </div>
        </div>

        {/* Streak Counter */}
        <div className="bg-white/70 rounded-2xl p-4 border border-emerald-100 mb-4 flex items-center gap-3">
          <div className="text-3xl">🔥</div>
          <div>
            <div className="text-2xl font-bold text-emerald-700">{streak} Days</div>
            <div className="text-xs text-emerald-500">Learning Streak!</div>
          </div>
          <div className="ml-auto flex gap-0.5">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-8 rounded-full ${
                  i < streak ? 'bg-gradient-to-t from-emerald-400 to-emerald-300' : 'bg-emerald-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Challenge */}
        <div className="bg-white/70 rounded-2xl p-4 border border-emerald-100 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🎯</span>
            <div className="flex-1">
              <h4 className="font-bold text-emerald-800 mb-1">Today&apos;s Mission</h4>
              <p className="text-sm text-emerald-600">Complete 2 lessons in any subject and earn 3 stars!</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2.5 bg-emerald-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${challengeDone ? 'w-full' : 'w-1/3'} bg-gradient-to-r from-emerald-400 to-teal-400`} />
                </div>
                <span className="text-xs font-semibold text-emerald-600">{challengeDone ? '100' : '33'}%</span>
              </div>
            </div>
          </div>
        </div>

        <motion.button
          className={`w-full py-3 rounded-2xl font-bold btn-bubbly shadow-lg ${
            challengeDone
              ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white'
              : 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white'
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setChallengeDone(!challengeDone)}
        >
          {challengeDone ? (
            <>
              <CheckCircle2 className="inline w-5 h-5 mr-2" />
              Challenge Complete! 🎉
            </>
          ) : (
            <>
              <Zap className="inline w-5 h-5 mr-2" />
              Start Challenge!
            </>
          )}
        </motion.button>
      </div>
    </Card>
  )
}

// ==================== MAIN PAGE ====================
export default function Home() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* ====== HEADER ====== */}
      <header className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 animate-rainbow opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-30" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Mascot */}
            <motion.div
              className="relative shrink-0"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white/20 backdrop-blur-sm">
                <img
                  src="/images/owl-mascot.png"
                  alt="Owl Mascot - Professor Owly"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating elements around mascot */}
              <motion.div
                className="absolute -top-2 -left-2 text-2xl"
                animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              >
                ⭐
              </motion.div>
              <motion.div
                className="absolute -bottom-1 -right-1 text-2xl"
                animate={{ y: [0, -6, 0], rotate: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
              >
                📚
              </motion.div>
            </motion.div>

            {/* Title */}
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-white/80 text-sm md:text-base font-medium mb-1">
                  {greeting}, Little Scholar! 👋
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 tracking-tight">
                  <span className="inline-block" style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.15)' }}>
                    Fun Learning Zone
                  </span>
                </h1>
                <p className="text-white/90 text-base md:text-lg font-medium max-w-lg">
                  Learn, play, and grow with your favorite subjects! 🚀✨
                </p>
              </motion.div>

              {/* Quick stats */}
              <motion.div
                className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {[
                  { icon: <BookOpen className="w-4 h-4" />, label: '6 Subjects', bg: 'bg-white/20' },
                  { icon: <Star className="w-4 h-4" />, label: '28 Stars', bg: 'bg-white/20' },
                  { icon: <Trophy className="w-4 h-4" />, label: 'Level 3', bg: 'bg-white/20' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`${stat.bg} backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2 text-white text-sm font-semibold border border-white/20`}
                  >
                    {stat.icon}
                    {stat.label}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 40L48 35C96 30 192 20 288 25C384 30 480 50 576 55C672 60 768 50 864 40C960 30 1056 20 1152 25C1248 30 1344 50 1392 55L1440 60V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z"
              fill="#FFF8E7"
              className="fill-amber-50"
            />
          </svg>
        </div>

        <FloatingStars />
      </header>

      {/* ====== MAIN CONTENT ====== */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-12">
        {/* Section: Subjects */}
        <section>
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-800">
                Choose Your Subject! 🎯
              </h2>
              <p className="text-sm text-gray-500">Pick a subject and start your adventure</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjects.map((subject, index) => (
              <SubjectCard key={subject.id} subject={subject} index={index} />
            ))}
          </div>
        </section>

        {/* Section: Quiz, Fun Facts, Progress & Challenge */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <QuizSection />
            <DailyChallenge />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <FunFactsCarousel />
            <StarProgress />
          </div>
        </section>

        {/* Section: Motivational Banner */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="relative overflow-hidden rounded-3xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-100 via-amber-100 to-orange-100 shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400" />
            <div className="p-6 md:p-8 text-center">
              <div className="flex justify-center gap-4 mb-4 text-4xl">
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  🌟
                </motion.span>
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                >
                  📖
                </motion.span>
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                >
                  🎨
                </motion.span>
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
                >
                  🎵
                </motion.span>
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.8 }}
                >
                  🚀
                </motion.span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-amber-800 mb-2">
                &quot;Every day is a chance to learn something new!&quot;
              </h3>
              <p className="text-amber-600 font-medium">
                Keep going, keep growing, and never stop exploring! 🌈✨
              </p>
            </div>
          </Card>
        </motion.section>
      </main>

      {/* ====== FOOTER ====== */}
      <footer className="relative mt-auto bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400">
        <div className="absolute top-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
            <path
              d="M0 20L48 17C96 14 192 8 288 12C384 16 480 30 576 33C672 36 768 28 864 22C960 16 1056 12 1152 14C1248 16 1344 24 1392 28L1440 32V40H0V20Z"
              fill="currentColor"
              className="text-amber-50"
            />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🦉</span>
            <span className="text-white font-bold text-lg">Fun Learning Zone</span>
          </div>
          <p className="text-white/80 text-sm">
            Made with <Heart className="inline w-4 h-4 text-red-200 fill-red-200" /> for little learners everywhere
          </p>
          <div className="flex justify-center gap-3 mt-3">
            {['🌟', '📚', '🔬', '🎨', '🎵', '🧮'].map((emoji, i) => (
              <motion.span
                key={i}
                className="text-xl"
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.15 }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

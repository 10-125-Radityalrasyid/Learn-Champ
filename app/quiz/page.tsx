'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'

import {
  FlaskConical,
  Landmark,
  Globe,
  Film,
  Music,
  Book,
  Tv,
  Gamepad2,
  Palette,
  Car,
  Cat,
  Trophy,
  Brain,
  Code,
  Sigma,
  Award,
} from 'lucide-react'

type OTDBQuestion = {
  category: string
  type: 'multiple' | 'boolean'
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

type OTDBRawQuestion = {
  category: string
  type: 'multiple' | 'boolean'
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

type QuizPhase = 'setup' | 'loading' | 'playing' | 'finished' | 'error'
type Category = { id: number; name: string }

const QUESTION_AMOUNTS = [5, 10, 15]
const MAX_POINTS = 500
type Diff = 'easy' | 'medium' | 'hard'

type QItem = {
  q: OTDBQuestion
  options: string[]
}

const getCategoryTheme = (categoryName: string) => {
  const cat = categoryName.toLowerCase()
  const defaultTheme = {
    base: 'bg-indigo-500',
    hover: 'hover:bg-indigo-600',
    text: 'text-indigo-900',
    border: 'border-indigo-300',
    bg: 'bg-indigo-50',
    badge: 'bg-indigo-100 text-indigo-800',
    ring: 'focus:ring-indigo-400',
  }

  if (cat.includes('science') || cat.includes('math') || cat.includes('computer')) {
    return {
      base: 'bg-blue-500',
      hover: 'hover:bg-blue-600',
      text: 'text-blue-900',
      border: 'border-blue-300',
      bg: 'bg-blue-50',
      badge: 'bg-blue-100 text-blue-800',
      ring: 'focus:ring-blue-400',
    }
  }
  if (cat.includes('history') || cat.includes('politics')) {
    return {
      base: 'bg-amber-500',
      hover: 'hover:bg-amber-600',
      text: 'text-amber-900',
      border: 'border-amber-300',
      bg: 'bg-amber-50',
      badge: 'bg-amber-100 text-amber-800',
      ring: 'focus:ring-amber-400',
    }
  }
  if (cat.includes('geography') || cat.includes('animals') || cat.includes('vehicles')) {
    return {
      base: 'bg-emerald-500',
      hover: 'hover:bg-emerald-600',
      text: 'text-emerald-900',
      border: 'border-emerald-300',
      bg: 'bg-emerald-50',
      badge: 'bg-emerald-100 text-emerald-800',
      ring: 'focus:ring-emerald-400',
    }
  }
  if (cat.includes('art') || cat.includes('celebrities') || cat.includes('entertainment')) {
    return {
      base: 'bg-purple-500',
      hover: 'hover:bg-purple-600',
      text: 'text-purple-900',
      border: 'border-purple-300',
      bg: 'bg-purple-50',
      badge: 'bg-purple-100 text-purple-800',
      ring: 'focus:ring-purple-400',
    }
  }
  if (cat.includes('sports') || cat.includes('mythology')) {
    return {
      base: 'bg-orange-500',
      hover: 'hover:bg-orange-600',
      text: 'text-orange-900',
      border: 'border-orange-300',
      bg: 'bg-orange-50',
      badge: 'bg-orange-100 text-orange-800',
      ring: 'focus:ring-orange-400',
    }
  }
  if (cat.includes('general')) {
    return {
      base: 'bg-lime-500',
      hover: 'hover:bg-lime-600',
      text: 'text-lime-900',
      border: 'border-lime-300',
      bg: 'bg-lime-50',
      badge: 'bg-lime-100 text-lime-800',
      ring: 'focus:ring-lime-400',
    }
  }
  return defaultTheme
}

const getCategoryIcon = (categoryName: string): React.ElementType => {
  const cat = categoryName.toLowerCase()
  if (cat.includes('computer')) return Code
  if (cat.includes('math')) return Sigma
  if (cat.includes('science')) return FlaskConical
  if (cat.includes('history')) return Landmark
  if (cat.includes('politics')) return Landmark
  if (cat.includes('geography')) return Globe
  if (cat.includes('animals')) return Cat
  if (cat.includes('vehicles')) return Car
  if (cat.includes('film')) return Film
  if (cat.includes('music')) return Music
  if (cat.includes('television')) return Tv
  if (cat.includes('video games')) return Gamepad2
  if (cat.includes('books')) return Book
  if (cat.includes('entertainment')) return Film
  if (cat.includes('art')) return Palette
  if (cat.includes('sports')) return Trophy
  if (cat.includes('general knowledge')) return Brain

  return Award
}

function SectionShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate min-h-screen font-mono">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,_#89E5F0_0%,_#B6EFF6_25%,_#CCF3FA_67%,_#FAE9FF_100%)]" />

      <main className="px-6 lg:px-8 py-10 sm:py-14 md:min-h-screen md:flex md:items-center md:justify-center">
        <div className="w-full max-w-3xl">{children}</div>
      </main>
    </div>
  )
}

function CategorySkeleton() {
  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-white animate-pulse">
      <div className="w-full h-16 bg-gray-300 rounded mb-3"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  )
}

function CategoryBox({
  name,
  theme,
  onClick,
  icon: IconComponent,
}: {
  name: string
  theme: { border: string; bg: string; text: string; ring: string; base: string; hover: string }
  onClick: () => void
  icon: React.ElementType
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 flex flex-col items-center justify-center text-center h-28 ${theme.bg} ${theme.border} ${theme.ring}`}
    >
      <IconComponent className={`h-6 w-6 mb-2 ${theme.text}`} strokeWidth={1.5} />
      <span className={`text-sm font-semibold ${theme.text} leading-tight`}>{name}</span>
    </button>
  )
}

export default function QuizPage() {
  const [phase, setPhase] = useState<QuizPhase>('setup')
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [catName, setCatName] = useState<string | 'Any Category'>('Any Category')
  const [difficulty, setDifficulty] = useState<Diff | 'any'>('any')
  const [amount, setAmount] = useState<number>(QUESTION_AMOUNTS[0])
  const [items, setItems] = useState<QItem[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [selections, setSelections] = useState<(string | '')[]>(
    Array(QUESTION_AMOUNTS[0]).fill('')
  )
  const [score, setScore] = useState(0)
  const [displayPoints, setDisplayPoints] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)

  // 🔧 Ref untuk mencegah next() dipanggil berulang
  const isAdvancingRef = useRef(false)
  const timerActiveRef = useRef(false)

  useEffect(() => {
    if (phase !== 'setup') return
    const loadCats = async () => {
      try {
        setLoadingCategories(true)
        const r = await fetch('https://opentdb.com/api_category.php', { cache: 'no-store' })
        const d = await r.json()
        const arr: Category[] = d?.trivia_categories ?? []
        setCategories(arr)
      } catch {
        setCategories([])
      } finally {
        setLoadingCategories(false)
      }
    }
    loadCats()
  }, [phase])

  useEffect(() => {
    if (phase === 'setup') {
      setSelections(Array(amount).fill(''))
      setSelected(null)
      setScore(0)
      setDisplayPoints(0)
      setItems([])
      setIndex(0)
    }
  }, [amount, phase])

  // ✅ FIXED: Gunakan debouncing dengan ref
  const next = useCallback(() => {
    if (isAdvancingRef.current) return
    isAdvancingRef.current = true

    // Reset flag setelah delay kecil
    setTimeout(() => {
      isAdvancingRef.current = false
    }, 300)

    if (index + 1 < items.length) {
      setIndex((i) => i + 1)
      setSelected(null)
      setSelections((prev) => {
        const next = [...prev]
        next[index] = '' // Tandai sebagai tidak dijawab
        return next
      })
    } else {
      setPhase('finished')
    }
  }, [index, items.length])

  // ✅ FIXED: Timer effect dengan dependency yang tepat
  useEffect(() => {
    if (phase !== 'playing') return
    if (selected !== null) return // Jika sudah jawab, jangan jalankan timer
    if (timerActiveRef.current) return // Jika timer sudah aktif, jangan jalankan lagi

    timerActiveRef.current = true
    setTimeLeft(15)

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          timerActiveRef.current = false
          next() // Aman, hanya dipanggil sekali
          return 15
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(interval)
      timerActiveRef.current = false
    }
  }, [phase, index]) // 🧠 Hanya depend on phase dan index

  async function startQuiz(categoryId: number | 'any', categoryName: string) {
    try {
      setPhase('loading')
      setCatName(categoryName)
      const params = new URLSearchParams()
      params.set('amount', String(amount))
      params.set('type', 'multiple')
      if (categoryId !== 'any') params.set('category', String(categoryId))
      if (difficulty !== 'any') params.set('difficulty', difficulty)

      const r = await fetch(`https://opentdb.com/api.php?${params.toString()}`, {
        cache: 'no-store',
      })
      const data = await r.json()
      const qs: OTDBQuestion[] = (data.results ?? []).map(decodeQuestion)
      if (!qs.length) {
        toast.error('Tidak ada soal ditemukan', {
          description: 'Coba kurangi jumlah soal atau ganti kategori/difficulty.',
        })
        setPhase('setup')
        return
      }

      const prepped: QItem[] = qs.map((q) => ({
        q,
        options: shuffle([q.correct_answer, ...q.incorrect_answers]),
      }))

      setItems(prepped)
      setIndex(0)
      setSelected(null)
      setSelections(Array(qs.length).fill(''))
      setScore(0)
      setDisplayPoints(0)
      setPhase('playing')
    } catch {
      setPhase('error')
    }
  }

  const current = items[index]
  const totalQuestions = items.length || amount || QUESTION_AMOUNTS[0]
  const progressPct = items.length ? (index / items.length) * 100 : 0

  const currentTheme = phase === 'playing' ? getCategoryTheme(catName) : getCategoryTheme('general')

  function onSelectAnswer(a: string) {
    if (selected) return
    setSelected(a)
    setSelections((prev) => {
      const next = [...prev]
      next[index] = a
      return next
    })
    if (a === current.q.correct_answer) {
      const newScore = score + 1
      setScore(newScore)

      const newPoints = Math.round((newScore / totalQuestions) * MAX_POINTS)
      setDisplayPoints(newPoints)

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#89E5F0', '#B6EFF6', '#CCF3FA', '#A8E6CF', '#D1FAE5'],
      })
    }
  }

  async function submitScore() {
    try {
      setSubmitting(true)
      const totalQuestions = items.length || amount || QUESTION_AMOUNTS[0]
      const points = totalQuestions ? Math.round((score / totalQuestions) * MAX_POINTS) : 0

      const r = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          points,
          category: catName,
          difficulty: difficulty === 'any' ? undefined : difficulty,
        }),
      })
      setSubmitting(false)
      if (!r.ok) {
        toast.error('Failed to submit score')
      } else {
        toast.success('Score submitted! 🎉', {
          action: {
            label: 'View Leaderboard',
            onClick: () => (window.location.href = '/leaderboard'),
          },
        })
      }
    } catch {
      setSubmitting(false)
      toast.error('Failed to submit score')
    }
  }

  function handlePlayAgain() {
    setPhase('setup')
  }

  if (phase === 'setup') {
    return (
      <SectionShell>
        <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-gray-900">1. Manage your quiz</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <Select
                value={String(difficulty)}
                onValueChange={(val: 'any' | Diff) => setDifficulty(val)}
              >
                <SelectTrigger className="w-full bg-white/70 text-gray-900 border-gray-300">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border-gray-300">
                  <SelectItem value="any">Random</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <Select
                value={String(amount)}
                onValueChange={(val: `${number}`) => setAmount(Number(val))}
              >
                <SelectTrigger className="w-full bg-white/70 text-gray-900 border-gray-300">
                  <SelectValue placeholder={String(QUESTION_AMOUNTS[0])} />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border-gray-300">
                  {QUESTION_AMOUNTS.map((amt) => (
                    <SelectItem key={amt} value={String(amt)}>
                      {amt} Questions
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">2. Choose The Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <CategoryBox
                name="Any Category"
                theme={getCategoryTheme('general')}
                onClick={() => startQuiz('any', 'Any Category')}
                icon={Globe}
              />

              {loadingCategories
                ? Array.from({ length: 12 }).map((_, i) => <CategorySkeleton key={`skeleton-${i}`} />)
                : categories.map((c) => (
                    <CategoryBox
                      key={c.id}
                      name={c.name}
                      theme={getCategoryTheme(c.name)}
                      onClick={() => startQuiz(c.id, c.name)}
                      icon={getCategoryIcon(c.name)}
                    />
                  ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              variant="secondary"
              className="bg-white/70 hover:bg-white text-gray-900 border border-gray-300 w-full"
            >
              <Link href="/">Cancel</Link>
            </Button>
          </CardFooter>
        </Card>
      </SectionShell>
    )
  }

  if (phase === 'loading') {
    return (
      <SectionShell>
        <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Loading quiz…</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-2 w-full rounded bg-gray-200 overflow-hidden">
              <div className="h-2 w-1/3 animate-pulse bg-sky-500" />
            </div>
          </CardContent>
        </Card>
      </SectionShell>
    )
  }

  if (phase === 'error') {
    return (
      <SectionShell>
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Couldn’t start the quiz</h1>
          <p className="mt-3 text-gray-600">Please refresh to try again.</p>
          <div className="mt-6">
            <Link
              href="/"
              className="rounded-md bg-lime-400 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-lime-500"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </SectionShell>
    )
  }

  if (phase === 'finished') {
    const totalQuestions = items.length || amount || QUESTION_AMOUNTS[0]
    const percent = totalQuestions ? Math.round((score / totalQuestions) * 100) : 0
    const totalPoints = totalQuestions ? Math.round((score / totalQuestions) * MAX_POINTS) : 0

    return (
      <SectionShell>
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Your Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-gray-900 text-2xl font-semibold">
                    {score} / {items.length} correct
                  </div>
                  <div className="text-lime-600 text-xl font-bold">
                    Total Score: {totalPoints} Poin
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={currentTheme.badge}>{catName}</Badge>
                  {difficulty !== 'any' && (
                    <Badge variant="outline" className="text-gray-700 border-gray-300">
                      {difficulty}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-gray-700 border-gray-300">
                    {percent}%
                  </Badge>
                </div>
              </div>

              <div className="h-2 w-full rounded bg-gray-200 overflow-hidden">
                <div className="h-2 bg-sky-500" style={{ width: `${percent}%` }} />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handlePlayAgain}
                  className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold"
                >
                  Play Again
                </Button>
                <Button
                  variant="secondary"
                  onClick={submitScore}
                  disabled={submitting}
                  className="bg-white/70 hover:bg-white text-gray-900 border border-gray-300"
                >
                  {submitting ? 'Submitting…' : 'Submit Score'}
                </Button>
                <Button asChild variant="ghost" className="text-gray-900 hover:bg-gray-100">
                  <Link href="/leaderboard">View Leaderboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {items.map((item, i) => {
                const chosen = selections[i]
                const isCorrect = chosen === item.q.correct_answer
                return (
                  <div key={i} className="rounded-lg p-4 bg-gray-50/70 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-100 text-indigo-800">Q{i + 1}</Badge>
                        <Badge variant="outline" className="text-gray-700 border-gray-300">
                          {item.q.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                            <CheckCircleIcon className="h-5 w-5" /> Correct
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 text-sm font-medium">
                            <XCircleIcon className="h-5 w-5" /> Incorrect
                          </span>
                        )}
                      </div>
                    </div>

                    <h3
                      className="mt-3 text-gray-900 font-semibold"
                      dangerouslySetInnerHTML={{ __html: item.q.question }}
                    />

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.options.map((opt) => {
                        const isChosen = chosen !== '' && chosen === opt
                        const isTheCorrect = opt === item.q.correct_answer

                        let cls =
                          'rounded-md px-3 py-2 text-sm ring-1 ring-gray-200 bg-white text-gray-900'

                        if (isTheCorrect) {
                          cls =
                            'rounded-md px-3 py-2 text-sm ring-1 ring-green-500 bg-green-100 text-green-800'
                        }

                        if (isChosen && !isTheCorrect) {
                          cls =
                            'rounded-md px-3 py-2 text-sm ring-1 ring-red-500 bg-red-100 text-red-800'
                        }

                        if (isChosen && isTheCorrect) {
                          cls =
                            'rounded-md px-3 py-2 text-sm ring-1 ring-green-500 bg-green-100 text-green-800'
                        }

                        return (
                          <div key={opt} className={cls} dangerouslySetInnerHTML={{ __html: opt }} />
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </SectionShell>
    )
  }

  return (
    <SectionShell>
      <div className="space-y-4">
        <div className="w-full h-2 rounded bg-gray-200/50 overflow-hidden">
          <div
            className="h-2 bg-lime-400 transition-all duration-1000 ease-linear shadow-xl shadow-lime-400/80"
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          />
        </div>

        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-white/70 shadow-md border border-white/50 flex items-center justify-center">
            <div className="text-center text-xl font-bold">
              {timeLeft > 5 ? (
                <span className="text-green-600">{timeLeft}</span>
              ) : timeLeft > 2 ? (
                <span className="text-yellow-600">{timeLeft}</span>
              ) : (
                <span className="text-red-600 animate-pulse">{timeLeft}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Question <span className="font-semibold text-gray-900">{index + 1}</span> / {totalQuestions}
            </div>
            <div className="text-sm font-bold text-lime-600">(Score: {displayPoints})</div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={currentTheme.badge}>{catName}</Badge>
            {difficulty !== 'any' && (
              <Badge variant="outline" className="text-gray-700 border-gray-300">
                {difficulty}
              </Badge>
            )}
            <div className="w-32 sm:w-40 h-2 rounded bg-gray-200/50 overflow-hidden">
              <div className="h-2 bg-sky-500 transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        <motion.div
          key={`question-${index}-${selected ? (selected === current.q.correct_answer ? 'correct' : 'wrong') : 'idle'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            x: selected
              ? selected === current.q.correct_answer
                ? [0, -10, 10, -5, 5, 0]
                : [0, -8, 8, -8, 8, 0]
              : 0,
          }}
          transition={{
            opacity: { duration: 0.3 },
            y: { duration: 0.3 },
            x: selected
              ? selected === current.q.correct_answer
                ? { duration: 0.6, ease: 'easeOut' }
                : { duration: 0.4, ease: 'easeInOut' }
              : { duration: 0 },
          }}
        >
          <Card
            className={`bg-white/80 backdrop-blur-sm border-2 ${currentTheme.border} shadow-lg`}
          >
            <CardHeader className="space-y-2">
              <CardTitle
                className="text-gray-900 text-xl"
                dangerouslySetInnerHTML={{ __html: current?.q.question || '' }}
              />
            </CardHeader>

            <CardContent className="space-y-3">
              {current?.options.map((a) => {
                const isSelected = selected === a
                const isCorrect = a === current.q.correct_answer
                const showResult = selected !== null

                let classes =
                  'w-full text-left rounded-md px-4 py-3 text-sm font-medium transition ' +
                  `bg-white/70 hover:bg-white border ${currentTheme.border} text-gray-800 hover:text-gray-900 shadow-sm hover:shadow-md`

                if (showResult && isCorrect) {
                  classes =
                    'w-full text-left rounded-md px-4 py-3 text-sm font-medium bg-green-100 border border-green-500 text-green-800 shadow-lg'
                } else if (showResult && isSelected && !isCorrect) {
                  classes =
                    'w-full text-left rounded-md px-4 py-3 text-sm font-medium bg-red-100 border border-red-500 text-red-800 shadow-lg'
                }

                return (
                  <button
                    title={a.replace(/<\/?[^>]+(>|$)/g, '')}
                    aria-label={a.replace(/<\/?[^>]+(>|$)/g, '')}
                    key={a}
                    disabled={showResult}
                    onClick={() => onSelectAnswer(a)}
                    className={classes}
                    dangerouslySetInnerHTML={{ __html: a }}
                  />
                )
              })}

              {selected && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                  {selected === current.q.correct_answer ? (
                    <>
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      <span className="text-green-700 font-medium">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-5 w-5 text-red-600" />
                      <span className="text-red-700 font-medium">
                        Incorrect. Correct answer:&nbsp;
                        <span className="text-gray-900" dangerouslySetInnerHTML={{ __html: current.q.correct_answer }} />
                      </span>
                    </>
                  )}
                </div>
              )}

              <div className="pt-3">
                <Separator className="bg-gray-200" />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={next}
                  disabled={!selected}
                  className={`text-white font-semibold shadow-md ${currentTheme.base} ${currentTheme.hover}`}
                >
                  {index + 1 === items.length ? 'Finish' : 'Next'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </SectionShell>
  )
}

function decodeQuestion(q: OTDBRawQuestion): OTDBQuestion {
  return {
    category: q.category,
    type: q.type,
    difficulty: q.difficulty,
    question: q.question,
    correct_answer: q.correct_answer,
    incorrect_answers: q.incorrect_answers,
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
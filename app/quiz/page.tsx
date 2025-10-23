// src/app/quiz/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

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

const AMOUNT = 5
type Diff = 'easy' | 'medium' | 'hard'

type QItem = {
  q: OTDBQuestion
  options: string[] // shuffled once so review shows same order
}

/* ---------------- Updated Shell: Hero-style gradient background ---------------- */
function SectionShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate min-h-screen">
      {/* Background gradient (same as HeroSection) */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            linear-gradient(
              to bottom,
              #89E5F0 0%,
              #B6EFF6 25%,
              #CCF3FA 67%,
              #FAE9FF 100%
            )
          `,
        }}
      />

      {/* Center container */}
      <main className="px-6 lg:px-8 py-10 sm:py-14 md:min-h-screen md:flex md:items-center md:justify-center">
        <div className="w-full max-w-3xl">{children}</div>
      </main>
    </div>
  )
}

export default function QuizPage() {
  const [phase, setPhase] = useState<QuizPhase>('setup')

  // setup selections
  const [categories, setCategories] = useState<Category[]>([])
  const [catId, setCatId] = useState<number | 'any'>('any')
  const [catName, setCatName] = useState<string | 'Any Category'>('Any Category')
  const [difficulty, setDifficulty] = useState<Diff | 'any'>('any')

  // quiz state
  const [items, setItems] = useState<QItem[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [selections, setSelections] = useState<(string | null)[]>(Array(AMOUNT).fill(null))
  const [score, setScore] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  // load categories on setup
  useEffect(() => {
    if (phase !== 'setup') return
    const loadCats = async () => {
      try {
        const r = await fetch('https://opentdb.com/api_category.php', { cache: 'no-store' })
        const d = await r.json()
        const arr: Category[] = d?.trivia_categories ?? []
        setCategories(arr)
      } catch {
        setCategories([])
      }
    }
    loadCats()
  }, [phase])

  async function startQuiz() {
    try {
      setPhase('loading')
      const params = new URLSearchParams()
      params.set('amount', String(AMOUNT))
      params.set('type', 'multiple')
      if (catId !== 'any') params.set('category', String(catId))
      if (difficulty !== 'any') params.set('difficulty', difficulty)

      const r = await fetch(`https://opentdb.com/api.php?${params.toString()}`, { cache: 'no-store' })
      const data = await r.json()
      const qs: OTDBQuestion[] = (data.results ?? []).map(decodeQuestion)
      if (!qs.length) throw new Error('No questions')

      const prepped: QItem[] = qs.map((q) => ({
        q,
        options: shuffle([q.correct_answer, ...q.incorrect_answers]),
      }))

      setItems(prepped)
      setIndex(0)
      setSelected(null)
      setSelections(Array(qs.length).fill(null))
      setScore(0)
      setPhase('playing')
    } catch {
      setPhase('error')
    }
  }

  const current = items[index]
  const progressPct = items.length ? (index / items.length) * 100 : 0

  function onSelectAnswer(a: string) {
    if (selected) return
    setSelected(a)
    setSelections((prev) => {
      const next = [...prev]
      next[index] = a
      return next
    })
    if (a === current.q.correct_answer) setScore((s) => s + 1)
  }

  function next() {
    if (index + 1 < items.length) {
      setIndex((i) => i + 1)
      setSelected(null)
    } else {
      setPhase('finished')
    }
  }

  async function submitScore() {
    try {
      setSubmitting(true)
      const points = score * 100
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

  /* ---------------- RENDER ---------------- */

  if (phase === 'setup') {
    return (
      <SectionShell>
        <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Start a Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Select
                  value={String(catId)}
                  onValueChange={(val: 'any' | `${number}`) => {
                    if (val === 'any') {
                      setCatId('any')
                      setCatName('Any Category')
                    } else {
                      const id = Number(val)
                      setCatId(id)
                      const found = categories.find((c) => c.id === id)
                      setCatName(found?.name || `Category ${id}`)
                    }
                  }}
                >
                  <SelectTrigger className="w-full bg-white/70 text-gray-900 border-gray-300">
                    <SelectValue placeholder="Any Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900 border-gray-300">
                    <SelectItem value="any">Any Category</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty */}
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
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
              <Button asChild variant="ghost" className="text-gray-900 hover:bg-gray-100">
                <Link href="/">Cancel</Link>
              </Button>
              <Button
                onClick={startQuiz}
                className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold"
              >
                Start
              </Button>
            </div>
          </CardContent>
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
              <div className="h-2 w-1/3 animate-pulse bg-lime-400" />
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
    const percent = Math.round((score / items.length) * 100)
    return (
      <SectionShell>
        <div className="space-y-6">
          {/* summary */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Your Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-gray-900 text-xl font-semibold">
                  {score} / {items.length} correct
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-indigo-100 text-indigo-800">{catName}</Badge>
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
                <div className="h-2 bg-lime-400" style={{ width: `${percent}%` }} />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold">
                  <Link href="/quiz">Play Again</Link>
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

          {/* review */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {items.map((item, i) => {
                const chosen = selections[i]
                const isCorrect = chosen === item.q.correct_answer
                return (
                  <div key={i} className="rounded-lg p-4 bg-gray-50 border border-gray-200">
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
                        const isChosen = chosen === opt
                        const isTheCorrect = opt === item.q.correct_answer
                        let cls =
                          'rounded-md px-3 py-2 text-sm ring-1 ring-gray-200 bg-white text-gray-900'
                        if (isTheCorrect) cls = 'rounded-md px-3 py-2 text-sm ring-1 ring-green-500 bg-green-100 text-green-800'
                        if (isChosen && !isTheCorrect) cls = 'rounded-md px-3 py-2 text-sm ring-1 ring-red-500 bg-red-100 text-red-800'
                        if (isChosen && isTheCorrect) cls = 'rounded-md px-3 py-2 text-sm ring-1 ring-green-500 bg-green-100 text-green-800'
                        return <div key={opt} className={cls} dangerouslySetInnerHTML={{ __html: opt }} />
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

  // playing
  return (
    <SectionShell>
      <div className="space-y-6">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            Question <span className="font-semibold text-gray-900">{index + 1}</span> / {items.length || AMOUNT}
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-100 text-indigo-800">{catName}</Badge>
            {difficulty !== 'any' && (
              <Badge variant="outline" className="text-gray-700 border-gray-300">
                {difficulty}
              </Badge>
            )}
            <div className="w-40 h-2 rounded bg-gray-200 overflow-hidden">
              <div className="h-2 bg-lime-400 transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        {/* Question card */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
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
                'bg-white hover:bg-gray-50 border border-gray-200 text-gray-900'
              if (showResult && isCorrect) {
                classes =
                  'w-full text-left rounded-md px-4 py-3 text-sm font-medium bg-green-100 border border-green-500 text-green-800'
              } else if (showResult && isSelected && !isCorrect) {
                classes =
                  'w-full text-left rounded-md px-4 py-3 text-sm font-medium bg-red-100 border border-red-500 text-red-800'
              }

              return (
                <button
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
                className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold"
              >
                {index + 1 === items.length ? 'Finish' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  )
}

/* ---------- helpers ---------- */
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
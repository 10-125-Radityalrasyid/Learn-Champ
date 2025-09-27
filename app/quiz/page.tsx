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

/* ---------------- Shell with hero-like blobs ---------------- */
function SectionShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate min-h-screen bg-gray-900">
      {/* top blob */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[64rem]"
        />
      </div>
      {/* bottom blob */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[64rem]"
        />
      </div>

      {/* center container: horizontally always; vertically from md+ */}
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
        <Card className="bg-white/5 ring-1 ring-white/10">
          <CardHeader>
            <CardTitle className="text-white">Start a Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
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
                  <SelectTrigger className="w-full bg-white/5 ring-1 ring-white/10 text-white">
                    <SelectValue placeholder="Any Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 text-white border-white/10">
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                <Select
                  value={String(difficulty)}
                  onValueChange={(val: 'any' | Diff) => setDifficulty(val)}
                >
                  <SelectTrigger className="w-full bg-white/5 ring-1 ring-white/10 text-white">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 text-white border-white/10">
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
              <Button asChild variant="ghost" className="text-white">
                <Link href="/">Cancel</Link>
              </Button>
              <Button onClick={startQuiz}>Start</Button>
            </div>
          </CardContent>
        </Card>
      </SectionShell>
    )
  }

  if (phase === 'loading') {
    return (
      <SectionShell>
        <Card className="bg-white/5 ring-1 ring-white/10">
          <CardHeader>
            <CardTitle className="text-white">Loading quiz…</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-2 w-full rounded bg-white/10 overflow-hidden">
              <div className="h-2 w-1/3 animate-pulse bg-white/30" />
            </div>
          </CardContent>
        </Card>
      </SectionShell>
    )
  }

  if (phase === 'error') {
    return (
      <SectionShell>
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Couldn’t start the quiz</h1>
          <p className="mt-3 text-gray-300">Please refresh to try again.</p>
          <div className="mt-6">
            <Link
              href="/"
              className="rounded-md bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
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
          <Card className="bg-white/5 ring-1 ring-white/10">
            <CardHeader>
              <CardTitle className="text-white">Your Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-white text-xl font-semibold">
                  {score} / {items.length} correct
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-indigo-500">{catName}</Badge>
                  {difficulty !== 'any' && (
                    <Badge variant="outline" className="text-white border-white/20">
                      {difficulty}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-white border-white/20">
                    {percent}%
                  </Badge>
                </div>
              </div>

              <div className="h-2 w-full rounded bg-white/10 overflow-hidden">
                <div className="h-2 bg-indigo-500" style={{ width: `${percent}%` }} />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/quiz">Play Again</Link>
                </Button>
                <Button variant="secondary" onClick={submitScore} disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit Score'}
                </Button>
                <Button asChild variant="ghost" className="text-white">
                  <Link href="/leaderboard">View Leaderboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* review */}
          <Card className="bg-white/5 ring-1 ring-white/10">
            <CardHeader>
              <CardTitle className="text-white">Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {items.map((item, i) => {
                const chosen = selections[i]
                const isCorrect = chosen === item.q.correct_answer
                return (
                  <div key={i} className="rounded-lg p-4 bg-white/5 ring-1 ring-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-500">Q{i + 1}</Badge>
                        <Badge variant="outline" className="text-white border-white/20">
                          {item.q.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-green-300 text-sm">
                            <CheckCircleIcon className="h-5 w-5" /> Correct
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-300 text-sm">
                            <XCircleIcon className="h-5 w-5" /> Incorrect
                          </span>
                        )}
                      </div>
                    </div>

                    <h3
                      className="mt-3 text-white font-semibold"
                      dangerouslySetInnerHTML={{ __html: item.q.question }}
                    />

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.options.map((opt) => {
                        const isChosen = chosen === opt
                        const isTheCorrect = opt === item.q.correct_answer
                        let cls =
                          'rounded-md px-3 py-2 text-sm ring-1 ring-white/10 bg-white/5 text-white'
                        if (isTheCorrect) cls = 'rounded-md px-3 py-2 text-sm ring-1 ring-green-500/40 bg-green-600/20 text-white'
                        if (isChosen && !isTheCorrect) cls = 'rounded-md px-3 py-2 text-sm ring-1 ring-red-500/40 bg-red-600/20 text-white'
                        if (isChosen && isTheCorrect) cls = 'rounded-md px-3 py-2 text-sm ring-1 ring-green-500/40 bg-green-600/20 text-white'
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
        {/* Top bar (stacks on mobile) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-gray-300">
            Question <span className="font-semibold text-white">{index + 1}</span> / {items.length || AMOUNT}
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500">{catName}</Badge>
            {difficulty !== 'any' && (
              <Badge variant="outline" className="text-white border-white/20">
                {difficulty}
              </Badge>
            )}
            <div className="w-40 h-2 rounded bg-white/10 overflow-hidden">
              <div className="h-2 bg-indigo-500 transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        {/* Question card (centered on md+, full width on mobile) */}
        <Card className="bg-white/5 ring-1 ring-white/10">
          <CardHeader className="space-y-2">
            <CardTitle
              className="text-white text-xl"
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
                'bg-white/5 hover:bg-white/10 ring-1 ring-white/10 text-white'
              if (showResult && isCorrect) {
                classes =
                  'w-full text-left rounded-md px-4 py-3 text-sm font-medium bg-green-600/20 ring-1 ring-green-500/40 text-white'
              } else if (showResult && isSelected && !isCorrect) {
                classes =
                  'w-full text-left rounded-md px-4 py-3 text-sm font-medium bg-red-600/20 ring-1 ring-red-500/40 text-white'
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
                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                    <span className="text-green-300">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircleIcon className="h-5 w-5 text-red-400" />
                    <span className="text-red-300">
                      Incorrect. Correct answer:&nbsp;
                      <span className="text-white" dangerouslySetInnerHTML={{ __html: current.q.correct_answer }} />
                    </span>
                  </>
                )}
              </div>
            )}

            <div className="pt-3">
              <Separator className="bg-white/10" />
            </div>

            <div className="flex justify-end">
              <Button onClick={next} disabled={!selected}>
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

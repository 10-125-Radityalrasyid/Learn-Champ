// src/app/leaderboard/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// ---- local shell to center & add gradient blobs (same vibe as Hero/Quiz)
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

      {/* center container */}
      <main className="px-6 lg:px-8 py-10 sm:py-14 md:min-h-screen md:flex md:items-center md:justify-center">
        <div className="w-full max-w-4xl">{children}</div>
      </main>
    </div>
  )
}

type Row = {
  points: number
  displayName: string | null
  createdAt: string
  category?: string | null
  difficulty?: string | null
}

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState('20')
  const [category, setCategory] = useState<string>('') // free text for now (matches your API)
  const [difficulty, setDifficulty] = useState<'any' | 'easy' | 'medium' | 'hard'>('any')
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    try {
      setLoading(true)
      const q = new URLSearchParams()
      if (category.trim()) q.set('category', category.trim())
      if (difficulty !== 'any') q.set('difficulty', difficulty)
      q.set('limit', limit)
      const res = await fetch(`/api/leaderboard?${q.toString()}`, { cache: 'no-store' })
      const data = await res.json()
      setRows(data.leaderboard || [])
    } catch {
      toast.error('Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function saveName() {
    if (!name.trim()) return
    try {
      setSaving(true)
      const r = await fetch('/api/leaderboard/name', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ displayName: name.trim() }),
      })
      if (!r.ok) {
        toast.error('Could not save nickname')
      } else {
        toast.success('Nickname saved!')
        setName('')
        load()
      }
    } catch {
      toast.error('Could not save nickname')
    } finally {
      setSaving(false)
    }
  }

  const hasData = rows && rows.length > 0

  const subtitle = useMemo(() => {
    const parts: string[] = []
    if (category.trim()) parts.push(`Category: ${category.trim()}`)
    if (difficulty !== 'any') parts.push(`Difficulty: ${difficulty}`)
    return parts.join(' • ')
  }, [category, difficulty])

  return (
    <SectionShell>
      <Card className="bg-white/5 ring-1 ring-white/10">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <CardTitle className="text-white">Leaderboard</CardTitle>
              {subtitle && <p className="mt-1 text-sm text-gray-300">{subtitle}</p>}
            </div>

            {/* nickname */}
            <div className="flex items-center gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Set your nickname"
                className="w-44 bg-white/5 text-white placeholder:text-gray-400 border-white/10"
              />
              <Button onClick={saveName} disabled={saving || !name.trim()}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
              {/* Category (free text) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300">Category</label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. 9 or General Knowledge"
                  className="bg-white/5 text-white placeholder:text-gray-400 border-white/10"
                />
              </div>

              {/* Difficulty (Select) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300">Difficulty</label>
                <Select
                value={difficulty}
                onValueChange={(v: 'any' | 'easy' | 'medium' | 'hard') => setDifficulty(v)}
                >
                <SelectTrigger className="w-full bg-white/5 text-white border-white/10">
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

              {/* Limit */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300">Limit</label>
                <Select value={limit} onValueChange={(v) => setLimit(v)}>
                  <SelectTrigger className="w-full bg-white/5 text-white border-white/10">
                    <SelectValue placeholder="20" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 text-white border-white/10">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={load} disabled={loading}>
                {loading ? 'Loading…' : 'Apply'}
              </Button>
              <Button asChild variant="ghost" className="text-white">
                <Link href="/quiz">Play Quiz</Link>
              </Button>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">#</TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Points</TableHead>
                  <TableHead className="text-white">When</TableHead>
                  <TableHead className="text-white">Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hasData ? (
                  rows.map((r, i) => (
                    <TableRow key={`${r.createdAt}-${i}`} className="hover:bg-white/5">
                      <TableCell className="font-medium text-white">{i + 1}</TableCell>
                      <TableCell className="text-gray-200">{r.displayName ?? 'Guest'}</TableCell>
                      <TableCell className="font-semibold text-white">{r.points}</TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(r.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="space-x-1">
                        {r.category && <Badge className="bg-indigo-500">{r.category}</Badge>}
                        {r.difficulty && (
                          <Badge variant="outline" className="text-white border-white/20">
                            {r.difficulty}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-300 py-10">
                      {loading ? 'Loading…' : 'No results yet.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* little footer actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-400">
              Showing top <span className="text-white font-medium">{limit}</span>{' '}
              {category || difficulty !== 'any' ? 'with filters' : 'overall'}.
            </p>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/quiz">Play Again</Link>
              </Button>
              <Button asChild variant="ghost" className="text-white">
                <Link href="/">Home</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </SectionShell>
  )
}

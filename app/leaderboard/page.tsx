// src/app/leaderboard/page.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSession } from 'next-auth/react'

// ---- Updated SectionShell to match HeroSection style ----
function SectionShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate min-h-screen">
      {/* Background gradient (same as HeroSection) */}
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,_#89E5F0_0%,_#B6EFF6_25%,_#CCF3FA_67%,_#FAE9FF_100%)]"
      />

      {/* Optional: subtle wave or blob (optional, but hero uses wave) */}
      {/* We'll skip blobs for consistency with hero's clean look */}

      {/* Center container */}
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
  const [category, setCategory] = useState<string>('')
  const [difficulty, setDifficulty] = useState<'any' | 'easy' | 'medium' | 'hard'>('any')
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const { data: session } = useSession()
  const hasPrefilledName = useRef(false)

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

  useEffect(() => {
    if (!hasPrefilledName.current && session?.user?.name) {
      setName(session.user.name)
      hasPrefilledName.current = true
    }
  }, [session?.user?.name])

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
      {/* Card with subtle white background + soft shadow (like hero buttons) */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <CardTitle className="text-gray-900">Leaderboard</CardTitle>
              {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
              {session?.user?.name && (
                <p className="mt-1 text-xs text-gray-500">
                  Masuk sebagai <span className="font-semibold text-gray-800">{session.user.name}</span>
                </p>
              )}
            </div>

            {/* nickname */}
            <div className="flex items-center gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Set your nickname"
                className="w-44 bg-white/70 text-gray-900 placeholder:text-gray-500 border-gray-300"
              />
              <Button
                onClick={saveName}
                disabled={saving || !name.trim()}
                className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold"
              >
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Category</label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. 9 or General Knowledge"
                  className="bg-white/70 text-gray-900 placeholder:text-gray-500 border-gray-300"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Difficulty</label>
                <Select
                  value={difficulty}
                  onValueChange={(v: 'any' | 'easy' | 'medium' | 'hard') => setDifficulty(v)}
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

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Limit</label>
                <Select value={limit} onValueChange={(v) => setLimit(v)}>
                  <SelectTrigger className="w-full bg-white/70 text-gray-900 border-gray-300">
                    <SelectValue placeholder="20" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900 border-gray-300">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={load}
                disabled={loading}
                className="bg-white/70 hover:bg-white text-gray-900 border border-gray-300"
              >
                {loading ? 'Loading…' : 'Apply'}
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gray-800 text-gray-900 hover:bg-gray-100"
              >
                <Link href="/quiz">Play Quiz</Link>
              </Button>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="text-gray-900 font-medium">#</TableHead>
                  <TableHead className="text-gray-900 font-medium">Name</TableHead>
                  <TableHead className="text-gray-900 font-medium">Points</TableHead>
                  <TableHead className="text-gray-900 font-medium">When</TableHead>
                  <TableHead className="text-gray-900 font-medium">Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hasData ? (
                  rows.map((r, i) => (
                    <TableRow
                      key={`${r.createdAt}-${i}`}
                      className="hover:bg-gray-50 border-b border-gray-100"
                    >
                      <TableCell className="font-medium text-gray-900">{i + 1}</TableCell>
                      <TableCell className="text-gray-700">{r.displayName ?? 'Guest'}</TableCell>
                      <TableCell className="font-semibold text-gray-900">{r.points}</TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(r.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="space-x-1">
                        {r.category && <Badge className="bg-lime-200 text-lime-700">{r.category}</Badge>}
                        {r.difficulty && (
                          <Badge variant="outline" className="text-gray-700 border-gray-300">
                            {r.difficulty}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-10">
                      {loading ? 'Loading…' : 'No results yet.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* footer actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
            <p className="text-sm text-gray-600">
              Showing top <span className="text-gray-900 font-medium">{limit}</span>{' '}
              {category || difficulty !== 'any' ? 'with filters' : 'overall'}.
            </p>
            <div className="flex gap-2">
              <Button
                asChild
                className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold"
              >
                <Link href="/quiz">Play Again</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gray-800 text-gray-900 hover:bg-gray-100"
              >
                <Link href="/">Home</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </SectionShell>
  )
}
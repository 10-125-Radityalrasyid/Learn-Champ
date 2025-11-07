'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
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

const getCategoryTheme = (categoryName: string) => {
  if (!categoryName) {
    return { badge: 'bg-indigo-100 text-indigo-800' }
  }
  const cat = categoryName.toLowerCase()
  if (cat.includes('science') || cat.includes('math') || cat.includes('computer'))
    return { badge: 'bg-blue-100 text-blue-800' }
  if (cat.includes('history') || cat.includes('politics'))
    return { badge: 'bg-amber-100 text-amber-800' }
  if (cat.includes('geography') || cat.includes('animals') || cat.includes('vehicles'))
    return { badge: 'bg-emerald-100 text-emerald-800' }
  if (cat.includes('art') || cat.includes('celebrities') || cat.includes('entertainment'))
    return { badge: 'bg-purple-100 text-purple-800' }
  if (cat.includes('sports') || cat.includes('mythology'))
    return { badge: 'bg-orange-100 text-orange-800' }
  if (cat.includes('general'))
    return { badge: 'bg-lime-100 text-lime-800' }
  return { badge: 'bg-indigo-100 text-indigo-800' }
}

function SectionShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate min-h-screen font-mono">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,_#89E5F0_0%,_#B6EFF6_25%,_#CCF3FA_67%,_#FAE9FF_100%)]" />
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
  const [categoryInput, setCategoryInput] = useState<string>('') // user-entered text
  const [difficulty, setDifficulty] = useState<'any' | 'easy' | 'medium' | 'hard'>('any')
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const { data: session } = useSession()
  const hasPrefilledName = useRef(false)

  // Fetch category list
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('https://opentdb.com/api_category.php')
        const data = await res.json()
        setCategories(data.trivia_categories || [])
      } catch {
        toast.error('Failed to load categories')
      }
    }
    fetchCategories()
  }, [])

  // Helper: resolve category name (smart resolver)
  const resolveCategoryName = useCallback(
    (input: string): string => {
      const t = input.trim()
      if (!t) return ''
      // if it's numeric, lookup by ID
      if (/^\d+$/.test(t)) {
        const found = categories.find((c) => String(c.id) === t)
        return found?.name || ''
      }
      // match by name (case-insensitive)
      const exact = categories.find((c) => c.name.toLowerCase() === t.toLowerCase())
      if (exact) return exact.name
      const incl = categories.find((c) => c.name.toLowerCase().includes(t.toLowerCase()))
      if (incl) return incl.name
      return ''
    },
    [categories]
  )

  // Load leaderboard
  const load = useCallback(async () => {
    try {
      setLoading(true)
      const q = new URLSearchParams()

      const resolvedName = resolveCategoryName(categoryInput)
      // ✅ kirim nama kategori, bukan ID
      if (resolvedName) {
        q.set('category', resolvedName)
      }

      if (difficulty !== 'any') {
        q.set('difficulty', difficulty)
      }

      q.set('limit', limit)

      const res = await fetch(`/api/leaderboard?${q.toString()}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setRows(data?.leaderboard || [])
    } catch (err) {
      console.error('Leaderboard load error:', err)
      toast.error('Failed to load leaderboard')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [resolveCategoryName, categoryInput, difficulty, limit])

  useEffect(() => {
    load()
  }, [load])

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
      if (!r.ok) toast.error('Could not save nickname')
      else {
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
    if (categoryInput.trim()) {
      const resolvedName = resolveCategoryName(categoryInput)
      parts.push(`Category: ${resolvedName || categoryInput}`)
    }
    if (difficulty !== 'any') parts.push(`Difficulty: ${difficulty}`)
    return parts.join(' • ')
  }, [categoryInput, difficulty, resolveCategoryName])

  return (
    <SectionShell>
      <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <CardTitle className="text-gray-900">Leaderboard</CardTitle>
              {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
              {session?.user?.name && (
                <p className="mt-1 text-xs text-gray-500">
                  Log in as <span className="font-semibold text-gray-800">{session.user.name}</span>
                </p>
              )}
            </div>

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
          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
              {/* Category Input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Category</label>
                <Input
                  list="category-list"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="Start typing… e.g. math, general, history or use ID"
                  className="bg-white/70 text-gray-900 placeholder:text-gray-500 border-gray-300"
                />
                <datalist id="category-list">
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name} />
                  ))}
                </datalist>
              </div>

              {/* Difficulty */}
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

              {/* Limit */}
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
                className="bg-sky-500 hover:bg-sky-600 text-black font-semibold"
              >
                {loading ? 'Loading…' : 'Filter'}
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-lime-600 text-lime-700 hover:bg-lime-50/50 hover:text-lime-800 font-semibold"
              >
                <Link href="/quiz">Play Quiz</Link>
              </Button>
            </div>
          </div>

          {/* Warning */}
          {!loading && categoryInput.trim() && !resolveCategoryName(categoryInput) && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-700">
                Kategori &apos;{categoryInput}&apos; tidak ditemukan. Coba gunakan nama lengkap atau ID kategori.
              </p>
            </div>
          )}

          <Separator className="bg-gray-200" />

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-300 bg-white/60 hover:bg-white/60">
                  <TableHead className="text-gray-900 font-semibold w-12 text-center">#</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Name</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Points</TableHead>
                  <TableHead className="text-gray-900 font-semibold">When</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hasData ? (
                  rows.map((r, i) => (
                    <TableRow
                      key={`${r.createdAt}-${i}`}
                      className="hover:bg-lime-50/50 border-b border-gray-200 odd:bg-white/50 even:bg-sky-50/50"
                    >
                      <TableCell className="font-bold text-lime-600 text-center">{i + 1}</TableCell>
                      <TableCell className="text-gray-800 font-medium">{r.displayName ?? 'Guest'}</TableCell>
                      <TableCell className="font-semibold text-gray-900">{r.points}</TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(r.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="space-x-1 space-y-1">
                        {r.category && <Badge className={getCategoryTheme(r.category).badge}>{r.category}</Badge>}
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

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
            <p className="text-sm text-gray-600">
              Showing top <span className="text-gray-900 font-medium">{limit}</span>{' '}
              {categoryInput || difficulty !== 'any' ? 'with filters' : 'overall'}.
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
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
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

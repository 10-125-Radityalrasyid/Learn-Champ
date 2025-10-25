// app/api/leaderboard/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'           // ✅ add this
import { ScorePostSchema } from '@/lib/validation'
import { createHash } from 'crypto'

function readCookie(req: Request, key: string) {
  const cookie = req.headers.get('cookie') || ''
  return cookie.match(new RegExp(`(?:^|; )${key}=([^;]+)`))?.[1] ?? null
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 100)
  const category = url.searchParams.get('category') || undefined
  const difficulty = url.searchParams.get('difficulty') || undefined

  const where: Prisma.ScoreWhereInput = {}
  if (category) where.category = category
  if (difficulty) where.difficulty = difficulty

  const rows = await prisma.score.findMany({
    where,
    orderBy: [{ points: 'desc' }, { createdAt: 'asc' }],
    take: limit,
    select: {
      points: true,
      displayName: true,
      createdAt: true,
      category: true,
      difficulty: true,
    },
  })

  return NextResponse.json({ leaderboard: rows })
}

export async function POST(req: Request) {
  const guestId = readCookie(req, 'guestId')
  if (!guestId) return NextResponse.json({ error: 'No guestId' }, { status: 401 })

  const json = await req.json().catch(() => ({}))
  const parsed = ScorePostSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '0.0.0.0')
    .split(',')[0]
    .trim()

  const ipHash = createHash('sha256')
    .update(ip + (process.env.IP_SALT || ''))
    .digest('hex')

  const userAgent = req.headers.get('user-agent') || undefined
  const { points, category, difficulty } = parsed.data

  const bestExisting = await prisma.score.findFirst({
    where: { guestId, category, difficulty },
    orderBy: { points: 'desc' },
    select: { points: true },
  })

  if (!bestExisting || points > bestExisting.points) {
    await prisma.score.create({
      data: { guestId, points, category, difficulty, ipHash, userAgent },
    })
  }

  return NextResponse.json({ ok: true })
}

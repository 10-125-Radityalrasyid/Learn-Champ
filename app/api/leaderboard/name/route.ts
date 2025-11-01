import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NameSchema } from '@/lib/validation'
import { Prisma } from '@prisma/client'
import { auth } from '@/auth'

function readCookie(req: Request, key: string) {
  const cookie = req.headers.get('cookie') || ''
  return cookie.match(new RegExp(`(?:^|; )${key}=([^;]+)`))?.[1] ?? null
}

export async function POST(req: Request) {
  const session = await auth()
  const guestId = readCookie(req, 'guestId')
  const userId = session?.user?.id
  if (!guestId && !userId) {
    return NextResponse.json({ error: 'No identity' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const parsed = NameSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const where: Prisma.ScoreWhereInput = {
    OR: [
      ...(guestId ? [{ guestId }] : []),
      ...(userId ? [{ userId }] : []),
    ],
  }

  if (!where.OR?.length) {
    return NextResponse.json({ error: 'No identity' }, { status: 401 })
  }

  await prisma.score.updateMany({
    where,
    data: { displayName: parsed.data.displayName.trim() || null },
  })

  return NextResponse.json({ ok: true })
}
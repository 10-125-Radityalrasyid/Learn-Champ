import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NameSchema } from '@/lib/validation'

function readCookie(req: Request, key: string) {
  const cookie = req.headers.get('cookie') || ''
  return cookie.match(new RegExp(`(?:^|; )${key}=([^;]+)`))?.[1] ?? null
}

export async function POST(req: Request) {
  const guestId = readCookie(req, 'guestId')
  if (!guestId) {
    return NextResponse.json({ error: 'No guestId' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const parsed = NameSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  await prisma.score.updateMany({
    where: { guestId },
    data: { displayName: parsed.data.displayName.trim() || null },
  })

  return NextResponse.json({ ok: true })
}
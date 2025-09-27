import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE = 'guestId'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  if (!req.cookies.get(COOKIE)) {
    // ✅ Use Web Crypto API (available in Edge Runtime)
    const id = crypto.randomUUID()
    res.cookies.set(COOKIE, id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })
  }
  return res
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api/health).*)'],
}
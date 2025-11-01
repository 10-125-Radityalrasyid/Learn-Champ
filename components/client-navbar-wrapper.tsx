// src/components/client-navbar-wrapper.tsx
'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/navbar'

export default function ClientNavbarWrapper() {
  const pathname = usePathname()

  // Sembunyikan navbar di halaman-halaman berikut
  const hideNavbar = 
    pathname === '/quiz' || 
    pathname === '/leaderboard'

  // Catatan: Di `/quiz`, semua fase (setup, playing, finished) tetap di route yang sama,
  // jadi kita menyembunyikan seluruh halaman `/quiz`.

  if (hideNavbar) return null

  return <Navbar />
}
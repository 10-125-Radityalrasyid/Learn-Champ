'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/navbar'

export default function ClientNavbarWrapper() {
  const pathname = usePathname()

  const hideNavbar = 
    pathname === '/quiz' || 
    pathname === '/leaderboard'

  if (hideNavbar) return null

  return <Navbar />
}
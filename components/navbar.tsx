'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Menu, Home, Trophy, PlayCircle } from 'lucide-react'

export default function Navbar() {
  return (
    <nav
      className="
        fixed top-3 left-1/2 -translate-x-1/2 z-50
        bg-white/70 backdrop-blur-md border border-white/30 shadow-sm
        rounded-full px-4 sm:px-6 py-1.5
        flex items-center justify-between gap-2
        w-[94%] sm:w-[88%] lg:w-[75%] xl:w-[65%]
        transition-all duration-300
      "
    >
      {/* Brand */}
      <Link
        href="/"
        className="font-semibold text-gray-800 text-sm sm:text-base tracking-tight select-none"
      >
        LearnChamp
      </Link>

      {/* Desktop links */}
      <div className="hidden sm:flex items-center gap-5">
        <Link
          href="/"
          className="text-gray-700 hover:text-gray-900 text-xs sm:text-sm font-medium transition-colors"
        >
          Beranda
        </Link>

        <Link
          href="/leaderboard"
          className="text-gray-700 hover:text-gray-900 text-xs sm:text-sm font-medium transition-colors"
        >
          Leaderboard
        </Link>

        <Button
          asChild
          className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold text-xs sm:text-sm shadow-sm px-3 sm:px-4 py-1 rounded-full"
        >
          <Link href="/quiz" className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4 mr-1" />
            <span>Mulai Kuis</span>
          </Link>
        </Button>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-700 transition"
              aria-label="Buka menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="
              w-[75%] sm:w-[20rem] p-0
              bg-white/80 backdrop-blur-md border-l border-gray-100
            "
          >
            {/* a11y title */}
            <SheetHeader className="sr-only">
              <SheetTitle>Menu Navigasi</SheetTitle>
            </SheetHeader>

            {/* Nav + CTA (CTA tidak di paling bawah) */}
            <nav className="px-4 pt-10 pb-6 space-y-3">
              <SheetClose asChild>
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
                >
                  <Home className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Beranda</span>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/leaderboard"
                  className="flex items-center gap-3 rounded-lg px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
                >
                  <Trophy className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Leaderboard</span>
                </Link>
              </SheetClose>

              {/* CTA langsung setelah link */}
              <SheetClose asChild>
                <Button
                  asChild
                  className="
                    w-full rounded-full bg-lime-400 hover:bg-lime-500
                    text-gray-900 font-semibold text-sm py-2 shadow-sm mt-2
                  "
                >
                  <Link href="/quiz" className="flex items-center justify-center gap-2">
                    <PlayCircle className="h-4 w-4 mr-1" />
                    <span>Mulai Kuis</span>
                  </Link>
                </Button>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

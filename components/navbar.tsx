'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Menu,
  Trophy,
  PlayCircle,
  LogIn,
  LogOut,
  Loader2,
  UserCircle,
  BrainCircuit,
} from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname = usePathname() // ✅ digunakan untuk highlight
  const { data: session, status } = useSession()

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'
  const user = session?.user

  const displayName =
    user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Player'

  const handleSignIn = () => signIn('google')
  const handleSignOut = () => signOut({ callbackUrl: '/' })

  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      if (currentScroll > lastScrollY && currentScroll > 80) {
        setShowNavbar(false)
      } else {
        setShowNavbar(true)
      }
      setLastScrollY(currentScroll)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <nav
      className={`fixed top-3 z-50 bg-white border border-gray-200 shadow-sm rounded-full
      px-6 py-2 flex items-center gap-4 transition-all duration-500 ease-in-out
      ${showNavbar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}
      inset-x-3 md:inset-x-6 lg:inset-x-auto lg:w-[90%] lg:max-w-[1200px] lg:left-1/2 lg:-translate-x-1/2`}
    >
      {/* === Logo === */}
      <Link
        href="/"
        className="dk-jamboo text-lg flex items-center gap-1.5 flex-shrink-0"
      >
        <BrainCircuit className="h-7 w-7 text-lime-600" />
        <span className="hidden md:block">LEARN CHAMP</span>
      </Link>

      {/* === Menu Tengah (Desktop) === */}
      <div className="hidden sm:flex items-center gap-3 font-mono flex-1 justify-center">
        <Button
          asChild
          variant="outline"
          className={`border-black text-sm px-4 py-1.5 rounded-md ${
            pathname === '/quiz'
              ? 'bg-gray-900 text-white'
              : 'text-black hover:bg-gray-50'
          }`}
        >
          <Link href="/quiz" className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" />
            Quiz
          </Link>
        </Button>

        <Button
          asChild
          className={`text-sm px-4 py-1.5 rounded-md flex items-center gap-2 ${
            pathname === '/leaderboard'
              ? 'bg-lime-600 text-black'
              : 'bg-lime-400 hover:bg-lime-500 text-black'
          }`}
        >
          <Link href="/leaderboard">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </Link>
        </Button>
      </div>

      {/* === Profil (Desktop) === */}
      <div className="hidden sm:flex items-center min-w-[100px] justify-end font-mono flex-shrink-0">
        {isLoading ? (
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        ) : isAuthenticated ? (
          <>
            <div className="flex items-center gap-2 rounded-full bg-white/80 px-2 py-1">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? 'Akun Google'}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <UserCircle className="h-5 w-5 text-gray-500" />
              )}
              <span className="text-xs font-medium text-gray-800">
                {displayName}
              </span>
            </div>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-gray-700 hover:bg-gray-100 p-1.5"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            onClick={handleSignIn}
            variant="ghost"
            className="text-gray-700 hover:bg-gray-100 p-1.5"
          >
            <LogIn className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* === Menu Mobile === */}
      <div className="sm:hidden ml-auto">
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
            className="w-[75%] sm:w-[20rem] p-0 bg-white border-l border-gray-200 flex flex-col justify-between font-mono"
          >
            {/* ✅ Accessibility title (tidak terlihat di layar) */}
            <VisuallyHidden>
              <SheetTitle>Menu Navigasi</SheetTitle>
            </VisuallyHidden>

            <nav className="px-4 pt-10 pb-6 space-y-3">
              <SheetClose asChild>
                <Button
                  asChild
                  variant="outline"
                  className={`w-full border-black text-sm py-2 rounded-md ${
                    pathname === '/quiz'
                      ? 'bg-gray-900 text-white'
                      : 'text-black hover:bg-gray-50'
                  }`}
                >
                  <Link href="/quiz" className="flex items-center gap-2">
                    <PlayCircle className="h-4 w-4" />
                    Quiz
                  </Link>
                </Button>
              </SheetClose>

              <SheetClose asChild>
                <Button
                  asChild
                  className={`w-full text-sm py-2 rounded-md flex items-center gap-2 ${
                    pathname === '/leaderboard'
                      ? 'bg-lime-600 text-black'
                      : 'bg-lime-400 hover:bg-lime-500 text-black'
                  }`}
                >
                  <Link href="/leaderboard">
                    <Trophy className="h-4 w-4" />
                    Leaderboard
                  </Link>
                </Button>
              </SheetClose>
            </nav>

            {/* === Auth Section (Mobile) === */}
            <div className="border-t border-gray-200 bg-white/70 px-4 py-4">
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading…
                </div>
              ) : isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt={user.name ?? 'Akun Google'}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="h-6 w-6 text-gray-500" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.name ?? displayName}
                      </p>
                      {user?.email && (
                        <p className="text-xs text-gray-500">{user.email}</p>
                      )}
                    </div>
                  </div>
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      onClick={handleSignOut}
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="mr-1.5 h-4 w-4" />
                      Log Out
                    </Button>
                  </SheetClose>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-[44px]"></div>
                  <SheetClose asChild>
                    <Button
                      onClick={handleSignIn}
                      className="w-full bg-gray-900 text-white hover:bg-gray-800"
                    >
                      <LogIn className="mr-1.5 h-4 w-4" />
                      Sign in with Google
                    </Button>
                  </SheetClose>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

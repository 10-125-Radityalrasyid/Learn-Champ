'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function AppFooter() {
  const pathname = usePathname()

  // Hanya tampilkan di halaman beranda
  if (pathname !== '/') return null

  return (
    // z-20 supaya footer berada di atas elemen lain yang berpotensi menutup
    // bg full gradient agar tidak tembus ke background gelap di body
    <footer className="relative z-20 -mt-1 pb-8 bg-[#EAF5FB]">
    <div className="absolute -top-10 left-0 right-0 h-10 bg-[linear-gradient(to_bottom,transparent_0%,#EAF5FB_100%)] pointer-events-none" />


      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <Separator className="bg-white/30 mb-8" />

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="font-bold text-gray-900 text-xl">LearnChamp</span>
              <Badge variant="secondary" className="bg-lime-100 text-lime-800">
                Beta
              </Badge>
            </div>
            <p className="text-sm text-gray-900 max-w-md">
              Tantang pengetahuanmu, raih poin, dan jadilah juara!
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="text-sm text-gray-900 hover:text-gray-800 font-medium transition">
              Beranda
            </Link>
            <Link href="/leaderboard" className="text-sm text-gray-900 hover:text-gray-800 font-medium transition">
              Leaderboard
            </Link>
            <Link href="/quiz" className="text-sm text-gray-900 hover:text-gray-800 font-medium transition">
              Main Kuis
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-blue-200 text-center">
          <p className="text-xs text-gray-900">
            © {new Date().getFullYear()} LearnChamp. Dibuat dengan ❤️ untuk pembelajar sejati.
          </p>
        </div>
      </div>
    </footer>
  )
}

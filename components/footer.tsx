'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default function AppFooter() {
  const pathname = usePathname()

  // Hanya tampilkan di halaman beranda
  if (pathname !== '/') return null

  return (
    <footer className="relative z-20 pt-16 pb-8 bg-[#98F5E1] text-gray-800 font-mono">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-16 border-b border-gray-400/50">

          {/* Kolom 1: Konten Logo & Slogan Anda */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-gray-900 text-xl">Learn Champ</span>
              <Badge variant="secondary" className="bg-lime-300 text-lime-900 font-medium">
                Beta
              </Badge>
            </div>
            <p className="text-sm text-gray-800 max-w-md">
              Challenge your knowledge, earn points, and become a champion!
            </p>
          </div>

          {/* Kolom 2: Berisi Konten Menu Anda */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Menu</h3>
            
            {/* === PERUBAHAN DI BAWAH INI === */}
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  // 1. 'p-3' diubah ke 'px-4 py-2' (lebih pendek)
                  // 2. 'border-gray-900' diubah ke 'border-gray-400/50' (lebih soft)
                  className="block px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-400/50 rounded-lg shadow-sm text-sm text-gray-800 hover:text-cyan-700 hover:bg-white/90 font-medium transition"
                >
                  HomePage
                </Link>
              </li>
              <li>
                <Link 
                  href="/leaderboard" 
                  className="block px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-400/50 rounded-lg shadow-sm text-sm text-gray-800 hover:text-cyan-700 hover:bg-white/90 font-medium transition"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/quiz" 
                  className="block px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-400/50 rounded-lg shadow-sm text-sm text-gray-800 hover:text-cyan-700 hover:bg-white/90 font-medium transition"
                >
                  Play a quiz
                </Link>
              </li>
            </ul>
            {/* === AKHIR PERUBAHAN === */}
            
          </div>

          {/* Kolom 3: Subscribe */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Subscribe</h3>
            <p className="text-sm mb-4">
              Join our newsletter to stay up to date on features and releases.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow p-2 border border-gray-400/50 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-lime-500 text-white font-semibold rounded-md hover:bg-lime-600 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bagian bawah footer */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6 text-sm text-gray-600">
          
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-gray-800">All systems operational</span>
          </div>

          <div className="text-center md:text-left">
            <p className="text-xs text-gray-800">
              © {new Date().getFullYear()} LearnChamp. Made by ❤️ TIM B Kelompok 1
            </p>
          </div>

          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-cyan-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.208 6.431l-4.708 6.845 4.904 4.724h-1.503l-4.004-3.856-3.729 3.856h-1.026l4.89-6.812-5.004-4.793h1.503l4.11 3.948 3.837-3.948h1.026z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-cyan-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.493-1.1-1.1s.493-1.1 1.1-1.1 1.1.493 1.1 1.1-.493 1.1-1.1 1.1zm7 6.891h-2v-3.647c0-.916-.484-1.353-1.157-1.353-.615 0-1.096.38-1.096 1.205v3.795h-2v-6h2v.879c.642-1.196 1.838-1.928 3.091-1.928 2.059 0 3.109 1.164 3.109 3.693v3.356z"/></svg>
            </a>
          </div>
        </div>
      </div>

       {/* Lingkaran-lingkaran kecil di background */}
       <div className="absolute inset-0 pointer-events-none opacity-20 -z-10">
        <div className="absolute top-8 left-1/4 w-3 h-3 rounded-full bg-gray-900"></div>
        <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-gray-900"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-gray-900"></div>
        <div className="absolute bottom-8 right-1/2 w-5 h-5 rounded-full bg-gray-900"></div>
        <div className="absolute top-16 left-[10%] w-2 h-2 rounded-full bg-gray-900"></div>
        <div className="absolute bottom-16 right-[15%] w-3 h-3 rounded-full bg-gray-900"></div>
      </div>
    </footer>
  )
}
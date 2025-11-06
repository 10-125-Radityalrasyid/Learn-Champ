'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { toast } from 'sonner'

export default function AppFooter() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  // Hanya tampilkan footer di halaman beranda
  if (pathname !== '/') return null

  // Fungsi kirim feedback
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast.success('🎉 Feedback sent! Thank you!')
        form.reset()
      } else {
        toast.error('❌ Failed to send feedback. Please try again.')
      }
    } catch (error) {
      toast.error('⚠️ Something went wrong. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="relative z-20 pt-16 pb-8 bg-[#98F5E1] text-gray-800 font-mono">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Grid utama: 3 kolom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-16 border-b border-gray-400/50">
          
          {/* Kolom 1: Logo & Slogan */}
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

          {/* Kolom 2: Menu di Tengah */}
          <div className="flex flex-col items-center md:items-center">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Menu</h3>
            <ul className="space-y-3 w-full max-w-[200px]">
              <li>
                <Link
                  href="/"
                  className="block text-center px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-400/50 rounded-lg shadow-sm text-sm text-gray-800 hover:text-cyan-700 hover:bg-white/90 font-medium transition"
                >
                  HomePage
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="block text-center px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-400/50 rounded-lg shadow-sm text-sm text-gray-800 hover:text-cyan-700 hover:bg-white/90 font-medium transition"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  href="/quiz"
                  className="block text-center px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-400/50 rounded-lg shadow-sm text-sm text-gray-800 hover:text-cyan-700 hover:bg-white/90 font-medium transition"
                >
                  Play a Quiz
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Feedback Form */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Feedback</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                name="name"
                type="text"
                placeholder="Your name"
                className="p-2 border border-gray-400/50 rounded-md bg-transparent focus:ring-2 focus:ring-cyan-500"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Your email"
                className="p-2 border border-gray-400/50 rounded-md bg-transparent focus:ring-2 focus:ring-cyan-500"
                required
              />
              <textarea
                name="message"
                placeholder="Your message"
                rows={3}
                className="p-2 border border-gray-400/50 rounded-md bg-transparent focus:ring-2 focus:ring-cyan-500"
                required
              ></textarea>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 font-semibold rounded-md text-white transition ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-lime-500 hover:bg-lime-600'
                }`}
              >
                {loading ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer bawah */}
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.208 6.431l-4.708 6.845 4.904 4.724h-1.503l-4.004-3.856-3.729 3.856h-1.026l4.89-6.812-5.004-4.793h1.503l4.11 3.948 3.837-3.948h1.026z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-cyan-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.493-1.1-1.1s.493-1.1 1.1-1.1 1.1.493 1.1 1.1-.493 1.1-1.1 1.1zm7 6.891h-2v-3.647c0-.916-.484-1.353-1.157-1.353-.615 0-1.096.38-1.096 1.205v3.795h-2v-6h2v.879c.642-1.196 1.838-1.928 3.091-1.928 2.059 0 3.109 1.164 3.109 3.693v3.356z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Lingkaran-lingkaran dekoratif */}
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

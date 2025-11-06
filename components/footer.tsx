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
      toast.error('⚠ Something went wrong. Please check your connection.')
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
          <div className="flex flex-col md:items-center">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Menu</h3>
            <ul className="space-y-3 w-full">
              <li>
                <Link
                  href="/"
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
              © {new Date().getFullYear()} LearnChamp. Made by ❤ TIM B Kelompok 1
            </p>
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
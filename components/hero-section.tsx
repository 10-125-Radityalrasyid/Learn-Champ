// components/hero-section.tsx
'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrophyIcon, PlayCircleIcon } from '@heroicons/react/24/outline'

export default function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            linear-gradient(
              to bottom,
              #89E5F0 0%,
              #B6EFF6 25%,
              #CCF3FA 67%,
              #FAE9FF 100%
            )
          `,
        }}
      />

      {/* Hero Content */}
      <section className="pt-24 pb-20 sm:pt-28 sm:pb-24 flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <Badge
          variant="secondary"
          className="text-sm bg-white/70 text-gray-900 px-4 py-1.5 shadow-sm"
        >
          Selamat datang di LEARN CHAMPX
        </Badge>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-gray-900 max-w-4xl mt-5">
          Uji Pengetahuanmu <br /> Kuasai Peringkat Teratas
        </h1>

        <p className="mt-5 sm:mt-6 text-gray-700 max-w-2xl mx-auto px-1">
          LearnChamp menyajikan kuis interaktif dari berbagai kategori. Cara yang fun, cepat, dan efektif untuk mengukur serta meningkatkan wawasanmu!
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full max-w-md">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-48 bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold shadow-md group"
            aria-label="View leaderboard"
          >
            <Link href="/leaderboard">
              Leaderboard
              <TrophyIcon aria-hidden className="h-5 w-5 ml-1 transition-transform group-hover:scale-110" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-48 border-gray-800 hover:bg-gray-100 text-gray-900 font-semibold group"
            aria-label="Start a quiz"
          >
            <Link href="/quiz">
              <PlayCircleIcon aria-hidden className="h-5 w-5 mr-1 transition-transform group-hover:scale-110" />
              Mulai Kuis
            </Link>
          </Button>
        </div>
      </section>

      {/* Wave Separator */}
      <div className="w-full overflow-hidden leading-[0]">
        <svg
          className="block w-full h-16 sm:h-20 md:h-24 lg:h-28"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 96 C120 136, 240 56, 360 96 S600 136, 720 96 960 56, 1080 96 1320 136, 1440 96 L1440 160 L0 160 Z"
            fill="#D1FAE5"
          />
          <path
            d="M0 96 C120 136, 240 56, 360 96 S600 136, 720 96 960 56, 1080 96 1320 136, 1440 96"
            fill="none"
            stroke="#B3E8C9"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}
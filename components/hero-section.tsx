'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrophyIcon } from '@heroicons/react/24/outline'
import { PlayCircle, Sparkles } from 'lucide-react' 

function CloudIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32" 
      fill="currentColor"
      className={`absolute ${className}`}
      aria-hidden="true"
    >
      <path d="M17.5 16.5C17.5 16.5 18.25 14 20.5 14C22.75 14 23.5 16.5 23.5 16.5C23.5 16.5 25.25 16 26.5 18C27.75 20 25.25 21.5 25.25 21.5C25.25 21.5 25.5 24.5 22.5 25C19.5 25.5 18.5 22.5 18.5 22.5C18.5 22.5 16 23.5 14.5 21.5C13 19.5 14 17 14 17C14 17 14.75 16.5 17.5 16.5Z" />
    </svg>
  )
}

export default function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden font-mono">
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

      <div
        className="absolute inset-0 -z-5 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <CloudIcon className="text-white w-32 h-32 top-[10%] left-[5%]" />
        <CloudIcon className="text-white w-24 h-24 top-[15%] right-[10%]" />
        <CloudIcon className="text-white w-20 h-20 top-[40%] left-[15%]" />
        <CloudIcon className="text-white w-32 h-32 top-[35%] right-[-5%]" />
        <CloudIcon className="text-white w-16 h-16 top-[60%] left-[25%]" />
        <CloudIcon className="text-white w-16 h-16 top-[65%] right-[20%]" />
        <CloudIcon className="text-white w-20 h-20 top-[70%] left-[45%]" />
        <CloudIcon className="text-white w-20 h-20 bottom-[5%] left-[10%]" />
        <CloudIcon className="text-white w-28 h-28 bottom-[2%] right-[15%]" />
      </div>

      <section className="relative pt-24 pb-20 sm:pt-28 sm:pb-24 flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <Badge
          variant="secondary"
          className="text-sm bg-white/70 text-gray-900 px-4 py-1.5 shadow-sm mt-20"
        >
          <Sparkles className="h-10 w-10 text-pink-500 animate-pulse" /> Welcome to Learn Champ
        </Badge>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-gray-900 max-w-4xl mt-8">
          Test Your Knowledge
          <br /> Master the Top Rankings
        </h1>

        <p className="mt-8 text-gray-700 max-w-2xl mx-auto px-1">
          LearnChamp offers interactive quizzes across a variety of categories. A
          fun, fast, and effective way to measure and improve your knowledge!
        </p>

        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full max-w-md">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-48 bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold shadow-md group"
            aria-label="View leaderboard"
          >
            <Link href="/leaderboard">
              Leaderboard
              <TrophyIcon
                aria-hidden
                className="h-5 w-5 ml-1 transition-transform group-hover:scale-110"
              />
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
              <PlayCircle
                aria-hidden
                className="h-5 w-5 mr-1 transition-transform group-hover:scale-110"
              />
              Start The Quiz
            </Link>
          </Button>
        </div>
      </section>

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
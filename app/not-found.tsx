// src/app/not-found.tsx
import Link from "next/link"

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-400">404</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight text-white sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-400">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back home
          </Link>
          <Link
            href="/quiz"
            className="rounded-md bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
          >
            Start a Quiz
          </Link>
        </div>
      </div>
    </main>
  )
}

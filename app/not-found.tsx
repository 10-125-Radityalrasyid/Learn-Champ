// src/app/not-found.tsx
import Link from "next/link"

export default function NotFound() {
  return (
    <main
      className="min-h-screen px-4 sm:px-6 py-24 sm:py-32 flex items-center justify-center"
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
    >
      <div className="text-center max-w-md mx-auto">
        <p className="text-base font-semibold text-gray-600">Oops! Halaman tidak ditemukan</p>
        <h1 className="mt-4 text-5xl sm:text-6xl font-normal tracking-tight text-gray-900">
          404
        </h1>
        <p className="mt-4 text-gray-700 leading-relaxed">
          Sepertinya kamu tersesat di luar arena kuis! Tenang, kamu bisa kembali kapan saja.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto rounded-full bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold px-6 py-3 shadow-sm transition-colors"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/quiz"
            className="w-full sm:w-auto rounded-full border border-gray-800 bg-white/70 hover:bg-gray-100 text-gray-900 font-semibold px-6 py-3 shadow-sm transition-colors"
          >
            Mulai Kuis
          </Link>
        </div>
      </div>
    </main>
  )
}
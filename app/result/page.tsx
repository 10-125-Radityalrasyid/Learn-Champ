// app/result/page.tsx
"use client";

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const score = parseInt(searchParams.get('score') || '0');
  const total = parseInt(searchParams.get('total') || '0');
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama tidak boleh kosong!");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score }),
      });

      if (res.ok) {
        router.push('/leaderboard');
      } else {
        throw new Error();
      }
    } catch {
      setError("Gagal menyimpan skor. Coba lagi.");
      setIsSubmitting(false);
    }
  };

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  let message = "Bagus sekali!";
  if (percentage < 40) message = "Jangan menyerah!";
  else if (percentage < 70) message = "Lumayan!";
  else if (percentage < 90) message = "Hebat!";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Kuis Selesai!</h1>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="mb-6">
          <div className="text-5xl font-bold text-emerald-600">{score}</div>
          <div className="text-gray-500 mt-1">dari {total} soal</div>
          <div className="mt-2 text-sm text-gray-500">({percentage}% benar)</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">
              Nama Anda:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Masukkan nama..."
              disabled={isSubmitting}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className={`w-full py-2.5 rounded-lg font-medium text-white ${
              isSubmitting || !name.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan ke Leaderboard"}
          </button>
        </form>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/quiz" className="text-emerald-600 font-medium hover:underline">
            Ulangi Kuis
          </Link>
          <Link href="/" className="text-gray-600 font-medium hover:underline">
            Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
// app/leaderboard/page.tsx
import React from 'react';
import Link from 'next/link';

type Score = {
  _id: string;
  name: string;
  score: number;
  createdAt: string;
};

async function getLeaderboard() {
  const apiUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000';

  const res = await fetch(`${apiUrl}/api/leaderboard`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function LeaderboardPage() {
  const scores: Score[] = await getLeaderboard();

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 py-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">🏆 Papan Peringkat</h1>
        </div>

        <div className="p-6">
          {scores.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>Belum ada skor. Jadilah yang pertama!</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {scores.map((item, index) => (
                <li
                  key={item._id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-amber-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-700 min-w-[36px]">
                      {getRankIcon(index + 1)}
                    </span>
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </div>
                  <span className="text-xl font-bold text-indigo-600">{item.score}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/quiz"
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Main Lagi
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
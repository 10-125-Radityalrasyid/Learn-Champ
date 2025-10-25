// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-2xl w-full space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Selamat Datang di <span className="text-indigo-600">Learn Champ</span> 🎓
        </h1>
        <p className="text-lg text-gray-600">
          Uji pengetahuanmu dengan kuis seru dari berbagai kategori. Jawab sebanyak mungkin dan raih posisi teratas di papan peringkat!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/quiz?amount=5"
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Mulai Kuis (5 Soal)
          </Link>
          <Link
            href="/leaderboard"
            className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg border border-indigo-300 shadow hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Lihat Leaderboard
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-lg text-gray-800 mb-2">📚 Berbagai Kategori</h3>
            <p className="text-gray-600 text-sm">
              Sejarah, sains, film, geografi, dan masih banyak lagi!
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-lg text-gray-800 mb-2">⏱️ Tanpa Batas Waktu</h3>
            <p className="text-gray-600 text-sm">
              Jawab dengan tenang — tidak ada tekanan waktu.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-lg text-gray-800 mb-2">🏆 Leaderboard Global</h3>
            <p className="text-gray-600 text-sm">
              Simpan skormu dan bandingkan dengan pemain lain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
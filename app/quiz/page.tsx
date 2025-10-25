"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Category = { id: number; name: string };

export default function QuizPage() {
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  // Form state
  const [amount, setAmount] = useState("5");
  const [difficulty, setDifficulty] = useState("medium");
  const [type, setType] = useState("multiple");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const router = useRouter();

  // 🔹 Fetch kategori dari Open Trivia DB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://opentdb.com/api_category.php");
        const data = await res.json();
        if (data.trivia_categories) {
          setCategories(data.trivia_categories);
        }
      } catch (err) {
        console.error("Gagal memuat kategori:", err);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Fungsi memulai kuis
  const startQuiz = async () => {
    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount < 1 || numAmount > 10) {
      setError("Jumlah soal harus antara 1–10");
      return;
    }

    setError(null);
    setIsFetching(true);

    const params = new URLSearchParams();
    params.append("amount", amount);
    if (difficulty) params.append("difficulty", difficulty);
    if (type) params.append("type", type);
    if (category) params.append("category", category);

    try {
      const res = await fetch(`/api/quiz?${params.toString()}`);
      const data = await res.json();

      if (!Array.isArray(data)) throw new Error("Format data tidak valid");
      if (data.length === 0)
        throw new Error("Tidak ada soal yang tersedia untuk kriteria ini");

      setQuestions(data);
      setIsConfiguring(false);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat soal. Coba ubah pengaturan atau coba lagi.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      setError("Pilih jawaban terlebih dahulu!");
      return;
    }

    setError(null);
    const currentQ = questions[currentIndex];
    const isCorrect = selectedAnswer === currentQ.correct_answer;

    if (isCorrect) setScore((prev) => prev + 1);

    if (currentIndex + 1 >= questions.length) {
      const finalScore = score + (isCorrect ? 1 : 0);
      router.push(`/result?score=${finalScore}&total=${questions.length}`);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    }
  };

  // === TAMPILAN: Pengaturan Awal ===
  if (isConfiguring) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">⚙️ Atur Kuis Anda</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Soal (1–10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tingkat Kesulitan
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Semua</option>
                <option value="easy">Mudah</option>
                <option value="medium">Sedang</option>
                <option value="hard">Sulit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Soal
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="multiple">Pilihan Ganda</option>
                <option value="boolean">Benar/Salah</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori Soal
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={startQuiz}
              disabled={isFetching}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                isFetching
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isFetching ? "Memuat soal..." : "Mulai Kuis"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === TAMPILAN: Saat Mengerjakan Kuis ===
  const current = questions[currentIndex];
  const allAnswers =
    type === "boolean"
      ? ["True", "False"]
      : [...current.incorrect_answers, current.correct_answer].sort(
          () => Math.random() - 0.5
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-600">
            Soal {currentIndex + 1} dari {questions.length}
          </span>
          <span className="text-sm font-semibold text-indigo-600">
            Skor: {score}
          </span>
        </div>

        <h2
          className="text-lg md:text-xl font-medium text-gray-800 mb-6 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: current.question }}
        />

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-700 rounded text-sm">{error}</div>
        )}

        <div className="space-y-3 mb-8">
          {allAnswers.map((ans, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedAnswer(ans);
                setError(null);
              }}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedAnswer === ans
                  ? "bg-indigo-100 border-indigo-500"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <span dangerouslySetInnerHTML={{ __html: ans }} />
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
            selectedAnswer === null
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {currentIndex + 1 === questions.length ? "Selesai" : "Soal Berikutnya"}
        </button>
      </div>
    </div>
  );
}

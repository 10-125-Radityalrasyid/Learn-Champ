// app/api/leaderboard/route.ts
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb' // Kita PAKAI koneksi MongoDB di sini

export async function GET() {
  // Fungsi ini untuk MENGAMBIL data leaderboard
  try {
    const client = await clientPromise
    const db = client.db("quizApp") // Pastikan nama DB-nya 'quizApp'

    const leaderboard = await db
      .collection("leaderboard") // Kita buat collection baru 'leaderboard'
      .find({})
      .sort({ score: -1 }) // Urutkan dari skor tertinggi (-1)
      .limit(10) // Ambil 10 teratas
      .toArray()

    return NextResponse.json(leaderboard)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  // Fungsi ini untuk MENYIMPAN skor baru
  try {
    // 1. Ambil data { name, score } dari body request
    const { name, score } = await request.json()

    // Validasi sederhana
    if (!name || typeof score !== 'number') {
      return NextResponse.json({ error: 'Invalid name or score' }, { status: 400 })
    }

    // 2. Siapkan dokumen baru untuk disimpan
    const newScore = {
      name: name,
      score: score,
      createdAt: new Date(),
    }

    // 3. Hubungkan ke DB dan simpan
    const client = await clientPromise
    const db = client.db("quizApp")

    const result = await db.collection("leaderboard").insertOne(newScore)

    // 4. Kirim kembali respon sukses
    return NextResponse.json({ message: "Score saved", data: result.insertedId }, { status: 201 })

  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const amount = searchParams.get('amount') || '5'
    const type = searchParams.get('type') || 'multiple'
    const difficulty = searchParams.get('difficulty') || 'medium'
    const category = searchParams.get('category') // ✅ tambahkan ini

    // 🔹 Rangkai URL lengkap
    let apiUrl = `https://opentdb.com/api.php?amount=${amount}&type=${type}`
    if (difficulty) apiUrl += `&difficulty=${difficulty}`
    if (category) apiUrl += `&category=${category}` // ✅ masukkan ke URL

    console.log("Fetching trivia from:", apiUrl)

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'NextQuizApp/1.0',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error("Open Trivia DB failed with status:", response.status)
      return NextResponse.json({ error: `Open Trivia DB error: ${response.status}` }, { status: 500 })
    }

    const data = await response.json()

    if (!data.results || !Array.isArray(data.results)) {
      console.error("Invalid response structure:", data)
      return NextResponse.json({ error: "Invalid response from trivia API" }, { status: 500 })
    }

    return NextResponse.json(data.results)
  } catch (error) {
    console.error("Error fetching trivia:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

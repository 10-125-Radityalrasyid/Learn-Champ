import { NextResponse } from "next/server";

export async function GET() {
  const content = `
User-agent: *
Allow: /

# Sitemaps
Sitemap: https://learnchamp.vercel.app/sitemap.xml

# Target keywords
# Learn Champ | LearnChamp | Quiz | Education | Leaderboard
  `.trim();

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

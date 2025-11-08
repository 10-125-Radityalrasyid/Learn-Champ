import { NextResponse } from "next/server";

export async function GET() {
  const urls = [
    "https://learnchamp.vercel.app/",
    "https://learnchamp.vercel.app/quiz",
    "https://learnchamp.vercel.app/leaderboard",
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
  )
  .join("")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

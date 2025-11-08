import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "@/app/globals.css";
import ClientNavbarWrapper from "@/components/client-navbar-wrapper";
import { SessionProvider } from "@/components/providers/session-provider";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Learn Champ | Challenge your mind with quizzes and leaderboards",
  description:
    "Learn Champ adalah platform pembelajaran interaktif untuk mengasah pengetahuan melalui kuis dan papan peringkat.",
  keywords: [
    "LearnChamp",
    "Learn Champ",
    "quiz platform",
    "belajar interaktif",
    "education gamification",
  ],
  openGraph: {
    title: "Learn Champ - Quiz & Leaderboard Platform",
    description:
      "Challenge your mind with Learn Champ — kuis, leaderboard, dan pembelajaran menyenangkan!",
    url: "https://learnchamp.vercel.app",
    siteName: "Learn Champ",
    images: [
      {
        url: "https://learnchamp.vercel.app/learnchamp.png",
        width: 800,
        height: 800,
        alt: "Learn Champ Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Champ | Quiz & Leaderboard Platform",
    description:
      "Tingkatkan pengetahuanmu dengan Learn Champ — platform kuis dan leaderboard interaktif.",
    images: ["https://learnchamp.vercel.app/learnchamp.png"],
  },
  icons: {
    icon: "/learnchamp.png",
    shortcut: "/learnchamp.png",
    apple: "/learnchamp.png",
  },
  alternates: {
    canonical: "https://learnchamp.vercel.app",
  },
  verification: {
    google: "mJytP_orFWJNIm6N-2AAnM9cl6o7vfRDNpyQLM965FE",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" className="h-full">
      <head>
        {/* ✅ JSON-LD Structured Data Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Learn Champ",
              "alternateName": ["LearnChamp"],
              "url": "https://learnchamp.vercel.app",
              "description":
                "Learn Champ adalah platform pembelajaran interaktif berbasis kuis dan leaderboard untuk meningkatkan daya pikir dan semangat belajar.",
              "publisher": {
                "@type": "Organization",
                "name": "Learn Champ",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://learnchamp.vercel.app/learnchamp.png",
                },
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target":
                  "https://learnchamp.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full bg-gradient-to-b from-[#8EE5F0] to-[#B6EFF6] antialiased`}
      >
        <SessionProvider session={session}>
          <ClientNavbarWrapper />
          {children}
          <Toaster
            theme="dark"
            richColors
            position="top-center"
            closeButton
            expand
            toastOptions={{
              duration: 3000,
              className:
                "z-[60] rounded-lg bg-gray-800 text-white border border-white/10 shadow-lg",
              classNames: {
                title: "text-white",
                description: "text-gray-300",
                actionButton:
                  "bg-indigo-600 hover:bg-indigo-500 text-white rounded-md px-3 py-1 text-sm font-medium",
                cancelButton:
                  "bg-white/10 hover:bg-white/20 text-white rounded-md px-3 py-1 text-sm font-medium",
                closeButton: "text-white hover:text-gray-200",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}

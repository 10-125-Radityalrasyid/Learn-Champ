// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import '@/app/globals.css'
import ClientNavbarWrapper from '@/components/client-navbar-wrapper' // ✅ Ganti ini
import { SessionProvider } from '@/components/providers/session-provider'
import { auth } from '@/auth'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learn Champ",
  description: "Challenge your mind with quizzes and leaderboards",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()

  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full bg-gradient-to-b from-[#8EE5F0] to-[#B6EFF6] antialiased`}
      >
        <SessionProvider session={session}>
          <ClientNavbarWrapper /> {/* ✅ Gunakan wrapper */}
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
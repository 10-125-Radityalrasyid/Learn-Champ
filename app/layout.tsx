// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full bg-gray-900 antialiased`}
      >
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
              // optional: style individual parts
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
      </body>
    </html>
  );
}

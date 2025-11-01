import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { prisma } from "@/lib/prisma"

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        if (user.name && !session.user.name) session.user.name = user.name
        if (user.email && !session.user.email) session.user.email = user.email
        if (user.image && !session.user.image) session.user.image = user.image
      } else {
        // Buat user default secara aman (tanpa menimpa tipe)
        session.user = {
          id: user.id,
          name: user.name ?? null,
          email: user.email ?? null,
          image: user.image ?? null,
        } as typeof session.user
      }

      return session
    },
  },
  trustHost: true,
}

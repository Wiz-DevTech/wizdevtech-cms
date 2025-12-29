import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const handler = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)

          const user = await db.user.findUnique({
            where: { email },
            include: {
              role: true,
            },
          })

          if (!user || !user.password) {
            return null
          }

          const isValidPassword = await bcrypt.compare(password, user.password)

          if (!isValidPassword) {
            return null
          }

          if (!user.isActive) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role.name,
            permissions: user.role.permissions.split(',').filter(p => p.trim()),
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.permissions = user.permissions
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.permissions = token.permissions as string[]
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
})

export const { handlers, auth, signIn, signOut } = handler
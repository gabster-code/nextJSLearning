import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import { headers } from "next/headers";

export const config = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
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
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please enter your email and password");
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string,
            },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
            },
          });

          if (!user || !user.password) {
            throw new Error("Account doesn't exist");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (!user?.id) return;

      const headersList = await headers();
      const userAgent = headersList.get("user-agent") || "unknown";
      const forwardedFor = headersList.get("x-forwarded-for");
      const realIp = headersList.get("x-real-ip");
      const ipAddress = forwardedFor || realIp || "unknown";

      // Create session record
      await prisma.userSession.create({
        data: {
          userId: user.id,
          deviceInfo: JSON.stringify({
            userAgent,
            deviceType: "unknown",
          }),
          ipAddress,
        },
      });

      // Record login history
      await prisma.loginHistory.create({
        data: {
          userId: user.id,
          status: "success",
          deviceInfo: JSON.stringify({
            userAgent,
            deviceType: "unknown",
          }),
          ipAddress,
        },
      });
    },
    async signOut({ session, token }) {
      const userId = token?.sub || session?.user?.id;
      if (!userId) return;

      // Invalidate all sessions for this user
      await prisma.userSession.updateMany({
        where: { userId },
        data: { isValid: false },
      });
    },
  },
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);

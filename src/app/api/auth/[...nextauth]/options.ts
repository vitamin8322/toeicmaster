import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import * as bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Vui lòng cung cấp đầy đủ email và mật khẩu.");
        }

        // Fetch user from PostgreSQL
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Không tìm thấy tài khoản với email này.");
        }

        // Compare bcrypt hashes
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValid) {
          throw new Error("Mật khẩu chưa chính xác.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          targetScore: user.targetScore,
          onboardingCompleted: user.onboardingCompleted,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
        // @ts-ignore
        token.targetScore = user.targetScore;
        // @ts-ignore
        token.onboardingCompleted = user.onboardingCompleted;
      }
      
      // Dynamic token updates when user session is updated client-side
      if (trigger === "update" && session) {
        if (session.targetScore !== undefined) {
          token.targetScore = session.targetScore;
        }
        if (session.onboardingCompleted !== undefined) {
          token.onboardingCompleted = session.onboardingCompleted;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = token.role;
        // @ts-ignore
        session.user.targetScore = token.targetScore;
        // @ts-ignore
        session.user.onboardingCompleted = token.onboardingCompleted;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

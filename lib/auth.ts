import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider from "./auth-kakao";
import { db } from "./db";
import { verifyPassword } from "./password";
import type { NextAuthConfig } from "next-auth";

const providers: any[] = [];

// Credentials Provider (이메일 + 비밀번호)
providers.push(
  CredentialsProvider({
    name: "Email",
    credentials: {
      email: { label: "이메일", type: "text" },
      password: { label: "비밀번호", type: "password" },
    },
    async authorize(credentials: any) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("이메일과 비밀번호를 입력해주세요.");
      }

      const user = await db.user.findUnique({
        where: { email: credentials.email as string },
      });

      if (!user || !user.hashedPassword) {
        throw new Error("등록되지 않은 이메일이거나 비밀번호가 설정되지 않았습니다.");
      }

      const isValid = await verifyPassword(
        credentials.password as string,
        user.hashedPassword
      );

      if (!isValid) {
        throw new Error("비밀번호가 올바르지 않습니다.");
      }

      return user;
    },
  })
);

// Email Provider는 SMTP 설정이 있을 때만 추가
if (process.env.SMTP_HOST) {
  providers.push(
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.SMTP_FROM || "noreply@tubeping.com",
    })
  );
}

// Google Provider
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// Kakao Provider
if (process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET) {
  providers.push(
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    })
  );
}

const authConfig = {
  adapter: PrismaAdapter(db) as any,
  providers,
  pages: {
    signIn: "/login",
    verifyRequest: "/login?verifyRequest=true",
  },
  callbacks: {
    async session({ session, user }: any) {
      if (session.user) {
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.email = user.email;
      }
      return session;
    },
  },
  session: {
    strategy: "database" as const,
  },
};

// NextAuth v5 auth() function for API routes
export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);

// Export for backward compatibility
export const authOptions = authConfig;


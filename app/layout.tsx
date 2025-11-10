import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/auth/SessionProvider";

export const metadata: Metadata = {
  title: "Tubeping - 유튜브 채널 모니터링",
  description: "유튜브 채널의 새 영상을 감지하고 AI로 요약하여 이메일로 받아보세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}


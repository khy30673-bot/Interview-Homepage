import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/site.config";
import "./globals.css";

// PRD §S-4 폰트: Pretendard 또는 next/font의 Noto Sans KR.
// 가변 폰트(100~900)를 그대로 받아 워드마크 강조(900)와 버튼 라벨(500)을 모두 커버합니다.
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description:
    "진로 재탐색을 주제로 물은 질문과 답변을, 인터뷰 대상 단위로 모아 공개하는 아카이브입니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* 헤더와 푸터는 입장 화면(`/`)에서 스스로 숨습니다 (PRD §S-4 / §S-1) */}
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

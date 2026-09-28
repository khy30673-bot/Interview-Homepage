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
        {/* flex 컨테이너로 둡니다. 그래야 페이지가 flex-1로 남은 높이를 채우고
            그 안에서 세로 가운데 정렬을 할 수 있습니다 (S-2). main에 높이가
            flex로만 잡혀 있으면 자식의 min-height:100%가 해소되지 않습니다. */}
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

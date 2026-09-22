import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

// PRD §S-4 폰트: Pretendard 또는 next/font의 Noto Sans KR.
// 가변 폰트(100~900)를 그대로 받아 워드마크 강조(900)와 버튼 라벨(500)을 모두 커버합니다.
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "진로를 재탐색합니다",
  description: "진로 재탐색을 주제로 물은 질문과 답변을 모은 인터뷰 아카이브입니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}

"use client";

import { usePathname } from "next/navigation";

import { siteConfig } from "@/site.config";

/**
 * 공통 푸터 — 저작권 표기 (PRD §S-4 / US-5)
 *
 * **입장 화면(`/`)에서는 숨깁니다.** 입장 화면은 스크롤 없는 한 화면이고
 * 자체 푸터(`© 2026 희연`)를 따로 두기 때문에, 이 푸터까지 나오면
 * 저작권 표기가 두 번 겹칩니다.
 *
 * 연도와 저작권자는 `site.config.ts`에서 읽습니다.
 */
export function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <p className="text-[11.5px] leading-relaxed text-muted-foreground text-pretty">
          © {siteConfig.copyrightYear} {siteConfig.owner}. 이 사이트의 인터뷰
          기획·질문·정리 저작권은 {siteConfig.owner}에게 있습니다. 무단 전재 및
          재배포를 금지합니다.
        </p>
      </div>
    </footer>
  );
}

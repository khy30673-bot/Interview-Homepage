"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SiteWordmark } from "@/components/site-wordmark";
import { siteConfig } from "@/site.config";

/**
 * 공통 헤더 (PRD §S-4)
 *
 * 작은 워드마크가 홈 링크 역할을 합니다.
 * **입장 화면(`/`)에서는 숨깁니다** — 입장 화면은 워드마크가 주인공인
 * 스크롤 없는 한 화면이라 헤더가 있으면 같은 문구가 두 번 나옵니다.
 *
 * 경로를 알아야 해서 클라이언트 컴포넌트입니다.
 */
export function SiteHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-4">
        <Link
          href="/"
          aria-label={`${siteConfig.name} 홈으로`}
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          <SiteWordmark size="sm" />
        </Link>
      </div>
    </header>
  );
}

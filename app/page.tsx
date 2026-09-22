import Link from "next/link";

import { CursorTrail } from "@/components/cursor-trail";
import { SiteWordmark } from "@/components/site-wordmark";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { siteConfig } from "@/site.config";

/**
 * S-1 입장 화면 (PRD §S-1 / §7)
 *
 * 흰 배경 한 화면. 스크롤 없음. 보조 문구 없음.
 * 레이어: 궤적 canvas(z-0) → 워드마크·버튼(z-2, pointer-events-none, 버튼만 auto)
 */
export default function Home() {
  return (
    <main className="relative h-dvh overflow-hidden bg-white">
      <CursorTrail />

      <div className="pointer-events-none relative z-[2] flex h-full flex-col items-center justify-center gap-11 px-4">
        <SiteWordmark size="lg" />

        {/* PRD §S-1: asChild로 <Link>를 감싸 실제 <a>로 렌더합니다.
            새 탭으로 열 수 있어야 하고 크롤링도 되어야 하기 때문입니다.
            PRD §7의 치수·색·포커스 링은 여기서 className으로 주입합니다. */}
        <LiquidButton
          asChild
          className={[
            "pointer-events-auto",
            "h-[60px] rounded-full px-11",
            "text-[16.5px] font-medium text-[#1B1A18]",
            "transition-transform duration-300 hover:scale-105 active:scale-[0.98]",
            "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black",
            "focus-visible:ring-0 focus-visible:border-0",
          ].join(" ")}
        >
          <Link href="/interviews">{siteConfig.entryCta}</Link>
        </LiquidButton>
      </div>

      <p className="pointer-events-none fixed inset-x-0 bottom-[18px] z-[2] text-center text-[11.5px] text-[rgba(40,38,34,0.4)]">
        © {siteConfig.copyrightYear} {siteConfig.owner}
      </p>
    </main>
  );
}

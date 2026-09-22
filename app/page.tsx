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
    // <main> 랜드마크는 app/layout.tsx가 한 번만 둡니다. 여기서 또 쓰면
    // 문서에 <main>이 두 개가 되어 HTML 사양 위반입니다.
    <div className="relative h-dvh overflow-hidden bg-white">
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
            // outline-solid가 반드시 필요합니다. liquidbuttonVariants의 기본
            // 클래스에 outline-none이 들어 있는데, Tailwind v4에서 outline-none은
            // --tw-outline-style: none을 설정하고 outline-2는 그 변수를 참조합니다.
            // 그래서 outline-solid 없이는 폭만 2px이고 style이 none이라
            // 포커스 링이 아예 안 그려집니다 (PRD §7 / §9 "버튼 focus ring 표시").
            "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black",
            "focus-visible:ring-0 focus-visible:border-0",
          ].join(" ")}
        >
          <Link href="/interviews">{siteConfig.entryCta}</Link>
        </LiquidButton>
      </div>

      <p className="pointer-events-none fixed inset-x-0 bottom-[18px] z-[2] text-center text-[11.5px] text-[rgba(40,38,34,0.4)]">
        © {siteConfig.copyrightYear} {siteConfig.owner}
      </p>
    </div>
  );
}

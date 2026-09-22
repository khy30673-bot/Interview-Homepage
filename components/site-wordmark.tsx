import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";

/**
 * 사이트 워드마크 (PRD §6.6 / §7)
 *
 * 입장 화면(lg)과 헤더(sm)에서 크기만 바꿔 재사용합니다.
 * 문구와 강조 대상은 `site.config.ts`에서만 읽습니다 — 하드코딩하지 않습니다 (PRD §4.4).
 */

type SiteWordmarkProps = {
  size?: "lg" | "sm";
  className?: string;
};

/** 기본 글자색 */
const BASE_COLOR = "#3A352F";

export function SiteWordmark({ size = "lg", className }: SiteWordmarkProps) {
  const { name, nameEmphasis } = siteConfig;

  // 강조할 부분을 indexOf로 찾아 앞/강조/뒤 3조각으로 나눕니다.
  // 못 찾으면 강조 없이 전체를 그대로 출력합니다 (PRD §6.6).
  const at = nameEmphasis ? name.indexOf(nameEmphasis) : -1;
  const before = at === -1 ? name : name.slice(0, at);
  const emphasis = at === -1 ? "" : nameEmphasis;
  const after = at === -1 ? "" : name.slice(at + nameEmphasis.length);

  const isLg = size === "lg";

  return (
    <span
      className={cn(
        "font-normal",
        isLg ? "text-center" : "text-base",
        className
      )}
      style={
        isLg
          ? {
              color: BASE_COLOR,
              fontSize: "clamp(28px, 6vw, 54px)",
              letterSpacing: "-0.025em",
              lineHeight: 1.35,
            }
          : { color: BASE_COLOR }
      }
    >
      {before}
      {emphasis && (
        <em className="relative font-black text-black not-italic">
          {emphasis}
          {/* 밑줄. 1.2초 주기 step-end 점멸 — 커서가 깜빡이는 느낌.
              글자는 항상 불투명하고 밑줄만 점멸합니다 (PRD §6.6).
              prefers-reduced-motion에서는 globals.css가 정지시킵니다. */}
          <span
            aria-hidden
            className={cn(
              "animate-blink absolute left-0 w-full bg-black",
              isLg ? "" : "-bottom-0.5 h-[2px]"
            )}
            style={
              isLg
                ? { bottom: "-0.15em", height: "max(3px, 0.065em)" }
                : undefined
            }
          />
        </em>
      )}
      {after}
    </span>
  );
}

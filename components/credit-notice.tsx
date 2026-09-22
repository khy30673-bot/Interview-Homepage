import { siteConfig } from "@/site.config";
import { formatDateKo } from "@/lib/utils";

/**
 * 인터뷰 상세 하단 권한 블록 (PRD §6.8 / US-5)
 *
 *   ─────────────────────────────────
 *   기획 · 질문 · 정리    희연
 *   인터뷰 일자           2026. 8. 14.
 *
 *   이 인터뷰의 기획, 질문 구성, 정리 및 편집에 대한 저작권은
 *   희연에게 있습니다. 인용 시 출처를 밝혀 주시고,
 *   무단 전재 및 재배포를 금지합니다.
 *   ─────────────────────────────────
 *
 * 모든 문구는 `siteConfig`의 creditLine · owner · usageNotice에서 읽습니다.
 * 하드코딩하지 않으므로 site.config.ts 한 곳만 고치면 전 페이지에 반영됩니다.
 */

type CreditNoticeProps = {
  /** 인터뷰 일자 (frontmatter의 date) */
  date: string;
};

export function CreditNotice({ date }: CreditNoticeProps) {
  return (
    <section
      aria-label="저작권 및 인용 안내"
      className="mt-16 border-t border-b border-border py-6"
    >
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <dt className="text-muted-foreground">{siteConfig.creditLine}</dt>
        <dd className="font-medium">{siteConfig.owner}</dd>

        <dt className="text-muted-foreground">인터뷰 일자</dt>
        <dd className="font-medium">
          <time dateTime={date}>{formatDateKo(date)}</time>
        </dd>
      </dl>

      <p className="mt-5 text-sm leading-relaxed text-muted-foreground text-pretty">
        {siteConfig.usageNotice}
      </p>
    </section>
  );
}

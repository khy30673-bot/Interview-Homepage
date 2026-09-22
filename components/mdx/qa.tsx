/**
 * 질문 / 답변 한 묶음 (PRD §6.7)
 *
 * MDX에서 import 없이 바로 씁니다 — mdx-components.tsx가 매핑합니다.
 *
 *   <QA q="그만두기로 마음먹은 결정적인 순간이 있었나요?">
 *   없었어요. 그게 제일 말하고 싶은 부분이에요.
 *   </QA>
 *
 * @tailwindcss/typography는 쓰지 않고 직접 스타일링합니다 (PRD §6.7).
 */

type QAProps = {
  q: string;
  children: React.ReactNode;
};

export function QA({ q, children }: QAProps) {
  return (
    <div className="mt-10 first:mt-0">
      {/* 질문 — 좌측 강조선 + font-medium */}
      <p className="border-l-2 border-foreground pl-4 text-[17px] leading-relaxed font-medium text-balance">
        <span aria-hidden className="mr-1.5 text-muted-foreground">
          Q.
        </span>
        {q}
      </p>

      {/* 답변 — 일반 본문. MDX 안의 빈 줄이 <p>로 나뉩니다. */}
      <div className="mt-4 space-y-4 pl-4 text-[17px] leading-relaxed text-foreground/90">
        {children}
      </div>
    </div>
  );
}

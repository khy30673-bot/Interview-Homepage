import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Interview } from "@/lib/interviews";
import { initialOf } from "@/lib/utils";

/**
 * 3D 마퀴 안의 인터뷰 대상 카드 (PRD §S-2 상단)
 *
 * 아바타(size-9) · 이름 · 역할 · 대표 문장(pullQuote)을 보여 주고,
 * 카드 전체를 `<Link>`로 감싸 클릭하면 해당 인터뷰로 이동합니다.
 *
 * 서버 컴포넌트입니다. 클라이언트인 Marquee에 children으로 넘어가므로
 * Interview 데이터 자체는 브라우저로 전달되지 않습니다 (MDX 본문 포함).
 */

type IntervieweeCardProps = {
  interview: Interview;
};

export function IntervieweeCard({ interview }: IntervieweeCardProps) {
  const { slug, name, role, avatar, pullQuote } = interview;

  return (
    <Link
      href={`/interviews/${slug}`}
      aria-label={`${name} 인터뷰 읽기`}
      className="block w-64 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
    >
      <figure className="relative h-full w-full overflow-hidden rounded-xl border bg-card p-4 transition-colors hover:border-neutral-400">
        <div className="flex flex-row items-center gap-2">
          <Avatar className="size-9">
            {avatar && (
              <AvatarImage src={avatar} alt={`${name} 프로필 이미지`} />
            )}
            <AvatarFallback>{initialOf(name)}</AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-col">
            <figcaption className="truncate text-sm font-medium">
              {name}
            </figcaption>
            {/* 데모 원본의 오타 text-econdary-foreground → text-secondary-foreground
                (PRD §6.4) */}
            {role && (
              <p className="truncate text-xs font-medium text-secondary-foreground">
                {role}
              </p>
            )}
          </div>
        </div>

        {pullQuote && (
          <blockquote className="mt-2 line-clamp-3 text-sm leading-relaxed">
            {pullQuote}
          </blockquote>
        )}
      </figure>
    </Link>
  );
}

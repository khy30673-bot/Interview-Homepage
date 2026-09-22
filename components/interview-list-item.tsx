import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Interview } from "@/lib/interviews";
import { formatDateDots, initialOf } from "@/lib/utils";

/**
 * 목록 카드 한 장 (PRD §S-2 하단)
 *
 * 표시하는 것: 아바타 · 이름 · 역할 · 제목 · 날짜 · 태그
 * `summary`는 **표시하지 않습니다.** 상세 리드 문단과 meta description 전용입니다.
 *
 * `role`과 `avatar`가 비어 있어도 화면이 깨지지 않고 해당 요소만 조용히 사라집니다.
 */

type InterviewListItemProps = {
  interview: Interview;
  /** 사이트 전체 기준으로 정렬된 태그 (content/tags.json의 order 반영) */
  tags: string[];
};

export function InterviewListItem({ interview, tags }: InterviewListItemProps) {
  const { slug, name, role, avatar, title, date } = interview;

  return (
    <Link
      href={`/interviews/${slug}`}
      className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
    >
      <Card className="h-full gap-4 py-5 transition-colors group-hover:border-neutral-400">
        <div className="flex items-center gap-3 px-5">
          <Avatar className="size-9">
            {avatar && (
              <AvatarImage src={avatar} alt={`${name} 프로필 이미지`} />
            )}
            <AvatarFallback>{initialOf(name)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{name}</p>
            {role && (
              <p className="truncate text-xs text-muted-foreground">{role}</p>
            )}
          </div>
        </div>

        <div className="px-5">
          <h3 className="line-clamp-2 text-base leading-snug font-semibold text-balance">
            {title}
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {formatDateDots(date)}
          </p>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-5">
            {/* 태그는 표시 전용입니다. 링크가 아니며 최대 4개입니다 (PRD §S-2). */}
            {tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </Card>
    </Link>
  );
}

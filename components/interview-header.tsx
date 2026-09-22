import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Interview } from "@/lib/interviews";
import { formatDateDots, initialOf } from "@/lib/utils";

/**
 * 인터뷰 상세 헤더 (PRD §S-3)
 *
 * 아바타 · 이름 · 역할 · 제목(h1) · 날짜 · 태그 뱃지 · 요약 리드 문단.
 *
 * 여기 표시되는 **모든 값은 frontmatter에서 읽습니다.** 하드코딩 금지 (PRD §4.4).
 * `role`과 `avatar`가 비어 있어도 화면이 깨지지 않고 해당 요소만 사라집니다.
 */

type InterviewHeaderProps = {
  interview: Interview;
  /** 사이트 전체 기준으로 정렬된 태그 */
  tags: string[];
};

export function InterviewHeader({ interview, tags }: InterviewHeaderProps) {
  const { name, role, avatar, title, date, summary } = interview;

  return (
    <header>
      <div className="flex items-center gap-3">
        <Avatar className="size-11">
          {avatar && <AvatarImage src={avatar} alt={`${name} 프로필 이미지`} />}
          <AvatarFallback>{initialOf(name)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="font-medium">{name}</p>
          {role && (
            <p className="text-sm text-muted-foreground">{role}</p>
          )}
        </div>
      </div>

      <h1 className="mt-6 text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <time dateTime={date} className="text-xs text-muted-foreground">
          {formatDateDots(date)}
        </time>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {/* 표시 전용입니다. 링크가 아닙니다 (PRD §4.3). */}
            {tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
        {summary}
      </p>
    </header>
  );
}

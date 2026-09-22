import { InterviewListItem } from "@/components/interview-list-item";
import type { Interview } from "@/lib/interviews";

/**
 * 인터뷰 목록 (PRD §S-2 하단)
 *
 * 모바일 1열 / 태블릿 2열 / PC 3열 (PRD §2.1).
 * 정렬은 `getAllInterviews()`가 이미 날짜 내림차순으로 맞춰서 넘겨줍니다.
 *
 * 3D 마퀴는 `md` 미만에서 숨겨지므로, 모든 인터뷰로 가는 링크는 이 목록에
 * 반드시 존재해야 합니다 (PRD §S-2 접근성).
 */

type InterviewListProps = {
  interviews: Interview[];
  /** slug → 사이트 전체 기준으로 정렬된 태그 */
  tagsBySlug: Record<string, string[]>;
};

export function InterviewList({ interviews, tagsBySlug }: InterviewListProps) {
  return (
    <section aria-labelledby="interview-list-heading">
      <h2
        id="interview-list-heading"
        className="text-lg font-semibold tracking-tight"
      >
        인터뷰 목록
      </h2>

      {interviews.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          아직 공개된 인터뷰가 없습니다.
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {interviews.map((interview) => (
            <InterviewListItem
              key={interview.slug}
              interview={interview}
              tags={tagsBySlug[interview.slug] ?? interview.tags}
            />
          ))}
        </div>
      )}
    </section>
  );
}

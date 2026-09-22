import type { Metadata } from "next";

import { InterviewList } from "@/components/interview-list";
import { getAllInterviews } from "@/lib/interviews";
import { orderTags } from "@/lib/tags";
import { siteConfig } from "@/site.config";

/**
 * S-2 인터뷰 대상 선택 화면 (PRD §S-2)
 *
 * 빌드 시 MDX 전체를 읽는 서버 컴포넌트입니다. (Static)
 * 상단 3D 마퀴는 8단계에서 붙입니다.
 */

export const metadata: Metadata = {
  title: `인터뷰 목록 | ${siteConfig.name}`,
  description:
    "진로 재탐색을 주제로 이야기를 나눈 인터뷰 대상들입니다. 관심 가는 사람을 골라 그 사람에게 한 질문과 답변을 읽어 보세요.",
};

export default function InterviewsPage() {
  const interviews = getAllInterviews();

  // 뱃지 순서를 사이트 전체 기준으로 맞춥니다 (content/tags.json의 order 반영).
  // orderTags()는 node:fs를 쓰므로 서버에서 미리 계산해 넘깁니다.
  const tagsBySlug = Object.fromEntries(
    interviews.map((i) => [i.slug, orderTags(i.tags)])
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-14">
      <InterviewList interviews={interviews} tagsBySlug={tagsBySlug} />
    </div>
  );
}

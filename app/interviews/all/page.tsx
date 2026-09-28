import type { Metadata } from "next";
import Link from "next/link";

import { InterviewList } from "@/components/interview-list";
import { getAllInterviews } from "@/lib/interviews";
import { orderTags } from "@/lib/tags";
import { siteConfig } from "@/site.config";

/**
 * S-2-1 전체 인터뷰 (PRD §S-2-1)
 *
 * `/interviews`는 최신 3건만 보여 주므로, 전체를 보는 화면을 따로 둡니다.
 * 카드 레이아웃은 `/interviews`와 같은 `<InterviewList />`를 그대로 씁니다.
 * 마퀴는 없습니다 — 여기는 훑어보는 화면이 아니라 전부 나열하는 화면입니다.
 *
 * 세로 가운데 정렬도 하지 않습니다. 목록이 길어지는 화면이라
 * 위에서부터 읽어 내려가는 게 맞습니다.
 */

export const metadata: Metadata = {
  title: `전체 인터뷰 | ${siteConfig.name}`,
  description:
    "지금까지 공개된 인터뷰 전체입니다. 날짜가 최신인 순서로 정렬되어 있습니다.",
};

export default function AllInterviewsPage() {
  const interviews = getAllInterviews();

  const tagsBySlug = Object.fromEntries(
    interviews.map((i) => [i.slug, orderTags(i.tags)])
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-4">
      <Link
        href="/interviews"
        className="inline-block rounded-sm text-sm text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        ← 돌아가기
      </Link>

      <div className="mt-8">
        <InterviewList
          interviews={interviews}
          tagsBySlug={tagsBySlug}
          heading="전체 인터뷰"
        />
      </div>
    </div>
  );
}

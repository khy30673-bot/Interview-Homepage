import type { Metadata } from "next";
import Link from "next/link";

import { InterviewList } from "@/components/interview-list";
import { InterviewMarquee } from "@/components/interview-marquee";
import { getAllInterviews } from "@/lib/interviews";
import { orderTags } from "@/lib/tags";
import { siteConfig } from "@/site.config";

/**
 * S-2 인터뷰 대상 선택 화면 (PRD §S-2)
 *
 * 빌드 시 MDX 전체를 읽는 서버 컴포넌트입니다. (Static)
 *
 * 레이아웃
 *   마퀴와 목록이 **같은 컨테이너**(`max-w-6xl`)를 씁니다. PC에서는 마퀴 좌우
 *   끝이 목록 첫/마지막 카드와 정확히 맞고, 모바일에서는 음수 마진으로 컨테이너
 *   패딩을 뚫어 화면 끝까지 흐릅니다.
 *
 *   PC는 본문을 세로 가운데에 둡니다. `justify-center` 대신 자식의 `my-auto`를
 *   쓴 이유는, 콘텐츠가 화면보다 길어졌을 때 위쪽이 잘려 접근 불가가 되는 것을
 *   막기 위해서입니다. auto 마진은 남는 공간이 없으면 0이 되어 자연스럽게
 *   위에서부터 흐릅니다. 모바일은 가운데 정렬하지 않습니다.
 */

/** 이 화면에는 최신 3건만 보여 주고, 나머지는 /interviews/all로 넘깁니다. */
const LIST_LIMIT = 3;

export const metadata: Metadata = {
  title: `인터뷰 목록 | ${siteConfig.name}`,
  description:
    "진로 재탐색을 주제로 이야기를 나눈 인터뷰 대상들입니다. 관심 가는 사람을 골라 그 사람에게 한 질문과 답변을 읽어 보세요.",
};

export default function InterviewsPage() {
  const interviews = getAllInterviews();
  const visible = interviews.slice(0, LIST_LIMIT);
  const hasMore = interviews.length > LIST_LIMIT;

  // 뱃지 순서를 사이트 전체 기준으로 맞춥니다 (content/tags.json의 order 반영).
  // orderTags()는 node:fs를 쓰므로 서버에서 미리 계산해 넘깁니다.
  const tagsBySlug = Object.fromEntries(
    visible.map((i) => [i.slug, orderTags(i.tags)])
  );

  return (
    <div className="flex flex-1 flex-col py-10">
      <div className="mx-auto w-full max-w-6xl px-6 md:my-auto md:px-4">
        {/* 마퀴 — 모바일은 화면 끝까지, PC는 목록과 같은 폭.
            aria-hidden 장식이며 키보드·스크린리더 경로는 아래 목록입니다. */}
        <InterviewMarquee interviews={interviews} className="-mx-6 md:mx-0" />

        <div className="mt-8 md:mt-10">
          <InterviewList interviews={visible} tagsBySlug={tagsBySlug} />
        </div>

        {/* 인터뷰가 LIST_LIMIT 이하면 버튼을 아예 렌더하지 않습니다. */}
        {hasMore && (
          <div className="mt-4 flex justify-center md:mt-5">
            <Link
              href="/interviews/all"
              className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-[18px] py-[7px] text-[12.5px] font-medium transition-colors outline-none hover:border-neutral-400 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              더 많은 인터뷰 보기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

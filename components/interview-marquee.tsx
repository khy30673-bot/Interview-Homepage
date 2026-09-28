import { IntervieweeCard } from "@/components/interviewee-card";
import { MarqueeViewport } from "@/components/marquee-viewport";
import { Marquee } from "@/components/ui/3d-testimonails";
import type { Interview } from "@/lib/interviews";

/**
 * 상단 마퀴 — PC·모바일 모두 평면 가로 1줄 (PRD §S-2)
 *
 * 구조는 한 벌이고 화면 크기별로 **수치만** 달라집니다.
 *   모바일(md 미만)  카드 172px · 간격 10px · 높이 142px · 페이드 38px · 30s
 *   PC   (md 이상)  카드 212px · 간격 14px · 높이 196px · 페이드 90px · 40s
 *
 * PC에서 세로 3D 2컬럼을 쓰다가 가로 1줄로 바꿨습니다. 세로 3D는 넓은 화면의
 * 가운데만 쓰고 카드 글자가 기울어 눌려 읽기 나빴습니다.
 * 3D 변형(perspective, rotate, translateZ)은 전부 걷어냈습니다.
 *
 * ── 접근성 ────────────────────────────────────────────────────────────
 * 마퀴 전체가 `aria-hidden`이고 카드 링크는 `tabIndex={-1}`입니다.
 * repeat={4}로 같은 링크가 여러 벌 복제되고 일부는 overflow-hidden에 잘려
 * 보이지도 않아서, 탭 순서에 남겨 두면 키보드 사용자가 목록에 닿기까지
 * 한참을 눌러야 합니다. 키보드·스크린리더의 접근 경로는 하단 목록 하나로
 * 모읍니다. (PRD §S-2의 "동일 링크가 하단 목록에 반드시 존재")
 *
 * ── 클릭 ──────────────────────────────────────────────────────────────
 * 페이드 오버레이에 `pointer-events-none`이 빠지면 카드 클릭이 죽습니다.
 * 움직이는 표적 문제는 `pauseOnHover`가 막아 줍니다.
 *
 * 이 컴포넌트는 서버 컴포넌트입니다. 카드를 서버에서 렌더해 클라이언트인
 * Marquee/MarqueeViewport에 children으로 넘기므로, Interview 데이터(특히
 * MDX 본문 body)가 브라우저 번들로 넘어가지 않습니다.
 */

type InterviewMarqueeProps = {
  interviews: Interview[];
  /**
   * 바깥 여백. 화면 폭을 어떻게 쓸지는 이 컴포넌트가 아니라 페이지가 정합니다.
   * (모바일은 컨테이너 패딩을 음수 마진으로 뚫어 화면 끝까지, PC는 목록과 같은 폭)
   */
  className?: string;
};

export function InterviewMarquee({
  interviews,
  className,
}: InterviewMarqueeProps) {
  if (interviews.length === 0) return null;

  return (
    <MarqueeViewport aria-hidden className={className}>
      <div className="relative flex h-[142px] w-full items-center overflow-hidden md:h-[196px]">
        <Marquee
          pauseOnHover
          repeat={4}
          tabIndex={-1}
          className="[--duration:30s] [--gap:10px] md:[--duration:40s] md:[--gap:14px]"
        >
          {interviews.map((interview) => (
            // 대표 문장은 모바일 2줄 / PC 3줄. 모바일에서 3줄이면 카드가
            // 146px이 되어 142px 컨테이너 위아래로 삐져나와 잘립니다.
            <IntervieweeCard
              key={interview.slug}
              interview={interview}
              className="w-[172px] [&_blockquote]:line-clamp-2 md:w-[212px] md:[&_blockquote]:line-clamp-3"
            />
          ))}
        </Marquee>

        {/* 좌우 페이드만. 상하 페이드는 없습니다.
            pointer-events-none이 빠지면 카드 클릭이 죽습니다. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[38px] bg-linear-to-r from-background md:w-[90px]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[38px] bg-linear-to-l from-background md:w-[90px]" />
      </div>
    </MarqueeViewport>
  );
}

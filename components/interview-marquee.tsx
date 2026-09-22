import { IntervieweeCard } from "@/components/interviewee-card";
import { Marquee } from "@/components/ui/3d-testimonails";
import type { Interview } from "@/lib/interviews";

/**
 * 상단 3D 마퀴 (PRD §S-2)
 *
 * ⚠ PRD가 "가장 실패하기 쉬운 지점"으로 지목한 곳입니다.
 *   3D transform + 그라디언트 오버레이 + 무한 애니메이션 위에서 링크가
 *   실제로 눌려야 합니다. 클릭이 죽는 전형적인 원인과 대응:
 *
 *   1) 오버레이가 클릭을 먹음 → 4개 전부 pointer-events-none (필수)
 *   2) 카드가 overflow-hidden 밖으로 나가 잘림 → transform을 과하게 주지 않음
 *   3) 움직이는 표적이라 mousedown/mouseup이 어긋남 → pauseOnHover로 정지
 *   4) reduce 설정 시 → globals.css(§6.9)가 애니메이션을 멈춤
 *
 * 이 컴포넌트는 서버 컴포넌트입니다. 카드를 서버에서 렌더해 클라이언트인
 * Marquee에 children으로 넘기므로, Interview 데이터(특히 MDX 본문 body)가
 * 브라우저 번들로 넘어가지 않습니다.
 *
 * md 미만에서는 숨깁니다. 동일한 링크가 하단 목록에 반드시 존재해야 합니다.
 */

type InterviewMarqueeProps = {
  interviews: Interview[];
};

export function InterviewMarquee({ interviews }: InterviewMarqueeProps) {
  if (interviews.length === 0) return null;

  // 2컬럼으로 나눕니다. 1건뿐이면 두 컬럼 모두 같은 카드를 흘립니다.
  const half = Math.ceil(interviews.length / 2);
  const columns =
    interviews.length === 1
      ? [interviews, interviews]
      : [interviews.slice(0, half), interviews.slice(half)];

  const renderCards = (items: Interview[]) =>
    items.map((interview) => (
      <IntervieweeCard key={interview.slug} interview={interview} />
    ));

  return (
    <div
      className="relative hidden h-96 w-full flex-row items-center justify-center gap-1.5 overflow-hidden [perspective:300px] md:flex"
      aria-label="인터뷰 대상 목록"
    >
      <div
        className="flex flex-row items-center gap-6"
        style={{
          // 데모 원본보다 각도를 완화했습니다. perspective:300px가 강해서
          // 원본 각도(rotateX 20 / rotateZ 20)로는 위아래 카드 크기 차이가
          // 3배 넘게 벌어져 아래쪽 카드만 과하게 커 보였습니다.
          transform:
            "translateZ(-60px) rotateX(10deg) rotateY(-6deg) rotateZ(10deg)",
        }}
      >
        {columns.map((items, i) => (
          <Marquee
            key={i}
            vertical
            pauseOnHover
            reverse={i % 2 === 1}
            repeat={4}
            className="[--duration:40s]"
            ariaLabel={`인터뷰 대상 목록 ${i + 1}`}
          >
            {renderCards(items)}
          </Marquee>
        ))}
      </div>

      {/* 상하좌우 페이드 오버레이 4개.
          pointer-events-none이 하나라도 빠지면 카드 클릭이 죽습니다. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-linear-to-b from-background" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-background" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-background" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-background" />
    </div>
  );
}

import { IntervieweeCard } from "@/components/interviewee-card";
import { MarqueeViewport } from "@/components/marquee-viewport";
import { Marquee } from "@/components/ui/3d-testimonails";
import type { Interview } from "@/lib/interviews";

/**
 * 상단 마퀴 — PC는 3D 세로 2컬럼, 모바일은 평면 가로 1줄 (PRD §S-2)
 *
 * ── 접근성 ────────────────────────────────────────────────────────────
 * 마퀴 전체를 `aria-hidden`으로 보조기술에서 제외하고, 카드 링크에는
 * `tabIndex={-1}`을 줍니다. repeat={4}로 같은 링크가 12벌 복제되는 데다
 * 일부는 overflow-hidden에 잘려 보이지도 않아서, 탭 순서에 남겨 두면
 * 키보드 사용자가 목록에 닿기까지 14번을 눌러야 했습니다.
 * 키보드·스크린리더의 접근 경로는 하단 목록 하나로 모읍니다.
 * (PRD §S-2가 "동일 링크가 하단 목록에 반드시 존재"를 요구한 이유)
 *
 * ── 클릭 ──────────────────────────────────────────────────────────────
 * PRD가 "가장 실패하기 쉬운 지점"으로 지목한 곳입니다. 클릭이 죽는 원인:
 *   1) 오버레이가 클릭을 먹음 → 전부 pointer-events-none (필수)
 *   2) 카드가 overflow-hidden 밖으로 나가 잘림
 *   3) 움직이는 표적 → PC는 pauseOnHover로 정지
 *
 * ── 모바일에서 세로 마퀴를 쓰지 않는 이유 ─────────────────────────────
 * 세로로 흐르면 페이지 스크롤과 방향이 겹쳐 조작이 헷갈립니다.
 * 가로 1줄에 3D 변형도 걸지 않습니다.
 *
 * 이 컴포넌트는 서버 컴포넌트입니다. 카드를 서버에서 렌더해 클라이언트인
 * Marquee/MarqueeViewport에 children으로 넘기므로, Interview 데이터(특히
 * MDX 본문 body)가 브라우저 번들로 넘어가지 않습니다.
 */

type InterviewMarqueeProps = {
  interviews: Interview[];
};

export function InterviewMarquee({ interviews }: InterviewMarqueeProps) {
  if (interviews.length === 0) return null;

  // PC는 2컬럼. 1건뿐이면 두 컬럼 모두 같은 카드를 흘립니다.
  const half = Math.ceil(interviews.length / 2);
  const columns =
    interviews.length === 1
      ? [interviews, interviews]
      : [interviews.slice(0, half), interviews.slice(half)];

  return (
    <MarqueeViewport aria-hidden>
      {/* ── PC (md 이상) — 3D 세로 2컬럼 ───────────────────────────── */}
      <div className="relative hidden h-96 w-full flex-row items-center justify-center overflow-hidden [perspective:300px] md:flex">
        <div
          className="flex flex-row items-center gap-4"
          style={{
            transform:
              "translateX(-40px) translateZ(-70px) rotateX(18deg) rotateY(-9deg) rotateZ(16deg)",
          }}
        >
          {columns.map((items, i) => (
            <Marquee
              key={i}
              vertical
              pauseOnHover
              reverse={i % 2 === 1}
              repeat={4}
              tabIndex={-1}
              className="[--duration:34s] [--gap:14px]"
            >
              {items.map((interview) => (
                <IntervieweeCard
                  key={interview.slug}
                  interview={interview}
                  className="w-[212px]"
                />
              ))}
            </Marquee>
          ))}
        </div>

        {/* 페이드 오버레이 — 상하 26%, 좌우 22%.
            pointer-events-none이 하나라도 빠지면 카드 클릭이 죽습니다. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[26%] bg-linear-to-b from-background" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[26%] bg-linear-to-t from-background" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[22%] bg-linear-to-r from-background" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[22%] bg-linear-to-l from-background" />
      </div>

      {/* ── 모바일 (md 미만) — 평면 가로 1줄 ───────────────────────── */}
      <div className="relative flex h-[142px] w-full items-center overflow-hidden md:hidden">
        <Marquee
          repeat={4}
          tabIndex={-1}
          className="[--duration:30s] [--gap:10px]"
        >
          {interviews.map((interview) => (
            // 대표 문장을 2줄로 줄입니다. 3줄이면 카드가 146px이 되어
            // 142px 컨테이너 위아래로 삐져나와 잘립니다.
            <IntervieweeCard
              key={interview.slug}
              interview={interview}
              className="w-[172px] [&_blockquote]:line-clamp-2"
            />
          ))}
        </Marquee>

        {/* 좌우 38px만. 상하 페이드는 없습니다. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[38px] bg-linear-to-r from-background" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[38px] bg-linear-to-l from-background" />
      </div>
    </MarqueeViewport>
  );
}

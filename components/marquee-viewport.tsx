"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * 마퀴가 화면 밖으로 나가면 애니메이션을 멈추는 래퍼 (배터리 대비)
 *
 * 무한 애니메이션은 화면에 안 보여도 계속 합성(compositing)을 일으켜
 * 배터리를 씁니다. IntersectionObserver로 보이는 동안만 돌립니다.
 *
 * 실제 정지는 `data-in-view="false"`에 걸린 CSS 규칙이 합니다 (globals.css).
 * 이 컴포넌트는 children을 그대로 통과시키므로, 안에 들어오는 카드는
 * 서버 컴포넌트 그대로입니다 — Interview 데이터가 브라우저로 넘어가지 않습니다.
 *
 * IntersectionObserver가 없는 환경에서는 계속 재생합니다(기본값 true).
 */
export function MarqueeViewport({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-in-view={inView ? "true" : "false"}
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  );
}

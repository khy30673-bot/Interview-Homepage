"use client";

import { useEffect, useRef } from "react";

/**
 * 입장 화면의 블루 → 퍼플 커서 궤적 (PRD §6.5 / §7)
 *
 * `reference/entry-screen.html`의 구현을 그대로 옮긴 것입니다.
 * 수치(보간 0.28, phase 0.006, blur 7px, 잔상 알파 0.045, 정지 판정 2200ms 등)는
 * 레퍼런스를 기준으로 삼으라는 PRD §0 지시에 따라 한 글자도 바꾸지 않았습니다.
 *
 * 입장 화면에서만 렌더합니다.
 */

const BG = "#ffffff";
/** 블루 hsl(228 95% 58%) */
const COLOR_FROM = [228, 95, 58] as const;
/** 퍼플 hsl(276 88% 56%) */
const COLOR_TO = [276, 88, 56] as const;
/** 포인터가 이 시간(ms) 이상 멈춰 있으면 리사주 곡선으로 자동 궤적을 그립니다. */
const IDLE_MS = 2200;

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

const colorAt = (k: number) =>
  `hsl(${lerp(COLOR_FROM[0], COLOR_TO[0], k)} ${lerp(COLOR_FROM[1], COLOR_TO[1], k)}% ${lerp(
    COLOR_FROM[2],
    COLOR_TO[2],
    k
  )}%)`;

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    // 이전에 그린 지점(px, py)과 포인터 위치(cx, cy)
    let px: number | null = null;
    let py: number | null = null;
    let cx: number | null = null;
    let cy: number | null = null;
    let lastMove = 0;
    let phase = 0;
    let rafId = 0;

    const t0 = performance.now();

    // PRD §2.1 / §6.5 — reduce면 궤적을 그리지 않고 흰 배경만 유지합니다.
    // 사용자가 도중에 설정을 바꿀 수 있으므로 변화도 따라갑니다.
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduce = motionQuery.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      reduce = e.matches;
    };

    function resize() {
      if (!canvas || !ctx) return;
      // DPR은 2로 캡. 고해상도 화면에서 캔버스가 과하게 커지는 것을 막습니다.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.width = Math.floor(window.innerWidth * dpr);
      height = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    /** 포인터가 없거나 멈춰 있을 때 그릴 리사주 곡선 위의 한 점 */
    function autoPoint(now: number) {
      const s = (now - t0) / 1000;
      const w = window.innerWidth;
      const h = window.innerHeight;
      return {
        x: w / 2 + Math.sin(s * 0.62) * w * 0.3 + Math.sin(s * 0.23) * w * 0.1,
        y: h / 2 + Math.cos(s * 0.47) * h * 0.24 + Math.cos(s * 0.31) * h * 0.08,
      };
    }

    function onPointer(e: PointerEvent) {
      cx = e.clientX;
      cy = e.clientY;
      lastMove = performance.now();
    }

    function frame(now: number) {
      rafId = requestAnimationFrame(frame);
      if (!ctx) return;

      // 잔상 소멸 — 매 프레임 배경색을 아주 옅게 덮습니다.
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 0.045;
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      if (reduce) return;

      let tx = cx;
      let ty = cy;
      if (cx === null || now - lastMove > IDLE_MS) {
        const p = autoPoint(now);
        tx = p.x;
        ty = p.y;
      }
      if (tx === null || ty === null) return;

      if (px === null || py === null) {
        px = tx;
        py = ty;
        return;
      }

      const dx = tx - px;
      const dy = ty - py;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.4) return;

      // 목표 지점으로 0.28 비율 보간 — 부드럽게 따라오는 지연감을 만듭니다.
      const nx = px + dx * 0.28;
      const ny = py + dy * 0.28;

      phase = (phase + 0.006) % 1;
      const k = (Math.sin(phase * Math.PI * 2) + 1) / 2;

      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = colorAt(k);
      // 빠르게 움직일수록 얇아집니다.
      ctx.lineWidth = Math.max(14, 34 - Math.min(dist, 60) * 0.22);
      ctx.filter = "blur(7px)";
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      ctx.restore();

      px = nx;
      py = ny;
    }

    resize();
    rafId = requestAnimationFrame(frame);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 block"
    />
  );
}

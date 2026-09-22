import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * `2026-09-22` → `2026.09.22` (PRD §S-2 목록 카드의 날짜 표기)
 *
 * Date 객체로 바꾸지 않고 문자열을 그대로 자릅니다. `new Date("2026-09-22")`는
 * UTC 자정으로 해석돼서, 서버·브라우저의 표준시대에 따라 하루 전날로 밀려
 * 보일 수 있기 때문입니다.
 */
export function formatDateDots(isoDate: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate)
  return m ? `${m[1]}.${m[2]}.${m[3]}` : isoDate
}

/**
 * `2026-08-14` → `2026. 8. 14.` (PRD §6.8 권한 블록의 인터뷰 일자)
 * 위와 같은 이유로 문자열에서 바로 만듭니다.
 */
export function formatDateKo(isoDate: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate)
  return m ? `${m[1]}. ${Number(m[2])}. ${Number(m[3])}.` : isoDate
}

/** 아바타 이미지가 없을 때 쓸 이니셜 — 이름 첫 글자 (PRD §4.2) */
export function initialOf(name: string) {
  return name.trim().charAt(0) || "?"
}

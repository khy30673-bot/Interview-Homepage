import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * `2026-09-22` → `2026.09.` (목록 카드·상세 헤더의 날짜 표기)
 *
 * 운영자 요청으로 일(日)은 표시하지 않고 연·월까지만 보여 줍니다.
 * frontmatter의 date는 정렬에 쓰이므로 YYYY-MM-DD 그대로 적습니다.
 *
 * Date 객체로 바꾸지 않고 문자열을 그대로 자릅니다. `new Date("2026-09-22")`는
 * UTC 자정으로 해석돼서, 서버·브라우저의 표준시대에 따라 하루 전날로 밀려
 * 보일 수 있기 때문입니다.
 */
export function formatDateDots(isoDate: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate)
  return m ? `${m[1]}.${m[2]}.` : isoDate
}

/** 아바타 이미지가 없을 때 쓸 이니셜 — 이름 첫 글자 (PRD §4.2) */
export function initialOf(name: string) {
  return name.trim().charAt(0) || "?"
}

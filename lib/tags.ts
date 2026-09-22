import fs from "node:fs";
import path from "node:path";

import { getAllInterviews } from "@/lib/interviews";

/**
 * 태그 수집 (PRD §4.3)
 *
 * 고정된 태그 목록은 없습니다. 운영자가 MDX에 쓰는 대로 자동으로 늘어납니다.
 * 태그는 **표시 전용**이며 클릭할 수 없습니다 (태그 페이지·필터 없음, PRD §10).
 *
 * ⚠ `node:fs`를 씁니다. 서버에서만 import하세요.
 */

export type TagCount = { tag: string; count: number };

const TAGS_JSON = path.join(process.cwd(), "content", "tags.json");

/**
 * `content/tags.json`의 `order` 배열. 선택 사항이라 없어도 정상 동작합니다.
 * 형식이 깨져 있어도 빌드를 세우지 않고 경고만 남깁니다 — 표시 순서는
 * 콘텐츠의 정확성에 영향을 주지 않기 때문입니다.
 */
function readOrder(): string[] {
  if (!fs.existsSync(TAGS_JSON)) return [];
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(TAGS_JSON, "utf8"));
    const order =
      parsed && typeof parsed === "object" && "order" in parsed
        ? (parsed as { order: unknown }).order
        : null;
    if (!Array.isArray(order)) return [];
    return order.filter((t): t is string => typeof t === "string");
  } catch {
    console.warn(
      `⚠ content/tags.json을 읽지 못했습니다. 표시 순서 지정을 건너뜁니다.`
    );
    return [];
  }
}

/** 가나다순 (한국어 우선 정렬) */
const collator = new Intl.Collator("ko");

/**
 * 태그 정렬 규칙:
 *   1. tags.json의 `order`에 있으면 그 순서대로 (선택)
 *   2. 나머지는 사용 횟수 내림차순
 *   3. 횟수가 같으면 가나다순
 */
function compareTags(a: TagCount, b: TagCount, order: string[]): number {
  const ia = order.indexOf(a.tag);
  const ib = order.indexOf(b.tag);
  if (ia !== -1 || ib !== -1) {
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  }
  if (a.count !== b.count) return b.count - a.count;
  return collator.compare(a.tag, b.tag);
}

/**
 * 마지막으로 경고한 태그 목록. 같은 내용을 반복해서 찍지 않되, 개발 중에
 * 태그를 고치면 다시 알려 주기 위해 "찍었다/안 찍었다"가 아니라 내용을 기억합니다.
 */
let lastWarned: string | null = null;

/**
 * PRD §4.3: 사이트 전체에서 1번만 쓰인 태그는 **경고만** 출력합니다 (오타 감지용).
 * 빌드를 세우지는 않습니다 — 처음 보는 태그는 통과시키는 게 정책이기 때문입니다.
 */
function warnSingleUseTags(counts: Map<string, number>, where: Map<string, string[]>) {
  const singles = [...counts.entries()].filter(([, n]) => n === 1);

  const signature = singles.map(([tag]) => tag).join("\u0000");
  if (signature === lastWarned) return;
  lastWarned = signature;

  if (singles.length === 0) return;

  const lines = singles.map(([tag]) => {
    const files = where.get(tag) ?? [];
    return `   - ${tag}   (${files.join(", ")})`;
  });

  console.warn(
    "⚠ 한 번만 사용된 태그가 있습니다. 오타가 아닌지 확인해 주세요:\n" +
      lines.join("\n")
  );
}

/** 전체 태그를 사용 횟수와 함께. 정렬은 위 규칙을 따릅니다. */
export function getAllTags(): TagCount[] {
  const counts = new Map<string, number>();
  const where = new Map<string, string[]>();

  for (const interview of getAllInterviews()) {
    for (const tag of interview.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
      where.set(tag, [...(where.get(tag) ?? []), `${interview.slug}.mdx`]);
    }
  }

  warnSingleUseTags(counts, where);

  const order = readOrder();
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => compareTags(a, b, order));
}

/**
 * 한 글의 태그를 사이트 전체 기준 표시 순서로 정렬합니다.
 * 목록 카드와 상세 상단의 뱃지 순서를 사이트 전체에서 일관되게 맞추기 위한 것입니다.
 */
export function orderTags(tags: string[]): string[] {
  const rank = new Map(getAllTags().map((t, i) => [t.tag, i]));
  return [...tags].sort(
    (a, b) => (rank.get(a) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b) ?? Number.MAX_SAFE_INTEGER)
  );
}

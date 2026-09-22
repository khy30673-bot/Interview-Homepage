import { z } from "zod";

/**
 * MDX frontmatter 검증 (PRD §4.2 / §4.3)
 *
 * 검증에 실패하면 파일명과 필드명을 담은 에러로 빌드를 중단시킵니다 (PRD §4.4-4).
 * 콘텐츠를 고치는 사람이 코드를 몰라도 무엇을 고쳐야 하는지 알 수 있도록
 * 메시지는 전부 한국어이고, 잘못 쓴 값을 그대로 되돌려 보여줍니다.
 */

/** `YYYY-MM-DD` 형태인지 + 실제로 존재하는 날짜인지 (2026-02-31 같은 값 차단) */
function isRealDate(value: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return false;
  const [, y, mo, d] = m;
  const dt = new Date(`${y}-${mo}-${d}T00:00:00Z`);
  return (
    dt.getUTCFullYear() === Number(y) &&
    dt.getUTCMonth() + 1 === Number(mo) &&
    dt.getUTCDate() === Number(d)
  );
}

/**
 * 태그 한 개.
 * PRD §4.3: 앞뒤 공백과 맨 앞 `#`은 **자동 제거 후 통과**시킵니다. (`# 전직` → `전직`)
 * 정규화를 먼저 하고 길이를 검사해야 `  전직  `이 공백 때문에 탈락하지 않습니다.
 */
const tagSchema = z
  .string({ error: "태그는 문자열이어야 합니다" })
  .transform((raw) => raw.trim().replace(/^#/, "").trim())
  .refine((tag) => tag.length >= 1, { error: "빈 태그는 쓸 수 없습니다" })
  .refine((tag) => tag.length <= 20, {
    error: "태그는 20자 이내여야 합니다",
  });

const tagsSchema = z
  .array(tagSchema, { error: "tags는 배열이어야 합니다 (예: [전직, 독립])" })
  .min(1, { error: "태그를 최소 1개 적어 주세요" })
  .max(4, { error: "태그는 최대 4개까지만 쓸 수 있습니다 (카드 레이아웃 보호)" })
  .refine((tags) => new Set(tags).size === tags.length, {
    error: "같은 글 안에서 태그가 중복됐습니다",
  });

export const frontmatterSchema = z.object({
  name: z
    .string({ error: "name은 필수입니다 (인터뷰 대상 이름)" })
    .trim()
    .min(1, { error: "name이 비어 있습니다" }),

  role: z.string().trim().min(1).optional(),

  avatar: z.string().trim().min(1).optional(),

  title: z
    .string({ error: "title은 필수입니다 (인터뷰 제목)" })
    .trim()
    .min(1, { error: "title이 비어 있습니다" }),

  // 주의: zod v4에서는 `.refine(check, (v) => ({...}))`처럼 두 번째 인자에 함수를
  // 넘길 수 없습니다(무시되고 스키마 레벨 메시지로 폴백합니다). 잘못 쓴 값을
  // 메시지에 담으려면 superRefine을 써야 합니다.
  date: z
    .string({
      error:
        "date는 따옴표 없는 YYYY-MM-DD 문자열이어야 합니다 (예: 2026-08-14)",
    })
    .superRefine((value, ctx) => {
      if (!isRealDate(value)) {
        ctx.addIssue({
          code: "custom",
          message: `YYYY-MM-DD 형식의 실제 날짜여야 합니다 (받은 값: ${JSON.stringify(value)})`,
        });
      }
    }),

  summary: z
    .string({ error: "summary는 필수입니다 (상세 리드 문단 · meta description)" })
    .trim()
    .min(1, { error: "summary가 비어 있습니다" }),

  tags: tagsSchema,

  pullQuote: z.string().trim().min(1).optional(),

  published: z.boolean().optional().default(true),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;

/**
 * 검증 실패를 사람이 읽을 수 있는 한 덩어리 에러로 만듭니다.
 *
 *   content/posts/kim-dohyun.mdx: frontmatter 검증 실패
 *     - date: YYYY-MM-DD 형식의 실제 날짜여야 합니다 (받은 값: "2026-8-14")
 */
export function parseFrontmatter(
  data: unknown,
  relativePath: string
): Frontmatter {
  const result = frontmatterSchema.safeParse(data);
  if (result.success) return result.data;

  const lines = result.error.issues.map((issue) => {
    // path가 ["tags", 2]면 "tags[2]"로 보여 줍니다.
    const field =
      issue.path.length === 0
        ? "(최상위)"
        : issue.path
            .map((seg, i) =>
              // zod v4의 path는 PropertyKey[]라 symbol이 올 수 있습니다.
              typeof seg === "number"
                ? `[${seg}]`
                : i === 0
                  ? String(seg)
                  : `.${String(seg)}`
            )
            .join("");
    return `  - ${field}: ${issue.message}`;
  });

  throw new Error(
    `${relativePath}: frontmatter 검증 실패\n${lines.join("\n")}`
  );
}

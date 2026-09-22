import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";

import { parseFrontmatter } from "@/lib/schema";

/**
 * MDX 콘텐츠 로더 (PRD §4.6)
 *
 * ⚠ 이 모듈은 `node:fs`를 씁니다. **서버에서만** import하세요.
 *   클라이언트 컴포넌트(`"use client"`)에서 호출하면 안 됩니다.
 */

export type Interview = {
  slug: string;
  name: string;
  role?: string;
  avatar?: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  summary: string;
  tags: string[];
  pullQuote?: string;
  published: boolean;
  body: string; // MDX 원문
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/**
 * gray-matter는 기본적으로 js-yaml의 기본 스키마를 쓰는데, 그러면 따옴표 없는
 * `date: 2026-08-14`가 **Date 객체**로 바뀝니다. PRD §4.6의 `date: string`과
 * 어긋나고, 형식 오류 메시지에 작성자가 쓴 원문을 보여줄 수도 없게 됩니다.
 * CORE_SCHEMA에는 timestamp 타입이 없어 날짜가 문자열 그대로 남습니다.
 * (boolean·number·배열은 CORE_SCHEMA에서도 정상 파싱됩니다.)
 */
const matterOptions = {
  engines: {
    yaml: {
      parse: (src: string) => yaml.load(src, { schema: yaml.CORE_SCHEMA }) as object,
      stringify: () => {
        throw new Error("frontmatter 직렬화는 이 프로젝트에서 쓰지 않습니다");
      },
    },
  },
};

let cache: Interview[] | null = null;

/**
 * `content/posts/*.mdx`를 전부 읽어 검증합니다.
 * 검증에 실패하면 파일명·필드명을 담은 에러를 던져 빌드를 중단시킵니다.
 * published 여부와 관계없이 전부 돌려주며, 걸러내는 일은 호출하는 쪽에서 합니다.
 */
function loadAll(): Interview[] {
  if (cache) return cache;

  if (!fs.existsSync(POSTS_DIR)) {
    cache = [];
    return cache;
  }

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  const bySlug = new Map<string, string>();
  const interviews: Interview[] = [];

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const relativePath = path.join("content", "posts", file);

    // PRD §4.6: slug 중복(파일명 충돌)도 빌드 실패.
    // 대소문자만 다른 파일명은 일부 파일시스템에서 같은 URL로 충돌합니다.
    const key = slug.toLowerCase();
    const seen = bySlug.get(key);
    if (seen) {
      throw new Error(
        `slug가 중복됐습니다: "${slug}"\n` +
          `  - ${seen}\n` +
          `  - ${relativePath}\n` +
          `  파일명이 곧 URL이므로 둘 중 하나의 이름을 바꿔 주세요.`
      );
    }
    bySlug.set(key, relativePath);

    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { data, content } = matter(raw, matterOptions);
    const fm = parseFrontmatter(data, relativePath);

    interviews.push({
      slug,
      name: fm.name,
      role: fm.role,
      avatar: fm.avatar,
      title: fm.title,
      date: fm.date,
      summary: fm.summary,
      tags: fm.tags,
      // PRD §4.2: pullQuote가 비면 summary 앞부분을 씁니다.
      pullQuote: fm.pullQuote ?? truncate(fm.summary, 40),
      published: fm.published,
      body: content,
    });
  }

  cache = interviews;
  return cache;
}

function truncate(text: string, max: number): string {
  const t = text.trim();
  return t.length <= max ? t : `${t.slice(0, max - 1).trimEnd()}…`;
}

/** published인 인터뷰만, date 내림차순(최신 우선). */
export function getAllInterviews(): Interview[] {
  return loadAll()
    .filter((i) => i.published)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** published가 아니거나 없는 slug면 null. 호출하는 쪽에서 notFound() 처리. */
export function getInterviewBySlug(slug: string): Interview | null {
  return loadAll().find((i) => i.slug === slug && i.published) ?? null;
}

/** generateStaticParams용. published만. */
export function getAllSlugs(): string[] {
  return getAllInterviews().map((i) => i.slug);
}

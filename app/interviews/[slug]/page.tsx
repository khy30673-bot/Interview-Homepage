import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { CreditNotice } from "@/components/credit-notice";
import { InterviewHeader } from "@/components/interview-header";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { getAllSlugs, getInterviewBySlug } from "@/lib/interviews";
import { orderTags } from "@/lib/tags";
import { siteConfig } from "@/site.config";

/**
 * S-3 인터뷰 상세 (PRD §S-3 / §4.5)
 *
 * SSG. `next-mdx-remote/rsc`는 서버 전용이라 "use client"를 붙이면 안 됩니다.
 *
 * ⚠ Next 16에서는 `params`가 Promise입니다. PRD §4.5의 예시 코드는 Next 14
 *   기준이라 동기 접근으로 적혀 있는데, 그대로 쓰면 동작하지 않습니다.
 *   동작 사양(제목 형식·description·openGraph)은 PRD 그대로입니다.
 */

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const interview = getInterviewBySlug(slug);
  if (!interview) return {};

  return {
    title: `${interview.title} — ${interview.name} | ${siteConfig.name}`,
    description: interview.summary,
    openGraph: {
      title: interview.title,
      description: interview.summary,
      type: "article" as const,
    },
  };
}

export default async function InterviewDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const interview = getInterviewBySlug(slug);

  // 없는 slug, 또는 published: false → 404 (PRD §S-3)
  if (!interview) notFound();

  const tags = orderTags(interview.tags);

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 md:py-14">
      <Link
        href="/interviews"
        className="inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        ← 인터뷰 목록으로
      </Link>

      <div className="mt-8">
        <InterviewHeader interview={interview} tags={tags} />
      </div>

      {/* 본문 — MDX. <QA>가 질문/답변을 구분합니다. */}
      <div className="mt-12">
        <MDXRemote source={interview.body} components={mdxComponents} />
      </div>

      <CreditNotice date={interview.date} />

      <div className="mt-10">
        <Link
          href="/interviews"
          className="inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          ← 인터뷰 목록으로
        </Link>
      </div>
    </article>
  );
}

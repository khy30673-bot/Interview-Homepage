import type { MDXComponents } from "mdx/types";

import { QA } from "@/components/mdx/qa";

/**
 * MDX에서 쓸 수 있는 컴포넌트 (PRD §6.7)
 *
 * 여기에 매핑해 두면 운영자가 MDX 파일에서 import 없이 바로 쓸 수 있습니다.
 * `@tailwindcss/typography`를 쓰지 않으므로 기본 태그도 직접 스타일링합니다.
 */
export const mdxComponents: MDXComponents = {
  QA,

  // <QA> 안의 문단. 빈 줄로 나뉜 문단이 여기로 들어옵니다.
  p: (props) => <p {...props} />,

  strong: (props) => <strong className="font-semibold" {...props} />,
  em: (props) => <em className="italic" {...props} />,

  a: (props) => (
    <a
      className="underline underline-offset-4 hover:text-foreground"
      {...props}
    />
  ),

  ul: (props) => <ul className="list-disc space-y-2 pl-5" {...props} />,
  ol: (props) => <ol className="list-decimal space-y-2 pl-5" {...props} />,

  blockquote: (props) => (
    <blockquote
      className="border-l-2 border-muted-foreground/40 pl-4 text-muted-foreground"
      {...props}
    />
  ),

  hr: () => <hr className="my-10 border-border" />,
};

import Link from "next/link";

import { Button } from "@/components/ui/liquid-glass-button";

/**
 * 404 (PRD §S-4)
 *
 * 버튼은 `components/ui/liquid-glass-button.tsx`가 export하는 `Button`입니다.
 * MVP에서 버튼 컴포넌트를 쓰는 곳은 여기 하나뿐이라 shadcn `button`은
 * 설치하지 않았습니다 (PRD §6.4.1).
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-24 text-center md:py-32">
      <h1 className="text-2xl font-semibold tracking-tight">
        찾는 인터뷰가 없습니다.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground text-pretty">
        주소가 바뀌었거나 공개가 내려간 글일 수 있습니다.
      </p>

      <Button asChild size="lg" className="mt-8">
        <Link href="/interviews">인터뷰 목록으로 돌아가기</Link>
      </Button>
    </div>
  );
}

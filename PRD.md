# PRD — 진로를 재탐색합니다

> 인터뷰 질문과 답변 아카이브 홈페이지 · MVP
>
> **작성** 2026-09-22 · **운영자** 희연 · **문서 버전** 1.0

---

## 0. 이 문서를 읽는 AI 코딩 도구에게

- 이 문서는 **확정된 사양**입니다. 임의로 범위를 넓히지 마세요.
- `§10 범위 외`에 적힌 것은 **만들지 마세요.** 검색·로그인·댓글·관리자 화면 등입니다.
- 애매한 부분이 있으면 추측해서 구현하지 말고, 작업을 멈추고 질문하세요.
- 작업 순서는 `§8`을 따르세요. 특히 **8단계(3D 마퀴 클릭)** 는 구현 직후 반드시 실제 클릭 테스트를 하세요.
- 참고 프로토타입: `reference/entry-screen.html` — 입장 화면의 궤적·워드마크·버튼이 동작하는 상태로 구현되어 있습니다. 수치가 애매하면 이 파일을 기준으로 삼으세요.

---

## 1. 제품 개요

### 1.1 한 줄 정의

여러 사람에게 "진로 재탐색"을 주제로 물은 질문과 답변을, **인터뷰 대상 단위**로 모아 누구나 자유롭게 읽을 수 있게 공개하는 1인 운영 아카이브 사이트.

### 1.2 핵심 가치

| 가치 | 내용 |
|---|---|
| **대상 중심 탐색** | 글 목록이 아니라 *사람* 목록. 방문자는 "누구에게 물었나"를 먼저 보고, 관심 있는 사람을 골라 그 사람의 Q&A 전체를 읽는다 |
| **읽기에만 집중** | 로그인·댓글·검색 없음. 방해 요소 없이 질문과 답변만 남긴다 |
| **운영자 권한의 명시** | 이 아카이브는 **희연**이 기획·질문·정리한 결과물이다. 무료로 열람 가능하되, 저작·인용 권한을 푸터와 각 인터뷰 하단에 분명히 표기한다 |

### 1.3 MVP 범위

**포함** — 입장 화면, 인터뷰 대상 선택 화면(3D 마퀴 + 목록), 인터뷰 상세(Q&A), 저작권·인용 안내, 404

**제외** — `§10` 참조

### 1.4 콘텐츠 운영 방식

운영자가 `content/posts/*.mdx` 파일을 직접 추가·수정하고 커밋하면 배포 시 반영됩니다. **관리 UI는 만들지 않습니다.**

### 1.5 성공 기준

1. MDX 파일 하나를 추가하면 **코드 수정 없이** 목록과 상세에 자동 반영된다.
2. 모바일(360px)과 PC(1440px) 모두에서 레이아웃이 깨지지 않고 본문이 읽힌다.
3. 방문자가 입장 → 대상 선택 → Q&A 읽기까지 **3번 이내 클릭**으로 도달한다.

---

## 2. 유저스토리

| ID | 스토리 | 완료 조건 |
|---|---|---|
| **US-1** | 방문자로서, 사이트에 들어왔을 때 이곳이 어떤 곳인지 한눈에 알고 싶다 | 입장 화면 중앙에 "진로를 재탐색합니다" 워드마크와 LiquidButton이 보이고, 버튼을 누르면 `/interviews`로 이동한다 |
| **US-2** | 방문자로서, **어떤 대상들에게** 인터뷰를 했는지 훑어보고 싶다 | 인터뷰 대상 카드들이 3D 마퀴로 흐르며, 각 카드에 아바타·이름·역할·대표 문장이 보인다. 하단 목록에서도 전체 대상을 정적으로 확인할 수 있다 |
| **US-3** | 방문자로서, 관심 가는 대상을 **클릭해 그 사람에게 한 질문과 답변**을 읽고 싶다 | 마퀴 카드 또는 목록 항목 클릭 → `/interviews/[slug]` 이동. 질문이 Q, 답변이 A로 시각 구분되어 순서대로 표시된다 |
| **US-4** | 방문자로서, 각 인터뷰가 **어떤 키워드**의 이야기인지 빠르게 파악하고 싶다 | 목록 카드와 상세 상단에 해시태그가 뱃지로 표시된다 (표시 전용, 클릭 불가) |
| **US-5** | 방문자로서, 이 인터뷰를 **누가 만들었고 어떻게 인용해야 하는지** 알고 싶다 | 모든 페이지 푸터에 저작권 표기, 각 인터뷰 상세 하단에 기획·질문·정리 주체와 인용 조건 안내 블록이 표시된다 |

### 2.1 공통 비기능 요구

- **반응형** — 모바일 1열 / 태블릿 2열 / PC 3열. 본문 최대폭 `max-w-3xl`, 본문 폰트 17~18px
- **모바일 대응** — 마퀴는 `md` 미만에서 3D를 뺀 **가로 1줄**로 대체 (세로 마퀴는 페이지 스크롤과 방향이 겹쳐 금지). 상세는 `§S-2`
- **모션 배려** — `prefers-reduced-motion: reduce` 시 마퀴·궤적·밑줄 점멸 모두 정지
- **키보드 접근** — 모든 인터랙티브 요소가 Tab으로 도달 가능하고 focus ring 유지

---

## 3. 화면 목록

### 3.1 화면 흐름

```
  /  입장 화면
  │   흰 배경 + 블루·퍼플 궤적 + "진로를 재탐색합니다" + LiquidButton
  ↓
  /interviews  대상 선택 화면
  │   [마퀴: 대상 카드]  ← PC는 3D 세로, 모바일은 평면 가로
  │   [목록: 아바타·이름·역할·제목·날짜·태그]
  ↓  (카드 클릭)
  /interviews/[slug]  인터뷰 상세
      헤더 → Q&A 본문 → 권한 블록
```

---

### S-1 · 입장 화면

**라우트** `/` · **렌더링** Static · **헤더 숨김**

| 구성 요소 | 사양 |
|---|---|
| 배경 | `#FFFFFF` 전체 화면 (`min-h-dvh`) |
| 커서 궤적 | `<CursorTrail />` — 전체 화면 canvas, 블루→퍼플. 상세는 `§6.5` |
| 워드마크 | `<SiteWordmark size="lg" />` — 상세는 `§6.6` |
| 진입 버튼 | `LiquidButton` — 라벨 "인터뷰 보러 가기", `asChild`로 `<Link href="/interviews">` 감쌈 |
| 푸터 | `© 2026 희연` — 하단 중앙, `text-[11.5px]`, 흐린 회색 |
| 레이아웃 | 세로 중앙 정렬, 워드마크와 버튼 사이 `gap-11`(44px) |
| 보조 문구 | **없음** |

**제약**

- 스크롤 없는 한 화면
- 버튼은 실제 `<a>`로 렌더 (새 탭 열기·크롤링 가능)
- 모바일에서 워드마크 2줄 줄바꿈 허용

---

### S-2 · 인터뷰 대상 선택 화면

**라우트** `/interviews` · **렌더링** Static (빌드 시 MDX 전체 로드)

#### 상단 — 마퀴 (`<InterviewMarquee />`)

**PC와 모바일이 서로 다른 형태입니다.** 모바일에서 숨기지 않고, 3D를 뺀 가로 마퀴로 대체합니다.

**PC (`md` 이상) — 3D 세로 2컬럼**

| 구성 요소 | 사양 |
|---|---|
| 컨테이너 | `w-full`, 높이 **384px**, `perspective: 300px`, `overflow-hidden` |
| 기울임 | `translateX(-40px) translateZ(-70px) rotateX(18deg) rotateY(-9deg) rotateZ(16deg)` |
| 마퀴 컬럼 | `Marquee vertical` **2컬럼**, 한쪽은 `reverse`, `pauseOnHover`, `repeat={4}` |
| 카드 | `<IntervieweeCard />` — 아바타(size-9) + 이름 + 역할 + 대표 문장(`pullQuote`) |
| 카드 크기 | 폭 **212px**, 카드 간격 **14px** |
| 주기 | **34s** linear |
| 페이드 | 상하 **26%**, 좌우 **22%** — **모두 `pointer-events-none` 필수** |

**모바일 (`md` 미만) — 평면 가로 1줄**

| 구성 요소 | 사양 |
|---|---|
| 컨테이너 | `w-full`, 높이 **142px**, `overflow-hidden` |
| 3D | **없음.** `perspective`와 `rotate` 모두 걸지 않습니다 |
| 마퀴 | 가로 1줄, `repeat={4}` |
| 카드 크기 | 폭 **172px**, 카드 간격 **10px** |
| 주기 | **30s** linear |
| 페이드 | 좌우 **38px**만 (상하 없음) — `pointer-events-none` |

> **세로 마퀴 금지.** 모바일에서 세로로 흐르면 페이지 스크롤과 방향이 겹쳐 조작이 헷갈립니다.

**공통**

| 항목 | 사양 |
|---|---|
| 카드 동작 | 카드 전체를 `<Link href={`/interviews/${slug}`}>`로 감쌈 |
| 모션 | `prefers-reduced-motion: reduce` 시 정지 (`§6.9`) |
| 배터리 | `IntersectionObserver`로 화면 밖에 나가면 `animation-play-state: paused`, 다시 들어오면 `running` |
| 접근성 | 마퀴 전체를 **`aria-hidden`** 으로 보조기술에서 제외하고, 카드 링크에 **`tabIndex={-1}`**. `repeat`로 같은 링크가 여러 벌 복제되는 데다 일부는 잘려 보이지도 않으므로, 키보드·스크린리더의 접근 경로는 **하단 목록 하나로 모읍니다.** 마퀴 카드는 복제본이라 정보 가치가 없습니다 |

> ⚠ **가장 실패하기 쉬운 지점.** 3D transform + 그라디언트 오버레이 + 무한 애니메이션 위에서 링크를 클릭해야 합니다. 구현 직후 실제 클릭 테스트를 하세요.

#### 하단 — 인터뷰 목록 (`<InterviewList />`)

| 구성 요소 | 사양 |
|---|---|
| 섹션 헤딩 | "인터뷰 목록" (h2) |
| 카드 표시 정보 | **아바타 · 이름 · 역할 · 제목 · 날짜 · 태그** |
| 요약(`summary`) | **표시하지 않음** — 상세 리드 문단과 meta description에만 사용 |
| 제목 | h3, 2줄까지, 넘으면 말줄임 |
| 날짜 | `2026.09.22` 형식, `text-xs text-muted-foreground` |
| 태그 | shadcn `Badge`, 최대 4개, **표시 전용 (링크 아님)** |
| 정렬 | 날짜 내림차순 (최신 우선) |
| 레이아웃 | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4` |
| 빈 상태 | "아직 공개된 인터뷰가 없습니다." |

---

### S-3 · 인터뷰 상세

**라우트** `/interviews/[slug]` · **렌더링** SSG (`generateStaticParams`)

| 영역 | 구성 요소 |
|---|---|
| **헤더** | 아바타 · 이름 · 역할 · 인터뷰 제목(h1) · 날짜 · 태그 뱃지 |
| | 요약 리드 문단 — `text-lg text-muted-foreground` |
| **본문** | MDX. `<QA>` 컴포넌트로 질문/답변 구분. 상세는 `§6.7` |
| | 최대폭 `max-w-3xl`, `leading-relaxed`, 17~18px |
| **권한 블록** | `<CreditNotice />` — 상세는 `§6.8` |
| **네비게이션** | "← 인터뷰 목록으로" 링크 — 상단·하단 각 1개 |

**제약**

- 헤더에 표시되는 **모든 값은 frontmatter 또는 `site.config.ts`에서 읽는다.** 하드코딩 금지 (`§4.4` 참조)
- `role`, `avatar`, `pullQuote`가 비어 있어도 화면이 깨지지 않고 해당 요소만 조용히 사라진다
- 존재하지 않는 slug → `notFound()`

---

### S-4 · 공통 요소 & 404

| 구성 요소 | 사양 |
|---|---|
| 헤더 | `<SiteWordmark size="sm" />` 텍스트 로고(홈 링크). **입장 화면(`/`)에서는 숨김** |
| 푸터 | `© 2026 희연. 이 사이트의 인터뷰 기획·질문·정리 저작권은 희연에게 있습니다. 무단 전재 및 재배포를 금지합니다.` |
| 폰트 | Pretendard 또는 `next/font`의 Noto Sans KR |
| 테마 | 라이트 전용. 다크모드는 MVP 제외 (단, shadcn CSS 변수 구조는 유지) |
| 404 | `not-found.tsx` — "찾는 인터뷰가 없습니다." + 목록으로 돌아가는 버튼 |

---

## 4. 데이터 스키마

### 4.1 폴더 구조

```
/
├─ app/
│  ├─ layout.tsx                    # 공통 레이아웃 (헤더/푸터)
│  ├─ page.tsx                      # S-1 입장 화면
│  ├─ not-found.tsx                 # S-4 404
│  ├─ globals.css
│  └─ interviews/
│     ├─ page.tsx                   # S-2 대상 선택 화면
│     └─ [slug]/page.tsx            # S-3 인터뷰 상세
├─ components/
│  ├─ ui/                           # shadcn 영역
│  │  ├─ liquid-glass-button.tsx    # 전달받은 파일 (그대로)
│  │  ├─ 3d-testimonails.tsx        # 전달받은 파일 (Marquee)
│  │  ├─ card.tsx
│  │  ├─ avatar.tsx
│  │  └─ badge.tsx
│  ├─ cursor-trail.tsx              # 신규 — 입장 화면 궤적
│  ├─ site-wordmark.tsx             # 신규 — 워드마크
│  ├─ site-header.tsx
│  ├─ site-footer.tsx
│  ├─ interview-marquee.tsx
│  ├─ interviewee-card.tsx
│  ├─ interview-list.tsx
│  ├─ interview-list-item.tsx
│  ├─ interview-header.tsx
│  ├─ credit-notice.tsx
│  └─ mdx/
│     ├─ qa.tsx
│     └─ mdx-components.tsx
├─ content/
│  ├─ README.md                     # 편집 가이드 (한국어)
│  ├─ tags.json                     # 선택 — 태그 표시 순서
│  └─ posts/
│     ├─ kim-dohyun.mdx
│     ├─ lee-seojin.mdx
│     └─ park-haram.mdx
├─ lib/
│  ├─ utils.ts                      # cn()
│  ├─ schema.ts                     # zod 검증
│  ├─ interviews.ts                 # MDX 로더
│  └─ tags.ts                       # 태그 수집
├─ public/avatars/
└─ site.config.ts
```

**파일명이 곧 URL slug입니다.** `kim-dohyun.mdx` → `/interviews/kim-dohyun`

---

### 4.2 frontmatter 스키마

```yaml
---
name: 김도현
role: 프리랜스 에디터 · 전 병원 홍보팀
avatar: /avatars/kim-dohyun.jpg
title: 회사 밖에서 글을 쓰기까지
date: 2026-08-14
summary: 8년 다닌 병원을 나와 프리랜서로 자리 잡기까지 2년. 그 사이에 무엇을 확인했는지 물었다.
tags: [전직, 독립]
pullQuote: 그만두는 건 결정이 아니라 과정이었어요.
published: true
---
```

| 필드 | 타입 | 필수 | 사용 위치 | 비고 |
|---|---|:--:|---|---|
| `name` | string | ✅ | 마퀴·목록·상세 | 인터뷰 대상 이름 |
| `role` | string | ❌ | 마퀴·목록·상세 | 비우면 해당 줄이 사라짐 |
| `avatar` | string | ❌ | 마퀴·목록·상세 | 비우면 이름 첫 글자 이니셜로 폴백 |
| `title` | string | ✅ | 목록·상세 h1·`<title>` | 30자 이내 권장 |
| `date` | string | ✅ | 목록·상세·정렬 | `YYYY-MM-DD`. 형식 오류 시 **빌드 실패** |
| `summary` | string | ✅ | 상세 리드·meta description | 120자 이내 권장. **목록 카드에는 미표시** |
| `tags` | string[] | ✅ | 목록·상세 뱃지 | 1~4개 |
| `pullQuote` | string | ❌ | 마퀴 카드 | 40자 이내. 비우면 `summary` 앞부분 사용 |
| `published` | boolean | ❌ | 전역 | 기본 `true`. `false`면 목록·정적 생성에서 제외 |

---

### 4.3 태그 정책

**고정된 태그 목록은 없습니다.** 운영자가 MDX에 쓰는 대로 자유롭게 늘어납니다.

| 항목 | 처리 |
|---|---|
| 태그 수집 | `content/posts/*.mdx` 전체를 훑어 자동 수집 |
| 정렬 | 사용 횟수 내림차순 → 가나다순 |
| 표시 순서 지정 | `content/tags.json`의 `order` 배열 (선택, 없어도 정상 동작) |
| 클릭 | **불가.** 태그 페이지·필터링 없음 |

```json
// content/tags.json (선택)
{ "order": ["전직", "다시공부", "공백기", "독립"] }
```

#### 검증 규칙

| 조건 | 처리 |
|---|---|
| `tags`가 배열이 아니거나 비어 있음 | 빌드 실패 |
| 태그 1개가 1~20자 범위를 벗어남 | 빌드 실패 |
| 한 글에 태그 5개 이상 | 빌드 실패 (카드 레이아웃 보호) |
| 같은 글 안에서 태그 중복 | 빌드 실패 |
| 앞뒤 공백, 맨 앞 `#` | **자동 제거 후 통과** (`# 전직` → `전직`) |
| 처음 보는 태그 | **통과** |
| 사이트 전체에서 1번만 쓰인 태그 | **경고만** 출력 (오타 감지용) |

```
⚠ 한 번만 사용된 태그가 있습니다. 오타가 아닌지 확인해 주세요:
   - 전 직   (park-haram.mdx)
```

---

### 4.4 편집 권한 구조

로그인·DB가 없으므로, **편집 권한 = 저장소 쓰기 권한**입니다.

> **원칙: 헤더에 표시되는 모든 값은 컴포넌트에 하드코딩하지 않는다.**

| 대상 | 권한 | 방법 |
|---|---|---|
| 희연 (운영자) | 전체 편집 | 저장소 Owner / 로컬 직접 수정 |
| 편집 협력자 | 콘텐츠 편집 | 저장소 **Write** 권한 → `content/posts/*.mdx`만 수정 |
| 일반 방문자 | 읽기 전용 | 편집 UI 없음 |

**구현 요구사항**

1. 선택 필드(`role`, `avatar`, `pullQuote`)가 비어도 화면이 깨지지 않는다
2. MDX 수정 → 커밋 → 자동 재배포. 개발 중에는 저장 즉시 핫리로드
3. `content/README.md`에 각 필드의 의미·예시·주의사항을 **한국어로** 기술. 코드를 몰라도 수정 가능해야 함
4. 검증 실패 시 **파일명과 필드명을 담은 에러**로 빌드 중단
5. (선택) `CODEOWNERS`에 `content/` 리뷰어를 희연으로 지정

---

### 4.5 라우팅

| 라우트 | 파일 | 렌더링 | 비고 |
|---|---|---|---|
| `/` | `app/page.tsx` | Static | 헤더 숨김 |
| `/interviews` | `app/interviews/page.tsx` | Static | 빌드 시 전체 MDX 로드 |
| `/interviews/[slug]` | `app/interviews/[slug]/page.tsx` | SSG | `published: false` 제외 |
| 그 외 | `app/not-found.tsx` | Static | |

```ts
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const i = getInterviewBySlug(params.slug);
  if (!i) return {};
  return {
    title: `${i.title} — ${i.name} | ${siteConfig.name}`,
    description: i.summary,
    openGraph: { title: i.title, description: i.summary, type: "article" },
  };
}
```

---

### 4.6 콘텐츠 로더

```ts
// lib/interviews.ts
export type Interview = {
  slug: string;
  name: string;
  role?: string;
  avatar?: string;
  title: string;
  date: string;       // ISO YYYY-MM-DD
  summary: string;
  tags: string[];
  pullQuote?: string;
  published: boolean;
  body: string;       // MDX 원문
};

getAllInterviews(): Interview[]              // published만, date 내림차순
getInterviewBySlug(slug: string): Interview | null
getAllSlugs(): string[]
```

```ts
// lib/tags.ts
getAllTags(): { tag: string; count: number }[]
```

- frontmatter 파싱은 `gray-matter`
- 검증은 `lib/schema.ts`의 zod 스키마. 실패 시 파일명·필드명을 담아 throw → 빌드 중단
- `slug` 중복(파일명 충돌)도 빌드 실패
- `lib/interviews.ts`는 `node:fs`를 쓰므로 **서버에서만** import. 클라이언트 컴포넌트에서 호출 금지

---

### 4.7 `site.config.ts`

```ts
export const siteConfig = {
  name: "진로를 재탐색합니다",
  nameEmphasis: "재탐색",
  entryCta: "인터뷰 보러 가기",
  owner: "희연",
  copyrightYear: 2026,
  creditLine: "기획 · 질문 · 정리",
  usageNotice:
    "이 인터뷰의 기획, 질문 구성, 정리 및 편집에 대한 저작권은 희연에게 있습니다. " +
    "인용 시 출처를 밝혀 주시고, 무단 전재 및 재배포를 금지합니다.",
} as const;
```

헤더·푸터·크레딧 문구는 이 파일 한 곳만 수정하면 전 페이지에 반영됩니다.

---

## 5. 샘플 콘텐츠

> 구조 확인용 예시입니다. 실제 인터뷰로 교체될 것을 전제로 합니다.
> 아바타 이미지는 없으므로 `avatar` 필드를 비워 **이니셜 폴백 동작을 검증**하세요.

### 5.1 `content/posts/kim-dohyun.mdx`

```mdx
---
name: 김도현
role: 프리랜스 에디터 · 전 병원 홍보팀
title: 회사 밖에서 글을 쓰기까지
date: 2026-08-14
summary: 8년 다닌 병원을 나와 프리랜서로 자리 잡기까지 2년. 그 사이에 무엇을 확인했는지 물었다.
tags: [전직, 독립]
pullQuote: 그만두는 건 결정이 아니라 과정이었어요.
---

<QA q="그만두기로 마음먹은 결정적인 순간이 있었나요?">
없었어요. 그게 제일 말하고 싶은 부분이에요. 다들 계기를 물어보시는데,
저는 3년쯤 조금씩 기울어지다가 어느 날 서류를 냈어요.
그만두는 건 결정이 아니라 과정이었어요.
</QA>

<QA q="준비 없이 나왔을 때 가장 먼저 부딪힌 문제는 무엇이었나요?">
일이 없는 게 아니라 일을 설명할 말이 없는 거였어요.
병원에서 8년 동안 한 일을 밖에서 알아듣게 옮기는 데 반년이 걸렸습니다.
</QA>

<QA q="지금 같은 고민을 하는 사람에게 해주고 싶은 말이 있다면요?">
나가기 전에 작은 걸 하나라도 밖에서 끝까지 해보라고 말하고 싶어요.
돈이 안 되어도 괜찮아요. 완결해 본 경험이 있으면 그다음이 훨씬 쉬워집니다.
</QA>
```

### 5.2 `content/posts/lee-seojin.mdx`

```mdx
---
name: 이서진
role: 사회복지 전공 편입생 · 주간 근무 병행
title: 서른에 다시 학생이 된다는 것
date: 2026-08-28
summary: 일을 유지한 채 편입을 택했다. 시간을 어떻게 쪼갰는지, 무엇을 포기했는지 물었다.
tags: [다시공부, 공백기]
pullQuote: 포기한 건 시간이 아니라 속도였어요.
---

<QA q="일을 그만두지 않고 공부를 택한 이유가 있나요?">
쉬어 본 적이 있어요. 여섯 달. 그때 제가 공부를 더 안 하더라고요.
저한테는 비어 있는 시간이 오히려 독이었어요. 그래서 이번엔 둘 다 쥐기로 했습니다.
</QA>

<QA q="현실적으로 하루가 어떻게 돌아가나요?">
평일은 퇴근 후 두 시간, 주말은 반나절이요.
대신 4년 걸릴 걸 5년으로 잡았어요. 포기한 건 시간이 아니라 속도였어요.
</QA>

<QA q="다시 공부하면서 달라진 점이 있다면요?">
직장에서 사람을 대하는 방식이 달라졌어요.
배운 걸 다음 날 바로 써먹을 수 있다는 게 늦게 시작한 사람의 이점인 것 같아요.
</QA>
```

### 5.3 `content/posts/park-haram.mdx`

```mdx
---
name: 박하람
role: 비영리단체 사업팀 · 전 제조업 15년
title: 1년을 비우고 다시 고른 자리
date: 2026-09-11
summary: 15년 다닌 회사를 나와 1년을 쉬었다. 그 1년이 무엇을 바꿨는지, 후회는 없는지 물었다.
tags: [전직, 공백기, 다시공부]
pullQuote: 쉬는 동안 답이 나오진 않았어요. 질문이 바뀌었을 뿐이에요.
---

<QA q="1년의 공백기를 어떻게 보내셨나요?">
석 달은 그냥 잤어요. 그다음 석 달은 불안해서 아무거나 배웠고요.
쓸모 있었던 건 마지막 반년이에요. 사람들을 만나서 뭐 하고 사는지 물어보고 다녔어요.
</QA>

<QA q="공백기에 대한 주변의 시선은 어땠나요?">
걱정이 대부분이었죠. 근데 정작 저를 뽑아준 곳에서는 그 1년을 제일 많이 물어봤어요.
비운 시간을 설명할 수 있으면 약점이 아니더라고요.
</QA>

<QA q="그 1년 동안 답을 찾으셨나요?">
아뇨. 쉬는 동안 답이 나오진 않았어요. 질문이 바뀌었을 뿐이에요.
'뭘 해야 먹고사나'에서 '누구랑 일하고 싶나'로요.
</QA>
```

---

## 6. 기술 스펙

### 6.1 스택

| 항목 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | Next.js (App Router) | Pages Router 금지 |
| 언어 | TypeScript (strict) | |
| 스타일 | **Tailwind CSS v4** | v3 불가 — 아래 참조 |
| UI | shadcn/ui | `components/ui/` 경로 고정 |
| 콘텐츠 | `gray-matter` + `next-mdx-remote/rsc` | Contentlayer 사용 금지 (유지보수 불안정) |
| 검증 | zod | |
| 배포 | Vercel (정적 생성) | |

**Tailwind v4가 필수인 이유** — 전달받은 컴포넌트가 v4 전용 문법을 씁니다.

- `@theme inline { --animate-marquee: ... }` — v4의 CSS-first 설정
- `bg-linear-to-t`, `inset-shadow-2xs` — v4에서 이름이 바뀐 유틸리티
- `size-9`, `has-[>svg]:px-3` — v4 기준 문법

### 6.2 초기화

**기존 프로젝트라면 먼저 확인**

```bash
cat package.json | grep -E '"(next|tailwindcss|typescript)"'
ls components.json 2>/dev/null && echo "shadcn 설치됨" || echo "shadcn 미설치"
```

| 확인 결과 | 조치 |
|---|---|
| Tailwind 없음 / v3 | v4로 마이그레이션하거나 신규 생성 |
| shadcn 미설치 | `npx shadcn@latest init` |
| 컴포넌트 경로가 `components/ui`가 아님 | **`components/ui`로 맞출 것.** 전달받은 코드가 전부 `@/components/ui/...`를 import함 |
| `@/` 별칭 없음 | `tsconfig.json`의 `paths`에 `"@/*": ["./*"]` 추가 |

**신규 생성**

```bash
npx create-next-app@latest career-reexplore \
  --typescript --tailwind --app --eslint --src-dir=false \
  --import-alias "@/*"
cd career-reexplore
npx shadcn@latest init
```

`shadcn init` 응답: Base color `Neutral`, CSS variables **Yes**, alias `@/components`

### 6.3 의존성

```bash
# shadcn 컴포넌트 — button은 설치하지 않음 (§6.4 참조)
npx shadcn@latest add card avatar badge

# 전달받은 컴포넌트 요구사항
npm install @radix-ui/react-slot @radix-ui/react-avatar class-variance-authority

# Tailwind v4 애니메이션 유틸
npm install tw-animate-css

# 콘텐츠 파이프라인
npm install gray-matter next-mdx-remote zod

# 아이콘 (필요 시)
npm install lucide-react
```

`clsx`, `tailwind-merge`는 `shadcn init`이 함께 설치합니다.

---

### 6.4 전달받은 컴포넌트 배치

#### `components/ui/liquid-glass-button.tsx`

전달받은 코드를 **그대로** 복사합니다.

| 항목 | 지시 |
|---|---|
| **shadcn `button` 설치하지 않음** | 이 파일이 `Button`과 `buttonVariants`를 이미 export합니다. MVP에서 `Button`을 쓰는 곳은 **404 화면의 "목록으로 돌아가기" 하나뿐**이므로, 그 버튼은 이 파일의 `Button`을 씁니다. 자세한 근거는 `§6.4.1` |
| `export { ... }` 위치 | 원본은 export문이 선언부보다 위에 있습니다. ESM에서 정상 동작하나, 가독성을 위해 **파일 맨 아래로 이동 권장** |
| **`LiquidButton`의 `asChild`** | 이 컴포넌트는 `Comp`에 자식을 4개(그림자 · 유리층 · 라벨 · `GlassFilter`) 넘기는데, Radix `Slot`은 단일 자식에만 props를 병합합니다. 따라서 `asChild`를 그냥 쓰면 런타임에서 `Slot failed to slot onto its children` 으로 **크래시**합니다. `@radix-ui/react-slot`의 **`Slottable`** 로 어느 자식이 루트가 될지 지정해야 `§S-1`이 요구하는 실제 `<a>` 렌더가 가능합니다 |
| **`GlassFilter`의 위치** | 원본은 `GlassFilter`를 `Comp`의 자식으로 넣습니다. 그러면 `<svg>`가 버튼의 직계 자식이 되어 size 변형의 `has-[>svg]:px-*`가 **항상** 매치되고, `:has(>svg)`의 특이도가 더 높아 `§7`의 좌우 패딩 44px이 아이콘용 32px로 덮입니다. `GlassFilter`를 **버튼 밖 형제로 옮길 것.** SVG `<defs>`의 filter는 id로 참조되는 문서 전역 리소스라 버튼 안에 있을 필요가 없습니다 |
| `MetalButton` | 사용하지 않음. **삭제할 것.** lint는 번들이 아니라 소스를 검사하므로, 트리셰이킹으로 번들에서 빠지더라도 미사용 코드의 `react-hooks/set-state-in-effect` 에러는 그대로 남습니다 |
| `GlassFilter`의 SVG id | `#container-glass`가 하드코딩되어 있어 같은 페이지에 2개 이상이면 id 중복. 입장 화면에 1개만 쓰므로 MVP에서는 문제없음 |
| **브라우저 호환** | `backdropFilter: url(#...)`은 Chrome/Edge에서만 동작. Safari·Firefox에서는 왜곡 없이 테두리·그림자만 보임 — **감수하고 진행**. 커서 궤적 자체는 모든 브라우저에서 보이므로 허용 가능한 수준 |

#### 6.4.1 `Button` 이름에 관한 메모

이 사이트에서 버튼 컴포넌트를 쓰는 곳은 **두 군데뿐**입니다.

| 요소 | 화면 | 쓰는 이름 |
|---|---|---|
| 인터뷰 보러 가기 | S-1 입장 | `LiquidButton` — 유일한 이름, 충돌 없음 |
| 목록으로 돌아가기 | S-4 404 | `Button` |

카드·헤더 로고·"← 인터뷰 목록으로"는 모두 `<Link>`이며 버튼 컴포넌트를 쓰지 않습니다. 태그는 `Badge`(표시 전용)입니다.

따라서 `Button` 이름이 걸리는 지점은 404 화면 하나이고, 지금은 `shadcn add button`을 실행하지 않습니다.

**나중에 이렇게 하세요** — `alert-dialog`, `calendar`, `pagination` 등 일부 shadcn 컴포넌트는 `components/ui/button.tsx`가 있다고 전제합니다. 그런 컴포넌트를 추가하게 되면:

1. `npx shadcn@latest add button` 실행
2. `liquid-glass-button.tsx`에서는 **`LiquidButton`만** import하도록 정리
3. 일반 `Button`은 `components/ui/button.tsx` 것을 사용

이 전환은 import 문 몇 줄 수정으로 끝납니다. 미리 설치해둘 이유가 없습니다.

#### `components/ui/3d-testimonails.tsx`

`Marquee`만 복사합니다. 파일명 오타(`testimonails`)는 원본 대조를 위해 **그대로 유지**.

| 항목 | 지시 |
|---|---|
| `React.useMemo`가 JSX 안에 있음 | 린트 경고 가능. 컴포넌트 본문 상단으로 올려 변수에 담을 것 |
| `autoFill` prop | 타입만 있고 **구현 없음.** 쓰지 말고 `repeat` 숫자로 조절 |
| `role="marquee"` + `tabIndex={0}` | 그대로 두고 `ariaLabel` 전달 |

#### 전달받은 `demo.tsx`는 복사하지 않음

대신 `components/interview-marquee.tsx`를 새로 작성합니다.

| 요구사항 | 내용 |
|---|---|
| 데이터 | `Interview[]`를 props로 받음. 하드코딩 배열 제거 |
| 컬럼 수 | 데모는 4컬럼 → **2컬럼**, `repeat={4}` |
| 크기 | 데모는 `max-w-[800px]` 고정 → **`w-full`** |
| 클릭 | 각 카드를 `<Link>`로 감쌈 |
| 오버레이 | 4개 모두 `pointer-events-none` **필수** |
| 반응형 | PC는 3D 세로 2컬럼, 모바일은 3D 없는 가로 1줄 (`§S-2`) |
| 오타 수정 | 데모의 `text-econdary-foreground` → **`text-secondary-foreground`** |
| 이미지 | 데모의 `cdn.21st.dev` URL 전부 제거. `public/avatars/` 로컬 파일만 사용 |
| 아바타 alt | `` `${name} 프로필 이미지` `` |

---

### 6.5 `<CursorTrail />` (신규)

입장 화면의 블루→퍼플 궤적입니다. **전달받은 코드에 없는 신규 컴포넌트**이며, 동작하는 구현이 `reference/entry-screen.html`에 있습니다.

| 항목 | 사양 |
|---|---|
| 방식 | 전체 화면 `<canvas>`, `position:fixed; inset:0; z-index:0` |
| 배경 | `#FFFFFF` |
| 색 | 블루 `hsl(228 95% 58%)` → 퍼플 `hsl(276 88% 56%)`, sin 위상으로 왕복 |
| 선 | `lineCap/lineJoin: round`, `lineWidth: max(14, 34 - min(dist,60)*0.22)`, `filter: blur(7px)`, `globalAlpha: 0.85` |
| 추종 | 이전 지점에서 목표 지점으로 `0.28` 비율 보간 (부드러운 지연) |
| 잔상 | 매 프레임 배경색을 `globalAlpha 0.045`로 덮어 서서히 소멸 |
| DPR | `min(devicePixelRatio, 2)`로 캡, `resize` 시 재설정 |
| **모바일/대기** | 포인터가 없거나 **2.2초간 멈추면** 리사주 곡선으로 자동 궤적 생성 |
| 모션 배려 | `prefers-reduced-motion: reduce`면 궤적을 그리지 않고 흰 배경만 유지 |
| 이벤트 | `pointermove`, `pointerdown` — 모두 `{passive:true}` |
| 마운트 | `"use client"`. 입장 화면에서만 렌더 |
| 레이어 | 워드마크·버튼은 `z-index:2`, `pointer-events:none` (버튼만 `auto`) |

```tsx
// 핵심 루프 (reference/entry-screen.html 참조)
function frame(now: number) {
  requestAnimationFrame(frame);

  // 잔상 소멸
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 0.045;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  if (reduce) return;

  let [tx, ty] = [cx, cy];
  if (cx === null || now - lastMove > 2200) ({ x: tx, y: ty } = autoPoint(now));
  if (tx === null) return;
  if (px === null) { px = tx; py = ty; return; }

  const dx = tx - px, dy = ty - py;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.4) return;

  const nx = px + dx * 0.28, ny = py + dy * 0.28;
  phase = (phase + 0.006) % 1;
  const k = (Math.sin(phase * Math.PI * 2) + 1) / 2;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = colorAt(k);          // 블루 → 퍼플 보간
  ctx.lineWidth = Math.max(14, 34 - Math.min(dist, 60) * 0.22);
  ctx.filter = "blur(7px)";
  ctx.globalAlpha = 0.85;
  ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(nx, ny); ctx.stroke();
  ctx.restore();

  px = nx; py = ny;
}
```

---

### 6.6 `<SiteWordmark />` (신규)

입장 화면(대형)과 헤더(소형)에서 크기만 바꿔 재사용합니다.

| 항목 | 사양 |
|---|---|
| 문자열 분해 | `siteConfig.name`에서 `nameEmphasis`를 `indexOf`로 찾아 앞/강조/뒤 3조각으로 분할. 못 찾으면 강조 없이 전체 출력 |
| 기본 글자 | `font-weight: 400`, `#3A352F` |
| 강조(`재탐색`) | `font-weight: 900`, `#000000` |
| 밑줄 | 절대배치 `<span>`, `#000000`, `height: .065em (min 3px)`, `bottom: -.15em` |
| 점멸 | `animate-blink` — 1.2초 주기, `step-end` (딱딱 끊기는 커서 느낌) |
| 크기 `lg` | `clamp(28px, 6vw, 54px)`, `letter-spacing: -.025em`, `line-height: 1.35` |
| 크기 `sm` | `text-base`, 밑줄 `h-[2px] -bottom-0.5` |
| 접근성 | 밑줄 span에 `aria-hidden`. 글자는 항상 불투명 |

```tsx
<span>
  진로를{" "}
  <em className="relative not-italic font-black text-black">
    재탐색
    <span aria-hidden className="animate-blink absolute -bottom-[0.15em] left-0 h-[3px] w-full bg-black" />
  </em>
  합니다
</span>
```

---

### 6.7 `<QA />` (신규)

```tsx
type QAProps = { q: string; children: React.ReactNode };
```

렌더 결과:

```
┃ Q. 그만두기로 마음먹은 결정적인 순간이 있었나요?     ← 좌측 강조선 + font-medium
   답변 본문이 여기에 표시됩니다.                       ← leading-relaxed
```

| 항목 | 사양 |
|---|---|
| 질문 | 좌측 강조선(`border-l-2`) 또는 배경 톤, `font-medium` |
| 답변 | 일반 본문, `leading-relaxed`, 17~18px |
| 문단 | MDX 내 빈 줄로 자동 분리 |
| 등록 | `components/mdx/mdx-components.tsx`에 `{ QA }` 매핑 → MDX에서 import 없이 사용 |
| 타이포그래피 | `@tailwindcss/typography` **사용하지 않음.** 직접 스타일링 |

```tsx
// app/interviews/[slug]/page.tsx
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx/mdx-components";

<MDXRemote source={interview.body} components={mdxComponents} />
```

`next-mdx-remote/rsc`는 서버 전용입니다. `"use client"`를 붙이지 마세요.

---

### 6.8 `<CreditNotice />` (신규)

인터뷰 상세 하단의 권한 블록입니다.

```
─────────────────────────────────
기획 · 질문 · 정리    희연
인터뷰 일자           2026. 8. 14.

이 인터뷰의 기획, 질문 구성, 정리 및 편집에 대한 저작권은
희연에게 있습니다. 인용 시 출처를 밝혀 주시고,
무단 전재 및 재배포를 금지합니다.
─────────────────────────────────
```

모든 문구는 `siteConfig`의 `creditLine`, `owner`, `usageNotice`에서 읽습니다.

---

### 6.9 `app/globals.css` 추가분

`shadcn init`이 만든 파일 아래에 이어서 작성합니다.

```css
@import "tailwindcss";
@import "tw-animate-css";

@theme inline {
  --animate-marquee: marquee var(--duration) infinite linear;
  --animate-marquee-vertical: marquee-vertical var(--duration) linear infinite;
  --animate-blink: blink 1.2s step-end infinite;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(-100% - var(--gap))); }
}

@keyframes marquee-vertical {
  from { transform: translateY(0); }
  to   { transform: translateY(calc(-100% - var(--gap))); }
}

@keyframes blink {
  0%, 50%      { opacity: 1; }
  50.01%, 100% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .animate-blink,
  [class*="animate-marquee"] {
    animation: none !important;
    opacity: 1;
  }
}
```

---

## 7. 디자인 토큰 — 입장 화면 확정 사양

| 항목 | 값 |
|---|---|
| 배경 | `#FFFFFF` |
| 궤적 시작색 | `hsl(228 95% 58%)` (블루) |
| 궤적 끝색 | `hsl(276 88% 56%)` (퍼플) |
| 궤적 블러 | `blur(7px)` |
| 궤적 잔상 알파 | `0.045` |
| 워드마크 기본 | `font-weight: 400` · `#3A352F` |
| 워드마크 강조 | `font-weight: 900` · `#000000` |
| 밑줄 | `#000000` · `.065em` · 1.2초 `step-end` 점멸 |
| 워드마크 크기 | `clamp(28px, 6vw, 54px)` |
| 자간 | `-0.025em` |
| 워드마크–버튼 간격 | `44px` |
| 버튼 | 높이 `60px`, 좌우 패딩 `44px`, `rounded-full` |
| 버튼 라벨 | `16.5px` · `font-weight: 500` · `#1B1A18` |
| 버튼 hover | `scale(1.05)`, `transition .3s` |
| 버튼 focus | `outline: 2px solid #000; outline-offset: 4px` |
| 푸터 | `11.5px` · `rgba(40,38,34,.4)` · 하단 18px |

---

## 8. 작업 순서

| # | 작업 | 완료 조건 |
|---|---|---|
| 1 | 프로젝트 초기화 + `shadcn init` | `npm run dev`로 기본 페이지가 뜸 |
| 2 | 의존성 설치, `globals.css` 애니메이션 추가 | 빌드 에러 없음 |
| 3 | `components/ui/` 두 파일 배치 | 타입 에러 없음 |
| 4 | `site.config.ts`, `lib/schema.ts`, `lib/interviews.ts`, `lib/tags.ts` | 샘플 3건 파싱. 날짜를 일부러 깨뜨리면 명확한 에러 발생 |
| 5 | 샘플 MDX 3건 + `content/README.md` | |
| 6 | `CursorTrail` + `SiteWordmark` + S-1 입장 화면 | 궤적이 커서를 따라오고, 2.2초 정지 시 자동 궤적. 밑줄 점멸. 버튼 클릭 시 `/interviews` 이동 |
| 7 | `InterviewList` (하단 목록) | 제목·날짜·태그 표시, 클릭 시 상세 이동 |
| 8 | `InterviewMarquee` (상단 3D) | **카드 클릭이 실제로 동작**, `md` 미만에서 숨겨짐 |
| 9 | S-3 상세 + `QA` + `CreditNotice` | Q/A 구분, 하단 권한 블록 표시 |
| 10 | 헤더·푸터·404 | 입장 화면에서 헤더 숨김 |
| 11 | 검수 (`§9`) | 체크리스트 전부 통과 |

---

## 9. 검수 체크리스트

### 기능

- [ ] 마퀴 카드 클릭 → 해당 인터뷰로 이동
- [ ] 목록 카드 클릭 → 해당 인터뷰로 이동
- [ ] 없는 slug 접속 → 404 화면
- [ ] MDX 1건 추가 → 코드 수정 없이 목록·상세에 반영
- [ ] 태그를 처음 보는 단어로 바꿔도 빌드 통과, 뱃지에 표시
- [ ] `role`·`avatar`·`pullQuote`를 비워도 화면이 깨지지 않음
- [ ] `date` 형식을 깨뜨리면 파일명·필드명이 담긴 에러로 빌드 중단

### 입장 화면

- [ ] 커서를 움직이면 블루→퍼플 궤적이 따라옴
- [ ] 궤적이 버튼 뒤를 지날 때 일그러짐 (Chrome)
- [ ] 2.2초간 멈추면 자동 궤적이 그려짐
- [ ] `재탐색`만 굵은 검정, 밑줄이 1.2초 주기로 점멸

### 반응형

- [ ] 360px: 가로 마퀴 노출(3D 없음), 세로 스크롤과 충돌 없음, 목록 1열, 가로 스크롤 없음
- [ ] 768px: 목록 2열, 3D 세로 마퀴 노출
- [ ] 1440px: 목록 3열, 본문 `max-w-3xl` 유지

### 접근성

- [ ] 키보드 Tab만으로 입장 → 목록 → 상세 도달
- [ ] 키보드 Tab 3번 이내로 목록 첫 항목 도달 (PC·모바일 공통)
- [ ] `prefers-reduced-motion` 켜면 마퀴·궤적·밑줄 모두 정지
- [ ] 아바타 이미지에 `alt` 존재
- [ ] 버튼 focus ring 표시

### 성능·배포

- [ ] `npm run build` 성공
- [ ] 모든 인터뷰 페이지가 정적 프리렌더로 표기 — Next 16은 `generateStaticParams`를 쓰는 페이지를 **`● (SSG)`**, 그 외 정적 페이지를 `○ (Static)`으로 구분합니다. 인터뷰 상세는 `● (SSG)`, `/`와 `/interviews`는 `○ (Static)`이면 통과

### 권한 표기

- [ ] 모든 페이지 푸터에 저작권 표기
- [ ] 상세 하단에 기획·질문·정리 주체(희연) + 인용 안내

### 브라우저

- [ ] Chrome: 유리 왜곡 확인
- [ ] Safari: 왜곡이 없어도 버튼이 정상으로 읽힘, 궤적은 정상 표시

---

## 10. 범위 외 (만들지 말 것)

| 항목 | 사유 |
|---|---|
| 데이터베이스 | MDX 파일로만 관리 |
| 로그인 · 회원가입 | 방문자는 읽기 전용 |
| 댓글 | |
| 검색 | |
| 태그 필터 · 태그별 페이지 | 태그는 **표시 전용** |
| About 페이지 | 권한 표기는 푸터 + 상세 하단 블록으로 대체 |
| 관리자 · 편집 UI | 편집은 저장소 쓰기 권한으로 (`§4.4`) |
| 다크모드 | CSS 변수 구조만 유지, 구현은 제외 |
| 다국어 | |
| 페이지네이션 | 샘플 3건 기준. 필요해지면 추후 |

---

## 부록 A. 확정 이력

| 항목 | 결정 |
|---|---|
| 데이터 단위 | 1 MDX = 1명 (Q&A 전부 포함) |
| 사이트 이름 | 진로를 재탐색합니다 |
| 강조 방식 | `재탐색`만 굵은 검정 + 밑줄 점멸 (나머지는 보통 굵기) |
| 입장 화면 배경 | 흰색 |
| 궤적 색 | 블루–퍼플 |
| 3D 마퀴 역할 | 카드 클릭 시 해당 Q&A로 이동 |
| 카드 시각 요소 | 아바타 (없으면 이니셜 폴백) |
| 태그 | 고정값 없음, 표시 전용 |
| 목록 카드 | 요약 제외 (제목·날짜·태그) |
| 권한 표기 | 푸터 저작권 + 각 인터뷰 하단 출처·인용 안내 |
| 저작권자 | 희연 |
| shadcn `button` | 지금은 설치하지 않음. 필요한 컴포넌트를 추가할 때 전환 (`§6.4.1`) |
| Safari 유리 효과 | 감수 (대체 스타일 없음) |

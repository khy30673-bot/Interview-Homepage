"use client"

/* ──────────────────────────────────────────────────────────────────────────
   전달받은 파일입니다. 원본과 달라진 곳은 아래 5가지뿐이며, 각 지점에
   "[원본과 다른 점 N]" 주석을 달아 두었습니다.

   ① 유리 레이어 JSX를 glassLayers() 함수로 분리       (③을 위한 준비)
   ② 유리층 rounded-md → rounded-full                  (PRD §7 / reference HTML)
   ③ asChild일 때 Slottable 경로 추가                  ★ 크래시 수정
   ④ <GlassFilter/>를 버튼 밖 형제로 이동              ★ 패딩 버그 수정
   ⑤ 미사용 MetalButton 및 부속 코드 삭제              (약 205줄)

   ③이 필요한 이유 — 이 컴포넌트는 Comp에 자식을 4개 넘기는데 Radix Slot은
   단일 자식만 병합할 수 있어서, asChild를 쓰면 런타임에서 바로 터집니다.
   PRD §S-1이 입장 버튼을 asChild로 <Link>를 감싸 실제 <a>로 렌더하라고
   요구하므로 우회가 아니라 수정이 필요했습니다. 자세한 내용은 해당 지점 주석.

   ④가 필요한 이유 — GlassFilter가 버튼의 직계 svg 자식이라 size 변형의
   has-[>svg]:px-* 가 항상 매치되어, PRD §7의 패딩 44px이 아이콘용 32px로
   덮이고 있었습니다. 모든 LiquidButton에 해당하는 원본 버그입니다.

   ⑤를 삭제한 이유 — MetalButton은 이 사이트에서 쓰지 않습니다. PRD는 원래
   "트리셰이킹으로 번들에서 빠지므로 삭제 불필요"였지만, lint는 번들이 아니라
   소스를 검사하므로 미사용 코드여도 react-hooks/set-state-in-effect 에러가
   납니다. PRD §6.4도 함께 수정했습니다.
   ────────────────────────────────────────────────────────────────────────── */

import * as React from "react"
import { Slot, Slottable } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-primary-foreground hover:bg-destructive/90",
        cool: "dark:inset-shadow-2xs dark:inset-shadow-white/10 bg-linear-to-t border border-b-2 border-zinc-950/40 from-primary to-primary/85 shadow-md shadow-primary/20 ring-1 ring-inset ring-white/25 transition-[filter] duration-200 hover:brightness-110 active:brightness-90 dark:border-x-0 text-primary-foreground dark:text-primary-foreground dark:border-t-0 dark:border-primary/50 dark:ring-white/5",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

const liquidbuttonVariants = cva(
  "inline-flex items-center transition-colors justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:scale-105 duration-300 transition text-primary",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 text-xs gap-1.5 px-4 has-[>svg]:px-4",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-md px-8 has-[>svg]:px-6",
        xxl: "h-14 rounded-md px-10 has-[>svg]:px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "xxl",
    },
  }
)

function LiquidButton({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof liquidbuttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  // [원본과 다른 점 ①] 유리 레이어들을 함수로 분리했습니다.
  // 원본은 이 JSX를 Comp의 자식으로 그대로 나열했는데, asChild일 때 Slot에
  // 자식이 4개(그림자 · 유리층 · 라벨 · GlassFilter) 넘어가면서 크래시했습니다.
  // 내용·클래스·그림자 값은 원본 그대로이고, 감싸는 방식만 바뀌었습니다.
  const glassLayers = (label: React.ReactNode) => (
    <>
      <div className="absolute top-0 left-0 z-0 h-full w-full rounded-full
          shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)]
      transition-all
      dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" />
      {/* [원본과 다른 점 ②] 원본은 이 유리층이 rounded-md였습니다.
          바깥 그림자 레이어는 rounded-full이고 reference/entry-screen.html의
          .glass도 border-radius:999px이며 PRD §7도 rounded-full이므로,
          알약 모양 뒤에 둥근 사각형 왜곡이 비치지 않도록 맞췄습니다. */}
      <div
        className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-full"
        style={{ backdropFilter: 'url("#container-glass")' }}
      />

      <div className="pointer-events-none z-10 ">
        {label}
      </div>
    </>
  )

  return (
    <>
      <Comp
        data-slot="button"
        className={cn(
          "relative",
          liquidbuttonVariants({ variant, size, className })
        )}
        {...props}
      >
        {/* [원본과 다른 점 ③ — asChild 크래시 수정]
            Radix Slot은 자식을 "하나"만 받아 거기에 props를 병합합니다.
            원본처럼 자식 4개를 넘기면 asChild 사용 시 런타임에서 바로 터집니다:
              "Slot failed to slot onto its children.
               Expected a single React element child or `Slottable`."
            PRD §S-1은 입장 버튼을 asChild로 <Link>를 감싸 실제 <a>로 렌더하라고
            요구하므로(새 탭 열기·크롤링 가능해야 함) 이 경로가 반드시 필요합니다.

            해결: Slottable의 render-fn 형태를 씁니다.
              - child={children}  → <Link>가 루트 엘리먼트(<a>)가 됩니다
              - children={fn}     → fn이 받은 <Link>의 원래 자식(라벨 텍스트)을
                                    유리 레이어 안에 끼워 넣습니다
            결과 DOM:
              <a class="..." href="/interviews">
                <div 그림자 /><div 유리층 /><div class="...z-10">라벨</div><svg />
              </a>
            asChild가 아닐 때는 원본과 완전히 동일하게 <button>으로 렌더됩니다. */}
        {asChild ? (
          <Slottable child={children}>
            {(label) => glassLayers(label)}
          </Slottable>
        ) : (
          glassLayers(children)
        )}
      </Comp>
      {/* [원본과 다른 점 ④] 원본은 <GlassFilter/>를 Comp의 자식으로 넣었습니다.
          그런데 GlassFilter는 <svg class="hidden">이라 버튼의 "직계 svg 자식"이
          되고, 그 결과 size 변형에 들어 있는 has-[>svg]:px-* 가 항상 매치됩니다.
          :has(>svg)는 특이도가 (0,2,0)이라 일반 px-* (0,1,0)를 이겨서,
          PRD §7이 정한 좌우 패딩 44px 대신 아이콘 버튼용 32px이 적용됐습니다.
          (실측으로 확인: padding-left가 44px가 아니라 32px로 계산됨)

          has-[>svg]:px-* 는 "사용자가 아이콘을 넣었을 때"를 위한 것이므로,
          내부 구현인 GlassFilter가 그 조건을 건드리면 안 됩니다. SVG <defs>의
          filter는 id로 참조되는 문서 전역 리소스라 버튼 안에 있을 이유도 없어
          형제로 옮겼습니다. url(#container-glass)는 그대로 동작합니다. */}
      <GlassFilter />
    </>
  )
}

function GlassFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          {/* Generate turbulent noise for distortion */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />

          {/* Blur the turbulence pattern slightly */}
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />

          {/* Displace the source graphic with the noise */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />

          {/* Apply overall blur on the final result */}
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />

          {/* Output the result */}
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

export { Button, buttonVariants, liquidbuttonVariants, LiquidButton }

"use client"

import React, { ComponentPropsWithoutRef, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode;
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean;
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number;
  /**
   * If true, automatically repeats children enough to fill the visible area
   * NOTE: 타입에만 선언되어 있고 구현이 없습니다. 사용하지 마세요. (PRD §6.4)
   */
  autoFill?: boolean;
  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;
  /**
   * ARIA live region politeness
   */
  ariaLive?: 'off' | 'polite' | 'assertive';
  /**
   * ARIA role
   */
  ariaRole?: string;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ariaLabel,
  ariaLive = 'off',
  ariaRole = 'marquee',
  ...props
}: MarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  const content = React.useMemo(
    () => (
      <>
        {Array.from({ length: repeat }, (_, i) => (
          <div
            key={i}
            className={cn(
              !vertical ? 'flex-row [gap:var(--gap)]' : 'flex-col [gap:var(--gap)]',
              'flex shrink-0 justify-around',
              !vertical && 'animate-marquee flex-row',
              vertical && 'animate-marquee-vertical flex-col',
              pauseOnHover && 'group-hover:[animation-play-state:paused]',
              reverse && '[animation-direction:reverse]',
            )}
          >
            {children}
          </div>
        ))}
      </>
    ),
    [repeat, children, vertical, pauseOnHover, reverse],
  );

  return (
    <div
      {...props}
      ref={marqueeRef}
      data-slot="marquee"
      className={cn(
        'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
        {
          'flex-row': !vertical,
          'flex-col': vertical,
        },
        className,
      )}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      role={ariaRole}
      // [원본과 다른 점] 원본은 tabIndex={0} 고정이라 바깥에서 덮어쓸 수 없었습니다.
      // 이 사이트는 마퀴를 aria-hidden 장식으로 두는데, aria-hidden 안에
      // 포커스 가능한 요소가 남아 있으면 그 자체가 접근성 위반입니다.
      // (키보드로는 닿지만 스크린리더에는 안 보이는 유령 포커스가 생깁니다.)
      // 기본값 0은 그대로라 다른 사용처의 동작은 바뀌지 않습니다.
      tabIndex={props.tabIndex ?? 0}
    >
      {content}
    </div>
  );
}

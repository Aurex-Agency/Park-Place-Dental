"use client";

import type { ReactNode } from "react";
import { useMotionPreference } from "./motion-preference";

type MarqueeProps = {
  children: ReactNode;
  /** Seconds for one full loop. Lower = faster. */
  speed?: number;
  direction?: "forward" | "reverse";
  className?: string;
};

/**
 * Seamless infinite ticker — CSS keyframes on a duplicated track, no JS
 * animation loop (WORKFLOW.md: don't burn main-thread time on this). Pauses
 * on hover *or keyboard focus* and freezes under reduced motion via
 * globals.css selectors keyed on data-reduced-motion / data-marquee.
 * Hover-only pausing fails WCAG 2.2.2 (Pause, Stop, Hide) for anyone who
 * can't hover — tabIndex makes the track focusable so keyboard users get an
 * equivalent way to stop it moving.
 */
export function Marquee({ children, speed = 24, direction = "forward", className }: MarqueeProps) {
  const reducedMotion = useMotionPreference();

  return (
    <div
      data-marquee
      data-reduced-motion={reducedMotion}
      tabIndex={0}
      aria-label="Scrolling list, focus or hover to pause"
      className={`overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 ${className ?? ""}`}
    >
      <div
        className="marquee-track flex w-max"
        data-direction={direction === "reverse" ? "reverse" : undefined}
        style={{ "--marquee-duration": `${speed}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

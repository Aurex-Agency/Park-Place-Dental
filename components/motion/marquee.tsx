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
 * on hover and freezes under reduced motion via globals.css selectors keyed
 * on data-reduced-motion / data-marquee.
 */
export function Marquee({ children, speed = 24, direction = "forward", className }: MarqueeProps) {
  const reducedMotion = useMotionPreference();

  return (
    <div
      data-marquee
      data-reduced-motion={reducedMotion}
      className={`overflow-hidden ${className ?? ""}`}
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

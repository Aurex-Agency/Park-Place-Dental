"use client";

import { motion, useInView } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { useMotionPreference } from "./motion-preference";

/** Latches a boolean true forever once it's seen true, mirroring useInView's
 * own `once: true` — an external `trigger` prop has no such guarantee built
 * in, and a caller's state flipping back to false shouldn't "undraw" the
 * line. */
function useLatchedTrue(value: boolean): boolean {
  const [latched, setLatched] = useState(false);
  if (value && !latched) {
    // Safe to set state during render here: it only ever flips false->true,
    // so it converges in the same render pass rather than looping.
    setLatched(true);
  }
  return latched || value;
}

type LineDrawProps = {
  /** SVG path `d` string, in the coordinate space of `viewBox`. */
  path: string;
  viewBox?: string;
  /** Seconds. */
  duration?: number;
  /** Seconds. */
  delay?: number;
  strokeWidth?: number;
  /** Any CSS color value — defaults to currentColor so it inherits text color. */
  color?: string;
  className?: string;
  /**
   * External trigger — when provided (even `false`), the primitive draws
   * once this becomes `true` instead of waiting for its own scroll-into-view
   * detection. Lets a parent that already has its own notion of "the right
   * moment" (e.g. a scroll-driven crossfade finishing) control exactly when
   * the line draws. Omit to keep the default scroll-into-view behavior.
   */
  trigger?: boolean;
};

/**
 * BRAND-REVISION.md §4 — animates an SVG path's stroke-dashoffset from full
 * length to zero as it enters the viewport, drawing the line on. Fires once.
 *
 * getTotalLength() runs in useLayoutEffect (before paint), not useEffect —
 * the same reasoning as TransparentHeroZone: a plain useEffect would let the
 * browser paint once with the wrong (zero) length first, a visible flash.
 *
 * No-JS fallback needs nothing extra: before the layout effect ever runs,
 * `length` is 0, so `stroke-dasharray: 0` is what server-rendered/no-JS
 * markup ships. Per the SVG spec, an all-zero dasharray is treated as no
 * dashing at all — the path renders as a normal solid stroke, already fully
 * "drawn." JS only ever moves this into a hidden-then-revealed state, never
 * the reverse, so there's no window where a no-JS visitor sees a broken or
 * missing line.
 */
export function LineDraw({
  path,
  viewBox = "0 0 100 100",
  duration = 1.1,
  delay = 0,
  strokeWidth = 2,
  color = "currentColor",
  className,
  trigger,
}: LineDrawProps) {
  const reducedMotion = useMotionPreference();
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const scrollInView = useInView(svgRef, { once: true, margin: "-10% 0px" });
  const latchedTrigger = useLatchedTrue(trigger ?? false);
  const inView = trigger !== undefined ? latchedTrigger : scrollInView;
  const [length, setLength] = useState(0);

  useLayoutEffect(() => {
    if (pathRef.current) {
      setLength(pathRef.current.getTotalLength());
    }
  }, [path]);

  return (
    <svg ref={svgRef} viewBox={viewBox} className={className} fill="none" aria-hidden="true">
      <motion.path
        ref={pathRef}
        d={path}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ strokeDashoffset: reducedMotion ? 0 : length, strokeDasharray: length }}
        animate={inView ? { strokeDashoffset: 0, strokeDasharray: length } : undefined}
        transition={{
          duration: reducedMotion ? 0 : duration,
          delay: reducedMotion ? 0 : delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    </svg>
  );
}

"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ElementType } from "react";
import { useMotionPreference } from "./motion-preference";

type SplitRevealProps = {
  /** Semantic tag for the outer wrapper — e.g. "h1", "h2", "p". */
  as?: ElementType;
  /** Each entry renders as its own overflow-hidden line. */
  lines: string[];
  className?: string;
};

function Line({ line, delay, reducedMotion }: { line: string; delay: number; reducedMotion: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <span className="block overflow-hidden">
      <motion.span
        ref={ref}
        className="block"
        initial={{ y: reducedMotion ? 0 : "105%", opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : undefined}
        transition={{
          duration: reducedMotion ? 0.15 : 0.65,
          ease: reducedMotion ? "linear" : [0.16, 1, 0.3, 1],
          delay: reducedMotion ? 0 : delay,
        }}
      >
        {line}
      </motion.span>
    </span>
  );
}

/**
 * Splits a heading into explicit lines and reveals each with a translateY +
 * opacity animation, staggered by --stagger. Lines are author-supplied
 * rather than measured at runtime — predictable across breakpoints without a
 * text-measurement pass. Uses useInView (imperative) rather than the
 * whileInView prop so every primitive shares one in-view detection pattern.
 */
export function SplitReveal({ as: Tag = "div", lines, className }: SplitRevealProps) {
  const reducedMotion = useMotionPreference();

  return (
    <Tag className={className}>
      {lines.map((line, index) => (
        <Line key={line} line={line} delay={index * 0.06} reducedMotion={reducedMotion} />
      ))}
    </Tag>
  );
}

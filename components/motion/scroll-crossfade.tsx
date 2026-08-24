"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMotionPreference } from "./motion-preference";

type ScrollCrossfadeProps = {
  /** Always visible, underneath — the resting/settled, warm-graded state.
   * Should carry `priority` if this is the page's LCP image. */
  baseImage: ImageProps;
  /** Fades to opacity 0 as the wrapper scrolls through the viewport,
   * revealing baseImage underneath — a grade change, not a wipe. */
  topImage: ImageProps;
  wrapperClassName?: string;
  /** Fires once, when the fade is effectively complete (progress > 0.92) —
   * e.g. to trigger a companion LineDraw at the right moment. */
  onCompleteAction?: () => void;
};

/**
 * A scroll-linked opacity crossfade over two stacked next/image layers —
 * the cool-graded top layer dissolves to reveal the warm-graded base layer,
 * completing across exactly one viewport of scroll (useScroll's
 * ["start start", "end start"] offsets land progress 0→1 across exactly
 * the wrapper's own height, so a min-h-screen wrapper finishes by the time
 * it's scrolled fully past). Opacity, not a clip-path wipe: this is a
 * colour-grade transition (cool → warm), and a wipe reads as a curtain
 * uncovering a different image rather than the same photo warming up.
 *
 * No-JS: the top layer carries data-motion-only (global noscript rule in
 * app/layout.tsx sets `display: none`), so without JS only baseImage ever
 * renders — no separate fallback logic needed here.
 * Reduced motion: the top layer isn't rendered at all, same outcome.
 *
 * object-cover: safe even when baseImage/topImage share a native aspect
 * ratio (the intended case — same source pixels, cropped identically), and
 * still correct if they ever don't.
 */
export function ScrollCrossfade({
  baseImage,
  topImage,
  wrapperClassName,
  onCompleteAction,
}: ScrollCrossfadeProps) {
  const reducedMotion = useMotionPreference();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const topOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Same latest-ref pattern as Preloader/ThemeSection/StickySteps (STATUS.md
  // records the infinite-loop bug that pattern exists to prevent) — an
  // inline arrow passed as onCompleteAction shouldn't retrigger this effect.
  const onCompleteRef = useRef(onCompleteAction);
  useEffect(() => {
    onCompleteRef.current = onCompleteAction;
  }, [onCompleteAction]);

  const [complete, setComplete] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.92 && !complete) {
      setComplete(true);
      onCompleteRef.current?.();
    }
  });

  // fill and width/height are mutually exclusive on next/image — both
  // layers here are sized by the wrapper (aspect-ratio box), not by the
  // source image's own dimensions, so width/height from the shared
  // PracticeImage/ImageProps shape must be dropped before spreading.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { width: baseWidth, height: baseHeight, ...baseRest } = baseImage;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { width: topWidth, height: topHeight, ...topRest } = topImage;

  return (
    <div ref={ref} className={`relative ${wrapperClassName ?? ""}`}>
      <Image
        {...baseRest}
        alt={baseImage.alt}
        fill
        className={`object-cover ${baseImage.className ?? ""}`}
      />
      {!reducedMotion && (
        <motion.div data-motion-only className="absolute inset-0" style={{ opacity: topOpacity }}>
          <Image
            {...topRest}
            alt={topImage.alt}
            fill
            className={`object-cover ${topImage.className ?? ""}`}
          />
        </motion.div>
      )}
    </div>
  );
}

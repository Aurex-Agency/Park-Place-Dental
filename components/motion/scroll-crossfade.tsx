"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMotionPreference } from "./motion-preference";

type ScrollCrossfadeProps = {
  /** Always visible, underneath — the resting/settled state. Should carry
   * `priority` if this is the page's LCP image. */
  baseImage: ImageProps;
  /** Wipes away via a bottom-up clip-path as the wrapper scrolls through the
   * viewport, revealing baseImage. */
  topImage: ImageProps;
  wrapperClassName?: string;
  /** Fires once, when the wipe is effectively complete (progress > 0.92) —
   * e.g. to trigger a companion LineDraw at the right moment. */
  onCompleteAction?: () => void;
};

/**
 * HERO-CONCEPT.md §5: "the stone dissolves and the warm version is
 * revealed." A scroll-linked bottom-up clip-path wipe over two stacked
 * next/image layers, completing across exactly one viewport of scroll
 * (useScroll's ["start start", "end start"] offsets land progress 0→1
 * across exactly the wrapper's own height, so a min-h-screen wrapper
 * finishes the wipe by the time it's scrolled fully past).
 *
 * No-JS: the top layer carries data-motion-only (global noscript rule in
 * app/layout.tsx sets `display: none`), so without JS only baseImage ever
 * renders — no separate fallback logic needed here.
 * Reduced motion: the top layer isn't rendered at all, same outcome.
 *
 * object-cover, not object-contain: baseImage and topImage are independent
 * generations and don't share a native aspect ratio. object-contain
 * letterboxes each to its own proportions inside the shared box, and since
 * their gaps land in different places, the layer underneath shows through
 * the top layer's letterbox bars — an unintended double-exposure at rest
 * (found by screenshotting the hero at scroll position 0, where the top
 * layer should fully cover the base layer and didn't). object-cover crops
 * both to the box's exact shape instead, so they align.
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
  const insetBottom = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const clipPath = useTransform(insetBottom, (v) => `inset(0% 0% ${v}% 0%)`);

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

  return (
    <div ref={ref} className={`relative ${wrapperClassName ?? ""}`}>
      <Image
        {...baseImage}
        alt={baseImage.alt}
        fill
        className={`object-cover ${baseImage.className ?? ""}`}
      />
      {!reducedMotion && (
        <motion.div data-motion-only className="absolute inset-0" style={{ clipPath }}>
          <Image
            {...topImage}
            alt={topImage.alt}
            fill
            className={`object-cover ${topImage.className ?? ""}`}
          />
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { motion, useInView } from "motion/react";
import Image, { type ImageProps } from "next/image";
import { useRef } from "react";
import { useMotionPreference } from "./motion-preference";

type RevealImageProps = {
  wrapperClassName?: string;
} & ImageProps;

/**
 * clip-path reveal on the frame, slight scale-down-to-rest on the image
 * itself. Two nested motion wrappers so the animation stays on
 * transform/clip-path/opacity while next/image (required by CLAUDE.md for
 * all raster images) handles the actual <img>. Uses useInView (imperative)
 * rather than the whileInView prop so every primitive shares one in-view
 * detection pattern.
 */
export function RevealImage({ wrapperClassName, alt, className, ...imageProps }: RevealImageProps) {
  const reducedMotion = useMotionPreference();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${wrapperClassName ?? ""}`}
      initial={{ clipPath: reducedMotion ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)", opacity: reducedMotion ? 0 : 1 }}
      animate={inView ? { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 } : undefined}
      transition={{
        duration: reducedMotion ? 0.15 : 0.85,
        ease: reducedMotion ? "linear" : [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        initial={{ scale: reducedMotion ? 1 : 1.08 }}
        animate={inView ? { scale: 1 } : undefined}
        transition={{
          duration: reducedMotion ? 0.15 : 0.85,
          ease: reducedMotion ? "linear" : [0.16, 1, 0.3, 1],
        }}
      >
        <Image {...imageProps} alt={alt} className={`h-full w-full object-cover ${className ?? ""}`} />
      </motion.div>
    </motion.div>
  );
}

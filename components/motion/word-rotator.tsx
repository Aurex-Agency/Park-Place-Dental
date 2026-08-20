"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useMotionPreference } from "./motion-preference";

type WordRotatorProps = {
  words: string[];
  className?: string;
  /** Hold duration per word, ms. */
  holdMs?: number;
};

/**
 * Cycles through words with a y-slide swap. Under reduced motion the cycle
 * doesn't run at all — the first word is shown statically, matching
 * DESIGN-SYSTEM.md §3's "pauses on reduce."
 */
export function WordRotator({ words, className, holdMs = 2200 }: WordRotatorProps) {
  const reducedMotion = useMotionPreference();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || words.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, holdMs);
    return () => clearInterval(timer);
  }, [reducedMotion, words.length, holdMs]);

  if (reducedMotion) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span className={`relative inline-block overflow-hidden align-bottom ${className ?? ""}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className="block"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

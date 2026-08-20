"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { useMotionPreference } from "./motion-preference";

type Theme = "dark" | "light";

type ThemeSectionProps = {
  theme: Theme;
  children: ReactNode;
  className?: string;
  /**
   * Called when this section becomes the active one in the viewport. Phase 2's
   * Nav wires this up to invert its own colors — ThemeSection doesn't know
   * about Nav directly.
   */
  onThemeChangeAction?: (theme: Theme) => void;
};

/**
 * Sets data-theme, which drives --section-bg/--section-fg in globals.css.
 * The bg/text color transition (600ms) is plain CSS, collapsed to 0ms under
 * reduced motion via the data-reduced-motion selector — a color swap isn't a
 * vestibular concern, but every animated primitive still gets a tested path.
 */
export function ThemeSection({ theme, children, className, onThemeChangeAction }: ThemeSectionProps) {
  const reducedMotion = useMotionPreference();
  const ref = useRef<HTMLElement>(null);
  const isActive = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (isActive) {
      onThemeChangeAction?.(theme);
    }
  }, [isActive, theme, onThemeChangeAction]);

  return (
    <section
      ref={ref}
      data-theme={theme}
      data-reduced-motion={reducedMotion}
      className={`theme-section bg-[var(--section-bg)] text-[var(--section-fg)] transition-colors duration-[600ms] ${className ?? ""}`}
    >
      {children}
    </section>
  );
}

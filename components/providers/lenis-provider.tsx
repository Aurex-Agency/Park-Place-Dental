"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth-scroll driver. Skipped entirely under prefers-reduced-motion so
 * scroll behaves like native, unanimated scrolling (CLAUDE.md hard rule #4).
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    let frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return children;
}

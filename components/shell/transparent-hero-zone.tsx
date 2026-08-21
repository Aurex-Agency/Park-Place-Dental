"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { useShellChrome } from "./shell-chrome";

/**
 * Nav is solid by default — interior pages have no hero, so transparency has
 * to be an opt-in, not the default (getting that backwards means special-
 * casing every page that isn't the home page). A page with a full-bleed hero
 * wraps it in this so Nav floats transparent at the top of that page only,
 * then solidifies on scroll like it does everywhere else.
 *
 * useLayoutEffect, not useEffect: Nav and this live in different parts of the
 * tree (Nav renders first), so on first paint heroTransparent still holds its
 * initial `false` — a plain useEffect fires after that first paint, producing
 * a real, visible flash of solid-then-transparent nav on every load. Layout
 * effects run before the browser paints, so the flash never renders.
 */
export function TransparentHeroZone({ children }: { children: ReactNode }) {
  const { setHeroTransparent } = useShellChrome();

  useLayoutEffect(() => {
    setHeroTransparent(true);
    return () => setHeroTransparent(false);
  }, [setHeroTransparent]);

  return <>{children}</>;
}

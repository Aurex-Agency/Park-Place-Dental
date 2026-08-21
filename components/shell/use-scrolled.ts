"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function getServerSnapshot() {
  return false;
}

/** True once the page has scrolled past thresholdPx. SSR-safe — starts false. */
export function useScrolled(thresholdPx: number): boolean {
  return useSyncExternalStore(subscribe, () => window.scrollY > thresholdPx, getServerSnapshot);
}

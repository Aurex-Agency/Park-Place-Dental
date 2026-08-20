"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

const MotionPreferenceContext = createContext<boolean | null>(null);

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

function useSystemReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Every primitive reads reduced-motion state through this context instead of
 * querying matchMedia itself, so /dev/primitives can override it with a
 * toggle and every primitive responds consistently — no per-component drift.
 */
export function MotionPreferenceProvider({
  children,
  forceReducedMotion,
}: {
  children: ReactNode;
  /** Omit to follow the OS setting. Pass true/false to override (dev sandbox only). */
  forceReducedMotion?: boolean;
}) {
  const systemReduced = useSystemReducedMotion();
  const value = forceReducedMotion ?? systemReduced;

  return (
    <MotionPreferenceContext.Provider value={value}>
      {children}
    </MotionPreferenceContext.Provider>
  );
}

/** Assumes MotionPreferenceProvider wraps the app (see app/layout.tsx). */
export function useMotionPreference(): boolean {
  return useContext(MotionPreferenceContext) ?? false;
}

"use client";

import { createContext, useContext, useRef, useState, type ReactNode, type RefObject } from "react";

type Theme = "dark" | "light";

type ShellChromeValue = {
  activeTheme: Theme;
  setActiveTheme: (theme: Theme) => void;
  heroTransparent: boolean;
  setHeroTransparent: (value: boolean) => void;
  drawerOpen: boolean;
  setDrawerOpen: (value: boolean) => void;
  drawerTriggerRef: RefObject<HTMLButtonElement | null>;
};

const ShellChromeContext = createContext<ShellChromeValue | null>(null);

/**
 * Coordinates state Nav and the mobile drawer need that actually originates
 * in page content — the hero (heroTransparent, activeTheme) lives in whatever
 * page renders it, not in Nav itself. ThemeSection stays unaware any of this
 * exists: pages wire its onThemeChangeAction straight to setActiveTheme.
 */
export function ShellChromeProvider({ children }: { children: ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<Theme>("light");
  const [heroTransparent, setHeroTransparent] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <ShellChromeContext.Provider
      value={{
        activeTheme,
        setActiveTheme,
        heroTransparent,
        setHeroTransparent,
        drawerOpen,
        setDrawerOpen,
        drawerTriggerRef,
      }}
    >
      {children}
    </ShellChromeContext.Provider>
  );
}

/** Assumes ShellChromeProvider wraps the tree (see components/shell/shell.tsx). */
export function useShellChrome(): ShellChromeValue {
  const ctx = useContext(ShellChromeContext);
  if (!ctx) {
    throw new Error("useShellChrome must be used within ShellChromeProvider");
  }
  return ctx;
}

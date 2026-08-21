"use client";

import { ThemeSection } from "@/components/motion";
import { Shell } from "@/components/shell/shell";
import { TransparentHeroZone } from "@/components/shell/transparent-hero-zone";
import { useShellChrome } from "@/components/shell/shell-chrome";

function DummyHero() {
  const { setActiveTheme } = useShellChrome();
  return (
    <TransparentHeroZone>
      <ThemeSection
        theme="dark"
        onThemeChangeAction={setActiveTheme}
        className="flex min-h-screen flex-col items-center justify-center px-gutter text-center"
      >
        <p className="text-eyebrow uppercase tracking-eyebrow text-cream/60">/dev/shell harness</p>
        <h1 className="mt-4 font-display text-hero">Dummy hero block</h1>
        <p className="mt-4 max-w-[50ch] text-lead text-cream/80">
          Stand-in for Phase 3&apos;s real hero — not the real thing, just enough to exercise Nav.
          It should be transparent with cream text right here at the top, then solidify once you
          scroll past this block.
        </p>
      </ThemeSection>
    </TransparentHeroZone>
  );
}

function ScrollSection({ theme, title, body }: { theme: "dark" | "light"; title: string; body: string }) {
  const { setActiveTheme } = useShellChrome();
  return (
    <ThemeSection
      theme={theme}
      onThemeChangeAction={setActiveTheme}
      className="flex min-h-[80vh] flex-col items-center justify-center px-gutter text-center"
    >
      <h2 className="font-display text-d2">{title}</h2>
      <p className="mt-4 max-w-[50ch] text-lead">{body}</p>
    </ThemeSection>
  );
}

/**
 * Gate 1 review surface (STATUS.md). This is the actual Shell component, not
 * a reimplementation — a dummy hero plus enough scroll height to exercise
 * every nav state: transparent-over-hero, solidify-on-scroll, color
 * inversion while transparent, and staying solid regardless of what scrolls
 * by underneath once it has.
 */
export function ShellSandbox() {
  return (
    <Shell>
      <DummyHero />
      <ScrollSection
        theme="light"
        title="Scroll section — light"
        body="Nav should already be solid (cream bg, ink text) by now, regardless of this section's color."
      />
      <ScrollSection
        theme="dark"
        title="Scroll section — dark"
        body="Nav stays solid here too — it does not re-invert per section once it has solidified, only while transparent over the hero."
      />
      <ScrollSection
        theme="light"
        title="Scroll section — light again"
        body="Keep scrolling to reach the footer and, on a narrow viewport, the mobile bottom bar."
      />
    </Shell>
  );
}

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import type { Result } from "axe-core";
import { routes } from "./routes";

/** CLAUDE.md rule #12: WCAG 2.2 AA. */
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

function formatViolations(violations: Result[]): string {
  if (violations.length === 0) return "";
  return violations
    .map((v) => {
      const targets = v.nodes.map((n) => `    - ${n.target.join(" ")}`).join("\n");
      return `[${v.impact ?? "unknown"}] ${v.id}: ${v.help}\n  ${v.helpUrl}\n${targets}`;
    })
    .join("\n\n");
}

async function runAxe(page: Page) {
  return new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
}

// Preloader's hard cap is 1400ms and reveals run up to dur-slow (1100ms).
// Without waiting for both to finish, axe can snapshot mid-transition —
// e.g. a heading fading in at 40% opacity reads as a contrast violation even
// though the rested state (what a real visitor sees) is fine. Testing the
// settled state is what CLAUDE.md's contrast rule is actually about.
const ANIMATION_SETTLE_MS = 2000;

// WordRotator cycles forever by design (DESIGN-SYSTEM.md §3) — unlike the
// reveal-once primitives, it has no permanent "settled" state, so even after
// ANIMATION_SETTLE_MS there's a real chance (~450ms transition out of every
// 2200ms hold, roughly 1 in 5) of landing mid-crossfade, where the exiting/
// entering words visually overlap and axe samples a blended, lower-contrast
// pixel color. That's a snapshot-timing artifact, not a rendered defect —
// confirmed by re-running the exact same build repeatedly and seeing it pass
// every time except when caught in that window. A genuine contrast defect
// fails every attempt; a timing artifact doesn't. Retrying absorbs the
// latter without hiding the former.
const AXE_ATTEMPTS = 3;
const AXE_RETRY_DELAY_MS = 400;

async function axeCheck(page: Page) {
  let lastViolations: Result[] = [];
  for (let attempt = 1; attempt <= AXE_ATTEMPTS; attempt++) {
    const { violations } = await runAxe(page);
    if (violations.length === 0) return;
    lastViolations = violations;
    if (attempt < AXE_ATTEMPTS) {
      await page.waitForTimeout(AXE_RETRY_DELAY_MS);
    }
  }
  expect(lastViolations, formatViolations(lastViolations)).toEqual([]);
}

for (const route of routes) {
  test.describe(route.path, () => {
    test("no axe violations", async ({ page }) => {
      await page.goto(route.path);
      await page.waitForTimeout(ANIMATION_SETTLE_MS);
      await axeCheck(page);
    });

    // CLAUDE.md rule #4: every reduced-motion path must be tested, not
    // assumed. This is the "tested" half of that rule.
    test("no axe violations under prefers-reduced-motion: reduce", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route.path);
      await page.waitForTimeout(ANIMATION_SETTLE_MS);
      await axeCheck(page);
    });
  });
}

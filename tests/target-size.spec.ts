import { expect, test, type Locator } from "@playwright/test";

/**
 * Gate 3 (STATUS.md): axe checks color contrast and a handful of other
 * WCAG rules, but it does not check target size (SC 2.5.8) — this shell
 * shipped 23px nav links and 26px footer links straight through a green
 * `pnpm test:a11y` run. This test closes that gap directly rather than
 * trusting axe to catch it.
 *
 * 44x44 is the bar here, not WCAG's 24x24 minimum — CLAUDE.md/PLAN.md's
 * audience (35-65 year olds) is the reason, not just the legal floor.
 *
 * The skip link is deliberately excluded: it's `sr-only` until keyboard-
 * focused, so it has no meaningful pointer-target box in its default
 * state, and forcing it to 44x44 while off-screen wouldn't test anything
 * real. Everything else genuinely visible and clickable in the shell is
 * checked.
 */
const MIN_TARGET_PX = 44;

async function assertAllTargetsAtLeast(container: Locator, label: string) {
  const handles = await container.locator('a[href], button:not([disabled])').all();
  const undersized: string[] = [];

  for (const handle of handles) {
    const accessibleName = (await handle.getAttribute("aria-label")) ?? (await handle.innerText()).trim();
    if (accessibleName === "Skip to main content") continue;

    const box = await handle.boundingBox();
    if (!box || box.width === 0 || box.height === 0) continue; // not visible in this viewport/state

    if (box.width < MIN_TARGET_PX || box.height < MIN_TARGET_PX) {
      undersized.push(`"${accessibleName}" — ${box.width.toFixed(0)}x${box.height.toFixed(0)}`);
    }
  }

  expect(undersized, `${label}: targets under ${MIN_TARGET_PX}x${MIN_TARGET_PX}px:\n${undersized.join("\n")}`).toEqual([]);
}

test.describe("desktop shell (>=1400px, full inline nav)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("header targets are all >=44x44", async ({ page }) => {
    await page.goto("/");
    await assertAllTargetsAtLeast(page.locator("header"), "desktop header");
  });

  test("footer targets are all >=44x44", async ({ page }) => {
    await page.goto("/");
    await assertAllTargetsAtLeast(page.locator("footer"), "footer");
  });
});

test.describe("mobile shell (<1400px, drawer nav)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("header (logo + trigger) targets are all >=44x44", async ({ page }) => {
    await page.goto("/");
    await assertAllTargetsAtLeast(page.locator("header"), "mobile header");
  });

  test("mobile bottom bar targets are all >=44x44", async ({ page }) => {
    await page.goto("/");
    const bar = page.locator("div.fixed.bottom-0");
    await assertAllTargetsAtLeast(bar, "mobile bottom bar");
  });

  test("mobile drawer targets are all >=44x44", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    await assertAllTargetsAtLeast(dialog, "mobile drawer");
  });

  test("footer targets are all >=44x44", async ({ page }) => {
    await page.goto("/");
    await assertAllTargetsAtLeast(page.locator("footer"), "footer (mobile)");
  });
});

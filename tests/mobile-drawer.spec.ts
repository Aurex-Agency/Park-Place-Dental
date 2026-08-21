import { expect, test } from "@playwright/test";

/**
 * Gate 2 (STATUS.md / CLAUDE.md rule #4): the drawer is the highest-risk a11y
 * component in the project, and its reduced-motion path must be tested, not
 * assumed. Forces a mobile-width viewport since the trigger only renders
 * below the `lg` breakpoint (playwright.config.ts's Desktop Chrome project
 * doesn't otherwise guarantee that).
 */
test.use({ viewport: { width: 390, height: 844 } });

async function openDrawer(page: import("@playwright/test").Page) {
  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
  return trigger;
}

for (const reduced of [false, true] as const) {
  test.describe(reduced ? "under prefers-reduced-motion: reduce" : "normal motion", () => {
    test.beforeEach(async ({ page }) => {
      if (reduced) {
        await page.emulateMedia({ reducedMotion: "reduce" });
      }
    });

    test("opens via trigger, moves focus to the close button, aria-expanded flips", async ({ page }) => {
      await page.goto("/");
      const trigger = page.getByRole("button", { name: "Open menu" });
      await expect(trigger).toHaveAttribute("aria-expanded", "false");

      await trigger.click();
      const dialog = page.getByRole("dialog", { name: "Menu" });
      await expect(dialog).toBeVisible();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
    });

    test("Tab and Shift+Tab stay trapped inside the panel", async ({ page }) => {
      await page.goto("/");
      await openDrawer(page);

      const dialog = page.getByRole("dialog", { name: "Menu" });
      const focusableCount = await dialog.locator('a[href], button:not([disabled])').count();

      // Tab one full cycle past the last element — focus must land back inside the dialog.
      for (let i = 0; i < focusableCount; i++) {
        await page.keyboard.press("Tab");
      }
      await expect(dialog.locator(":focus")).toHaveCount(1);

      // Shift+Tab back past the first element — same guarantee in reverse.
      for (let i = 0; i < focusableCount; i++) {
        await page.keyboard.press("Shift+Tab");
      }
      await expect(dialog.locator(":focus")).toHaveCount(1);
    });

    test("background content is inert while open", async ({ page }) => {
      await page.goto("/");
      await openDrawer(page);
      // inert doesn't propagate as an IDL property to descendants, only the
      // browser behavior does — assert it on the element it's actually set
      // on (Shell's content wrapper), not a descendant like <header>.
      await expect(page.locator("[data-shell-content]")).toHaveJSProperty("inert", true);
    });

    test("Escape closes and returns focus to the trigger", async ({ page }) => {
      await page.goto("/");
      const trigger = await openDrawer(page);

      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog", { name: "Menu" })).toBeHidden();
      await expect(trigger).toBeFocused();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    test("close button closes and returns focus to the trigger", async ({ page }) => {
      await page.goto("/");
      const trigger = await openDrawer(page);

      await page.getByRole("button", { name: "Close menu" }).click();
      await expect(page.getByRole("dialog", { name: "Menu" })).toBeHidden();
      await expect(trigger).toBeFocused();
    });
  });
}

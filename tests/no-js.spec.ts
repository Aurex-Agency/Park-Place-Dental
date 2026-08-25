import { expect, test } from "@playwright/test";
import { routes } from "./routes";

/**
 * Phase 3 Gate 1 (STATUS.md): a real page built on SplitReveal/RevealImage
 * rendered permanently invisible with JavaScript disabled — Motion writes
 * each primitive's `initial` prop as inline style at render time and only
 * clears it by running client JS on mount, so anything using `initial`
 * stayed pinned to its pre-reveal (hidden/offset) state forever without JS.
 * CLAUDE.md's working-style rule requires every section be "readable with
 * JS disabled," and nothing in the suite checked that until this file.
 *
 * The fix is a global `<noscript>` stylesheet (app/layout.tsx) keyed on
 * three data attributes primitives opt into — see that file's comment for
 * the full reasoning. This test asserts the contract holds, not just for
 * today's home page but for anything future gates build with these
 * primitives: forgetting the attribute on a new primitive use should fail
 * here, not get discovered by hand later.
 */
test.describe("readable with JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  for (const route of routes) {
    test(`${route.path}: no data-motion-reveal element is left invisible`, async ({ page }) => {
      await page.goto(route.path);

      const revealEls = page.locator("[data-motion-reveal]");
      const count = await revealEls.count();
      for (let i = 0; i < count; i++) {
        const el = revealEls.nth(i);
        const style = await el.evaluate((node) => {
          const cs = getComputedStyle(node);
          return { opacity: cs.opacity, transform: cs.transform, clipPath: cs.clipPath };
        });
        expect(style.opacity, `element ${i} on ${route.path}`).toBe("1");
        expect(["none", ""], `element ${i} on ${route.path} transform`).toContain(style.transform);
        expect(["none", ""], `element ${i} on ${route.path} clip-path`).toContain(style.clipPath);
      }
    });

    test(`${route.path}: no data-motion-only element (animation-only markup) is visible`, async ({ page }) => {
      await page.goto(route.path);

      const onlyEls = page.locator("[data-motion-only]");
      const count = await onlyEls.count();
      for (let i = 0; i < count; i++) {
        const display = await onlyEls.nth(i).evaluate((node) => getComputedStyle(node).display);
        expect(display, `element ${i} on ${route.path}`).toBe("none");
      }
    });

    test(`${route.path}: every data-motion-fallback element is visible, not sr-only-clipped`, async ({ page }) => {
      await page.goto(route.path);

      const fallbackEls = page.locator("[data-motion-fallback]");
      const count = await fallbackEls.count();
      for (let i = 0; i < count; i++) {
        const box = await fallbackEls.nth(i).boundingBox();
        expect(box, `element ${i} on ${route.path} should have a real rendered box`).not.toBeNull();
        expect(box!.width, `element ${i} on ${route.path} width`).toBeGreaterThan(1);
      }
    });
  }
});

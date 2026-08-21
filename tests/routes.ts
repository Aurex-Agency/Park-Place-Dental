/**
 * Single route manifest shared by the a11y suite (tests/a11y.spec.ts) and
 * Lighthouse CI (lighthouserc.json — kept in sync by hand, LHCI's config
 * format can't import this directly). Phase 3 should only ever need to add
 * entries here, not touch the test/CI config files themselves.
 */

export type RouteEntry = {
  path: string;
  /** /dev/* sandbox routes — real routes we still want covered pre-launch,
   * but flagged so excluding them from a production run (once real pages
   * replace them) is a one-line filter, not a hunt through test files. */
  devOnly?: boolean;
};

export const routes: RouteEntry[] = [
  { path: "/" },
  { path: "/about" },
  { path: "/services" },
  { path: "/new-patients" },
  { path: "/smile-gallery" },
  { path: "/contact" },
  { path: "/emergency-dentist" },
  { path: "/dev/tokens", devOnly: true },
  { path: "/dev/primitives", devOnly: true },
  { path: "/dev/shell", devOnly: true },
];

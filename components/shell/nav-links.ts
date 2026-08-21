/**
 * Single source for primary nav destinations — Nav, the mobile drawer, and
 * the footer's secondary nav all read this instead of restating the list.
 * Every href here must have a stub page under app/(marketing)/ (or real
 * content later) — see tests/routes.ts.
 *
 * Smile Gallery deliberately isn't listed: PLAN.md defers it past launch
 * (no consented before/afters exist yet), so linking it from primary nav
 * would point at a page that's empty at launch. The route and stub still
 * exist — /smile-gallery just isn't promoted until there's real content.
 */
export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/new-patients", label: "New Patients" },
  { href: "/contact", label: "Contact" },
] as const;

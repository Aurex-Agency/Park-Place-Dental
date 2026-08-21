/**
 * Single source for primary nav destinations — Nav, the mobile drawer, and
 * the footer's secondary nav all read this instead of restating the list.
 * Every href here must have a stub page under app/(marketing)/ (or real
 * content later) — see tests/routes.ts.
 */
export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/new-patients", label: "New Patients" },
  { href: "/smile-gallery", label: "Smile Gallery" },
  { href: "/contact", label: "Contact" },
] as const;

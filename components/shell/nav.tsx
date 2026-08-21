"use client";

import Link from "next/link";
import { SwapButton } from "@/components/motion";
import { practice } from "@/content/practice";
import { Container } from "./container";
import { NAV_LINKS } from "./nav-links";
import { useShellChrome } from "./shell-chrome";
import { useScrolled } from "./use-scrolled";

/** How far past the top the page has to scroll before a transparent nav solidifies. */
const SOLIDIFY_PX = 24;

// text-body (17px, not text-small) and real padding, not line-height, get
// the hit area to 44px — DESIGN-SYSTEM.md sets --text-body to 17px
// specifically for this audience, and Gate 3 found the nav using
// text-small instead. inline-flex+items-center so padding actually
// expands the clickable box (padding on a plain inline <a> is unreliable
// for hit-testing across browsers).
const LINK_CLASS =
  "shrink-0 whitespace-nowrap inline-flex items-center rounded-sm px-1 py-3 text-body outline-none focus-visible:ring-2 focus-visible:ring-focus";

/**
 * Solid by default (see TransparentHeroZone). Only floats transparent when
 * the current page has opted in and hasn't been scrolled past yet; once
 * solid for a scroll session it stays solid — it does not re-invert per
 * ThemeSection as the rest of the page scrolls by, only while transparent.
 */
export function Nav() {
  const { activeTheme, heroTransparent, drawerOpen, setDrawerOpen, drawerTriggerRef } = useShellChrome();
  const scrolled = useScrolled(SOLIDIFY_PX);
  const isSolid = !heroTransparent || scrolled;
  const isOverDarkHero = !isSolid && activeTheme === "dark";
  const textClass = isSolid || !isOverDarkHero ? "text-ink" : "text-cream";

  return (
    <header
      data-nav-state={isSolid ? "solid" : "transparent"}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-[var(--dur-fast)] ${
        isSolid ? "border-b border-ink/10 bg-cream/95 backdrop-blur" : "bg-transparent"
      }`}
    >
      <Container className={`flex items-center justify-between gap-1 py-4 ${textClass}`}>
        {/* text-lead, not text-h3 — the smaller display step recovers real
            width (was ~262px at text-h3) without inventing a new token
            (rule #1: tokens only). py-2.5 (up from py-2) keeps the 44px hit
            area even though the text itself shrank. */}
        <Link
          href="/"
          className="inline-flex shrink-0 items-center whitespace-nowrap rounded-sm py-2.5 font-display text-lead outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          {practice.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 min-[1400px]:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={LINK_CLASS}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 min-[1400px]:flex">
          {/* The phone number is the site's primary conversion (CLAUDE.md) —
              it read as the smallest, least prominent thing in the nav
              before Gate 3. Bordered pill + icon + bold text gives it real
              visual weight, on par with the CTAs either side of it, not a
              plain underlined utility link. border-current so it reads
              correctly in both Nav's transparent (cream text on dark hero)
              and solid (ink text) states — same mechanism as the rest of
              the header's text color. */}
          <a
            href={practice.nap.phoneHref}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill border border-current/30 px-3 py-2.5 text-body font-semibold outline-none hover:border-current/60 focus-visible:ring-2 focus-visible:ring-focus"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11 11 0 0 0 .56 3.5 1 1 0 0 1-.25 1z" />
            </svg>
            {practice.nap.phone}
          </a>
          {/* Filled brick pill, not a text link: brick text fails badly on
              navy (2.26:1), so a solid fill + white text is the only
              treatment that stays legible in both Nav's transparent-over-
              hero and solid states. Reachable directly, no menu — Gate 1's
              fix for Phase 2 dropping this from the desktop row entirely. */}
          <a
            href="/emergency-dentist"
            className="inline-flex shrink-0 items-center whitespace-nowrap rounded-pill bg-brick px-3 py-2.5 text-body font-bold text-white outline-none hover:bg-brick/90 focus-visible:ring-2 focus-visible:ring-focus"
          >
            Emergency
          </a>
          <SwapButton variant="primary" href="/contact">
            Request a Visit
          </SwapButton>
        </div>

        <button
          ref={drawerTriggerRef}
          type="button"
          aria-expanded={drawerOpen}
          aria-controls="mobile-drawer"
          onClick={() => setDrawerOpen(true)}
          className="rounded-sm p-2 outline-none focus-visible:ring-2 focus-visible:ring-focus min-[1400px]:hidden"
        >
          <span className="sr-only">Open menu</span>
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </Container>
    </header>
  );
}

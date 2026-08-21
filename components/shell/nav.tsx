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

const LINK_CLASS =
  "shrink-0 whitespace-nowrap rounded-sm text-small outline-none focus-visible:ring-2 focus-visible:ring-focus";

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
      <Container className={`flex items-center justify-between gap-2 py-4 ${textClass}`}>
        <Link href="/" className="shrink-0 whitespace-nowrap rounded-sm font-display text-h3 outline-none focus-visible:ring-2 focus-visible:ring-focus">
          {practice.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-2 xl:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={LINK_CLASS}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <a
            href={practice.nap.phoneHref}
            className={`${LINK_CLASS} font-medium underline-offset-4 hover:underline`}
          >
            {practice.nap.phone}
          </a>
          {/* Filled brick pill, not a text link: brick text fails badly on
              navy (2.26:1), so a solid fill + white text is the only
              treatment that stays legible in both Nav's transparent-over-
              hero and solid states. Reachable directly, no menu — Gate 1's
              fix for Phase 2 dropping this from the desktop row entirely. */}
          <a
            href="/emergency-dentist"
            className="inline-flex shrink-0 items-center whitespace-nowrap rounded-pill bg-brick px-2 py-1 text-small font-bold text-white outline-none hover:bg-brick/90 focus-visible:ring-2 focus-visible:ring-focus"
          >
            Emergency
          </a>
          <SwapButton variant="primary" href="/contact">
            Request an Appointment
          </SwapButton>
        </div>

        <button
          ref={drawerTriggerRef}
          type="button"
          aria-expanded={drawerOpen}
          aria-controls="mobile-drawer"
          onClick={() => setDrawerOpen(true)}
          className="rounded-sm p-2 outline-none focus-visible:ring-2 focus-visible:ring-focus xl:hidden"
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

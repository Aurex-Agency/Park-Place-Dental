"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { SwapButton, useMotionPreference } from "@/components/motion";
import { practice } from "@/content/practice";
import { NAV_LINKS } from "./nav-links";
import { useMounted } from "./use-mounted";
import { useShellChrome } from "./shell-chrome";

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Highest-risk a11y component in the project (STATUS.md Gate 2). Portals to
 * document.body so it's structurally outside the `inert` wrapper Shell puts
 * around the rest of the page while this is open — it has to be the one
 * thing left interactive.
 */
export function MobileDrawer() {
  const { drawerOpen, setDrawerOpen, drawerTriggerRef } = useShellChrome();
  const reducedMotion = useMotionPreference();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  // STATUS.md previously misdiagnosed a nav-color flash as the cause of a
  // console hydration error; the two were unrelated. The real cause: this
  // component branched on `typeof document === "undefined"` to skip
  // rendering during SSR. `document` doesn't exist on the server, but it
  // exists immediately in the browser — so the client's very first (pre-
  // hydration) render already disagreed with what the server sent, which is
  // exactly what React's hydration diffing flags (error #418). useMounted
  // starts `false` on both the server and the client's first render — they
  // agree — and only flips true, portaling the real content in, on a
  // subsequent client-only render after hydration has already committed.
  const mounted = useMounted();

  // Move focus in on open; return it to the trigger on close.
  useEffect(() => {
    if (drawerOpen) {
      closeButtonRef.current?.focus();
      wasOpenRef.current = true;
    } else if (wasOpenRef.current) {
      drawerTriggerRef.current?.focus();
      wasOpenRef.current = false;
    }
  }, [drawerOpen, drawerTriggerRef]);

  // Lock background scroll without a layout shift from the vanished scrollbar.
  useEffect(() => {
    if (!drawerOpen) return;
    const root = document.documentElement;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const previousOverflow = root.style.overflow;
    const previousPaddingRight = root.style.paddingRight;
    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      root.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPaddingRight;
    };
  }, [drawerOpen]);

  // Escape closes; Tab/Shift+Tab stay trapped inside the panel.
  useEffect(() => {
    if (!drawerOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setDrawerOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen, setDrawerOpen]);

  if (!mounted) return null;

  function close() {
    setDrawerOpen(false);
  }

  return createPortal(
    <div
      data-open={drawerOpen}
      data-reduced-motion={reducedMotion}
      inert={!drawerOpen}
      className="mobile-drawer-root fixed inset-0 z-[60]"
    >
      <div aria-hidden="true" onClick={close} className="mobile-drawer-backdrop absolute inset-0 bg-ink/50" />
      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        ref={panelRef}
        className="mobile-drawer-panel absolute inset-y-0 right-0 flex w-[min(20rem,85vw)] flex-col gap-8 overflow-y-auto bg-cream px-gutter py-8 shadow-soft"
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-h3 text-ink">Menu</span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            className="rounded-sm p-2 text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <span className="sr-only">Close menu</span>
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
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* gap-1 (8px) between rows, not the panel's own gap-8 between
            sections — Gate 3: rows need to be individually ≥48px tall via
            padding (not text size), close enough together to read as one
            list without needing extra spacing to stay unambiguous. */}
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="flex items-center rounded-sm px-1 py-3 text-lead text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Same "real visual weight" treatment as the desktop nav's phone
            pill — the drawer panel is always cream/ink, so no need for the
            border-current theming Nav's version uses. */}
        <a
          href={practice.nap.phoneHref}
          onClick={close}
          className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-pill border border-ink/30 px-4 py-2.5 text-lead font-semibold text-ink outline-none hover:border-ink/60 focus-visible:ring-2 focus-visible:ring-focus"
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

        <div className="mt-auto flex flex-col gap-3">
          <SwapButton variant="danger" href="/emergency-dentist" onClick={close}>
            Emergency Dentist
          </SwapButton>
          <SwapButton variant="primary" href="/contact" onClick={close}>
            Request an Appointment
          </SwapButton>
        </div>
      </div>
    </div>,
    document.body,
  );
}

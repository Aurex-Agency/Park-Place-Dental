"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { SwapButton, useMotionPreference } from "@/components/motion";
import { practice } from "@/content/practice";
import { NAV_LINKS } from "./nav-links";
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

  if (typeof document === "undefined") return null;

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

        <nav aria-label="Mobile" className="flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="rounded-sm text-lead text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={practice.nap.phoneHref}
          onClick={close}
          className="rounded-sm text-lead font-medium text-ink outline-none underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-focus"
        >
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

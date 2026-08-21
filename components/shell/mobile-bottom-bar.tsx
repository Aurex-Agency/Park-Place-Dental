"use client";

import Link from "next/link";
import { practice } from "@/content/practice";
import { trackEvent } from "@/lib/analytics";

/**
 * Persistent below Nav's own breakpoint for switching to the full inline
 * desktop layout (see nav.tsx), since below that Nav only shows the drawer
 * trigger and this bar is what carries the phone/CTA. Shell.tsx pads page
 * content so this never overlaps the last element on a page.
 *
 * Breakpoint history (STATUS.md has the full account): lg(1024) didn't fit,
 * xl(1280) stopped fitting once Gate 3 grew every target to 44px, 1400px
 * fit but meant no hamburger only above the 1366-1536px laptop range —
 * PLAN.md §3 requires full nav at 1280px and up, so that wasn't
 * acceptable. Fixed by cutting real content (CTA label, logo size) and
 * giving Nav its own tighter --nav-gutter instead of the body-prose
 * --spacing-gutter, then measuring the real fit threshold: exactly 0
 * margin at 1078px, stable at the full --nav-gutter (24px) margin from
 * 1120px on. 1120px is that stable point, not an arbitrary buffer.
 */
export function MobileBottomBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink/10 bg-cream/95 backdrop-blur min-[1120px]:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={practice.nap.phoneHref}
        onClick={() => trackEvent("bottom_bar_call_click")}
        className="flex flex-1 items-center justify-center py-4 text-body font-medium text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        Call
      </a>
      <Link
        href="/contact"
        onClick={() => trackEvent("bottom_bar_request_visit_click")}
        className="flex flex-1 items-center justify-center bg-gold py-4 text-body font-medium text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        Request a Visit
      </Link>
    </div>
  );
}

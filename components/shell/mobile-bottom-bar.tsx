"use client";

import Link from "next/link";
import { practice } from "@/content/practice";
import { trackEvent } from "@/lib/analytics";

/**
 * Persistent below the xl breakpoint — matches Nav's own breakpoint for
 * switching to the full inline desktop layout (see nav.tsx), since below
 * that Nav only shows the drawer trigger and this bar is what carries the
 * phone/CTA. Shell.tsx pads page content so this never overlaps the last
 * element on a page. (Tried lg — measured, doesn't fit even with Smile
 * Gallery dropped from NAV_LINKS; see STATUS.md.)
 */
export function MobileBottomBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink/10 bg-cream/95 backdrop-blur xl:hidden"
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
        onClick={() => trackEvent("bottom_bar_request_appointment_click")}
        className="flex flex-1 items-center justify-center bg-gold py-4 text-body font-medium text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        Request an Appointment
      </Link>
    </div>
  );
}

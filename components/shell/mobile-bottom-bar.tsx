"use client";

import Link from "next/link";
import { practice } from "@/content/practice";
import { trackEvent } from "@/lib/analytics";

/**
 * Persistent below Nav's own breakpoint for switching to the full inline
 * desktop layout (see nav.tsx), since below that Nav only shows the drawer
 * trigger and this bar is what carries the phone/CTA. Shell.tsx pads page
 * content so this never overlaps the last element on a page. (Tried lg —
 * measured, doesn't fit even with Smile Gallery dropped from NAV_LINKS.
 * Tried xl — Gate 3's 44px touch targets grew the nav enough that xl
 * stopped fitting too; landed on a custom 1400px breakpoint rather than
 * jumping to 2xl/1536px, which would push the common 1366-1536px laptop
 * range into hamburger mode for no reason. See STATUS.md.)
 */
export function MobileBottomBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink/10 bg-cream/95 backdrop-blur min-[1400px]:hidden"
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

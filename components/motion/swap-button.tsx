"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { useMotionPreference } from "./motion-preference";

type Variant = "primary" | "ghost" | "danger";

type SwapButtonOwnProps = {
  children: string;
  variant?: Variant;
  className?: string;
};

type SwapButtonProps =
  | (SwapButtonOwnProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">)
  | (SwapButtonOwnProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">);

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-navy-mid text-white hover:bg-navy-lift focus-visible:bg-navy-lift",
  ghost: "border border-ink/20 text-ink hover:border-navy focus-visible:border-navy",
  danger: "bg-danger text-white hover:bg-danger/90 focus-visible:bg-danger/90",
};

/**
 * Two stacked copies of the label in an overflow-hidden box; on hover/focus
 * both slide up one line-height using CSS transforms only (WORKFLOW.md:
 * don't burn JS on this). Reduced motion disables the slide via the
 * data-reduced-motion selector in globals.css — the color-change hover state
 * still works since that's a plain color transition, not a vestibular concern.
 */
export function SwapButton({ children, variant = "primary", className, href, ...rest }: SwapButtonProps) {
  const reducedMotion = useMotionPreference();

  // shrink-0 + whitespace-nowrap: the two-line-stack slide only works with
  // exactly one line of text, so in any flex context that would otherwise
  // compress this below its content width (e.g. a crowded nav row), the
  // label must never wrap or shrink — found via Phase 2's Nav, where a
  // squeezed flex row wrapped "Emergency Dentist" and the h-[1.2em]
  // overflow-hidden wrapper silently clipped the second line.
  const sharedClassName = `group relative inline-flex shrink-0 items-center justify-center overflow-hidden whitespace-nowrap rounded-pill px-6 py-3 text-body font-medium outline-none transition-colors duration-[var(--dur-fast)] focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 ${VARIANT_CLASSES[variant]} ${className ?? ""}`;

  const inner = (
    <span className="relative block h-[1.2em] overflow-hidden">
      <span
        data-reduced-motion={reducedMotion}
        className="swap-button-inner flex flex-col transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out-expo)] group-hover:-translate-y-[1.2em] group-focus-visible:-translate-y-[1.2em]"
      >
        <span className="block leading-[1.2]">{children}</span>
        <span className="block leading-[1.2]" aria-hidden="true">
          {children}
        </span>
      </span>
    </span>
  );

  if (href) {
    return (
      <a href={href} className={sharedClassName} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" className={sharedClassName} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
}

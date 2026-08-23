"use client";

import { useState } from "react";
import {
  COLUMN_PATHS,
  LineDraw,
  ScrollCrossfade,
  SplitReveal,
  SwapButton,
  ThemeSection,
} from "@/components/motion";
import { Container } from "@/components/shell/container";
import { hero } from "@/content/home";
import { sculptureImages } from "@/content/images";
import { practice } from "@/content/practice";

/**
 * "Stone Becomes Alive" — HERO-CONCEPT.md. One sculptural object (bar.md
 * M1), dark navy ground (M2), letterspaced display type lower-left in the
 * quiet side of the frame (M4), one gold hairline as the transformation
 * completes (M3/M5 — a single accent use, not decoration on the object
 * itself). State A (cool marble) and State B (warmed cream marble) are
 * reference-conditioned edits of each other, verified pixel-aligned outside
 * the mouth region before either was accepted — see STATUS.md and
 * content/images.ts's sculptureImages doc comment for the measurement.
 *
 * Headline is structural only — content/home.ts's bracket placeholder,
 * Kalob owns the real copy.
 */
export function Hero() {
  const [wipeComplete, setWipeComplete] = useState(false);

  return (
    <ThemeSection theme="dark" className="relative flex min-h-[100svh] items-center overflow-hidden">
      <Container className="w-full py-[var(--spacing-section)]">
        <div className="grid items-center gap-12 md:grid-cols-[1.1fr_1fr] md:gap-8">
          {/* Quiet side — bar.md M4: letterspaced caps, lower-left, small
              relative to the object it's beside. */}
          <div>
            {/* Static cap rule — bar.md M5 wants ≥2 hairlines per viewport;
                the gold LineDraw below is the one accent-colored rule
                (M3), this is the plain second one, cream not gold. */}
            <div className="h-px w-12 bg-cream/25" />
            {/* text-cream, not text-gold — bar.md M3 caps gold at two
                elements per viewport, and the hairline + CTA fill below
                already spend both. */}
            <p className="mt-6 text-eyebrow uppercase tracking-eyebrow text-cream/70">{hero.eyebrow}</p>
            <SplitReveal
              as="h1"
              lines={[hero.headline]}
              className="mt-4 max-w-[16ch] font-display text-d2 uppercase leading-[1.15] tracking-display text-cream"
            />
            <p className="mt-6 max-w-[36ch] text-lead leading-lead text-cream/75">{hero.subhead}</p>

            {/* One gold hairline, timed to the transformation completing —
                not decoration on the sculpture itself (bar.md M3: gold on
                no more than two elements per viewport — the CTA fill is the
                other one). */}
            <LineDraw
              path={COLUMN_PATHS.thinRule}
              viewBox="55 88 290 12"
              trigger={wipeComplete}
              duration={0.9}
              strokeWidth={2}
              className="mt-8 h-1 w-40 text-gold"
            />

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <SwapButton href="/contact" variant="primary">
                {hero.cta}
              </SwapButton>
              <a
                href={practice.nap.phoneHref}
                className="inline-flex items-center gap-2 rounded-sm py-2.5 text-lead font-medium text-cream outline-none underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-focus"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
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
            </div>
          </div>

          {/* The object — bar.md M1: 35-55% of frame. aspect-[4/3] box, both
              states cropped to fill it via object-cover (see
              scroll-crossfade.tsx's doc comment for why not object-contain). */}
          <ScrollCrossfade
            wrapperClassName="aspect-[4/3] w-full max-w-[520px] justify-self-center md:justify-self-end"
            baseImage={{
              src: sculptureImages.stateB.src,
              alt: sculptureImages.stateB.alt,
              width: sculptureImages.stateB.width,
              height: sculptureImages.stateB.height,
              sizes: "(min-width: 768px) 520px, 90vw",
            }}
            topImage={{
              src: sculptureImages.stateA.src,
              alt: sculptureImages.stateA.alt,
              width: sculptureImages.stateA.width,
              height: sculptureImages.stateA.height,
              sizes: "(min-width: 768px) 520px, 90vw",
            }}
            onCompleteAction={() => setWipeComplete(true)}
          />
        </div>
      </Container>
    </ThemeSection>
  );
}

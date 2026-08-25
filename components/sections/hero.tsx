import { ScrollCrossfade, SplitReveal, SwapButton, ThemeSection } from "@/components/motion";
import { hero } from "@/content/home";
import { heroStatesPortrait } from "@/content/images";
import { practice } from "@/content/practice";

/**
 * Half-page split hero, replacing the framed-plate concept (rejected — too
 * small, read as an award certificate rather than a website). The portrait
 * pair (heroStatesPortrait) fills one full-height half of the viewport and
 * bleeds off the outer edge — no frame, no inset, no scrim. Type sits on
 * flat navy in the other half, left-aligned (bar.md M4 — display type
 * belongs left/lower-left; the photo half already carries the symmetry, so
 * the type half must not). Text never crosses the photograph, so contrast
 * is solved structurally rather than with an overlay.
 *
 * Deliberately NOT wrapped in TransparentHeroZone. That was tried first — it
 * gets the section the true 100svh from y=0 instead of losing --nav-h to
 * Shell's automatic `pt-[var(--nav-h)]` — but it means Nav floats without a
 * solid backing over whatever's directly beneath it, and the right half of
 * this hero is a photo, not flat navy. Nav's phone link and Emergency/CTA
 * pills sit on unpredictable photo colors with only a translucent border,
 * not a guaranteed-legible background — a real contrast risk DIRECTION.md's
 * "solid navy" nav was written to avoid. Keeping Nav solid (its literal
 * spec) costs 72px of vertical space, but the CTA-below-the-fold defect
 * this section fixes doesn't need every last pixel: a vertically-centered
 * content block inside `min-h-[100svh]` clears the fold with 300+px to
 * spare even at this build's shortest tested height (768px) — verified,
 * not assumed. Nav and this section render the identical navy, so there's
 * still no visible seam between them despite the reserved gap.
 *
 * min-[1180px] matches Nav's own breakpoint exactly (not Tailwind's md/
 * 768px) — "stack under the nav breakpoint" means this one specifically,
 * since that's the same width where the mobile drawer/bottom-bar chrome
 * takes over anyway.
 *
 * Headline is structural only — content/home.ts's bracket placeholder,
 * Kalob owns the real copy.
 */
export function Hero() {
  return (
    <ThemeSection theme="dark" className="overflow-hidden">
      <div className="grid min-h-[100svh] min-[1180px]:grid-cols-2">
        {/* The photo — first in DOM so mobile stacking puts it on top
            without needing an order utility; min-[1180px]:order-2 moves
            it to the bleeding-right column on desktop. aspect-[4/5]
            matches the source crop exactly on mobile (zero cropping,
            guaranteed); above 1180px the column's live aspect ratio is
            whatever (half-viewport-width / viewport-height) works out to
            — object-position biased toward the top keeps heads clear,
            since any cropping there falls to the ground/urns instead. */}
        <div className="relative order-1 aspect-[4/5] w-full min-[1180px]:order-2 min-[1180px]:aspect-auto min-[1180px]:h-full">
          <ScrollCrossfade
            wrapperClassName="h-full w-full"
            baseImage={{
              src: heroStatesPortrait.warm.src,
              alt: heroStatesPortrait.warm.alt,
              width: heroStatesPortrait.warm.width,
              height: heroStatesPortrait.warm.height,
              priority: true,
              sizes: "(min-width: 1180px) 50vw, 100vw",
              className: "object-[center_15%]",
            }}
            topImage={{
              src: heroStatesPortrait.cool.src,
              alt: heroStatesPortrait.cool.alt,
              width: heroStatesPortrait.cool.width,
              height: heroStatesPortrait.cool.height,
              sizes: "(min-width: 1180px) 50vw, 100vw",
              className: "object-[center_15%]",
            }}
          />
        </div>

        {/* justify-end, not justify-center: a short type stack centered in
            a full-height column reads as floating (measured: symmetric
            400px/400px empty navy above and below at 2560x1214) — bottom-
            weighting it, meuze.ai-style, anchors it against the photo
            instead. pb-24 is the deliberately small remainder below;
            everything above collapses to whatever's left, which is most
            of the column. Unchanged on mobile (py-16, centered in its own
            stacked block) — the floating problem is specific to a
            full-height column much taller than its content. */}
        <div className="order-2 flex flex-col justify-center gap-10 px-[var(--spacing-gutter)] py-16 min-[1180px]:order-1 min-[1180px]:justify-end min-[1180px]:py-0 min-[1180px]:pb-24">
          <div>
            <p className="text-eyebrow uppercase tracking-eyebrow text-cream/70">{hero.eyebrow}</p>
            {/* text-hero-split — DESIGN-SYSTEM.md's largest scale step
                (text-hero, previously unused anywhere on the site) with a
                shallower vw ramp, since 9vw is sized against the full
                viewport and overflowed this half-width column at 1180-
                1440px (see globals.css). bar.md M1 gives the photo genuine
                visual weight (a face reads ~200px tall beside this
                column); the headline needs to hold its own at that scale,
                not sit politely beside it. max-w tuned so the placeholder
                headline holds exactly two lines without orphaning a word
                at 1180/1440/1920/2560 — re-check this width once real
                copy replaces the placeholder, since line count depends on
                the actual words, not just the token. */}
            <SplitReveal
              as="h1"
              lines={[hero.headline]}
              className="mt-6 max-w-[20ch] font-display text-hero-split uppercase leading-[0.95] tracking-display text-cream"
            />
            <p className="mt-8 max-w-[36ch] text-lead leading-lead text-cream/75">{hero.subhead}</p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
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
      </div>
    </ThemeSection>
  );
}

import { LineDraw, ScrollCrossfade, SplitReveal, SwapButton, ThemeSection } from "@/components/motion";
import { Container } from "@/components/shell/container";
import { hero } from "@/content/home";
import { heroStates } from "@/content/images";
import { practice } from "@/content/practice";

/** One L-shaped stroke, corner at (0,0), arms running along the top and
 * left edges of its own box — rotate/flip via className to cover all four
 * frame corners. */
const CORNER_PATH = "M0,16 L0,0 L16,0";

function CornerBracket({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const placement = {
    tl: "top-0 left-0",
    tr: "top-0 right-0 -scale-x-100",
    bl: "bottom-0 left-0 -scale-y-100",
    br: "bottom-0 right-0 -scale-100",
  }[position];

  return (
    <LineDraw
      path={CORNER_PATH}
      viewBox="0 0 16 16"
      duration={0.6}
      delay={0.3}
      strokeWidth={2}
      className={`absolute -m-1 h-4 w-4 text-gold ${placement}`}
    />
  );
}

/**
 * Framed-plate hero, replacing the marble-sculpture concept (rejected — a
 * Roman bust reads as absurd on a small-town dental practice). The
 * transformation idea survives with the real subject: the team outside the
 * real practice, brick wall and white classical urns behind them (the
 * urns are the site's genuine classical note, echoing the Ionic column in
 * the logo — nothing generated).
 *
 * The photo is symmetrical and centred, so nothing sits on top of it —
 * headline above on flat navy, image below inside a gold hairline frame
 * with LineDraw corner brackets, CTA below the frame. Contrast is solved
 * structurally (text always on flat navy, 4.90:1+) rather than with a
 * scrim, and the frame + brackets together are this viewport's one gold
 * treatment (bar.md M3), paired with the CTA fill as the second.
 *
 * Headline is structural only — content/home.ts's bracket placeholder,
 * Kalob owns the real copy.
 */
export function Hero() {
  return (
    <ThemeSection theme="dark" className="flex min-h-[100svh] items-center overflow-hidden">
      <Container className="w-full py-[var(--spacing-section)]">
        <div className="mx-auto flex max-w-[880px] flex-col items-center text-center">
          <p className="text-eyebrow uppercase tracking-eyebrow text-cream/70">{hero.eyebrow}</p>
          <SplitReveal
            as="h1"
            lines={[hero.headline]}
            className="mt-4 max-w-[20ch] font-display text-d2 uppercase leading-[1.15] tracking-display text-cream"
          />
          <p className="mt-6 max-w-[48ch] text-lead leading-lead text-cream/75">{hero.subhead}</p>
        </div>

        {/* The frame — bar.md M1/M2/M6: one real object (the photo, not a
            generated one), full navy around it, no card fill, just a gold
            hairline + corner brackets. Fixed 16:9 (== 2000:1125, the source
            crop) at every width so object-cover never crops a face — the
            frame's aspect never diverges from the photo's own. */}
        <div className="relative mx-auto mt-12 aspect-[16/9] w-full max-w-[960px] border border-gold">
          <CornerBracket position="tl" />
          <CornerBracket position="tr" />
          <CornerBracket position="bl" />
          <CornerBracket position="br" />
          <ScrollCrossfade
            wrapperClassName="h-full w-full"
            baseImage={{
              src: heroStates.warm.src,
              alt: heroStates.warm.alt,
              width: heroStates.warm.width,
              height: heroStates.warm.height,
              priority: true,
              sizes: "(min-width: 1024px) 960px, 100vw",
            }}
            topImage={{
              src: heroStates.cool.src,
              alt: heroStates.cool.alt,
              width: heroStates.cool.width,
              height: heroStates.cool.height,
              sizes: "(min-width: 1024px) 960px, 100vw",
            }}
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
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
      </Container>
    </ThemeSection>
  );
}

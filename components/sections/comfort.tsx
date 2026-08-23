import { COLUMN_PATHS, LineDraw, ThemeSection } from "@/components/motion";
import { Container } from "@/components/shell/container";
import { comfort } from "@/content/home";

/**
 * Differs from TrustStrip: one claim, held long — a single wide statement
 * instead of four short facts, the page's first slow beat after the fast
 * open. Still dark, still hairline-bounded (bar.md M5), no image — text
 * alone is the whole section.
 */
export function Comfort() {
  return (
    <ThemeSection theme="dark" className="py-[var(--spacing-section)]">
      <Container>
        <p className="text-eyebrow uppercase tracking-eyebrow text-cream/60">{comfort.eyebrow}</p>
        <LineDraw
          path={COLUMN_PATHS.thinRule}
          viewBox="55 88 290 12"
          duration={0.9}
          strokeWidth={1}
          className="mt-4 h-1 w-24 text-cream/20"
        />
        <h2 className="mt-8 max-w-[20ch] font-display text-d2 leading-[1.1] text-cream">{comfort.heading}</h2>
        <p className="mt-6 max-w-[48ch] text-lead leading-lead text-cream/75">{comfort.body}</p>
        {/* Closing rule — bar.md M5's second hairline for this viewport. */}
        <div className="mt-10 h-px w-full max-w-[48ch] bg-cream/15" />
      </Container>
    </ThemeSection>
  );
}

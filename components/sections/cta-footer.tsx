import { COLUMN_PATHS, LineDraw, SwapButton, ThemeSection } from "@/components/motion";
import { Container } from "@/components/shell/container";
import { ctaFooter } from "@/content/home";
import { practice } from "@/content/practice";

/**
 * Differs from Location: the page's last dark beat, and the only section
 * whose entire job is the CTA — no facts, no proof, just the ask restated
 * once more before Footer's plain reference chrome. Gold hairline echoes
 * Hero's, closing the page on the same mark it opened on.
 */
export function CtaFooter() {
  return (
    <ThemeSection theme="dark" className="py-[var(--spacing-section)]">
      <Container className="flex flex-col items-start">
        <LineDraw
          path={COLUMN_PATHS.thinRule}
          viewBox="55 88 290 12"
          duration={0.9}
          strokeWidth={2}
          className="h-1 w-40 text-gold"
        />
        <h2 className="mt-8 max-w-[18ch] font-display text-d2 leading-[1.1] text-cream">{ctaFooter.heading}</h2>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <SwapButton href="/contact" variant="primary">
            Request a Visit
          </SwapButton>
          <a
            href={practice.nap.phoneHref}
            className="text-lead font-medium text-cream underline-offset-4 hover:underline"
          >
            {practice.nap.phone}
          </a>
        </div>
        {/* Plain second hairline (bar.md M5) — the gold rule above already
            spends this section's one accent use (M3, paired with the CTA
            fill), so this closing rule stays cream. */}
        <div className="mt-16 h-px w-full bg-cream/15" />
      </Container>
    </ThemeSection>
  );
}

import { StickySteps, ThemeSection } from "@/components/motion";
import { Container } from "@/components/shell/container";
import { firstVisit } from "@/content/home";

/**
 * Differs from Comfort: the page's first light/cream ground — this is a
 * reading-heavy, decision-support section (DIRECTION.md's explicit list),
 * not an image or a mood beat. Sticky rail replaces cards entirely — no
 * borders or shadows around the steps themselves, just the two bracketing
 * rules around the heading (bar.md M5).
 */
export function FirstVisit() {
  return (
    <ThemeSection theme="light" className="py-[var(--spacing-section)]">
      <Container>
        <p className="text-eyebrow uppercase tracking-eyebrow text-navy-mid">{firstVisit.eyebrow}</p>
        <div className="mt-3 h-px w-12 bg-ink/15" />
        <h2 className="mt-6 max-w-[20ch] font-display text-d2 leading-[1.1] text-ink">{firstVisit.heading}</h2>
        <div className="mt-10 h-px w-full bg-ink/15" />
        <StickySteps steps={[...firstVisit.steps]} className="mt-16" />
      </Container>
    </ThemeSection>
  );
}

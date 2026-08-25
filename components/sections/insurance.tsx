import { Marquee, ThemeSection } from "@/components/motion";
import { Container } from "@/components/shell/container";
import { insurance } from "@/content/home";
import { practice } from "@/content/practice";

/**
 * Differs from Team: back to cream — the second reading-heavy section
 * (DIRECTION.md's explicit list) and the first place a long, flat list of
 * plan names needs to live without becoming a grid of white cards. A
 * hairline-bounded marquee carries the list instead (bar.md M6): no card
 * shape, and it reads as one continuous ruled band top and bottom.
 */
export function Insurance() {
  return (
    // pb trimmed below --spacing-section: Location follows immediately on
    // the same cream ground, and two full section paddings back to back
    // (this section's bottom + Location's top) stacked into dead whitespace
    // that read as a mistake rather than a deliberate pause — found on the
    // built page, not guessable from the token alone.
    <ThemeSection theme="light" className="pt-[var(--spacing-section)] pb-20">
      <Container>
        <p className="text-eyebrow uppercase tracking-eyebrow text-navy-mid">{insurance.eyebrow}</p>
        <h2 className="mt-4 max-w-[24ch] font-display text-d2 leading-[1.1] text-ink">{insurance.heading}</h2>
        <p className="mt-4 max-w-[48ch] text-lead text-ink/70">{insurance.confirmLine}</p>
      </Container>

      <div className="mt-16 border-y border-ink/15 py-8">
        <Marquee speed={32}>
          {practice.insurances.accepted.map((plan) => (
            <span key={plan} className="whitespace-nowrap px-8 font-display text-h3 text-ink/80">
              {plan}
            </span>
          ))}
        </Marquee>
      </div>

      <Container>
        <p className="mt-8 text-body text-ink/60">Financing available through {practice.insurances.financing}.</p>
      </Container>
    </ThemeSection>
  );
}

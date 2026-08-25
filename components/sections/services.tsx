import { SwapButton, ThemeSection } from "@/components/motion";
import { Container } from "@/components/shell/container";
import { services } from "@/content/home";
import { practice } from "@/content/practice";

/**
 * Differs from FirstVisit: back to dark, and structured as a scan-list
 * (bar.md M5/M6) — each row opens on a hairline instead of sitting in a
 * filled card, so five rows read as one ruled panel, not five boxes.
 */
export function Services() {
  return (
    <ThemeSection theme="dark" className="py-[var(--spacing-section)]">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-eyebrow uppercase tracking-eyebrow text-cream/60">{services.eyebrow}</p>
            <h2 className="mt-4 max-w-[20ch] font-display text-d2 leading-[1.1] text-cream">{services.heading}</h2>
          </div>
          <div className="flex flex-col items-start gap-3 border-l border-cream/20 pl-6">
            <p className="max-w-[28ch] text-body text-cream/70">{services.emergency}</p>
            <SwapButton href="/emergency-dentist" variant="danger">
              Emergency Dentist
            </SwapButton>
          </div>
        </div>

        <ul className="mt-16 border-t border-cream/20">
          {practice.services.map((service) => (
            <li key={service.category} className="grid gap-2 border-b border-cream/20 py-6 md:grid-cols-[1fr_2fr] md:gap-8">
              <p className="font-display text-h3 text-cream">{service.category}</p>
              <p className="max-w-[48ch] text-lead text-cream/70">{service.detail}</p>
            </li>
          ))}
        </ul>
      </Container>
    </ThemeSection>
  );
}

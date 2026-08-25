import { ThemeSection } from "@/components/motion";
import { Container } from "@/components/shell/container";
import { location } from "@/content/home";
import { practice } from "@/content/practice";

/**
 * Differs from Insurance: still cream (reading-heavy, per DIRECTION.md),
 * but a fact grid rather than a scrolling list — address, hours, and
 * service area sit in three hairline-topped columns instead of one banded
 * strip, closing the reading run before CtaFooter returns to dark.
 */
export function Location() {
  return (
    <ThemeSection theme="light" className="pt-20 pb-[var(--spacing-section)]">
      <Container>
        <p className="text-eyebrow uppercase tracking-eyebrow text-navy-mid">{location.eyebrow}</p>
        <div className="mt-3 h-px w-12 bg-ink/15" />
        <h2 className="mt-6 max-w-[24ch] font-display text-d2 leading-[1.1] text-ink">{location.heading}</h2>

        <div className="mt-16 grid gap-10 border-t border-ink/15 pt-10 md:grid-cols-3">
          <div>
            <p className="text-eyebrow uppercase tracking-eyebrow text-navy-mid">Address</p>
            <address className="mt-3 max-w-[24ch] text-lead not-italic leading-lead text-ink/80">
              {practice.nap.address.street}
              <br />
              {practice.nap.address.city}, {practice.nap.address.state} {practice.nap.address.zip}
            </address>
          </div>
          <div>
            <p className="text-eyebrow uppercase tracking-eyebrow text-navy-mid">Hours</p>
            <p className="mt-3 max-w-[24ch] text-lead leading-lead text-ink/80">{practice.hours}</p>
          </div>
          <div>
            <p className="text-eyebrow uppercase tracking-eyebrow text-navy-mid">Also serving</p>
            <p className="mt-3 max-w-[28ch] text-lead leading-lead text-ink/80">
              {practice.serviceAreaTowns.join(", ")}, and the rest of {practice.county}.
            </p>
          </div>
        </div>
      </Container>
    </ThemeSection>
  );
}

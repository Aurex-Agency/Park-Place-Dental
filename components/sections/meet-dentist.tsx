import { RevealImage, ThemeSection } from "@/components/motion";
import { Container } from "@/components/shell/container";
import { meetDentist } from "@/content/home";
import { images } from "@/content/images";
import { practice } from "@/content/practice";

/**
 * Differs from Services: a person, not a list — the one portrait on the
 * page before the full-bleed team section. Photo sits inside a bounded
 * frame here (RevealImage), reserving true full-bleed treatment for Team
 * right after it so the two don't read as the same move twice in a row.
 */
export function MeetDentist() {
  return (
    <ThemeSection theme="dark" className="py-[var(--spacing-section)]">
      <Container>
        <div className="grid items-center gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <RevealImage
            src={images.drGoodwinPortrait.src}
            alt={images.drGoodwinPortrait.alt}
            width={images.drGoodwinPortrait.width}
            height={images.drGoodwinPortrait.height}
            wrapperClassName="aspect-[4/5] w-full rounded-md"
          />
          <div>
            <p className="text-eyebrow uppercase tracking-eyebrow text-cream/60">{meetDentist.eyebrow}</p>
            <div className="mt-3 h-px w-12 bg-cream/25" />
            <h2 className="mt-6 font-display text-d2 leading-[1.1] text-cream">{meetDentist.heading}</h2>
            <p className="mt-6 max-w-[44ch] text-lead leading-lead text-cream/75">{meetDentist.body}</p>
            {/* Second hairline (bar.md M5) opens the closing differentiator
                line rather than just trailing off after the bio. */}
            <div className="mt-6 h-px w-full max-w-[44ch] bg-cream/15" />
            <p className="mt-6 max-w-[44ch] text-body text-cream/60">
              {practice.differentiators.find((d) => d.key === "local")!.body}
            </p>
          </div>
        </div>
      </Container>
    </ThemeSection>
  );
}

import Image from "next/image";
import { ThemeSection } from "@/components/motion";
import { Container } from "@/components/shell/container";
import { team } from "@/content/home";
import { images } from "@/content/images";

/**
 * Differs from MeetDentist: full-bleed, no bounding frame, nothing overlaid
 * on the photo itself (bar.md M6/M7 — a real group photo standing on its
 * own, not a hero-style card with type stacked on top of it). Heading sits
 * above the image in the normal text flow instead. teamBrick over
 * teamIndoor for this slot — its landscape frame fills a full-bleed band
 * without the extreme height a 4:5 portrait would force at 100vw.
 */
export function Team() {
  return (
    <ThemeSection theme="dark" className="pb-[var(--spacing-section)] pt-[var(--spacing-section)]">
      <Container>
        <p className="text-eyebrow uppercase tracking-eyebrow text-cream/60">{team.eyebrow}</p>
        <div className="mt-3 h-px w-12 bg-cream/25" />
        <h2 className="mt-6 max-w-[20ch] font-display text-d2 leading-[1.1] text-cream">{team.heading}</h2>
      </Container>
      {/* border-y, not a caption or overlay — a frame edge, not decoration
          on the photo itself, so it doesn't reopen bar.md M6/M7 while still
          giving this section its second hairline (M5). */}
      <div className="relative mt-12 aspect-[4/3] w-full border-y border-cream/15 md:aspect-[21/9]">
        <Image
          src={images.teamBrick.src}
          alt={images.teamBrick.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </ThemeSection>
  );
}

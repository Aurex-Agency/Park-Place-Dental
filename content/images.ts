/**
 * Real photography from the practice, processed from their own Facebook/
 * Instagram assets (Google Drive "Website Assets" folder).
 *
 * Every file has been white-balanced and level-normalised so the indoor and
 * outdoor shots sit together instead of clashing, then exported to AVIF + WebP
 * at 2400px longest edge. Originals are in _raw-photos/ (gitignored).
 *
 * These are REAL photos of REAL people at this practice — CLAUDE.md rule #7
 * is satisfied. Do not replace any of them with stock or AI imagery.
 *
 * Serve through next/image. Reference `src` (the .avif); next/image handles
 * format negotiation and responsive sizing. `alt` text is written; use it.
 */

export type PracticeImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Where this shot is strongest. Guidance, not a hard binding. */
  use: string;
};

export const images = {
  /**
   * HERO. Re-cropped from teamIndoor specifically for the split hero's photo
   * column: sides pulled in, excess floor and ceiling dropped, and a figure
   * who was being sliced at the left frame edge removed. Faces sit larger and
   * higher than in the uncropped original.
   *
   * Chosen over the exterior shot because the indoor light is soft and even —
   * nobody is squinting, there are no harsh midday shadows, and the warm wood
   * and wall tones sit with the cream palette instead of fighting it.
   */
  teamIndoorHero: {
    src: "/images/team-indoor-hero.avif",
    alt: "The Park Place Dental team inside the practice in Booneville, Mississippi",
    width: 1200,
    height: 1500,
    use: "Hero photo column. 4:5 portrait — sized for the split hero, not full-bleed.",
  },

  heroExterior: {
    src: "/images/hero-exterior-16x9.avif",
    alt: "The Park Place Dental team outside the practice in Booneville, Mississippi",
    width: 2400,
    height: 1350,
    use: "Hero. Shows the team, the brick building, and the white column the logo is drawn from — all in one frame. Strongest single asset we have.",
  },

  teamExterior: {
    src: "/images/team-exterior.avif",
    alt: "The Park Place Dental team outside the practice, brick facade and white column",
    width: 1536,
    height: 2048,
    use: "Uncropped portrait version of the hero shot. Use where a taller crop is needed.",
  },

  drGoodwinPortrait: {
    src: "/images/dr-goodwin-portrait.avif",
    alt: "Dr. Ken Goodwin, dentist at Park Place Dental in Booneville, Mississippi",
    width: 1080,
    height: 1350,
    use: "About / Meet the Dentist. Clean backdrop, warm and direct — the best portrait in the set.",
  },

  drGoodwinWorking: {
    src: "/images/dr-goodwin-working.avif",
    alt: "Dr. Ken Goodwin at work at Park Place Dental",
    width: 1440,
    height: 1800,
    use: "Services or technology section.",
  },

  teamIndoor: {
    src: "/images/team-indoor.avif",
    alt: "The Park Place Dental team inside the practice",
    width: 1440,
    height: 1800,
    use: "Team section — full team including Dr. Goodwin.",
  },

  teamBrick: {
    src: "/images/team-brick.avif",
    alt: "The Park Place Dental team in front of the practice's brick wall",
    width: 2016,
    height: 1512,
    use: "Team section alternate. Landscape orientation.",
  },

  teamMember: {
    src: "/images/team-member.avif",
    alt: "A member of the Park Place Dental team",
    width: 1414,
    height: 1886,
    use: "Individual team portrait. Note: we don't have a confirmed name for this person — do not caption with a name until Kalob confirms it.",
  },

  reception: {
    src: "/images/reception.avif",
    alt: "The reception area at Park Place Dental",
    width: 1536,
    height: 2048,
    use: "Office / what to expect section. Anxious visitors read a clean, warm waiting area as reassurance.",
  },
} as const satisfies Record<string, PracticeImage>;

/**
 * Hero sculpture — AI-generated (Higgsfield), and deliberately NOT a photo of
 * a person. CLAUDE.md rule #7 ("no AI-generated or stock images of people")
 * governs depictions of the dentist, staff, or patients; this is a classical
 * marble bust used as a conceptual device — an artistic object, the same
 * category as a stock illustration or a generated texture, not a stand-in
 * for any real or implied person at the practice. HERO-CONCEPT.md /
 * bar.md / DIRECTION.md have the full reasoning and generation prompts.
 *
 * State A (cool grey marble) and State B (warmed cream marble, same pose/
 * framing/camera) are reference-conditioned edits of each other (Flux
 * Kontext, Higgsfield) verified pixel-aligned outside the mouth region
 * (0.09% structural drift, measured — see STATUS.md) before either was
 * accepted. Background removed via Higgsfield's own remover, palette-matched
 * (saturation pulled toward the site's actual cream/navy tokens — the raw
 * generations ran warmer/cooler than the tokens call for), then flattened
 * onto solid --color-navy rather than shipped as transparent PNGs — the two
 * states don't share a native aspect ratio, and stacking them live with
 * alpha transparency let the base layer bleed through the top layer's soft
 * cutout edge (found on the built hero, fixed at export time instead of
 * fighting it in CSS). Raw pre-crop generations and prompts are in
 * _raw-photos/higgsfield/ (gitignored).
 */
export const sculptureImages = {
  stateA: {
    src: "/images/sculpture-state-a.avif",
    alt: "A classical marble bust, cool grey stone, in profile",
    width: 1600,
    height: 1073,
    use: "Hero, top layer. Cold state — scrolls/fades away to reveal stateB underneath.",
  },
  stateB: {
    src: "/images/sculpture-state-b.avif",
    alt: "The same classical marble bust warmed to cream stone with a soft, alive smile",
    width: 1184,
    height: 880,
    use: "Hero, base layer and priority LCP image. Warm state — always what a no-JS or reduced-motion visitor sees.",
  },
} as const satisfies Record<string, PracticeImage>;

/**
 * NOT AVAILABLE — do not build sections that depend on these:
 *
 * - Before/after smile gallery. The practice's before/afters carry a PicCollage
 *   watermark burned into the pixels, have inconsistent lighting and angle
 *   between the pair, and have no documented patient consent for web use.
 *   The smile gallery is deferred past launch (PLAN.md).
 *
 * - Operatory/treatment room shots. Several exist but contain identifiable
 *   patients. Consent for a Facebook post is not consent for the website.
 *   Excluded until Kalob confirms releases.
 *
 * - Photos of the in-house lab, the Solea laser, and the RAYFace scanner.
 *   These are the practice's three strongest differentiators and none of them
 *   have a photo. Top of the reshoot list (NEXT-STEPS.md §3).
 */

# Park Place Dental — Design System

Reference DNA: `impilo.health`. We are borrowing its **structure and motion grammar**, not its look. Nothing violet, nothing SaaS-blue, no dashboard screenshots.

---

## 1. What actually makes Impilo feel good

Deconstructed, so we can rebuild it deliberately instead of vibes-copying:

| Ingredient | What it does | Our version |
|---|---|---|
| Preloader with counting numerals `00 → 100` | Buys time for fonts/video, sets a "precision" tone | Same, counts to 100, then a curtain wipe reveals hero |
| Hero headline with a **rotating word** ("manageable." / "powerful.") | One line does the work of three | "Dentistry that feels **calm.** / **modern.** / **close to home.**" |
| **Split-line text reveals** on every heading | Makes scrolling feel authored | Same, `clip-path` + y-translate, 40ms stagger |
| **Odometer digits** for stats | Numbers feel earned, not claimed | Years serving Booneville, patients, same-day slots |
| Infinite **"KEEP SCROLLING" marquee** | Cheap, confident, fills dead space | Marquee of service names |
| Buttons with **duplicated labels** that slide on hover | Tiny, premium, everyone notices | Same primitive, one component |
| **Pinned numbered steps** `01. 02. 03. 04.` | Turns a boring process into the spine of the page | "Your first visit, start to finish" |
| **Section-level color inversion** on scroll | Page feels like chapters | Ivory → Deep Green → Ivory |
| Generous negative space + oversized type | Reads as expensive | Same, harder |

**The trap to avoid:** Impilo is B2B infrastructure. We are a local dental practice in a town of ~8,600. Every motion flourish has to survive the question *"does this make a nervous 45-year-old in Prentiss County more likely to call?"* If it doesn't, cut it.

---

## 2. Brand direction

Logo exists; palette and type are open. **Sample the logo first** and reconcile — everything below is the proposal, not the law.

### The idea
"Park Place" earns green honestly — parks, calm, and the Monopoly-blue-chip association of *the premium property on the board*. So: **deep evergreen + warm ivory + brass**. Confident, warm, adult. Zero resemblance to the cyan-gradient-and-stock-smile template every other dental site in Mississippi uses.

### Color tokens

```css
/* Tailwind v4 — app/globals.css */
@theme {
  /* Core */
  --color-ink:        #0F1A15;  /* near-black green. body text, dark sections */
  --color-pine:       #14372A;  /* primary brand. dark section bg */
  --color-park:       #1F6B4E;  /* primary action green */
  --color-park-lift:  #2A8A64;  /* hover state */
  --color-sage:       #C7D8CE;  /* muted accents, dividers on dark */

  /* Surfaces */
  --color-ivory:      #F7F4ED;  /* default page bg — NOT pure white */
  --color-bone:       #EDE7DA;  /* alternating band */
  --color-white:      #FFFFFF;  /* cards only */

  /* Accent — use sparingly, <5% of any viewport */
  --color-brass:      #C08A3E;
  --color-brass-lift: #D8A257;

  /* Feedback */
  --color-danger:     #A33A2B;  /* emergency / urgent CTA only */
  --color-focus:      #2A8A64;
}
```

**Ratios:** 60% ivory/bone · 25% pine/ink · 10% park · 5% brass. Emergency-dental CTA is the only place `--color-danger` appears.

**Contrast, non-negotiable:** every pairing below must clear WCAG AA (4.5:1 body, 3:1 large text). Verified pairs: `ink on ivory` (14.8:1), `ivory on pine` (12.1:1), `white on park` (4.9:1), `brass on pine` (5.2:1). Do not invent new pairs without re-checking.

### Typography

**Primary pairing (recommended):**
- **Display — Fraunces** (variable, Google Fonts). Optical sizing, soft serif warmth. Set `wght 500–700`, `opsz 72`, `SOFT 30`, `WONK 1` at display sizes. Human and premium — the opposite of a clinic.
- **Body / UI — Inter Tight** (variable). Tight enough to sit under a serif without fighting it. `font-variant-numeric: tabular-nums` for all odometers and phone numbers.

**Alternate (if the logo reads more modern/geometric):**
- Display **Bricolage Grotesque** + Body **Inter**. Closer to Impilo's tech energy. Pick one pairing and delete the other from the repo — don't ship both.

Load with `next/font/google`, `display: 'swap'`, subset `latin`, and preload the display face only.

### Type scale (fluid, `clamp()`)

```css
--text-hero:  clamp(3rem,   9vw,  9rem);    /* Fraunces 600, ls -0.03em, lh 0.92 */
--text-d1:    clamp(2.5rem, 6vw,  5.5rem);  /* section headlines */
--text-d2:    clamp(2rem,   4vw,  3.5rem);
--text-h3:    clamp(1.5rem, 2.5vw, 2rem);
--text-lead:  clamp(1.125rem, 1.6vw, 1.375rem); /* Inter Tight 400, lh 1.5 */
--text-body:  1.0625rem;   /* 17px — this is a practice serving older patients. Not 14px. */
--text-small: 0.9375rem;
--text-eyebrow: 0.8125rem;  /* uppercase, ls 0.12em, Inter Tight 500 */
```

Max measure for prose: `68ch`. Headlines: `18ch`.

### Spacing & layout

8px base grid. Section rhythm: `clamp(6rem, 12vw, 12rem)` vertical padding.

Grid: 12-col, `max-width: 1440px`, gutters `clamp(1.25rem, 5vw, 6rem)`. Radii: `--radius-sm: 8px`, `--radius-md: 16px`, `--radius-lg: 28px`, pills `9999px`. Elevation: one soft shadow only — `0 2px 24px -8px rgb(15 26 21 / 0.18)`. No stacked shadow scale.

---

## 3. Motion system

**Tokens:**

```css
--ease-out-expo:  cubic-bezier(0.16, 1, 0.30, 1);   /* default reveal */
--ease-in-out:    cubic-bezier(0.65, 0, 0.35, 1);   /* transforms both ways */
--dur-fast:   200ms;   /* hover, focus */
--dur-base:   650ms;   /* reveals */
--dur-slow:   1100ms;  /* hero, curtain */
--stagger:     60ms;
```

**Rules:**
1. Animate **only** `transform`, `opacity`, `clip-path`, `filter`. Never `top/left/width/height`.
2. Reveals fire **once** (`viewport={{ once: true, margin: '-15% 0px' }}`). Nothing re-animates on scroll-back — that reads as broken, not delightful.
3. Nothing important is gated behind motion. All content is in the DOM and readable with JS disabled.
4. **`prefers-reduced-motion: reduce` disables everything** — preloader skips instantly, marquees freeze, odometers show final value, reveals become plain opacity fades at 150ms. This is a healthcare site; treat it as a requirement, not a courtesy.
5. Total home-page motion budget: main thread stays under 50ms long-task on a mid-tier Android.

**The nine primitives** (build once, use everywhere — same names in code):

| Component | Behavior |
|---|---|
| `<Preloader>` | Counts `00→100`, tabular nums, then two-panel curtain wipes up. Max 1400ms hard timeout regardless of load state. Session-storage flag so it fires once per session, not on every route change. |
| `<SplitReveal>` | Splits heading into lines; each line `translateY(105%) → 0` inside `overflow:hidden`, staggered. Accepts `as` prop for semantic tag. |
| `<WordRotator>` | Cycles an array of words in the hero, 2.2s hold, y-slide swap. Pauses on `reduce`. |
| `<Odometer>` | Digit columns roll to a target number when in view. `tabular-nums`. Supports prefix/suffix (`+`, `%`, `yrs`). |
| `<Marquee>` | Seamless infinite ticker, CSS-only via duplicated track. `speed` and `direction` props. Pauses on hover. |
| `<SwapButton>` | Two stacked copies of the label in an `overflow:hidden` box; on hover/focus both slide up one line-height. Focus-visible triggers it too. Variants: `primary` (park), `ghost` (outlined), `danger` (emergency). |
| `<StickySteps>` | `position: sticky` numbered panels `01–04`. Left column pins the number + short label, right column scrolls the detail. Collapses to a plain stacked list under `md`. |
| `<RevealImage>` | `clip-path: inset(100% 0 0 0) → inset(0)` with a slight `scale(1.08) → 1` on the inner img. |
| `<ThemeSection>` | Wrapper that sets `data-theme="dark|light"` and transitions bg/text color over 600ms as it enters. Nav logo/link colors read the same attribute and invert. |

Optional, only if it earns its keep: a subtle magnetic hover on the primary CTA. Skip the custom cursor entirely — it hurts on touch and reads as agency showboating on a dental site.

---

## 4. Page architecture

### Home — section order (this *is* the Impilo flow, retargeted)

1. **Preloader** → curtain
2. **Hero** — `<SplitReveal>` headline + `<WordRotator>`, one-line subhead, `<SwapButton>` "Request an Appointment" + secondary "Call (662) XXX-XXXX" (tel: link, always visible on mobile). Ambient background: soft-focus loop of light moving through the actual office. No stock.
3. **Trust strip** — `<Marquee>` of services, or a quiet row: years in Booneville · insurances accepted · same-day emergency
4. **"Allowing you to focus on…" analogue** — one large calm statement + `KEEP SCROLLING` ticker
5. **`<StickySteps>` — "Your first visit, start to finish" `01–04`**: Book in under a minute → What we do at your first exam → Your plan and what it costs, before we start → Ongoing care that fits your schedule. *This is the highest-converting section on the page. It kills the two real objections: "will it hurt" and "what will it cost."*
6. **Services grid** — 6 cards with `<RevealImage>`: General & Preventive · Cosmetic · Restorative · Emergency · Children's · Implants & Whitening
7. **`<Odometer>` stat band** on `pine` — years serving Prentiss County, patients cared for, average review rating, same-day emergency slots
8. **Meet the team** — real photography, warm, `<RevealImage>` on hover
9. **Reviews** — real Google reviews, name + first initial. Pull statically at build; do not embed a third-party widget (it will wreck LCP and leak trackers).
10. **Smile gallery teaser** — before/after slider, practice's own photos, consent on file
11. **Insurance & payment** — logos + "we'll check your benefits before you sit down"
12. **Location** — map, hours, parking note, "serving Booneville, Baldwyn, Rienzi, Jumpertown, New Site, Blue Mountain"
13. **Big CTA footer** — full-bleed `pine`, oversized `<SplitReveal>`, `<SwapButton>`

### Routes

```
/                          /services            /services/[slug]
/about                     /team/[slug]
/new-patients              /new-patients/insurance-and-payment
/smile-gallery             /contact
/emergency-dentist         /dentist-in-[town]   (service-area pages)
/blog  /blog/[slug]        (phase 2 — don't build it if no one will write it)
```

---

## 5. Non-negotiables for a dental site

These are the ones that get skipped and then cost money:

- **No PHI in any form.** Appointment request collects name, phone, email, preferred window, and a *general* reason dropdown. Add a visible line: "Please don't include medical details here — we'll take those by phone." Standard contact forms are not HIPAA-compliant transport and you don't want to be the custodian.
- **Phone number is the primary conversion**, not the form. Sticky `tel:` button on mobile, click-tracked.
- **WCAG 2.2 AA is a legal exposure item**, not a nice-to-have. Healthcare sites are a standing ADA Title III target. Keyboard-complete, visible focus rings (`--color-focus`, 2px offset), real `<button>`/`<a>`, alt text on everything meaningful, no motion trap.
- **`Dentist` schema.org JSON-LD** with exact NAP matching Google Business Profile character-for-character. `openingHoursSpecification`, `areaServed`, `hasMap`, `aggregateRating` only if genuinely sourced.
- **Performance budget:** LCP < 2.0s and CLS < 0.05 on 4G/mid-tier Android. Hero video ≤ 1.5MB, `poster` always set, `preload="none"` below the fold. If the preloader and the hero video together blow the budget, the video loses.
- **No AI-generated people.** Ever. Not the dentist, not staff, not patients, not before/afters. That's a trust and (for before/afters) advertising-claims problem. AI is for texture and ambience only — see the workflow doc.

---

## 6. Definition of done for any section

- [ ] Renders correctly with JS disabled
- [ ] Keyboard-navigable, focus visible
- [ ] `prefers-reduced-motion` path tested
- [ ] 360px, 768px, 1280px, 1920px all clean
- [ ] Contrast checked against the verified pairs
- [ ] No layout shift on font swap or image load
- [ ] Text is real copy, not lorem — placeholder copy hides real layout problems

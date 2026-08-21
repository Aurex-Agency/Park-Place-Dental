# Park Place Dental — Design System

Reference DNA: `impilo.health`. We are borrowing its **structure and motion grammar**, not its look. Nothing violet, no bright SaaS-gradient blue, no dashboard screenshots. (Our navy is deep and warm, not a SaaS gradient.)

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
| **Section-level color inversion** on scroll | Page feels like chapters | Cream → Deep Navy → Cream |
| Generous negative space + oversized type | Reads as expensive | Same, harder |

**The trap to avoid:** Impilo is B2B infrastructure. We are a local dental practice in a town of ~8,600. Every motion flourish has to survive the question *"does this make a nervous 45-year-old in Prentiss County more likely to call?"* If it doesn't, cut it.

---

## 2. Brand direction

Palette resolved against the practice's real assets (PLAN.md §2, NEXT-STEPS.md §1) — this supersedes the rose-gold proposal below wherever the two conflict. The web logo is gold; the polo embroidery and the building's brick are a separate, redder hue used only for the emergency CTA. See STATUS.md's palette-and-content section for the full reasoning.

### The idea
Deep navy reads as competent and calm without reading as cold or clinical — the opposite of a sterile white dental office. Warm cream keeps it from tipping into corporate/financial-institution territory, and the practice's own gold gives it the warmth and specificity that a plain navy-and-white site lacks: **deep navy + warm cream + gold**, with brick red reserved entirely for emergency. Confident, warm, adult. Zero resemblance to the cyan-gradient-and-stock-smile template every other dental site in Mississippi uses.

### Color tokens

```css
/* Tailwind v4 — app/globals.css */
@theme {
  /* Core */
  --color-ink:        #0B1220;  /* near-black navy. body text, dark sections */
  --color-navy:        #16233F;  /* primary brand. dark section bg */
  --color-navy-mid:    #2E4E86;  /* primary action blue */
  --color-navy-lift:   #3E64A3;  /* hover state */
  --color-mist:        #C7D2E0;  /* muted accents, dividers on dark */

  /* Surfaces */
  --color-cream:      #F8F3EA;  /* default page bg — NOT pure white */
  --color-sand:       #EFE4D2;  /* alternating band */
  --color-white:      #FFFFFF;  /* cards only */

  /* Brand accent — the practice's real logo gold. TODO(kalob): resample
     from the logo file — read off a screenshot, not sampled from the art. */
  --color-gold:       #A28D74;
  --color-gold-lift:  #B09B82;

  /* Emergency only — the building's brick, and the single place red
     appears as a solid fill anywhere on the site. */
  --color-brick:      #9B3A34;

  --color-focus:      #3E64A3;
}
```

**Ratios:** 60% cream/sand · 25% navy/ink · 10% navy-mid · 5% gold. Emergency CTAs are the only place `--color-brick` appears.

**Contrast, non-negotiable:** every pairing must clear WCAG AA (4.5:1 body, 3:1 large text) *except* gold on light surfaces, which is a fill/mark color there, never text (see below). Verified pairs (computed, see `/dev/tokens`, which flags any pair under its required minimum with an explicit warning): `ink on cream` (16.94:1), `cream on navy` (14.11:1), `ink on gold` (5.88:1, primary CTA fill), `gold on navy` (4.90:1, accent text on dark — clears normal-text AA), `white on brick` (6.89:1, emergency CTA text), `brick on cream` (6.23:1, emergency nav link text). `gold on cream` is 2.88:1 — fails even the 3:1 large-text minimum, worse on sand or white. This isn't just a note: CLAUDE.md's Design hard rules make it enforceable — `gold`/`gold-lift` are never used as text on `cream`, `sand`, or `white`, at any size, full stop. Gold on `navy` is the one place gold can be text.

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

Grid: 12-col, `max-width: 1440px`, gutters `clamp(1.25rem, 5vw, 6rem)`. Radii: `--radius-sm: 8px`, `--radius-md: 16px`, `--radius-lg: 28px`, pills `9999px`. Elevation: one soft shadow only — `0 2px 24px -8px rgb(11 18 32 / 0.18)`. No stacked shadow scale.

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
| `<SwapButton>` | Two stacked copies of the label in an `overflow:hidden` box; on hover/focus both slide up one line-height. Focus-visible triggers it too. Variants: `primary` (gold fill, ink text), `ghost` (outlined), `danger` (brick fill, white text — emergency only). |
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
7. **`<Odometer>` stat band** on `navy` — years serving Prentiss County, patients cared for, average review rating, same-day emergency slots
8. **Meet the team** — real photography, warm, `<RevealImage>` on hover
9. **Reviews** — real Google reviews, name + first initial. Pull statically at build; do not embed a third-party widget (it will wreck LCP and leak trackers).
10. **Smile gallery teaser** — before/after slider, practice's own photos, consent on file
11. **Insurance & payment** — logos + "we'll check your benefits before you sit down"
12. **Location** — map, hours, parking note, "serving Booneville, Baldwyn, Rienzi, Jumpertown, New Site, Blue Mountain"
13. **Big CTA footer** — full-bleed `navy`, oversized `<SplitReveal>`, `<SwapButton>`

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
- **Performance budget:** LCP < 2.5s and CLS < 0.05 on 4G/mid-tier Android (see CLAUDE.md rule #14 and STATUS.md's performance investigation for how 2.5s was set). Hero video ≤ 1.5MB, `poster` always set, `preload="none"` below the fold. If the preloader and the hero video together blow the budget, the video loses.
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

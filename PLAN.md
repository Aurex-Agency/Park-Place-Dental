# Park Place Dental — Plan & Roadmap

Written after auditing the live site at `parkplace-dental.com`. Supersedes `BRAND-REVISION.md` §2 on palette.

---

## 1. What the live site gave us

### Every open `TODO(kalob)` is now answered

All of this is **practice-stated on their own published site** — strong, but still needs a confirmation pass (especially "accepts" vs "in-network").

**Hours:** Monday–Friday, 8:30 AM – 5:00 PM. Friday hours may vary.

**Dr. Ken Goodwin:**
- BA, University of Mississippi, 1978
- DMD, University of Mississippi School of Dentistry, 1982
- 43+ years in practice
- **Originally from Booneville — returned to his hometown**
- Duck hunting, Ole Miss Rebels, family

**Insurances:** Aetna (Medicare and commercial), Cigna, Delta Dental, Guardian, MetLife, Sunlife, UMR, Always Care / Unum, Equitable, Medicaid and MSCAN Magnolia. CareCredit® for financing.

**Services:** General (cleanings/exams, fillings, root canals, emergency) · Restorative (implants, crowns & bridges, dentures) · Cosmetic (veneers, whitening, smile makeovers) · Periodontal (gum disease) · **Facial aesthetics (Botox, dermal fillers)**

Still open: social links, form endpoint.

### The three facts they're burying

These are the strongest things about this practice and all three are buried below the fold in body copy:

1. **Solea dental laser — "quieter, less anxiety, in many cases little to no need for anesthesia."** This directly answers the number-one reason people avoid the dentist. It is currently paragraph three of a technology section. It should be on the home page above the fold.
2. **In-house dental lab — same-day crowns, veneers, dentures.** A real, ownable differentiator. Nobody else in Prentiss County is doing same-day restorations.
3. **Dr. Goodwin is from Booneville and came home. 43 years.** In a town of 8,600, this is the entire trust story and it's on a third-level page nobody will find.

### Their first-visit copy already writes our highest-converting section

`/new-patients/new-patient-information` is already structured as four steps, and it maps directly onto `StickySteps` 01–04:

1. Personalized, one-on-one attention — the visit starts with a conversation
2. Comprehensive exam and digital imaging
3. Clear, honest treatment planning
4. Comfort and convenience

And from the financing page: *"no surprises, no pressure — just honest guidance."* That is the cost objection answered in their own approved words. Use it.

### Errors and problems

- **"Dr. Kevin Goodwin" on the home page**, "Dr. Ken Goodwin" on the dentist page. The site contradicts itself. Ken is correct.
- **Duplicate section** — "OUR DOCTOR / Expert Care, Trusted Results" appears twice on the home page with different body copy.
- **Hero image is generic stock of a foreign dental operatory.** Not their office. For a practice whose whole advantage is being local and known, this is the worst possible choice.
- **Copy is generic and claim-heavy** — "Transform Your Smile," "Smiles That Shine," "top-rated." Several of these are superlatives that CLAUDE.md rule #9 and state-board advertising rules both prohibit.

### The navigation problem, diagnosed

**37 pages, three levels deep, behind a hamburger menu even on desktop.**

That's the "too confusing" complaint, precisely. To reach veneers you go hamburger → Services → Cosmetic Dentistry → Veneers. Four interactions, three of them hidden. For a 65-year-old that is functionally a dead end.

---

## 2. Palette — gold resolved

The web logo is **gold**. The polo embroidery is red thread. The building is red brick with a white column. All three are real; they just serve different jobs.

```css
@theme {
  /* Structure */
  --color-ink:        #0B1220;
  --color-navy:       #16233F;   /* dark sections */
  --color-navy-mid:   #2E4E86;
  --color-mist:       #C7D2E0;

  /* Surfaces */
  --color-cream:      #F8F3EA;   /* default page bg */
  --color-sand:       #EFE4D2;
  --color-white:      #FFFFFF;

  /* Brand accent — gold. TODO(kalob): resample from vector logo */
  --color-gold:       #A28D74;
  --color-gold-lift:  #B09B82;

  /* Emergency only — the building's brick */
  --color-brick:      #9B3A34;

  --color-focus:      #2E4E86;
}
```

**This solves the collision cleanly.** Gold is the brand accent. Brick red is reserved for the emergency CTA and appears nowhere else. Different hue, different value, no ambiguity. `--color-rose`, `--color-rose-lift`, and `--color-danger` are all deleted.

### Gold contrast rules — non-negotiable

Gold on cream is roughly **2.8:1**. It fails AA for text and it will be tempting to use anyway.

- **Gold is a fill and mark color, not a text color on light backgrounds.**
- Gold fill + ink text = high contrast, use this for primary CTAs
- Gold text on navy ≈ 5.1:1 — passes, allowed
- Gold text on cream — **never**, at any size
- Gold hairlines, rules, and column motifs on cream — fine, decorative only

Verify all of it at `/dev/tokens` before shipping. Update CLAUDE.md rule #6 to name gold instead of rose.

---

## 3. Navigation — the fix

**Five top-level items. Two levels maximum. No hamburger above 1024px.**

**Where this actually stands (2026-08-21):** the shipped nav lands at a custom `min-[1120px]:` breakpoint, not 1024px. History: moved `lg`(1024px) → `xl`(1280px) → `1400px` across three gates, each time by raising the threshold instead of cutting content — exactly the "hidden behind a hamburger" pattern this section exists to kill. That stopped: two real content cuts (CTA label "Request an Appointment" → "Request a Visit", logo dropped from `text-h3` to `text-lead`) plus two layout levers (Nav gets its own fixed `--nav-gutter: 1.5rem`, not the body-prose `--spacing-gutter` that scales to 6rem; nav-link horizontal padding trimmed to the smallest step, height still carries the 44px target) recovered real width, then the actual fit threshold was measured empirically, not calculated: exactly 0px margin at 1078px, stable at the full 24px `--nav-gutter` margin from 1120px on. 1120px is that stable point — a measured property of the layout, not a rounded-up guess. It clears the hard requirement (full nav at 1280px and up) with margin to spare and gets meaningfully closer to the 1024px stretch goal than the 1400px it replaced, but doesn't reach it. Full per-element width breakdown in STATUS.md's Gate 3 correction if 1024px needs revisiting later — closing the remaining ~54px means cutting the Emergency pill, the phone pill's treatment, a nav link label, or `SwapButton`'s base padding, none of which were touched here since Gate 1's phone/Emergency decisions still stand.

```
Services ▾          New Patients ▾      About ▾         Smile Gallery    Contact
  General             First Visit         Dr. Goodwin
  Cosmetic            Insurance & Cost    Our Team
  Restorative         Patient Forms       Technology
  Implants & Dentures
  Gum Health
  Facial Aesthetics
  ── Dental Emergency? ──
```

Plus, always visible and never inside a menu: **the phone number** and **Request a Visit**.

37 pages collapse to about 16. Everything currently on a third level either merges upward into its parent or becomes an anchor section on that page. Cleanings, exams, and fillings do not need individual pages — they need to be sections of `/services/general`.

Emergency gets its own visually distinct entry at the bottom of the Services menu, in brick red. It's the highest-intent path on the site.

---

## 4. Easy at 65, fun at 25

These are not in tension, and the reason matters: **what breaks a site for older users is hidden navigation, small text, low contrast, and motion you have to wait through. What delights younger users is polish, speed, and responsiveness.** Those don't overlap. Build for the 65-year-old structurally and the 25-year-old in the finish.

**Structural — for the 65-year-old:**
- Body text 17px desktop / 18px mobile. Never 14px, anywhere.
- Touch targets minimum 48×48px with 8px spacing
- Nav never hidden on desktop; max two levels
- Phone number visible on every screen, tap-to-call, never behind a menu
- Every contrast pair clears AA; no gray-on-gray
- Buttons look like buttons — filled, labeled with verbs, never icon-only
- One column on mobile, no horizontal scroll, no carousels that auto-advance
- Forms: large fields, visible labels above inputs (not placeholders), errors in plain words

**Finish — for the 25-year-old:**
- Motion is never blocking. Content is readable before animation completes, always.
- Overshoot easing on hovers — `cubic-bezier(0.34, 1.56, 0.64, 1)`
- The column drawing itself in the preloader
- `SwapButton` label slide, `Odometer` stat rolls, `Marquee` ticker
- Fast. A page that paints in 1.2s reads as premium to a 25-year-old and as "it works" to a 65-year-old.

**The test:** every animation must be skippable by scrolling past it, and the site must be fully usable with `prefers-reduced-motion: reduce`. If a delight breaks either rule, it's a defect.

---

## 5. Roadmap

Goal: something showable fast, without shipping something wrong.

### Now — in parallel with Phase 2
- [ ] Get the **vector logo** from the practice (gold version). Blocks palette finalization.
- [ ] Confirm the harvested facts with the office — especially in-network vs. accepts-and-files for each insurer, and current Friday hours
- [ ] Book the photographer. Shot list is in `WORKFLOW.md`. This is the longest lead time on the project.
- [ ] Confirm the Solea laser and in-house lab claims so we can lead with them

### Step 1 — Phase 2 completes (nav, drawer, footer, mobile bar)
Build against the IA in §3, not the old 37-page structure.

### Step 2 — Palette PR (small, ~1 session)
Rose → gold, add brick as emergency-only, delete `--color-danger`, update `/dev/tokens`, CLAUDE.md rule #6, DESIGN-SYSTEM.md §2. Recompute every contrast pair.

### Step 3 — Content file (~1 session)
Fill every `TODO(kalob)` in `content/practice.ts` from §1. Write home page copy from the approved source material, stripped of superlatives and claims. **Ken, never Kevin.**

### Step 4 — Phase 3a: the showable home page ← *this is the client demo*
Hero → trust strip → `StickySteps` first-visit → services grid → stats → CTA footer. Placeholder gray boxes where photos go.

Lead with what they're burying:
- Hero addresses comfort and cost, not "transform your smile"
- Solea laser gets prominent placement
- Same-day / in-house lab in the trust strip
- "43 years. Booneville born." near the top

**Show them this on a Vercel preview.** It's enough to sell the direction and it does not depend on photography.

### Step 5 — Hero probe + Higgsfield
Run the feasibility probe against the real hero. Then generate per `HIGGSFIELD-BRIEF.md`, palette line updated to navy / cream / gold / brick.

### Step 6 — Phase 3b: remaining home sections
Team, reviews, insurance, location. Real photos land here.

### Step 7 — Phase 4: interior pages
About, Services (6), New Patients, Contact, Emergency, service-area pages.

### Step 8 — Phase 5/6: forms, schema, SEO, a11y and performance hardening, 301s from the old URLs

### Gates that don't move
- Photography before the team and gallery sections ship
- Consent on file before any before/after appears
- LCP under 2.5s before launch
- `pnpm build && pnpm lint && pnpm test:a11y` green at every phase

---

## 6. Risks

**Photography is the critical path.** Everything else can proceed with placeholders; the team and gallery sections cannot ship without it. Book it this week.

**The copy needs a claims pass.** Their current site says "top-rated," "flawless," "transform." CLAUDE.md rule #9 and state-board advertising rules both prohibit that language. Rewriting it is a small job, but it needs to happen deliberately rather than by copy-paste.

**Before/afters are not usable as they stand.** PicCollage watermarks, inconsistent lighting and angles between shots, and no documented consent. Ship without a smile gallery and add it in month two rather than delay launch or take the exposure.

**We're inheriting facts, not verifying them.** Everything in §1 came off their own website, which already contains at least one factual error about their own dentist's name. Confirm before publishing.

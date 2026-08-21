# Next Steps — Everything To Do

Written after auditing all 20 Drive assets. Two blockers from `PLAN.md` are now dead: you have the logo, and you have enough photography to ship a client demo.

---

## 1. The logo — you already have it

`747625721_1682859780509791_...jpg` in the Drive is the full logo: **two mirrored Ionic capitals framing "PARK PLACE / DENTAL"** in a serif, flat gold artwork on pure white. Clean edges, no compression damage.

Gold reads as a **muted antique gold / warm taupe**, roughly `#A28D74`, lighter passages near `#B09B82`. Softer and more desaturated than a typical brass. Sample it properly rather than trusting my read off a screen.

### Do this (30–60 min)

- [ ] Download the file
- [ ] Sample 3–4 points across the flat fills with a color picker → average → that's `--color-gold`
- [ ] Knock out the white background. It's flat art on pure white, so a magic-wand or select-by-color does it in one pass.
- [ ] Export `logo-gold.png` at 2x the largest size it'll appear (nav is ~180px wide → export 400px)
- [ ] Export a white/cream version for use on navy sections
- [ ] Drop both in `public/brand/`

### The column motif assets (1–2 hrs, do before Phase 3b)

The `<LineDraw>` primitive and the column motifs need vector paths. The art is simple geometry, so tracing is straightforward — and since the logo is AI-generated, there's no original to be unfaithful to.

- [ ] Trace to SVG — Inkscape's Trace Bitmap (free), Illustrator Image Trace, or vectorizer.ai
- [ ] Clean up the traced paths by hand; the volute spiral will need the most attention
- [ ] Export as separate files: `logo.svg`, `volute.svg` (single spiral), `fluting.svg` (the vertical bars)
- [ ] Keep them as single-weight strokes, not filled shapes — `<LineDraw>` animates `stroke-dashoffset` and needs strokes

Getting a real vector later is a nice-to-have, not a blocker. A hand-traced SVG of simple geometric art is functionally identical.

---

## 2. Photo audit — what you have

### Ship-ready now

| File | What it is | Use |
|---|---|---|
| `735193446` | **Five team members in red shirts outside the brick building, white column visible** | Your single best asset. Hero or trust strip. It shows the team, the building, and the column in one frame. |
| `772109688` | Dr. Goodwin portrait, cream backdrop, logo polo, warm genuine smile | About / Meet the Dentist. Genuinely good — clean background, good light. |
| `466734006` | Full team indoors, six people, Dr. Goodwin centre | Team section |
| `489959004` | Team group against brick wall | Team section alternate |
| `736931714` | Woman in black scrubs, seated, office background | Individual team portrait |
| `764953662` | Reception area with staff | "Our office" section |
| `483525842` | Dr. Goodwin working, blue scrubs | Services / technology section |

### Small supporting use only

`768083981`, `487312370`, `481343415`, `482057286` — casual snapshots with cluttered backgrounds. Fine at thumbnail scale, will not hold up large.

### Do not use

- `489789343`, `489454088`, `490226786` — before/after collages. **PicCollage watermark**, inconsistent lighting and angle between shots, no documented consent. Not fixable by editing.
- **Anything showing an identifiable patient** — `482011154` (child in the chair), `481790060`, `481273466`, `481319228`, `466750399`. Facebook consent is not website consent; it's a separate use. Either get written consent or crop so no face is identifiable.

### Prep pass (2–3 hrs)

- [ ] Download the ship-ready set
- [ ] **Colour-correct.** White balance is all over the place — the indoor shots run heavily yellow. Pull them toward the cream/navy palette so the page doesn't look like a scrapbook.
- [ ] Crop to consistent ratios: 3:2 for landscape, 4:5 for portraits, 16:9 for any wide band
- [ ] Export AVIF + WebP, longest edge 2400px
- [ ] Rename semantically: `team-exterior.avif`, `dr-goodwin-portrait.avif`, `team-indoor.avif`, `reception.avif`
- [ ] Drop in `public/images/`

---

## 3. Your reshoot list — for when you go

You're the photographer, so this is yours. Half a day on site.

**Priority — these are the gaps you can't fill from what exists:**
- [ ] Exterior, golden hour, the column clean and prominent. This is the hero shot and also their Google Business Profile image.
- [ ] The column itself — tight, architectural, light raking across it. This feeds the hero ambient and the motif work.
- [ ] Each team member, identical setup and crop, so the grid is consistent
- [ ] Reception, a treatment room, and the sterilization area — **empty, no patients**. Anxious people read visible cleanliness as competence and nobody else in the county shows it.
- [ ] The in-house lab. It's the differentiator and there's no photo of it.
- [ ] Solea laser and RAYFace scanner — the equipment that lets you make the comfort claim

**Nice to have:**
- [ ] Dr. Goodwin candid, in the room, working
- [ ] Detail shots: hands, light, texture, brick
- [ ] Vertical 9:16 crops of the best five for Google Business Profile and social

**Settings:** shoot 3:2 and 4:5 and crop later. Turn off the overhead fluorescents where you can and use window light — that's what's wrong with the current interiors. Consistent white balance across the whole shoot matters more than any single frame.

**Before/afters:** start a properly consented set — same angle, same lighting, same retraction, signed release on file. Until that exists, no smile gallery. Ship without it and add in month two.

---

## 4. Sequence

### This week — parallel to Phase 2 running in the CLI
1. Logo extraction + gold sampling (§1)
2. Photo prep pass (§2)
3. Confirm with the office: in-network vs. accepts-and-files per insurer, current Friday hours, Solea and in-house lab claims

### Then, in order

**Step 1 — Phase 2 merges.** Nav built against the 5-item IA in `PLAN.md` §3, not the old 37-page tree.

**Step 2 — Palette PR** (~1 session)
Rose → gold using your sampled hex. Brick red becomes emergency-only. Delete `--color-danger`. Update `/dev/tokens`, CLAUDE.md rule #6, DESIGN-SYSTEM.md §2. Recompute every contrast pair — gold on cream will fail, and the rules for that are already written in `PLAN.md` §2.

**Step 3 — Content file** (~1 session)
Fill every `TODO(kalob)` in `content/practice.ts` from `PLAN.md` §1. Write home copy from their approved source, stripped of superlatives. **Ken, never Kevin.**

**Step 4 — Phase 3a: the demo home page** ← *this is what you show them*
Hero → trust strip → first-visit `StickySteps` → services → stats → CTA footer. Real photos from §2. Lead with what they bury: the Solea laser and comfort, same-day in-house lab, "43 years, Booneville born."

Push to a Vercel preview. **This is your client show and it needs nothing you don't already have.**

**Step 5 — Reshoot**, once the layout tells you exactly which frames you need

**Step 6 — Hero probe → Higgsfield**, palette line updated to navy / cream / gold / brick

**Step 7 — Phase 3b** (team, reviews, insurance, location) → **Phase 4** interior pages → **Phase 5/6** forms, schema, SEO, hardening, 301s

---

## 5. What's still genuinely blocked

- **Form endpoint** — needs a decision on where submissions go
- **Social links** — confirm the Facebook and Instagram handles are current
- **Smile gallery** — blocked on consented, consistent before/afters. Deliberately deferred.
- **Insurance wording** — "accepts" vs "in-network" is a real distinction and getting it wrong is a complaint waiting to happen

Everything else can proceed.

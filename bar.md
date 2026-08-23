# bar.md — the standard, extracted

Sources: Synora medical clinic · Ancient Greek Sculptures · Orpheus · Dentist Webflow · Virtual Museum of Ancient Sculpture · LOOM · nixtio.com

These are the mechanisms the references share. Each one is checkable by looking at a screenshot. A critic that cannot verify a line by eye should reject that line, not this document.

---

## M1 — One sculptural object, dramatically lit, occupying 35–55% of the hero frame

Every single reference does this. A marble bust, a kintsugi statue, a bronze mask, an abstract 3D surface. **One object.** Lit from one side with deep falloff into shadow. It is never a scene, never a group, never a candid photograph of people.

**Check:** Is there exactly one dominant object in the hero? Does it occupy roughly a third to a half of the frame? Is it lit, with visible shadow falloff?

## M2 — Dark ground

Five of six heroes sit on near-black, deep navy, or deep blue. Relative luminance below 0.06. The light one (Ancient Greek Sculptures) compensates with a heavy gold display face.

**Check:** Sample the hero background. Is it dark? Does at least half the full-page scroll sit on dark ground?

## M3 — Exactly one accent hue, on no more than two elements per viewport

Gold, yellow, or electric blue. Never two accents. Never an accent used more than twice in one screen.

**Check:** Count distinct saturated hues in a viewport. More than one, or more than two elements carrying it, is a fail.

## M4 — Display type is letterspaced and lives left or lower-left; supporting text is tiny by comparison

Classical references letterspace their display caps (0.05em+). Supporting paragraphs run at roughly 15–25% of display size. The type never centres and never fills the frame — it occupies a corner and lets the object breathe.

**Check:** Is display type left or lower-left? Is there letterspacing? Is body text under a quarter of the display size?

## M5 — Thin geometric hairlines are present and deliberate

Outlined rounded rectangle (LOOM), corner frame line (Orpheus), vertical 01/04 index markers (LOOM), circular scroll button (Ancient Greek Sculptures), rotated micro-label, single rule under a headline. At least two per viewport, stroke 1–2px.

**Check:** Count hairline geometric elements per viewport. Fewer than two is a fail. Any stroke thicker than 2px is a fail.

## M6 — No filled light cards on dark sections

None of these references put white rounded rectangles on a dark ground. Content sits directly on the ground, separated by rules, spacing, or the object itself.

**Check:** Any white or light filled card on a dark section is an automatic fail.

## M7 — Nothing in the hero is a snapshot of a group of people

Zero of six. When people appear (Synora, Dentist Webflow) it is a single subject, shot properly, filling the frame — not a group standing in a row.

**Check:** Does the hero contain a candid group photo? Automatic fail.

---

## What this means for Park Place, stated plainly

**The hero object is the marble Ionic column.**

Their logo is a column capital. Their building has a real white column at the entrance. Every reference above is built around a single dramatically-lit classical object on a dark ground. Park Place already owns that object — it has been sitting in the brief since the beginning.

A photorealistic marble Ionic column, lit from one side with warm gold rim light, falling into deep navy shadow, occupying the right half of the frame. Letterspaced cream display type lower-left. Gold on the CTA and nothing else. Hairline rules and a vertical index marker. Team photographs move below the fold into their own sections where nothing sits on top of them.

That is grand, royal, Greek, and Parthenon-adjacent — and it is genuinely theirs rather than a copy of anything in this list.

---

## Standing constraints these mechanisms must not break

Non-negotiable, and a critic must fail any solution that trades them away:

- WCAG 2.2 AA on every text pair, measured against rendered pixels
- 17px minimum for real content, 44px minimum targets
- Tested reduced-motion and no-JS paths
- LCP under 2500ms on the deployed URL
- No AI-generated people, ever. The column is an object; people are photographed.

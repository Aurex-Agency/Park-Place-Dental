# Brand Revision 01 — Palette, Character, and the Column

Written after reviewing the practice's actual photo assets. Supersedes parts of `DESIGN-SYSTEM.md` §2 and §3.

**Timing: apply after Phase 2 merges, before Phase 3 starts.** Phase 2 is building nav and footer against the current tokens right now — changing them mid-phase creates conflicts for no reason.

---

## 1. What the photos changed

| Finding | Consequence |
|---|---|
| Logo is an Ionic column, and the building has a real white column set in red brick | The mark is a portrait of the place. This becomes the site's signature device. |
| Brand color is brick red (~`#9B3A34`); navy appears nowhere in the practice | Rose gold is out, brick red is in. |
| `--color-danger: #A33A2B` is nearly identical to the brand red | Live conflict — the emergency CTA would be indistinguishable from brand elements. Resolved below. |
| Practice aesthetic is warm, traditional, Southern, family-run | The site should feel like a well-kept older building, not a startup. |
| Team photos are phone snapshots; before/afters are PicCollage-watermarked with inconsistent lighting | Photographer booking stands. Smile gallery deferred until consented, consistent shots exist. |

---

## 2. Palette

Navy stays as the dark section color. Rose gold is removed. Brick red becomes the accent.

```css
@theme {
  --color-ink:        #0B1220;
  --color-navy:       #16233F;
  --color-navy-mid:   #2E4E86;
  --color-navy-lift:  #3E64A3;
  --color-mist:       #C7D2E0;

  --color-cream:      #F8F3EA;
  --color-sand:       #EFE4D2;
  --color-white:      #FFFFFF;

  /* Accent — sampled from the logo. PLACEHOLDER until a clean vector
     logo is sampled; these are read off an embroidered polo. */
  --color-brick:      #9B3A34;  /* TODO(kalob): resample from logo file */
  --color-brick-lift: #B4483F;

  --color-focus:      #3E64A3;
}
```

**`--color-rose` and `--color-rose-lift` are deleted.** They touch `globals.css`, `DESIGN-SYSTEM.md` §2, `/dev/tokens`, and CLAUDE.md rule #6 (which names rose explicitly). All four update together.

### Resolving the emergency-CTA collision

Brand red and emergency red can't be told apart by hue, so distinguish them by **treatment** instead:

> **Brick red is used as line, mark, and large-display text only. The emergency CTA is the single place on the site where red appears as a solid background fill.**

One filled red element per page, and it's always the emergency button. Delete `--color-danger` entirely — it's now redundant.

Rewrite CLAUDE.md rule #6 against `brick` rather than `rose`, and recompute the ratio: verify `brick on cream` and `cream on brick` at `/dev/tokens` before trusting either.

---

## 3. The character system — "prestige with a wink"

The tension to hold: an Ionic column and a serif wordmark are dignified. You want life and personality. The resolution is that **prestige lives in the fixed elements and character lives in the motion.** Nothing cartoon, nothing illustrated-cute — the site is composed like a well-set book and behaves like something alive.

Three rules that keep it from tipping:

1. **Character comes from motion and easing, not from imagery.** An overshoot curve on a hover has more personality than any illustration, and costs nothing in gravitas.
2. **Everything that moves is drawn from the column or the type.** No borrowed visual language. If it isn't derived from the mark, the building, or the letterforms, it doesn't ship.
3. **Restraint is what makes the moments land.** Fun that's everywhere reads as noise. Five delightful moments on the home page beats fifty.

### Where the fun actually lives

| Moment | What happens |
|---|---|
| Preloader | The column **draws itself** — fluting lines rise, the volutes spiral in — while the counter runs 00→100. This is the single strongest first impression available and nobody else has it. |
| Section dividers | Column fluting as a vertical rule motif — thin brick-red lines, unevenly weighted |
| Headline flourishes | A volute-derived scroll or underline that **draws on scroll**, in brick red |
| Buttons | `SwapButton` label slide, plus a slight overshoot ease. Magnetic pull on the primary CTA only. |
| Stats | `Odometer` digits rolling |
| Services | `Marquee` ticker |
| Hover states | Overshoot easing — `cubic-bezier(0.34, 1.56, 0.64, 1)`. This is where "fun" genuinely comes from. |
| Copy | Warm, plainspoken, occasionally funny. The cheapest personality on the site. |
| 404 + children's dentistry | Latitude to be more playful. Contained, where it fits the audience. |

### What does NOT ship

Cartoon teeth. Anthropomorphic anything. Illustrated dental instruments. Bright saturated secondary palettes. Bouncy rounded display type. Confetti. All of it fights the mark and, more importantly, shows an anxious adult the exact objects they're avoiding.

---

## 4. New primitive: `<LineDraw>`

The column motifs need a tenth motion primitive. Add to `components/motion/`:

**`<LineDraw>`** — animates an SVG path's `stroke-dashoffset` from full length to zero when it enters the viewport. Props: `path`, `duration`, `delay`, `strokeWidth`, `color`. Fires once. Under `prefers-reduced-motion`, renders the completed path with no animation.

Build it in the `/dev/primitives` sandbox alongside the other nine, with the actual column-derived paths as demo content.

Source assets needed (vector work, not AI generation):
- Column fluting — a set of vertical rules at varying weights
- Volute spiral — the capital's scroll, isolated
- Building line drawing — the actual storefront with its column, single weight
- One or two rough underline/arrow marks for headline emphasis

---

## 5. What "converting" actually means here

Worth separating, because animation and conversion mostly point at different things.

**Motion that converts** — build these first:
- `StickySteps` walking through "your first visit, start to finish." Fear is the conversion barrier; this is the section that removes it.
- Attention direction toward the phone number — subtle, not a pulsing distraction
- Responsive form micro-feedback so the thing feels alive under your hands
- **Page speed.** A hero that paints in 1.2s converts better than any animation. LCP is currently 3.1s.

**Motion that decorates** — the column draw, flourishes, marquee. Real value in feeling custom and cared-for, which is a trust signal in a town of 8,600. But it's the second job, not the first.

If the two ever conflict, conversion wins. Same logic as CLAUDE.md rule #14.

---

## 6. Revised Higgsfield direction

The original brief pointed at generic "calm ambience." Now it can point at something specific to them.

**Hero ambient loop concepts:**

```
Warm late-afternoon light moving very slowly across a white classical column
against red brick. Shallow depth of field, abstract macro framing, no full
building visible. Deep shadow in the lower third. Static camera, no movement,
no cuts. 8 second seamless loop.
```

```
Soft warm light raking slowly across aged red brick. Extremely shallow depth
of field, most of the frame out of focus. Cream and warm terracotta tones.
Static camera. Calm, premium, architectural. 8 second seamless loop.
```

```
Very slow drift of warm light across smooth white fluted stone. Abstract,
macro, no recognizable object. Cream and sand tones with deep navy shadow.
Static camera. 8 second seamless loop.
```

Constraint block, palette line updated: *deep navy, warm cream, sand beige, and muted brick red.* All other prohibitions from `HIGGSFIELD-BRIEF.md` stand — no people, no equipment, no teeth, no text, no camera movement.

Everything else in `HIGGSFIELD-BRIEF.md` (gates, encoding, scrim, acceptance criteria) is unchanged.

---

## 7. Sequence

1. Phase 2 merges — don't touch tokens before this
2. **Palette PR:** swap rose → brick, delete `--color-danger`, update `/dev/tokens`, CLAUDE.md rule #6, DESIGN-SYSTEM.md §2, recompute contrast
3. Get a clean vector logo from the practice and resample `--color-brick` properly
4. Commission the column-derived SVG assets
5. Build `<LineDraw>` into the primitives sandbox
6. Phase 3 hero → hero probe → Higgsfield generation

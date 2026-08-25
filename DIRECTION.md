# Direction — Single Source of Truth

**This supersedes conflicting guidance in `DESIGN-SYSTEM.md`, `BRAND-REVISION.md`, and `PLAN.md` wherever they disagree.** Written after studying both reference sites properly. If an older doc contradicts this, this wins.

---

## 1. What the two references actually do

### impilo.health — the FLOW
Preloader counting to 100. Scroll-authored reveals. Word rotator. Odometer digits. Marquee ticker. Pinned numbered steps. **This is where our nine motion primitives came from and that part is right.** Keep it.

### meuze.ai — the LOOK, and this is what's been missing
- **The hero is an ILLUSTRATION, not a photograph.** A detailed pen-and-stipple drawing of the client's actual environment — their counter, their menu boards, their crew — rendered near-white on near-black, filling the entire frame.
- **Near-black ground.** Deep, atmospheric, immersive.
- **The type is SMALL.** Restrained sans, maybe 40px. It sits quietly in the lower-left of an enormous illustrated space.
- **One bright accent** (electric blue) on the CTA. Nothing else is bright.
- **Content sections are diagrammatic** — small animated data widgets, counters, schedule bars. Not text cards on white.

**The drama comes from the environment and the darkness, not from the typography.**

---

## 2. The diagnosis of what we built

Everything we've shipped fights this:

| We built | Meuze does |
|---|---|
| Cream as the default page ground | Near-black ground |
| Enormous Fraunces display type | Small restrained sans |
| A photograph fighting a scrim | An illustration that IS the environment |
| White cards on cream | Diagrammatic panels on dark |
| Type carries the drama | The environment carries the drama |

The white-cards-on-cream services grid and the giant serif headline are the two things reading as "SaaS template," and they're both downstream of one decision: **we made a light site.** Meuze is a dark site.

---

## 3. The direction

### The signature asset: an illustrated Park Place Dental

**Commission/generate a detailed pen-and-stipple illustration of the practice** — the brick building with its white ionic column, or the interior looking toward reception. Rendered in **cream line and stipple on deep navy**.

This is the single highest-value asset on the project. It:
- Is unmistakably *their* building, so it does the trust job in a town of 8,600
- Cannot be a stock template — nobody else has it
- Solves the contrast problem permanently: line art on dark means we control every pixel
- Is exactly what Higgsfield is for
- Echoes the logo, which is already line art of a column

Real photographs of the team live **below** the hero, in their own sections, where nothing sits on top of them.

### Ground: this becomes a dark site

- **Deep navy `#16233F` / ink `#0B1220` is the primary surface.** Hero, services, stats, CTA footer.
- **Cream `#F8F3EA` is for reading sections only** — the first-visit steps, insurance, location. Where someone sits and reads.
- Roughly 60% dark, 40% light, dark dominating the top of the page.

### Type: smaller and quieter

`--text-hero` at 9vw was the wrong instinct. Meuze's headline is small. **Cap display type around `--text-d2`** and let the environment carry the weight. This also permanently kills the wrapping and orphan problems we've been fighting.

Fraunces stays for display, but does less. Inter Tight does more.

### The accent

Meuze uses one bright colour on one element. Ours is **gold on the primary CTA** — ink text on gold fill. Brick red stays emergency-only. Nothing else is bright.

### Sections become diagrammatic, not cards

Kill the white rounded cards. On a dark ground, sections are:
- Hairline-ruled panels, not filled boxes
- Small animated indicators — the Odometer, a drawn rule, a state that changes on scroll
- Content sitting directly on the illustrated/textured ground, separated by rules rather than containers

---

## 4. What this changes in the build

| Element | Now |
|---|---|
| Page ground | Navy default, cream for reading sections |
| Hero | Illustrated building, full-bleed, small type lower-left |
| Hero photo | Removed. Team photo moves to its own section below. |
| Display type | Capped at `--text-d2`. No 9vw. |
| Services | Hairline panels on dark, not white cards |
| Nav | Solid navy, cream text, gold CTA |
| Accent | Gold CTA only. Brick emergency only. |

---

## 5. Assets to generate — priority order

1. **Hero illustration** — the building with the column, cream stipple on navy. Landscape, 2560px. *This is the one that matters.*
2. **Interior illustration** — looking toward reception, same technique. For a secondary full-bleed moment.
3. **Column detail** — the ionic capital, same technique, for section dividers and the CTA footer.
4. Four abstract texture stills for panel backgrounds if still needed after 1–3 land.

Prompts are in `HIGGSFIELD-GENERATE-NOW.md`, updated for this direction.

---

## 6. What does NOT change

These are settled and stay settled:

- WCAG 2.2 AA, measured not assumed
- 17px minimum for real content, 44px targets
- Reduced-motion and no-JS paths on everything
- Nav at 1180px, phone always visible, emergency reachable
- LCP budget 2500ms
- No superlatives, no invented facts, Ken never Kevin
- The nine primitives plus LineDraw are the only animation surface
- Real photos of real people — never AI-generated people

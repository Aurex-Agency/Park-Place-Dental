# CLAUDE.md — Park Place Dental

Drop this at the repo root. Every Claude Code session reads it automatically.

---

## Project

Marketing website for **Park Place Dental**, a general dental practice in **Booneville, Mississippi** (Prentiss County, pop. ~8,600). Primary job of this site: get a nervous adult to call or book. Secondary: establish the practice as the modern, unintimidating option in the county.

Design reference for **flow and motion only**: `impilo.health`. We are not cloning its look. See `DESIGN-SYSTEM.md` — it is the source of truth for color, type, spacing, and the nine motion primitives.

## Stack

- **Next.js 15+** App Router, TypeScript strict, RSC by default
- **Tailwind CSS v4** — CSS-first config via `@theme` in `app/globals.css`. No `tailwind.config.js` color values; tokens live in one place.
- **Motion** (`motion/react`) for animation. `Lenis` for smooth scroll. Do not add GSAP unless a specific effect provably can't be done — then ask first.
- `next/font/google` for fonts. No `<link>` to Google Fonts.
- `react-hook-form` + `zod` for forms
- `next/image` for all raster images
- Deploy: Vercel

## Commands

```bash
pnpm dev            # local
pnpm build          # must pass before any PR
pnpm lint           # eslint + typescript
pnpm test:a11y      # axe-core against built routes
pnpm lhci           # lighthouse-ci, budgets in lighthouserc.json
```

## Structure

```
app/
  (marketing)/          # route group, shares nav + footer
  layout.tsx            # fonts, Lenis provider, JSON-LD
  globals.css           # @theme tokens — ONLY place colors are defined
components/
  motion/               # the nine primitives (Preloader, SplitReveal, WordRotator,
                        # Odometer, Marquee, SwapButton, StickySteps, RevealImage, ThemeSection)
  sections/             # one file per home-page section, composed from motion/ + ui/
  ui/                   # buttons, inputs, cards
content/                # MDX/TS content — copy lives here, not inline in JSX
lib/                    # schema.org builders, analytics, utils
public/
  video/  images/  og/
DESIGN-SYSTEM.md
```

## Hard rules

**Design**
1. Never hardcode a hex, px font-size, or duration in a component. Use `@theme` tokens. If a token doesn't exist, propose adding it — don't inline.
2. The nine motion primitives in `components/motion/` are the only animation surface. If a section needs new motion, extend a primitive or add a tenth — never one-off `<motion.div>` in a section file.
3. Animate only `transform`, `opacity`, `clip-path`, `filter`.
4. Every animated component must have a `prefers-reduced-motion: reduce` path that is tested, not assumed.
5. Reveals use `viewport={{ once: true }}`. Nothing re-animates on scroll-back.
6. **`gold`/`gold-lift` are never used as text on `cream`, `sand`, or `white` — at any size.** Measured: gold on cream is 2.88:1, which fails even the 3:1 large-text AA minimum (sand and white are worse). Gold is a fill and mark color on light surfaces, not a text color: primary-CTA fills (with `ink` text, 5.88:1), hairlines, rules, decorative column motifs. Gold text is fine on `navy` (4.90:1, clears normal-text AA at any size) — that's the one place gold can be text. `brick` is emergency-only — the single place red appears as a solid fill on the site — and is not restricted like gold: white on brick is 6.89:1, brick on cream is 6.23:1, both pass everywhere they're used. See the live, computed check at `/dev/tokens`.

**Content & compliance**
7. **No AI-generated or stock images of people.** Not the dentist, staff, patients, or before/afters. Placeholders must be obvious gray boxes labeled `NEEDS REAL PHOTO: <description>` so nothing fake ships by accident.
8. **No PHI collection.** Forms take name, phone, email, preferred window, general reason dropdown. Every form includes the line: "Please don't include medical details here — we'll take those by phone." Never add a free-text "describe your symptoms" field.
9. **No medical claims, guarantees, or superlatives** ("best dentist," "painless," "guaranteed results"). State-board advertising rules and FTC substantiation both apply.
10. NAP (name, address, phone) is defined once in `content/practice.ts` and imported everywhere. It must match the Google Business Profile character-for-character.
11. **Dr. Ken Goodwin. Never Kevin.** The practice's own current site says "Kevin" on the home page and "Ken" on the dentist page — it contradicts itself. Ken is correct; never reproduce Kevin anywhere, including internal docs.
12. Real copy only. No lorem ipsum — it hides layout problems and gets shipped.

**Quality gates**
13. WCAG 2.2 AA. Keyboard-complete, visible focus, semantic HTML, real `<button>`/`<a>`. Treat a11y failures as build failures.
14. Budgets: LCP < 2.5s (`simulate` throttling — matches what PageSpeed Insights shows the client), CLS < 0.05, INP < 200ms on mid-tier Android / 4G. Hero video ≤ 1.5MB with a `poster`. If motion and budget conflict, budget wins. 2.5s is Google's own "good" LCP threshold, not a number we picked — see STATUS.md's performance investigation for how it was set and what it currently measures.
15. Every page: unique `<title>` + meta description, OG image, canonical. Home + contact carry `Dentist` JSON-LD.
16. `pnpm build && pnpm lint && pnpm test:a11y` must pass before any commit is proposed. `pnpm lhci` is checked separately, not part of this chain — it's allowed to fail during a phase (as it does through Phase 2, pending the Phase 3 revisits in STATUS.md) without blocking commits; it gates entry to Phase 3 launch prep, not day-to-day work.

## Working style

- **Work in phases. Stop at each phase gate and show me before continuing.** Do not scaffold the entire site in one pass.
- Build the motion primitives *before* any section that uses them. Ship them with a `/dev/primitives` sandbox route so I can review them in isolation.
- Before writing a section, restate in one line what that section is supposed to make the visitor do.
- When a design decision is genuinely ambiguous, ask one question rather than guessing and building 400 lines.
- Prefer fewer, better components over configurability. This site has one client.
- Commit per phase, conventional commits, feature branches off `main`.

## Placeholders to fill

Replace before launch — grep for `TODO(kalob)`:
`TODO(kalob): phone` · `TODO(kalob): street address` · `TODO(kalob): dentist name + credentials` · `TODO(kalob): hours` · `TODO(kalob): insurances accepted` · `TODO(kalob): resample gold from the logo file` · `TODO(kalob): form endpoint`

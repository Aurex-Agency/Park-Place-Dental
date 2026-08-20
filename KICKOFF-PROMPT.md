# The Claude CLI Kickoff Prompt

## Before you paste this

1. `mkdir park-place-dental && cd park-place-dental && git init`
2. Copy `CLAUDE.md` and `DESIGN-SYSTEM.md` into the repo root.
3. Drop the logo at `public/brand/logo.svg` (and a PNG if that's all you have).
4. Run `claude` and paste the block below.

The prompt is deliberately long. That's the point — the failure mode with Claude Code on a design build isn't that it can't code, it's that it invents its own design decisions in the gaps you leave. This closes the gaps and forces it to stop at phase gates instead of dumping a finished-but-wrong site.

---

## PASTE THIS

```
Read CLAUDE.md and DESIGN-SYSTEM.md in full before doing anything. They are the
source of truth and override your defaults. Do not start coding yet.

# CONTEXT

You're building the marketing website for Park Place Dental, a general dental
practice in Booneville, Mississippi — a town of about 8,600 in Prentiss County.
Their competition is other small-town practices with 2012-era template sites.

The visitor we're designing for: an adult, 35–65, who has been putting off a
dental visit. Possibly for years. They are anxious about two things — whether
it will hurt, and what it will cost. The site's entire job is to make that
person feel like this practice is calm, modern, competent, and safe to call.

Every design and copy decision gets tested against that. If a flourish doesn't
move that person closer to picking up the phone, it doesn't ship.

# DESIGN REFERENCE

The site https://impilo.health is the reference for FLOW AND MOTION ONLY.
We are stealing its structural grammar and its animation vocabulary. We are not
stealing its look — nothing violet, nothing SaaS, no dashboard UI, no
infrastructure-company vocabulary.

Section 1 of DESIGN-SYSTEM.md breaks down exactly which of its ingredients we
want and what each becomes for us. Section 3 defines the nine motion primitives.
Build those primitives first and everything else composes from them.

The brand direction is deep evergreen + warm ivory + brass — premium, warm,
adult. The explicit goal is that this looks nothing like the cyan-gradient,
stock-photo-smile dental template. If it starts drifting that direction,
stop and flag it.

# STACK

Next.js 15 App Router, TypeScript strict, Tailwind v4 (CSS-first @theme),
Motion (motion/react), Lenis, next/font, react-hook-form + zod, deploy to Vercel.
Full conventions are in CLAUDE.md.

# HOW WE WORK

Phased, with hard stops. At the end of each phase you STOP, summarize what you
built in under 10 lines, tell me exactly what to look at, and wait. Do not
proceed to the next phase without me saying go. Commit at each gate.

If a decision is genuinely ambiguous, ask ONE question. Don't guess and build
400 lines I have to throw away.

---

## PHASE 0 — Plan and scaffold

1. Restate the brief back to me in 5 lines, including anything in
   DESIGN-SYSTEM.md you disagree with or think is a mistake. I want the pushback
   now, not after it's built.
2. Scaffold: Next.js 15 + TS strict + Tailwind v4 + Motion + Lenis.
3. Put the full color, type, spacing, and motion token set from DESIGN-SYSTEM.md
   into app/globals.css under @theme. Every token, named exactly as specified.
4. Wire next/font: Fraunces (display) + Inter Tight (body). Preload display only.
5. content/practice.ts — single source for NAP, hours, services, insurances,
   service-area towns. Use TODO(kalob) placeholders for anything unknown.
6. Create /dev/tokens — a route rendering the full palette with computed contrast
   ratios, the type scale, and the spacing scale. This is how I approve the
   foundation before we build on it.

STOP. Show me /dev/tokens.

## PHASE 1 — The nine motion primitives

Build every primitive in DESIGN-SYSTEM.md §3, in components/motion/:

Preloader · SplitReveal · WordRotator · Odometer · Marquee · SwapButton ·
StickySteps · RevealImage · ThemeSection

Requirements for each, no exceptions:
- transform / opacity / clip-path / filter only
- a real, tested prefers-reduced-motion path
- reveals fire once, never re-animate on scroll-back
- keyboard-accessible and focus-visible where interactive (SwapButton's hover
  animation must also fire on focus-visible)
- fully typed props, no `any`
- content readable with JS disabled

Then build /dev/primitives — a sandbox route showing every primitive in every
variant and state, with a toggle that simulates reduced-motion so I can check
both paths without touching OS settings.

STOP. This is the most important gate in the project. I'll review each primitive
individually. Expect me to send some back.

## PHASE 2 — Shell

Nav (transparent over hero, solidifies on scroll, inverts via ThemeSection's
data-theme), mobile drawer, footer, and a persistent mobile bottom bar with
"Call" and "Book" — the phone number is the primary conversion on this site,
not the form.

STOP.

## PHASE 3 — Home page

Build the 13 sections in the exact order given in DESIGN-SYSTEM.md §4, composed
from the Phase 1 primitives. Do not write one-off animation inside a section
file — if a section needs motion the primitives can't do, tell me and we'll add
a tenth primitive.

Write real copy in content/, not lorem. Voice: plain, warm, direct, zero
marketing inflation. Short sentences. Talk about cost and comfort openly —
that's the differentiator. No "state-of-the-art," no "we're passionate about
smiles," no exclamation points.

For images: gray placeholder boxes labeled NEEDS REAL PHOTO: <description>.
Never generate or source a fake photo of a person.

Build sections 1–5 first and STOP. Then 6–13.

## PHASE 4 — Interior pages

/services + /services/[slug] · /about · /team/[slug] · /new-patients ·
/new-patients/insurance-and-payment · /smile-gallery · /contact ·
/emergency-dentist · /dentist-in-[town] for Baldwyn, Rienzi, Jumpertown,
New Site, Blue Mountain.

Service-area pages must have genuinely distinct content — distance, landmarks,
what's specific about serving that town. Thin doorway pages will get us
penalized and they deserve to be.

STOP.

## PHASE 5 — Forms, SEO, analytics

Appointment request form: name, phone, email, preferred window, general reason
dropdown. NO free-text symptom field, NO medical detail capture. Include the
visible line "Please don't include medical details here — we'll take those by
phone." Zod validation, honeypot + rate limit, accessible inline errors tied
with aria-describedby, real success and failure states.

Dentist JSON-LD with exact NAP from content/practice.ts,
openingHoursSpecification, areaServed, hasMap. Sitemap, robots, per-page
metadata, OG images. Event tracking on tel: clicks, form submits, and
directions clicks.

STOP.

## PHASE 6 — Hardening

Full keyboard pass. axe-core clean on every route. Lighthouse against the
budgets in CLAUDE.md (LCP < 2.0s, CLS < 0.05, INP < 200ms, mid-tier Android).
Test at 360 / 768 / 1280 / 1920. Verify every reduced-motion path. Verify the
site is usable and readable with JS fully disabled.

Then give me a launch checklist of every TODO(kalob) still unresolved and every
NEEDS REAL PHOTO placeholder still in place.

---

Start with Phase 0. Restate the brief and tell me what you'd push back on.
```

---

## Follow-up prompts worth keeping

**When a section looks generic:**
```
This section has drifted toward the generic dental template. Re-read
DESIGN-SYSTEM.md §1 — specifically what we said makes the reference site feel
good — and tell me which of those ingredients this section is missing before you
change any code.
```

**When motion feels like too much:**
```
Audit the home page for motion. List every animation, what it costs in main-
thread time, and what it earns. Then cut the bottom third. A dental patient with
anxiety should feel calm, not impressed.
```

**When you want honest review instead of agreement:**
```
Review the home page as a skeptical 52-year-old in Booneville who hasn't been to
a dentist in six years. Where do you lose them? Be specific about scroll depth.
Don't fix anything yet.
```

**Before shipping:**
```
Read DESIGN-SYSTEM.md §6 and CLAUDE.md's hard rules. Audit every shipped section
against both, as a checklist, with pass/fail per item. Don't fix — just report.
```

**When context gets long:** `/compact` after each phase gate, and re-anchor with
`Re-read CLAUDE.md and DESIGN-SYSTEM.md §3 before continuing.` Drift on token
usage and one-off animations is the most common failure in long design builds.

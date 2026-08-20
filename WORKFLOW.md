# Park Place Dental — Asset & Build Workflow

How the pieces fit together: Claude Code, GitHub, Higgsfield, Motion, and the photography you can't fake.

---

## The order that matters

The common failure on a build like this is generating assets first, then trying to bend the layout around them. Do it the other way:

```
Brand lock  →  Primitives  →  Layout with placeholders  →  Assets to fit  →  Polish
```

You can't art-direct a hero video until you know the hero's aspect ratio, safe-area, and text overlay position. Build the box, then fill it.

---

## Track 1 — Code (Claude Code + GitHub)

**Branching.** `main` is always deployable. One branch per phase: `phase-0-scaffold`, `phase-1-primitives`, `phase-3-home-sections`. PR each into `main` so you get a diff to review — reviewing a diff catches drift that reviewing a running site does not.

**Vercel preview deploys per branch.** Non-negotiable for this project. You need to open the real thing on a real phone, and you need a URL to send the client. Reviewing motion in a desktop browser is how janky mobile scroll ships.

**Context hygiene.** Claude Code drifts on long design builds — specifically, it starts inlining hex values and writing one-off `<motion.div>` animations inside section files instead of using the primitives. Counter it:

- `/compact` at every phase gate
- Re-anchor after compacting: *"Re-read CLAUDE.md and DESIGN-SYSTEM.md §3 before continuing."*
- Periodically: *"Grep the codebase for hardcoded hex values, px font-sizes, and inline motion outside components/motion/. Report violations."*

**Useful subagent moves.** At the end of Phase 3 and Phase 6, spawn a fresh review agent so you get an opinion uncontaminated by the context that built it:

> "Review the home page implementation against DESIGN-SYSTEM.md as an outside auditor. You did not write this code. Report violations only, don't fix."

---

## Track 2 — Motion layer

Motion (`motion/react`, formerly Framer Motion) covers everything the reference site does. You do not need GSAP for this build:

| Reference effect | Motion approach |
|---|---|
| Preloader counter + curtain | `animate()` on a count value, `AnimatePresence` for the curtain exit |
| Split-line text reveal | Manual line-splitting + `whileInView` with `staggerChildren` |
| Pinned `01–04` steps | CSS `position: sticky` + `useScroll` with `offset` for progress-driven detail |
| Rolling odometer digits | `useMotionValue` + `useTransform` on digit columns, or `animate()` with `onUpdate` |
| Infinite marquee | Pure CSS keyframes on a duplicated track — don't burn JS on this |
| Button label swap | Pure CSS transform on `:hover`/`:focus-visible` — also don't burn JS on this |
| Section color inversion | `data-theme` attribute + CSS transition, driven by an intersection observer |

Two things worth doing:

1. **Feed Motion's docs to the CLI.** Motion publishes LLM-oriented docs (check `motion.dev/llms.txt` / their docs-for-AI page). Point Claude at it in Phase 1 so it uses current v12 APIs rather than old Framer Motion patterns it half-remembers. Wrong-version animation APIs are the #1 time sink here.
2. **Half of the reference site's "wow" is CSS, not JS.** Marquees, button swaps, and color inversions should never touch the main thread. Tell Claude this explicitly — left alone it will reach for `motion` on everything and you'll eat the INP cost.

---

## Track 3 — Visual assets

### The line you don't cross

**No AI-generated people.** Not the dentist, not the hygienist, not patients, not before/after photos. Three separate reasons, any one of which is sufficient:

- A patient recognizes the fake staff photo, and now everything else on the site is suspect
- Fake before/afters are unsubstantiated advertising claims — FTC and state dental board territory
- Real photos of real people in a small town *are* the competitive advantage. Booneville is 8,600 people. They want to see who's actually going to be in the room.

Put this line in writing with the client too, so nobody "helpfully" swaps in a stock photo later.

### Where Higgsfield actually earns its keep

Ambience, texture, and abstraction — the layer under the content:

| Use | Prompt direction |
|---|---|
| Hero ambient loop | Slow light moving across a clean, warm, minimal interior. Shallow depth of field. No faces, no hands, no logos. 8–12s, seamless loop. |
| Section transition textures | Soft evergreen-to-ivory gradient washes, subtle grain, out-of-focus bokeh |
| Service card backgrounds | Abstract macro — water, light refraction, smooth ceramic-like surfaces |
| Loading / empty states | Minimal looping motion in brand green |
| Social cutdowns | 9:16 versions of the above for GBP posts and Instagram |

Constraints to bake into every generation: brand palette only (evergreen / ivory / brass), no text, no faces, no hands, no recognizable dental equipment that isn't theirs, muted and calm rather than dramatic.

**Specs:** hero at 1920×1080, exported as **both** `.webm` (VP9) and `.mp4` (H.264) — Safari still needs the mp4. Target ≤ 1.5MB. Always generate a `poster` frame from frame 0. If you can't get under budget, use a static image with a slow CSS `scale` — nobody will miss the video, and LCP will thank you.

### What has to be shot for real

Book a half-day with a local photographer. Shot list:

- Dentist portrait — warm, eye contact, natural light, not a white-background headshot
- Each team member, same setup and crop so the grid is consistent
- Team candid — the "these are real people" shot
- Exterior with signage (this is also your Google Business Profile photo)
- Reception, treatment room, and the sterilization area — anxious patients read cleanliness as competence, and nobody else in town shows it
- Detail shots: hands, light, texture — these fill the service pages
- Vertical 9:16 crops of the best five for social

Shoot everything at 3:2 and 4:5, then crop. Deliver as AVIF + WebP via `next/image`.

**Before/afters:** the practice's own cases only, with signed photo-release consent on file, consistent lighting and angle between shots, and no retouching of the teeth themselves. If they don't have a consented set yet, ship the site without a smile gallery and add it in month two. An empty gallery is better than a legally exposed one.

---

## Track 4 — Copy

Write it before the design is finished, not after. Layout built around real copy holds up; layout built around lorem falls apart the day you paste the real thing in.

**Voice:** plain, warm, direct. Short sentences. Talks about cost and comfort out loud. Sounds like a competent person, not a brochure.

**Banned:** "state-of-the-art," "cutting-edge," "we're passionate about smiles," "your smile is our priority," any exclamation point, any superlative, any comfort guarantee. State-board advertising rules restrict claims and guarantees — and separately, that language is exactly what the 2012 template sites say.

**The two sentences that do the most work on the whole site:** something honest about pain, and something honest about price. Most dental sites won't say either. Say both, above the fold on `/new-patients`.

---

## Local SEO — the unglamorous part that drives the phone

For a practice in a town this size, this matters more than the animation does.

- **Google Business Profile is priority one.** Category "Dentist," complete hours, real photos monthly, every review answered. In a 8,600-person town, GBP will out-convert the website on volume.
- **NAP consistency** — the address string on the site must match GBP character-for-character. One `Ave` vs `Avenue` mismatch dilutes the signal.
- **`Dentist` JSON-LD** on home and contact, with `areaServed` covering Booneville, Baldwyn, Rienzi, Jumpertown, New Site, Blue Mountain.
- **Service-area pages with real content.** Distance, landmarks, why someone in Baldwyn would drive over. Thin doorway pages are worse than no pages.
- **`/emergency-dentist`** is the highest-intent page you will build. Someone searching that at 9pm converts at a rate nothing else touches. Phone number huge, above the fold, `tel:` linked.
- Embed the map lazily. A synchronous Google Maps iframe will single-handedly blow your LCP budget.

---

## Launch checklist

**Content**
- [ ] Every `TODO(kalob)` resolved
- [ ] Every `NEEDS REAL PHOTO` replaced
- [ ] NAP matches GBP exactly
- [ ] Insurance list confirmed with the office manager
- [ ] Before/after consent forms on file (or gallery deferred)

**Technical**
- [ ] `pnpm build && pnpm lint && pnpm test:a11y` clean
- [ ] Lighthouse ≥ 95 perf / 100 a11y on mobile
- [ ] LCP < 2.0s, CLS < 0.05, INP < 200ms on a real mid-tier Android over 4G
- [ ] Reduced-motion verified on every animated component
- [ ] Full keyboard pass, no traps, focus always visible
- [ ] Readable with JS disabled
- [ ] 360 / 768 / 1280 / 1920 all clean
- [ ] Form delivers to a real monitored inbox — send a test and confirm receipt
- [ ] `tel:` links tested on an actual iPhone and an actual Android

**Launch**
- [ ] 301s from the old site's URLs
- [ ] Search Console + sitemap submitted
- [ ] Analytics live, conversion events firing (`tel:` click, form submit, directions)
- [ ] GBP website field updated
- [ ] OG image renders correctly in iMessage, Facebook, and Google search preview
- [ ] Someone at the practice knows how to reach you when the form breaks

# Project Status — Park Place Dental V2

**Read this first.** This is the handoff doc for picking up this project cold. Last updated 2026-08-20, end of Phase 1 (motion primitives), mid-review.

## Orientation

This is a from-scratch rebuild of the Park Place Dental marketing site (general dental practice, Booneville, MS). It replaced an earlier, human-rejected creative direction (see `.claude` memory files if working from this machine — three prior rounds were rejected before this clean-slate restart). The current build follows `KICKOFF-PROMPT.md`'s phased script: **Phase 0 (scaffold) and Phase 1 (motion primitives) are built**; Phase 2 (nav shell) has not started.

Read in this order:
1. `CLAUDE.md` — hard rules (design, compliance, quality gates). Overrides defaults.
2. `DESIGN-SYSTEM.md` — source of truth for color/type/spacing/motion tokens and page architecture. **Note: its color section was rewritten mid-Phase-0** — see Palette below.
3. `WORKFLOW.md` — how code/motion/assets/copy/SEO tracks fit together.
4. `KICKOFF-PROMPT.md` — the actual phased build script being executed. Phase 0/1 are done; resume at Phase 2.
5. This file, for what's actually true right now vs. what those docs describe in the abstract.

## Repo state

- Remote: `https://github.com/Aurex-Agency/Park-Place-Dental.git` (this is a **new** repo — a prior remote, `Park-Place-Dental-Boone.git`, was replaced; don't confuse the two)
- `main`: seeded as a fresh orphan commit (no history from any prior attempt). Currently holds only `CLAUDE.md`, `DESIGN-SYSTEM.md`, `WORKFLOW.md`.
- `phase-0-scaffold` (off `main`): Next.js scaffold + full design tokens. **PR #1, open, not merged.**
- `phase-1-primitives` (off `phase-0-scaffold`): the nine motion primitives + sandbox. **PR #2, open, not merged.** This is the current/latest branch — if you're picking up work, branch from here (or from wherever PR #2 lands after merge).
- **Merge order matters**: PR #1 → `main` first, then PR #2 → `main` (or rebase PR #2 onto `main` post-merge). Neither has been merged yet — merging needs a human (the harness blocks the agent from merging PRs itself by design).
- KICKOFF-PROMPT.md itself is committed only on `phase-0-scaffold`/`phase-1-primitives`, not yet on `main`.

## What's built

### Phase 0 — scaffold (PR #1: `phase-0-scaffold`)
- Next.js 16 (satisfies CLAUDE.md's "15+"), App Router, TypeScript strict, Tailwind v4
- Full token set from `DESIGN-SYSTEM.md` §2/§3 in `app/globals.css` under `@theme` — colors, type scale, spacing, radii, motion durations/easings
- Fraunces (display, preloaded) + Inter Tight (body) via `next/font`
- `components/providers/lenis-provider.tsx` — smooth scroll, skipped under `prefers-reduced-motion`
- `content/practice.ts` — single source for NAP/hours/services/insurance. **Verified real facts** (name, address, phone, email, dentist name "Dr. Ken Goodwin") came from a prior discovery-phase doc (`PROJECT-TRUTH.md`, in a sibling directory outside this repo). Everything else is genuinely unconfirmed and marked `TODO(kalob)` — do not fill these in from old rejected mockups, which speculated specific wrong-ish values (hours, insurance list, credentials, tenure claims).
- `/dev/tokens` — palette/type/spacing sandbox with **computed** (not hand-typed) WCAG contrast ratios

**Palette swap** (same-day, human-directed, commit `82ff743`): DESIGN-SYSTEM.md originally specified evergreen + ivory + brass. The human asked for a change to **navy + cream + rose gold** instead. `DESIGN-SYSTEM.md`, `app/globals.css`, and `/dev/tokens` were all updated together. Current tokens: `ink`, `navy`, `navy-mid`, `navy-lift`, `mist`, `cream`, `sand`, `white`, `rose`, `rose-lift`, `danger`, `focus`. If you see any doc/memory still referencing pine/park/brass/ivory/bone/sage, it's stale.

### Phase 1 — nine motion primitives (PR #2: `phase-1-primitives`)
All in `components/motion/`, exported from `components/motion/index.ts`: `Preloader`, `SplitReveal`, `WordRotator`, `Odometer`, `Marquee`, `SwapButton`, `StickySteps`, `RevealImage`, `ThemeSection`. Shared reduced-motion state via `components/motion/motion-preference.tsx` (`useSyncExternalStore` over `matchMedia`, overridable by a dev-only prop). Sandbox at `/dev/primitives` with a System/Motion/Reduced toggle.

**Bugs found and fixed during review** (worth knowing about if touching these files again):
- `max-w-[--container-max]` is invalid CSS (needs `var()`) — silently left `/dev/tokens` and `/dev/primitives` unconstrained.
- `StickySteps` had an infinite render loop from an inline callback prop recreated every render.
- `SplitReveal`/`RevealImage` never revealed: `useInView`'s ref was attached to the *transformed* element itself, and IntersectionObserver measures post-transform geometry — fixed by watching an untransformed wrapper instead (same pattern `Odometer`/`ThemeSection`/`StickySteps` already used correctly).
- `Odometer`: prefix/suffix text baseline didn't match the rolling digit columns (CSS baseline-synthesis quirk with `overflow-hidden`); first fix (matching box shapes) then clipped descenders like the "g" in "avg". Final fix: `align-items: center` instead of baseline alignment, sidesteps the whole problem.
- `ThemeSection`'s reduced-motion CSS selector was a descendant selector (`[data-reduced-motion="true"] .theme-section`) but the attribute and class are on the *same* element — never matched, so the 600ms transition silently ignored the reduced-motion setting. Same mistake class as a `SwapButton` bug fixed earlier; worth grepping for this pattern (`data-reduced-motion` placement vs. CSS selector shape) if adding new primitives.
- `Marquee` only paused on `:hover`, which fails WCAG 2.2.2 for keyboard-only users — added `tabIndex` + `:focus-visible` pause.
- `Preloader` had a stale-closure risk on `onCompleteAction` in a mount-only effect — fixed via ref.
- `WordRotator` keyed `AnimatePresence` on word text (collision risk for repeated words) — keyed by index instead.

All were caught and fixed through human review of the live sandbox, not automated testing alone. **Known testing-environment limitation**: the browser automation tool used for verification runs in a backgrounded tab, which Chrome throttles heavily (`IntersectionObserver`/`requestAnimationFrame` barely fire) — this produced false "nothing renders" signals during debugging that turned out to be environment artifacts, not code bugs, confirmed by testing in the human's real browser. If something looks broken in an automated screenshot, verify with a real focused tab before concluding it's a code bug.

## Non-obvious project facts

- **Dentist name**: "Dr. Ken Goodwin" is correct. "Kevin Goodwin" is an incorrect name circulating on the old live site and aggregator listings — never reproduce it anywhere, including internal docs.
- **Next.js 16 gotcha**: `next dev` auto-appends a generated "agent rules" block into `CLAUDE.md` on every run unless `agentRules: false` is set in `next.config.ts` (already set — don't remove it, since CLAUDE.md is hand-maintained here).
- Old branch `agent/ppd-v2-clean-rebuild` and local sibling directory `park-place-directed-rebuild/` hold earlier discovery-phase history and rejected mockups. They're superseded — don't resurrect content from them without re-verifying against `PROJECT-TRUTH.md`'s verified-vs-unconfirmed split.

## Outstanding / needs human action

- **Merge PR #1 then PR #2** (or direct the next session to do it) — both open, unmerged.
- `TODO(kalob)` placeholders still open in `content/practice.ts`: hours, dentist credentials, service list, insurances, social links, form endpoint. Get these from the client directly, not from old mockups.
- Real logo hex sampling hasn't happened — current navy/rose/cream values are a proposal, not sampled from brand assets.
- No real photography yet — `/dev/primitives`' `RevealImage` demo uses an obvious placeholder SVG (`public/dev/placeholder.svg`), per CLAUDE.md's no-fake-photos rule.

## Next: Phase 2 (per KICKOFF-PROMPT.md)

Nav (transparent over hero, solidifies on scroll, inverts via `ThemeSection`'s `data-theme`), mobile drawer, footer, and a persistent mobile bottom bar with "Call" and "Book" (phone is the primary conversion, not the form). Then STOP for review before Phase 3 (home page sections).

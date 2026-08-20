# Project Status — Park Place Dental V2

**Read this first.** This is the handoff doc for picking up this project cold. Last updated 2026-08-20, end of the Phase 1 cleanup pass (`chore/phase-1-cleanup`), mid-review.

## Orientation

This is a from-scratch rebuild of the Park Place Dental marketing site (general dental practice, Booneville, MS). It replaced an earlier, human-rejected creative direction (see `.claude` memory files if working from this machine — three prior rounds were rejected before this clean-slate restart). The current build follows `KICKOFF-PROMPT.md`'s phased script: **Phase 0 (scaffold) and Phase 1 (motion primitives) are built, and a cleanup pass on Phase 1 is done**; Phase 2 (nav shell) has not started.

Read in this order:
1. `CLAUDE.md` — hard rules (design, compliance, quality gates). Overrides defaults.
2. `DESIGN-SYSTEM.md` — source of truth for color/type/spacing/motion tokens and page architecture. **Note: its color section was rewritten mid-Phase-0** — see Palette below.
3. `WORKFLOW.md` — how code/motion/assets/copy/SEO tracks fit together.
4. `KICKOFF-PROMPT.md` — the actual phased build script being executed. Phase 0/1 are done; resume at Phase 2.
5. This file, for what's actually true right now vs. what those docs describe in the abstract.

## Repo state

- Remote: `https://github.com/Aurex-Agency/Park-Place-Dental.git` (this is a **new** repo — a prior remote, `Park-Place-Dental-Boone.git`, was replaced; don't confuse the two)
- `main`: seeded as a fresh orphan commit (no history from any prior attempt).
- PRs #1, #2, and #3 (`phase-0-scaffold`, `phase-1-primitives`, `chore/phase-1-cleanup`) are all **merged** — but they were stacked (#2's base was #1's branch, #3's base was #2's branch), so merging each only landed it into its immediate parent branch, not `main`. Only PR #1 actually reached `main`. As of this writing **`main` still only has the Phase 0 scaffold — no `components/motion/`, no Phase 1, no cleanup fixes.**
- **PR #4** (`chore/phase-1-cleanup` → `main`, opened after discovering the above): brings everything — Phase 0 + Phase 1 + the cleanup pass — into `main` in one merge. Confirmed cleanly mergeable, no conflicts. **Still open, not merged** — this is the one that actually matters now. Merge this one and `main` is caught up.
- Once PR #4 merges, `main` is the branch to work from — the stacked branches (`phase-0-scaffold`, `phase-1-primitives`, `chore/phase-1-cleanup`) become historical and shouldn't be built on further.
- KICKOFF-PROMPT.md itself is committed on the stacked branches, not yet on `main` (will be, once PR #4 merges).

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

All were caught and fixed through human review of the live sandbox, not automated testing alone. **Known testing-environment limitation**: the browser automation tool used for verification runs in a backgrounded tab, which Chrome throttles heavily (`IntersectionObserver`/`requestAnimationFrame` barely fire) — this produced false "nothing renders" signals during debugging that turned out to be environment artifacts, not code bugs, confirmed by testing in the human's real browser. If something looks broken in an automated screenshot, verify with a real focused tab before concluding it's a code bug. This recurred during the cleanup pass below (see the ThemeSection stability test) — it's a standing characteristic of this environment, not a one-off.

## Phase 1 cleanup (PR #3: `chore/phase-1-cleanup`)

Four scoped fixes, no Phase 2 work:

1. **The quality gate is now real.** CLAUDE.md's rule (build+lint+`test:a11y` before every commit) referenced a script that didn't exist. Added `tests/routes.ts` (the route manifest — Phase 3 should only ever need to add entries here), Playwright + `@axe-core/playwright` (`tests/a11y.spec.ts`, every route tested twice — normal and `prefers-reduced-motion: reduce`), and `@lhci/cli` + `lighthouserc.json` against CLAUDE.md's actual budgets. `pnpm test:a11y` is green (verified across many consecutive runs — building it surfaced a real ~1-in-5 flake from `WordRotator`'s perpetual cycling landing mid-crossfade on a snapshot, absorbed with a bounded retry, not hidden). **`pnpm lhci` is NOT green**: LCP is 2700–3300ms against the 2000ms budget on all three routes, even for plain-text LCP elements, under simulated mobile throttling. Not fixed — reported honestly, budget not loosened. See Outstanding below.
2. **Stale palette references killed.** KICKOFF-PROMPT.md and WORKFLOW.md still described evergreen/ivory/brass after the palette swap. WORKFLOW.md's Higgsfield asset-generation table got an actual creative rewrite (rose-gold accent role, not a find-and-replace).
3. **Callback-identity landmine guarded.** `ThemeSection.onThemeChangeAction` and `StickySteps`' internal `onEnter` called a consumer callback from an effect that listed the callback in its own deps — the exact shape that already caused one infinite-loop bug (fixed previously at the call site, not the primitive). Both now use the latest-ref pattern `Preloader` already used for `onCompleteAction`. `StickySteps` gained a small new public prop, `onActiveIndexChangeAction`, specifically so the fix is provable against an external consumer, not just asserted.
4. **Rose-on-navy contrast limit made hard to violate.** Was prose-only in DESIGN-SYSTEM.md (4.4:1, large-text-only). `/dev/tokens` now shows explicit pass/fail badges against both AA thresholds (4.5:1 normal, 3:1 large) with an unmissable warning row for large-text-only pairs. Added CLAUDE.md hard rule #6 (rose/rose-lift never below `--text-h3`/24px, never for body/label/form text on navy) — **this renumbered every rule after it** (old 6–14 → new 7–15); references to old numbers in `tests/a11y.spec.ts` and `playwright.config.ts` were updated, rule #4 (reduced-motion) didn't move so its references elsewhere are untouched.

## Non-obvious project facts

- **Dentist name**: "Dr. Ken Goodwin" is correct. "Kevin Goodwin" is an incorrect name circulating on the old live site and aggregator listings — never reproduce it anywhere, including internal docs.
- **Next.js 16 gotcha**: `next dev` auto-appends a generated "agent rules" block into `CLAUDE.md` on every run unless `agentRules: false` is set in `next.config.ts` (already set — don't remove it, since CLAUDE.md is hand-maintained here).
- Old branch `agent/ppd-v2-clean-rebuild` and local sibling directory `park-place-directed-rebuild/` hold earlier discovery-phase history and rejected mockups. They're superseded — don't resurrect content from them without re-verifying against `PROJECT-TRUTH.md`'s verified-vs-unconfirmed split.

## Outstanding / needs human action

- **Merge PR #4** (`chore/phase-1-cleanup` → `main`) — this is the one that actually lands everything in `main`. #1/#2/#3 are already merged but only reached each other's stacked branches, not `main` (see Repo state above).
- **LCP budget miss** (found in the cleanup pass): 2700–3300ms against the 2000ms budget on all three routes, per `pnpm lhci`. Even plain-text LCP elements are this slow under simulated mobile throttling — worth a real performance investigation before Phase 2 adds more content/weight. Not investigated yet; deliberately out of scope for the gate-infrastructure cleanup task.
- `CLEANUP-PROMPT.md` sits in the repo root as an untracked file (the prompt that drove this cleanup pass) — never committed anywhere. Not part of any task's scope. A human should decide whether it gets committed like `KICKOFF-PROMPT.md` was, or left local/deleted.
- `TODO(kalob)` placeholders still open in `content/practice.ts`: hours, dentist credentials, service list, insurances, social links, form endpoint. Get these from the client directly, not from old mockups.
- Real logo hex sampling hasn't happened — current navy/rose/cream values are a proposal, not sampled from brand assets.
- No real photography yet — `/dev/primitives`' `RevealImage` demo uses an obvious placeholder SVG (`public/dev/placeholder.svg`), per CLAUDE.md's no-fake-photos rule.

## Next: Phase 2 (per KICKOFF-PROMPT.md)

Nav (transparent over hero, solidifies on scroll, inverts via `ThemeSection`'s `data-theme`), mobile drawer, footer, and a persistent mobile bottom bar with "Call" and "Book" (phone is the primary conversion, not the form). Then STOP for review before Phase 3 (home page sections).

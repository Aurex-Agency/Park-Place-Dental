# Project Status — Park Place Dental V2

**Read this first.** This is the handoff doc for picking up this project cold. Last updated 2026-08-21, end of the palette/content/shell-hardening pass (`chore/palette-content-shell`, not yet merged/PR'd as of this writing). Phase 3 has not started.

## Orientation

This is a from-scratch rebuild of the Park Place Dental marketing site (general dental practice, Booneville, MS). It replaced an earlier, human-rejected creative direction (see `.claude` memory files if working from this machine — three prior rounds were rejected before this clean-slate restart). The current build follows `KICKOFF-PROMPT.md`'s phased script: **Phase 0 (scaffold), Phase 1 (motion primitives), the Phase 1 cleanup pass, the LCP performance investigation, and Phase 2 (nav shell/drawer/footer/mobile bottom bar) are all built** — plus an out-of-sequence pass (`chore/palette-content-shell`, PLAN.md/NEXT-STEPS.md) that corrected the palette to the practice's real gold/brick, filled `content/practice.ts` from a live-site audit, and hardened the Phase 2 shell (target sizes, a real hydration bug) before Phase 3 starts. Phase 3 (home page sections) has not started.

Read in this order:
1. `CLAUDE.md` — hard rules (design, compliance, quality gates). Overrides defaults.
2. `DESIGN-SYSTEM.md` — source of truth for color/type/spacing/motion tokens and page architecture. **Note: its color section was rewritten mid-Phase-0** — see Palette below.
3. `WORKFLOW.md` — how code/motion/assets/copy/SEO tracks fit together.
4. `KICKOFF-PROMPT.md` — the actual phased build script being executed. Phase 0/1/2 are done; resume at Phase 3.
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

## Performance investigation (`perf/lcp-investigation`)

Triggered by the Phase 1 cleanup's LCP budget miss (above). Stopped deliberately at the placeholder-page ceiling — the rest is premature optimization against an LCP element (plain body text) that won't exist once Phase 3 builds a real hero. Findings:

**The shell itself, not the tooling, is slow.** A bare-HTML control page (`public/perf-control.html`, since deleted) measured 651ms LCP under `simulate` — fast — which rules out "Lantern's simulated throttling model is broadly pessimistic" as an explanation. Every real route sits at 2.4–3.4s under the same throttling method, with **Render Delay consistently 80–85% of total LCP** across every route, both locally and deployed — not network transfer, not JS execution (TBT stayed 30–78ms throughout, uncorrelated with JS payload size), not the LCP element itself (always plain Inter Tight body text, never Fraunces, never an image, zero resource-load dependency: Load Delay and Load Time both measure 0ms everywhere). What in the shell drives that Render Delay is **not yet isolated** — see Phase 3 revisits below.

**Deployed vs. localhost** (Lighthouse, `simulate`, n=3, against `park-place-dental-l7r16s4u6-...vercel.app`):

| Route | Deployed median | Localhost median |
|---|---|---|
| `/` | 3376ms | 2709ms |
| `/dev/tokens` | 3356ms | 2406ms |
| `/dev/primitives` | 3334ms | 3006ms |

Deployed is worse than local, not better — real TTFB (+~200ms from actual RTT/TLS/CDN) plus a further increase in Render Delay itself. The `provided`/167ms number seen early in the investigation was a zero-latency localhost artifact, not evidence of real speed.

**Independent cross-check, PageSpeed Insights** (run directly against the deployed preview, not the API — no PSI/CrUX API key configured in this environment): **Performance 92/100, LCP 3.1s, FCP 1.5s, TBT 30ms, CLS 0.** PSI flags the LCP as "needs improvement" by its own rubric. This closely corroborates our own deployed `simulate` numbers (~3.3–3.4s) — an outside, independently-run instance sees the same magnitude of problem, which is the direct answer to "would a client running PSI on their own site see this": yes.

**Fraunces compression, settled directly:** deployed transfer size 121,115B / resource size 120,800B vs. localhost 121,102B / 120,800B — effectively identical. Confirmed via response headers: no `content-encoding` on the font response in production. Fraunces is **not** brotli-compressed on the wire, and that's correct behavior, not a bug — WOFF2 is already a compressed binary format, so double-compressing it would cost CPU for no gain. It costs the same ~121KB in production as it does locally; there's no compression story here. Side finding, not chased further: Fraunces is still `<link rel=preload>`ed on every current route despite never being the LCP element on a placeholder page — worth revisiting once a real hero uses it (see below).

**Budget decision:** `lighthouserc.json`'s `largest-contentful-paint` assertion raised from 2000ms → **2500ms**, `throttlingMethod` kept at `simulate`. 2000ms was set before anyone measured anything — an aspirational guess, not a floor. 2500ms is Google's own "good" LCP threshold: externally anchored, not backed into from our current number. The gate **still fails today** (measured ~3.1–3.4s) and that's intentional — it's meant to block entry to Phase 3, not block Phase 2 commits. CLAUDE.md rule #16 (`build && lint && test:a11y` before every commit) does **not** include `pnpm lhci` — that check is separate and is allowed to stay red through Phase 2.

**One fix attempted, logged, not chased further:** `app/layout.tsx`'s Inter Tight (the LCP element's font, and the body font on every page) had `preload: false` — wrong regardless of which page renders it, since it's loaded on all of them. Changed to `preload: true`, redeployed, re-measured once: **3449ms**, no meaningful change from the pre-fix baseline (~3376ms, well within single-run variance). Render Delay stayed dominant (80%). Per the decision not to chase this further in Phase 2: logged as a non-fix, not pursued past one measurement. Fraunces was deliberately left as-is — whether it stays preloaded is a Phase 3 question, answerable only against a real hero.

### Phase 3 performance revisits

- **Font preload strategy against a real Fraunces hero.** Once Phase 3 builds the actual hero (likely `<h1>` in Fraunces), re-evaluate whether Fraunces preload is earning its ~121KB or should defer to Inter Tight the way it doesn't need to today.
- **Hypothesis: Fraunces is contributing to Render Delay** despite not being the LCP element (rejected for testing in this investigation — it targets Fraunces when the LCP element has consistently been Inter Tight; revisit once real content makes Fraunces render-path-relevant).
- **Hypothesis: placeholder-page architecture is itself distorting the measurement** (rejected for testing in this investigation — reasoning from a page Phase 3 will replace wholesale isn't reliable evidence; revisit against real Phase 3 markup).
- **Hero video feasibility probe** (`/dev/hero-probe`, video vs. poster-only vs. static-scale LCP comparison, ~1.5MB placeholder video) — never built in this investigation; moves to Phase 3 where a real hero exists to test against, per CLAUDE.md rule #14's video budget.
- The unresolved question from this investigation: what specifically in the shell drives 80–85% Render Delay on a page with zero resource-load dependency. Not isolated here — worth returning to if the Phase 3 hero doesn't resolve it on its own.

## Non-obvious project facts

- **Dentist name**: "Dr. Ken Goodwin" is correct. "Kevin Goodwin" is an incorrect name circulating on the old live site and aggregator listings — never reproduce it anywhere, including internal docs.
- **Next.js 16 gotcha**: `next dev` auto-appends a generated "agent rules" block into `CLAUDE.md` on every run unless `agentRules: false` is set in `next.config.ts` (already set — don't remove it, since CLAUDE.md is hand-maintained here).
- Old branch `agent/ppd-v2-clean-rebuild` and local sibling directory `park-place-directed-rebuild/` hold earlier discovery-phase history and rejected mockups. They're superseded — don't resurrect content from them without re-verifying against `PROJECT-TRUTH.md`'s verified-vs-unconfirmed split.

## Outstanding / needs human action

- **LCP budget miss** (found in the cleanup pass): investigated on `perf/lcp-investigation` (merged, PR #5) — see Performance investigation above. Budget reset to 2500ms (Google's "good" threshold) and the gate is intentionally left red through Phase 2; root cause (80–85% Render Delay on a page with no resource-load dependency) not fully isolated, logged as a Phase 3 revisit. Phase 2 measured a further real LCP regression on `/` from adding the nav shell — see Phase 2 section below, not yet chased either.
- `CLEANUP-PROMPT.md` sits in the repo root as an untracked file (the prompt that drove this cleanup pass) — never committed anywhere. Not part of any task's scope. A human should decide whether it gets committed like `KICKOFF-PROMPT.md` was, or left local/deleted.
- `TODO(kalob)` placeholders still open in `content/practice.ts`: hours, dentist credentials, service list, and insurances are filled now (from PLAN.md's live-site audit, marked practice-stated-not-independently-verified in comments) — only **form endpoint**, **social links**, and **per-insurer in-network-vs-accepts-and-files status** are still genuinely open. Confirm the filled values with the office too (NEXT-STEPS.md §4/§5), especially current Friday hours and the insurance distinction.
- Gold hex is a proposal read off a screenshot (`#A28D74`/`#B09B82`), not sampled from the actual logo artwork — NEXT-STEPS.md §1 has the real logo file identified in Drive and a resample procedure; hasn't been done. Marked `TODO(kalob)` directly on the token in `globals.css`.
- No logo asset in the repo yet (`assets/brand/logo.jpg` was removed in the V2 reset) — Nav currently renders a text wordmark. NEXT-STEPS.md §1 identifies the real file in Drive; once it's extracted into `public/brand/`, swapping it in is a Nav-only change.
- No real photography in the repo yet — `/dev/primitives`' `RevealImage` demo uses an obvious placeholder SVG (`public/dev/placeholder.svg`), per CLAUDE.md's no-fake-photos rule. NEXT-STEPS.md §2 has a ship-ready set identified from the practice's Drive; hasn't been extracted/prepped into `public/images/` yet.

## Phase 2 — nav shell, drawer, footer, mobile bottom bar (branch `phase-2-shell`)

Built per KICKOFF-PROMPT.md's Phase 2 script, gated in three stops (harness/desktop nav, mobile drawer, footer/bottom bar). All in `components/shell/`, composed by `components/shell/shell.tsx` and used by both `app/(marketing)/layout.tsx` (real routes) and `app/dev/shell` (the review harness — the actual Shell component, not a reimplementation).

**Architecture note for Phase 3:** the hero doesn't exist yet, but Nav's "transparent over hero, solidifies on scroll" contract does — `TransparentHeroZone` (`components/shell/transparent-hero-zone.tsx`) is the opt-in a page wraps its hero in; `ShellChromeProvider` (`components/shell/shell-chrome.tsx`) is the context coordinating Nav, the drawer, and page content, since they don't share a parent/child relationship. Nav is solid by default; interior pages (all six stubs, today's `/`) never opt in. `ThemeSection` still doesn't know Nav exists — pages wire its `onThemeChangeAction` straight to `setActiveTheme` from `useShellChrome()`.

**Gate 1 — harness, stubs, desktop nav:**
- `/dev/shell` — dummy full-viewport dark hero (`TransparentHeroZone` + `ThemeSection`) plus three alternating scroll sections, enough to exercise transparent→solid, color inversion while transparent, and staying solid once solidified regardless of what scrolls by underneath.
- Six stub routes, all added to `tests/routes.ts`: `/about`, `/services`, `/new-patients`, `/smile-gallery`, `/contact`, `/emergency-dentist`. Contact and Emergency Dentist stubs go further than a bare placeholder — they surface the phone number and (Contact) `practice.bookingDisclaimer` directly, since a visitor hitting either mid-build should still be able to act.
- Desktop nav: logo (text wordmark — no logo asset exists, see Outstanding), 5 links, phone as a plain `tel:` link, `Request an Appointment` CTA via `SwapButton`.
- Skip link is the first element in the DOM on every marketing page, before Nav.

**Gate 2 — mobile drawer** (`components/shell/mobile-drawer.tsx`), verified against every item on the required list:
- Portals to `document.body` via `createPortal` — has to be structurally outside the `inert` wrapper Shell puts around the rest of the page while it's open.
- Focus moves to the close button on open, returns to the trigger on close (both verified by element identity, not just attribute presence).
- Tab/Shift+Tab trapped inside the panel via a manual `keydown` handler walking the panel's own focusable elements; Escape closes.
- `aria-expanded` on the trigger, `aria-controls="mobile-drawer"` pointing at the dialog panel specifically (not the portal's backdrop+panel wrapper).
- Background (Nav, main, footer, bottom bar — everything except the drawer itself) is `inert` while open, verified on the actual element it's set on (`[data-shell-content]`), not a descendant — inert doesn't propagate as a JS property to children, only the behavior does.
- Scroll lock compensates for scrollbar-width via measured `padding-right`, no layout shift.
- CSS-only slide/fade (not a Motion primitive — this is chrome, not a section), gated by the same `data-reduced-motion` pattern as the rest of the primitives; closed state uses a delayed `visibility: hidden` (not just off-screen transform) so it's genuinely non-interactive and non-visible while closed, not just visually elsewhere.

*How I verified it* (the ask was to actually do this and report, not assert it): real keyboard-driven navigation against a running production build — Tab from page load lands on the skip link, then the logo, then the hamburger trigger (`aria-controls="mobile-drawer"` confirms it); Enter opens the drawer and focus lands on "Close menu"; Tab eight times walks About → Services → New Patients → Smile Gallery → Contact → phone → Emergency Dentist → Request an Appointment, staying inside the dialog the whole way; Shift+Tab from the close button wraps to the last item (Request an Appointment), confirming the trap cycles both directions; Escape closes it and returns focus to the trigger button by strict element-identity check; background content's `inert` property reads `true` for the whole time the drawer is open. Repeated under `prefers-reduced-motion: reduce` with the same results. Automated as `tests/mobile-drawer.spec.ts` (10 cases × normal/reduced-motion), run green twice in a row to rule out flake, consistent with this project's existing testing standard.

**Gate 3 — footer and mobile bottom bar:**
- Footer (`components/shell/footer.tsx`): NAP from `content/practice.ts` only, hours and insurance rendered via a new `TodoPlaceholder` component (`components/ui/todo-placeholder.tsx`) — visibly unfinished (dashed border, obviously a placeholder), not invented. Service area towns, a Google Maps search link built from the verified address components, secondary nav.
- Mobile bottom bar (`components/shell/mobile-bottom-bar.tsx`): persistent "Call" / "Request an Appointment", both wired to a new `lib/analytics.ts` `trackEvent()` seam — logs to console in dev, no-ops otherwise, ready for Phase 5 to point at a real provider.
- Content clearance: Shell's content wrapper carries bottom padding matched to the bar's breakpoint so the bar never covers a page's last element.

**Bugs found and fixed during Gate 1 review** (same "build it, then break it against a real viewport" process as Phase 1):
- `SwapButton` (a Phase 1 primitive) had no `shrink-0`/`whitespace-nowrap` protection. Its two-line-stack slide mechanic requires exactly one line of text; squeezed into Nav's flex row, "Emergency Dentist" and "Request an Appointment" wrapped and the `h-[1.2em] overflow-hidden` label wrapper silently clipped the second line to nothing. Fixed in the primitive itself (not patched at the call site) since any flex context could trigger it.
- Nav's desktop content (logo + 5 links + phone + 2 CTAs) didn't actually fit `Container`'s 1440px max-width at any realistic viewport — measured the true single-line requirement at ~1443px, i.e. wider than the container itself. Fixed by: dropping the "Emergency Dentist" pill from the persistent desktop row (Gate 1 only asked for logo/links/CTA/phone — it stays reachable via the drawer, footer, and its own stub page), tightening nav link/gap sizing, and moving the full-desktop-nav breakpoint from `lg` (1024px) to `xl` (1280px) so the drawer (already fully verified) covers the gap instead of a half-broken squeeze. Verified via Playwright at 320–1920px: header height stays constant (no wrap) at every width, hamburger shows cleanly below 1280px with no in-between broken state.
- `TransparentHeroZone` used `useEffect`, which fires after the browser's first paint — since Nav and the hero live in different parts of the tree, this produced a real, visible flash of solid-then-transparent nav on every load of a page with a hero. Switched to `useLayoutEffect`, which runs before paint, eliminating the post-hydration flash.

**Found, reported, deliberately not fixed this phase:**
- The `useLayoutEffect` fix above only closes the *post-hydration* flash. `/dev/shell` (the only route using `TransparentHeroZone` right now) still shows solid nav in the raw server-rendered HTML for the brief window before client JS hydrates — an inherent SSR-to-hydration gap, not something a layout effect can retroactively fix, since effects can't run before hydration starts. Solving it fully would mean making hero-transparency a server-known, per-route value instead of client-effect-driven, which isn't worth designing against a throwaway harness page — Phase 3's real hero will have concrete requirements (actual height, actual content) worth designing that against. Logged here so it isn't rediscovered as a surprise. **Correction (Gate 3, `chore/palette-content-shell`): this visual flash was, at the time, conflated with a real console hydration error (React #418) that showed up around the same work. They were unrelated — the error's actual cause was `MobileDrawer` branching on `typeof document === "undefined"`, fixed below. The visual SSR-to-hydration gap described in this bullet is still real and still not fixed, on purpose, for the reason stated above.**
- Footer's address is formatted from the verified street/city/state/zip components in `content/practice.ts`, but the exact concatenated string hasn't been checked character-for-character against the live Google Business Profile listing (CLAUDE.md rule #10). The components are verified; the display formatting isn't.
- Mobile bottom bar follows best practice for the on-screen-keyboard-overlap concern (`position: fixed`, no viewport-height layout tricks that break under keyboard resize), but there's no real form to test against yet — that's Phase 4/5. Don't treat this as verified on a physical device.

**lhci, before vs. after this phase** (`simulate` throttling, n=3, localhost — `/dev/tokens` and `/dev/primitives` don't render the new shell at all and are included as a control):

| Route | Metric | Before (main, PR #5) | After (this phase) |
|---|---|---|---|
| `/` | LCP | 2710ms | **3157ms** |
| `/` | TBT | 69ms | 42ms |
| `/` | CLS | 0 | 0 |
| `/dev/tokens` (control) | LCP | 2707ms | 2708ms |
| `/dev/primitives` (control) | LCP | 3158ms | 3161ms |

TBT and CLS are fine — TBT actually improved, CLS stayed at 0 despite adding two `position: fixed` elements (nav, bottom bar). **LCP on `/` got meaningfully worse (+447ms)**, and the controls (structurally untouched by this phase, still outside `(marketing)/`) barely moved, which rules out measurement noise as the explanation — the nav shell is the cause. The added cost lands entirely in Render Delay (86% of LCP now vs. the low-80s% before), the same unexplained phase the perf investigation already flagged and deferred to Phase 3. Not chased further here — reported per the explicit instruction not to make things worse silently, and left as evidence for whoever picks up that Phase 3 revisit. Not chased in Gate 3 either, per explicit instruction — same reasoning, same deferral.

## Gate 3 — target sizes and a real hydration fix (branch `chore/palette-content-shell`)

axe (the tool `pnpm test:a11y` runs) checks color contrast and a long list of other WCAG rules, but **not** target size (SC 2.5.8) — Phase 2's shell shipped 23px nav links and 26px footer links straight through a green run. Gate 3 closed that gap directly instead of continuing to trust axe for something it doesn't check.

**Bar used: 44×44px, not WCAG's 24×24 minimum.** CLAUDE.md/PLAN.md's audience (35–65 year olds) is the reason, not the legal floor. Padding does the work everywhere, not font-size or line-height — text stays at its designed size (`text-body`/`text-lead`), hit areas grow via `py-*`/`px-*` on `inline-flex items-center` wrappers.

**Measured heights, after** (Playwright bounding boxes, not axe — axe doesn't check this):

| Element | Desktop (≥1400px) | Mobile (<1400px) |
|---|---|---|
| Logo | 80px | 68px |
| Nav links (About/Services/New Patients/Contact) | 74px | — (in drawer instead) |
| Phone pill | 68px | — (in drawer instead) |
| Emergency pill | 66px | — (in drawer instead) |
| Primary CTA (`SwapButton`) | 68px | 68px (in drawer) |
| Hamburger trigger / drawer close button | — | 56px / 56px |
| Drawer nav rows | — | 75px, 8px gaps between rows |
| Drawer phone pill | — | 69px |
| Footer phone / directions / nav links | 66px / 63px / 66px | same (footer doesn't change by viewport) |
| Mobile bottom bar (Call / Request an Appointment) | — | 90px |

All ≥44px. Reporting this, not asserting it's fixed — the actual assertion lives in the new `tests/target-size.spec.ts`, wired into `pnpm test:a11y`: 6 cases covering desktop header/footer and mobile header/footer/drawer/bottom-bar, each walking every `a[href]`/`button:not([disabled])` in its container and failing with the specific undersized element(s) named if anything is under 44×44. The skip link is deliberately excluded — it's `sr-only` until keyboard-focused, so it has no meaningful pointer-target box in its default state, and forcing a hidden element to 44×44 wouldn't test anything real.

**The width problem this reopened.** Growing every nav element to a real hit area blew Phase 2/Gate 1's carefully-fitted desktop nav width — measured (not calculated) overflow of 149px at 1280px right after the sizing changes landed. Padding can't shrink below what 44px needs and font-size is explicitly off the table, so the only real levers left were tighter gaps (`gap-1`/8px throughout, down from `gap-2`–`gap-4`) and trimming horizontal-only padding on the phone/Emergency pills (`px-4`→`px-3`, doesn't touch the 44px height). That recovered about 90px but still wasn't enough — measured the real fit threshold empirically rather than guessing again: 1350px still only had ~9px margin (too fragile), 1400px had 57px. Landed on a custom `min-[1400px]:` breakpoint rather than jumping to the `2xl`/1536px default, which would have pushed the common 1366–1536px laptop range into hamburger mode for no reason. Verified clean (no wrap, no overflow, real margin) from 1400px to 1920px, and a clean hamburger-to-full-nav transition with no broken in-between state from 320px up to 1399px.

**Phone number's visual weight.** Was the smallest, least-styled thing in the nav — a plain underlined text link — despite being the site's primary conversion (CLAUDE.md). Now a bordered pill with a phone icon and bold text, sized on par with the CTAs either side of it. Desktop uses `border-current` so it reads correctly in both Nav's transparent (cream text over a dark hero) and solid (ink text) states, the same mechanism the rest of the header's text color already uses; the drawer version uses a fixed `border-ink` since that panel is always cream/ink regardless of scroll state. Same treatment applied to the drawer's version and, since "every interactive element in the shell" reads Footer in too, Footer's phone/directions/nav links as well — none of those three were named explicitly in the gate but all were well under 44px.

**The hydration error — corrected diagnosis.** Previously logged (above) as an SSR-to-hydration timing gap tied to the nav-color flash. That diagnosis was wrong: the real cause was unrelated to the hero/nav-color work entirely. `MobileDrawer` branched on `if (typeof document === "undefined") return null` to skip its `createPortal` call during SSR (`document` doesn't exist in Node). That check evaluates `false` immediately in the browser, including on the client's very first, pre-hydration render — so the client's first render already disagreed with the server's, and React's hydration diffing flagged exactly that (console error, React #418, reproduced and confirmed before the fix). Fixed by replacing the branch with a `useMounted()` hook (`components/shell/use-mounted.ts`) built on `useSyncExternalStore` — same pattern `use-scrolled.ts` and `motion/motion-preference.tsx` already use for this exact server/client split, returning `false` via `getServerSnapshot` and `true` client-side, so the server and the client's first render agree and only a later, client-only render swaps in the real portal content. (A first attempt used plain `useState(false)` + a mount `useEffect` — functionally correct, but tripped `eslint-plugin-react-hooks`'s `set-state-in-effect` rule; `useSyncExternalStore` avoids that entirely and matches existing code, so it's what shipped.) Confirmed clean via the browser console on both `next dev` and a real production build after a hard reload — zero errors, was reproducibly present before the fix.

**Bugs found and fixed along the way:**
- Footer's nav/phone/directions links were 23–26px tall — never explicitly named in the gate ("every interactive element in the shell" caught them), same padding-driven fix as everything else.
- Nav's logo link was 36px tall on mobile — same fix.

The Phase 2 LCP regression wasn't touched this gate either, per explicit instruction — still deferred to Phase 3.

### Gate 3 correction — breakpoint still isn't at PLAN.md §3's 1024px target

PR #7 review caught that `min-[1400px]:` puts every 1366×768 laptop, every 1280px window, and any non-maximized browser on a 1440 display into the hamburger — directly contradicting PLAN.md §3 ("no hamburger above 1024px"), which exists specifically because a hamburger-hidden nav was the client's own stated complaint about their current site. The breakpoint had moved `lg`(1024px) → `xl`(1280px) → `1400px` across three gates, each time by raising the threshold instead of reducing what has to fit — called out directly as the wrong pattern, and rightly so.

**Two real content cuts made in response, not spacing tricks:**
- CTA label: "Request an Appointment" → "Request a Visit" everywhere (nav, drawer, bottom bar, the `/dev/primitives` demo, and the `trackEvent` name it fires). "Request," not "Book" — `practice.bookingDisclaimer` exists specifically because the form produces a callback, not a confirmed appointment; "Book" would contradict that. Natural width dropped from 281px to 207px.
- Logo: `font-display text-h3` → `font-display text-lead` — the next step down in the existing type scale, not a new token (rule #1). 262px → 182px at full size. Padding went from `py-2` to `py-2.5` specifically to hold the 44px hit area even though the text itself shrank.

**Re-measured empirically at all 5 requested widths, not calculated** (Playwright `boundingBox()`, `/dev/shell`, `simulate`-free real layout):

| Width | Result |
|---|---|
| 1024px | **overflow by 113.1px** |
| 1280px | fits, 64.0px margin |
| 1366px | fits, 68.3px margin |
| 1440px | fits, 72.0px margin |
| 1920px | fits, 336.0px margin |

1024px genuinely doesn't work yet, even after both cuts. Per instruction, the breakpoint was **not** raised again to paper over that — reverted to the same `min-[1400px]:` the PR already had (the last known-working, already-open-for-review state) as a neutral holding position while this gets decided, not a new unilateral answer.

**Real per-element widths at full size** (unconstrained, 1920px viewport), for whoever decides what else comes out:

| Element | Width |
|---|---|
| Nav links (About/Services/New Patients/Contact) combined | ~326px |
| Phone pill | 195px |
| CTA button | 207px |
| Emergency pill | 137px |
| Logo | 182px |

Closing a 113px gap from here means one of: dropping the Emergency pill from the persistent desktop row again (contradicts Gate 1's explicit fix, which put it there specifically so it's reachable without opening any menu), dropping or shrinking the phone pill's treatment (in tension with "phone number never behind a menu"), shortening a nav link label (an IA/content call, not an engineering one), or reducing `SwapButton`'s base padding sitewide (a bigger, unrequested design change since every CTA on the site uses it). None of these were decided here — flagged for a human call, per instruction.

## Next: Phase 3 (per KICKOFF-PROMPT.md)

Home page sections (13 sections, DESIGN-SYSTEM.md §4), built from the Phase 1 motion primitives inside the Phase 2 shell. STOP for review before Phase 4 (interior page content replacing today's stubs).

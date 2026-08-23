/**
 * Home page narrative copy — the visitor this page is written for: an adult
 * in or near Booneville, 35-65, who has put off a dental visit, afraid of
 * two things — pain, and a bill they can't handle. Every section either
 * answers one of those fears or gets out of the way.
 *
 * Facts (years, services, insurance) come from content/practice.ts and are
 * never restated here — only original narrative copy lives in this file.
 */
import { practice } from "./practice";

// Hero headline is structural-only per the Phase 3 stone-hero rebuild
// directive — Kalob owns the real copy. Bracket placeholder, not proposed
// text.
export const hero = {
  eyebrow: "Park Place Dental",
  headline: "[Headline goes here]",
  subhead: "[One-line subhead goes here]",
  cta: "Request a Visit",
} as const;

// Scannable in two seconds, in the visitor's own priority order.
export const trustStrip = [
  "43 years",
  "Same-day in-house lab",
  "Most major insurance",
  "Emergency care",
] as const;

export const comfort = {
  eyebrow: "Comfort",
  heading: "Often, no shot at all",
  // Verbatim from practice.differentiators — practice-approved phrasing,
  // never upgraded into a stronger claim (CLAUDE.md rule #9).
  body: practice.differentiators.find((d) => d.key === "solea")!.body,
} as const;

// PLAN.md §1's four practice-approved first-visit steps, in the site's own
// voice. Step 3 states plainly that cost is known before treatment starts —
// echoing the practice's own financing-page line "no surprises, no
// pressure, just honest guidance" — without promising a figure (rule #9).
export const firstVisit = {
  eyebrow: "Your first visit",
  heading: "Start to finish",
  steps: [
    {
      number: "01",
      label: "One-on-one attention",
      detail: "You get real attention from the moment you walk in — not rushed through on a schedule.",
    },
    {
      number: "02",
      label: "A full exam, not a glance",
      detail: "A comprehensive exam and digital imaging, so nothing gets missed and nothing gets guessed at.",
    },
    {
      number: "03",
      label: "You'll know the cost first",
      detail:
        "Before any treatment starts, you'll know what it costs and why — no surprises, no pressure, just honest guidance.",
    },
    {
      number: "04",
      label: "Comfort built in",
      detail: "From quieter tools to same-day options, the visit itself is built around making it easier on you.",
    },
  ],
} as const;

export const services = {
  eyebrow: "Services",
  heading: "What we treat",
  emergency: "In pain or dealing with a dental emergency?",
} as const;

export const meetDentist = {
  eyebrow: "About",
  heading: "Dr. Ken Goodwin",
  body: practice.dentist.credentials,
} as const;

export const team = {
  eyebrow: "The team",
  heading: "Who you'll actually see",
} as const;

export const insurance = {
  eyebrow: "Insurance & payment",
  heading: "Most major plans accepted",
  confirmLine: "Call to confirm your plan is in-network before your visit.",
} as const;

export const location = {
  eyebrow: "Location",
  heading: "Serving Prentiss County",
} as const;

export const ctaFooter = {
  heading: "[Closing headline goes here]",
} as const;

/**
 * Single source of truth for practice facts (NAP, hours, services, insurances,
 * service area). Import this everywhere instead of restating any of it inline.
 *
 * Verified facts (name, address, phone, email, dentist name) come from
 * PROJECT-TRUTH.md, the client-confirmed handoff from discovery.
 *
 * Everything marked "practice-stated" below was harvested from the practice's
 * own published site and Drive assets (PLAN.md §1 / NEXT-STEPS.md), not
 * independently verified with the office — treat it as strong but not final.
 * Confirm before launch, especially insurance in-network-vs-accepts status
 * and current Friday hours (NEXT-STEPS.md §4/§5). Do not fill anything in
 * from the old rejected mockups; those speculated values that were never
 * confirmed by anyone.
 */

export const practice = {
  name: "Park Place Dental",

  dentist: {
    name: "Dr. Ken Goodwin",
    // Confirmed spelling only — never "Kevin Goodwin," which is an incorrect
    // name circulating on the old site's home page (PLAN.md §1 catches the
    // same site contradicting itself) and aggregator listings.
    credentials:
      "BA, University of Mississippi, 1978. DMD, University of Mississippi School of Dentistry, 1982. 43+ years in practice. Originally from Booneville — returned to his hometown.",
    // Practice-stated (PLAN.md §1), not independently verified against
    // university or board records.
  },

  nap: {
    phone: "(662) 728-8171",
    phoneHref: "tel:+16627288171",
    email: "apptatppd@gmail.com",
    address: {
      street: "403 N 3rd St",
      city: "Booneville",
      state: "MS",
      zip: "38829",
    },
  },

  // Practice-stated (PLAN.md §1) — confirm current Friday hours with the
  // office before launch (NEXT-STEPS.md §4).
  hours: "Monday–Friday, 8:30 AM – 5:00 PM. Friday hours may vary.",

  // Displayed to satisfy PROJECT-TRUTH.md's "do not imply confirmed booking
  // when the form only requests a callback" guardrail.
  bookingDisclaimer:
    "Appointment requests are callback requests, not confirmed bookings — our team will call you to find a time.",

  county: "Prentiss County",

  serviceAreaTowns: [
    "Booneville",
    "Baldwyn",
    "Rienzi",
    "Jumpertown",
    "New Site",
    "Blue Mountain",
  ],

  // Practice-stated (PLAN.md §1) — exact in-house scope (which procedures
  // within each category are actually performed on-site vs. referred out)
  // is not independently confirmed.
  services: [
    { category: "General", detail: "Cleanings and exams, fillings, root canals, emergency care" },
    { category: "Restorative", detail: "Implants, crowns and bridges, dentures" },
    { category: "Cosmetic", detail: "Veneers, whitening, smile makeovers" },
    { category: "Periodontal", detail: "Gum disease treatment" },
    { category: "Facial aesthetics", detail: "Botox, dermal fillers" },
  ],

  insurances: {
    // Practice-stated list of accepted plans (PLAN.md §1).
    accepted: [
      "Aetna (Medicare and commercial)",
      "Cigna",
      "Delta Dental",
      "Guardian",
      "MetLife",
      "Sunlife",
      "UMR",
      "Always Care / Unum",
      "Equitable",
      "Medicaid and MSCAN Magnolia",
    ],
    financing: "CareCredit",
    // TODO(kalob): confirm in-network vs. accepts-and-files status for each
    // insurer above. Real distinction, not a formality — getting it wrong
    // generates complaints (PLAN.md §1, NEXT-STEPS.md §5). Never state or
    // imply in-network status for any insurer until this is confirmed.
  },

  // The three things PLAN.md §1 found buried on the practice's current site
  // — these lead the Phase 3 home page instead.
  differentiators: [
    {
      key: "solea",
      label: "Solea dental laser",
      // Phrased carefully per PLAN.md §1 — "in many cases," never a
      // guarantee (CLAUDE.md rule #9: no medical guarantees).
      body: "Quieter, less anxiety, and in many cases little to no need for anesthesia.",
    },
    {
      key: "in-house-lab",
      label: "In-house dental lab",
      body: "Same-day crowns, veneers, and dentures — no waiting on an outside lab.",
    },
    {
      key: "local",
      label: "43 years, Booneville born",
      body: "Dr. Goodwin is originally from Booneville and returned to his hometown to practice.",
    },
  ] as const,

  // Practice-stated capabilities (PLAN.md §1 / NEXT-STEPS.md), not yet
  // worked into page copy anywhere — Phase 3/4 content decides where these
  // surface.
  vaProvider: true,
  facialScanner: "RAYFace 3D facial scanner",

  socials: {
    facebook: "TODO(kalob): confirm https://facebook.com/parkplacedentalms is still current",
    instagram: "TODO(kalob): confirm https://instagram.com/dentalparkplace is still current",
  },

  formEndpoint: "TODO(kalob): form endpoint",
} as const;

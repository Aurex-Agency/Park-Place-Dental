/**
 * Single source of truth for practice facts (NAP, hours, services, insurances,
 * service area). Import this everywhere instead of restating any of it inline.
 *
 * Verified facts (name, address, phone, email, dentist name) come from
 * PROJECT-TRUTH.md, the client-confirmed handoff from discovery. Everything
 * else is still open per that doc's "Practice-stated facts requiring
 * confirmation" and "Open client decisions" sections — those stay as
 * TODO(kalob) until the practice confirms them. Do not fill them in from the
 * old rejected mockups; those speculated values that were never confirmed.
 */

export const practice = {
  name: "Park Place Dental",

  dentist: {
    name: "Dr. Ken Goodwin",
    // Confirmed spelling only — never "Kevin Goodwin," which is an incorrect
    // name circulating on the old site and aggregator listings.
    credentials: "TODO(kalob): dentist credentials (degree, affiliations, VA provider status)",
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

  hours: "TODO(kalob): hours — practice states Mon–Fri 8:30 AM–5:00 PM with variable Friday hours, unconfirmed",

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

  services: "TODO(kalob): current service list — old mockups referenced General & Preventive, Cosmetic, Restorative, Emergency, Children's, Implants & Whitening, but exact in-house scope (crowns, veneers, dentures, implants, root canals) is unconfirmed",

  insurances: "TODO(kalob): insurances accepted — distinguish in-network participation from merely filing claims per PROJECT-TRUTH.md",

  socials: {
    facebook: "TODO(kalob): confirm https://facebook.com/parkplacedentalms is still current",
    instagram: "TODO(kalob): confirm https://instagram.com/dentalparkplace is still current",
  },

  formEndpoint: "TODO(kalob): form endpoint",
} as const;

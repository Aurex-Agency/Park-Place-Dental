import Link from "next/link";
import { practice } from "@/content/practice";
import { Container } from "./container";
import { NAV_LINKS } from "./nav-links";

const LINK_CLASS =
  "rounded-sm text-body text-cream/80 outline-none underline-offset-4 hover:text-cream hover:underline focus-visible:ring-2 focus-visible:ring-focus";

// CLAUDE.md rule #10: must match the Google Business Profile character-for-
// character. The components below (street/city/state/zip) are verified —
// this concatenated display string hasn't been checked against the live GBP
// listing's exact formatting yet. See STATUS.md.
const FULL_ADDRESS = `${practice.nap.address.street}, ${practice.nap.address.city}, ${practice.nap.address.state} ${practice.nap.address.zip}`;
const MAPS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FULL_ADDRESS)}`;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-cream">
      <Container className="py-section">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-display text-h3">{practice.name}</p>
            <address className="mt-4 not-italic text-body text-cream/80">
              {practice.nap.address.street}
              <br />
              {practice.nap.address.city}, {practice.nap.address.state} {practice.nap.address.zip}
            </address>
            <a
              href={practice.nap.phoneHref}
              className="mt-3 block rounded-sm text-body font-medium text-cream outline-none underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-focus"
            >
              {practice.nap.phone}
            </a>
            <a
              href={MAPS_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block rounded-sm text-small text-cream/70 outline-none underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-focus"
            >
              Get directions
            </a>
          </div>

          <div>
            <p className="text-eyebrow uppercase tracking-eyebrow text-cream/60">Hours</p>
            <p className="mt-2 text-body text-cream/80">{practice.hours}</p>

            <p className="mt-6 text-eyebrow uppercase tracking-eyebrow text-cream/60">Insurance</p>
            <p className="mt-2 text-body text-cream/80">
              {practice.insurances.accepted.join(", ")}. Financing available through {practice.insurances.financing}.
            </p>
            {/* Real per-insurer network status isn't confirmed yet (see
                content/practice.ts) — this caveat is honest without
                asserting in-network status we haven't verified. */}
            <p className="mt-2 text-small text-cream/60">
              Call to confirm your plan is in-network before your visit.
            </p>
          </div>

          <div>
            <p className="text-eyebrow uppercase tracking-eyebrow text-cream/60">Serving</p>
            <p className="mt-2 text-body text-cream/80">{practice.serviceAreaTowns.join(" · ")}</p>
            <nav aria-label="Footer" className="mt-6 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={LINK_CLASS}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <p className="mt-12 text-small text-cream/50">
          © {year} {practice.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

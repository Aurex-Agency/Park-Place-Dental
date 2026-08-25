"use client";

import { ThemeSection } from "@/components/motion";
import { Container } from "@/components/shell/container";
import { trustStrip } from "@/content/home";

/**
 * Differs from Hero: no object, no motion — four flat facts, the page's
 * first "read this fast" beat right where the hero hands off. Hairline
 * rules (bar.md M5) separate the facts instead of cards (M6).
 */
export function TrustStrip() {
  return (
    <ThemeSection theme="dark" className="py-16">
      <Container>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-8">
          {trustStrip.map((fact) => (
            <li key={fact} className="border-t border-cream/20 pt-4">
              <p className="font-display text-h3 text-cream">{fact}</p>
            </li>
          ))}
        </ul>
      </Container>
    </ThemeSection>
  );
}

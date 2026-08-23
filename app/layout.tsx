import type { Metadata } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { MotionPreferenceProvider } from "@/components/motion/motion-preference";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
  preload: true,
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Park Place Dental | General Dentistry in Booneville, MS",
  description:
    "Park Place Dental is a general dental practice in Booneville, Mississippi, serving Prentiss County with calm, modern, unintimidating care.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${interTight.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Motion writes each primitive's `initial` prop as inline style at
            render time (opacity/transform/clip-path) and only clears it by
            running client JS on mount — without JS, anything using
            `initial` stays pinned to its pre-reveal state forever (found on
            SplitReveal/RevealImage during Phase 3 Gate 1: real content
            rendered permanently invisible under CLAUDE.md's "readable with
            JS disabled" requirement). `<noscript>` is the only reliably
            cross-browser way to detect that state and override inline
            styles, which beat any plain class on specificity alone.
            data-motion-reveal: force the element to its at-rest revealed
            state (opacity/transform/clip-path neutralized) — safe wherever
            that rest state is already the correct content (a headline line,
            an image, a word, a sticky-rail label). data-motion-only /
            data-motion-fallback: for primitives where the animated markup
            has no valid static reading (Odometer's rolling digit strips
            would show "0" for every digit, not the real number) — hide the
            animation-only markup and reveal the paired sr-only fallback
            instead of a plain text node. */}
        <noscript>
          <style>{`
            [data-motion-reveal] { opacity: 1 !important; transform: none !important; clip-path: none !important; }
            [data-motion-only] { display: none !important; }
            [data-motion-fallback] {
              position: static !important;
              width: auto !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow: visible !important;
              clip: auto !important;
              clip-path: none !important;
              white-space: normal !important;
            }
          `}</style>
        </noscript>
        <MotionPreferenceProvider>
          <LenisProvider>{children}</LenisProvider>
        </MotionPreferenceProvider>
      </body>
    </html>
  );
}

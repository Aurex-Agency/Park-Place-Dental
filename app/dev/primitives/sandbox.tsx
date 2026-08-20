"use client";

import { useState } from "react";
import {
  MotionPreferenceProvider,
  Marquee,
  Odometer,
  Preloader,
  RevealImage,
  SplitReveal,
  StickySteps,
  SwapButton,
  ThemeSection,
  WordRotator,
  type Step,
} from "@/components/motion";

type MotionSetting = "system" | "motion" | "reduced";

const STEPS: Step[] = [
  { number: "01", label: "Book in under a minute", detail: "Call or request a time online — no account, no portal." },
  { number: "02", label: "What we do at your first exam", detail: "A look, a cleaning, and a plain-language plan." },
  { number: "03", label: "Your plan and what it costs", detail: "Costs and options before anything starts." },
  { number: "04", label: "Ongoing care that fits your schedule", detail: "Reminders that work around your week." },
];

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-ink/10 py-16">
      <h2 className="font-display text-h3 text-ink">{title}</h2>
      <p className="mt-2 max-w-[60ch] text-body text-ink/60">{description}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function PrimitivesSandbox() {
  const [motionSetting, setMotionSetting] = useState<MotionSetting>("system");
  const [preloaderKey, setPreloaderKey] = useState(0);
  const [activeTheme, setActiveTheme] = useState<"dark" | "light">("light");
  // Stability proof for Task 3's guard: both callbacks below are fresh inline
  // arrows every render (not useCallback), deliberately reproducing the shape
  // that used to cause StickySteps' infinite render loop. If the counters
  // stay small and settle rather than climbing unboundedly, the ref guard in
  // the primitive is doing its job.
  const [stickyStepsFireCount, setStickyStepsFireCount] = useState(0);
  const [inlineThemeFireCount, setInlineThemeFireCount] = useState(0);

  const forceReducedMotion = motionSetting === "system" ? undefined : motionSetting === "reduced";

  return (
    <MotionPreferenceProvider forceReducedMotion={forceReducedMotion}>
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-ink/10 bg-cream/95 px-gutter py-4 backdrop-blur">
        <span className="text-small text-ink/60">Motion:</span>
        {(["system", "motion", "reduced"] as const).map((setting) => (
          <button
            key={setting}
            type="button"
            onClick={() => setMotionSetting(setting)}
            className={`rounded-pill px-3 py-1 text-small capitalize outline-none focus-visible:ring-2 focus-visible:ring-focus ${
              motionSetting === setting ? "bg-navy-mid text-white" : "border border-ink/20 text-ink"
            }`}
          >
            {setting}
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-[var(--container-max)] px-gutter">
        <Section
          title="Preloader"
          description="Counts 00→100 once per session, then a curtain wipe. Session flag means it only fires once — use Replay to see it again."
        >
          <button
            type="button"
            onClick={() => {
              try {
                sessionStorage.removeItem("ppd-preloader-seen");
              } catch {
                // ignore
              }
              setPreloaderKey((k) => k + 1);
            }}
            className="rounded-pill border border-ink/20 px-4 py-2 text-small outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            Replay preloader
          </button>
          <Preloader key={preloaderKey} />
        </Section>

        <Section title="SplitReveal" description="Each line reveals with translateY + opacity, staggered 60ms. Scroll it out of view and back — it should not re-animate.">
          <SplitReveal as="h3" className="font-display text-d2 text-ink" lines={["Dentistry that feels", "calm and close to home."]} />
        </Section>

        <Section title="WordRotator" description="Cycles words every 2.2s with a y-slide swap. Under reduced motion it holds on the first word.">
          <p className="font-display text-d2 text-ink">
            Dentistry that feels <WordRotator words={["calm.", "modern.", "close to home."]} className="text-navy-mid" />
          </p>
        </Section>

        <Section title="Odometer" description="Rolling digit columns animate to the target value once in view; reduced motion snaps straight to the final value.">
          <div className="flex flex-wrap gap-12 font-display text-d1 text-navy-mid">
            <Odometer value={42} suffix="yrs" />
            <Odometer value={12000} suffix="+" />
            <Odometer value={4} prefix="4." suffix=" avg" />
          </div>
        </Section>

        <Section title="Marquee" description="CSS-only infinite ticker, duplicated track. Hover to pause; reduced motion freezes it.">
          <div className="flex flex-col gap-6">
            <Marquee speed={18}>
              {["General & Preventive", "Cosmetic", "Restorative", "Emergency", "Children's", "Implants & Whitening"].map((service) => (
                <span key={service} className="px-8 text-h3 text-ink/50">
                  {service}
                </span>
              ))}
            </Marquee>
            <Marquee speed={18} direction="reverse">
              {["General & Preventive", "Cosmetic", "Restorative", "Emergency", "Children's", "Implants & Whitening"].map((service) => (
                <span key={service} className="px-8 text-h3 text-ink/50">
                  {service}
                </span>
              ))}
            </Marquee>
          </div>
        </Section>

        <Section title="SwapButton" description="Two stacked label copies slide up one line-height on hover or focus-visible. Tab to each button to check the focus path.">
          <div className="flex flex-wrap items-center gap-4">
            <SwapButton variant="primary">Request an Appointment</SwapButton>
            <SwapButton variant="ghost">Call (662) 728-8171</SwapButton>
            <SwapButton variant="danger">Emergency? Call now</SwapButton>
            <SwapButton variant="primary" href="tel:+16627288171">
              Anchor variant
            </SwapButton>
          </div>
        </Section>

        <Section title="StickySteps" description="Left rail pins the active step as you scroll the right column. Resize under md to see it collapse to a stacked list.">
          <p className="mb-4 text-small text-ink/70">
            Stability test — onActiveIndexChangeAction below is a fresh inline arrow every
            render, not useCallback. Fired <strong>{stickyStepsFireCount}</strong> times; it
            should settle small (one per step scrolled through), never climb unboundedly.
          </p>
          <StickySteps
            steps={STEPS}
            onActiveIndexChangeAction={() => setStickyStepsFireCount((c) => c + 1)}
          />
        </Section>

        <Section title="RevealImage" description="clip-path wipe + slight scale-to-rest on the inner image, via next/image. Placeholder graphic — no real photography yet.">
          <div className="max-w-md">
            <RevealImage
              src="/dev/placeholder.svg"
              alt="Placeholder — needs real photography"
              width={1200}
              height={800}
              wrapperClassName="rounded-lg shadow-soft"
            />
          </div>
        </Section>

        <Section title="ThemeSection" description="data-theme drives section bg/fg via CSS vars. Scroll between the two below — the label updates from onThemeChangeAction.">
          <p className="mb-4 text-small text-ink/60">
            Active theme reported to parent: <strong>{activeTheme}</strong>
          </p>
          <p className="text-small text-ink/70">
            Stability test — the fourth section below passes a fresh inline arrow every render,
            not useCallback. Fired <strong>{inlineThemeFireCount}</strong> times; it should
            settle small (once per time this section becomes active), never climb unboundedly.
          </p>
        </Section>
      </div>

      <ThemeSection theme="light" onThemeChangeAction={setActiveTheme} className="px-gutter py-section">
        <p className="font-display text-d2">Light section</p>
        <p className="mt-2 max-w-[60ch] text-lead">Cream background, ink text.</p>
      </ThemeSection>
      <ThemeSection theme="dark" onThemeChangeAction={setActiveTheme} className="px-gutter py-section">
        <p className="font-display text-d2">Dark section</p>
        <p className="mt-2 max-w-[60ch] text-lead">Navy background, cream text.</p>
      </ThemeSection>
      <ThemeSection theme="light" onThemeChangeAction={setActiveTheme} className="px-gutter py-section">
        <p className="font-display text-d2">Light section again</p>
        <p className="mt-2 max-w-[60ch] text-lead">Transition back should take 600ms, not instant.</p>
      </ThemeSection>
      <ThemeSection
        theme="dark"
        onThemeChangeAction={() => setInlineThemeFireCount((c) => c + 1)}
        className="px-gutter py-section"
      >
        <p className="font-display text-d2">Inline-arrow stability test</p>
        <p className="mt-2 max-w-[60ch] text-lead">
          onThemeChangeAction here is <code>() =&gt; setInlineThemeFireCount(...)</code>, defined
          fresh in this JSX on every render — deliberately the shape that used to loop.
        </p>
      </ThemeSection>
    </MotionPreferenceProvider>
  );
}

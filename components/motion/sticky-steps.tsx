"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionPreference } from "./motion-preference";

export type Step = {
  number: string;
  label: string;
  detail: ReactNode;
};

type StickyStepsProps = {
  steps: Step[];
  className?: string;
  /** Fires whenever the active step changes — e.g. for a progress indicator
   * elsewhere on the page that needs to track along. */
  onActiveIndexChangeAction?: (index: number) => void;
};

function StepPanel({ step, index, onEnter }: { step: Step; index: number; onEnter: (index: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isActive = useInView(ref, { margin: "-45% 0px -45% 0px" });

  // Same latest-ref pattern as Preloader's onCompleteAction and
  // ThemeSection's onThemeChangeAction: the current call site (setActiveIndex,
  // a stable useState setter) doesn't need this, but any future consumer
  // passing an inline arrow here would reproduce the exact infinite-loop bug
  // STATUS.md records — that was fixed at the call site, not the primitive.
  const onEnterRef = useRef(onEnter);
  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);

  useEffect(() => {
    if (isActive) {
      onEnterRef.current(index);
    }
  }, [isActive, index]);

  return (
    <div ref={ref} className="flex flex-col gap-3">
      {/* Mobile: number + label inline per panel, since the sticky rail is desktop-only */}
      <p className="text-eyebrow text-navy-mid md:hidden">
        {step.number} — {step.label}
      </p>
      <div className="text-lead text-ink/80">{step.detail}</div>
    </div>
  );
}

/**
 * Left column pins the active step's number + label while the right column
 * scrolls through detail panels — a scrollytelling pattern via useInView per
 * panel, not a single global scroll-progress calculation. Collapses to a
 * plain stacked list under md: the sticky rail hides, and each panel shows
 * its own number/label inline instead.
 */
export function StickySteps({ steps, className, onActiveIndexChangeAction }: StickyStepsProps) {
  const reducedMotion = useMotionPreference();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = steps[activeIndex];

  // Same latest-ref guard as onEnter below and Preloader/ThemeSection's
  // callback props — this is the public surface a consumer could pass an
  // inline arrow into, so it needs the same protection.
  const onActiveIndexChangeRef = useRef(onActiveIndexChangeAction);
  useEffect(() => {
    onActiveIndexChangeRef.current = onActiveIndexChangeAction;
  }, [onActiveIndexChangeAction]);

  useEffect(() => {
    onActiveIndexChangeRef.current?.(activeIndex);
  }, [activeIndex]);

  return (
    <div className={`grid gap-12 md:grid-cols-[1fr_2fr] md:gap-16 ${className ?? ""}`}>
      <div className="hidden md:sticky md:top-24 md:block md:self-start">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.number}
            initial={{ opacity: reducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reducedMotion ? 1 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
          >
            <p className="font-display text-d2 text-navy-mid">{activeStep.number}</p>
            <p className="mt-2 text-h3 text-ink">{activeStep.label}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex flex-col gap-16 md:gap-24">
        {steps.map((step, index) => (
          <StepPanel key={step.number} step={step} index={index} onEnter={setActiveIndex} />
        ))}
      </div>
    </div>
  );
}

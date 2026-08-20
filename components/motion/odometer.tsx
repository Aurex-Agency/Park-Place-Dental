"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useMotionPreference } from "./motion-preference";

type OdometerProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

const DIGITS = Array.from({ length: 10 }, (_, n) => n);

function DigitColumn({ digit, delay, reducedMotion }: { digit: number; delay: number; reducedMotion: boolean }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-baseline">
      <motion.span
        className="absolute inset-0 flex flex-col"
        initial={{ y: 0 }}
        animate={{ y: `-${digit}em` }}
        transition={{
          duration: reducedMotion ? 0 : 0.85,
          delay: reducedMotion ? 0 : delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {DIGITS.map((n) => (
          <span key={n} className="block h-[1em] text-center leading-[1em] tabular-nums">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * Rolling digit-column counter. Each digit is its own strip of 0-9 that
 * translates to the target row once the whole number is in view. Under
 * reduced motion the columns snap straight to the final value (duration 0)
 * instead of rolling — satisfies "odometers show final value."
 */
export function Odometer({ value, prefix, suffix, className }: OdometerProps) {
  const reducedMotion = useMotionPreference();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const digits = Math.abs(Math.trunc(value)).toString().split("").map(Number);

  return (
    <span ref={ref} className={`inline-flex items-baseline tabular-nums ${className ?? ""}`}>
      {/* Rolling digit strips render every 0-9 row in the DOM, which reads as
          gibberish to a screen reader — hide them and announce the real value instead. */}
      <span aria-hidden="true" className="inline-flex items-baseline">
        {prefix}
        {inView
          ? digits.map((digit, index) => (
              <DigitColumn
                key={index}
                digit={digit}
                delay={index * 0.06}
                reducedMotion={reducedMotion}
              />
            ))
          : digits.map((_, index) => (
              <span key={index} className="inline-block h-[1em] w-[0.62em]" />
            ))}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {digits.join("")}
        {suffix}
      </span>
    </span>
  );
}

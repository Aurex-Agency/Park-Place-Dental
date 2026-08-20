"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { useMotionPreference } from "./motion-preference";

const SESSION_KEY = "ppd-preloader-seen";
const HARD_TIMEOUT_MS = 1400;
const COUNT_DURATION_MS = 750;
const CURTAIN_DURATION_MS = 600;

function hasSeenThisSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeenThisSession(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // Privacy mode or similar — worst case the preloader runs again. Not worth failing over.
  }
}

/**
 * Counts 00 → 100, then a two-panel curtain wipes up. Fires once per
 * session (sessionStorage flag), skips instantly under reduced motion, and
 * force-completes at a 1400ms hard cap no matter what — this primitive has
 * no real asset-loading signal wired up yet, so the cap is the only thing
 * standing between a stalled state and a permanently blocked page.
 * `<noscript>` hides the overlay outright so content is never trapped
 * behind it when JS is disabled.
 */
export function Preloader({ onCompleteAction }: { onCompleteAction?: () => void }) {
  const reducedMotion = useMotionPreference();
  const [phase, setPhase] = useState<"counting" | "exiting" | "done">("counting");
  const count = useMotionValue(0);
  const [displayCount, setDisplayCount] = useState(0);
  const roundedCount = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const unsubscribe = roundedCount.on("change", setDisplayCount);
    return unsubscribe;
  }, [roundedCount]);

  useEffect(() => {
    if (hasSeenThisSession()) {
      // sessionStorage is only readable client-side, so this can't be a lazy
      // useState initializer without a server/client render mismatch — this
      // effect is the one legitimate place to make that call.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("done");
      onCompleteAction?.();
      return;
    }

    if (reducedMotion) {
      markSeenThisSession();
      setPhase("done");
      onCompleteAction?.();
      return;
    }

    markSeenThisSession();

    const countAnimation = animate(count, 100, {
      duration: COUNT_DURATION_MS / 1000,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => setPhase("exiting"),
    });

    const hardTimeout = setTimeout(() => {
      setPhase("done");
      onCompleteAction?.();
    }, HARD_TIMEOUT_MS);

    return () => {
      countAnimation.stop();
      clearTimeout(hardTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on mount by design
  }, []);

  useEffect(() => {
    if (phase !== "exiting") return;
    const timer = setTimeout(() => {
      setPhase("done");
      onCompleteAction?.();
    }, CURTAIN_DURATION_MS);
    return () => clearTimeout(timer);
  }, [phase, onCompleteAction]);

  if (phase === "done") return null;

  return (
    <>
      <noscript>
        <style>{".ppd-preloader { display: none; }"}</style>
      </noscript>
      <div
        className="ppd-preloader fixed inset-0 z-50 bg-navy"
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">Loading</span>
        {/* Curtain panels paint first so the counter (z-10) stays on top until they wipe away. */}
        <motion.div
          className="absolute inset-x-0 top-0 h-1/2 bg-navy"
          initial={{ y: 0 }}
          animate={phase === "exiting" ? { y: "-100%" } : { y: 0 }}
          transition={{ duration: CURTAIN_DURATION_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          className="absolute inset-x-0 bottom-0 h-1/2 bg-navy"
          initial={{ y: 0 }}
          animate={phase === "exiting" ? { y: "100%" } : { y: 0 }}
          transition={{ duration: CURTAIN_DURATION_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="relative z-10 flex h-full items-center justify-center">
          <span className="font-display text-d1 tabular-nums text-cream">
            {String(displayCount).padStart(2, "0")}
          </span>
        </div>
      </div>
    </>
  );
}

"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { COLUMN_PATHS, COLUMN_VIEW_BOX } from "./column-paths";
import { LineDraw } from "./line-draw";
import { useMotionPreference } from "./motion-preference";

const SESSION_KEY = "ppd-preloader-seen";
const HARD_TIMEOUT_MS = 1400;
const COUNT_DURATION_MS = 750;
const CURTAIN_DURATION_MS = 600;

/**
 * BRAND-REVISION.md §3: "the column draws itself... while the counter
 * runs." Staged to land inside COUNT_DURATION_MS (750ms) — bars first, then
 * fluting rising, volutes spiraling in last and finishing right around when
 * the count hits 100, so the drawing is complete before the curtain wipes,
 * never cut off mid-stroke.
 */
const COLUMN_DRAW_STAGES: {
  key: keyof typeof COLUMN_PATHS;
  delay: number;
  duration: number;
  strokeWidth: number;
}[] = [
  { key: "topCap", delay: 0, duration: 0.12, strokeWidth: 2.5 },
  { key: "thinRule", delay: 0.04, duration: 0.12, strokeWidth: 2.5 },
  { key: "baseBar", delay: 0.08, duration: 0.16, strokeWidth: 3.5 },
  { key: "fluting", delay: 0.14, duration: 0.3, strokeWidth: 2.5 },
  { key: "leftVolute", delay: 0.32, duration: 0.4, strokeWidth: 2 },
  { key: "rightVolute", delay: 0.32, duration: 0.4, strokeWidth: 2 },
];

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

  // The mount effect below must run exactly once (it starts a single count
  // animation + hard-timeout), so onCompleteAction can't be a dep — but a
  // parent could still pass a new function reference each render. Reading it
  // through a ref, kept current via its own effect, avoids ever calling a
  // stale closure without needing the mount effect to re-run.
  const onCompleteRef = useRef(onCompleteAction);
  useEffect(() => {
    onCompleteRef.current = onCompleteAction;
  }, [onCompleteAction]);

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
      onCompleteRef.current?.();
      return;
    }

    if (reducedMotion) {
      markSeenThisSession();
      setPhase("done");
      onCompleteRef.current?.();
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
      onCompleteRef.current?.();
    }, HARD_TIMEOUT_MS);

    return () => {
      countAnimation.stop();
      clearTimeout(hardTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on mount by design; onCompleteAction is read via ref
  }, []);

  useEffect(() => {
    if (phase !== "exiting") return;
    const timer = setTimeout(() => {
      setPhase("done");
      onCompleteRef.current?.();
    }, CURTAIN_DURATION_MS);
    return () => clearTimeout(timer);
  }, [phase]);

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
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6">
          <div className="relative h-16 w-40 text-gold sm:h-20 sm:w-48">
            {COLUMN_DRAW_STAGES.map((stage) => (
              <LineDraw
                key={stage.key}
                path={COLUMN_PATHS[stage.key]}
                viewBox={COLUMN_VIEW_BOX}
                delay={stage.delay}
                duration={stage.duration}
                strokeWidth={stage.strokeWidth}
                className="absolute inset-0 h-full w-full"
              />
            ))}
          </div>
          <span className="font-display text-d1 tabular-nums text-cream">
            {String(displayCount).padStart(2, "0")}
          </span>
        </div>
      </div>
    </>
  );
}

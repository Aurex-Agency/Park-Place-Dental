import { practice } from "@/content/practice";

/**
 * Placeholder root route. The real home page (13 sections, DESIGN-SYSTEM.md
 * §4) is built in Phase 3, composed from the Phase 1 motion primitives.
 */
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="text-eyebrow uppercase tracking-eyebrow text-park">
        Site under construction
      </p>
      <h1 className="font-display text-d2 text-ink">{practice.name}</h1>
      <p className="max-w-[40ch] text-lead text-ink/70">
        {practice.county}, Mississippi — the home page is being built in
        phases. See <code>/dev/tokens</code> for the design foundation.
      </p>
    </main>
  );
}

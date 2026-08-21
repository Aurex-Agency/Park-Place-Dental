import { practice } from "@/content/practice";

/**
 * Placeholder root route. The real home page (13 sections, DESIGN-SYSTEM.md
 * §4) is built in Phase 3, composed from the Phase 1 motion primitives. Nav,
 * footer, and the mobile bottom bar come from app/(marketing)/layout.tsx's
 * Shell, which also owns the page's single <main> landmark — this renders
 * only the content that goes inside it.
 */
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="text-eyebrow uppercase tracking-eyebrow text-navy-mid">
        Site under construction
      </p>
      <h1 className="font-display text-d2 text-ink">{practice.name}</h1>
      <p className="max-w-[40ch] text-lead text-ink/70">
        {practice.county}, Mississippi — the home page is being built in
        phases. See <code>/dev/tokens</code> for the design foundation.
      </p>
    </div>
  );
}

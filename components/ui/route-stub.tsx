import type { ReactNode } from "react";

/**
 * Minimal placeholder for nav destinations that don't exist as real pages
 * until Phase 4 — correct title/description live on each route's own
 * metadata export, this renders the visible "not built yet" body (CLAUDE.md
 * working style: stub, don't 404).
 */
export function RouteStub({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-gutter py-section text-center">
      <p className="text-eyebrow uppercase tracking-eyebrow text-navy-mid">Coming soon</p>
      <h1 className="mt-4 font-display text-d2 text-ink">{title}</h1>
      <p className="mx-auto mt-4 max-w-[60ch] text-lead text-ink/70">
        {note ?? "This page is being built in a later phase."}
      </p>
      {children}
    </div>
  );
}

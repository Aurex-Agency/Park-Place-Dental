/**
 * Visible marker for content pulled from a content/practice.ts TODO(kalob)
 * string (CLAUDE.md rule #10/#11) — never invent the value, render the
 * unfinished state obviously instead. text-inherit so it reads correctly on
 * both light and dark section backgrounds. Deliberately not brick-colored:
 * brick is reserved for the emergency CTA and appears nowhere else on the
 * site (CLAUDE.md rule #6) — this is an unrelated "unfinished" marker, so it
 * gets a neutral ink-based dashed treatment instead.
 */
export function TodoPlaceholder({ children, className }: { children: string; className?: string }) {
  return (
    <p className={`rounded-md border border-dashed border-ink/40 bg-ink/5 px-3 py-2 text-small text-inherit ${className ?? ""}`}>
      {children}
    </p>
  );
}

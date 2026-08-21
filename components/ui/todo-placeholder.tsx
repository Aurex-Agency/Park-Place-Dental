/**
 * Visible marker for content pulled from a content/practice.ts TODO(kalob)
 * string (CLAUDE.md rule #10/#11) — never invent the value, render the
 * unfinished state obviously instead. text-inherit so it reads correctly on
 * both light and dark section backgrounds.
 */
export function TodoPlaceholder({ children, className }: { children: string; className?: string }) {
  return (
    <p className={`rounded-md border border-dashed border-danger/50 bg-danger/10 px-3 py-2 text-small text-inherit ${className ?? ""}`}>
      {children}
    </p>
  );
}

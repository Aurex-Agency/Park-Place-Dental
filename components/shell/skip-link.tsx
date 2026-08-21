/** Must be the first focusable element on every marketing page (Gate 1). */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[70] focus-visible:rounded-md focus-visible:bg-cream focus-visible:px-4 focus-visible:py-2 focus-visible:text-body focus-visible:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      Skip to main content
    </a>
  );
}

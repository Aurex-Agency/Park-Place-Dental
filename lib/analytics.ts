/**
 * Phase 5 wires this to a real analytics provider. Conversion-relevant clicks
 * call this now so the seam already exists when it does — no-op beyond a dev
 * console log until then.
 */
export function trackEvent(name: string, data?: Record<string, unknown>): void {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", name, data);
  }
}

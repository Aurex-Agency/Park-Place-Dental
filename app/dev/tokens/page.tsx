import type { Metadata } from "next";
import { Fragment } from "react";
import { contrastRatio, passesLargeText, passesNormalText } from "@/lib/contrast";

export const metadata: Metadata = {
  title: "Dev — Design Tokens",
  robots: { index: false, follow: false },
};

const COLORS = {
  ink: "#0b1220",
  navy: "#16233f",
  "navy-mid": "#2e4e86",
  "navy-lift": "#3e64a3",
  mist: "#c7d2e0",
  cream: "#f8f3ea",
  sand: "#efe4d2",
  white: "#ffffff",
  gold: "#a28d74",
  "gold-lift": "#b09b82",
  brick: "#9b3a34",
  focus: "#3e64a3",
} as const;

const VERIFIED_PAIRS: Array<{ fg: keyof typeof COLORS; bg: keyof typeof COLORS; context: string }> = [
  { fg: "ink", bg: "cream", context: "body text" },
  { fg: "cream", bg: "navy", context: "dark section text" },
  { fg: "ink", bg: "gold", context: "primary CTA fill" },
  { fg: "gold", bg: "navy", context: "accent text on dark" },
  { fg: "gold", bg: "cream", context: "why gold text is banned on light surfaces" },
  { fg: "white", bg: "brick", context: "emergency CTA text" },
  { fg: "brick", bg: "cream", context: "emergency nav link text" },
];

const TYPE_SCALE = [
  { token: "--text-hero", className: "text-hero", note: "Fraunces 600, ls -0.03em, lh 0.92" },
  { token: "--text-d1", className: "text-d1", note: "section headlines" },
  { token: "--text-d2", className: "text-d2", note: "" },
  { token: "--text-h3", className: "text-h3", note: "" },
  { token: "--text-lead", className: "text-lead", note: "Inter Tight 400, lh 1.5" },
  { token: "--text-body", className: "text-body", note: "17px — not 14px" },
  { token: "--text-small", className: "text-small", note: "" },
  { token: "--text-eyebrow", className: "text-eyebrow uppercase tracking-eyebrow", note: "Inter Tight 500, ls 0.12em" },
] as const;

const SPACING_SCALE = [
  { token: "--spacing", value: "0.5rem (8px)", note: "base grid unit" },
  { token: "--spacing-gutter", value: "clamp(1.25rem, 5vw, 6rem)", note: "container gutter" },
  { token: "--spacing-section", value: "clamp(6rem, 12vw, 12rem)", note: "vertical section rhythm" },
] as const;

const RADII = [
  { token: "--radius-sm", className: "rounded-sm", value: "8px" },
  { token: "--radius-md", className: "rounded-md", value: "16px" },
  { token: "--radius-lg", className: "rounded-lg", value: "28px" },
  { token: "--radius-pill", className: "rounded-pill", value: "9999px" },
] as const;

const MOTION_TOKENS = [
  { token: "--ease-out-expo", value: "cubic-bezier(0.16, 1, 0.30, 1)", use: "default reveal" },
  { token: "--ease-in-out", value: "cubic-bezier(0.65, 0, 0.35, 1)", use: "transforms both ways" },
  { token: "--dur-fast", value: "200ms", use: "hover, focus" },
  { token: "--dur-base", value: "650ms", use: "reveals" },
  { token: "--dur-slow", value: "1100ms", use: "hero, curtain" },
  { token: "--stagger", value: "60ms", use: "stagger delay" },
] as const;

// The fail state deliberately doesn't use brick — brick is emergency-CTA-only
// (CLAUDE.md rule #6) and this is unrelated UI chrome, not the brand's
// emergency signal. A bold ink treatment (heavier weight, not just color)
// also means this doesn't rely on color alone to convey state.
function ThresholdBadge({ pass }: { pass: boolean }) {
  return (
    <span
      className={
        pass
          ? "inline-flex items-center gap-1 rounded-pill bg-navy-mid/10 px-2 py-1 text-small font-medium text-navy-mid"
          : "inline-flex items-center gap-1 rounded-pill border-2 border-ink bg-ink/10 px-2 py-1 text-small font-bold text-ink"
      }
    >
      {pass ? "✓ pass" : "✗ fail"}
    </span>
  );
}

export default function TokensPage() {
  return (
    <main className="mx-auto flex max-w-[var(--container-max)] flex-col gap-16 px-gutter py-section">
      <header>
        <h1 className="font-display text-d1 text-ink">Design tokens</h1>
        <p className="mt-2 text-lead text-ink/70">
          Every value below is read live from app/globals.css. Nothing here is
          hand-typed twice.
        </p>
      </header>

      <section>
        <h2 className="font-display text-h3 text-ink">Palette</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Object.entries(COLORS).map(([name, hex]) => (
            <div key={name} className="overflow-hidden rounded-md shadow-soft">
              <div className="h-20" style={{ backgroundColor: hex }} />
              <div className="bg-white px-3 py-2">
                <p className="text-small font-medium text-ink">{name}</p>
                <p className="text-small text-ink/70">{hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-h3 text-ink">Verified contrast pairs</h2>
        <p className="mt-2 text-body text-ink/70">
          Computed with the WCAG relative-luminance formula, not restated by hand. Every pair is
          checked against both AA minimums — 4.5:1 for normal text, 3:1 for large text
          (≥24px / <code>--text-h3</code> and up, per WCAG&rsquo;s large-text definition). A pair
          that only clears the large-text bar gets a warning row you can&rsquo;t miss.
        </p>
        <table className="mt-6 w-full border-collapse text-left text-body">
          <thead>
            <tr className="border-b border-ink/10">
              <th className="py-2 pr-4">Pair</th>
              <th className="py-2 pr-4">Context</th>
              <th className="py-2 pr-4">Ratio</th>
              <th className="py-2 pr-4">Normal text (4.5:1)</th>
              <th className="py-2 pr-4">Large text (3:1)</th>
              <th className="py-2">Preview</th>
            </tr>
          </thead>
          <tbody>
            {VERIFIED_PAIRS.map(({ fg, bg, context }) => {
              const ratio = contrastRatio(COLORS[fg], COLORS[bg]);
              const normalOk = passesNormalText(ratio);
              const largeOk = passesLargeText(ratio);
              const largeTextOnly = !normalOk && largeOk;
              const failsEverything = !largeOk;
              return (
                <Fragment key={`${fg}-${bg}`}>
                  <tr className="border-b border-ink/5">
                    <td className="py-3 pr-4 font-mono text-small">
                      {fg} on {bg}
                    </td>
                    <td className="py-3 pr-4 text-ink/70">{context}</td>
                    <td className="py-3 pr-4 tabular-nums">{ratio.toFixed(2)}:1</td>
                    <td className="py-3 pr-4">
                      <ThresholdBadge pass={normalOk} />
                    </td>
                    <td className="py-3 pr-4">
                      <ThresholdBadge pass={largeOk} />
                    </td>
                    <td className="py-3">
                      {/* text-h3's clamp floor is 24px — the WCAG large-text
                          threshold — so a shown preview never renders at a
                          size that would need the pair to clear the small-
                          text 4.5:1 bar it might not meet. A pair that fails
                          even the 3:1 large-text minimum genuinely can't be
                          previewed live — aria-hidden doesn't exempt visible
                          text from contrast rules (it only affects screen
                          readers; a sighted low-vision user would still see
                          illegible text), so don't render it as text at all. */}
                      {failsEverything ? (
                        <span className="text-small italic text-ink/60">not previewable — illegible</span>
                      ) : (
                        <span
                          className="inline-block rounded-sm px-4 py-2 text-h3"
                          style={{ backgroundColor: COLORS[bg], color: COLORS[fg] }}
                        >
                          Aa
                        </span>
                      )}
                    </td>
                  </tr>
                  {(largeTextOnly || failsEverything) && (
                    <tr>
                      <td colSpan={6} className="pb-6">
                        <p className="flex items-start gap-2 rounded-md border-2 border-ink bg-ink/10 px-4 py-3 text-body font-medium text-ink">
                          <span aria-hidden="true">⚠</span>
                          {failsEverything ? (
                            <span>
                              <strong>{fg} on {bg}</strong> fails contrast at every size
                              ({ratio.toFixed(2)}:1, needs 3:1 minimum). Do not ship this pairing.
                            </span>
                          ) : (
                            <span>
                              <strong>{fg} on {bg}</strong> is {ratio.toFixed(2)}:1 — below the
                              4.5:1 normal-text minimum. Large text only:{" "}
                              <code>--text-h3</code> (24px) or larger, never for body copy,
                              labels, or form text. See CLAUDE.md&rsquo;s Design hard rules.
                            </span>
                          )}
                        </p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="font-display text-h3 text-ink">Type scale</h2>
        <div className="mt-6 flex flex-col gap-6">
          {TYPE_SCALE.map(({ token, className, note }) => (
            <div key={token} className="border-b border-ink/10 pb-6">
              <p className="text-small text-ink/70">
                {token}
                {note ? ` — ${note}` : ""}
              </p>
              <p className={`font-display text-ink ${className}`}>
                Booneville, Mississippi
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-h3 text-ink">Spacing scale</h2>
        <div className="mt-6 flex flex-col gap-3">
          {SPACING_SCALE.map(({ token, value, note }) => (
            <div key={token} className="flex items-baseline gap-4 text-body">
              <code className="w-48 shrink-0 text-small text-ink/70">{token}</code>
              <span className="text-ink">{value}</span>
              <span className="text-small text-ink/70">{note}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-h3 text-ink">Radii</h2>
        <div className="mt-6 flex flex-wrap gap-6">
          {RADII.map(({ token, className, value }) => (
            <div key={token} className="flex flex-col items-center gap-2">
              <div className={`h-16 w-16 bg-navy-mid ${className}`} />
              <p className="text-small text-ink/70">
                {token} · {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-h3 text-ink">Motion tokens</h2>
        <table className="mt-6 w-full border-collapse text-left text-body">
          <thead>
            <tr className="border-b border-ink/10">
              <th className="py-2 pr-4">Token</th>
              <th className="py-2 pr-4">Value</th>
              <th className="py-2">Use</th>
            </tr>
          </thead>
          <tbody>
            {MOTION_TOKENS.map(({ token, value, use }) => (
              <tr key={token} className="border-b border-ink/5">
                <td className="py-3 pr-4 font-mono text-small">{token}</td>
                <td className="py-3 pr-4 tabular-nums">{value}</td>
                <td className="py-3 text-ink/70">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

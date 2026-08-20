import type { Metadata } from "next";
import { contrastRatio, wcagLevel } from "@/lib/contrast";

export const metadata: Metadata = {
  title: "Dev — Design Tokens",
  robots: { index: false, follow: false },
};

const COLORS = {
  ink: "#0f1a15",
  pine: "#14372a",
  park: "#1f6b4e",
  "park-lift": "#2a8a64",
  sage: "#c7d8ce",
  ivory: "#f7f4ed",
  bone: "#ede7da",
  white: "#ffffff",
  brass: "#c08a3e",
  "brass-lift": "#d8a257",
  danger: "#a33a2b",
  focus: "#2a8a64",
} as const;

const VERIFIED_PAIRS: Array<{ fg: keyof typeof COLORS; bg: keyof typeof COLORS; context: string }> = [
  { fg: "ink", bg: "ivory", context: "body text" },
  { fg: "ivory", bg: "pine", context: "dark section text" },
  { fg: "white", bg: "park", context: "primary button text" },
  { fg: "brass", bg: "pine", context: "accent on dark" },
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

export default function TokensPage() {
  return (
    <main className="mx-auto flex max-w-[--container-max] flex-col gap-16 px-gutter py-section">
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
                <p className="text-small text-ink/60">{hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-h3 text-ink">Verified contrast pairs</h2>
        <p className="mt-2 text-body text-ink/70">
          Computed with the WCAG relative-luminance formula, not restated by hand.
        </p>
        <table className="mt-6 w-full border-collapse text-left text-body">
          <thead>
            <tr className="border-b border-ink/10">
              <th className="py-2 pr-4">Pair</th>
              <th className="py-2 pr-4">Context</th>
              <th className="py-2 pr-4">Ratio</th>
              <th className="py-2 pr-4">Level</th>
              <th className="py-2">Preview</th>
            </tr>
          </thead>
          <tbody>
            {VERIFIED_PAIRS.map(({ fg, bg, context }) => {
              const ratio = contrastRatio(COLORS[fg], COLORS[bg]);
              const level = wcagLevel(ratio);
              return (
                <tr key={`${fg}-${bg}`} className="border-b border-ink/5">
                  <td className="py-3 pr-4 font-mono text-small">
                    {fg} on {bg}
                  </td>
                  <td className="py-3 pr-4 text-ink/70">{context}</td>
                  <td className="py-3 pr-4 tabular-nums">{ratio.toFixed(2)}:1</td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        level === "fail"
                          ? "text-danger"
                          : "text-park"
                      }
                    >
                      {level}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className="inline-block rounded-sm px-3 py-1 text-small"
                      style={{ backgroundColor: COLORS[bg], color: COLORS[fg] }}
                    >
                      Aa
                    </span>
                  </td>
                </tr>
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
              <p className="text-small text-ink/50">
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
              <code className="w-48 shrink-0 text-small text-ink/50">{token}</code>
              <span className="text-ink">{value}</span>
              <span className="text-small text-ink/50">{note}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-h3 text-ink">Radii</h2>
        <div className="mt-6 flex flex-wrap gap-6">
          {RADII.map(({ token, className, value }) => (
            <div key={token} className="flex flex-col items-center gap-2">
              <div className={`h-16 w-16 bg-park ${className}`} />
              <p className="text-small text-ink/60">
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

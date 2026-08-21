import { defineConfig, devices } from "@playwright/test";

const PORT = 4310;
const baseURL = `http://localhost:${PORT}`;

/**
 * Runs the a11y suite against a real production build (CLAUDE.md rule #15
 * chains `pnpm build` before `pnpm test:a11y`, so `.next/` already exists —
 * this starts that build, not a dev server with fast-refresh overhead/dead
 * code).
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `pnpm exec next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});

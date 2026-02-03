import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Configuration for Hoshino Fortune E2E Tests
 *
 * 🔥 Critical Test Coverage:
 * - API endpoint functionality
 * - User authentication flows
 * - Fortune browsing and purchasing
 *
 * Run: bunx playwright test
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { open: "never" }],
    ["list"],
  ],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    // API Tests - No browser needed, just HTTP
    {
      name: "api",
      testMatch: /.*\.api\.test\.ts/,
      use: {},
    },
    // Browser Tests - Full E2E with Chromium
    {
      name: "chromium",
      testMatch: /.*\.e2e\.test\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Start local dev server before running tests
  webServer: {
    command: "bun run dev",
    cwd: "./apps/backend",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes to start
  },
});

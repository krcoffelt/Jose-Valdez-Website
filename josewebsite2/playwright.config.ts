import { defineConfig } from "@playwright/test";

const PORT = Number(process.env.PLAYWRIGHT_PORT || 4173);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests/smoke",
  timeout: 45_000,
  retries: 0,
  workers: 1,
  use: {
    baseURL: BASE_URL,
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: `NEXT_DIST_DIR=.next-test npm run build && NEXT_DIST_DIR=.next-test npm run start -- -H 127.0.0.1 -p ${PORT}`,
        url: BASE_URL,
        timeout: 240_000,
        reuseExistingServer: true,
      },
});

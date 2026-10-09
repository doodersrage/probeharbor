import { defineConfig } from "@playwright/test";

const isCI = Boolean(process.env.CI);
// Locally, always test a fresh build on its own port: reusing a running
// `pnpm preview` on 4321 silently tested whatever dist/ it was started with.
// CI builds in an earlier step, so it only serves.
const port = isCI ? 4321 : 4322;
const preview = `pnpm preview --host 127.0.0.1 --port ${port}`;

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`,
    trace: "on-first-retry",
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: isCI ? preview : `pnpm build && ${preview}`,
        url: `http://127.0.0.1:${port}`,
        reuseExistingServer: false,
        timeout: isCI ? 120_000 : 300_000,
      },
});

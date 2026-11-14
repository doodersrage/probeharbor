import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "cloudflare:workers": path.resolve(
        root,
        "src/test/cloudflare-workers-stub.ts",
      ),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Need a real Postgres: run with `pnpm test:db` (vitest.db.config.ts).
    exclude: ["src/**/*.db.test.ts", "**/node_modules/**"],
    setupFiles: ["src/test/unitSetup.ts"],
    // `pnpm test:coverage`. Unit tests only; code exercised by the database
    // tests (pnpm test:db) shows as uncovered. The thresholds are floors just
    // under the totals on 2026-11-13: coverage can't slide back. Raise them
    // when it goes up; don't lower them to get a change through.
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      // Page scripts (DOM code moved out of .astro <script> tags) were never
      // counted while they lived in the page; they're exercised by e2e.
      exclude: ["src/**/*.test.ts", "src/test/**", "src/**/*.d.ts", "src/i18n/**", "src/lib/overviewPageScript.ts"],
      reporter: ["text-summary", "json-summary", "html"],
      reportsDirectory: "coverage",
      thresholds: { lines: 64, statements: 63, functions: 61, branches: 60 },
    },
  },
});

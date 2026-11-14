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
    // `pnpm test:coverage`: a report, no thresholds (yet). Unit tests only;
    // code exercised by the database tests (pnpm test:db) shows as uncovered.
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.ts", "src/test/**", "src/**/*.d.ts", "src/i18n/**"],
      reporter: ["text-summary", "json-summary", "html"],
      reportsDirectory: "coverage",
    },
  },
});

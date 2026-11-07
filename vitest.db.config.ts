import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

/**
 * Database tests: `pnpm test:db`, needs TEST_DATABASE_URL (a local Postgres).
 * See src/test/db.ts. Standalone (not merged with vitest.config.ts) so the
 * file list replaces the unit-test one instead of adding to it.
 */
export default defineConfig({
  resolve: {
    alias: {
      "cloudflare:workers": path.resolve(root, "src/test/cloudflare-workers-stub.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.db.test.ts"],
    globalSetup: ["src/test/db.global-setup.ts"],
    // One database, one connection per file; run files one at a time.
    fileParallelism: false,
    // Placeholders so modules that still import the Supabase client can load.
    env: {
      SUPABASE_URL: "https://test.supabase.co",
      SUPABASE_ANON_KEY: "test-anon-key",
    },
  },
});

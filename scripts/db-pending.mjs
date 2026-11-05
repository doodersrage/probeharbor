#!/usr/bin/env node
/**
 * Which migrations aren't applied to the linked (production) project yet?
 * Pushes to main deploy code automatically, but migrations run by hand
 * (`pnpm db:push`), so run this before pushing code that needs a migration.
 *
 * Read-only: wraps `supabase migration list --remote --output-format json`
 * (Supabase CLI v3; bare `--remote` means the linked project). Exits 1 when
 * a local migration is missing remotely (pending) or a remote one is missing
 * locally (drift), 0 when they match, 2 if the CLI can't be run or its output
 * can't be read. Unreadable output is an error, never an all-clear.
 */
import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["supabase", "migration", "list", "--remote", "--output-format", "json"], {
  encoding: "utf8",
});

let parsed;
try {
  parsed = JSON.parse(result.stdout);
} catch {
  parsed = undefined;
}
if (result.status !== 0 || !Array.isArray(parsed?.migrations)) {
  console.error(
    parsed?.error?.message || result.stderr || result.stdout || "supabase migration list failed",
  );
  process.exit(2);
}

// The repo always has migrations, so an empty list means the CLI output changed.
if (parsed.migrations.length === 0) {
  console.error("supabase migration list returned no migrations");
  process.exit(2);
}

const isVersion = (v) => typeof v === "string" && /^\d{14}$/.test(v);
const pending = [];
const drift = [];
for (const row of parsed.migrations) {
  const local = isVersion(row?.local) ? row.local : "";
  const remote = isVersion(row?.remote) ? row.remote : "";
  // A row with neither version means the output shape changed: fail loudly.
  if (!local && !remote) {
    console.error(`Unreadable migration row: ${JSON.stringify(row)}`);
    process.exit(2);
  }
  if (local && !remote) pending.push(local);
  else if (remote && !local) drift.push(remote);
}

if (pending.length === 0 && drift.length === 0) {
  console.log("All local migrations are applied to the linked project.");
  process.exit(0);
}
if (pending.length > 0) {
  console.log(`Not applied yet (${pending.length}); run \`pnpm db:push\` before deploying code that needs them:`);
  for (const id of pending) console.log(`  ${id}`);
}
if (drift.length > 0) {
  console.log(`Applied remotely but missing from supabase/migrations (${drift.length}):`);
  for (const id of drift) console.log(`  ${id}`);
}
process.exit(1);

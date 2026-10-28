#!/usr/bin/env node
/**
 * Which migrations aren't applied to the linked (production) project yet?
 * Pushes to main deploy code automatically, but migrations run by hand
 * (`pnpm db:push`), so run this before pushing code that needs a migration.
 *
 * Read-only: wraps `supabase migration list --linked`. Exits 1 when a local
 * migration is missing remotely (pending) or a remote one is missing locally
 * (drift), 0 when they match, 2 if the CLI can't be run.
 */
import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["supabase", "migration", "list", "--linked"], { encoding: "utf8" });
if (result.status !== 0) {
  console.error(result.stderr || result.stdout || "supabase migration list failed");
  process.exit(2);
}

const pending = [];
const drift = [];
for (const line of result.stdout.split("\n")) {
  const cells = line.split("|").map((c) => c.trim());
  if (cells.length < 2 || !/^\d{14}$|^$/.test(cells[0]) || !/^\d{14}$|^$/.test(cells[1])) continue;
  const [local, remote] = cells;
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

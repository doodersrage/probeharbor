#!/usr/bin/env node
/**
 * Apply SQL migrations in db/migrations/ to the Neon database (production
 * since the 2026-11-07 move off Supabase). `pnpm db:pending` is `--check`.
 *
 * Usage:
 *   pnpm db:migrate                 apply pending migrations
 *   pnpm db:migrate --status        list applied / pending; change nothing
 *   pnpm db:migrate --check         like --status, exit 1 if anything is pending
 *   pnpm db:migrate --up-to 0003    apply pending migrations up to and including 0003 only
 *                                   (for a migration that must wait until after a deploy)
 *   options: --env-file .env  --url-env DATABASE_URL_UNPOOLED  --dir db/migrations
 *
 * Uses the direct (unpooled) connection string by default: migrations need a
 * real session. The URL is never printed. Refuses Supabase hosts, so it can't
 * be pointed at the current production database by mistake.
 *
 * Each file runs in its own transaction and is recorded in
 * public.schema_migrations with a SHA-256 of its contents. A file that changed
 * after it was applied stops the run: add a new migration instead of editing
 * an old one. A session advisory lock stops two runs from overlapping.
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseEnvFile } from "./parseEnvFile.mjs";

/** Migration files are `NNNN_name.sql`, applied in name order. */
export const MIGRATION_FILE = /^(\d{4})_[a-z0-9_]+\.sql$/;

/** Arbitrary constant for pg_advisory_lock, so concurrent runs wait. */
export const MIGRATION_LOCK_ID = 7_314_202_611;

export function checksum(sql) {
  return createHash("sha256").update(sql).digest("hex");
}

/**
 * Compare migration files with what the database has recorded.
 * @param {{ version: string; sql: string }[]} files
 * @param {{ version: string; checksum: string }[]} applied
 */
export function planMigrations(files, applied) {
  const recorded = new Map(applied.map((row) => [row.version, row.checksum]));
  const names = new Set(files.map((f) => f.version));
  const pending = [];
  const changed = [];
  const done = [];
  for (const file of [...files].sort((a, b) => a.version.localeCompare(b.version))) {
    const sum = recorded.get(file.version);
    if (sum == null) pending.push(file.version);
    else if (sum !== checksum(file.sql)) changed.push(file.version);
    else done.push(file.version);
  }
  // Recorded in the database but no longer on disk.
  const missing = applied.map((row) => row.version).filter((v) => !names.has(v)).sort();
  // A pending file sorting before an applied one means history was rewritten.
  const lastApplied = done.at(-1) ?? changed.at(-1);
  const outOfOrder = lastApplied ? pending.filter((v) => v < lastApplied) : [];
  return { pending, changed, done, missing, outOfOrder };
}

/** Pending versions to apply now: all of them, or only up to `NNNN` (inclusive). */
export function pendingUpTo(pending, upTo) {
  if (!upTo) return pending;
  return pending.filter((version) => version.slice(0, 4) <= upTo);
}

/** Problems that must stop `db:migrate` before it applies anything. */
export function blockingProblems(plan) {
  const problems = [];
  if (plan.changed.length) {
    problems.push(`changed after being applied: ${plan.changed.join(", ")} (add a new migration instead)`);
  }
  if (plan.missing.length) {
    problems.push(`applied but missing from disk: ${plan.missing.join(", ")}`);
  }
  if (plan.outOfOrder.length) {
    problems.push(`pending but older than applied ones: ${plan.outOfOrder.join(", ")}`);
  }
  return problems;
}

/** Reject anything that isn't a postgres URL, and the Supabase database. */
export function checkTargetUrl(raw, name) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return `${name} is not a valid postgres:// URL.`;
  }
  if (!/^postgres(ql)?:$/.test(url.protocol)) return `${name} must start with postgres:// or postgresql://.`;
  if (/(^|\.)supabase\.(co|com|net)$/i.test(url.hostname) || /pooler\.supabase\./i.test(url.hostname)) {
    return `${name} points at Supabase. db:migrate is for the Neon database only.`;
  }
  return null;
}

export function readMigrationFiles(dir) {
  return readdirSync(dir)
    .filter((name) => name.endsWith(".sql"))
    .map((name) => {
      if (!MIGRATION_FILE.test(name)) {
        throw new Error(`${name}: migration files must be named NNNN_lowercase_name.sql`);
      }
      return { version: name.replace(/\.sql$/, ""), sql: readFileSync(resolve(dir, name), "utf8") };
    });
}

async function main() {
  const args = process.argv.slice(2);
  const argValue = (flag, fallback) => {
    const i = args.indexOf(flag);
    return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
  };
  const statusOnly = args.includes("--status") || args.includes("--check");
  const check = args.includes("--check");
  const envPath = resolve(argValue("--env-file", ".env"));
  const urlEnv = argValue("--url-env", "DATABASE_URL_UNPOOLED");
  const dir = resolve(argValue("--dir", "db/migrations"));
  const upTo = argValue("--up-to", "");
  if (upTo && !/^\d{4}$/.test(upTo)) {
    console.error("--up-to takes a four-digit migration number, e.g. --up-to 0003.");
    return 1;
  }

  const env = existsSync(envPath) ? parseEnvFile(readFileSync(envPath, "utf8")) : {};
  const raw = (process.env[urlEnv] ?? env[urlEnv] ?? "").trim();
  if (!raw) {
    console.error(`${urlEnv} is not set in ${envPath}.`);
    return 1;
  }
  const urlProblem = checkTargetUrl(raw, urlEnv);
  if (urlProblem) {
    console.error(urlProblem);
    return 1;
  }

  const files = readMigrationFiles(dir);
  const { default: pg } = await import("pg");
  const client = new pg.Client({ connectionString: raw, application_name: "probeharbor-db-migrate" });
  await client.connect();
  try {
    await client.query("select pg_advisory_lock($1)", [MIGRATION_LOCK_ID]);
    const { rows: found } = await client.query("select to_regclass('public.schema_migrations') is not null as ok");
    if (!found[0].ok && !statusOnly) {
      await client.query(`create table public.schema_migrations (
        version text primary key,
        checksum text not null,
        applied_at timestamptz not null default now()
      )`);
      await client.query("alter table public.schema_migrations enable row level security");
    }
    // --status / --check must not change anything, even the bookkeeping table.
    const { rows } =
      found[0].ok || !statusOnly
        ? await client.query("select version, checksum from public.schema_migrations")
        : { rows: [] };
    const plan = planMigrations(files, rows);
    const host = new URL(raw).hostname;
    console.log(`Target: ${urlEnv} (${host})`);
    console.log(`Applied: ${plan.done.length}. Pending: ${plan.pending.length ? plan.pending.join(", ") : "none"}.`);

    const problems = blockingProblems(plan);
    if (problems.length) {
      for (const p of problems) console.error(`Problem: ${p}`);
      return 1;
    }
    if (statusOnly) return check && plan.pending.length ? 1 : 0;

    const toApply = pendingUpTo(plan.pending, upTo);
    if (upTo && toApply.length < plan.pending.length) {
      console.log(`Up to ${upTo}: applying ${toApply.length ? toApply.join(", ") : "nothing"}; leaving ${plan.pending.filter((v) => !toApply.includes(v)).join(", ")}.`);
    }
    for (const version of toApply) {
      const sql = files.find((f) => f.version === version).sql;
      const started = Date.now();
      await client.query("begin");
      try {
        await client.query(sql);
        // Migrations may change search_path; keep the bookkeeping explicit.
        await client.query("insert into public.schema_migrations (version, checksum) values ($1, $2)", [
          version,
          checksum(sql),
        ]);
        await client.query("commit");
      } catch (error) {
        await client.query("rollback");
        console.error(`Failed: ${version}. Nothing from this file was applied.`);
        console.error(error instanceof Error ? error.message : error);
        return 1;
      }
      console.log(`Applied ${version} (${Date.now() - started} ms)`);
    }
    if (toApply.length === 0) console.log("Nothing to apply.");
    return 0;
  } finally {
    await client.end();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().then(
    (code) => process.exit(code),
    (error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exit(1);
    },
  );
}

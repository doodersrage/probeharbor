#!/usr/bin/env node
/**
 * Copy one Postgres database into another, empty one and prove the copy:
 * for the Neon → Layerbase cutover (docs/guide/database-move.md).
 *
 *   node scripts/db-copy.mjs --from-env DATABASE_URL_UNPOOLED --to-env DATABASE_URL_LAYERBASE
 *   options: --env-file .env
 *
 * 1. Refuses unless the target's public schema has no tables (never
 *    overwrites anything).
 * 2. pg_dump of the source (custom format; Neon's unused neon_auth schema
 *    left out, as the backups do), then restored into the target (as SQL,
 *    without Layerbase's pg_attver column options: lib/restoreDump.mjs) with
 *    ON_ERROR_STOP in one transaction, no owners, no privileges (the target's own user
 *    owns everything, as the app expects).
 * 3. Re-applies migration 0005's grants (the migration_reader role for CI's
 *    pending-migration check), which --no-privileges leaves out.
 * 4. Compares the exact row count of every public table, source vs target,
 *    and exits 1 on any difference.
 *
 * Connection strings come from the env file and are never printed. Needs
 * pg_dump / pg_restore 18+ on PATH. The dump file is deleted afterwards.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { parseEnvFile } from "./parseEnvFile.mjs";
import { restoreDumpPortably } from "./lib/restoreDump.mjs";

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const envPath = resolve(arg("--env-file", ".env"));
const fromEnv = arg("--from-env", "");
const toEnv = arg("--to-env", "");
if (!fromEnv || !toEnv) {
  console.error(
    "Usage: node scripts/db-copy.mjs --from-env <VAR> --to-env <VAR> [--env-file .env]",
  );
  process.exit(2);
}
const env = existsSync(envPath) ? parseEnvFile(readFileSync(envPath, "utf8")) : {};
const urlOf = (name) => {
  const raw = (process.env[name] ?? env[name] ?? "")
    .trim()
    .replace(/^psql\s+/, "")
    .replace(/^(['"])(.*)\1$/s, "$2");
  try {
    return new URL(raw);
  } catch {
    console.error(`${name} is not set to a postgres:// URL.`);
    process.exit(2);
  }
};
const from = urlOf(fromEnv);
const to = urlOf(toEnv);
if (from.hostname === to.hostname && from.pathname === to.pathname && from.port === to.port) {
  console.error("Source and target are the same database.");
  process.exit(2);
}

/** libpq settings for pg_dump / pg_restore, so no URL appears in a process list. */
const pgEnv = (url) => ({
  ...process.env,
  PGHOST: url.hostname,
  PGPORT: url.port || "5432",
  PGUSER: decodeURIComponent(url.username),
  PGPASSWORD: decodeURIComponent(url.password),
  PGDATABASE: decodeURIComponent(url.pathname.replace(/^\//, "")) || "postgres",
  PGSSLMODE:
    url.searchParams.get("sslmode") ||
    (["localhost", "127.0.0.1"].includes(url.hostname) ? "disable" : "require"),
});

const { default: pg } = await import("pg");
const connect = async (url) => {
  const c = new pg.Client({
    ...Object.fromEntries(Object.entries(pgEnv(url)).filter(([k]) => k.startsWith("PG"))),
    host: url.hostname,
    port: Number(url.port || 5432),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.replace(/^\//, "")) || "postgres",
    ssl: pgEnv(url).PGSSLMODE === "disable" ? false : { rejectUnauthorized: false },
  });
  await c.connect();
  return c;
};

const target = await connect(to);
const existing = (
  await target.query(
    "select count(*)::int n from information_schema.tables where table_schema = 'public'",
  )
).rows[0].n;
if (existing > 0) {
  console.error(
    `${toEnv} already has ${existing} table(s) in public; refusing to copy over them. Empty it first.`,
  );
  await target.end();
  process.exit(1);
}

const work = mkdtempSync(join(tmpdir(), "db-copy-"));
const file = join(work, "copy.dump");
try {
  console.log(`Dumping ${fromEnv}…`);
  const r = spawnSync(
    "pg_dump",
    [
      "--format=custom",
      "--no-owner",
      "--no-privileges",
      "--exclude-schema=neon_auth",
      "--file",
      file,
    ],
    { env: pgEnv(from), stdio: ["ignore", "inherit", "inherit"] },
  );
  if (r.status !== 0) throw new Error(`pg_dump failed (exit ${r.status})`);

  console.log(`Restoring into ${toEnv}…`);
  const restored = restoreDumpPortably(file, pgEnv(to), join(work, "copy.sql"));
  if (restored.removedVendorOptions) {
    console.log(
      `  (left out ${restored.removedVendorOptions} Layerbase-only column options, pg_attver)`,
    );
  }

  // Migration 0005's grants (the role is cluster-wide; create it if missing).
  await target.query(`do $$ begin
      if not exists (select 1 from pg_roles where rolname = 'migration_reader') then create role migration_reader nologin; end if;
    end $$`);
  await target.query("grant usage on schema public to migration_reader");
  await target.query("grant select on public.schema_migrations to migration_reader");
  await target.query(`do $$ begin
      if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'schema_migrations' and policyname = 'migration_reader_select') then
        create policy migration_reader_select on public.schema_migrations for select to migration_reader using (true);
      end if;
    end $$`);

  console.log("Comparing row counts…");
  const source = await connect(from);
  const tables = (
    await source.query(
      "select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' order by 1",
    )
  ).rows.map((x) => x.table_name);
  let bad = 0;
  let rows = 0;
  for (const t of tables) {
    const q = `select count(*)::bigint n from public."${t.replace(/"/g, '""')}"`;
    const [a, b] = await Promise.all([
      source.query(q),
      target.query(q).catch(() => ({ rows: [{ n: "missing" }] })),
    ]);
    const na = String(a.rows[0].n);
    const nb = String(b.rows[0].n);
    rows += Number(na);
    if (na !== nb) {
      bad++;
      console.error(`  DIFFERS ${t}: source ${na}, target ${nb}`);
    }
  }
  await source.end();
  if (bad) throw new Error(`${bad} of ${tables.length} tables differ`);
  console.log(`Copied: ${tables.length} tables, ${rows} rows, every count equal.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await target.end().catch(() => {});
  rmSync(work, { recursive: true, force: true });
}

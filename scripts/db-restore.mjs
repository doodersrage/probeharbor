#!/usr/bin/env node
/**
 * Restore a decrypted backup (pg_dump custom format, e.g. from the off-site
 * backup after `age -d`) into an empty database:
 *
 *   node scripts/db-restore.mjs <file.dump> --to-env RESTORE_DATABASE_URL [--env-file .env]
 *
 * Refuses a target whose public schema has tables. Leaves out Layerbase's
 * pg_attver column options (scripts/lib/restoreDump.mjs), so a Layerbase
 * backup restores into any Postgres 18+. Prints table and row counts.
 */
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
const dump = args[0] && !args[0].startsWith("--") ? resolve(args[0]) : "";
const toEnv = arg("--to-env", "");
if (!dump || !existsSync(dump) || !toEnv) {
  console.error("Usage: node scripts/db-restore.mjs <file.dump> --to-env <VAR> [--env-file .env]");
  process.exit(2);
}
const envPath = resolve(arg("--env-file", ".env"));
const env = existsSync(envPath) ? parseEnvFile(readFileSync(envPath, "utf8")) : {};
let url;
try {
  url = new URL((process.env[toEnv] ?? env[toEnv] ?? "").trim());
} catch {
  console.error(`${toEnv} is not set to a postgres:// URL.`);
  process.exit(2);
}
const local = ["localhost", "127.0.0.1"].includes(url.hostname);
const pgEnv = {
  ...process.env,
  PGHOST: url.hostname,
  PGPORT: url.port || "5432",
  PGUSER: decodeURIComponent(url.username),
  PGPASSWORD: decodeURIComponent(url.password),
  PGDATABASE: decodeURIComponent(url.pathname.replace(/^\//, "")) || "postgres",
  PGSSLMODE: url.searchParams.get("sslmode") || (local ? "disable" : "require"),
};

const { default: pg } = await import("pg");
const client = new pg.Client({
  host: pgEnv.PGHOST,
  port: Number(pgEnv.PGPORT),
  user: pgEnv.PGUSER,
  password: pgEnv.PGPASSWORD,
  database: pgEnv.PGDATABASE,
  ssl: pgEnv.PGSSLMODE === "disable" ? false : { rejectUnauthorized: false },
});
await client.connect();
const existing = (
  await client.query(
    "select count(*)::int n from information_schema.tables where table_schema = 'public'",
  )
).rows[0].n;
if (existing > 0) {
  console.error(
    `${toEnv} already has ${existing} table(s) in public; refusing to restore over them.`,
  );
  await client.end();
  process.exit(1);
}
const work = mkdtempSync(join(tmpdir(), "db-restore-"));
try {
  const r = restoreDumpPortably(dump, pgEnv, join(work, "restore.sql"));
  const tables = (
    await client.query(
      "select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE'",
    )
  ).rows;
  let rows = 0;
  for (const t of tables)
    rows += Number(
      (await client.query(`select count(*) n from public."${t.table_name.replace(/"/g, '""')}"`))
        .rows[0].n,
    );
  console.log(
    `Restored ${tables.length} tables, ${rows} rows${r.removedVendorOptions ? ` (left out ${r.removedVendorOptions} pg_attver column options)` : ""}.`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
  rmSync(work, { recursive: true, force: true });
}

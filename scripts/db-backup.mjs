#!/usr/bin/env node
/**
 * Back up the production database with pg_dump (read-only on the server).
 * The Supabase Free plan keeps no backups, so this is the only copy: run it
 * regularly and before any risky migration or data fix.
 *
 * Usage: pnpm db:backup [--env-file .env] [--out-dir backups]
 * Needs SUPABASE_DB_URL in .env (Dashboard → Connect → "Session pooler" or
 * direct connection string, with the database password filled in) and
 * pg_dump 17+ on PATH.
 *
 * Writes backups/probeharbor-<UTC time>.dump (pg_dump custom format,
 * compressed; restore with pg_restore). The connection string is passed to
 * pg_dump through libpq environment variables and never printed.
 */
import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { parseEnvFile } from "./parseEnvFile.mjs";

const args = process.argv.slice(2);
const argValue = (name, fallback) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const envPath = resolve(argValue("--env-file", ".env"));
const outDir = resolve(argValue("--out-dir", "backups"));

const env = existsSync(envPath) ? parseEnvFile(readFileSync(envPath, "utf8")) : {};
const raw = (process.env.SUPABASE_DB_URL ?? env.SUPABASE_DB_URL ?? "").trim();
if (!raw) {
  console.error(
    `SUPABASE_DB_URL is not set in ${envPath}. Copy the Postgres connection string from Supabase → Connect (with the password) into .env.`,
  );
  process.exit(1);
}

let url;
try {
  url = new URL(raw);
} catch {
  console.error("SUPABASE_DB_URL is not a valid postgres:// URL.");
  process.exit(1);
}
if (!/^postgres(ql)?:$/.test(url.protocol)) {
  console.error("SUPABASE_DB_URL must start with postgres:// or postgresql://.");
  process.exit(1);
}

const version = spawnSync("pg_dump", ["--version"], { encoding: "utf8" });
if (version.status !== 0) {
  console.error("pg_dump was not found on PATH. Install the PostgreSQL client tools (17 or newer).");
  process.exit(1);
}
const major = Number(/(\d+)\./.exec(version.stdout)?.[1] ?? 0);
if (major < 17) {
  console.error(`${version.stdout.trim()} is older than the server (17). Install pg_dump 17 or newer.`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true, mode: 0o700 });
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+$/, "Z");
const file = resolve(outDir, `probeharbor-${stamp}.dump`);

const pgEnv = {
  ...process.env,
  PGHOST: url.hostname,
  PGPORT: url.port || "5432",
  PGUSER: decodeURIComponent(url.username),
  PGPASSWORD: decodeURIComponent(url.password),
  PGDATABASE: decodeURIComponent(url.pathname.replace(/^\//, "")) || "postgres",
  PGSSLMODE: url.searchParams.get("sslmode") || "require",
};

console.log(`Backing up ${url.hostname} (${version.stdout.trim()}) → ${file}`);
const dump = spawnSync(
  "pg_dump",
  ["--format=custom", "--no-owner", "--no-privileges", "--file", file],
  { env: pgEnv, stdio: ["ignore", "inherit", "inherit"] },
);
if (dump.status !== 0) {
  // pg_dump can leave a partial file; remove it so it's never mistaken for a backup.
  rmSync(file, { force: true });
  console.error(`pg_dump failed (exit ${dump.status}). No backup was written.`);
  if (/^db\.[a-z0-9]+\.supabase\.co$/i.test(url.hostname)) {
    console.error(
      'Hint: that is the "Direct connection" host, which is IPv6-only on the Free plan. In Supabase → Connect, choose "Session pooler" (host …pooler.supabase.com, user postgres.<project-ref>, port 5432) and use that string instead.',
    );
  }
  process.exit(dump.status ?? 1);
}

chmodSync(file, 0o600);
const mb = (statSync(file).size / 1024 / 1024).toFixed(1);
console.log(`Done: ${mb} MB. It holds user data and hashed credentials: keep it encrypted and off shared drives.`);
console.log(`Check it with: pg_restore --list "${file}" | head`);

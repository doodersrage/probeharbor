#!/usr/bin/env node
/**
 * Back up the production database (Postgres on Layerbase) with pg_dump
 * (read-only on the server). Layerbase has no point-in-time restore; this is
 * the copy you keep: run it before any risky migration or data fix. (The
 * scheduled off-site backup is .github/workflows/db-backup.yml.)
 *
 * Usage: pnpm db:backup [--env-file .env] [--out-dir backups] [--url-env NAME]
 * Reads DATABASE_URL_UNPOOLED from .env by default (the database's direct
 * connection string: pg_dump needs a direct session, not a pooler) and needs
 * pg_dump 18+ on PATH (the database runs Postgres 18).
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
const urlEnv = argValue("--url-env", "DATABASE_URL_UNPOOLED");

const env = existsSync(envPath) ? parseEnvFile(readFileSync(envPath, "utf8")) : {};
const raw = (process.env[urlEnv] ?? env[urlEnv] ?? "").trim();
if (!raw) {
  console.error(
    `${urlEnv} is not set in ${envPath}. Copy the database's direct (unpooled) connection string into .env (docs/guide/deploy.md, Backups).`,
  );
  process.exit(1);
}

// Connection dialogs often show `psql 'postgresql://…'`; accept that and
// stray quotes rather than fail on a copy-paste.
const cleaned = raw
  .replace(/^psql\s+/, "")
  .trim()
  .replace(/^(['"])(.*)\1$/s, "$2")
  .trim();

let url;
try {
  url = new URL(cleaned);
} catch {
  // Describe the value's shape without printing any of it (it holds a password).
  const hints = [
    /\s/.test(cleaned) && "contains spaces or line breaks",
    !/^[a-z]+:\/\//i.test(cleaned) && "doesn't start with a scheme like postgresql://",
    /['"]/.test(cleaned) && "contains quote characters",
  ].filter(Boolean);
  console.error(
    `${urlEnv} is not a valid postgres:// URL${hints.length ? ` (${hints.join("; ")})` : ""}. Paste only the connection string.`,
  );
  process.exit(1);
}
if (!/^postgres(ql)?:$/.test(url.protocol)) {
  console.error(`${urlEnv} must start with postgres:// or postgresql://.`);
  process.exit(1);
}

const version = spawnSync("pg_dump", ["--version"], { encoding: "utf8" });
if (version.status !== 0) {
  console.error(
    "pg_dump was not found on PATH. Install the PostgreSQL client tools (18 or newer).",
  );
  process.exit(1);
}
const major = Number(/(\d+)\./.exec(version.stdout)?.[1] ?? 0);
if (major < 18) {
  console.error(
    `${version.stdout.trim()} is older than the server (18). Install pg_dump 18 or newer.`,
  );
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
  [
    "--format=custom",
    "--no-owner",
    "--no-privileges",
    // Neon's auth product schema, if a database copied from Neon still has
    // one: unused (ProbeHarbor's auth is public.auth_*) and unreadable by the
    // read-only backup role. Layerbase has none; excluding it is harmless.
    "--exclude-schema=neon_auth",
    "--file",
    file,
  ],
  { env: pgEnv, stdio: ["ignore", "inherit", "inherit"] },
);
if (dump.status !== 0) {
  // pg_dump can leave a partial file; remove it so it's never mistaken for a backup.
  rmSync(file, { force: true });
  console.error(`pg_dump failed (exit ${dump.status}). No backup was written.`);
  if (/-pooler\./i.test(url.hostname)) {
    console.error(
      "Hint: that looks like a pooled host (…-pooler…). Use the direct connection string.",
    );
  }
  process.exit(dump.status ?? 1);
}

chmodSync(file, 0o600);
const mb = (statSync(file).size / 1024 / 1024).toFixed(1);
console.log(
  `Done: ${mb} MB. It holds user data and hashed credentials: keep it encrypted and off shared drives.`,
);
console.log(`Check it with: pg_restore --list "${file}" | head`);

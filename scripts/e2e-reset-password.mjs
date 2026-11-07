#!/usr/bin/env node
/**
 * Reset the dedicated E2E user's password and write it to .env.
 * Usage: pnpm e2e:reset-password
 *
 * Sets the same password in every database the e2e account is used with:
 * DATABASE_URL (production: ops:dogfood) and, when set, E2E_DATABASE_URL
 * (the Neon dev branch: CI e2e). Only touches the account matching
 * E2E_TEST_EMAIL, and ends its sessions. Prints no password.
 *
 * The account must already exist with a password (sign up on the site first).
 * After a reset, run `pnpm setup:e2e-github-secrets` so CI gets the new one.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { randomBytes } from "node:crypto";
import { openDb, setAccountPassword } from "./lib/scriptDb.mjs";

function parseEnvFile(path) {
  const text = readFileSync(path, "utf8");
  const out = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function upsertEnvKey(path, key, value) {
  const text = readFileSync(path, "utf8");
  const line = `${key}=${value}`;
  if (new RegExp(`^${key}=`, "m").test(text)) {
    writeFileSync(path, text.replace(new RegExp(`^${key}=.*$`, "m"), line));
  } else {
    writeFileSync(path, `${text.trimEnd()}\n${line}\n`);
  }
}

const envPath = resolve(".env");
const env = parseEnvFile(envPath);
const email = env.E2E_TEST_EMAIL?.trim();
const targets = [
  ["production (DATABASE_URL)", env.DATABASE_URL?.trim()],
  ["dev branch (E2E_DATABASE_URL)", env.E2E_DATABASE_URL?.trim()],
].filter(([, url]) => url);

if (!email) {
  console.error("Set E2E_TEST_EMAIL in .env first");
  process.exit(1);
}
if (targets.length === 0) {
  console.error("Need DATABASE_URL (and optionally E2E_DATABASE_URL) in .env");
  process.exit(1);
}

const password = `E2E-${randomBytes(12).toString("base64url")}`;
let failed = false;
let updated = 0;
for (const [label, url] of targets) {
  const db = openDb(url, label);
  try {
    if (await setAccountPassword(db, email, password)) {
      updated += 1;
      console.log(`Updated password for ${email} in ${label}`);
    }
    else {
      console.error(`No email + password account for ${email} in ${label}; sign up there first.`);
      failed = true;
    }
  } catch (error) {
    console.error(`${label}: ${error instanceof Error ? error.message : error}`);
    failed = true;
  } finally {
    await db.end();
  }
}

if (updated === 0) {
  console.error("No database was updated; .env keeps the old password.");
  process.exit(1);
}
// Any database that took the new password needs it in .env, even if another failed.
upsertEnvKey(envPath, "E2E_TEST_PASSWORD", password);
console.log("Wrote E2E_TEST_PASSWORD to .env (not printed).");
if (failed) {
  console.error("Some databases kept the old password (see above); fix them and re-run to bring all in line.");
  process.exit(1);
}
console.log("Next: pnpm setup:e2e-github-secrets, then pnpm test:e2e:auth");

#!/usr/bin/env node
/**
 * Copy ProbeHarbor's data and users from a Supabase database into an empty
 * database built from db/migrations (step 5 of the move off Supabase:
 * rehearse on Neon branches, then step 6 runs it for real).
 *
 * Usage:
 *   node scripts/db-copy-from-supabase.mjs --source-url-env SOURCE_URL --target-url-env TARGET_URL
 *     [--env-file .env] [--secret-env BETTER_AUTH_SECRET] [--cutover]
 *
 * The source can be the live Supabase database (read only: plain SELECTs)
 * or a local restore of a `pnpm db:backup` dump (schemas auth + public).
 * Connection strings come from the named variables (process env, then the
 * env file) and are never printed. No row data is printed either: only
 * counts.
 *
 * What it does, in ONE transaction on the target (a failure leaves it empty):
 * - auth.users → auth_users (same ids), with name, avatar, email confirmed,
 *   and user_profiles.metadata / app_metadata from raw_user_meta_data /
 *   raw_app_meta_data.
 * - Logins → auth_accounts: the bcrypt password (Better Auth accepts it, see
 *   betterAuthConfig.ts), Google / Discord / GitHub identities, and GitHub
 *   users of the old custom flow (user_metadata.github_id, no identity row).
 * - Verified TOTP factors → auth_two_factors, secret stored the way Better
 *   Auth imports other providers' secrets ("base32:<secret>", encrypted with
 *   BETTER_AUTH_SECRET, so it must be the target deployment's secret). One
 *   per user (the newest). Security keys (WebAuthn) are not copied: those
 *   users add a passkey after the move (decided 2026-11-07).
 * - Every public table the migrations created, parents before children,
 *   with the seeded `groups` rows replaced by the source's; sequences moved
 *   past the copied ids. The sign-up triggers on auth_users are switched
 *   off meanwhile (households come from the source).
 * - Sessions are not copied: everyone signs in again.
 *
 * Refuses: a Supabase target, a target that already has users or
 * households, and the production Neon URL (DATABASE_URL, DATABASE_URL_UNPOOLED)
 * unless --cutover is given.
 */
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { parseEnvFile } from "./parseEnvFile.mjs";

const require = createRequire(import.meta.url);
const pg = require("pg");
const { symmetricEncrypt } = await import("better-auth/crypto");

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const flag = (name) => args.includes(name);
const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const envPath = resolve(arg("--env-file", ".env"));
const fileEnv = existsSync(envPath) ? parseEnvFile(readFileSync(envPath, "utf8")) : {};
const fromEnv = (name) => (process.env[name] ?? fileEnv[name] ?? "").trim();

const sourceEnv = arg("--source-url-env");
const targetEnv = arg("--target-url-env");
if (!sourceEnv || !targetEnv) fail("Give --source-url-env NAME and --target-url-env NAME.");
const sourceUrl = fromEnv(sourceEnv);
const targetUrl = fromEnv(targetEnv);
if (!sourceUrl) fail(`${sourceEnv} is not set.`);
if (!targetUrl) fail(`${targetEnv} is not set.`);
const secret = fromEnv(arg("--secret-env", "BETTER_AUTH_SECRET"));
if (secret.length < 32) fail("BETTER_AUTH_SECRET (or --secret-env) must be set to the target deployment's secret (32+ characters).");

const targetHost = new URL(targetUrl).hostname;
if (/supabase\.(co|com|net)$/.test(targetHost)) fail("Refusing: the target is a Supabase database.");
if (["DATABASE_URL", "DATABASE_URL_UNPOOLED"].includes(targetEnv) && !flag("--cutover")) {
  fail(`Refusing: ${targetEnv} is production. Rehearse on a branch; pass --cutover only in step 6.`);
}

const source = new pg.Client({ connectionString: sourceUrl });
const target = new pg.Client({ connectionString: targetUrl });
await source.connect();
await target.connect();

const one = async (client, text, params = []) => (await client.query(text, params)).rows;
const ident = (name) => `"${name.replaceAll('"', '""')}"`;

try {
  // ---- preflight -------------------------------------------------------------------
  const [{ users, households }] = await one(
    target,
    "select (select count(*) from public.auth_users)::int as users, (select count(*) from public.households)::int as households",
  );
  if (users > 0 || households > 0) fail("Refusing: the target already has users or households. Use a fresh branch.");

  // Public tables to copy: what the migrations made, minus Better Auth's and our own.
  const skip = new Set(["schema_migrations", "user_profiles"]);
  const targetTables = (
    await one(target, "select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE'")
  )
    .map((r) => r.table_name)
    .filter((t) => !t.startsWith("auth_") && !skip.has(t));
  const sourceTables = new Set(
    (await one(source, "select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE'")).map(
      (r) => r.table_name,
    ),
  );
  const missing = targetTables.filter((t) => !sourceTables.has(t));
  if (missing.length) fail(`Source lacks tables the target has: ${missing.join(", ")}`);

  // Parents before children (foreign keys inside public).
  const edges = await one(
    target,
    `select c.conrelid::regclass::text as child, c.confrelid::regclass::text as parent,
            a.attname as col, not a.attnotnull as nullable, array_length(c.conkey, 1) as width
     from pg_constraint c join pg_attribute a on a.attrelid = c.conrelid and a.attnum = c.conkey[1]
     where c.contype = 'f' and c.connamespace = 'public'::regnamespace and c.conrelid <> c.confrelid`,
  );
  const strip = (t) => t.replace(/^public\./, "").replaceAll('"', "");
  const deps = new Map(targetTables.map((t) => [t, new Map()])); // child -> parent -> edges
  for (const e of edges) {
    const c = strip(e.child);
    const p = strip(e.parent);
    if (!deps.has(c) || !deps.has(p)) continue;
    if (!deps.get(c).has(p)) deps.get(c).set(p, []);
    deps.get(c).get(p).push(e);
  }
  // Kahn's order. A cycle (households -> device_sensors -> devices ->
  // households) is broken at a nullable single-column foreign key: that
  // column is copied as null, then filled in once every table is in.
  const order = [];
  const deferred = []; // { table, col }
  while (order.length < targetTables.length) {
    const left = [...deps.keys()].filter((t) => !order.includes(t));
    const ready = left.filter((t) => [...deps.get(t).keys()].every((p) => order.includes(p))).sort();
    if (ready.length) {
      order.push(...ready);
      continue;
    }
    let broke = false;
    for (const t of left) {
      for (const [p, list] of deps.get(t)) {
        if (order.includes(p) || !list.every((e) => e.nullable && e.width === 1)) continue;
        for (const e of list) deferred.push({ table: t, col: e.col });
        deps.get(t).delete(p);
        broke = true;
      }
      if (broke) break;
    }
    if (!broke) fail("Foreign keys form a cycle with no nullable column to break it.");
  }

  await target.query("begin");
  await target.query("alter table public.auth_users disable trigger user");

  // ---- users ------------------------------------------------------------------------
  const authUsers = await one(
    source,
    `select id, email, email_confirmed_at, created_at, updated_at,
            coalesce(raw_user_meta_data, '{}'::jsonb) as meta, coalesce(raw_app_meta_data, '{}'::jsonb) as app_meta,
            encrypted_password
     from auth.users order by created_at, id`,
  );
  if (authUsers.some((u) => !u.email)) fail("A source user has no email; Better Auth needs one. Look at it before copying.");
  for (const u of authUsers) {
    const name = String(u.meta.full_name ?? u.meta.name ?? u.email.split("@")[0]).slice(0, 200);
    const image = typeof u.meta.avatar_url === "string" ? u.meta.avatar_url : typeof u.meta.picture === "string" ? u.meta.picture : null;
    await target.query(
      `insert into public.auth_users (id, name, email, "emailVerified", image, "createdAt", "updatedAt", "twoFactorEnabled")
       values ($1, $2, lower($3), $4, $5, $6::timestamptz, coalesce($7::timestamptz, $6::timestamptz), false)`,
      [u.id, name, u.email, u.email_confirmed_at !== null, image, u.created_at, u.updated_at],
    );
    await target.query("insert into public.user_profiles (user_id, metadata, app_metadata) values ($1, $2, $3)", [
      u.id,
      JSON.stringify(u.meta),
      JSON.stringify(u.app_meta),
    ]);
    if (u.encrypted_password) {
      await target.query(
        `insert into public."auth_accounts" ("accountId", "providerId", "userId", password, "createdAt", "updatedAt")
         values ($1::text, 'credential', $1::uuid, $2, $3, now())`,
        [u.id, u.encrypted_password, u.created_at],
      );
    }
  }

  const identities = await one(
    source,
    `select user_id, provider, provider_id, created_at from auth.identities
     where provider in ('google', 'discord', 'github') order by created_at`,
  );
  for (const i of identities) {
    await target.query(
      `insert into public."auth_accounts" ("accountId", "providerId", "userId", "createdAt", "updatedAt") values ($1, $2, $3, $4, now())`,
      [String(i.provider_id), i.provider, i.user_id, i.created_at],
    );
  }
  // The old custom GitHub flow made users without a github identity row.
  let githubFromMetadata = 0;
  for (const u of authUsers) {
    const ghId = u.meta.github_id;
    if (ghId === undefined || ghId === null || ghId === "") continue;
    if (identities.some((i) => i.user_id === u.id && i.provider === "github")) continue;
    await target.query(
      `insert into public."auth_accounts" ("accountId", "providerId", "userId", "createdAt", "updatedAt") values ($1, 'github', $2, $3, now())`,
      [String(ghId), u.id, u.created_at],
    );
    githubFromMetadata += 1;
  }

  const totp = await one(
    source,
    `select distinct on (user_id) user_id, secret from auth.mfa_factors
     where factor_type = 'totp' and status = 'verified' and secret is not null
     order by user_id, created_at desc`,
  );
  for (const f of totp) {
    const encrypted = await symmetricEncrypt({ key: secret, data: `base32:${f.secret}` });
    await target.query(
      `insert into public.auth_two_factors (secret, "backupCodes", "userId", verified) values ($1, '[]', $2, true)`,
      [encrypted, f.user_id],
    );
    await target.query(`update public.auth_users set "twoFactorEnabled" = true where id = $1`, [f.user_id]);
  }
  const [{ n: webauthn }] = await one(source, "select count(*)::int as n from auth.mfa_factors where factor_type = 'webauthn'");

  // ---- app data ------------------------------------------------------------------------
  await target.query("delete from public.groups");
  const BATCH = 1000;
  for (const table of order) {
    const columns = (
      await one(
        target,
        `select column_name from information_schema.columns
         where table_schema = 'public' and table_name = $1 and is_generated = 'NEVER' order by ordinal_position`,
        [table],
      )
    ).map((r) => r.column_name);
    const list = columns.map(ident).join(", ");
    const nulled = new Set(deferred.filter((d) => d.table === table).map((d) => d.col));
    const select = columns.map((c) => (nulled.has(c) ? `null as ${ident(c)}` : ident(c))).join(", ");
    await source.query("begin");
    await source.query(`declare copy_cursor no scroll cursor for select row_to_json(t) as r from public.${ident(table)} t`);
    for (;;) {
      const { rows } = await source.query(`fetch ${BATCH} from copy_cursor`);
      if (!rows.length) break;
      await target.query(
        `insert into public.${ident(table)} (${list}) overriding system value
         select ${select} from json_populate_recordset(null::public.${ident(table)}, $1::json)`,
        [JSON.stringify(rows.map((r) => r.r))],
      );
    }
    await source.query("close copy_cursor");
    await source.query("commit");
  }

  // Columns held back to break a foreign-key cycle, now that their parents exist.
  for (const { table, col } of deferred) {
    const pk = (
      await one(
        target,
        `select a.attname from pg_index i join pg_attribute a on a.attrelid = i.indrelid and a.attnum = any(i.indkey)
         where i.indrelid = ('public.' || $1)::regclass and i.indisprimary`,
        [table],
      )
    ).map((r) => r.attname);
    if (pk.length !== 1) fail(`${table} needs a one-column primary key to fill in ${col}.`);
    const rows = await one(source, `select ${ident(pk[0])} as k, ${ident(col)} as v from public.${ident(table)} where ${ident(col)} is not null`);
    for (const r of rows) {
      await target.query(`update public.${ident(table)} set ${ident(col)} = $2 where ${ident(pk[0])} = $1`, [r.k, r.v]);
    }
  }

  // Sequences past the copied ids.
  const sequences = await one(
    target,
    `select s.relname as seq, t.relname as tbl, a.attname as col
     from pg_class s join pg_depend d on d.objid = s.oid and d.deptype in ('a', 'i')
     join pg_class t on t.oid = d.refobjid join pg_attribute a on a.attrelid = t.oid and a.attnum = d.refobjsubid
     where s.relkind = 'S' and s.relnamespace = 'public'::regnamespace`,
  );
  for (const { seq, tbl, col } of sequences) {
    await target.query(
      `select setval('public.${ident(seq)}', coalesce((select max(${ident(col)}) from public.${ident(tbl)}), 0) + 1, false)`,
    );
  }

  await target.query("alter table public.auth_users enable trigger user");

  // ---- report (counts only) ----------------------------------------------------------------
  const mismatches = [];
  const report = [];
  for (const table of order) {
    const [{ n: s }] = await one(source, `select count(*)::int as n from public.${ident(table)}`);
    const [{ n: t }] = await one(target, `select count(*)::int as n from public.${ident(table)}`);
    report.push(`${table.padEnd(34)} ${String(s).padStart(8)} ${String(t).padStart(8)}${s === t ? "" : "  MISMATCH"}`);
    if (s !== t) mismatches.push(table);
  }
  const [counts] = await one(
    target,
    `select (select count(*) from public.auth_users)::int as users,
            (select count(*) from public.auth_accounts where "providerId" = 'credential')::int as passwords,
            (select count(*) from public.auth_accounts where "providerId" <> 'credential')::int as oauth,
            (select count(*) from public.auth_two_factors)::int as totp`,
  );
  console.log(`${"table".padEnd(34)} ${"source".padStart(8)} ${"target".padStart(8)}`);
  console.log(report.join("\n"));
  console.log(
    `\nusers ${counts.users}/${authUsers.length}, password logins ${counts.passwords}, OAuth logins ${counts.oauth} (${githubFromMetadata} GitHub from user_metadata), TOTP ${counts.totp}, security keys not copied ${webauthn}`,
  );
  if (mismatches.length || counts.users !== authUsers.length) {
    await target.query("rollback");
    fail(`Counts differ (${mismatches.join(", ") || "users"}); rolled back, the target is unchanged.`);
  }
  if (flag("--dry-run")) {
    await target.query("rollback");
    console.log("Dry run: rolled back, the target is unchanged.");
  } else {
    await target.query("commit");
    console.log("Committed.");
  }
} catch (error) {
  await target.query("rollback").catch(() => {});
  console.error("Copy failed, rolled back:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await source.end();
  await target.end();
}

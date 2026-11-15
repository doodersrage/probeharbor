#!/usr/bin/env node
/**
 * Reduce a COPY of production to one account: for CI's e2e database, so it
 * holds the e2e test account and nothing about anyone else.
 *
 *   node scripts/db-prune-to-account.mjs --url-env E2E_DATABASE_URL --keep-email-env E2E_TEST_EMAIL
 *
 * Refuses when the target equals any production URL in the env file
 * (DATABASE_URL, DATABASE_URL_UNPOOLED, DATABASE_URL_LAYERBASE). Keeps the
 * account, its households and everything in them; deletes every other
 * account's rows; empties email-only lists and logs. Runs in one
 * transaction with foreign-key triggers off (session_replication_role =
 * replica), then proves the result before committing: one account, no email
 * but the kept one, and no row pointing at a deleted parent (every
 * single-column foreign key checked). Anything unexpected rolls back.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseEnvFile } from "./parseEnvFile.mjs";

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const envPath = resolve(arg("--env-file", ".env"));
const urlEnv = arg("--url-env", "");
const keepEnv = arg("--keep-email-env", "E2E_TEST_EMAIL");
const env = existsSync(envPath) ? parseEnvFile(readFileSync(envPath, "utf8")) : {};
const read = (k) => (process.env[k] ?? env[k] ?? "").trim();
const target = read(urlEnv);
const keepEmail = read(keepEnv).toLowerCase();
if (!urlEnv || !target || !keepEmail) {
  console.error(
    "Usage: node scripts/db-prune-to-account.mjs --url-env <VAR> [--keep-email-env E2E_TEST_EMAIL]",
  );
  process.exit(2);
}
const same = (a, b) => {
  try {
    const x = new URL(a);
    const y = new URL(b);
    return (
      x.hostname.replace(/-pooler/, "") === y.hostname.replace(/-pooler/, "") &&
      x.pathname === y.pathname
    );
  } catch {
    return false;
  }
};
for (const prod of ["DATABASE_URL", "DATABASE_URL_UNPOOLED", "DATABASE_URL_LAYERBASE"]) {
  if (read(prod) && same(read(prod), target)) {
    console.error(`${urlEnv} is the same database as ${prod}: refusing to prune production.`);
    process.exit(1);
  }
}

/** Tables keyed by household: keep rows of the kept households. */
const BY_HOUSEHOLD = [
  "api_keys",
  "claims_pack_exports",
  "devices",
  "door_open_events",
  "freeze_estimate_snapshots",
  "history_archives",
  "history_saved_views",
  "household_activity",
  "household_invites",
  "household_members",
  "household_thermostat_connections",
  "inbound_webhooks",
  "pucks",
  "sensor_reading_rollups",
  "sensor_readings",
  "share_links",
  "status_page_tokens",
  "thermostat_snapshots",
];
/** Tables keyed by user (user_id): keep the kept account's rows. */
const BY_USER = [
  "alert_events",
  "alert_settings",
  "alert_settings_history",
  "alert_snooze_tokens",
  "chart_share_tokens",
  "fcm_device_tokens",
  "feed_uptime_checks",
  "group_members",
  "history_saved_views",
  "household_activity",
  "household_members",
  "push_subscriptions",
  "referral_codes",
  "server_errors",
  "stripe_subscriptions",
  "user_profiles",
  "webhook_deliveries",
];
/** Better Auth tables (camelCase userId). */
const BY_AUTH_USER = ["auth_accounts", "auth_passkeys", "auth_sessions", "auth_two_factors"];
/** Other people's emails, tokens and logs: emptied. */
const EMPTIED = [
  "auth_verifications",
  "contacts",
  "email_suppressions",
  "freeze_alert_subscriptions",
  "freeze_map_snapshots",
  "job_runs",
  "mobile_oauth_exchanges",
  "puck_claim_pending",
  "status_subscriptions",
  "stripe_webhook_events",
];

const { default: pg } = await import("pg");
const c = new pg.Client({ connectionString: target });
await c.connect();
try {
  const tables = new Set(
    (
      await c.query(
        "select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE'",
      )
    ).rows.map((r) => r.table_name),
  );
  const known = new Set([
    ...BY_HOUSEHOLD,
    ...BY_USER,
    ...BY_AUTH_USER,
    ...EMPTIED,
    "auth_users",
    "households",
    "device_sensors",
    "ingest_stats",
    "groups",
    "referral_signups",
    "status_notify_state",
    "schema_migrations",
  ]);
  const unknown = [...tables].filter((t) => !known.has(t));
  if (unknown.length)
    throw new Error(`tables this script doesn't know how to prune: ${unknown.join(", ")}`);

  const keep = (
    await c.query("select id from public.auth_users where lower(email) = $1", [keepEmail])
  ).rows;
  if (keep.length !== 1)
    throw new Error(`expected one account for ${keepEnv}, found ${keep.length}`);
  const uid = keep[0].id;

  await c.query("begin");
  await c.query("set local session_replication_role = replica");
  await c.query(
    "create temp table keep_hh on commit drop as select household_id as id from public.household_members where user_id = $1",
    [uid],
  );
  const del = async (sql, params = []) => (await c.query(sql, params)).rowCount;
  const counts = {};
  for (const t of BY_HOUSEHOLD)
    counts[t] =
      (counts[t] ?? 0) +
      (await del(
        `delete from public."${t}" where household_id is null or household_id not in (select id from keep_hh)`,
      ));
  for (const t of BY_USER)
    counts[t] =
      (counts[t] ?? 0) +
      (await del(`delete from public."${t}" where user_id is distinct from $1`, [uid]));
  for (const t of BY_AUTH_USER)
    counts[t] = await del(`delete from public."${t}" where "userId" is distinct from $1`, [uid]);
  counts.households = await del(
    "delete from public.households where id not in (select id from keep_hh)",
  );
  counts.device_sensors = await del(
    "delete from public.device_sensors where device_id not in (select id from public.devices)",
  );
  counts.ingest_stats = await del(
    "delete from public.ingest_stats where device_id not in (select id from public.devices)",
  );
  counts.groups = await del(
    "delete from public.groups where id not in (select group_id from public.group_members)",
  );
  counts.referral_signups = await del(
    "delete from public.referral_signups where referrer_user_id is distinct from $1 or referred_user_id is distinct from $1",
    [uid],
  );
  counts.auth_users = await del("delete from public.auth_users where id <> $1", [uid]);
  for (const t of EMPTIED) counts[t] = await del(`delete from public."${t}"`);
  await c.query("set local session_replication_role = origin");

  // Proof before commit.
  const users = (await c.query("select count(*)::int n from public.auth_users")).rows[0].n;
  if (users !== 1) throw new Error(`${users} accounts left`);
  const emails = (
    await c.query(`select table_name, column_name from information_schema.columns
      where table_schema = 'public' and (column_name ilike '%email%') and data_type in ('text', 'character varying')`)
  ).rows;
  for (const { table_name, column_name } of emails) {
    const n = (
      await c.query(
        `select count(*)::int n from public."${table_name}" where "${column_name}" is not null and lower("${column_name}") <> $1`,
        [keepEmail],
      )
    ).rows[0].n;
    if (n && !["household_invites"].includes(table_name))
      throw new Error(`${table_name}.${column_name}: ${n} other email(s) left`);
  }
  const fks = (
    await c.query(`select con.conname, rel.relname child, att.attname col, frel.relname parent, fatt.attname pcol
      from pg_constraint con
      join pg_class rel on rel.oid = con.conrelid join pg_class frel on frel.oid = con.confrelid
      join pg_attribute att on att.attrelid = con.conrelid and att.attnum = con.conkey[1]
      join pg_attribute fatt on fatt.attrelid = con.confrelid and fatt.attnum = con.confkey[1]
      where con.contype = 'f' and con.connamespace = 'public'::regnamespace and array_length(con.conkey, 1) = 1`)
  ).rows;
  for (const f of fks) {
    const n = (
      await c.query(`select count(*)::int n from public."${f.child}" x where x."${f.col}" is not null
        and not exists (select 1 from public."${f.parent}" p where p."${f.pcol}" = x."${f.col}")`)
    ).rows[0].n;
    if (n) throw new Error(`${f.child}.${f.col} → ${f.parent}: ${n} orphan row(s)`);
  }
  await c.query("commit");
  const kept = (
    await c.query(
      "select (select count(*)::int from public.households) households, (select count(*)::int from public.devices) devices, (select count(*)::int from public.sensor_readings) readings",
    )
  ).rows[0];
  const deleted = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log(
    `Pruned to one account: deleted ${deleted} rows; kept ${kept.households} household(s), ${kept.devices} device(s), ${kept.readings} reading(s). Checked ${fks.length} foreign keys and ${emails.length} email columns.`,
  );
} catch (error) {
  await c.query("rollback").catch(() => {});
  console.error(`Nothing changed: ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
} finally {
  await c.end();
}

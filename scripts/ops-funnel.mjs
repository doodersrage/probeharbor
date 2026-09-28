#!/usr/bin/env node
/**
 * Activation funnel and feature usage straight from Supabase, so it works
 * without GA4 and counts what actually happened rather than what was clicked.
 *
 * Usage: pnpm ops:funnel [--days 90] [--exclude a@x.com,b@y.com] [--list]
 *   --days     only count accounts created in the last N days (default: all)
 *   --exclude  extra emails to leave out. E2E_TEST_EMAIL and the comma-separated
 *              FUNNEL_EXCLUDE_EMAILS in .env (your own test accounts) always are.
 *   --list     print one line per account with the furthest step reached
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) {
  console.error("Needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const args = process.argv.slice(2);
const argValue = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const days = Number(argValue("--days")) || null;
const listAccounts = args.includes("--list");
const excluded = new Set(
  [
    process.env.E2E_TEST_EMAIL,
    ...(process.env.FUNNEL_EXCLUDE_EMAILS?.split(",") ?? []),
    ...(argValue("--exclude")?.split(",") ?? []),
  ]
    .map((e) => e?.trim().toLowerCase())
    .filter(Boolean),
);

const db = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function all(table, columns, apply = (q) => q) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await apply(db.from(table).select(columns)).range(from, from + 999);
    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...data);
    if (data.length < 1000) return rows;
  }
}

async function allUsers() {
  const users = [];
  for (let page = 1; ; page += 1) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`auth users: ${error.message}`);
    users.push(...data.users);
    if (data.users.length < 1000) return users;
  }
}

const now = Date.now();
const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
const since = days ? now - days * 24 * 60 * 60 * 1000 : 0;

const users = (await allUsers()).filter(
  (u) => !excluded.has(u.email?.toLowerCase()) && Date.parse(u.created_at) >= since,
);
const userIds = new Set(users.map((u) => u.id));

const [members, devices, feeds, alertSettings, events, subs] = await Promise.all([
  all("household_members", "user_id, household_id, role"),
  all("devices", "household_id, name, source, created_at, last_seen_at, enabled"),
  all("user_temp_feeds", "user_id, name, enabled"),
  all("alert_settings", "*"),
  all("alert_events", "user_id, kind, title", (q) => q.not("channels_sent", "eq", "{}")),
  all("stripe_subscriptions", "user_id, status, plan_tier"),
]);

const householdsByUser = new Map();
const membersByHousehold = new Map();
for (const m of members) {
  householdsByUser.set(m.user_id, [...(householdsByUser.get(m.user_id) ?? []), m.household_id]);
  membersByHousehold.set(m.household_id, (membersByHousehold.get(m.household_id) ?? 0) + 1);
}
const devicesByHousehold = new Map();
for (const d of devices) {
  devicesByHousehold.set(d.household_id, [...(devicesByHousehold.get(d.household_id) ?? []), d]);
}
const feedUsers = new Set(feeds.map((f) => f.user_id));

// Latest pull-feed reading per user (garage_temps can be large, so ask per user).
const pullSeen = new Map();
await Promise.all(
  [...feedUsers].filter((id) => userIds.has(id)).map(async (id) => {
    const { data } = await db
      .from("garage_temps")
      .select("timestamp")
      .eq("user_id", id)
      .order("timestamp", { ascending: false })
      .limit(1);
    if (data?.[0]) pullSeen.set(id, Date.parse(data[0].timestamp));
  }),
);

// "generic" also covers freeze drills and other system sends, and alert_settings
// rows are created automatically, so neither says the user did anything.
const deliveredTest = new Set();
const deliveredReal = new Set();
for (const e of events) {
  if (e.kind === "generic" && /test alert/i.test(e.title)) deliveredTest.add(e.user_id);
  else if (e.kind !== "generic" && e.kind !== "digest") deliveredReal.add(e.user_id);
}
const paying = new Set(subs.filter((s) => s.status === "active" || s.status === "trialing").map((s) => s.user_id));

const STEPS = [
  ["signed up", () => true],
  ["confirmed email", (u) => Boolean(u.email_confirmed_at)],
  ["added a device or feed", (u, x) => x.devices.length > 0 || feedUsers.has(u.id)],
  ["received a reading", (_u, x) => x.lastSeen > 0],
  ["delivered a test alert", (u) => deliveredTest.has(u.id) || deliveredReal.has(u.id)],
  ["reading in the last 7 days", (_u, x) => x.lastSeen >= weekAgo],
  ["delivered a real alert", (u) => deliveredReal.has(u.id)],
  ["paying", (u) => paying.has(u.id)],
];

const counts = STEPS.map(() => 0);
const accountLines = [];
for (const u of users) {
  const households = householdsByUser.get(u.id) ?? [];
  const userDevices = households.flatMap((h) => devicesByHousehold.get(h) ?? []);
  const lastSeen = Math.max(
    0,
    pullSeen.get(u.id) ?? 0,
    ...userDevices.map((d) => (d.last_seen_at ? Date.parse(d.last_seen_at) : 0)),
  );
  const ctx = { devices: userDevices, lastSeen };
  let furthest = "";
  STEPS.forEach(([label, test], i) => {
    if (test(u, ctx)) {
      counts[i] += 1;
      furthest = label;
    }
  });
  accountLines.push(
    `  ${u.email ?? u.id}  joined ${u.created_at.slice(0, 10)}  → ${furthest}${
      lastSeen ? `  (last reading ${new Date(lastSeen).toISOString().slice(0, 10)})` : ""
    }`,
  );
}

console.log(
  `Activation funnel: ${users.length} account(s)${days ? ` created in the last ${days} days` : ""}${
    excluded.size ? `, excluding ${excluded.size} test account(s)` : ""
  }\n`,
);
const width = Math.max(...STEPS.map(([label]) => label.length));
STEPS.forEach(([label], i) => {
  const n = counts[i];
  const pct = users.length ? Math.round((n / users.length) * 100) : 0;
  const prev = i > 0 && counts[i - 1] ? ` (${Math.round((n / counts[i - 1]) * 100)}% of previous)` : "";
  console.log(`  ${label.padEnd(width)}  ${String(n).padStart(4)}  ${String(pct).padStart(3)}%${prev}`);
});
if (listAccounts) console.log(`\nAccounts\n${accountLines.join("\n")}`);

// Which Devices → Setup path people pick, and whether it gets to a reading.
// The first-run chooser names each device after its path (SETUP_VIA_DEVICE_NAMES);
// renamed devices drop out, so treat this as a floor.
const SETUP_PATHS = [
  ["Home Assistant", "Home Assistant"],
  ["ESPHome", "ESPHome node"],
  ["MQTT / Node-RED", "MQTT bridge"],
  ["Board / sketch", "Workshop probe"],
];
const includedHouseholds = new Set(users.flatMap((u) => householdsByUser.get(u.id) ?? []));
const pathDevices = devices.filter(
  (d) => d.source === "push" && includedHouseholds.has(d.household_id) && Date.parse(d.created_at) >= since,
);
const demoFeedUsers = users.filter((u) =>
  feeds.some((f) => f.user_id === u.id && /example/i.test(f.name ?? "")),
).length;
console.log("\nSetup paths (devices named by the first-run chooser)\n");
const pathWidth = Math.max(...SETUP_PATHS.map(([label]) => label.length));
for (const [label, name] of SETUP_PATHS) {
  const created = pathDevices.filter((d) => d.name === name);
  const reporting = created.filter((d) => d.last_seen_at).length;
  console.log(`  ${label.padEnd(pathWidth)}  ${String(created.length).padStart(3)} created  ${String(reporting).padStart(3)} reporting`);
}
console.log(`  ${"Demo feed".padEnd(pathWidth)}  ${String(demoFeedUsers).padStart(3)} account(s)`);

// Feature usage across every household, to see what nobody touches.
const [thermostats, apiKeys, inbound, shares, statusPages, pucks, claims, pushSubs, fcm, savedViews, chartShares, referrals] =
  await Promise.all([
    all("household_thermostat_connections", "household_id, provider"),
    all("api_keys", "household_id, revoked_at"),
    all("inbound_webhooks", "household_id"),
    all("share_links", "household_id"),
    all("status_page_tokens", "household_id, revoked_at"),
    all("pucks", "household_id"),
    all("claims_pack_exports", "household_id"),
    all("push_subscriptions", "user_id"),
    all("fcm_device_tokens", "user_id"),
    all("history_saved_views", "user_id"),
    all("chart_share_tokens", "user_id"),
    all("referral_signups", "referrer_user_id"),
  ]);

const distinct = (rows, key) => new Set(rows.map((r) => r[key])).size;
const usage = [
  ["Push devices", distinct(devices.filter((d) => d.source !== "pull"), "household_id"), "households"],
  ["Pull devices", distinct(devices.filter((d) => d.source === "pull"), "household_id"), "households"],
  ["Legacy pull feeds", feedUsers.size, "users"],
  ["Shared households (2+ members)", [...membersByHousehold.values()].filter((n) => n > 1).length, "households"],
  ...[...new Set(thermostats.map((t) => t.provider))].map((p) => [
    `Thermostat: ${p}`,
    distinct(thermostats.filter((t) => t.provider === p), "household_id"),
    "households",
  ]),
  ["Metrics API keys", distinct(apiKeys.filter((k) => !k.revoked_at), "household_id"), "households"],
  ["Inbound webhooks", distinct(inbound, "household_id"), "households"],
  ["Share links", distinct(shares, "household_id"), "households"],
  ["Status pages", distinct(statusPages.filter((s) => !s.revoked_at), "household_id"), "households"],
  ["Pucks", distinct(pucks, "household_id"), "households"],
  ["Claims packs", distinct(claims, "household_id"), "households"],
  ["Web push", distinct(pushSubs, "user_id"), "users"],
  ["Android (FCM)", distinct(fcm, "user_id"), "users"],
  ["Saved history views", distinct(savedViews, "user_id"), "users"],
  ["Chart share links", distinct(chartShares, "user_id"), "users"],
  ["Referrals", distinct(referrals, "referrer_user_id"), "users"],
];
const channelColumns = Object.keys(alertSettings[0] ?? {}).filter((c) => c.startsWith("channel_") && c !== "channel_severity");
for (const column of channelColumns) {
  const name = column.slice("channel_".length);
  usage.push([`Alert channel: ${name}${name === "email" ? " (on by default)" : ""}`, alertSettings.filter((s) => s[column] === true).length, "users"]);
}
for (const [label, column] of [
  ["Custom rules", "alert_rules"],
  ["Playbooks", "alert_playbooks"],
  ["Quiet hours", "quiet_hours_enabled"],
  ["Forecast freeze", "forecast_freeze_enabled"],
  ["Weekly digest", "digest_enabled"],
]) {
  usage.push([
    label,
    alertSettings.filter((s) => (Array.isArray(s[column]) ? s[column].length > 0 : s[column] === true)).length,
    "users",
  ]);
}

console.log("\nFeature usage (all accounts)\n");
const usageWidth = Math.max(...usage.map(([label]) => label.length));
for (const [label, n, unit] of usage.sort((a, b) => b[1] - a[1])) {
  console.log(`  ${label.padEnd(usageWidth)}  ${String(n).padStart(4)} ${unit}${n === 0 ? "  ← unused" : ""}`);
}

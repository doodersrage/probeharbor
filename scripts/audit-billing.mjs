#!/usr/bin/env node
/**
 * Read-only check that Stripe and Supabase agree on who is paying for what.
 * Run it after the first real subscription, and after any plan change or cancel.
 *
 *   - webhook endpoint is enabled on the canonical host with every handled event
 *   - no undelivered Stripe events in the last 7 days
 *   - every live Stripe subscription has a matching stripe_subscriptions row
 *     (same subscription, status, price, and the plan tier that price grants)
 *   - every row that grants access is backed by a live Stripe subscription
 *
 * Usage: pnpm audit:billing   (exit 0 = consistent, 2 = mismatches)
 */
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const CANONICAL_HOST = "thermaltrace.dev";
const WEBHOOK_PATH = "/api/stripe/webhook";
const REQUIRED_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
];
// Statuses that grant paid features (see isActiveSubscriptionStatus).
const GRANTING = new Set(["active", "trialing"]);
// Statuses worth having a row for even when they don't grant access.
const LIVE = new Set(["active", "trialing", "past_due", "unpaid", "incomplete"]);

const stripeKey = process.env.STRIPE_SECRET_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!stripeKey?.startsWith("sk_") || !supabaseUrl || !serviceKey) {
  console.error("Needs STRIPE_SECRET_KEY, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const stripe = new Stripe(stripeKey);
const db = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const tierByPrice = new Map();
for (const [envName, tier] of [
  ["STRIPE_PRICE_ID", "member"],
  ["STRIPE_PRICE_ID_ANNUAL", "member"],
  ["STRIPE_PRICE_ID_PRO", "pro"],
  ["STRIPE_PRICE_ID_PRO_ANNUAL", "pro"],
  ["STRIPE_PRICE_ID_PORTFOLIO", "portfolio"],
  ["STRIPE_PRICE_ID_PORTFOLIO_ANNUAL", "portfolio"],
]) {
  const id = process.env[envName]?.trim();
  if (id) tierByPrice.set(id, tier);
}

let problems = 0;
function ok(msg) {
  console.log(`✓ ${msg}`);
}
function bad(msg) {
  console.log(`✗ ${msg}`);
  problems += 1;
}
function note(msg) {
  console.log(`· ${msg}`);
}
const errMsg = (error) => (error instanceof Error ? error.message : String(error));

console.log(`Stripe mode: ${stripeKey.startsWith("sk_live_") ? "LIVE" : "test"}\n`);

// 1. Webhook endpoint
console.log("Webhook endpoint");
try {
  const { data: endpoints } = await stripe.webhookEndpoints.list({ limit: 20 });
  const good = endpoints.filter((e) => {
    try {
      const url = new URL(e.url);
      return e.status === "enabled" && url.hostname === CANONICAL_HOST && url.pathname === WEBHOOK_PATH;
    } catch {
      return false;
    }
  });
  if (good.length === 0) {
    bad(
      `no enabled endpoint at https://${CANONICAL_HOST}${WEBHOOK_PATH} (found: ${
        endpoints.map((e) => `${e.url} [${e.status}]`).join(", ") || "none"
      })`,
    );
  } else {
    ok(`${good.map((e) => e.url).join(", ")}`);
    const events = new Set(good.flatMap((e) => e.enabled_events));
    const missing = events.has("*") ? [] : REQUIRED_EVENTS.filter((t) => !events.has(t));
    if (missing.length) bad(`endpoint is missing events: ${missing.join(", ")}`);
    else ok("subscribed to every handled event");
  }
} catch (error) {
  bad(`could not list webhook endpoints: ${errMsg(error)}`);
}

// 2. Undelivered events
try {
  const since = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;
  const failed = await stripe.events.list({ delivery_success: false, created: { gte: since }, limit: 50 });
  if (failed.data.length === 0) ok("no undelivered events in the last 7 days");
  else {
    const types = [...new Set(failed.data.map((e) => e.type))].join(", ");
    bad(
      `${failed.data.length}${failed.has_more ? "+" : ""} undelivered event(s) in the last 7 days (${types}); resend them from the Stripe dashboard`,
    );
  }
} catch (error) {
  bad(`could not list undelivered events: ${errMsg(error)}`);
}

// 3. What the Worker has actually received
const { data: received, error: receivedError } = await db
  .from("stripe_webhook_events")
  .select("type, received_at")
  .order("received_at", { ascending: false })
  .limit(500);
if (receivedError) bad(`could not read stripe_webhook_events: ${receivedError.message}`);
else if (!received?.length) note("stripe_webhook_events is empty: the Worker has not processed a webhook yet");
else {
  const latest = new Map();
  for (const row of received) if (!latest.has(row.type)) latest.set(row.type, row.received_at);
  note(`last processed: ${[...latest].map(([t, at]) => `${t} @ ${at}`).join("; ")}`);
}

// 4. Stripe subscriptions vs stripe_subscriptions rows
console.log("\nSubscriptions");
const stripeSubs = [];
try {
  for await (const sub of stripe.subscriptions.list({ status: "all", limit: 100 })) {
    if (LIVE.has(sub.status)) stripeSubs.push(sub);
  }
} catch (error) {
  bad(`could not list Stripe subscriptions: ${errMsg(error)}`);
}

const { data: rows, error: rowsError } = await db
  .from("stripe_subscriptions")
  .select("user_id, stripe_customer_id, stripe_subscription_id, status, stripe_price_id, plan_tier");
if (rowsError) {
  bad(`could not read stripe_subscriptions: ${rowsError.message}`);
  process.exit(2);
}
const rowBySub = new Map(rows.map((r) => [r.stripe_subscription_id, r]));

note(`${stripeSubs.length} live Stripe subscription(s), ${rows.length} stripe_subscriptions row(s)`);

for (const sub of stripeSubs) {
  const price = sub.items.data[0]?.price?.id ?? null;
  const customer = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const label = `${sub.id} (${customer}, ${sub.status}${sub.metadata?.smoke ? ", smoke" : ""})`;
  const expectedTier = price ? tierByPrice.get(price) : undefined;
  if (!expectedTier) {
    bad(`${label}: price ${price} is not one of the configured STRIPE_PRICE_ID_* values, so it silently maps to "member"`);
  }
  const row = rowBySub.get(sub.id);
  if (!row) {
    const other = rows.find((r) => r.stripe_customer_id === customer);
    bad(
      other
        ? `${label}: customer's row points at ${other.stripe_subscription_id} (${other.status}) instead`
        : `${label}: no stripe_subscriptions row; the customer is paying without getting the plan`,
    );
    continue;
  }
  const diffs = [];
  if (row.status !== sub.status) diffs.push(`status db=${row.status} stripe=${sub.status}`);
  if (row.stripe_price_id !== price) diffs.push(`price db=${row.stripe_price_id} stripe=${price}`);
  if (expectedTier && row.plan_tier !== expectedTier) diffs.push(`tier db=${row.plan_tier} expected=${expectedTier}`);
  if (diffs.length) bad(`${label}: ${diffs.join("; ")}`);
  else ok(`${label}: user ${row.user_id} on ${row.plan_tier}`);
}

const liveIds = new Set(stripeSubs.map((s) => s.id));
for (const row of rows) {
  if (!GRANTING.has(row.status) || liveIds.has(row.stripe_subscription_id)) continue;
  let actual = "not found";
  try {
    actual = (await stripe.subscriptions.retrieve(row.stripe_subscription_id)).status;
  } catch (error) {
    actual = `lookup failed: ${errMsg(error)}`;
  }
  bad(
    `user ${row.user_id}: row grants ${row.plan_tier} (${row.status}) but Stripe subscription ${row.stripe_subscription_id} is ${actual}`,
  );
}

console.log(problems === 0 ? "\nBilling is consistent." : `\n${problems} problem(s).`);
process.exit(problems === 0 ? 0 : 2);

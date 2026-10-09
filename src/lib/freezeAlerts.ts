import { createServerClient } from "./supabase";
import { sendEmail } from "./mailer";
import { brandedEmailParts } from "./emailLayout";
import { unsubscribeHeaders } from "./emailUnsubscribe";
import { resolveSiteUrl } from "./schemaMarkup";
import { describeFreezeNight, type FreezeNight } from "./pipeFreezeForecast";
import { fetchPipeFreezeForecast, pipeFreezeCacheKey } from "./pipeFreezeForecastFetch";

/**
 * Hardware-free freeze alerts: an email the afternoon before a freezing night
 * at a US location, from the NWS forecast behind /pipe-freeze-forecast.
 * Double opt-in like status subscriptions; one location per email.
 */

/** Local hours (inclusive start, exclusive end) when the evening alert goes out. */
export const ALERT_WINDOW_START_HOUR = 14;
export const ALERT_WINDOW_END_HOUR = 18;
const MAX_LABEL_LENGTH = 80;

export type FreezeAlertSubscriber = {
  id: string;
  email: string;
  token: string;
  place_label: string;
  lat: number;
  lon: number;
  last_alert_night: string | null;
};

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** ~1 km: enough for the forecast grid, never a street address. */
export function roundCoordinate(value: number): number {
  return Math.round(value * 100) / 100;
}

export function normalizeFreezeAlertEmail(email: string): string {
  return email.trim().toLowerCase();
}

function siteUrl(): string {
  return resolveSiteUrl(null);
}

export function freezeAlertConfirmUrl(token: string): string {
  return `${siteUrl()}/api/freeze-alerts/confirm?token=${token}`;
}

export function freezeAlertUnsubscribeUrl(token: string): string {
  return `${siteUrl()}/api/freeze-alerts/unsubscribe?token=${token}`;
}

export function freezeForecastUrl(sub: Pick<FreezeAlertSubscriber, "lat" | "lon" | "place_label">): string {
  const params = new URLSearchParams({
    lat: sub.lat.toFixed(2),
    lon: sub.lon.toFixed(2),
    place: sub.place_label,
  });
  return `${siteUrl()}/pipe-freeze-forecast?${params.toString()}`;
}

async function sendConfirmEmail(email: string, token: string, place: string): Promise<void> {
  const { text, html } = brandedEmailParts({
    eyebrow: "Freeze alerts",
    title: "Confirm your freeze alerts",
    intro: `Click below and we'll email you the afternoon before a freezing night in ${place}.`,
    paragraphs: [
      "If you didn't ask for this, ignore this message. You won't get anything unless you confirm.",
    ],
    cta: { label: "Confirm freeze alerts", url: freezeAlertConfirmUrl(token) },
    footerNote:
      "You're receiving this because someone entered this address on the ProbeHarbor pipe freeze forecast.",
  });
  await sendEmail(email, `Confirm freeze alerts for ${place}`, text, { html });
}

/**
 * Subscribe or move an address to a location. Like status subscriptions, the
 * response never reveals whether the address was already on the list. A
 * confirmed address at the same spot is left alone; any change needs a new
 * confirmation so nobody can redirect someone else's alerts.
 */
export async function subscribeToFreezeAlerts(input: {
  email: string;
  lat: number;
  lon: number;
  label: string;
}): Promise<{ ok: boolean; error?: string }> {
  const email = normalizeFreezeAlertEmail(input.email);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (!Number.isFinite(input.lat) || !Number.isFinite(input.lon) || Math.abs(input.lat) > 90 || Math.abs(input.lon) > 180) {
    return { ok: false, error: "Pick a location first." };
  }
  const lat = roundCoordinate(input.lat);
  const lon = roundCoordinate(input.lon);
  const label = input.label.trim().slice(0, MAX_LABEL_LENGTH) || `${lat.toFixed(2)}, ${lon.toFixed(2)}`;

  const supabase = createServerClient();
  const { data: existing, error: lookupError } = await supabase
    .from("freeze_alert_subscriptions")
    .select("id, confirmed_at, lat, lon")
    .eq("email", email)
    .maybeSingle();
  if (lookupError) {
    console.error("freeze alert subscribe lookup failed:", lookupError.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
  if (existing?.confirmed_at && existing.lat === lat && existing.lon === lon) {
    return { ok: true };
  }

  const token = randomToken();
  const row = { place_label: label, lat, lon, token, confirmed_at: null, last_alert_night: null };
  const { error } = existing
    ? await supabase.from("freeze_alert_subscriptions").update(row).eq("id", existing.id)
    : await supabase.from("freeze_alert_subscriptions").insert({ email, ...row });
  if (error) {
    console.error("freeze alert subscribe write failed:", error.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  try {
    await sendConfirmEmail(email, token, label);
  } catch (sendError) {
    // The row exists; a later re-subscribe re-sends. Don't fail the form over a send hiccup.
    console.error("Failed to send freeze alert confirm email:", sendError);
  }
  return { ok: true };
}

export async function confirmFreezeAlerts(token: string): Promise<{ ok: boolean }> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("freeze_alert_subscriptions")
    .select("id, confirmed_at")
    .eq("token", token)
    .maybeSingle();
  if (error || !data) return { ok: false };
  if (!data.confirmed_at) {
    await supabase
      .from("freeze_alert_subscriptions")
      .update({ confirmed_at: new Date().toISOString() })
      .eq("id", data.id);
  }
  return { ok: true };
}

export async function unsubscribeFreezeAlerts(token: string): Promise<{ ok: boolean }> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("freeze_alert_subscriptions")
    .select("id")
    .eq("token", token)
    .maybeSingle();
  if (error || !data) return { ok: false };
  await supabase.from("freeze_alert_subscriptions").delete().eq("id", data.id);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// When to alert

/** UTC offset in minutes from an NWS local timestamp like 2026-10-10T05:00:00-04:00. */
export function utcOffsetMinutes(localIso: string): number {
  const match = /([+-])(\d{2}):(\d{2})$/.exec(localIso);
  if (!match) return 0;
  const minutes = Number(match[2]) * 60 + Number(match[3]);
  return match[1] === "-" ? -minutes : minutes;
}

function localDateAndHour(now: Date, offsetMinutes: number): { date: string; hour: number } {
  const local = new Date(now.getTime() + offsetMinutes * 60_000);
  return { date: local.toISOString().slice(0, 10), hour: local.getUTCHours() };
}

function previousDate(date: string): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export type AlertDecision =
  | { send: true; night: FreezeNight; reason: "high" | "cold_spell_start" }
  | { send: false; reason: "no_forecast" | "outside_window" | "no_freeze_tonight" | "already_sent" | "cold_spell_continues" };

/**
 * Email between 2 and 6 PM local time before a freezing night:
 * - High risk (low at or below 20°F): every such night.
 * - Watch (below 32°F): only the first night of a cold spell, so people in
 *   cold climates don't get an email every night all winter.
 */
export function decideFreezeAlert(
  nights: FreezeNight[],
  lastAlertNight: string | null,
  now: Date,
): AlertDecision {
  const first = nights[0];
  if (!first) return { send: false, reason: "no_forecast" };
  const { date, hour } = localDateAndHour(now, utcOffsetMinutes(first.lowAt));
  if (hour < ALERT_WINDOW_START_HOUR || hour >= ALERT_WINDOW_END_HOUR) {
    return { send: false, reason: "outside_window" };
  }
  const tonight = nights.find((night) => night.date === date);
  if (!tonight || tonight.risk === "low") return { send: false, reason: "no_freeze_tonight" };
  if (lastAlertNight === tonight.date) return { send: false, reason: "already_sent" };
  if (tonight.risk === "high") return { send: true, night: tonight, reason: "high" };
  if (lastAlertNight === previousDate(tonight.date)) return { send: false, reason: "cold_spell_continues" };
  return { send: true, night: tonight, reason: "cold_spell_start" };
}

// ---------------------------------------------------------------------------
// The email

export function buildFreezeAlertEmail(
  sub: Pick<FreezeAlertSubscriber, "token" | "place_label" | "lat" | "lon">,
  night: FreezeNight,
  laterNights: FreezeNight[],
): { subject: string; text: string; html: string; unsubscribeUrl: string } {
  const place = sub.place_label;
  const high = night.risk === "high";
  const subject = high
    ? `High pipe-freeze risk tonight in ${place}: low ${night.lowF}°F`
    : `Freezing tonight in ${place}: low ${night.lowF}°F`;
  const unsubscribeUrl = freezeAlertUnsubscribeUrl(sub.token);
  const coming = laterNights.filter((n) => n.risk !== "low");
  const { text, html } = brandedEmailParts({
    preheader: describeFreezeNight(night),
    eyebrow: "Freeze alert",
    title: high ? `High freeze risk tonight in ${place}` : `Below freezing tonight in ${place}`,
    intro: describeFreezeNight(night),
    tone: high ? "alert" : "brand",
    bullets: [
      "Open cabinet doors under sinks on exterior walls.",
      "Keep the garage door closed.",
      "Let a faucet on an exposed line drip.",
      "Know where your main water shutoff is.",
    ],
    paragraphs: [
      ...(coming.length
        ? [`Also below freezing later this week: ${coming.map((n) => `${n.date} (low ${n.lowF}°F)`).join(", ")}.`]
        : []),
      "This is the outdoor forecast. An attached or insulated garage can stay much warmer, and a drafty one can get nearly as cold. A $25 probe next to the pipe tells you what the space is actually doing and alerts you before it reaches freezing.",
    ],
    cta: { label: "See the 5-night forecast", url: freezeForecastUrl(sub) },
    secondaryCta: { label: "Add a probe to your garage", url: `${siteUrl()}/about/esp32-freeze-kit` },
    footerNote:
      "We email the afternoon before the first freezing night of a cold spell and before every night at 20°F or colder. Forecast from the National Weather Service.",
    unsubscribeUrl,
  });
  return { subject, text, html, unsubscribeUrl };
}

// ---------------------------------------------------------------------------
// Hourly job

export type FreezeAlertRunResult = { sent: number; skipped: number; locations: number; errors: string[] };

/** Called from the hourly cron. Fetches each location once, however many subscribers share it. */
export async function sendFreezeAlerts(now = new Date()): Promise<FreezeAlertRunResult> {
  const result: FreezeAlertRunResult = { sent: 0, skipped: 0, locations: 0, errors: [] };
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("freeze_alert_subscriptions")
    .select("id, email, token, place_label, lat, lon, last_alert_night")
    .not("confirmed_at", "is", null);
  if (error) {
    result.errors.push(`load: ${error.message}`);
    return result;
  }

  const byLocation = new Map<string, FreezeAlertSubscriber[]>();
  for (const sub of (data ?? []) as FreezeAlertSubscriber[]) {
    const key = pipeFreezeCacheKey(sub.lat, sub.lon);
    byLocation.set(key, [...(byLocation.get(key) ?? []), sub]);
  }

  for (const subs of byLocation.values()) {
    result.locations += 1;
    const { lat, lon } = subs[0]!;
    const forecast = await fetchPipeFreezeForecast(lat, lon, 5);
    if (!forecast.ok) {
      result.skipped += subs.length;
      if (forecast.error !== "us_only") result.errors.push(`forecast ${lat},${lon}: ${forecast.error}`);
      continue;
    }
    const nights = forecast.body.nights;
    for (const sub of subs) {
      const decision = decideFreezeAlert(nights, sub.last_alert_night, now);
      if (!decision.send) {
        result.skipped += 1;
        continue;
      }
      const later = nights.filter((n) => n.date > decision.night.date);
      const mail = buildFreezeAlertEmail(sub, decision.night, later);
      try {
        await sendEmail(sub.email, mail.subject, mail.text, {
          html: mail.html,
          headers: unsubscribeHeaders(mail.unsubscribeUrl),
        });
        await supabase
          .from("freeze_alert_subscriptions")
          .update({ last_alert_night: decision.night.date })
          .eq("id", sub.id);
        result.sent += 1;
      } catch (sendError) {
        const message = sendError instanceof Error ? sendError.message : "send failed";
        // Suppressed or bounced addresses are skipped, not job errors.
        if (/suppressed/i.test(message)) result.skipped += 1;
        else result.errors.push(`${sub.id}: ${message}`);
      }
    }
  }
  return result;
}

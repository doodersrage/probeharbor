import * as neonFreeze from "./db/freezeSubscriptions";
import { sendEmail } from "./mailer";
import { brandedEmailParts, formatEmailDate } from "./emailLayout";
import { unsubscribeHeaders } from "./emailUnsubscribe";
import { resolveSiteUrl } from "./schemaMarkup";
import { describeFreezeNight, HIGH_RISK_LOW_F, WINDY_MPH, type FreezeNight } from "./pipeFreezeForecast";
import { fetchPipeFreezeForecast, pipeFreezeCacheKey } from "./pipeFreezeForecastFetch";
import { formatTemp, formatWind } from "./tempUnits";
import type { Locale } from "../i18n/locales";
import { fmt, plural } from "../i18n/format";
import { alertJobsMessages } from "../i18n/messages/app/alertJobs";
import { signWithAlertLinkSecret, verifyWithAlertLinkSecret } from "./alertAckTokens";

/**
 * Hardware-free freeze alerts: an email the afternoon before a freezing night
 * at a US location, from the NWS forecast behind /pipe-freeze-forecast.
 * Double opt-in like status subscriptions; one location per email.
 */

/** Local hours (inclusive start, exclusive end) when the evening alert goes out. */
export const ALERT_WINDOW_START_HOUR = 14;
export const ALERT_WINDOW_END_HOUR = 18;
const MAX_LABEL_LENGTH = 80;
/** How long a "switch to this place" link works. The email copy says 7 days in every language. */
export const MOVE_LINK_TTL_MS = 7 * 24 * 60 * 60 * 1000;

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

async function sendConfirmEmail(email: string, token: string, place: string, locale: Locale = "en"): Promise<void> {
  const t = alertJobsMessages(locale).freeze.confirm;
  const { text, html } = brandedEmailParts(
    {
      eyebrow: t.eyebrow,
      title: t.title,
      intro: fmt(t.intro, { place }),
      paragraphs: [t.ignore],
      cta: { label: t.cta, url: freezeAlertConfirmUrl(token) },
      footerNote: t.footerNote,
    },
    locale,
  );
  await sendEmail(email, fmt(t.subject, { place }), text, { html });
}

// ---------------------------------------------------------------------------
// Moving a confirmed subscription
//
// A confirmed address is never changed by the public form. Instead the form
// emails a signed link for the new place; only that link moves the alerts.
// The pending place lives in the link itself (no extra columns): HMAC-SHA256
// with the alert-link secret (ALERT_ACK_SECRET, else CRON_SECRET) over the
// subscription id, label, rounded lat/lon and expiry.

export type FreezeAlertMove = { id: string; label: string; lat: number; lon: number; exp: number };

/** Domain-separated so a move signature can never pass as an ack/snooze signature, or vice versa. */
function movePayload(move: FreezeAlertMove): string {
  return `freeze-move:v1\n${JSON.stringify([move.id, move.label, move.lat.toFixed(2), move.lon.toFixed(2), move.exp])}`;
}

/** The move link, or null when no signing secret is configured. */
export async function freezeAlertMoveUrl(
  id: string,
  place: { label: string; lat: number; lon: number },
  now = Date.now(),
): Promise<string | null> {
  const move: FreezeAlertMove = { id, label: place.label, lat: place.lat, lon: place.lon, exp: now + MOVE_LINK_TTL_MS };
  const sig = await signWithAlertLinkSecret(movePayload(move));
  if (!sig) return null;
  const params = new URLSearchParams({
    sid: move.id,
    lat: move.lat.toFixed(2),
    lon: move.lon.toFixed(2),
    label: move.label,
    exp: String(move.exp),
    sig,
  });
  return `${siteUrl()}/api/freeze-alerts/move?${params.toString()}`;
}

/** The move a link asks for, or null when it is malformed, tampered with or expired. */
export async function readFreezeAlertMove(params: URLSearchParams, now = Date.now()): Promise<FreezeAlertMove | null> {
  const id = params.get("sid")?.trim() ?? "";
  const label = params.get("label") ?? "";
  const lat = Number(params.get("lat"));
  const lon = Number(params.get("lon"));
  const exp = Number(params.get("exp"));
  const sig = params.get("sig")?.trim() ?? "";
  if (!id || !sig || !label.trim() || label.length > MAX_LABEL_LENGTH) return null;
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  if (!Number.isSafeInteger(exp) || exp < now) return null;
  const move: FreezeAlertMove = { id, label, lat: roundCoordinate(lat), lon: roundCoordinate(lon), exp };
  if (!(await verifyWithAlertLinkSecret(movePayload(move), sig))) return null;
  return move;
}

/** Apply a move link: the confirmed row takes the new place and stays confirmed. */
export async function applyFreezeAlertMove(params: URLSearchParams, now = Date.now()): Promise<{ ok: boolean }> {
  const move = await readFreezeAlertMove(params, now);
  if (!move) return { ok: false };
  return { ok: await neonFreeze.moveConfirmed(move.id, move.label, move.lat, move.lon) };
}

async function sendMoveEmail(
  email: string,
  current: { id: string; place_label: string },
  place: { label: string; lat: number; lon: number },
  locale: Locale,
): Promise<void> {
  const url = await freezeAlertMoveUrl(current.id, place);
  if (!url) {
    console.error("freeze alert move link not sent: set ALERT_ACK_SECRET or CRON_SECRET");
    return;
  }
  const t = alertJobsMessages(locale).freeze.move;
  const vars = { place: place.label, current: current.place_label };
  const { text, html } = brandedEmailParts(
    {
      eyebrow: t.eyebrow,
      title: fmt(t.title, vars),
      intro: fmt(t.intro, vars),
      paragraphs: [fmt(t.keep, vars), t.ignore],
      cta: { label: t.cta, url },
      footerNote: t.footerNote,
    },
    locale,
  );
  await sendEmail(email, fmt(t.subject, vars), text, { html });
}

/**
 * Subscribe an address, or offer to move it. Like status subscriptions, the
 * response never reveals whether the address was already on the list.
 * - New or unconfirmed address: (re)write it unconfirmed and send a confirm link.
 * - Confirmed at the same spot: left alone, nothing sent.
 * - Confirmed elsewhere: left alone and still alerting; the address gets a
 *   signed link that switches it to the new place only when clicked.
 */
export async function subscribeToFreezeAlerts(input: {
  email: string;
  lat: number;
  lon: number;
  label: string;
}, locale: Locale = "en"): Promise<{ ok: boolean; error?: string }> {
  const errors = alertJobsMessages(locale).freeze.errors;
  const email = normalizeFreezeAlertEmail(input.email);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: errors.invalidEmail };
  }
  if (!Number.isFinite(input.lat) || !Number.isFinite(input.lon) || Math.abs(input.lat) > 90 || Math.abs(input.lon) > 180) {
    return { ok: false, error: errors.pickLocation };
  }
  const lat = roundCoordinate(input.lat);
  const lon = roundCoordinate(input.lon);
  const label = input.label.trim().slice(0, MAX_LABEL_LENGTH) || `${lat.toFixed(2)}, ${lon.toFixed(2)}`;

  const offerMove = async (found: { id: string; place_label: string; lat: number; lon: number }) => {
    if (found.lat === lat && found.lon === lon) return;
    try {
      await sendMoveEmail(email, found, { label, lat, lon }, locale);
    } catch (sendError) {
      console.error("Failed to send freeze alert move email:", sendError instanceof Error ? sendError.message : sendError);
    }
  };

  let found: Awaited<ReturnType<typeof neonFreeze.findByEmail>>;
  try {
    found = await neonFreeze.findByEmail(email);
  } catch (lookupError) {
    console.error("freeze alert subscribe lookup failed:", lookupError instanceof Error ? lookupError.message : lookupError);
    return { ok: false, error: errors.generic };
  }
  if (found?.confirmed_at) {
    await offerMove(found);
    return { ok: true };
  }
  const token = randomToken();
  let wrote: boolean;
  try {
    wrote = await neonFreeze.writeUnconfirmed(email, label, lat, lon, token);
  } catch (writeError) {
    console.error("freeze alert subscribe write failed:", writeError instanceof Error ? writeError.message : writeError);
    return { ok: false, error: errors.generic };
  }
  if (!wrote) {
    // Confirmed between the lookup and the write: treat it as confirmed.
    try {
      const now = await neonFreeze.findByEmail(email);
      if (now?.confirmed_at) await offerMove(now);
    } catch (lookupError) {
      console.error("freeze alert subscribe re-lookup failed:", lookupError instanceof Error ? lookupError.message : lookupError);
    }
    return { ok: true };
  }
  try {
    await sendConfirmEmail(email, token, label, locale);
  } catch (sendError) {
    // The row exists; a later re-subscribe re-sends. Don't fail the form over a send hiccup.
    console.error("Failed to send freeze alert confirm email:", sendError);
  }
  return { ok: true };
}

export async function confirmFreezeAlerts(token: string): Promise<{ ok: boolean }> {
  return { ok: await neonFreeze.confirm(token) };
}

export async function unsubscribeFreezeAlerts(token: string): Promise<{ ok: boolean }> {
  return { ok: await neonFreeze.unsubscribe(token) };
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

/** Forecast low in the email: °F in English (as before), °C (°F) elsewhere. */
function freezeTemp(f: number, locale: Locale): string {
  return locale === "en" ? `${f}°F` : `${formatTemp(f, "C")} (${formatTemp(f, "F")})`;
}

/** `describeFreezeNight` for the email, in the recipient's language. */
export function describeFreezeNightLocalized(night: FreezeNight, locale: Locale = "en"): string {
  if (locale === "en") return describeFreezeNight(night);
  const t = alertJobsMessages(locale).freeze.night;
  const low = freezeTemp(night.lowF, locale);
  const parts: string[] = [];
  if (night.risk === "high") parts.push(fmt(t.high, { low, mark: freezeTemp(HIGH_RISK_LOW_F, locale) }));
  else if (night.risk === "watch") parts.push(plural(t.watch, night.hoursAtOrBelow32, locale, { low }));
  else parts.push(fmt(t.above, { low }));
  if (night.maxFreezingWindMph != null && night.maxFreezingWindMph >= WINDY_MPH) {
    const wind = `${formatWind(night.maxFreezingWindMph, "C")} (${formatWind(night.maxFreezingWindMph, "F")})`;
    parts.push(fmt(t.wind, { wind }));
  }
  if (night.staysBelowFreezingNextDay) parts.push(t.nextDay);
  return parts.join(" ");
}

function nightDate(date: string, locale: Locale): string {
  if (locale === "en") return date;
  return formatEmailDate(
    `${date}T12:00:00Z`,
    { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" },
    locale,
  );
}

export function buildFreezeAlertEmail(
  sub: Pick<FreezeAlertSubscriber, "token" | "place_label" | "lat" | "lon">,
  night: FreezeNight,
  laterNights: FreezeNight[],
  locale: Locale = "en",
): { subject: string; text: string; html: string; unsubscribeUrl: string } {
  const t = alertJobsMessages(locale).freeze.alert;
  const place = sub.place_label;
  const high = night.risk === "high";
  const low = freezeTemp(night.lowF, locale);
  const subject = fmt(high ? t.subjectHigh : t.subjectWatch, { place, low });
  const unsubscribeUrl = freezeAlertUnsubscribeUrl(sub.token);
  const coming = laterNights.filter((n) => n.risk !== "low");
  const description = describeFreezeNightLocalized(night, locale);
  const { text, html } = brandedEmailParts(
    {
      preheader: description,
      eyebrow: t.eyebrow,
      title: fmt(high ? t.titleHigh : t.titleWatch, { place }),
      intro: description,
      tone: high ? "alert" : "brand",
      bullets: [...t.bullets],
      paragraphs: [
        ...(coming.length
          ? [
              fmt(t.alsoLater, {
                nights: coming
                  .map((n) => fmt(t.laterNight, { date: nightDate(n.date, locale), low: freezeTemp(n.lowF, locale) }))
                  .join(", "),
              }),
            ]
          : []),
        t.outdoorNote,
      ],
      cta: { label: t.ctaForecast, url: freezeForecastUrl(sub) },
      secondaryCta: { label: t.ctaProbe, url: `${siteUrl()}/about/esp32-freeze-kit` },
      footerNote: t.footerNote,
      unsubscribeUrl,
    },
    locale,
  );
  return { subject, text, html, unsubscribeUrl };
}

// ---------------------------------------------------------------------------
// Hourly job

export type FreezeAlertRunResult = { sent: number; skipped: number; locations: number; errors: string[] };

/** Called from the hourly cron. Fetches each location once, however many subscribers share it. */
export async function sendFreezeAlerts(now = new Date()): Promise<FreezeAlertRunResult> {
  const result: FreezeAlertRunResult = { sent: 0, skipped: 0, locations: 0, errors: [] };
  let data: FreezeAlertSubscriber[];
  try {
    data = await neonFreeze.listConfirmed();
  } catch (loadError) {
    result.errors.push(`load: ${loadError instanceof Error ? loadError.message : loadError}`);
    return result;
  }

  const byLocation = new Map<string, FreezeAlertSubscriber[]>();
  for (const sub of data) {
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
        await neonFreeze.markAlerted(sub.id, decision.night.date);
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

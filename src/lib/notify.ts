import { isSafeHttpsUrl } from "./ssrfGuard";
import {
  type AlertChannelName,
  type AlertSettings,
  type NotifyKind,
  DEFAULT_ALERT_SETTINGS,
  alertSettingsToRow,
  getAlertSettingsFromMetadata,
  rowToAlertSettings,
} from "./alerts";
import { recordAlertEvent, updateAlertEventChannels, type AlertEventMeta } from "./alertEvents";
import { buildUserAckUrl } from "./alertAckTokens";
import { buildSiteUrl } from "./siteUrl";
import { applyAlertTemplates } from "./alertTemplates";
import {
  quietHoursAllowsSmsCritical,
  shouldSuppressForQuietHours,
} from "./quietHours";
import { shouldSuppressForSnoozeOrVacation } from "./alertSnooze";
import { filterChannelsForSpace } from "./spaceChannelRouting";
import { deliverWebhookPost } from "./webhookDeliveries";
import * as neonSettings from "./db/alertSettings";
import { getUserEntitlements } from "./entitlements";
import { sendPushChannelToUser } from "./pushChannel";
import { getRuntimeEnv, hasRuntimeEnv } from "./runtimeEnv";
import type { Locale } from "../i18n/locales";
import { ensureLocale } from "../i18n/catalog";
import { fmt } from "../i18n/format";
import { alertMessages } from "../i18n/messages/app/alertMessages";
import { timestampedSignatureHeaders } from "./webhookSigning";

export type NotifyPayload = {
  title: string;
  body: string;
  kind?: NotifyKind;
  meta?: AlertEventMeta;
};

/** Keep a hung channel endpoint from stalling every channel after it. */
const CHANNEL_TIMEOUT_MS = 10_000;

async function sendEmail(
  to: string,
  subject: string,
  body: string,
  kind?: NotifyKind,
  locale: Locale = "en",
): Promise<boolean> {
  try {
    const t = alertMessages(locale).delivery;
    const { sendEmail: send } = await import("./mailer");
    const { brandedEmailParts } = await import("./emailLayout");
    const { resolveSiteUrl } = await import("./schemaMarkup");
    const siteUrl = resolveSiteUrl(null);
    const parts = brandedEmailParts({
      eyebrow: alertEmailEyebrow(kind, locale),
      preheader: body.slice(0, 120),
      title: subject,
      intro: body,
      cta: { label: t.openDashboard, url: `${siteUrl}/dashboard` },
      secondaryCta: { label: t.alertSettings, url: `${siteUrl}/dashboard/alerts` },
      tone: "alert",
      footerNote: t.footerNote,
    }, locale);
    await send(to, subject, parts.text, { html: parts.html });
    return true;
  } catch (error) {
    console.error("Failed to send alert email:", error);
    return false;
  }
}

function alertEmailEyebrow(kind?: NotifyKind, locale: Locale = "en"): string {
  const t = alertMessages(locale).delivery.eyebrow;
  switch (kind) {
    case "flood":
    case "power":
    case "outage":
    case "forecast":
    case "battery":
    case "runway":
    case "rate":
    case "rssi":
    case "stuck":
    case "rule":
    case "threshold":
    case "recovery":
      return t[kind];
    case "nws":
      return t.forecast;
    default:
      return t.default;
  }
}

async function sendDiscord(webhookUrl: string, title: string, body: string): Promise<boolean> {
  if (!isSafeHttpsUrl(webhookUrl)) {
    console.error("Refusing to send Discord webhook: unsafe URL");
    return false;
  }
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      signal: AbortSignal.timeout(CHANNEL_TIMEOUT_MS),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `**${title}**\n${body}`,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to send Discord webhook:", error);
    return false;
  }
}

async function sendSlack(webhookUrl: string, title: string, body: string): Promise<boolean> {
  if (!isSafeHttpsUrl(webhookUrl)) {
    console.error("Refusing to send Slack webhook: unsafe URL");
    return false;
  }
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      signal: AbortSignal.timeout(CHANNEL_TIMEOUT_MS),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `*${title}*\n${body}`,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to send Slack webhook:", error);
    return false;
  }
}

async function sendTeams(webhookUrl: string, title: string, body: string): Promise<boolean> {
  if (!isSafeHttpsUrl(webhookUrl)) {
    console.error("Refusing to send Teams webhook: unsafe URL");
    return false;
  }
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      signal: AbortSignal.timeout(CHANNEL_TIMEOUT_MS),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "@type": "MessageCard",
        summary: title,
        themeColor: "0078D4",
        title,
        text: body,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to send Teams webhook:", error);
    return false;
  }
}

async function sendNtfy(
  server: string,
  topic: string,
  title: string,
  body: string,
): Promise<boolean> {
  const base = server.replace(/\/$/, "");
  if (!isSafeHttpsUrl(base)) {
    console.error("Refusing to send ntfy notification: unsafe URL");
    return false;
  }
  try {
    const response = await fetch(`${base}/${encodeURIComponent(topic)}`, {
      method: "POST",
      signal: AbortSignal.timeout(CHANNEL_TIMEOUT_MS),
      headers: {
        Title: title.slice(0, 250),
        Priority: "high",
        Tags: "thermometer",
      },
      body: `${title}\n${body}`.slice(0, 4000),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to send ntfy notification:", error);
    return false;
  }
}

async function sendPushover(
  userKey: string,
  appToken: string,
  title: string,
  body: string,
): Promise<boolean> {
  try {
    const params = new URLSearchParams({
      token: appToken,
      user: userKey,
      title: title.slice(0, 250),
      message: body.slice(0, 1024),
      priority: "1",
    });
    const response = await fetch("https://api.pushover.net/1/messages.json", {
      method: "POST",
      signal: AbortSignal.timeout(CHANNEL_TIMEOUT_MS),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to send Pushover notification:", error);
    return false;
  }
}

export async function sendTwilioWhatsApp(to: string, body: string): Promise<boolean> {
  const sid = getRuntimeEnv("TWILIO_ACCOUNT_SID");
  const token = getRuntimeEnv("TWILIO_AUTH_TOKEN");
  const from =
    getRuntimeEnv("TWILIO_WHATSAPP_FROM") || getRuntimeEnv("TWILIO_FROM_NUMBER");

  if (!sid || !token || !from) {
    console.warn("Twilio WhatsApp env vars not configured; skipping");
    return false;
  }

  const whatsappFrom = from.startsWith("whatsapp:") ? from : `whatsapp:${from}`;
  const whatsappTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

  try {
    const auth = btoa(`${sid}:${token}`);
    const params = new URLSearchParams({
      To: whatsappTo,
      From: whatsappFrom,
      Body: body.slice(0, 1500),
    });
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        signal: AbortSignal.timeout(CHANNEL_TIMEOUT_MS),
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      },
    );
    if (!response.ok) {
      console.error("Twilio WhatsApp failed:", await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to send Twilio WhatsApp:", error);
    return false;
  }
}

async function sendTelegram(
  botToken: string,
  chatId: string,
  title: string,
  body: string,
): Promise<boolean> {
  try {
    const url = `https://api.telegram.org/bot${encodeURIComponent(botToken)}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      signal: AbortSignal.timeout(CHANNEL_TIMEOUT_MS),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `${title}\n${body}`.slice(0, 4000),
      }),
    });
    if (!response.ok) {
      console.error("Telegram send failed:", await response.text());
    }
    return response.ok;
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return false;
  }
}

export function isTwilioConfigured(): boolean {
  return hasRuntimeEnv(
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_FROM_NUMBER",
  );
}

export async function sendTwilioSms(to: string, body: string): Promise<boolean> {
  const sid = getRuntimeEnv("TWILIO_ACCOUNT_SID");
  const token = getRuntimeEnv("TWILIO_AUTH_TOKEN");
  const from = getRuntimeEnv("TWILIO_FROM_NUMBER");

  if (!sid || !token || !from) {
    console.warn("Twilio env vars not configured; skipping SMS");
    return false;
  }

  try {
    const auth = btoa(`${sid}:${token}`);
    const params = new URLSearchParams({
      To: to,
      From: from,
      Body: body.slice(0, 1500),
    });

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        signal: AbortSignal.timeout(CHANNEL_TIMEOUT_MS),
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      },
    );

    if (!response.ok) {
      console.error("Twilio SMS failed:", await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to send Twilio SMS:", error);
    return false;
  }
}

async function hmacSha256Hex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sendOutboundWebhook(
  userId: string,
  url: string,
  secret: string | null,
  payload: NotifyPayload,
): Promise<boolean> {
  const body = JSON.stringify({
    title: payload.title,
    body: payload.body,
    kind: payload.kind ?? "generic",
    sent_at: new Date().toISOString(),
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (secret) {
    headers["X-Signature"] = await hmacSha256Hex(secret, body);
    Object.assign(headers, await timestampedSignatureHeaders(secret, body));
  }

  const response = await deliverWebhookPost(
    userId,
    "outbound_alert",
    url,
    headers,
    body,
  );
  if (response && !response.ok) {
    console.error("Outbound webhook failed:", response.status);
  }
  return Boolean(response?.ok);
}

function channelAllowed(
  settings: AlertSettings,
  kind: NotifyKind | undefined,
  channel: AlertChannelName,
): boolean {
  if (!kind) return true;
  const override = settings.channelSeverity?.[kind];
  if (!override || override.length === 0) return true;
  return override.includes(channel);
}

export async function getAlertSettingsForUser(
  userId: string,
  metadata?: Record<string, unknown>,
): Promise<AlertSettings> {
  let row: Record<string, unknown> | null;
  try {
    row = await neonSettings.getAlertSettingsRow(userId);
  } catch (error) {
    // Can't read: use the metadata/defaults for this request, but don't
    // write them over a row that may exist.
    console.error("Failed to load alert settings:", error instanceof Error ? error.message : error);
    return getAlertSettingsFromMetadata(metadata);
  }
  if (row) return rowToAlertSettings(row);
  const fresh = getAlertSettingsFromMetadata(metadata);
  await neonSettings.insertDefaultAlertSettings(userId, alertSettingsToRow(fresh));
  // Another request may have created the row first; theirs wins.
  const stored = await neonSettings.getAlertSettingsRow(userId).catch(() => null);
  return stored ? rowToAlertSettings(stored) : fresh;
}

export async function saveAlertSettingsForUser(
  userId: string,
  settings: AlertSettings,
): Promise<{ error: string | null }> {
  return neonSettings.saveAlertSettingsRow(userId, alertSettingsToRow(settings));
}

export async function markCooldown(
  userId: string,
  field:
    | "last_alert_sent_at"
    | "last_outage_alert_at"
    | "last_rate_alert_at"
    | "last_forecast_alert_at"
    | "last_runway_alert_at"
    | "last_rule_alert_at"
    | "last_battery_alert_at"
    | "last_battery_trend_alert_at"
    | "last_rssi_alert_at"
    | "last_nws_alert_at"
    | "last_flood_alert_at"
    | "last_power_alert_at",
): Promise<void> {
  return neonSettings.markCooldown(userId, field, alertSettingsToRow(DEFAULT_ALERT_SETTINGS));
}

type CooldownField = Parameters<typeof markCooldown>[1];

/**
 * Claim the right to send one alert by moving its cooldown timestamp from the
 * value this evaluation read to now (compare-and-set). Two evaluations that
 * read the same value (concurrent ingests, ingest + cron) can't both win, so
 * the alert goes out once.
 *
 * Fails open: it only says "skip" when it can see another evaluation stamped a
 * newer time. A database error, a missing settings row or an unreadable value
 * lets the alert send (a duplicate beats a missed alert).
 */
export async function claimCooldown(
  userId: string,
  field: CooldownField,
  previous: string | null,
): Promise<{ claimed: boolean; claimedAt: string | null }> {
  return neonSettings.claimCooldown(userId, field, previous);
}

/** Undo a claim when the alert reached no one, so it can retry (and isn't shown as sent). */
export async function releaseCooldown(
  userId: string,
  field: CooldownField,
  claimedAt: string,
  previous: string | null,
): Promise<void> {
  return neonSettings.releaseCooldown(userId, field, claimedAt, previous);
}

/** Cooldown timestamps that prove at least one alert left the system. */
export function alertSettingsHaveDeliveryTimestamp(settings: AlertSettings): boolean {
  return Boolean(
    settings.lastAlertSentAt ||
      settings.lastOutageAlertAt ||
      settings.lastRateAlertAt ||
      settings.lastForecastAlertAt ||
      settings.lastRunwayAlertAt ||
      settings.lastFloodAlertAt ||
      settings.lastPowerAlertAt ||
      settings.lastNwsAlertAt ||
      settings.lastBatteryAlertAt ||
      settings.lastBatteryTrendAlertAt ||
      settings.lastRssiAlertAt,
  );
}

/**
 * Overview / onboarding treat a delivered test (or any real alert) as done.
 * Falls back to alert_events when no cooldown timestamp is set. Read-only:
 * writing last_alert_sent_at here would arm the freeze-alert cooldown.
 */
export async function ensureAlertDeliveryEvidence(
  userId: string,
  settings: AlertSettings,
): Promise<{ hasDelivery: boolean; settings: AlertSettings }> {
  if (alertSettingsHaveDeliveryTimestamp(settings)) {
    return { hasDelivery: true, settings };
  }

  try {
    return { hasDelivery: await neonSettings.recentAlertReachedAChannel(userId), settings };
  } catch (error) {
    console.error("ensureAlertDeliveryEvidence failed:", error instanceof Error ? error.message : error);
    return { hasDelivery: false, settings };
  }
}

export async function markEscalation(userId: string): Promise<void> {
  return neonSettings.markEscalation(userId);
}

export async function notifyUser(
  userId: string,
  fallbackEmail: string | null | undefined,
  settings: AlertSettings,
  payload: NotifyPayload,
  options?: {
    snoozeUrl?: string;
    smsOnly?: boolean;
    space?: string | null;
    /** When set, only these channels may fire (must also be enabled in settings). */
    channelFilter?: AlertChannelName[];
    /**
     * The user pressed "Send test" and wants it now: skip snooze, vacation and
     * quiet hours, which exist to hold real alerts. Never set this for a real
     * alert (cron, ingest, rules); cooldowns are not involved either way.
     */
    userInitiatedTest?: boolean;
  },
  /**
   * Recipient language for the text notifyUser adds (snooze/ack lines, email
   * chrome). Callers word title/body in the same language.
   */
  locale: Locale = "en",
): Promise<{ sent: string[]; skipped: string[] }> {
  const isUserTest = options?.userInitiatedTest === true;
  if (
    !options?.smsOnly &&
    !isUserTest &&
    shouldSuppressForSnoozeOrVacation(settings, payload.kind)
  ) {
    const skipped = ["snooze_or_vacation"];
    await recordAlertEvent({
      userId,
      kind: payload.kind ?? "generic",
      title: payload.title,
      body: payload.body,
      channelsSent: [],
      channelsSkipped: skipped,
      meta: payload.meta,
    });
    return { sent: [], skipped };
  }

  const smsCriticalOnly =
    options?.smsOnly || (!isUserTest && quietHoursAllowsSmsCritical(settings, payload.kind));
  if (
    !options?.smsOnly &&
    !isUserTest &&
    shouldSuppressForQuietHours(settings, payload.kind) &&
    !smsCriticalOnly
  ) {
    const skipped = ["quiet_hours"];
    await recordAlertEvent({
      userId,
      kind: payload.kind ?? "generic",
      title: payload.title,
      body: payload.body,
      channelsSent: [],
      channelsSkipped: skipped,
      meta: payload.meta,
    });
    return { sent: [], skipped };
  }

  const entitlements = await getUserEntitlements(userId);
  const email = settings.email ?? fallbackEmail ?? null;
  let payloadResolved = applyAlertTemplates(payload, settings.alertTemplates);
  const sent: string[] = [];
  const skipped: string[] = [];

  const eventId = await recordAlertEvent({
    userId,
    kind: payload.kind ?? "generic",
    title: payload.title,
    body: payload.body,
    channelsSent: [],
    channelsSkipped: [],
    meta: payload.meta,
  });

  const kind = payloadResolved.kind;
  const routedChannels = kind
    ? filterChannelsForSpace(
        settings,
        options?.space,
        kind,
        ["email", "sms", "discord", "push", "webhook", "telegram", "slack", "teams", "ntfy", "pushover", "whatsapp"],
      )
    : null;
  const routedSet = routedChannels ? new Set(routedChannels) : null;
  const baseUrl = buildSiteUrl();
  const ackUrl = kind === "recovery" ? null : await buildUserAckUrl(baseUrl, userId, eventId);
  await ensureLocale(locale, ["app"]);
  const delivery = alertMessages(locale).delivery;
  const footerLines: string[] = [];
  if (options?.snoozeUrl) footerLines.push(fmt(delivery.snooze, { url: options.snoozeUrl }));
  if (ackUrl) footerLines.push(fmt(delivery.ack, { url: ackUrl }));
  const bodyWithSnooze =
    footerLines.length > 0
      ? `${payloadResolved.body}\n\n${footerLines.join("\n")}`
      : payloadResolved.body;
  const channelFilterSet = options?.channelFilter?.length
    ? new Set(options.channelFilter)
    : null;
  const allowChannel = (channel: AlertChannelName) => {
    if (channelFilterSet && !channelFilterSet.has(channel)) return false;
    if (routedSet && !routedSet.has(channel)) return false;
    if (options?.smsOnly) return channel === "sms";
    if (smsCriticalOnly) return channel === "sms";
    return channelAllowed(settings, kind, channel);
  };

  if (settings.channelEmail && allowChannel("email")) {
    if (email) {
      if (await sendEmail(email, payloadResolved.title, bodyWithSnooze, kind, locale)) sent.push("email");
      else skipped.push("email");
    } else {
      skipped.push("email");
    }
  }

  if (settings.channelDiscord && allowChannel("discord")) {
    if (settings.discordWebhookUrl) {
      if (await sendDiscord(settings.discordWebhookUrl, payloadResolved.title, bodyWithSnooze)) {
        sent.push("discord");
      } else {
        skipped.push("discord");
      }
    } else {
      skipped.push("discord");
    }
  }

  if (settings.channelSlack && allowChannel("slack")) {
    if (settings.slackWebhookUrl) {
      if (await sendSlack(settings.slackWebhookUrl, payloadResolved.title, bodyWithSnooze)) {
        sent.push("slack");
      } else {
        skipped.push("slack");
      }
    } else {
      skipped.push("slack");
    }
  }

  if (settings.channelTeams && allowChannel("teams")) {
    if (settings.teamsWebhookUrl) {
      if (await sendTeams(settings.teamsWebhookUrl, payloadResolved.title, bodyWithSnooze)) {
        sent.push("teams");
      } else {
        skipped.push("teams");
      }
    } else {
      skipped.push("teams");
    }
  }

  if (settings.channelNtfy && allowChannel("ntfy")) {
    if (settings.ntfyTopic) {
      const ok = await sendNtfy(
        settings.ntfyServer,
        settings.ntfyTopic,
        payloadResolved.title,
        bodyWithSnooze,
      );
      if (ok) sent.push("ntfy");
      else skipped.push("ntfy");
    } else {
      skipped.push("ntfy");
    }
  }

  if (settings.channelPushover && allowChannel("pushover")) {
    if (settings.pushoverUserKey && settings.pushoverAppToken) {
      const ok = await sendPushover(
        settings.pushoverUserKey,
        settings.pushoverAppToken,
        payloadResolved.title,
        bodyWithSnooze,
      );
      if (ok) sent.push("pushover");
      else skipped.push("pushover");
    } else {
      skipped.push("pushover");
    }
  }

  if (settings.channelWhatsapp && allowChannel("whatsapp")) {
    if (settings.whatsappPhone && entitlements.canUseSms) {
      const ok = await sendTwilioWhatsApp(
        settings.whatsappPhone,
        fmt(delivery.smsLine, { title: payloadResolved.title, body: bodyWithSnooze }),
      );
      if (ok) sent.push("whatsapp");
      else skipped.push("whatsapp");
    } else {
      skipped.push("whatsapp");
    }
  }

  if (settings.channelTelegram && allowChannel("telegram")) {
    if (settings.telegramBotToken && settings.telegramChatId) {
      const ok = await sendTelegram(
        settings.telegramBotToken,
        settings.telegramChatId,
        payloadResolved.title,
        bodyWithSnooze,
      );
      if (ok) sent.push("telegram");
      else skipped.push("telegram");
    } else {
      skipped.push("telegram");
    }
  }

  if (settings.channelSms && allowChannel("sms")) {
    if (settings.smsPhone && entitlements.canUseSms) {
      const smsOk = await sendTwilioSms(
        settings.smsPhone,
        fmt(delivery.smsLine, { title: payloadResolved.title, body: bodyWithSnooze }),
      );
      if (smsOk) {
        sent.push("sms");
      } else {
        skipped.push(isTwilioConfigured() ? "sms" : "sms_not_configured");
      }
    } else {
      skipped.push("sms");
    }
  }

  if (settings.channelPush && allowChannel("push")) {
    if (entitlements.canUsePush) {
      const pushResult = await sendPushChannelToUser(userId, {
        title: payloadResolved.title,
        body: bodyWithSnooze,
        eventId,
      });
      if (pushResult.delivered > 0) {
        sent.push("push");
      } else {
        skipped.push(pushResult.skippedReason ?? "push");
      }
    } else {
      skipped.push("push");
    }
  }

  if (settings.channelWebhook && allowChannel("webhook")) {
    if (settings.outboundWebhookUrl && entitlements.canUseOutboundWebhook) {
      const ok = await sendOutboundWebhook(
        userId,
        settings.outboundWebhookUrl,
        settings.outboundWebhookSecret,
        payload,
      );
      if (ok) sent.push("webhook");
      else skipped.push("webhook");
    } else {
      skipped.push("webhook");
    }
  }

  if (smsCriticalOnly && sent.length === 0) {
    skipped.push("quiet_hours");
  }

  if (eventId != null) {
    await updateAlertEventChannels(eventId, userId, sent, skipped);
  } else {
    await recordAlertEvent({
      userId,
      kind: payload.kind ?? "generic",
      title: payload.title,
      body: payload.body,
      channelsSent: sent,
      channelsSkipped: skipped,
      meta: payload.meta,
    });
  }

  return { sent, skipped };
}

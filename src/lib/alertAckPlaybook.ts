import { acknowledgeAlertEvent, getAlertEventForUser, updateAlertEventMeta } from "./alertEvents";
import { getUserHouseholdId } from "./households";
import { createServerClient } from "./supabase";
import { snoozeAlertsForUser } from "./alertSnooze";
import { sendTenantFreezeRelay } from "./tenantRelay";
import { deliverWebhookPost } from "./webhookDeliveries";
import { getAlertSettingsForUser, saveAlertSettingsForUser } from "./notify";
import { resolveSiteUrl } from "./schemaMarkup";
import { suggestFalseAlarmTip } from "./falseAlarmHints";
import type { Locale } from "../i18n/locales";
import { ensureLocale } from "../i18n/catalog";
import { fmt, formatNumber } from "../i18n/format";
import { alertJobsMessages } from "../i18n/messages/app/alertJobs";

export type AckPlaybookAction =
  | "ack"
  | "snooze_1h"
  | "snooze_4h"
  | "snooze_24h"
  | "false_alarm"
  | "raise_threshold"
  | "notify_tenant"
  | "webhook_ping";

export type AckPlaybookResult = {
  ok: boolean;
  message: string;
};

export async function executeAlertAckPlaybook(input: {
  userId: string;
  userEmail: string | null | undefined;
  eventId: number;
  action: AckPlaybookAction;
  siteUrl?: string;
  /** Language of the result message and the tenant email (the signed-in owner's). */
  locale?: Locale;
}): Promise<AckPlaybookResult> {
  const locale = input.locale ?? "en";
  await ensureLocale(locale, ["app"]);
  const t = alertJobsMessages(locale).ackPlaybook;
  const event = await getAlertEventForUser(input.userId, input.eventId);
  if (!event) {
    return { ok: false, message: t.notFound };
  }

  if (
    input.action === "snooze_1h" ||
    input.action === "snooze_4h" ||
    input.action === "snooze_24h" ||
    input.action === "false_alarm" ||
    input.action === "raise_threshold"
  ) {
    const hours =
      input.action === "snooze_1h" ? 1 : input.action === "snooze_4h" ? 4 : 24;
    await snoozeAlertsForUser(input.userId, hours);
  }

  let suggestedTipId: string | undefined;
  let raisedTo: number | null = null;
  if (input.action === "false_alarm" || input.action === "raise_threshold") {
    const tip = suggestFalseAlarmTip(event.kind, locale);
    suggestedTipId = tip.id;
    await updateAlertEventMeta(input.userId, input.eventId, {
      feedback: "false_alarm",
      feedbackAt: new Date().toISOString(),
      suggestedTipId: tip.id,
    });
  }

  if (input.action === "raise_threshold") {
    const settings = await getAlertSettingsForUser(input.userId, {});
    const next = Math.min(50, Math.round((settings.freezeThresholdF + 2) * 10) / 10);
    raisedTo = next;
    await saveAlertSettingsForUser(input.userId, {
      ...settings,
      freezeThresholdF: next,
    });
    await updateAlertEventMeta(input.userId, input.eventId, {
      feedback: "false_alarm",
      feedbackAt: new Date().toISOString(),
      suggestedTipId: "threshold",
      reasonSummary: `Raised freeze threshold to ${next}°F after false alarm`,
    });
  }

  if (input.action === "notify_tenant") {
    const householdId = await getUserHouseholdId(input.userId);
    if (!householdId) {
      return { ok: false, message: t.noHousehold };
    }
    const supabase = createServerClient();
    const { data: household } = await supabase
      .from("households")
      .select("name")
      .eq("id", householdId)
      .maybeSingle();
    const relay = await sendTenantFreezeRelay({
      householdId,
      managerUserId: input.userId,
      householdName: household?.name?.trim() || t.defaultPropertyName,
      alertTitle: event.title,
      alertBody: event.body,
      siteUrl: input.siteUrl,
      locale: input.locale,
    });
    if (!relay.ok) {
      return { ok: false, message: relay.error ?? t.relayFailed };
    }
  }

  if (input.action === "webhook_ping") {
    const settings = await getAlertSettingsForUser(input.userId, {});
    if (!settings.outboundWebhookUrl?.trim()) {
      return { ok: false, message: t.noWebhook };
    }
    const payload = JSON.stringify({
      title: "ProbeHarbor alert acknowledged",
      body: event.body,
      kind: "generic",
      action: "ack_playbook",
      event_id: event.id,
      sent_at: new Date().toISOString(),
    });
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (settings.outboundWebhookSecret?.trim()) {
      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(settings.outboundWebhookSecret.trim()),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
      );
      const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
      headers["X-Signature"] = [...new Uint8Array(sig)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
    await deliverWebhookPost(
      input.userId,
      "outbound_alert",
      settings.outboundWebhookUrl,
      headers,
      payload,
    );
  }

  const ack = await acknowledgeAlertEvent(input.userId, input.eventId);
  if (!ack.ok) {
    return { ok: false, message: ack.error ?? t.ackFailed };
  }

  if (input.action === "raise_threshold" && raisedTo != null) {
    return {
      ok: true,
      message: fmt(t.raised, { value: locale === "en" ? String(raisedTo) : formatNumber(raisedTo, locale) }),
    };
  }

  if (input.action === "false_alarm" && suggestedTipId) {
    const tip = suggestFalseAlarmTip(event.kind, locale);
    const tipHref = tip.href ?? "/dashboard/alerts?tab=settings#alert-section-essentials";
    return {
      ok: true,
      message: fmt(t.falseAlarmTip, { tip: tip.title, href: tipHref }),
    };
  }

  const messages: Record<AckPlaybookAction, string> = t.results;

  return { ok: true, message: messages[input.action] };
}

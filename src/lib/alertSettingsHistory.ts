import { alertSettingsToRow, rowToAlertSettings, type AlertSettings } from "./alerts";
import { getAlertSettingsForUser, saveAlertSettingsForUser } from "./notify";
import { createServerClient } from "./supabase";
import type { Json } from "../types/supabase";

/**
 * Alert settings history: each save keeps the version it replaced, with a
 * short list of what changed, so a bad save can be undone from Alerts.
 */

/** Saves kept per user; older ones are pruned. */
export const HISTORY_KEEP = 20;

/**
 * Operational state, not configuration: cooldown clocks, snooze/vacation, and
 * playbook progress. Never restored from a snapshot and never a "change".
 */
const STATE_KEYS = new Set<keyof AlertSettings>([
  "snoozeUntil",
  "vacationUntil",
  "playbookFired",
]);

function isStateKey(key: string): boolean {
  return key.startsWith("last") || STATE_KEYS.has(key as keyof AlertSettings);
}

/** Secrets and destinations: say they changed, never show the value. */
const SECRET_KEYS = new Set<keyof AlertSettings>([
  "discordWebhookUrl",
  "teamsWebhookUrl",
  "slackWebhookUrl",
  "outboundWebhookUrl",
  "outboundWebhookSecret",
  "readingWebhookUrl",
  "readingWebhookSecret",
  "telegramBotToken",
  "telegramCommandSecret",
  "pushoverUserKey",
  "pushoverAppToken",
  "ntfyTopic",
  "smsPhone",
  "whatsappPhone",
  "email",
  "telegramChatId",
]);

const LABELS: Partial<Record<keyof AlertSettings, string>> = {
  enabled: "Alerts",
  freezeThresholdF: "Freeze line (°F)",
  freezeDwellMinutes: "Wait before alerting (min)",
  humidityThreshold: "Humidity alert (%)",
  rateChangeF: "Fast-drop alert (°F/hr)",
  outageHours: "Silent-sensor alert (hours)",
  email: "Alert email",
  channelEmail: "Email",
  channelSms: "SMS",
  channelDiscord: "Discord",
  channelPush: "Push",
  channelWebhook: "Outbound webhook",
  channelTelegram: "Telegram",
  channelSlack: "Slack",
  channelTeams: "Teams",
  channelNtfy: "ntfy",
  channelPushover: "Pushover",
  channelWhatsapp: "WhatsApp",
  forecastFreezeEnabled: "Forecast freeze warning",
  runwayAlertEnabled: "Time-to-freeze warning",
  nwsFreezeAlertsEnabled: "Official freeze warnings",
  powerAlertsEnabled: "Power-off alerts",
  forecastHoursAhead: "Early-warning window (hours)",
  quietHoursEnabled: "Quiet hours",
  quietHoursStart: "Quiet hours start",
  quietHoursEnd: "Quiet hours end",
  digestEnabled: "Weekly digest",
  alertRules: "Rules",
  alertPlaybooks: "Playbooks",
  escalationEnabled: "SMS escalation",
  batteryAlertsEnabled: "Low-battery alerts",
  rssiAlertsEnabled: "Weak Wi-Fi alerts",
  thresholdSensorScope: "Per-sensor thresholds",
  spaceChannelRouting: "Per-space routing",
  channelSeverity: "Per-kind routing",
  alertTemplates: "Custom messages",
  discordWebhookUrl: "Discord webhook",
  teamsWebhookUrl: "Teams webhook",
  slackWebhookUrl: "Slack webhook",
  outboundWebhookUrl: "Outbound webhook URL",
  outboundWebhookSecret: "Outbound webhook secret",
  readingWebhookUrl: "Reading webhook URL",
  readingWebhookSecret: "Reading webhook secret",
  telegramBotToken: "Telegram bot token",
  telegramCommandSecret: "Telegram webhook secret",
  telegramChatId: "Telegram chat",
  pushoverUserKey: "Pushover user key",
  pushoverAppToken: "Pushover app token",
  ntfyTopic: "ntfy topic",
  smsPhone: "SMS number",
  whatsappPhone: "WhatsApp number",
};

function shown(value: unknown): string {
  if (typeof value === "boolean") return value ? "on" : "off";
  if (value == null || value === "") return "none";
  return String(value);
}

/** What changed between two versions, in plain words. Values of secrets stay hidden. */
export function describeAlertSettingsChanges(before: AlertSettings, after: AlertSettings): string[] {
  const named: string[] = [];
  let unnamed = 0;
  for (const key of Object.keys(after) as Array<keyof AlertSettings>) {
    if (isStateKey(key)) continue;
    const a = before[key];
    const b = after[key];
    if (JSON.stringify(a ?? null) === JSON.stringify(b ?? null)) continue;
    const label = LABELS[key];
    if (!label) {
      unnamed += 1;
    } else if (SECRET_KEYS.has(key)) {
      named.push(`${label} changed`);
    } else if (typeof b === "boolean") {
      named.push(`${label} turned ${b ? "on" : "off"}`);
    } else if (typeof b === "object") {
      named.push(`${label} edited`);
    } else {
      named.push(`${label} ${shown(a)} → ${shown(b)}`);
    }
  }
  if (unnamed > 0) named.push(`${unnamed} other setting${unnamed === 1 ? "" : "s"}`);
  return named;
}

function configRow(settings: AlertSettings): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(alertSettingsToRow(settings)).filter(
      ([column]) => !column.startsWith("last_") && !["snooze_until", "vacation_until", "playbook_fired"].includes(column),
    ),
  );
}

/** Keep the version a save replaced. Best effort: history must never block a save. */
export async function recordAlertSettingsChange(
  userId: string,
  before: AlertSettings,
  after: AlertSettings,
): Promise<void> {
  const changes = describeAlertSettingsChanges(before, after);
  if (changes.length === 0) return;
  try {
    const supabase = createServerClient();
    await supabase.from("alert_settings_history").insert({ user_id: userId, settings: configRow(before) as Json, changes });
    const { data } = await supabase
      .from("alert_settings_history")
      .select("id")
      .eq("user_id", userId)
      .order("saved_at", { ascending: false })
      .range(HISTORY_KEEP, HISTORY_KEEP + 50);
    const stale = (data ?? []).map((row) => row.id);
    if (stale.length > 0) await supabase.from("alert_settings_history").delete().in("id", stale);
  } catch (error) {
    console.error("recordAlertSettingsChange failed:", error);
  }
}

export type AlertSettingsHistoryEntry = { id: number; savedAt: string; changes: string[] };

export async function listAlertSettingsHistory(userId: string, limit = 10): Promise<AlertSettingsHistoryEntry[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("alert_settings_history")
    .select("id, saved_at, changes")
    .eq("user_id", userId)
    .order("saved_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data.map((row) => ({ id: row.id, savedAt: row.saved_at, changes: row.changes ?? [] }));
}

/** Snapshot config over current state: cooldowns and snooze stay as they are now. */
export function mergeSnapshotOntoCurrent(snapshotRow: Record<string, unknown>, current: AlertSettings): AlertSettings {
  const fromSnapshot = rowToAlertSettings(snapshotRow);
  const merged = { ...fromSnapshot } as AlertSettings;
  for (const key of Object.keys(current) as Array<keyof AlertSettings>) {
    if (isStateKey(key)) (merged as Record<string, unknown>)[key] = current[key];
  }
  return merged;
}

/**
 * Put back the settings as they were before entry `id` was saved. The
 * current version is kept first, so a restore can be undone the same way.
 */
export async function restoreAlertSettings(userId: string, id: number): Promise<{ error: string | null }> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("alert_settings_history")
    .select("settings")
    .eq("user_id", userId)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return { error: "not_found" };
  const current = await getAlertSettingsForUser(userId);
  const restored = mergeSnapshotOntoCurrent(data.settings as Record<string, unknown>, current);
  const saved = await saveAlertSettingsForUser(userId, restored);
  if (saved.error) return { error: saved.error };
  await recordAlertSettingsChange(userId, current, restored);
  return { error: null };
}

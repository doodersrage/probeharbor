import { alertSettingsToRow, rowToAlertSettings, type AlertSettings } from "./alerts";
import { getAlertSettingsForUser, saveAlertSettingsForUser } from "./notify";
import { createServerClient } from "./supabase";
import type { Json } from "../types/supabase";
import { fmt, formatNumber, plural } from "../i18n/format";
import type { Locale } from "../i18n/locales";
import {
  alertSettingsHistoryMessages,
  type AlertSettingsHistoryMessages,
} from "../i18n/messages/app/alertSettings/history";

/**
 * Alert settings history: each save keeps the version it replaced, with a
 * short list of what changed, so a bad save can be undone from Alerts.
 * The list is stored as text in the saver's language (pass `locale`).
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

function shown(value: unknown, t: AlertSettingsHistoryMessages, locale: Locale): string {
  if (typeof value === "boolean") return value ? t.valueOn : t.valueOff;
  if (value == null || value === "") return t.valueNone;
  if (typeof value === "number" && locale !== "en") {
    return formatNumber(value, locale, { useGrouping: false, maximumFractionDigits: 6 });
  }
  return String(value);
}

/** What changed between two versions, in plain words. Values of secrets stay hidden. */
export function describeAlertSettingsChanges(
  before: AlertSettings,
  after: AlertSettings,
  locale: Locale = "en",
): string[] {
  const t = alertSettingsHistoryMessages(locale);
  const named: string[] = [];
  let unnamed = 0;
  for (const key of Object.keys(after) as Array<keyof AlertSettings>) {
    if (isStateKey(key)) continue;
    const a = before[key];
    const b = after[key];
    if (JSON.stringify(a ?? null) === JSON.stringify(b ?? null)) continue;
    const label = t.labels[key];
    if (!label) {
      unnamed += 1;
    } else if (SECRET_KEYS.has(key)) {
      named.push(fmt(t.changed, { label }));
    } else if (typeof b === "boolean") {
      named.push(fmt(b ? t.turnedOn : t.turnedOff, { label }));
    } else if (typeof b === "object") {
      named.push(fmt(t.edited, { label }));
    } else {
      named.push(fmt(t.fromTo, { label, from: shown(a, t, locale), to: shown(b, t, locale) }));
    }
  }
  if (unnamed > 0) named.push(plural(t.otherSettings, unnamed, locale));
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
  locale: Locale = "en",
): Promise<void> {
  const changes = describeAlertSettingsChanges(before, after, locale);
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
export async function restoreAlertSettings(
  userId: string,
  id: number,
  locale: Locale = "en",
): Promise<{ error: string | null }> {
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
  await recordAlertSettingsChange(userId, current, restored, locale);
  return { error: null };
}

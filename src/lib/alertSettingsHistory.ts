import { alertSettingsToRow, rowToAlertSettings, type AlertSettings } from "./alerts";
import { getAlertSettingsForUser, saveAlertSettingsForUser } from "./notify";
import * as neonExtras from "./db/alertExtras";
import { fmt, formatNumber, plural } from "../i18n/format";
import type { Locale } from "../i18n/locales";
import {
  alertSettingsHistoryMessages,
  type AlertSettingsHistoryMessages,
} from "../i18n/messages/app/alertSettings/history";
import { displayDeltaInputValue, displayTempInputValue } from "./temperatureFormat";

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

/** History fields that hold a °F temperature or a °F difference. */
const TEMP_HISTORY_KEYS = { freezeThresholdF: "temp", rateChangeF: "delta" } as const;

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** A number as `shown` wrote it ("34.5" in English, "34,5" elsewhere); null if it isn't one. */
function parseShownNumber(text: string): number | null {
  const normalized = text.trim().replace(/\u2212/g, "-").replace(",", ".");
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null;
  return Number(normalized);
}

/**
 * History lines are stored as text in °F ("Freeze line (°F) 34 → 36"). For a
 * °C user, rewrite the freeze-line and fast-drop lines so they read in °C
 * ("Freeze line (°C) 1.1 → 2.2"; the fast drop is a difference: ×5/9).
 * Lines are matched against the saved wording in `locale` and English; any
 * other line, or a value that isn't a number, is returned unchanged.
 */
export function historyChangeInDisplayUnit(line: string, locale: Locale, useCelsius: boolean): string {
  if (!useCelsius) return line;
  const locales: Locale[] = locale === "en" ? ["en"] : [locale, "en"];
  for (const lineLocale of locales) {
    const t = alertSettingsHistoryMessages(lineLocale);
    for (const [key, kind] of Object.entries(TEMP_HISTORY_KEYS)) {
      const label = t.labels[key];
      if (!label?.includes("°F")) continue;
      // Split the template around two markers that can't occur in it.
      const [head = "", rest = ""] = fmt(t.fromTo, { label, from: "", to: "" }).split("");
      const [middle = "", tail = ""] = rest.split("");
      const match = new RegExp(`^${escapeRegExp(head)}(.+?)${escapeRegExp(middle)}(.+?)${escapeRegExp(tail)}$`).exec(line);
      if (!match) continue;
      const convert = (raw: string) => {
        const value = parseShownNumber(raw);
        if (value == null) return raw;
        const c = kind === "delta" ? displayDeltaInputValue(value, true) : displayTempInputValue(value, true);
        return shown(c, t, lineLocale);
      };
      return fmt(t.fromTo, { label: label.replace("°F", "°C"), from: convert(match[1]!), to: convert(match[2]!) });
    }
  }
  return line;
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
    await neonExtras.recordSettingsHistory(userId, configRow(before), changes, HISTORY_KEEP);
  } catch (error) {
    console.error("recordAlertSettingsChange failed:", error);
  }
}

export type AlertSettingsHistoryEntry = { id: number; savedAt: string; changes: string[] };

export async function listAlertSettingsHistory(userId: string, limit = 10): Promise<AlertSettingsHistoryEntry[]> {
  return neonExtras.listSettingsHistory(userId, limit);
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
  const snapshot = await neonExtras.getSettingsHistorySnapshot(userId, id);
  if (!snapshot) return { error: "not_found" };
  const current = await getAlertSettingsForUser(userId);
  const restored = mergeSnapshotOntoCurrent(snapshot, current);
  const saved = await saveAlertSettingsForUser(userId, restored);
  if (saved.error) return { error: saved.error };
  await recordAlertSettingsChange(userId, current, restored, locale);
  return { error: null };
}

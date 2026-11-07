import { dbBackend } from "./db/client";
import * as neonExtras from "./db/alertExtras";
import { createServerClient } from "./supabase";
import { snoozeUntilFromHours, vacationUntilFromDays } from "./alertSnooze";
import { getAlertSettingsForUser, saveAlertSettingsForUser } from "./notify";
import type { AlertSettings } from "./alerts";
import type { Locale } from "../i18n/locales";
import { plural } from "../i18n/format";
import { alertJobsMessages } from "../i18n/messages/app/alertJobs";

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Snooze links carry a random token; the database stores only its SHA-256
 * hash, so a database read can't be turned into working snooze links.
 *
 * Links sent before 2026-10-28 stored the raw 32-hex token. Those still match
 * until they expire (7 days). Only that exact legacy shape is looked up raw,
 * so a stored 64-hex hash pasted in as a token matches nothing.
 * After 2026-11-05 the legacy branch can be removed.
 */
const LEGACY_RAW_TOKEN = /^[0-9a-f]{32}$/;

export async function snoozeTokenLookupKeys(token: string): Promise<string[]> {
  const keys = [await sha256Hex(token)];
  if (LEGACY_RAW_TOKEN.test(token)) keys.push(token);
  return keys;
}

type SnoozeTokenRow = {
  token: string;
  user_id: string;
  hours: number;
  expires_at: string;
  used_at: string | null;
};

export async function findSnoozeToken(token: string): Promise<SnoozeTokenRow | null> {
  if (dbBackend() === "neon") return neonExtras.findSnoozeToken(await snoozeTokenLookupKeys(token));
  const supabase = createServerClient();
  const { data } = await supabase
    .from("alert_snooze_tokens")
    .select("token, user_id, hours, expires_at, used_at")
    .in("token", await snoozeTokenLookupKeys(token))
    .limit(1)
    .maybeSingle();
  return (data as SnoozeTokenRow | null) ?? null;
}

function randomSnoozeToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createSnoozeToken(
  userId: string,
  hours = 24,
): Promise<string> {
  const token = randomSnoozeToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  if (dbBackend() === "neon") {
    await neonExtras.insertSnoozeToken(await sha256Hex(token), userId, hours, expiresAt);
    return token;
  }
  const supabase = createServerClient();
  await supabase.from("alert_snooze_tokens").insert({
    token: await sha256Hex(token),
    user_id: userId,
    hours,
    expires_at: expiresAt,
  });
  return token;
}

export async function applySnoozeToken(
  token: string,
  locale: Locale = "en",
): Promise<{ ok: boolean; message: string }> {
  const t = alertJobsMessages(locale).snoozePage;
  if (dbBackend() === "neon") {
    const keys = await snoozeTokenLookupKeys(token);
    const claimed = await neonExtras.claimSnoozeToken(keys).catch(() => null);
    if (!claimed) {
      const row = await neonExtras.findSnoozeToken(keys);
      const expired = row != null && !row.used_at && Date.parse(row.expires_at) < Date.now();
      return { ok: false, message: expired ? t.resultExpired : t.resultInvalid };
    }
    const current = await getAlertSettingsForUser(claimed.user_id);
    await saveAlertSettingsForUser(claimed.user_id, { ...current, snoozeUntil: snoozeUntilFromHours(claimed.hours) });
    return { ok: true, message: plural(t.resultSnoozed, claimed.hours, locale) };
  }
  const data = await findSnoozeToken(token);

  if (!data || data.used_at) {
    return { ok: false, message: t.resultInvalid };
  }
  if (Date.parse(data.expires_at) < Date.now()) {
    return { ok: false, message: t.resultExpired };
  }

  const settings = await getAlertSettingsForUser(data.user_id);
  const updated: AlertSettings = {
    ...settings,
    snoozeUntil: snoozeUntilFromHours(data.hours),
  };
  await saveAlertSettingsForUser(data.user_id, updated);
  await createServerClient()
    .from("alert_snooze_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("token", data.token);

  return { ok: true, message: plural(t.resultSnoozed, data.hours, locale) };
}

export async function buildSnoozeUrl(baseUrl: string, userId: string, hours = 24): Promise<string> {
  const token = await createSnoozeToken(userId, hours);
  return `${baseUrl.replace(/\/$/, "")}/api/alerts/snooze?token=${token}`;
}

/** The household's members (user ids), from whichever database is active. */
async function householdMembers(householdId: string): Promise<Array<{ user_id: string }>> {
  if (dbBackend() === "neon") {
    return (await neonExtras.householdMemberIds(householdId)).map((user_id) => ({ user_id }));
  }
  const { data } = await createServerClient()
    .from("household_members")
    .select("user_id")
    .eq("household_id", householdId);
  return data ?? [];
}

export async function applySnoozeForHouseholdMembers(
  householdId: string,
  hours: number,
): Promise<number> {
  const members = await householdMembers(householdId);

  let count = 0;
  for (const member of members) {
    const settings = await getAlertSettingsForUser(member.user_id);
    await saveAlertSettingsForUser(member.user_id, {
      ...settings,
      snoozeUntil: snoozeUntilFromHours(hours),
    });
    count += 1;
  }
  return count;
}

export async function applyVacationForHouseholdMembers(
  householdId: string,
  days: number,
): Promise<number> {
  const members = await householdMembers(householdId);

  let count = 0;
  for (const member of members) {
    const settings = await getAlertSettingsForUser(member.user_id);
    await saveAlertSettingsForUser(member.user_id, {
      ...settings,
      vacationUntil: vacationUntilFromDays(days),
    });
    count += 1;
  }
  return count;
}

export async function clearSnoozeForUser(userId: string): Promise<void> {
  const settings = await getAlertSettingsForUser(userId);
  await saveAlertSettingsForUser(userId, { ...settings, snoozeUntil: null });
}

export async function clearVacationForUser(userId: string): Promise<void> {
  const settings = await getAlertSettingsForUser(userId);
  await saveAlertSettingsForUser(userId, { ...settings, vacationUntil: null });
}

export async function clearSnoozeForHouseholdMembers(householdId: string): Promise<number> {
  const members = await householdMembers(householdId);

  let count = 0;
  for (const member of members) {
    await clearSnoozeForUser(member.user_id);
    count += 1;
  }
  return count;
}

export async function clearVacationForHouseholdMembers(householdId: string): Promise<number> {
  const members = await householdMembers(householdId);

  let count = 0;
  for (const member of members) {
    await clearVacationForUser(member.user_id);
    count += 1;
  }
  return count;
}

export { sha256Hex };

import * as neonExtras from "./db/alertExtras";
import * as householdHolds from "./db/householdHolds";
import {
  type HouseholdAlertHold,
  snoozeUntilFromHours,
  vacationUntilFromDays,
} from "./alertSnooze";
import { getAlertSettingsForUser, saveAlertSettingsForUser } from "./notify";
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
 * hash, so a database read can't be turned into working snooze links, and a
 * stored hash pasted in as a token matches nothing. (Links from before
 * 2026-10-28 stored the raw token; all of them expired by 2026-11-04.)
 */
export async function snoozeTokenLookupKeys(token: string): Promise<string[]> {
  return [await sha256Hex(token)];
}

type SnoozeTokenRow = {
  token: string;
  user_id: string;
  hours: number;
  expires_at: string;
  used_at: string | null;
};

export async function findSnoozeToken(token: string): Promise<SnoozeTokenRow | null> {
  return neonExtras.findSnoozeToken(await snoozeTokenLookupKeys(token));
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
  await neonExtras.insertSnoozeToken(await sha256Hex(token), userId, hours, expiresAt);
  return token;
}

export async function applySnoozeToken(
  token: string,
  locale: Locale = "en",
): Promise<{ ok: boolean; message: string }> {
  const t = alertJobsMessages(locale).snoozePage;
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

export async function buildSnoozeUrl(baseUrl: string, userId: string, hours = 24): Promise<string> {
  const token = await createSnoozeToken(userId, hours);
  return `${baseUrl.replace(/\/$/, "")}/api/alerts/snooze?token=${token}`;
}

/** The household's members (user ids). */
async function householdMembers(householdId: string): Promise<Array<{ user_id: string }>> {
  return (await neonExtras.householdMemberIds(householdId)).map((user_id) => ({ user_id }));
}

/**
 * Account-wide: sets each member's own snooze, which holds their alerts for
 * every household they belong to. Not for integrations acting for one
 * household (the inbound webhook); those use applyHouseholdSnooze.
 */
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

/**
 * Account-wide, like applySnoozeForHouseholdMembers: for a user putting their
 * own households on vacation (portfolio vacation). Integrations use
 * applyHouseholdVacation.
 */
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

// ---- household holds (inbound webhook) ---------------------------------------
//
// Set on the household, not on its members' accounts: they hold this
// household's routine alerts only (see withHouseholdHold in alertSnooze.ts).
// Each returns the household's member count (whose alerts for it are held),
// 0 if the household no longer exists.

export async function applyHouseholdSnooze(householdId: string, hours: number): Promise<number> {
  return (await householdHolds.setHouseholdSnoozeUntil(householdId, snoozeUntilFromHours(hours))) ?? 0;
}

export async function applyHouseholdVacation(householdId: string, days: number): Promise<number> {
  return (await householdHolds.setHouseholdVacationUntil(householdId, vacationUntilFromDays(days))) ?? 0;
}

export async function clearHouseholdSnooze(householdId: string): Promise<number> {
  return (await householdHolds.setHouseholdSnoozeUntil(householdId, null)) ?? 0;
}

export async function clearHouseholdVacation(householdId: string): Promise<number> {
  return (await householdHolds.setHouseholdVacationUntil(householdId, null)) ?? 0;
}

/** The household's hold columns as stored (expired values included). Throws on a database error. */
export function getHouseholdAlertHold(householdId: string): Promise<HouseholdAlertHold> {
  return householdHolds.getHouseholdAlertHold(householdId);
}

/**
 * The hold for alert evaluation and display; null when it can't be read, so
 * alerts go out as if there were none (an unwanted routine alert beats a
 * missed one).
 */
export async function loadHouseholdAlertHold(householdId: string): Promise<HouseholdAlertHold | null> {
  try {
    return await householdHolds.getHouseholdAlertHold(householdId);
  } catch (error) {
    console.error(
      `Household alert hold for ${householdId} unreadable; treating it as none:`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

export { sha256Hex };

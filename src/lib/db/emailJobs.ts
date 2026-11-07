/**
 * Neon versions of the email-job queries: drip, trial reminders, weekly
 * digest, monthly / quarterly reports, freeze drills, email suppressions and
 * unsubscribe. Called when `dbBackend() === "neon"`.
 *
 * Settings columns a job may stamp are allow-listed (they go into SQL by name).
 */
import { query } from "./client";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

// ---- alert_settings reads and stamps ----------------------------------------

const FLAG_COLUMNS = ["monthly_report_enabled", "quarterly_report_enabled"] as const;
export type SettingsFlag = (typeof FLAG_COLUMNS)[number];

/** Users with a report turned on. Throws on failure. */
export async function userIdsWithFlag(flag: SettingsFlag): Promise<string[]> {
  if (!(FLAG_COLUMNS as readonly string[]).includes(flag)) throw new Error(`Unknown settings flag: ${flag}`);
  const rows = await query<{ user_id: string }>(
    `select user_id from public.alert_settings where "${flag}" order by user_id`,
  );
  return rows.map((r) => r.user_id);
}

export async function dripCandidates(): Promise<
  Array<{ user_id: string; drip_emails_enabled: boolean; drip_email_stage: number | null; last_drip_email_at: string | null }>
> {
  try {
    return await query(
      `select user_id, drip_emails_enabled, drip_email_stage, last_drip_email_at
       from public.alert_settings where drip_emails_enabled order by user_id`,
    );
  } catch {
    return [];
  }
}

const STAMP_COLUMNS = [
  "last_drip_email_at",
  "last_trial_reminder_at",
  "last_monthly_report_at",
  "last_quarterly_report_at",
  "last_freeze_drill_at",
] as const;
export type StampColumn = (typeof STAMP_COLUMNS)[number];

/** Set a "last sent" time to now (and updated_at when asked), plus the drip stage if given. */
export async function stampSettings(
  userId: string,
  column: StampColumn,
  options: { touchUpdatedAt?: boolean; dripStage?: number } = {},
): Promise<void> {
  if (!(STAMP_COLUMNS as readonly string[]).includes(column)) throw new Error(`Unknown stamp column: ${column}`);
  const sets = [`"${column}" = now()`];
  const params: unknown[] = [userId];
  if (options.touchUpdatedAt) sets.push("updated_at = now()");
  if (options.dripStage != null) {
    params.push(options.dripStage);
    sets.push(`drip_email_stage = $${params.length}`);
  }
  await query(`update public.alert_settings set ${sets.join(", ")} where user_id = $1`, params);
}

export async function lastTrialReminderAt(userId: string): Promise<string | null> {
  const [row] = await query<{ v: string | null }>(
    "select last_trial_reminder_at as v from public.alert_settings where user_id = $1",
    [userId],
  );
  return row?.v ?? null;
}

export async function trialingSubscriptions(): Promise<
  Array<{ user_id: string; status: string; current_period_end: string | null; plan_tier: string | null }>
> {
  try {
    return await query(
      `select user_id, status, current_period_end, plan_tier from public.stripe_subscriptions
       where status = 'trialing' order by user_id`,
    );
  } catch {
    return [];
  }
}

// ---- drip / digest helpers ----------------------------------------------------

/** A device in any of the user's households has reported, or the user has a legacy pull reading. Errors count as yes. */
export async function userHasFirstReading(userId: string): Promise<boolean> {
  try {
    const [row] = await query<{ yes: boolean }>(
      `select exists (
         select 1 from public.devices d join public.household_members m on m.household_id = d.household_id
         where m.user_id = $1 and d.last_seen_at is not null
       ) or exists (select 1 from public.garage_temps g where g.user_id = $1) as yes`,
      [userId],
    );
    return row?.yes ?? true;
  } catch {
    return true;
  }
}

/** The user's alerts in the last week, for the digest's delivery summary. Throws on failure. */
export function weekAlertDeliveries(
  userId: string,
  sinceIso: string,
): Promise<Array<{ kind: string; channels_sent: string[]; channels_skipped: string[] }>> {
  return query(
    `select kind, channels_sent, channels_skipped from public.alert_events
     where user_id = $1 and created_at >= $2 order by created_at desc limit 1000`,
    [userId, sinceIso],
  );
}

/** Other members of the user's households who opted into the digest. */
export async function digestFanOutMemberIds(userId: string): Promise<string[]> {
  const rows = await query<{ user_id: string }>(
    `select distinct other.user_id from public.household_members mine
     join public.household_members other on other.household_id = mine.household_id
     where mine.user_id = $1 and other.digest_opt_in and other.user_id <> $1`,
    [userId],
  );
  return rows.map((r) => r.user_id);
}

export async function firstOwnedHouseholdId(userId: string): Promise<string | null> {
  try {
    const [row] = await query<{ household_id: string }>(
      `select household_id from public.household_members where user_id = $1 and role = 'owner'
       order by created_at, id limit 1`,
      [userId],
    );
    return row?.household_id ?? null;
  } catch {
    return null;
  }
}

export async function optOutOfAllDigests(userId: string): Promise<{ error: string | null }> {
  try {
    await query("update public.household_members set digest_opt_in = false where user_id = $1", [userId]);
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

// ---- email suppressions -----------------------------------------------------

/** Throws on failure (caller fails open). */
export async function isSuppressed(email: string): Promise<boolean> {
  const rows = await query("select 1 from public.email_suppressions where email = $1", [email]);
  return rows.length > 0;
}

/** Throws on failure. */
export async function upsertSuppression(email: string, reason: string, lastError: string | null): Promise<void> {
  await query(
    `insert into public.email_suppressions (email, reason, last_error, updated_at) values ($1, $2, $3, now())
     on conflict (email) do update set reason = excluded.reason, last_error = excluded.last_error, updated_at = excluded.updated_at`,
    [email, reason, lastError],
  );
}

/** Throws on failure. */
export function listSuppressions<T>(limit: number): Promise<T[]> {
  return query<T & Record<string, unknown>>(
    `select email, reason, last_error, created_at, updated_at from public.email_suppressions
     order by updated_at desc, email limit $1`,
    [limit],
  );
}

/** Throws on failure. */
export async function deleteSuppression(email: string): Promise<void> {
  await query("delete from public.email_suppressions where email = $1", [email]);
}

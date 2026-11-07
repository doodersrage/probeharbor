/**
 * Neon versions of the last small queries: household activity log, the
 * mobile sign-in exchange (single-use jti), freeze-estimate snapshots,
 * portfolio alert bookkeeping, Telegram command lookup, contact form, digest
 * opt-in.
 */
import { query } from "./client";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

// ---- household activity -----------------------------------------------------

export async function recordActivity(row: { household_id: string; user_id: string | null; action: string; detail: string | null }): Promise<void> {
  try {
    await query("insert into public.household_activity (household_id, user_id, action, detail) values ($1, $2, $3, $4)", [
      row.household_id,
      row.user_id,
      row.action,
      row.detail,
    ]);
  } catch (error) {
    console.error("Failed to record household activity:", message(error));
  }
}

export async function listActivity<T>(householdId: string, limit: number): Promise<T[]> {
  try {
    return await query<T & Record<string, unknown>>(
      `select id, household_id, user_id, action, detail, created_at from public.household_activity
       where household_id = $1 order by created_at desc, id limit $2`,
      [householdId, limit],
    );
  } catch {
    return [];
  }
}

// ---- mobile sign-in exchange ------------------------------------------------

/** Throws on failure (caller refuses to issue a token then). */
export async function recordExchange(jti: string, expiresAtIso: string): Promise<void> {
  await query("insert into public.mobile_oauth_exchanges (jti, expires_at) values ($1, $2)", [jti, expiresAtIso]);
}

/** Use up an unexpired jti; true only the first time. Any error → false (reject). */
export async function consumeExchange(jti: string): Promise<boolean> {
  try {
    const rows = await query("delete from public.mobile_oauth_exchanges where jti = $1 and expires_at > now() returning jti", [jti]);
    return rows.length > 0;
  } catch {
    return false;
  }
}

// ---- freeze-estimate snapshots ----------------------------------------------

/** Throws on failure. */
export async function getEstimateSnapshot(householdId: string): Promise<{ data: unknown; updated_at: string } | null> {
  const [row] = await query<{ data: unknown; updated_at: string }>(
    "select data, updated_at from public.freeze_estimate_snapshots where household_id = $1",
    [householdId],
  );
  return row ?? null;
}

/** Throws on failure. */
export async function saveEstimateSnapshot(householdId: string, data: unknown, updatedAtIso: string): Promise<void> {
  await query(
    `insert into public.freeze_estimate_snapshots (household_id, data, updated_at) values ($1, $2::jsonb, $3)
     on conflict (household_id) do update set data = excluded.data, updated_at = excluded.updated_at`,
    [householdId, JSON.stringify(data), updatedAtIso],
  );
}

// ---- portfolio alerts -------------------------------------------------------

export async function ownerUserIds(): Promise<string[]> {
  try {
    const rows = await query<{ user_id: string }>("select distinct user_id from public.household_members where role = 'owner'");
    return rows.map((r) => r.user_id);
  } catch {
    return [];
  }
}

export async function stampPortfolioAlert(userId: string): Promise<void> {
  try {
    await query("update public.alert_settings set last_portfolio_alert_at = now(), updated_at = now() where user_id = $1", [userId]);
  } catch (error) {
    console.error("Failed to stamp portfolio alert:", message(error));
  }
}

// ---- Telegram, contact form, digest opt-in --------------------------------------

/** The user whose Telegram command secret this is (exactly one), else null. */
export async function userByTelegramSecret(secret: string): Promise<string | null> {
  try {
    const rows = await query<{ user_id: string }>(
      "select user_id from public.alert_settings where telegram_command_secret = $1 limit 2",
      [secret],
    );
    return rows.length === 1 ? rows[0]!.user_id : null;
  } catch {
    return null;
  }
}

export async function insertContact(name: string, email: string, text: string): Promise<{ error: string | null }> {
  try {
    await query("insert into public.contacts (name, email, message) values ($1, $2, $3)", [name, email, text]);
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function setDigestOptIn(householdId: string, userId: string, optIn: boolean): Promise<{ error: string | null }> {
  try {
    await query("update public.household_members set digest_opt_in = $3 where household_id = $1 and user_id = $2", [
      householdId,
      userId,
      optIn,
    ]);
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function getDigestOptIn(householdId: string, userId: string): Promise<boolean | null> {
  try {
    const [row] = await query<{ digest_opt_in: boolean }>(
      "select digest_opt_in from public.household_members where household_id = $1 and user_id = $2",
      [householdId, userId],
    );
    return row ? row.digest_opt_in : null;
  } catch {
    return null;
  }
}

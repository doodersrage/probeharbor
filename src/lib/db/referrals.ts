/**
 * Neon versions of the referral queries (referrals.ts). Called when
 * `dbBackend() === "neon"`. Trusted referral fields (referred_by,
 * referral_reward_days) live in user_profiles.app_metadata (migration 0002),
 * never in the user-facing `metadata`.
 *
 * Differences from the Supabase path, all deliberate:
 * - Rewarding a referrer claims the signup in one statement and adds the 7
 *   days in another single statement, so two subscription events at once
 *   can't reward twice or lose an increment (Supabase: read, then write).
 * - Whether a new user was already referred is read from the database, not
 *   from the session's copy.
 */
import { query } from "./client";

export async function findReferralCode(userId: string): Promise<string | null> {
  const [row] = await query<{ code: string }>("select code from public.referral_codes where user_id = $1", [userId]);
  return row?.code ?? null;
}

/** True when stored; false when the code was taken (or the user already has one). Throws on other errors. */
export async function insertReferralCode(userId: string, code: string): Promise<boolean> {
  const rows = await query(
    "insert into public.referral_codes (user_id, code) values ($1, $2) on conflict do nothing returning code",
    [userId, code],
  );
  return rows.length > 0;
}

export async function referrerForCode(code: string): Promise<string | null> {
  try {
    const [row] = await query<{ user_id: string }>("select user_id from public.referral_codes where code = $1", [code]);
    return row?.user_id ?? null;
  } catch {
    return null;
  }
}

export async function recordSignup(referrerUserId: string, referredUserId: string): Promise<void> {
  await query(
    `insert into public.referral_signups (referrer_user_id, referred_user_id) values ($1, $2)
     on conflict (referred_user_id) do update set referrer_user_id = excluded.referrer_user_id`,
    [referrerUserId, referredUserId],
  );
}

export async function countSignups(userId: string): Promise<number> {
  try {
    const [row] = await query<{ n: number }>(
      "select count(*) as n from public.referral_signups where referrer_user_id = $1",
      [userId],
    );
    return row?.n ?? 0;
  } catch {
    return 0;
  }
}

export async function referredBy(userId: string): Promise<string | null> {
  const [row] = await query<{ v: string | null }>(
    "select app_metadata ->> 'referred_by' as v from public.user_profiles where user_id = $1",
    [userId],
  );
  return row?.v ?? null;
}

/** Set referred_by only if it isn't set yet. */
export async function setReferredBy(userId: string, code: string): Promise<void> {
  await query(
    `insert into public.user_profiles (user_id, app_metadata) values ($1, jsonb_build_object('referred_by', $2::text))
     on conflict (user_id) do update
       set app_metadata = public.user_profiles.app_metadata || jsonb_build_object('referred_by', $2::text),
           updated_at = now()
       where not (public.user_profiles.app_metadata ? 'referred_by')`,
    [userId, code],
  );
}

/** Mark the referred user's signup rewarded; returns the referrer only the first time. */
export async function claimReferralReward(referredUserId: string): Promise<string | null> {
  const [row] = await query<{ referrer_user_id: string }>(
    `update public.referral_signups set referrer_rewarded_at = now()
     where referred_user_id = $1 and referrer_rewarded_at is null
     returning referrer_user_id`,
    [referredUserId],
  );
  return row?.referrer_user_id ?? null;
}

/**
 * referral_reward_days := min(current, 28) + 7, in one statement. Same
 * arithmetic as the Supabase path (referralRewardTrialDays caps the current
 * value at 28; anything not a positive number counts as 0).
 */
export async function addReferralRewardDays(referrerUserId: string): Promise<void> {
  await query(
    `insert into public.user_profiles (user_id, app_metadata) values ($1, '{"referral_reward_days": 7}'::jsonb)
     on conflict (user_id) do update set app_metadata = public.user_profiles.app_metadata || jsonb_build_object(
       'referral_reward_days',
       (case when (public.user_profiles.app_metadata ->> 'referral_reward_days') ~ '^[0-9]+(\\.[0-9]+)?$'
             then least(floor((public.user_profiles.app_metadata ->> 'referral_reward_days')::numeric), 28)
             else 0 end) + 7
     ), updated_at = now()`,
    [referrerUserId],
  );
}

export async function adminStats(): Promise<{ total: number; rewarded: number; top: Array<{ userId: string; count: number }> }> {
  const [totals] = await query<{ total: number; rewarded: number }>(
    `select count(*) as total, count(referrer_rewarded_at) as rewarded from public.referral_signups`,
  );
  const top = await query<{ referrer_user_id: string; n: number }>(
    `select referrer_user_id, count(*) as n from public.referral_signups
     group by referrer_user_id order by n desc, referrer_user_id limit 10`,
  );
  return {
    total: totals?.total ?? 0,
    rewarded: totals?.rewarded ?? 0,
    top: top.map((r) => ({ userId: r.referrer_user_id, count: r.n })),
  };
}

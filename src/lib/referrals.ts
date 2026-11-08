import * as neonReferrals from "./db/referrals";

const CODE_CHARS = "abcdefghjkmnpqrstuvwxyz23456789";

function randomCode(length = 8): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return [...bytes]
    .map((b) => CODE_CHARS[b % CODE_CHARS.length])
    .join("");
}

export async function getOrCreateReferralCode(userId: string): Promise<string> {
  const existing = await neonReferrals.findReferralCode(userId);
  if (existing) return existing;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = randomCode();
    if (await neonReferrals.insertReferralCode(userId, code)) return code;
    // Lost a race for this user's code: use the one that was stored.
    const stored = await neonReferrals.findReferralCode(userId);
    if (stored) return stored;
  }
  throw new Error("Unable to create referral code");
}

export async function resolveReferrerUserId(code: string): Promise<string | null> {
  const normalized = code.trim().toLowerCase();
  if (!normalized) return null;
  return neonReferrals.referrerForCode(normalized);
}

export async function recordReferralSignup(
  referrerUserId: string,
  referredUserId: string,
): Promise<void> {
  if (referrerUserId === referredUserId) return;
  return neonReferrals.recordSignup(referrerUserId, referredUserId);
}

export async function countReferralSignups(userId: string): Promise<number> {
  return neonReferrals.countSignups(userId);
}

/** Extra Pro trial days when the user signed up via referral. */
export function referralBonusTrialDays(referredByCode: string | null | undefined): number {
  return referredByCode ? 7 : 0;
}

/** Extra trial days earned when friends subscribe (stored in referrer metadata). */
export function referralRewardTrialDays(metadata: Record<string, unknown> | null | undefined): number {
  const raw = metadata?.referral_reward_days;
  const days = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(days) || days <= 0) return 0;
  return Math.min(Math.floor(days), 28);
}

export const PRO_TRIAL_DAYS = 14;

/** OAuth/email signups within this window can still receive a referral code. */
export function isLikelyNewUser(createdAt: string): boolean {
  const created = Date.parse(createdAt);
  if (Number.isNaN(created)) return false;
  return Date.now() - created < 10 * 60 * 1000;
}

// referred_by and referral_reward_days live in user_profiles.app_metadata,
// which only the server writes: a user can't grant themselves a referral or
// extra trial days.
export async function applyReferralForNewUser(
  userId: string,
  refCode: string,
  userAppMetadata?: Record<string, unknown> | null,
): Promise<void> {
  const normalized = refCode.trim().toLowerCase();
  if (!normalized || userAppMetadata?.referred_by) return;
  // The database copy is the authority, not the session's.
  if (await neonReferrals.referredBy(userId)) return;
  const referrer = await resolveReferrerUserId(normalized);
  // Your own code isn't a referral (it would add trial days at checkout).
  if (!referrer || referrer === userId) return;
  await recordReferralSignup(referrer, userId);
  await neonReferrals.setReferredBy(userId, normalized);
}

export type ReferralStats = {
  totalSignups: number;
  rewardedSignups: number;
  topReferrers: { userId: string; count: number }[];
};

export async function grantReferrerRewardOnSubscription(
  referredUserId: string,
): Promise<void> {
  const referrer = await neonReferrals.claimReferralReward(referredUserId);
  if (referrer) await neonReferrals.addReferralRewardDays(referrer);
}

export async function fetchReferralAdminStats(): Promise<ReferralStats> {
  const stats = await neonReferrals.adminStats();
  return { totalSignups: stats.total, rewardedSignups: stats.rewarded, topReferrers: stats.top };
}

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  isLikelyNewUser,
  PRO_TRIAL_DAYS,
  referralBonusTrialDays,
  referralRewardTrialDays,
} from "./referrals";

const db = vi.hoisted(() => ({
  referredBy: vi.fn(),
  referrerForCode: vi.fn(),
  recordSignup: vi.fn(),
  setReferredBy: vi.fn(),
  claimReferralReward: vi.fn(),
  addReferralRewardDays: vi.fn(),
}));

vi.mock("./db/referrals", () => db);

describe("referral trial days", () => {
  it("adds referrer reward trial days from metadata", () => {
    expect(referralRewardTrialDays({ referral_reward_days: 14 })).toBe(14);
    expect(referralBonusTrialDays("abc")).toBe(7);
  });

  it("adds bonus trial days for referred users", () => {
    expect(referralBonusTrialDays("abc123")).toBe(7);
    expect(referralBonusTrialDays(null)).toBe(0);
    expect(PRO_TRIAL_DAYS + referralBonusTrialDays("x")).toBe(21);
  });
});

describe("isLikelyNewUser", () => {
  it("detects likely new OAuth users", () => {
    const recent = new Date(Date.now() - 60_000).toISOString();
    const old = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    expect(isLikelyNewUser(recent)).toBe(true);
    expect(isLikelyNewUser(old)).toBe(false);
  });
});

describe("applyReferralForNewUser", () => {
  beforeEach(() => {
    for (const fn of Object.values(db)) fn.mockReset();
    db.referredBy.mockResolvedValue(null);
    db.recordSignup.mockResolvedValue(undefined);
    db.setReferredBy.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("records the signup and stores the normalized code as referred_by", async () => {
    db.referrerForCode.mockResolvedValue("referrer-1");

    const { applyReferralForNewUser } = await import("./referrals");
    await applyReferralForNewUser("new-user", "ABC123", { existing_key: "keep-me" });

    expect(db.referrerForCode).toHaveBeenCalledWith("abc123");
    expect(db.recordSignup).toHaveBeenCalledWith("referrer-1", "new-user");
    expect(db.setReferredBy).toHaveBeenCalledWith("new-user", "abc123");
  });

  it("is a no-op when the session already shows a referral", async () => {
    const { applyReferralForNewUser } = await import("./referrals");
    await applyReferralForNewUser("new-user", "abc123", { referred_by: "already-set" });

    expect(db.referredBy).not.toHaveBeenCalled();
    expect(db.recordSignup).not.toHaveBeenCalled();
    expect(db.setReferredBy).not.toHaveBeenCalled();
  });

  it("is a no-op when the database already has referred_by", async () => {
    db.referredBy.mockResolvedValue("earlier");

    const { applyReferralForNewUser } = await import("./referrals");
    await applyReferralForNewUser("new-user", "abc123", {});

    expect(db.referrerForCode).not.toHaveBeenCalled();
    expect(db.setReferredBy).not.toHaveBeenCalled();
  });

  it("is a no-op for an unknown referral code", async () => {
    db.referrerForCode.mockResolvedValue(null);

    const { applyReferralForNewUser } = await import("./referrals");
    await applyReferralForNewUser("new-user", "bogus", {});

    expect(db.recordSignup).not.toHaveBeenCalled();
    expect(db.setReferredBy).not.toHaveBeenCalled();
  });

  it("doesn't refer a user to themselves", async () => {
    db.referrerForCode.mockResolvedValue("new-user");

    const { applyReferralForNewUser } = await import("./referrals");
    await applyReferralForNewUser("new-user", "abc123", {});

    expect(db.recordSignup).not.toHaveBeenCalled();
  });
});

describe("grantReferrerRewardOnSubscription", () => {
  beforeEach(() => {
    for (const fn of Object.values(db)) fn.mockReset();
  });

  it("adds reward days to the referrer when the reward is claimed", async () => {
    db.claimReferralReward.mockResolvedValue("referrer-1");

    const { grantReferrerRewardOnSubscription } = await import("./referrals");
    await grantReferrerRewardOnSubscription("referred-user");

    expect(db.claimReferralReward).toHaveBeenCalledWith("referred-user");
    expect(db.addReferralRewardDays).toHaveBeenCalledWith("referrer-1");
  });

  it("is a no-op when already rewarded (or not referred)", async () => {
    db.claimReferralReward.mockResolvedValue(null);

    const { grantReferrerRewardOnSubscription } = await import("./referrals");
    await grantReferrerRewardOnSubscription("referred-user");

    expect(db.addReferralRewardDays).not.toHaveBeenCalled();
  });
});

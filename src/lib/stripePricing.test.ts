import { describe, expect, it } from "vitest";
import {
  getMemberPriceDisplay,
  getProPriceDisplay,
  resolvePricingDefaultInterval,
} from "./stripePricing";

describe("stripePricing", () => {
  it("formats display prices and annual savings", () => {
    const originalMemberMonthly = import.meta.env.STRIPE_DISPLAY_MEMBER_MONTHLY;
    const originalMemberAnnual = import.meta.env.STRIPE_DISPLAY_MEMBER_ANNUAL;
    (import.meta.env as unknown as Record<string, string | undefined>).STRIPE_DISPLAY_MEMBER_MONTHLY = "6";
    (import.meta.env as unknown as Record<string, string | undefined>).STRIPE_DISPLAY_MEMBER_ANNUAL = "60";

    const prices = getMemberPriceDisplay();
    expect(prices.monthly).toBe("$6");
    expect(prices.annual).toBe("$60");
    expect(prices.annualSavingsPct).toBe(17);

    (import.meta.env as unknown as Record<string, string | undefined>).STRIPE_DISPLAY_MEMBER_MONTHLY =
      originalMemberMonthly;
    (import.meta.env as unknown as Record<string, string | undefined>).STRIPE_DISPLAY_MEMBER_ANNUAL =
      originalMemberAnnual;
  });

  it("returns null prices when env is unset", () => {
    const env = import.meta.env as unknown as Record<string, string | undefined>;
    const prevM = env.STRIPE_DISPLAY_PRO_MONTHLY;
    const prevA = env.STRIPE_DISPLAY_PRO_ANNUAL;
    env.STRIPE_DISPLAY_PRO_MONTHLY = "";
    env.STRIPE_DISPLAY_PRO_ANNUAL = "";
    expect(getProPriceDisplay().monthly).toBeNull();
    env.STRIPE_DISPLAY_PRO_MONTHLY = prevM;
    env.STRIPE_DISPLAY_PRO_ANNUAL = prevA;
  });
});

describe("resolvePricingDefaultInterval", () => {
  it("defaults to monthly", () => {
    expect(resolvePricingDefaultInterval(undefined)).toBe("monthly");
    expect(resolvePricingDefaultInterval("")).toBe("monthly");
    expect(resolvePricingDefaultInterval("monthly")).toBe("monthly");
    expect(resolvePricingDefaultInterval("yearly")).toBe("monthly");
  });

  it("keeps an explicit annual override", () => {
    expect(resolvePricingDefaultInterval("annual")).toBe("annual");
    expect(resolvePricingDefaultInterval(" Annual ")).toBe("annual");
  });
});

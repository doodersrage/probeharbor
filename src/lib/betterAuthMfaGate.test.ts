import { describe, expect, it } from "vitest";
import { betterAuthNeedsStepUp } from "./betterAuthMfaGate";
import { YUBIKEY_OTP_METADATA_KEY } from "./yubikeyOtpMetadata";

const enrolled = { id: "u1", user_metadata: { [YUBIKEY_OTP_METADATA_KEY]: ["ccccccbcdefg"] } };
const yes = async () => true;
const no = async () => false;

describe("betterAuthNeedsStepUp", () => {
  it("no YubiKey enrolled: no step-up (TOTP was checked at sign-in)", async () => {
    await expect(betterAuthNeedsStepUp({ id: "u1", user_metadata: {} }, no)).resolves.toBe(false);
    await expect(betterAuthNeedsStepUp(null, no)).resolves.toBe(false);
  });

  it("YubiKey enrolled: step up unless this user's proof is valid", async () => {
    await expect(betterAuthNeedsStepUp(enrolled, no)).resolves.toBe(true);
    await expect(betterAuthNeedsStepUp(enrolled, yes)).resolves.toBe(false);
    const seen: string[] = [];
    await betterAuthNeedsStepUp(enrolled, async (id) => {
      seen.push(id);
      return true;
    });
    expect(seen).toEqual(["u1"]);
  });

  it("TOTP on: the session already passed a second factor, no YubiKey prompt", async () => {
    await expect(betterAuthNeedsStepUp({ ...enrolled, two_factor_enabled: true }, no)).resolves.toBe(false);
    await expect(betterAuthNeedsStepUp({ ...enrolled, two_factor_enabled: false }, no)).resolves.toBe(true);
  });

  it("fails closed without a user id", async () => {
    await expect(betterAuthNeedsStepUp({ user_metadata: enrolled.user_metadata }, yes)).resolves.toBe(true);
  });
});

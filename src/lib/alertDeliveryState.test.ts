import { describe, expect, it } from "vitest";
import { alertDeliveryState } from "./alertDeliveryState";

const row = (channels_sent: string[] | null, channels_skipped: string[] | null) => ({ channels_sent, channels_skipped });

describe("alertDeliveryState", () => {
  it("is sent (accepted) when every channel tried was accepted", () => {
    expect(alertDeliveryState(row(["email", "push"], []))).toEqual({ state: "sent", sent: ["email", "push"] });
  });

  it("is partial when some channels were accepted and others failed", () => {
    expect(alertDeliveryState(row(["email"], ["sms", "push_no_subscription"]))).toEqual({
      state: "partial",
      sent: ["email"],
      failed: ["sms", "push_no_subscription"],
    });
  });

  it("is held for quiet hours", () => {
    expect(alertDeliveryState(row([], ["quiet_hours"]))).toEqual({ state: "held", reason: "quiet_hours", failed: [] });
  });

  it("is held for snooze or vacation (the stored reason doesn't say which)", () => {
    expect(alertDeliveryState(row([], ["snooze_or_vacation"]))).toEqual({
      state: "held",
      reason: "snooze_or_vacation",
      failed: [],
    });
  });

  it("keeps the failed SMS when quiet hours allowed only SMS and it failed", () => {
    expect(alertDeliveryState(row([], ["sms", "quiet_hours"]))).toEqual({
      state: "held",
      reason: "quiet_hours",
      failed: ["sms"],
    });
  });

  it("is failed when every channel tried failed, listing them", () => {
    expect(alertDeliveryState(row([], ["email", "sms_not_configured"]))).toEqual({
      state: "failed",
      failed: ["email", "sms_not_configured"],
    });
  });

  it("is not_set_up when nothing was tried", () => {
    expect(alertDeliveryState(row([], []))).toEqual({ state: "not_set_up" });
    expect(alertDeliveryState(row(null, null))).toEqual({ state: "not_set_up" });
  });

  it("never reports sent without an accepted channel", () => {
    for (const skipped of [["quiet_hours"], ["email"], [], ["snooze_or_vacation", "email"]]) {
      expect(alertDeliveryState(row([], skipped)).state).not.toBe("sent");
      expect(alertDeliveryState(row([], skipped)).state).not.toBe("partial");
    }
  });

  it("ignores duplicate entries", () => {
    expect(alertDeliveryState(row(["email", "email"], ["sms", "sms"]))).toEqual({
      state: "partial",
      sent: ["email"],
      failed: ["sms"],
    });
  });
});

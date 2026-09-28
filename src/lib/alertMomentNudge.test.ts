import { describe, expect, it } from "vitest";
import { findAlertMoment } from "./alertMomentNudge";

const now = Date.parse("2026-10-10T12:00:00Z");
const ev = (id: number, kind: string, daysAgo: number, channels: string[]) => ({
  id,
  kind,
  created_at: new Date(now - daysAgo * 864e5).toISOString(),
  channels_sent: channels,
});

describe("findAlertMoment", () => {
  it("picks the latest email-only freeze or leak alert", () => {
    const moment = findAlertMoment(
      [ev(1, "threshold", 5, ["email"]), ev(2, "flood", 1, ["email"]), ev(3, "generic", 0, ["email"])],
      now,
    );
    expect(moment).toMatchObject({ eventId: 2, kind: "flood", label: "leak alert" });
  });

  it("ignores tests, digests, and non-critical kinds", () => {
    expect(
      findAlertMoment([ev(1, "generic", 0, ["email"]), ev(2, "digest", 0, ["email"]), ev(3, "outage", 0, ["email"])], now),
    ).toBeNull();
  });

  it("stays quiet when the alert already reached a phone", () => {
    expect(findAlertMoment([ev(1, "threshold", 1, ["email", "push"])], now)).toBeNull();
  });

  it("ignores undelivered and old alerts", () => {
    expect(findAlertMoment([ev(1, "threshold", 1, []), ev(2, "threshold", 20, ["email"])], now)).toBeNull();
  });
});

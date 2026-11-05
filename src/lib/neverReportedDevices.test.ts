import { describe, expect, it } from "vitest";
import { findNeverReportedPushDevices, shouldOfferNeverReportedCleanup } from "./neverReportedDevices";

const device = (id: string, source: string, lastSeen: string | null) => ({
  id,
  name: `Device ${id}`,
  source,
  last_seen_at: lastSeen,
});

describe("findNeverReportedPushDevices", () => {
  it("returns push devices with no last_seen_at, in order", () => {
    expect(
      findNeverReportedPushDevices([
        device("a", "push", null),
        device("b", "push", "2026-11-01T00:00:00Z"),
        device("c", "pull", null),
        device("d", "push", null),
      ]),
    ).toEqual([
      { id: "a", name: "Device a" },
      { id: "d", name: "Device d" },
    ]);
  });

  it("returns nothing when every push device has reported", () => {
    expect(findNeverReportedPushDevices([device("a", "push", "2026-11-01T00:00:00Z")])).toEqual([]);
  });
});

describe("shouldOfferNeverReportedCleanup", () => {
  const one = [{ id: "a", name: "A" }];

  it("offers cleanup only at the limit, to an editor, with a never-reported device", () => {
    expect(shouldOfferNeverReportedCleanup({ atDeviceLimit: true, canEdit: true, neverReported: one })).toBe(true);
    expect(shouldOfferNeverReportedCleanup({ atDeviceLimit: false, canEdit: true, neverReported: one })).toBe(false);
    expect(shouldOfferNeverReportedCleanup({ atDeviceLimit: true, canEdit: false, neverReported: one })).toBe(false);
    expect(shouldOfferNeverReportedCleanup({ atDeviceLimit: true, canEdit: true, neverReported: [] })).toBe(false);
  });
});

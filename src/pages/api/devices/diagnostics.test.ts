import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockAuth = vi.fn();
vi.mock("../../../lib/auth", () => ({ getAuthFromCookies: (...a: unknown[]) => mockAuth(...a) }));
vi.mock("../../../lib/households", () => ({
  getOrCreateHouseholdForUser: async () => ({ householdId: "hh" }),
}));
const device = {
  id: "d1",
  household_id: "hh",
  name: "Garage Board #2",
  source: "push",
  pull_url: null,
  ingest_key_prefix: null,
  enabled: true,
  last_seen_at: null,
  sort_order: 0,
  meta: { wifi_ssid: "Home" },
  sensors: [],
};
vi.mock("../../../lib/devices", () => ({ listHouseholdDevices: async () => ({ devices: [device], error: null }) }));
vi.mock("../../../lib/sensorReadings", () => ({ fetchLatestSensorValues: async () => [] }));
vi.mock("../../../lib/stuckSensors", () => ({ findStuckSensors: async () => [] }));
vi.mock("../../../lib/ingestStats", () => ({ listIngestStatsForHousehold: async () => [] }));

function ctx(deviceId: string): APIContext {
  return { cookies: {}, url: new URL(`https://x.test/api/devices/diagnostics?device_id=${deviceId}`) } as unknown as APIContext;
}

beforeEach(() => mockAuth.mockReset());

describe("device diagnostics download", () => {
  it("returns a redacted attachment for a device in the property", async () => {
    mockAuth.mockResolvedValue({ session: {}, user: { id: "u1", email: "a@b.c" } });
    const { GET } = await import("./diagnostics");
    const response = await GET(ctx("d1"));
    expect(response.headers.get("Content-Disposition")).toContain("probeharbor-garage-board-2-diagnostics.json");
    const body = (await response.json()) as { device: { name: string }; meta: { wifi_ssid: string } };
    expect(body.device.name).toBe("Garage Board #2");
    expect(body.meta.wifi_ssid).toBe("[redacted]");
  });

  it("404s for a device outside the property and 401s when signed out", async () => {
    mockAuth.mockResolvedValue({ session: {}, user: { id: "u1" } });
    const { GET } = await import("./diagnostics");
    expect((await GET(ctx("other"))).status).toBe(404);
    mockAuth.mockResolvedValue({ session: null, user: null });
    expect((await GET(ctx("d1"))).status).toBe(401);
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { isMaintenanceMode, maintenanceIngestResponse } from "./maintenanceMode";

afterEach(() => vi.unstubAllEnvs());

describe("maintenance mode", () => {
  it("is off unless MAINTENANCE_MODE is 1, true or on", () => {
    expect(isMaintenanceMode()).toBe(false);
    for (const v of ["1", "true", " ON "]) {
      vi.stubEnv("MAINTENANCE_MODE", v);
      expect(isMaintenanceMode()).toBe(true);
    }
    for (const v of ["0", "false", "", "maybe"]) {
      vi.stubEnv("MAINTENANCE_MODE", v);
      expect(isMaintenanceMode()).toBe(false);
    }
  });

  it("tells clients to come back, not that their data was wrong", async () => {
    const r = maintenanceIngestResponse();
    expect(r.status).toBe(503); // not 4xx: probes keep the reading and resend
    expect(r.headers.get("Retry-After")).toBe("120");
    expect(await r.json()).toEqual({ error: expect.stringContaining("maintenance") });
  });
});

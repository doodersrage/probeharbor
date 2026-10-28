import { afterEach, describe, expect, it, vi } from "vitest";
import { env } from "cloudflare:workers";
import { checkEdgeRateLimit } from "./edgeRateLimit";

const bindings = env as unknown as Record<string, unknown>;

afterEach(() => {
  delete bindings.INGEST_RATE_LIMITER;
});

describe("checkEdgeRateLimit", () => {
  it("returns null without a binding, so callers use the in-memory limit", async () => {
    expect(await checkEdgeRateLimit("INGEST_RATE_LIMITER", "k")).toBeNull();
  });

  it("passes the key and returns the binding's verdict", async () => {
    const limit = vi.fn().mockResolvedValueOnce({ success: true }).mockResolvedValueOnce({ success: false });
    bindings.INGEST_RATE_LIMITER = { limit };

    expect(await checkEdgeRateLimit("INGEST_RATE_LIMITER", "device-hash")).toBe(true);
    expect(await checkEdgeRateLimit("INGEST_RATE_LIMITER", "device-hash")).toBe(false);
    expect(limit).toHaveBeenCalledWith({ key: "device-hash" });
  });

  it("fails open (null) when the binding throws", async () => {
    bindings.INGEST_RATE_LIMITER = { limit: vi.fn().mockRejectedValue(new Error("unavailable")) };

    expect(await checkEdgeRateLimit("INGEST_RATE_LIMITER", "k")).toBeNull();
  });
});

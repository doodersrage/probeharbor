import { afterEach, describe, expect, it, vi } from "vitest";
import { env } from "cloudflare:workers";

// cloudflare:workers is aliased to a stub whose `env` stands in for Worker secrets.
const workerEnv = env as unknown as Record<string, string | undefined>;

afterEach(() => {
  vi.unstubAllGlobals();
  delete workerEnv.OPS_DISCORD_WEBHOOK_URL;
});

describe("notifyOps", () => {
  it("posts to the ops Discord webhook set as a Worker runtime secret", async () => {
    workerEnv.OPS_DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/ops/xyz";
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    const { notifyOps } = await import("./opsNotify");

    await notifyOps("ProbeHarbor: test", "body");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://discord.com/api/webhooks/ops/xyz",
      expect.objectContaining({ method: "POST" }),
    );
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";

const runtime: Record<string, string> = {};
vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => runtime[key],
}));

afterEach(() => {
  vi.unstubAllGlobals();
  for (const key of Object.keys(runtime)) delete runtime[key];
});

describe("notifyOps", () => {
  it("posts to the ops Discord webhook set as a Worker runtime secret", async () => {
    runtime.OPS_DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/ops/xyz";
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    const { notifyOps } = await import("./opsNotify");

    await notifyOps("ThermalTrace: test", "body");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://discord.com/api/webhooks/ops/xyz",
      expect.objectContaining({ method: "POST" }),
    );
  });
});

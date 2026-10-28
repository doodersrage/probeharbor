import { beforeEach, describe, expect, it, vi } from "vitest";

const bucket = { get: vi.fn() };
vi.mock("cloudflare:workers", () => ({ env: { HISTORY_ARCHIVE: bucket } }));

let tokenRow: Record<string, unknown> | null = null;
vi.mock("./supabase", () => ({
  createServerClient: () => ({
    from: () => {
      const builder: Record<string, unknown> = {};
      for (const method of ["select", "eq"]) builder[method] = () => builder;
      builder.maybeSingle = () => Promise.resolve({ data: tokenRow });
      return builder;
    },
  }),
}));

const future = new Date(Date.now() + 86_400_000).toISOString();

beforeEach(() => {
  bucket.get.mockReset();
  bucket.get.mockResolvedValue({ arrayBuffer: () => Promise.resolve(new ArrayBuffer(4)) });
});

describe("getChartShareByToken", () => {
  it("serves a chart image stored under chart-shares/", async () => {
    tokenRow = { r2_key: "chart-shares/abc.png", title: "Garage", expires_at: future };
    const { getChartShareByToken } = await import("./chartShare");

    const share = await getChartShareByToken("abc");

    expect(bucket.get).toHaveBeenCalledWith("chart-shares/abc.png");
    expect(share?.title).toBe("Garage");
    expect(share?.png?.byteLength).toBe(4);
  });

  it("refuses a row whose key points at a household archive", async () => {
    tokenRow = { r2_key: "archives/house-2/2024-03-17.json", title: null, expires_at: future };
    const { getChartShareByToken } = await import("./chartShare");

    expect(await getChartShareByToken("abc")).toBeNull();
    expect(bucket.get).not.toHaveBeenCalled();
  });

  it("returns null for an expired token without touching storage", async () => {
    tokenRow = { r2_key: "chart-shares/abc.png", title: null, expires_at: "2020-01-01T00:00:00Z" };
    const { getChartShareByToken } = await import("./chartShare");

    expect(await getChartShareByToken("abc")).toBeNull();
    expect(bucket.get).not.toHaveBeenCalled();
  });
});

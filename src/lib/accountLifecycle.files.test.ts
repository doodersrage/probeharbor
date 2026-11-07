import { beforeEach, describe, expect, it, vi } from "vitest";

// Fake R2 bucket: lists by prefix in pages of 2 so pagination is exercised.
const objects = new Set<string>();
const deleteSpy = vi.fn((keys: string | string[]) => {
  for (const key of Array.isArray(keys) ? keys : [keys]) objects.delete(key);
  return Promise.resolve();
});
const fakeBucket = {
  list: vi.fn(async ({ prefix, cursor }: { prefix: string; cursor?: string }) => {
    const all = [...objects].filter((key) => key.startsWith(prefix)).sort();
    const start = cursor ? Number(cursor) : 0;
    const page = all.slice(start, start + 2);
    const truncated = start + 2 < all.length;
    return { objects: page.map((key) => ({ key })), truncated, cursor: truncated ? String(start + 2) : undefined };
  }),
  delete: deleteSpy,
};
vi.mock("cloudflare:workers", () => ({ env: { HISTORY_ARCHIVE: fakeBucket } }));

vi.mock("./stripeSubscriptions", () => ({ getUserSubscription: vi.fn().mockResolvedValue(null) }));
vi.mock("./stripe", () => ({ getStripe: vi.fn() }));
vi.mock("./opsNotify", () => ({ notifyOps: vi.fn() }));

// One sole-owned household (h1) goes with the account; one shared chart image.
let chartShareRows: string[] = ["chart-shares/tok1.png"];
const mockDeleteUserRow = vi.fn().mockResolvedValue(undefined);
vi.mock("./db/accounts", () => ({
  releaseOwnedHouseholds: vi.fn().mockResolvedValue(["h1"]),
  chartShareKeys: vi.fn(async () => chartShareRows),
  deleteUserRow: (...args: unknown[]) => mockDeleteUserRow(...args),
}));

beforeEach(() => {
  objects.clear();
  deleteSpy.mockClear();
  chartShareRows = ["chart-shares/tok1.png"];
  mockDeleteUserRow.mockClear();
});

describe("deleteUserAccount stored files", () => {
  it("removes the deleted household's archives and the user's chart images, and nothing else", async () => {
    for (const key of [
      "archives/h1/2026-08-01.json",
      "archives/h1/2026-09-01.json",
      "archives/h1/2026-10-01.json",
      "archives/h2/2026-10-01.json",
      "chart-shares/tok1.png",
      "chart-shares/other.png",
    ]) objects.add(key);

    const { deleteUserAccount } = await import("./accountLifecycle");
    const result = await deleteUserAccount("user-1");

    expect(result.error).toBeNull();
    expect([...objects].sort()).toEqual(["archives/h2/2026-10-01.json", "chart-shares/other.png"]);
    expect(mockDeleteUserRow).toHaveBeenCalledWith("user-1");
  });

  it("ignores a chart-share row whose key points outside chart-shares/", async () => {
    for (const key of ["archives/h2/2026-10-01.json", "chart-shares/tok1.png"]) objects.add(key);
    chartShareRows = ["archives/h2/2026-10-01.json", "chart-shares/tok1.png"];

    const { deleteUserAccount } = await import("./accountLifecycle");
    await deleteUserAccount("user-1");

    expect([...objects]).toEqual(["archives/h2/2026-10-01.json"]);
  });

  it("still deletes the account when storage cleanup fails", async () => {
    objects.add("archives/h1/2026-10-01.json");
    deleteSpy.mockRejectedValueOnce(new Error("R2 unavailable"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const { deleteUserAccount } = await import("./accountLifecycle");
    const result = await deleteUserAccount("user-1");

    expect(result.error).toBeNull();
    expect(mockDeleteUserRow).toHaveBeenCalledWith("user-1");
  });
});

describe("deleteR2Prefix", () => {
  it("pages through every object under the prefix", async () => {
    for (let i = 0; i < 5; i++) objects.add(`archives/h9/${i}.json`);
    const { deleteR2Prefix } = await import("./accountLifecycle");
    const deleted = await deleteR2Prefix(fakeBucket as unknown as R2Bucket, "archives/h9/");
    expect(deleted).toBe(5);
    expect(objects.size).toBe(0);
  });
});

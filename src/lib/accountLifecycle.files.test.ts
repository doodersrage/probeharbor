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

// Answers by table: one sole-owned household, one shared chart image.
function query(result: unknown) {
  const builder: Record<string, unknown> = {};
  for (const method of ["select", "eq", "neq", "order", "update", "delete"]) builder[method] = () => builder;
  (builder as { then: unknown }).then = (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve);
  return builder;
}
let memberQueries = 0;
const mockDeleteUser = vi.fn().mockResolvedValue({ error: null });
vi.mock("./supabase", () => ({
  createServerClient: () => ({
    from: (table: string) => {
      if (table === "household_members") {
        memberQueries += 1;
        return query(memberQueries === 1 ? { data: [{ household_id: "h1" }] } : { count: 1 });
      }
      if (table === "chart_share_tokens") return query({ data: [{ r2_key: "chart-shares/tok1.png" }] });
      return query({ error: null });
    },
  }),
  createAdminClient: () => ({ auth: { admin: { deleteUser: mockDeleteUser } } }),
}));

beforeEach(() => {
  objects.clear();
  deleteSpy.mockClear();
  memberQueries = 0;
  mockDeleteUser.mockClear();
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
    expect(mockDeleteUser).toHaveBeenCalledWith("user-1");
  });

  it("still deletes the account when storage cleanup fails", async () => {
    objects.add("archives/h1/2026-10-01.json");
    deleteSpy.mockRejectedValueOnce(new Error("R2 unavailable"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const { deleteUserAccount } = await import("./accountLifecycle");
    const result = await deleteUserAccount("user-1");

    expect(result.error).toBeNull();
    expect(mockDeleteUser).toHaveBeenCalledWith("user-1");
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

import { beforeEach, describe, expect, it, vi } from "vitest";

// A fake alert_settings table with one row (or none), enough for the
// compare-and-set update and the follow-up read.
let row: Record<string, string | null> | null;
let failWith: string | null;

function from() {
  const filters: Array<[string, unknown]> = [];
  let patch: Record<string, string | null> | null = null;
  const matches = () =>
    row != null &&
    filters.every(([column, value]) => (column === "user_id" ? true : (row![column] ?? null) === value));
  const builder: Record<string, unknown> = {
    update(p: Record<string, string | null>) { patch = p; return builder; },
    select() { return builder; },
    eq(column: string, value: unknown) { filters.push([column, value]); return builder; },
    is(column: string, value: unknown) { filters.push([column, value]); return builder; },
    maybeSingle() {
      return Promise.resolve(failWith ? { data: null, error: { message: failWith } } : { data: row, error: null });
    },
    then(resolve: (v: unknown) => unknown) {
      if (failWith) return Promise.resolve({ data: null, error: { message: failWith } }).then(resolve);
      if (patch && matches()) {
        Object.assign(row!, patch);
        return Promise.resolve({ data: [{ user_id: "user-1" }], error: null }).then(resolve);
      }
      return Promise.resolve({ data: [], error: null }).then(resolve);
    },
  };
  return builder;
}
vi.mock("./supabase", () => ({ createServerClient: () => ({ from }) }));

beforeEach(() => {
  failWith = null;
  row = { last_flood_alert_at: "2026-01-01T00:00:00+00:00" };
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("claimCooldown", () => {
  it("wins when the cooldown still holds the value it read", async () => {
    const { claimCooldown } = await import("./notify");
    const claim = await claimCooldown("user-1", "last_flood_alert_at", "2026-01-01T00:00:00+00:00");
    expect(claim.claimed).toBe(true);
    expect(row?.last_flood_alert_at).toBe(claim.claimedAt);
  });

  it("loses when another evaluation already stamped a newer time", async () => {
    row = { last_flood_alert_at: new Date().toISOString() };
    const { claimCooldown } = await import("./notify");
    expect(await claimCooldown("user-1", "last_flood_alert_at", "2026-01-01T00:00:00+00:00")).toEqual({
      claimed: false,
      claimedAt: null,
    });
  });

  it("only one of two evaluations that read the same value wins", async () => {
    const { claimCooldown } = await import("./notify");
    const read = "2026-01-01T00:00:00+00:00";
    const [a, b] = [
      await claimCooldown("user-1", "last_flood_alert_at", read),
      await claimCooldown("user-1", "last_flood_alert_at", read),
    ];
    expect([a.claimed, b.claimed]).toEqual([true, false]);
  });

  it("fails open: sends when the stored value is the same moment in another format", async () => {
    const { claimCooldown } = await import("./notify");
    expect((await claimCooldown("user-1", "last_flood_alert_at", "2026-01-01T00:00:00.000Z")).claimed).toBe(true);
  });

  it("fails open with no settings row or a database error", async () => {
    const { claimCooldown } = await import("./notify");
    row = null;
    expect(await claimCooldown("user-1", "last_flood_alert_at", null)).toEqual({ claimed: true, claimedAt: null });
    row = { last_flood_alert_at: null };
    failWith = "connection reset";
    expect(await claimCooldown("user-1", "last_flood_alert_at", null)).toEqual({ claimed: true, claimedAt: null });
  });
});

describe("releaseCooldown", () => {
  it("puts back the previous value only if the claim is still there", async () => {
    const { releaseCooldown } = await import("./notify");
    row = { last_flood_alert_at: "2026-01-02T00:00:00.000Z" };
    await releaseCooldown("user-1", "last_flood_alert_at", "2026-01-02T00:00:00.000Z", "2026-01-01T00:00:00+00:00");
    expect(row.last_flood_alert_at).toBe("2026-01-01T00:00:00+00:00");

    row = { last_flood_alert_at: "2026-01-03T00:00:00.000Z" }; // someone else re-stamped it
    await releaseCooldown("user-1", "last_flood_alert_at", "2026-01-02T00:00:00.000Z", null);
    expect(row.last_flood_alert_at).toBe("2026-01-03T00:00:00.000Z");
  });
});

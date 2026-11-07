import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setQueryRunnerForTests } from "./db/client";

// A fake alert_settings row (or none) behind the query runner, enough for the
// compare-and-set update, the follow-up read and the release. Timestamps
// compare as instants, like timestamptz.
let row: Record<string, string | null> | null;
let failWith: string | null;

const sameInstant = (a: unknown, b: unknown) =>
  a == null || b == null ? a == null && b == null : Date.parse(String(a)) === Date.parse(String(b));

async function fakeRunner(text: string, params: readonly unknown[] = []): Promise<never[]> {
  if (failWith) throw new Error(failWith);
  const column = /"(last_[a-z_]+_at)"/.exec(text)?.[1];
  if (!column) throw new Error(`unexpected query: ${text}`);
  if (/^\s*update/i.test(text) && /returning user_id/.test(text)) {
    // claim: set column = $3 where column is not distinct from $2
    const [, previous, now] = params;
    if (row && sameInstant(row[column] ?? null, previous)) {
      row[column] = now as string;
      return [{ user_id: "user-1" }] as never[];
    }
    return [];
  }
  if (/^\s*update/i.test(text)) {
    // release: set column = $3 where column = $2
    const [, claimedAt, previous] = params;
    if (row && row[column] != null && sameInstant(row[column], claimedAt)) row[column] = previous as string | null;
    return [];
  }
  if (/^\s*select/i.test(text)) return (row ? [{ current: row[column] ?? null }] : []) as never[];
  throw new Error(`unexpected query: ${text}`);
}

beforeEach(() => {
  failWith = null;
  row = { last_flood_alert_at: "2026-01-01T00:00:00+00:00" };
  setQueryRunnerForTests(fakeRunner as never);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  setQueryRunnerForTests(null);
  vi.restoreAllMocks();
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

  it("sends when the stored value is the same moment in another format", async () => {
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

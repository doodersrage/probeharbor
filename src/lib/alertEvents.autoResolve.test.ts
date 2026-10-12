import { describe, expect, it, vi } from "vitest";

const calls: Array<{ op: string; args: unknown[] }> = [];
const updates: Array<{ values: Record<string, unknown>; id?: unknown }> = [];
function chain(result: unknown) {
  const c: Record<string, unknown> = {};
  for (const op of ["select", "eq", "is", "not", "limit", "in", "lt"]) {
    c[op] = (...args: unknown[]) => {
      calls.push({ op, args });
      return c;
    };
  }
  c.then = (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve);
  return c;
}
vi.mock("./supabase", () => ({
  createServerClient: () => ({
    from: () => ({
      select: (...args: unknown[]) => {
        calls.push({ op: "select", args });
        return chain({ data: [{ id: 7, meta: { probeLabel: "Garage" }, channels_sent: ["email", "push"] }], error: null });
      },
      update: (values: Record<string, unknown>) => {
        const u: { values: Record<string, unknown>; id?: unknown } = { values };
        updates.push(u);
        const c = chain({ error: null }) as Record<string, (...a: unknown[]) => unknown>;
        const eq = c.eq;
        c.eq = (col: unknown, val: unknown) => {
          if (col === "id") u.id = val;
          return eq(col, val);
        };
        return c;
      },
    }),
  }),
}));

describe("autoResolveAlerts", () => {
  it("closes only open, delivered alerts of the given kinds, keeping their details", async () => {
    const { autoResolveAlerts } = await import("./alertEvents");
    const result = await autoResolveAlerts("user-1", { kinds: ["threshold"], reason: "recovered" });
    expect(result).toEqual({ resolved: 1, channels: ["email", "push"] });
    expect(calls).toContainEqual({ op: "is", args: ["acknowledged_at", null] });
    expect(calls).toContainEqual({ op: "in", args: ["kind", ["threshold"]] });
    expect(updates[0]?.id).toBe(7);
    expect(updates[0]?.values.meta).toEqual({ probeLabel: "Garage", autoResolved: "recovered" });
    expect(typeof updates[0]?.values.acknowledged_at).toBe("string");
  });
});

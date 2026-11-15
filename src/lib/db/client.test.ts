import { describe, expect, it, vi } from "vitest";

const calls: unknown[][] = [];
vi.mock("@neondatabase/serverless", async (orig) => {
  const real = await orig<typeof import("@neondatabase/serverless")>();
  return {
    ...real,
    neon: () => ({
      query: async (...args: unknown[]) => {
        calls.push(args);
        return [];
      },
    }),
  };
});

import { neonRunner } from "./client";

describe("neonRunner", () => {
  it("passes the Supabase-shape type parsers on every query", async () => {
    await neonRunner("postgres://u:p@example.invalid/db")("select count(*) as n", [1]);
    const [text, params, options] = calls[0] as [
      string,
      unknown[],
      { types?: { getTypeParser: (oid: number) => (t: string) => unknown } },
    ];
    expect(text).toBe("select count(*) as n");
    expect(params).toEqual([1]);
    // The HTTP driver ignores neon(url, { types }) for .query(): without this, counts are strings
    // and timestamps are Date objects (checked against a Neon branch, 2026-11-07).
    const parse = options?.types?.getTypeParser;
    expect(parse?.(20)("12")).toBe(12); // bigint
    expect(parse?.(1082)("2026-11-07")).toBe("2026-11-07"); // date stays text
    expect(parse?.(1184)("2026-11-07 16:02:33.474049+00")).toBe("2026-11-07T16:02:33.474049+00:00"); // timestamptz
  });
});

describe("resolveDbTarget", () => {
  const env = (vars: Record<string, string>) => (k: string) => vars[k];
  const hd = { connectionString: "postgresql://hd.invalid/db" };

  it("is Neon over DATABASE_URL by default, with or without a binding", async () => {
    const { resolveDbTarget } = await import("./client");
    expect(resolveDbTarget(env({ DATABASE_URL: "postgresql://neon.invalid/db" }), hd)).toEqual({
      driver: "neon",
      url: "postgresql://neon.invalid/db",
    });
  });

  it("uses Hyperdrive only when DATABASE_DRIVER=hyperdrive and the binding exists", async () => {
    const { resolveDbTarget } = await import("./client");
    expect(
      resolveDbTarget(
        env({ DATABASE_DRIVER: " Hyperdrive ", DATABASE_URL: "postgresql://n/db" }),
        hd,
      ),
    ).toEqual({
      driver: "hyperdrive",
      connectionString: hd.connectionString,
    });
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(
      resolveDbTarget(
        env({ DATABASE_DRIVER: "hyperdrive", DATABASE_URL: "postgresql://n/db" }),
        undefined,
      ),
    ).toEqual({
      driver: "neon",
      url: "postgresql://n/db",
    });
    expect(err).toHaveBeenCalledWith(expect.stringContaining("no HYPERDRIVE binding"));
    err.mockRestore();
  });

  it("is null when nothing is configured", async () => {
    const { resolveDbTarget } = await import("./client");
    expect(resolveDbTarget(env({}), undefined)).toBeNull();
    expect(resolveDbTarget(env({ DATABASE_DRIVER: "hyperdrive" }), undefined)).toBeNull();
  });
});

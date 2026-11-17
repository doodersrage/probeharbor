import { describe, expect, it, vi } from "vitest";

const clients: Array<{ types?: { getTypeParser: (oid: number) => (t: string) => unknown } }> = [];
vi.mock("pg", async (orig) => {
  const real = await orig<typeof import("pg")>();
  class Client {
    constructor(options: (typeof clients)[number]) {
      clients.push(options);
    }
    async connect() {}
    async query() {
      return { rows: [] };
    }
    async end() {}
  }
  return { ...real, default: { ...real.default, Client } };
});

import { pgRunner } from "./client";

describe("pgRunner", () => {
  it("gives each client the app's type parsers (counts as numbers, dates as text)", async () => {
    await pgRunner("postgres://u:p@example.invalid/db")("select count(*) as n", [1]);
    const parse = clients[0]?.types?.getTypeParser;
    expect(parse?.(20)("12")).toBe(12); // bigint
    expect(parse?.(1082)("2026-11-07")).toBe("2026-11-07"); // date stays text
    expect(parse?.(1184)("2026-11-07 16:02:33.474049+00")).toBe("2026-11-07T16:02:33.474049+00:00"); // timestamptz
  });
});

describe("resolveDbTarget", () => {
  const env = (vars: Record<string, string>) => (k: string) => vars[k];
  const hd = { connectionString: "postgresql://hd.invalid/db" };

  it("connects straight to DATABASE_URL by default, with or without a binding", async () => {
    const { resolveDbTarget } = await import("./client");
    expect(resolveDbTarget(env({ DATABASE_URL: "postgresql://db.invalid/db" }), hd)).toEqual({
      via: "direct",
      connectionString: "postgresql://db.invalid/db",
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
      via: "hyperdrive",
      connectionString: hd.connectionString,
    });
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(
      resolveDbTarget(
        env({ DATABASE_DRIVER: "hyperdrive", DATABASE_URL: "postgresql://n/db" }),
        undefined,
      ),
    ).toEqual({
      via: "direct",
      connectionString: "postgresql://n/db",
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

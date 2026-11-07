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
    const [text, params, options] = calls[0] as [string, unknown[], { types?: { getTypeParser: (oid: number) => (t: string) => unknown } }];
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

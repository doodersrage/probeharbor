import { describe, expect, it } from "vitest";
import { useTestDatabase } from "../../test/db";
import { DbQueryError, query } from "./client";

useTestDatabase();

describe("query() result shapes match what Supabase returned", () => {
  it("timestamps are UTC text with microseconds, whatever the session zone", async () => {
    const [row] = await query<{ ts: string; d: string }>(
      "select '2026-11-07 13:22:38.104689+00'::timestamptz as ts, '2026-11-07'::date as d",
    );
    expect(row).toEqual({ ts: "2026-11-07T13:22:38.104689+00:00", d: "2026-11-07" });
  });

  it("count(*) and other bigint / numeric results are numbers", async () => {
    const [row] = await query<{ n: unknown; s: unknown; a: unknown }>(
      "select count(*) as n, sum(x::bigint) as s, avg(x) as a from (values (1), (2)) v(x)",
    );
    expect(row).toEqual({ n: 2, s: 3, a: 1.5 });
  });

  it("jsonb comes back as objects and parameters are bound, not spliced", async () => {
    const tricky = "x'); drop table public.groups; --";
    const [row] = await query<{ j: unknown; t: string }>("select $1::jsonb as j, $2::text as t", ['{"a":1}', tricky]);
    expect(row).toEqual({ j: { a: 1 }, t: tricky });
    const [groups] = await query<{ n: number }>("select count(*) as n from public.groups");
    expect(groups?.n).toBe(5);
  });
});

describe("query() errors", () => {
  it("name the statement and table but never the values", async () => {
    const secret = "very-secret-value";
    const error = await query("select * from public.no_such_table where x = $1", [secret]).catch((e) => e);
    expect(error).toBeInstanceOf(DbQueryError);
    expect(error.message).toMatch(/select public\.no_such_table/);
    expect(error.message).not.toContain(secret);
  });
});

import { describe, expect, it, vi } from "vitest";
import { fetchNewestFirstPages, PAGE_ROWS } from "./pagedRows";

/** A fake table of `total` rows (ids 0 = oldest), served newest first in ranges. */
function table(total: number) {
  const newestFirst = Array.from({ length: total }, (_, i) => ({ id: total - 1 - i }));
  return vi.fn(async (from: number, to: number) => ({ data: newestFirst.slice(from, to + 1), error: null }));
}

describe("fetchNewestFirstPages", () => {
  it("reads every page past 1000 rows and returns them oldest first", async () => {
    const fetchPage = table(2880);
    const result = await fetchNewestFirstPages(fetchPage);
    expect(fetchPage.mock.calls).toEqual([
      [0, 999],
      [1000, 1999],
      [2000, 2999],
    ]);
    expect(result.rows).toHaveLength(2880);
    expect(result.rows[0]).toEqual({ id: 0 });
    expect(result.rows.at(-1)).toEqual({ id: 2879 });
    expect(result.capped).toBe(false);
  });

  it("keeps the newest rows when the page cap is hit", async () => {
    const result = await fetchNewestFirstPages(table(5000), 2);
    expect(result.capped).toBe(true);
    expect(result.rows).toHaveLength(2 * PAGE_ROWS);
    expect(result.rows.at(-1)).toEqual({ id: 4999 });
    expect(result.rows[0]).toEqual({ id: 3000 });
  });

  it("stops after one short page", async () => {
    const fetchPage = table(10);
    const result = await fetchNewestFirstPages(fetchPage);
    expect(fetchPage).toHaveBeenCalledTimes(1);
    expect(result.rows.map((r) => r.id)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("returns the error and no rows when a page fails", async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce({ data: Array.from({ length: PAGE_ROWS }, () => ({})), error: null })
      .mockResolvedValueOnce({ data: null, error: { message: "timeout" } });
    expect(await fetchNewestFirstPages(fetchPage)).toEqual({ rows: [], error: "timeout", capped: false });
  });
});

/** PostgREST returns at most this many rows per request (`max_rows`, 1000 by default). */
export const PAGE_ROWS = 1000;

type PageResult<T> = PromiseLike<{ data: T[] | null; error: { message: string } | null }>;

/**
 * Read a time series past the 1000-row limit. `fetchPage(from, to)` must
 * return rows ordered newest first for the given range. Pages are read
 * until a short page or `maxPages`; if the cap is hit, the newest rows are
 * the ones kept (a chart should never stop short of "now"). Returns rows
 * oldest first.
 */
export async function fetchNewestFirstPages<T>(
  fetchPage: (from: number, to: number) => PageResult<T>,
  maxPages = 10,
): Promise<{ rows: T[]; error: string | null; capped: boolean }> {
  const newestFirst: T[] = [];
  for (let page = 0; page < maxPages; page += 1) {
    const from = page * PAGE_ROWS;
    const { data, error } = await fetchPage(from, from + PAGE_ROWS - 1);
    if (error) return { rows: [], error: error.message, capped: false };
    const rows = data ?? [];
    newestFirst.push(...rows);
    if (rows.length < PAGE_ROWS) return { rows: newestFirst.reverse(), error: null, capped: false };
  }
  return { rows: newestFirst.reverse(), error: null, capped: true };
}

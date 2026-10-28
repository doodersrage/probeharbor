/**
 * Shared chart images live under this prefix in the HISTORY_ARCHIVE bucket,
 * next to household history archives. Anything that reads or deletes a
 * chart-share object by its stored key must check the prefix first, so a
 * bad `r2_key` row can never reach an archive.
 */
export const CHART_SHARE_PREFIX = "chart-shares/";

export function chartShareKey(token: string): string {
  return `${CHART_SHARE_PREFIX}${token}.png`;
}

export function isChartShareKey(key: unknown): key is string {
  return (
    typeof key === "string" &&
    key.startsWith(CHART_SHARE_PREFIX) &&
    !key.slice(CHART_SHARE_PREFIX.length).includes("/") &&
    !key.includes("..")
  );
}

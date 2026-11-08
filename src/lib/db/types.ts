/**
 * Postgres → JavaScript value conversion for the Neon database path.
 *
 * The app was written against the JSON shapes Supabase (PostgREST) returned
 * before the move. Postgres drivers return different ones by default (Date
 * objects, bigint as text). These parsers keep the old shapes, so callers
 * read results the same way:
 *
 * | Postgres type | Driver default    | Here (= the old PostgREST shape)        |
 * | timestamptz   | Date (ms only)    | "2026-11-07T13:22:38.104689+00:00"      |
 * | timestamp     | Date              | "2026-11-07T13:22:38.104689"            |
 * | date          | Date (local time) | "2026-11-07"                            |
 * | bigint        | "12" (text)       | 12                                       |
 * | numeric       | "1.5" (text)      | 1.5 (count/sum/avg results)             |
 *
 * Timestamps keep microseconds: readings use them for ordering and dedupe, and
 * a JS Date would cut them to milliseconds.
 */

/** Postgres type ids (pg_type.oid). */
export const PG_OID = {
  int8: 20,
  date: 1082,
  timestamp: 1114,
  timestamptz: 1184,
  numeric: 1700,
} as const;

const TIMESTAMP_TEXT = /^(\d{4,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,6})?(?:([+-])(\d{2})(?::?(\d{2}))?(?::?(\d{2}))?)?( BC)?$/;

/**
 * Postgres timestamptz text ("2026-11-07 08:22:38.1+00", any session time
 * zone) → UTC ISO string in PostgREST's style. Values it can't parse
 * (infinity, BC dates) are returned unchanged rather than guessed at.
 */
export function parseTimestamptz(text: string): string {
  const m = TIMESTAMP_TEXT.exec(text);
  if (!m || m[12] || m[8] == null) return text;
  const [, y, mo, d, h, mi, s, frac = "", sign, oh, om = "00", os = "00"] = m;
  const offsetSeconds = (sign === "-" ? -1 : 1) * (Number(oh) * 3600 + Number(om) * 60 + Number(os));
  const utcMs =
    Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s)) - offsetSeconds * 1000;
  const utc = new Date(utcMs);
  if (Number.isNaN(utc.getTime())) return text;
  const iso = utc.toISOString(); // whole seconds, since utcMs has no fraction
  return `${iso.slice(0, 19)}${frac}+00:00`;
}

/** Postgres timestamp (no zone) text → "YYYY-MM-DDTHH:MM:SS[.ffffff]". */
export function parseTimestamp(text: string): string {
  return TIMESTAMP_TEXT.test(text) && !text.endsWith(" BC") ? text.replace(" ", "T") : text;
}

/** bigint / numeric text → number, as PostgREST's JSON did. Non-finite text stays text. */
export function parseNumber(text: string): number | string {
  const n = Number(text);
  return Number.isFinite(n) ? n : text;
}

const identity = (text: string) => text;

const PARSERS: Record<number, (text: string) => unknown> = {
  [PG_OID.int8]: parseNumber,
  [PG_OID.numeric]: parseNumber,
  [PG_OID.date]: identity,
  [PG_OID.timestamp]: parseTimestamp,
  [PG_OID.timestamptz]: parseTimestamptz,
};

/**
 * Wrap a driver's default `getTypeParser` with ours. Works with both pg and
 * @neondatabase/serverless, which share pg's types interface.
 */
export function makeGetTypeParser(
  fallback: (oid: number, format?: "text" | "binary") => unknown,
): (oid: number, format?: "text" | "binary") => unknown {
  return (oid, format = "text") => (format === "text" && PARSERS[oid]) || fallback(oid, format);
}

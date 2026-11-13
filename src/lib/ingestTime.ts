/**
 * Device-supplied reading times for push ingest.
 *
 * Without `recorded_at`, a reading is stamped with the time the server
 * received it (the behaviour before this existed). With it, the reading keeps
 * the time the device measured it, so a device can buffer readings while
 * Wi-Fi or the server is down and send them later, and a retry after a lost
 * reply doesn't store the reading twice.
 *
 * Accepted forms: an ISO 8601 string with a time zone (`Z` or `±hh:mm`), or
 * Unix seconds as a number. Times more than {@link MAX_READING_AGE_MS} old or
 * {@link MAX_FUTURE_SKEW_MS} ahead of the server are rejected, not clamped:
 * a wrong clock must not put readings at the wrong place in history.
 */

/** Oldest accepted reading: covers a weekend outage. */
export const MAX_READING_AGE_MS = 72 * 60 * 60 * 1000;

/** Device clocks may run a little ahead of the server's. */
export const MAX_FUTURE_SKEW_MS = 5 * 60 * 1000;

/** Most readings in one `readings` batch. */
export const MAX_BATCH_READINGS = 100;

export type RecordedAtProblem =
  | "invalid_recorded_at"
  | "recorded_at_too_old"
  | "recorded_at_in_future";

export type ParsedRecordedAt =
  | { ok: true; iso: string }
  | { ok: false; reason: RecordedAtProblem };

const ZONED_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})$/i;

/** Parse and range-check one `recorded_at` value against `nowMs`. */
export function parseRecordedAt(value: unknown, nowMs: number): ParsedRecordedAt {
  let ms: number;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return { ok: false, reason: "invalid_recorded_at" };
    ms = value * 1000;
  } else if (typeof value === "string") {
    const trimmed = value.trim();
    // A string without a zone would be read in whatever zone parses it.
    if (!ZONED_ISO.test(trimmed)) return { ok: false, reason: "invalid_recorded_at" };
    ms = Date.parse(trimmed);
    if (Number.isNaN(ms)) return { ok: false, reason: "invalid_recorded_at" };
  } else {
    return { ok: false, reason: "invalid_recorded_at" };
  }
  if (ms < nowMs - MAX_READING_AGE_MS) return { ok: false, reason: "recorded_at_too_old" };
  // Milliseconds sent as seconds land here too, far in the future.
  if (ms > nowMs + MAX_FUTURE_SKEW_MS) return { ok: false, reason: "recorded_at_in_future" };
  return { ok: true, iso: new Date(ms).toISOString() };
}

/** One payload's worth of readings and the time they were measured. */
export type IngestEntry = {
  /** One payload in any accepted shape (object, or a SenML array). */
  payload: unknown;
  recordedAt: string;
  /** True when the device sent the time; false when the server stamped it. */
  deviceTime: boolean;
};

export type RejectedEntry = {
  /** Position in `readings`; 0 for a single (non-batch) payload. */
  index: number;
  reason: RecordedAtProblem | "invalid_entry";
};

export type SplitIngestBody =
  | { ok: true; batch: boolean; entries: IngestEntry[]; rejectedEntries: RejectedEntry[] }
  | { ok: false; error: string; rejectedEntries?: RejectedEntry[] };

/**
 * Split a push body into timed entries.
 *
 * - Single payload (no `readings` array): one entry, stamped with
 *   `recorded_at` when present and valid, otherwise with the server time.
 *   An invalid `recorded_at` fails the request rather than guessing.
 * - Batch (`readings` array): each item is a normal payload that must carry
 *   its own `recorded_at`. Bad items are listed and skipped; the rest are
 *   stored. Device fields (`fw`, `rssi`, `battery_pct`) stay at the top level.
 */
export function splitIngestBody(body: unknown, nowMs: number): SplitIngestBody {
  const serverTime = new Date(nowMs).toISOString();
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    // Passed through as is: a top-level array is SenML, which the interpreter
    // reads; anything else finds no sensor values there.
    return { ok: true, batch: false, entries: [{ payload: body, recordedAt: serverTime, deviceTime: false }], rejectedEntries: [] };
  }
  const top = body as Record<string, unknown>;

  if (!Array.isArray(top.readings)) {
    if (top.recorded_at === undefined || top.recorded_at === null) {
      return { ok: true, batch: false, entries: [{ payload: top, recordedAt: serverTime, deviceTime: false }], rejectedEntries: [] };
    }
    const parsed = parseRecordedAt(top.recorded_at, nowMs);
    if (!parsed.ok) {
      return { ok: false, error: "Invalid recorded_at", rejectedEntries: [{ index: 0, reason: parsed.reason }] };
    }
    return { ok: true, batch: false, entries: [{ payload: top, recordedAt: parsed.iso, deviceTime: true }], rejectedEntries: [] };
  }

  const items = top.readings;
  if (items.length === 0) return { ok: false, error: "readings is empty" };
  if (items.length > MAX_BATCH_READINGS) {
    return { ok: false, error: `Too many readings in one batch (max ${MAX_BATCH_READINGS})` };
  }

  const entries: IngestEntry[] = [];
  const rejectedEntries: RejectedEntry[] = [];
  items.forEach((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      rejectedEntries.push({ index, reason: "invalid_entry" });
      return;
    }
    const payload = item as Record<string, unknown>;
    const parsed = parseRecordedAt(payload.recorded_at, nowMs);
    if (!parsed.ok) {
      rejectedEntries.push({ index, reason: parsed.reason });
      return;
    }
    entries.push({ payload, recordedAt: parsed.iso, deviceTime: true });
  });
  return { ok: true, batch: true, entries, rejectedEntries };
}

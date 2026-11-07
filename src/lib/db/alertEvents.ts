/**
 * Neon versions of the alert-event queries in src/lib/alertEvents.ts (the
 * Alerts log, acknowledgement, auto-resolve, and the "unhandled" count).
 * Called when `dbBackend() === "neon"`. Every query is scoped to one user.
 *
 * "Unhandled" is one SQL fragment shared by the count, the lists and the
 * acknowledge / auto-resolve updates, built from the same kind lists as
 * isUnhandledAlertEvent, so they can't drift apart.
 *
 * Differences from the Supabase path, all deliberate:
 * - Acknowledge-all, acknowledge-latest and auto-resolve select and update in
 *   one statement; counts are the rows actually updated (Supabase: rows
 *   selected first, then updated one by one or as a batch).
 * - Meta merges happen in the database, so two writers can't drop each
 *   other's keys.
 * - Ties on created_at are ordered by id.
 */
import type { AlertEventMeta, AlertEventRow } from "../alertEvents";
import { query } from "./client";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

/** Alert rows match these; $kindsParam must hold [informationalKinds, safetyKinds]. */
export function unhandledSql(informationalParam: string, safetyParam: string): string {
  return `acknowledged_at is null
    and not (kind = any(${informationalParam}::text[]))
    and (cardinality(channels_sent) > 0 or kind = any(${safetyParam}::text[]))`;
}

/** Shallow-merge a JSON patch into meta (non-object meta counts as {}). */
const MERGE_META = (patchParam: string) =>
  `(case when jsonb_typeof(meta) = 'object' then meta else '{}'::jsonb end) || ${patchParam}::jsonb`;

const asMeta = (raw: unknown): AlertEventMeta =>
  raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as AlertEventMeta) : {};

const withMeta = (row: AlertEventRow): AlertEventRow => ({ ...row, meta: asMeta(row.meta) });

export async function recordAlertEvent(input: {
  userId: string;
  kind: string;
  title: string;
  body: string;
  channelsSent: string[];
  channelsSkipped: string[];
  meta?: AlertEventMeta;
}): Promise<number | null> {
  try {
    const [row] = await query<{ id: number }>(
      `insert into public.alert_events (user_id, kind, title, body, channels_sent, channels_skipped, meta)
       values ($1, $2, $3, $4, $5::text[], $6::text[], $7::jsonb) returning id`,
      [input.userId, input.kind, input.title, input.body, input.channelsSent, input.channelsSkipped, JSON.stringify(input.meta ?? {})],
    );
    return row?.id ?? null;
  } catch (error) {
    console.error("Failed to record alert event:", message(error));
    return null;
  }
}

/** Merge into the user's event; "not found" when it isn't theirs. */
export async function updateAlertEventMeta(
  userId: string,
  eventId: number,
  patch: AlertEventMeta,
  notFound: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const rows = await query(
      `update public.alert_events set meta = ${MERGE_META("$3")}
       where id = $1 and user_id = $2 returning id`,
      [eventId, userId, JSON.stringify(patch)],
    );
    return rows.length > 0 ? { ok: true } : { ok: false, error: notFound };
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}

export async function updateAlertEventChannels(
  eventId: number,
  userId: string,
  channelsSent: string[],
  channelsSkipped: string[],
): Promise<void> {
  try {
    await query(
      `update public.alert_events set channels_sent = $3::text[], channels_skipped = $4::text[]
       where id = $1 and user_id = $2`,
      [eventId, userId, channelsSent, channelsSkipped],
    );
  } catch (error) {
    console.error("Failed to update alert event channels:", message(error));
  }
}

export async function acknowledgeAlertEvent(userId: string, eventId: number): Promise<{ ok: boolean; error?: string }> {
  try {
    await query(
      "update public.alert_events set acknowledged_at = now() where id = $1 and user_id = $2 and acknowledged_at is null",
      [eventId, userId],
    );
    return { ok: true };
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}

export async function acknowledgeLatestUnackedAlert(
  userId: string,
  informational: readonly string[],
  safety: readonly string[],
  noneMessage: string,
): Promise<{ ok: boolean; eventId?: number; error?: string }> {
  try {
    const [row] = await query<{ id: number }>(
      `update public.alert_events set acknowledged_at = now()
       where id = (
         select id from public.alert_events
         where user_id = $1 and ${unhandledSql("$2", "$3")}
         order by created_at desc, id desc limit 1
       ) and acknowledged_at is null
       returning id`,
      [userId, informational, safety],
    );
    return row ? { ok: true, eventId: row.id } : { ok: false, error: noneMessage };
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}

export async function acknowledgeAllUnackedAlerts(
  userId: string,
  limit: number,
  informational: readonly string[],
  safety: readonly string[],
  noneMessage: string,
): Promise<{ ok: boolean; count: number; error?: string }> {
  try {
    const rows = await query(
      `update public.alert_events set acknowledged_at = now()
       where id in (
         select id from public.alert_events
         where user_id = $1 and ${unhandledSql("$2", "$3")}
         order by created_at desc, id desc limit $4
       ) and user_id = $1 and acknowledged_at is null
       returning id`,
      [userId, informational, safety, limit],
    );
    return rows.length > 0 ? { ok: true, count: rows.length } : { ok: false, count: 0, error: noneMessage };
  } catch (error) {
    return { ok: false, count: 0, error: message(error) };
  }
}

/** Close up to 200 unhandled alerts (optionally of some kinds / older than a cutoff). */
export async function autoResolveAlerts(
  userId: string,
  informational: readonly string[],
  safety: readonly string[],
  options: { kinds?: string[]; olderThanIso?: string; reason: "recovered" | "expired" },
): Promise<{ resolved: number; channels: string[] }> {
  const params: unknown[] = [userId, informational, safety, JSON.stringify({ autoResolved: options.reason })];
  let extra = "";
  if (options.kinds?.length) {
    params.push(options.kinds);
    extra += ` and kind = any($${params.length}::text[])`;
  }
  if (options.olderThanIso) {
    params.push(options.olderThanIso);
    extra += ` and created_at < $${params.length}`;
  }
  try {
    const rows = await query<{ channels_sent: string[] }>(
      `update public.alert_events set acknowledged_at = now(), meta = ${MERGE_META("$4")}
       where id in (
         select id from public.alert_events
         where user_id = $1 and ${unhandledSql("$2", "$3")}${extra}
         limit 200
       ) and acknowledged_at is null
       returning channels_sent`,
      params,
    );
    return { resolved: rows.length, channels: [...new Set(rows.flatMap((r) => r.channels_sent ?? []))] };
  } catch {
    return { resolved: 0, channels: [] }; // as the Supabase path: a failure resolves nothing
  }
}

export async function listRecentAlertEventsFiltered(
  userId: string,
  informational: readonly string[],
  safety: readonly string[],
  options: { limit: number; offset: number; kind?: string | null; kinds?: readonly string[] | null; unackedOnly?: boolean },
): Promise<{ events: AlertEventRow[]; hasMore: boolean }> {
  const params: unknown[] = [userId];
  const clauses = ["user_id = $1"];
  if (options.kind?.trim()) {
    params.push(`%${options.kind.trim()}%`);
    clauses.push(`kind ilike $${params.length}`);
  }
  if (options.kinds?.length) {
    params.push([...options.kinds]);
    clauses.push(`kind = any($${params.length}::text[])`);
  }
  if (options.unackedOnly) {
    params.push(informational, safety);
    clauses.push(unhandledSql(`$${params.length - 1}`, `$${params.length}`));
  }
  params.push(options.limit + 1, options.offset);
  try {
    const rows = await query<AlertEventRow>(
      `select * from public.alert_events where ${clauses.join(" and ")}
       order by created_at desc, id desc limit $${params.length - 1} offset $${params.length}`,
      params,
    );
    return { events: rows.slice(0, options.limit).map(withMeta), hasMore: rows.length > options.limit };
  } catch {
    return { events: [], hasMore: false };
  }
}

export async function getAlertEventForUser(userId: string, eventId: number): Promise<AlertEventRow | null> {
  try {
    const [row] = await query<AlertEventRow>("select * from public.alert_events where user_id = $1 and id = $2", [
      userId,
      eventId,
    ]);
    return row ? withMeta(row) : null;
  } catch {
    return null;
  }
}

export async function listRecentAlertEvents(userId: string, limit: number): Promise<AlertEventRow[]> {
  try {
    const rows = await query<AlertEventRow>(
      "select * from public.alert_events where user_id = $1 order by created_at desc, id desc limit $2",
      [userId, limit],
    );
    return rows.map(withMeta);
  } catch {
    return [];
  }
}

export async function listRecentDeliveryAttempts(
  userId: string,
  limit: number,
): Promise<Array<Pick<AlertEventRow, "created_at" | "channels_sent" | "channels_skipped">>> {
  try {
    return await query(
      `select created_at, channels_sent, channels_skipped from public.alert_events
       where user_id = $1 order by created_at desc, id desc limit $2`,
      [userId, limit],
    );
  } catch {
    return [];
  }
}

export async function listAlertEventsInRange(
  userId: string,
  fromIso: string,
  toIso: string,
  limit: number,
): Promise<AlertEventRow[]> {
  try {
    return await query<AlertEventRow>(
      `select * from public.alert_events
       where user_id = $1 and created_at >= $2 and created_at <= $3
       order by created_at, id limit $4`,
      [userId, fromIso, toIso, limit],
    );
  } catch {
    return [];
  }
}

export async function hasDeliveredAnyAlert(userId: string): Promise<boolean> {
  try {
    const rows = await query(
      "select 1 from public.alert_events where user_id = $1 and cardinality(channels_sent) > 0 limit 1",
      [userId],
    );
    return rows.length > 0;
  } catch {
    return false;
  }
}

export async function hasUnhandledAlertOfKinds(
  userId: string,
  kinds: readonly string[],
  informational: readonly string[],
  safety: readonly string[],
): Promise<boolean> {
  try {
    const rows = await query(
      `select 1 from public.alert_events
       where user_id = $1 and ${unhandledSql("$2", "$3")} and kind = any($4::text[]) limit 1`,
      [userId, informational, safety, [...kinds]],
    );
    return rows.length > 0;
  } catch {
    return false;
  }
}

/** Throws on failure; the caller reports it (a failed count must not read as "nothing unhandled"). */
export async function countUnacknowledgedAlerts(
  userId: string,
  informational: readonly string[],
  safety: readonly string[],
): Promise<number> {
  const [row] = await query<{ n: number }>(
    `select count(*) as n from public.alert_events where user_id = $1 and ${unhandledSql("$2", "$3")}`,
    [userId, informational, safety],
  );
  return row?.n ?? 0;
}

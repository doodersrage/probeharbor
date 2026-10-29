import type { DeviceSensor, DeviceWithSensors } from "./devices";
import { escapeCsvField } from "./csvEscape";
import { applySensorOffset } from "./sensorCalibration";
import { clampIsoToHistoryWindow } from "./retentionSchedule";
import { createServerClient } from "./supabase";

/**
 * Door event report: each saved open/close session with the temperature and
 * humidity at the moment the door opened and when it closed.
 *
 * How the numbers are worked out (shown to users, keep in sync with copy):
 * - Each door is compared with one temperature and one humidity sensor: the
 *   first visible one on the door's own device, otherwise on another device
 *   in the same space. No match → no comparison (never a guess).
 * - "At open" / "at close" is that sensor's latest reading at or before the
 *   moment, if it is at most 30 minutes old. Otherwise the value is missing.
 * - Change = at close − at open. Calibration offsets are applied, as on the
 *   rest of the dashboard. Values are measurements, not estimates; the
 *   change only covers the readings nearest those two moments.
 */

/** Oldest reading still counted as "at" a moment. */
export const READING_MAX_AGE_SECONDS = 30 * 60;
/** Most events shown on the History "Doors" tab (newest first). */
export const DOOR_REPORT_LIMIT = 500;
/** Most events in one CSV; more than this and the export asks for fewer days. */
export const DOOR_CSV_LIMIT = 5000;
/** PostgREST returns at most 1000 rows per request (`max_rows`), so page through. */
const EVENTS_PER_PAGE = 1000;
/** Times sent per database call (the function caps it at 2000). */
const TIMES_PER_CALL = 1000;

export type DoorEventRecord = {
  id: string;
  sensorId: string | null;
  label: string;
  openedAt: string;
  closedAt: string;
  durationMs: number;
};

export type PairedSensor = {
  id: string;
  label: string;
  offset: number;
  /** "device": on the door's own device; "space": another device in the same space. */
  match: "device" | "space";
};

export type DoorPairing = { temperature: PairedSensor | null; humidity: PairedSensor | null };

export type MeasuredPair = { atOpen: number | null; atClose: number | null; change: number | null };

export type DoorReportRow = DoorEventRecord & {
  temperatureSensor: PairedSensor | null;
  humiditySensor: PairedSensor | null;
  /** °F. */
  temperature: MeasuredPair;
  /** % RH. */
  humidity: MeasuredPair;
};

const normalizeSpace = (space: string | null | undefined) => space?.trim().toLowerCase() || null;

function pickSensor(devices: DeviceWithSensors[], kind: "temperature" | "humidity"): DeviceSensor | null {
  for (const device of [...devices].sort((a, b) => a.sort_order - b.sort_order)) {
    const sensor = device.sensors
      .filter((s) => s.kind === kind && s.visible)
      .sort((a, b) => a.sort_order - b.sort_order)[0];
    if (sensor) return sensor;
  }
  return null;
}

function toPaired(sensor: DeviceSensor | null, match: PairedSensor["match"]): PairedSensor | null {
  return sensor ? { id: sensor.id, label: sensor.label, offset: sensor.offset_num ?? 0, match } : null;
}

/** Door sensor id → the temperature and humidity sensors it is compared with. */
export function pairDoorSensors(devices: DeviceWithSensors[]): Map<string, DoorPairing> {
  const pairs = new Map<string, DoorPairing>();
  for (const device of devices) {
    const space = normalizeSpace(device.space);
    const sameSpace = space
      ? devices.filter((d) => d.id !== device.id && normalizeSpace(d.space) === space)
      : [];
    for (const door of device.sensors.filter((s) => s.kind === "door")) {
      const pairing: DoorPairing = { temperature: null, humidity: null };
      for (const kind of ["temperature", "humidity"] as const) {
        const own = pickSensor([device], kind);
        pairing[kind] = own ? toPaired(own, "device") : toPaired(pickSensor(sameSpace, kind), "space");
      }
      pairs.set(door.id, pairing);
    }
  }
  return pairs;
}

/** Closed door sessions that opened in [fromIso, toIso], newest first. */
export async function listDoorEventsForReport(
  householdId: string,
  fromIso: string,
  toIso: string,
  limit = DOOR_REPORT_LIMIT,
  /** Only this door (its label); omitted = every door. */
  doorLabel?: string | null,
): Promise<{ events: DoorEventRecord[]; truncated: boolean; error: string | null }> {
  const supabase = createServerClient();
  type Row = {
    id: string;
    sensor_id: string | null;
    label: string;
    opened_at: string;
    closed_at: string | null;
    duration_ms: number | null;
  };
  const rows: Row[] = [];
  // One row past the limit tells us there are more.
  const wanted = limit + 1;
  while (rows.length < wanted) {
    const start = rows.length;
    const end = Math.min(start + EVENTS_PER_PAGE, wanted) - 1;
    const { data, error } = await supabase
      .from("door_open_events")
      .select("id, sensor_id, label, opened_at, closed_at, duration_ms")
      .eq("household_id", householdId)
      .gte("opened_at", fromIso)
      .lte("opened_at", toIso)
      .not("closed_at", "is", null)
      .match(doorLabel ? { label: doorLabel } : {})
      // id breaks ties so pages never skip or repeat a row.
      .order("opened_at", { ascending: false })
      .order("id", { ascending: true })
      .range(start, end);
    if (error) return { events: [], truncated: false, error: error.message };
    const page = (data ?? []) as Row[];
    rows.push(...page);
    if (page.length < end - start + 1) break;
  }
  const closedRows = rows.filter((row) => typeof row.closed_at === "string");
  const events = closedRows.slice(0, limit).map((row) => ({
    id: row.id as string,
    sensorId: (row.sensor_id as string | null) ?? null,
    label: row.label as string,
    openedAt: row.opened_at as string,
    closedAt: row.closed_at as string,
    durationMs:
      typeof row.duration_ms === "number"
        ? row.duration_ms
        : Date.parse(row.closed_at as string) - Date.parse(row.opened_at as string),
  }));
  return { events, truncated: closedRows.length > limit, error: null };
}

/** `${sensorId}@${epoch ms}` → raw value (no offset). */
export type ValuesBefore = Map<string, number>;
export const valueKey = (sensorId: string, iso: string) => `${sensorId}@${Date.parse(iso)}`;

/** Latest reading at or before each time, for each sensor (one call per 1000 times). */
export async function fetchValuesBefore(
  householdId: string,
  sensorIds: string[],
  times: string[],
): Promise<{ values: ValuesBefore; error: string | null }> {
  const values: ValuesBefore = new Map();
  const ids = [...new Set(sensorIds)];
  const uniqueTimes = [...new Set(times)];
  if (ids.length === 0 || uniqueTimes.length === 0) return { values, error: null };
  if (ids.length > 50) return { values, error: "too many sensors to compare" };

  const supabase = createServerClient();
  for (let i = 0; i < uniqueTimes.length; i += TIMES_PER_CALL) {
    const { data, error } = await supabase.rpc("sensor_values_before", {
      p_household_id: householdId,
      p_sensor_ids: ids,
      p_times: uniqueTimes.slice(i, i + TIMES_PER_CALL),
      p_max_age_seconds: READING_MAX_AGE_SECONDS,
    });
    if (error) return { values, error: error.message };
    for (const row of data ?? []) {
      if (typeof row.value_num !== "number" || !Number.isFinite(row.value_num)) continue;
      // Postgres echoes the time as "+00:00"; key by epoch ms, not text.
      values.set(valueKey(row.sensor_id, row.at_time), row.value_num);
    }
  }
  return { values, error: null };
}

function measure(sensor: PairedSensor | null, event: DoorEventRecord, values: ValuesBefore): MeasuredPair {
  if (!sensor) return { atOpen: null, atClose: null, change: null };
  const read = (iso: string) => {
    const raw = values.get(valueKey(sensor.id, iso));
    return raw == null ? null : applySensorOffset(raw, sensor.offset);
  };
  const atOpen = read(event.openedAt);
  const atClose = read(event.closedAt);
  return { atOpen, atClose, change: atOpen != null && atClose != null ? atClose - atOpen : null };
}

/** Find the door sensor for an event: by id, or by label for rows saved without one. */
function doorPairingFor(
  event: DoorEventRecord,
  pairs: Map<string, DoorPairing>,
  doorIdByLabel: Map<string, string>,
): DoorPairing | null {
  const id = event.sensorId ?? doorIdByLabel.get(event.label) ?? null;
  return id ? (pairs.get(id) ?? null) : null;
}

export function buildDoorReportRows(
  events: DoorEventRecord[],
  devices: DeviceWithSensors[],
  values: ValuesBefore,
): DoorReportRow[] {
  const pairs = pairDoorSensors(devices);
  const doorIdByLabel = new Map<string, string>();
  for (const device of devices) {
    for (const s of device.sensors) if (s.kind === "door") doorIdByLabel.set(s.label, s.id);
  }
  return events.map((event) => {
    const pairing = doorPairingFor(event, pairs, doorIdByLabel);
    const temperatureSensor = pairing?.temperature ?? null;
    const humiditySensor = pairing?.humidity ?? null;
    return {
      ...event,
      temperatureSensor,
      humiditySensor,
      temperature: measure(temperatureSensor, event, values),
      humidity: measure(humiditySensor, event, values),
    };
  });
}

/** Events → rows with readings, in as few database calls as possible. */
export async function loadDoorReport(
  householdId: string,
  devices: DeviceWithSensors[],
  fromIso: string,
  toIso: string,
  limit = DOOR_REPORT_LIMIT,
  doorLabel?: string | null,
): Promise<{ rows: DoorReportRow[]; truncated: boolean; error: string | null; readingsError: string | null }> {
  const listed = await listDoorEventsForReport(householdId, fromIso, toIso, limit, doorLabel);
  if (listed.error) return { rows: [], truncated: false, error: listed.error, readingsError: null };

  const pairs = pairDoorSensors(devices);
  const sensorIds = [...pairs.values()].flatMap((p) => [p.temperature?.id, p.humidity?.id]).filter(
    (id): id is string => Boolean(id),
  );
  const times = listed.events.flatMap((e) => [e.openedAt, e.closedAt]);
  const fetched = await fetchValuesBefore(householdId, sensorIds, times);
  return {
    rows: buildDoorReportRows(listed.events, devices, fetched.values),
    truncated: listed.truncated,
    error: null,
    readingsError: fetched.error,
  };
}

export type DoorReportSummary = {
  openings: number;
  totalOpenMs: number;
  doors: string[];
  /** Mean temperature change (°F) over openings that have both readings; null when none. */
  avgTemperatureChange: number | null;
  temperatureSamples: number;
  avgHumidityChange: number | null;
  humiditySamples: number;
};

export function summarizeDoorReport(rows: DoorReportRow[]): DoorReportSummary {
  const mean = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : null);
  const temps = rows.map((r) => r.temperature.change).filter((v): v is number => v != null);
  const hums = rows.map((r) => r.humidity.change).filter((v): v is number => v != null);
  return {
    openings: rows.length,
    totalOpenMs: rows.reduce((sum, r) => sum + Math.max(0, r.durationMs), 0),
    doors: [...new Set(rows.map((r) => r.label))],
    avgTemperatureChange: mean(temps),
    temperatureSamples: temps.length,
    avgHumidityChange: mean(hums),
    humiditySamples: hums.length,
  };
}

const csvNum = (value: number | null, digits: number) => (value == null ? "" : value.toFixed(digits));

/** CSV with UTC ISO times; °F and % RH; empty cell = no reading (never 0). */
export function buildDoorEventsCsv(rows: DoorReportRow[]): string {
  const headers = [
    "door",
    "opened_at_utc",
    "closed_at_utc",
    "open_minutes",
    "temperature_sensor",
    "temperature_sensor_match",
    "temp_at_open_f",
    "temp_at_close_f",
    "temp_change_f",
    "humidity_sensor",
    "humidity_sensor_match",
    "humidity_at_open_pct",
    "humidity_at_close_pct",
    "humidity_change_pct",
  ];
  const lines = rows.map((row) =>
    [
      row.label,
      row.openedAt,
      row.closedAt,
      (row.durationMs / 60000).toFixed(1),
      row.temperatureSensor?.label ?? "",
      row.temperatureSensor?.match ?? "",
      csvNum(row.temperature.atOpen, 1),
      csvNum(row.temperature.atClose, 1),
      csvNum(row.temperature.change, 1),
      row.humiditySensor?.label ?? "",
      row.humiditySensor?.match ?? "",
      csvNum(row.humidity.atOpen, 1),
      csvNum(row.humidity.atClose, 1),
      csvNum(row.humidity.change, 1),
    ]
      .map(escapeCsvField)
      .join(","),
  );
  return [headers.join(","), ...lines].join("\n");
}

/** The door filter if it names one of the household's door sensors; otherwise every door. */
export function validDoorFilter(raw: string | null | undefined, devices: DeviceWithSensors[]): string | null {
  const wanted = raw?.trim();
  if (!wanted) return null;
  return doorSensorLabels(devices).includes(wanted) ? wanted : null;
}

/** The household's door sensor labels, alphabetical, each once. */
export function doorSensorLabels(devices: DeviceWithSensors[]): string[] {
  const labels = devices.flatMap((d) => d.sensors.filter((s) => s.kind === "door").map((s) => s.label));
  return [...new Set(labels)].sort((a, b) => a.localeCompare(b));
}

/**
 * The report window, shared by the History "Doors" tab and the CSV so both
 * cover the same events. `from`/`to` are whole days (YYYY-MM-DD) in the
 * browser's zone; without `from`, the last `days` (7, 30 or 90). Never
 * starts before the plan's history window.
 */
export function doorReportRange(
  params: { from?: string | null; to?: string | null; days?: number | null },
  historyDays: number,
  dayStartIso: (day: string) => string | null,
  dayEndIso: (day: string) => string | null,
  now = new Date(),
): { fromIso: string; toIso: string } {
  const days = params.days === 90 ? 90 : params.days === 30 ? 30 : 7;
  const fromDay = params.from?.trim() ? dayStartIso(params.from.trim()) : null;
  const toDay = params.to?.trim() ? dayEndIso(params.to.trim()) : null;
  const fallbackFrom = new Date(now.getTime() - Math.min(days, historyDays) * 24 * 60 * 60 * 1000).toISOString();
  const fromIso = clampIsoToHistoryWindow(fromDay ?? fallbackFrom, historyDays, now);
  return { fromIso, toIso: toDay ?? now.toISOString() };
}

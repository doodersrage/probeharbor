import type { DeviceWithSensors } from "./devices";
import type { LatestSensorRow } from "./sensorReadings";
import type { ThermostatSnapshot } from "./thermostatCorrelation";
import {
  formatThermostatMetricDetail,
  formatThermostatMetricValue,
} from "./thermostatCorrelation";
import { findReferenceSensorLabel } from "./indoorReference";
import type { ChartPoint } from "./garageTempsHistory";
import { fetchThermostatSnapshotChartPoints } from "./thermostatSnapshots";
import { fetchNewestFirstPages } from "./pagedRows";
import { fmt, type Locale } from "../i18n";
import { libFixed, libTextMessages } from "../i18n/messages/app/libText";

export type HouseContext = {
  source: "thermostat" | "reference_sensor";
  ambientTempF: number;
  metricValue: string;
  metricDetail: string | null;
  referenceLabel: string | null;
  thermostatSnapshot: ThermostatSnapshot | null;
};

export function resolveReferenceSensorTempF(
  sensorId: string | null,
  latest: LatestSensorRow[],
): number | null {
  if (!sensorId) return null;
  const row = latest.find(
    (reading) =>
      reading.sensor.id === sensorId &&
      reading.value_num != null &&
      Number.isFinite(reading.value_num),
  );
  return row?.value_num ?? null;
}

export function buildHouseContext(input: {
  thermostatSnapshot: ThermostatSnapshot | null;
  referenceSensorId: string | null;
  latest: LatestSensorRow[];
  devices: DeviceWithSensors[];
}, locale: Locale = "en"): HouseContext | null {
  if (input.thermostatSnapshot?.ambientTempF != null) {
    const ambientTempF = input.thermostatSnapshot.ambientTempF;
    return {
      source: "thermostat",
      ambientTempF,
      metricValue: formatThermostatMetricValue(input.thermostatSnapshot, locale),
      metricDetail: formatThermostatMetricDetail(input.thermostatSnapshot, locale),
      referenceLabel: null,
      thermostatSnapshot: input.thermostatSnapshot,
    };
  }

  const referenceTempF = resolveReferenceSensorTempF(
    input.referenceSensorId,
    input.latest,
  );
  if (referenceTempF == null) return null;

  const referenceLabel = findReferenceSensorLabel(
    input.devices,
    input.referenceSensorId,
  );

  return {
    source: "reference_sensor",
    ambientTempF: referenceTempF,
    metricValue: `${libFixed(referenceTempF, 0, locale)}°F`,
    metricDetail: referenceLabel
      ? fmt(libTextMessages(locale).house.fromReference, { label: referenceLabel })
      : libTextMessages(locale).house.indoorReference,
    referenceLabel,
    thermostatSnapshot: null,
  };
}

/** Aim for about this many points: PostgREST returns at most 1000 rows, function results included. */
const REFERENCE_TARGET_POINTS = 900;

/** Bucket width (seconds) so [from, to] comes out near `target` points; at least a minute. */
export function bucketSecondsFor(fromIso: string, toIso: string, target = REFERENCE_TARGET_POINTS): number {
  const spanSec = Math.max(0, (Date.parse(toIso) - Date.parse(fromIso)) / 1000);
  return Math.max(60, Math.ceil(spanSec / target));
}

/** null when the bucket function isn't available (or fails): the caller falls back to raw rows. */
async function fetchReferenceSensorBuckets(
  supabase: ReturnType<typeof import("./supabase").createServerClient>,
  householdId: string,
  sensorId: string,
  fromIso: string,
  toIso: string | undefined,
  locale: Locale,
): Promise<ChartPoint[] | null> {
  const to = toIso ?? new Date().toISOString();
  const { data: sensor } = await supabase
    .from("device_sensors")
    .select("label, kind")
    .eq("id", sensorId)
    .maybeSingle();
  if (sensor && sensor.kind !== "temperature") return [];
  const { data, error } = await supabase.rpc("sensor_bucket_averages", {
    p_household_id: householdId,
    p_sensor_ids: [sensorId],
    p_from: fromIso,
    p_to: to,
    p_bucket_seconds: bucketSecondsFor(fromIso, to),
  });
  if (error) {
    console.warn("sensor_bucket_averages unavailable, reading raw rows:", error.message);
    return null;
  }
  const label = (sensor?.label as string | undefined) ?? libTextMessages(locale).house.house;
  return (data ?? [])
    .filter((row) => typeof row.avg_num === "number" && Number.isFinite(row.avg_num))
    .map((row) => ({ timestamp: row.bucket_start, tempf: row.avg_num, humidity: null, probeLabel: label }));
}

export async function fetchReferenceSensorChartPoints(
  householdId: string,
  sensorId: string,
  days: number,
  filters: { from?: string; to?: string } = {},
  locale: Locale = "en",
): Promise<ChartPoint[]> {
  const supabase = (await import("./supabase")).createServerClient();
  const defaultFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const from = filters.from ?? defaultFrom;

  // Preferred: averages per time bucket in one call (sensor_bucket_averages,
  // migration 20261029180000), so a sensor reporting every minute still
  // covers the whole window.
  const bucketed = await fetchReferenceSensorBuckets(supabase, householdId, sensorId, from, filters.to, locale);
  if (bucketed) return bucketed;

  // Fallback (function not there yet): page through, newest first, so the line never stops short of now.
  const { rows, error, capped } = await fetchNewestFirstPages((start, end) => {
    let query = supabase
      .from("sensor_readings")
      .select(
        `
      recorded_at,
      value_num,
      device_sensors!inner (
        id,
        label,
        kind
      )
    `,
      )
      .eq("household_id", householdId)
      .eq("device_sensors.id", sensorId)
      .eq("device_sensors.kind", "temperature")
      .gte("recorded_at", from);
    if (filters.to) query = query.lte("recorded_at", filters.to);
    return query.order("recorded_at", { ascending: false }).range(start, end);
  });
  if (error) {
    console.error("fetchReferenceSensorChartPoints failed:", error);
    return [];
  }
  if (capped) console.warn(`House reference chart for household ${householdId}: row cap hit; oldest readings not shown`);

  return rows
    .map((row): ChartPoint | null => {
      const label =
        (row.device_sensors as { label?: string } | null)?.label ?? libTextMessages(locale).house.house;
      const tempf = row.value_num;
      if (tempf == null || !Number.isFinite(tempf)) return null;
      return {
        timestamp: row.recorded_at,
        tempf,
        // Reference sensors here are temperature-only.
        humidity: null,
        probeLabel: label,
      };
    })
    .filter((point): point is ChartPoint => point != null);
}

export async function fetchHouseChartOverlay(input: {
  householdId: string;
  days: number;
  hasThermostatConnection: boolean;
  referenceSensorId: string | null;
  filters?: { from?: string; to?: string };
}, locale: Locale = "en"): Promise<{ points: ChartPoint[]; source: "thermostat" | "reference" | null }> {
  if (input.hasThermostatConnection) {
    const points = await fetchThermostatSnapshotChartPoints(
      input.householdId,
      input.days,
      input.filters ?? {},
      locale,
    );
    if (points.length >= 2) {
      return { points, source: "thermostat" };
    }
  }

  if (input.referenceSensorId) {
    const points = await fetchReferenceSensorChartPoints(
      input.householdId,
      input.referenceSensorId,
      input.days,
      input.filters ?? {},
      locale,
    );
    if (points.length >= 2) {
      return { points, source: "reference" };
    }
  }

  return { points: [], source: null };
}

export async function fetchHouseContextForUser(
  userId: string,
  locale: Locale = "en",
): Promise<HouseContext | null> {
  const { getUserHouseholdId } = await import("./households");
  const { getUserEntitlements } = await import("./entitlements");
  const { listConnectionsForHousehold } = await import("./thermostatConnections");
  const { fetchThermostatContextWithStatus } = await import("./thermostatCorrelation");
  const { getIndoorReferenceSensorId } = await import("./indoorReference");
  const { fetchLatestSensorValues } = await import("./sensorReadings");
  const { listHouseholdDevices } = await import("./devices");

  const householdId = await getUserHouseholdId(userId);
  if (!householdId) return null;

  const entitlements = await getUserEntitlements(userId);
  let thermostatSnapshot: ThermostatSnapshot | null = null;
  if (entitlements.canUseThermostatIntegration) {
    const connections = await listConnectionsForHousehold(householdId);
    const connection = connections[0];
    if (connection) {
      const result = await fetchThermostatContextWithStatus(
        householdId,
        connection.provider,
        locale,
      );
      thermostatSnapshot = result.snapshot;
    }
  }

  const [referenceSensorId, latest, devicesResult] = await Promise.all([
    getIndoorReferenceSensorId(householdId),
    fetchLatestSensorValues(householdId),
    listHouseholdDevices(householdId),
  ]);

  return buildHouseContext({
    thermostatSnapshot,
    referenceSensorId,
    latest,
    devices: devicesResult.devices,
  }, locale);
}

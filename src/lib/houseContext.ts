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
import { fmt, type Locale } from "../i18n";
import { libFixed, libTextMessages } from "../i18n/messages/app/libText";
import { tempUnitLabel, toDisplayTemp } from "./temperatureFormat";

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
}, locale: Locale = "en", useCelsius = false): HouseContext | null {
  // useCelsius only changes metricValue/metricDetail text; ambientTempF stays °F.
  if (input.thermostatSnapshot?.ambientTempF != null) {
    const ambientTempF = input.thermostatSnapshot.ambientTempF;
    return {
      source: "thermostat",
      ambientTempF,
      metricValue: formatThermostatMetricValue(input.thermostatSnapshot, locale, useCelsius),
      metricDetail: formatThermostatMetricDetail(input.thermostatSnapshot, locale, useCelsius),
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
    metricValue: `${libFixed(toDisplayTemp(referenceTempF, useCelsius), 0, locale)}${tempUnitLabel(useCelsius)}`,
    metricDetail: referenceLabel
      ? fmt(libTextMessages(locale).house.fromReference, { label: referenceLabel })
      : libTextMessages(locale).house.indoorReference,
    referenceLabel,
    thermostatSnapshot: null,
  };
}

/** Aim for about this many points per chart line. */
const REFERENCE_TARGET_POINTS = 900;

/** Bucket width (seconds) so [from, to] comes out near `target` points; at least a minute. */
export function bucketSecondsFor(fromIso: string, toIso: string, target = REFERENCE_TARGET_POINTS): number {
  const spanSec = Math.max(0, (Date.parse(toIso) - Date.parse(fromIso)) / 1000);
  return Math.max(60, Math.ceil(spanSec / target));
}

export async function fetchReferenceSensorChartPoints(
  householdId: string,
  sensorId: string,
  days: number,
  filters: { from?: string; to?: string } = {},
  locale: Locale = "en",
): Promise<ChartPoint[]> {
  const defaultFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const from = filters.from ?? defaultFrom;
  const neonPlaces = await import("./db/places");
  const to = filters.to ?? new Date().toISOString();
  try {
    const sensor = await neonPlaces.householdSensor(householdId, sensorId);
    if (sensor && sensor.kind !== "temperature") return [];
    const label = sensor?.label ?? libTextMessages(locale).house.house;
    // Averages per time bucket, so a sensor reporting every minute still covers the whole window.
    const rows = await neonPlaces.sensorBucketAverages(householdId, sensorId, from, to, bucketSecondsFor(from, to));
    return rows
      .filter((row) => typeof row.avg_num === "number" && Number.isFinite(row.avg_num))
      .map((row) => ({ timestamp: row.bucket_start, tempf: row.avg_num as number, humidity: null, probeLabel: label }));
  } catch (error) {
    console.error("fetchReferenceSensorChartPoints failed:", error instanceof Error ? error.message : error);
    return [];
  }
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

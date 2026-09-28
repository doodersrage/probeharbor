/**
 * Seven days of the public demo shop, rebuilt from real hourly weather: the
 * same probe model as the live demo tiles, run over Open-Meteo's past week.
 */
import type { ChartPoint } from "./garageTempsHistory";
import { computeDemoProbes, defaultDemoControls } from "./probeDemo";
import { deriveSunIntensity } from "./weatherSimulatedFeed";

export type HourlyWeather = {
  /** UTC epoch ms. */
  atMs: number;
  /** Hour of day at the location (0–24). */
  localHour: number;
  tempf: number;
  cloudCover: number;
};

/** Open-Meteo forecast payload (timezone=auto) → hourly rows in UTC. */
export function parseOpenMeteoDemoHourly(payload: unknown, nowMs = Date.now()): HourlyWeather[] {
  if (!payload || typeof payload !== "object") return [];
  const body = payload as {
    utc_offset_seconds?: number;
    hourly?: { time?: string[]; temperature_2m?: number[]; cloud_cover?: Array<number | null> };
  };
  const offsetSec = Number(body.utc_offset_seconds ?? 0);
  const times = body.hourly?.time ?? [];
  const temps = body.hourly?.temperature_2m ?? [];
  const clouds = body.hourly?.cloud_cover ?? [];
  const rows: HourlyWeather[] = [];
  for (let i = 0; i < times.length; i += 1) {
    const local = times[i];
    const tempf = Number(temps[i]);
    if (typeof local !== "string" || !Number.isFinite(tempf)) continue;
    // Local wall time without a zone: parse as UTC, then remove the offset.
    const localMs = Date.parse(`${local}Z`);
    if (!Number.isFinite(localMs)) continue;
    const atMs = localMs - offsetSec * 1000;
    if (atMs > nowMs) continue;
    const localDate = new Date(localMs);
    rows.push({
      atMs,
      localHour: localDate.getUTCHours() + localDate.getUTCMinutes() / 60,
      tempf,
      // Missing hours come back as null, and Number(null) would read as clear sky.
      cloudCover: typeof clouds[i] === "number" && Number.isFinite(clouds[i]) ? clouds[i]! : 40,
    });
  }
  return rows;
}

/** One chart point per probe per hour, door closed (the live tiles add brief door-open blips). */
export function buildDemoHistoryPoints(hourly: HourlyWeather[]): ChartPoint[] {
  const points: ChartPoint[] = [];
  for (const hour of hourly) {
    const sunIntensity = deriveSunIntensity(
      { cloudCover: hour.cloudCover },
      new Date(hour.atMs),
      hour.localHour,
    );
    const probes = computeDemoProbes({
      ...defaultDemoControls,
      outdoorF: hour.tempf,
      sunIntensity,
      doorOpen: false,
    });
    const timestamp = new Date(hour.atMs).toISOString();
    for (const probe of probes) {
      points.push({
        timestamp,
        tempf: probe.reading.f,
        humidity: probe.reading.h,
        probeLabel: probe.label,
      });
    }
  }
  return points;
}

/** Outdoor temperature as its own series, for context under the probe curves. */
export function outdoorHistoryPoints(hourly: HourlyWeather[]): ChartPoint[] {
  return hourly.map((hour) => ({
    timestamp: new Date(hour.atMs).toISOString(),
    tempf: Math.round(hour.tempf * 10) / 10,
    humidity: 0,
    probeLabel: "Outdoor",
  }));
}

export async function fetchDemoHourlyWeather(lat: number, lon: number): Promise<HourlyWeather[]> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: "temperature_2m,cloud_cover",
    temperature_unit: "fahrenheit",
    timezone: "auto",
    past_days: "7",
    forecast_days: "1",
  });
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) return [];
    return parseOpenMeteoDemoHourly(await response.json());
  } catch {
    return [];
  }
}

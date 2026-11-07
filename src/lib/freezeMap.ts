import * as neonPlaces from "./db/places";
import { fetchLatestSensorValues } from "./sensorReadings";
import {
  freezeMapAggregateKey,
  getWeatherPresetLabel,
  uniqueWeatherCityPresets,
} from "./weatherCities";
import { getWeatherPresetCoords } from "./weatherCityCoords";

export type FreezeMapSnapshot = {
  city_id: string;
  city_label: string;
  sample_count: number;
  avg_temp_f: number | null;
  min_temp_f: number | null;
  freeze_risk_count: number;
  captured_at: string;
  lat: number | null;
  lon: number | null;
  /** True when falling back to illustrative seed cities (not live opt-ins). */
  isSeed?: boolean;
};

export type FreezeMapHouseholdSettings = {
  optIn: boolean;
  cityId: string | null;
  lat: number | null;
  lon: number | null;
  label: string | null;
};

function cityLabelFromId(cityId: string): string {
  return getWeatherPresetLabel(cityId) ?? `City ${cityId}`;
}

export async function updateHouseholdFreezeMapSettings(
  householdId: string,
  settings: FreezeMapHouseholdSettings,
): Promise<{ error: string | null }> {
  const cityId =
    settings.cityId && /^\d+$/.test(settings.cityId) ? settings.cityId : null;
  return neonPlaces.updateFreezeMapSettings(householdId, {
    optIn: settings.optIn,
    cityId,
    lat: settings.lat,
    lon: settings.lon,
    label: settings.label?.trim() || null,
  });
}

export async function getHouseholdFreezeMapSettings(
  householdId: string,
): Promise<FreezeMapHouseholdSettings> {
  const data = await neonPlaces.getFreezeMapSettings(householdId);

  if (!data) {
    return { optIn: false, cityId: null, lat: null, lon: null, label: null };
  }

  return {
    optIn: data.freeze_map_opt_in === true,
    cityId: data.freeze_map_city_id,
    lat: data.freeze_map_lat,
    lon: data.freeze_map_lon,
    label: data.freeze_map_label,
  };
}

/** Count households currently opted into the public freeze map. */
export async function countFreezeMapOptIns(): Promise<number> {
  return neonPlaces.countOptIns();
}

export async function collectFreezeMapSnapshots(): Promise<{
  cities: number;
  error: string | null;
}> {
  let households: Awaited<ReturnType<typeof neonPlaces.optedInHouseholds>>;
  try {
    households = await neonPlaces.optedInHouseholds();
  } catch (loadError) {
    return { cities: 0, error: loadError instanceof Error ? loadError.message : String(loadError) };
  }

  type Acc = {
    city_id: string;
    city_label: string;
    lat: number | null;
    lon: number | null;
    temps: number[];
    freeze_risk_count: number;
  };
  const byCity = new Map<string, Acc>();

  for (const household of households) {
    const key = freezeMapAggregateKey({
      cityId: household.freeze_map_city_id,
      lat: household.freeze_map_lat,
      lon: household.freeze_map_lon,
    });
    if (!key) continue;

    const lat =
      household.freeze_map_lat ??
      parseGeoKeyLat(key) ??
      getWeatherPresetCoords(household.freeze_map_city_id)?.lat ??
      null;
    const lon =
      household.freeze_map_lon ??
      parseGeoKeyLon(key) ??
      getWeatherPresetCoords(household.freeze_map_city_id)?.lon ??
      null;

    const latest = await fetchLatestSensorValues(household.id);
    const temps = latest
      .filter((r) => r.sensor.kind === "temperature" && r.value_num != null)
      .map((r) => r.value_num as number);
    if (temps.length === 0) continue;

    const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
    const min = Math.min(...temps);
    const label =
      household.freeze_map_label?.trim() ||
      (household.freeze_map_city_id
        ? cityLabelFromId(household.freeze_map_city_id)
        : key);
    const entry = byCity.get(key) ?? {
      city_id: key,
      city_label: label,
      lat,
      lon,
      temps: [],
      freeze_risk_count: 0,
    };
    if (lat != null && entry.lat == null) entry.lat = lat;
    if (lon != null && entry.lon == null) entry.lon = lon;
    entry.temps.push(avg);
    if (min <= 34) entry.freeze_risk_count += 1;
    byCity.set(key, entry);
  }

  const capturedAt = new Date().toISOString();
  const rows = [...byCity.values()].map((entry) => {
    const avg =
      entry.temps.reduce((a, b) => a + b, 0) / Math.max(entry.temps.length, 1);
    return {
      city_id: entry.city_id,
      city_label: entry.city_label,
      lat: entry.lat,
      lon: entry.lon,
      sample_count: entry.temps.length,
      avg_temp_f: avg,
      min_temp_f: Math.min(...entry.temps),
      freeze_risk_count: entry.freeze_risk_count,
      captured_at: capturedAt,
    };
  });

  if (rows.length > 0) {
    try {
      await neonPlaces.insertSnapshots(rows);
    } catch (insertError) {
      return { cities: 0, error: insertError instanceof Error ? insertError.message : String(insertError) };
    }
  }

  await pruneFreezeMapSnapshots(90);

  return { cities: rows.length, error: null };
}

/** Delete freeze-map snapshots older than retainDays (default 90). */
export async function pruneFreezeMapSnapshots(
  retainDays = 90,
): Promise<{ deleted: number; error: string | null }> {
  const cutoff = new Date(
    Date.now() - Math.max(1, retainDays) * 24 * 60 * 60 * 1000,
  ).toISOString();
  return neonPlaces.pruneSnapshots(cutoff);
}

export async function listLatestFreezeMapSnapshots(): Promise<FreezeMapSnapshot[]> {
  let data: Awaited<ReturnType<typeof neonPlaces.recentSnapshots>>;
  try {
    data = await neonPlaces.recentSnapshots(400);
  } catch {
    return [];
  }

  const latestCapture = data[0]?.captured_at;
  const batch = latestCapture
    ? data.filter((row) => row.captured_at === latestCapture)
    : data;

  return [...batch].sort(
    (a, b) => (a.avg_temp_f ?? 999) - (b.avg_temp_f ?? 999),
  ) as FreezeMapSnapshot[];
}

/** Last N avg temps per city for sparklines (oldest → newest). */
export async function listFreezeMapSparklines(
  limitPoints = 7,
): Promise<Map<string, number[]>> {
  const map = new Map<string, number[]>();
  let data: Awaited<ReturnType<typeof neonPlaces.recentSnapshots>>;
  try {
    data = await neonPlaces.recentSnapshots(800);
  } catch {
    return map;
  }

  for (const row of data) {
    if (row.avg_temp_f == null) continue;
    const list = map.get(row.city_id) ?? [];
    if (list.length >= limitPoints) continue;
    list.push(row.avg_temp_f);
    map.set(row.city_id, list);
  }

  for (const [key, values] of map) {
    map.set(key, [...values].reverse());
  }
  return map;
}

export { uniqueWeatherCityPresets };

function parseGeoKeyLat(key: string): number | null {
  const match = /^geo:([-\d.]+),/.exec(key);
  if (!match) return null;
  const lat = Number(match[1]);
  return Number.isFinite(lat) ? lat : null;
}

function parseGeoKeyLon(key: string): number | null {
  const match = /^geo:[-\d.]+,([-\d.]+)$/.exec(key);
  if (!match) return null;
  const lon = Number(match[1]);
  return Number.isFinite(lon) ? lon : null;
}

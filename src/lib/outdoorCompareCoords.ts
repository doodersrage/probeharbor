import { getHouseholdFields } from "./householdRecord";
import type { User } from "./appUser";
import { fetchWeatherSnapshotForConfig, getPersonalWeatherConfig } from "./weatherContext";
import { getUserHouseholdId } from "./households";

export type OutdoorCompareCoords = {
  lat: number;
  lon: number;
  label: string;
};

async function freezeMapCoordsForHousehold(
  householdId: string,
): Promise<OutdoorCompareCoords | null> {
  const { data, error } = (await getHouseholdFields(householdId, ["freeze_map_lat", "freeze_map_lon", "freeze_map_label"])) as {
    data: { freeze_map_lat: number | null; freeze_map_lon: number | null; freeze_map_label: string | null } | null;
    error: string | null;
  };

  if (error || !data) return null;

  const lat = data.freeze_map_lat;
  const lon = data.freeze_map_lon;
  if (lat == null || lon == null || !Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  const label = data.freeze_map_label?.trim() || "Freeze map location";
  return { lat, lon, label };
}

/** Lat/lon for outdoor YoY fallback: live weather source, then household freeze map. */
export async function resolveOutdoorCompareCoords(
  userId: string,
  user?: User | null,
): Promise<OutdoorCompareCoords | null> {
  if (user) {
    const snapshot = await fetchWeatherSnapshotForConfig(getPersonalWeatherConfig(user));
    if (snapshot?.lat != null && snapshot.lon != null) {
      return {
        lat: snapshot.lat,
        lon: snapshot.lon,
        label: snapshot.name?.trim() || "Weather location",
      };
    }
  }

  const householdId = await getUserHouseholdId(userId);
  if (!householdId) return null;

  return freezeMapCoordsForHousehold(householdId);
}

import { latestSnapshotForCity } from "./db/places";
import { getHouseholdFields } from "./householdRecord";
import { freezeMapAggregateKey } from "./weatherCities";
import { FREEZE_MAP_SAMPLE_FLOOR } from "./freezeMapSeed";
import { fmt, type Locale } from "../i18n";
import { libFixed, libTextMessages } from "../i18n/messages/app/libText";

export type RegionalBenchmark = {
  cityLabel: string;
  cityAvgTempF: number | null;
  yourTempF: number;
  deltaF: number | null;
  message: string;
};

/** Compare household coldest probe to opt-in regional freeze-map aggregate. */
export async function fetchRegionalBenchmark(input: {
  householdId: string;
  yourTempF: number;
}, locale: Locale = "en"): Promise<RegionalBenchmark | null> {
  if (!Number.isFinite(input.yourTempF)) return null;

  const { data: household } = (await getHouseholdFields(input.householdId, [
    "freeze_map_city_id",
    "freeze_map_label",
    "freeze_map_opt_in",
  ])) as { data: { freeze_map_city_id: string | null; freeze_map_label: string | null; freeze_map_opt_in: boolean } | null };

  if (!household?.freeze_map_opt_in || !household.freeze_map_city_id) {
    return null;
  }

  const cityId = freezeMapAggregateKey({
    cityId: household.freeze_map_city_id,
    lat: null,
    lon: null,
  });
  if (!cityId) return null;

  const snapshot = await latestSnapshotForCity(cityId);

  if (!snapshot?.avg_temp_f && snapshot?.min_temp_f == null) {
    return null;
  }
  // Same floor as the public freeze map: with one or two households the "city
  // average" is mostly this household, and would expose a neighbor's readings.
  if ((snapshot.sample_count ?? 0) < FREEZE_MAP_SAMPLE_FLOOR) {
    return null;
  }

  const cityAvg = snapshot.avg_temp_f ?? snapshot.min_temp_f;
  if (cityAvg == null || !Number.isFinite(cityAvg)) return null;

  const deltaF = input.yourTempF - cityAvg;
  // `cityLabel` stays "your region" in English (RegionalBenchmarkCard checks it); only the message is translated.
  const cityLabel = snapshot.city_label ?? household.freeze_map_label ?? "your region";
  const t = libTextMessages(locale).benchmark;
  const city = snapshot.city_label ?? household.freeze_map_label ?? t.yourRegion;
  const abs = libFixed(Math.abs(deltaF), 1, locale);

  let message: string;
  if (Math.abs(deltaF) < 1.5) {
    message = fmt(t.typical, { city });
  } else if (deltaF < 0) {
    message = fmt(t.colder, { delta: abs, city });
  } else {
    message = fmt(t.warmer, { delta: abs, city });
  }

  return {
    cityLabel,
    cityAvgTempF: cityAvg,
    yourTempF: input.yourTempF,
    deltaF,
    message,
  };
}

export function formatBenchmarkAlertSuffix(benchmark: RegionalBenchmark | null): string | null {
  return benchmark?.message ?? null;
}

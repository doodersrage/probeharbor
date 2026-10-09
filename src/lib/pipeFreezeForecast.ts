/**
 * Night-by-night pipe freeze outlook from the National Weather Service hourly
 * forecast (public domain, US only). Powers the public /pipe-freeze-forecast
 * tool. Thresholds follow the sourced guidance already on the site: outdoor
 * lows around 20°F are the commonly cited danger point for pipes in unheated
 * spaces (University of Illinois research, via /answers/garage-pipe-freeze-temperature),
 * and long or windy nights below 32°F can still freeze exposed pipes.
 */

export type NwsHourlyPeriod = {
  startTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit?: string;
  windSpeed?: string;
  shortForecast?: string;
};

export type FreezeRisk = "low" | "watch" | "high";

export type FreezeNight = {
  /** Local calendar date the night starts on (YYYY-MM-DD). */
  date: string;
  lowF: number;
  /** Local ISO time of the lowest hour. */
  lowAt: string;
  hoursAtOrBelow32: number;
  hoursAtOrBelow20: number;
  /** Strongest wind during hours at or below 32°F, if any. */
  maxFreezingWindMph: number | null;
  /** The following daytime never climbs above 32°F. */
  staysBelowFreezingNextDay: boolean;
  risk: FreezeRisk;
};

export const HIGH_RISK_LOW_F = 20;
export const FREEZING_F = 32;
/** Wind at or above this during freezing hours gets called out. */
export const WINDY_MPH = 15;

function toF(period: NwsHourlyPeriod): number {
  return period.temperatureUnit === "C" ? (period.temperature * 9) / 5 + 32 : period.temperature;
}

/** "10 mph" or "5 to 15 mph" -> the larger number. */
export function parseWindMph(windSpeed: string | undefined): number | null {
  if (!windSpeed) return null;
  const numbers = windSpeed.match(/\d+(\.\d+)?/g)?.map(Number) ?? [];
  if (numbers.length === 0) return null;
  const mph = Math.max(...numbers);
  return /km\/h/i.test(windSpeed) ? Math.round(mph * 0.621371) : mph;
}

export function riskForNight(lowF: number): FreezeRisk {
  if (lowF <= HIGH_RISK_LOW_F) return "high";
  if (lowF <= FREEZING_F) return "watch";
  return "low";
}

/**
 * Group hourly periods into nights (runs of isDaytime=false) and summarize
 * each. A leading partial night (forecast starts after dark) counts as tonight.
 */
export function summarizeFreezeNights(periods: NwsHourlyPeriod[], maxNights = 5): FreezeNight[] {
  const nights: FreezeNight[] = [];
  let i = 0;
  while (i < periods.length && nights.length < maxNights) {
    if (periods[i]!.isDaytime) {
      i += 1;
      continue;
    }
    const start = i;
    while (i < periods.length && !periods[i]!.isDaytime) i += 1;
    const hours = periods.slice(start, i);
    const nextDay: NwsHourlyPeriod[] = [];
    let j = i;
    while (j < periods.length && periods[j]!.isDaytime) nextDay.push(periods[j++]!);

    let low = hours[0]!;
    for (const hour of hours) if (toF(hour) < toF(low)) low = hour;
    const freezing = hours.filter((hour) => toF(hour) <= FREEZING_F);
    const winds = freezing.map((hour) => parseWindMph(hour.windSpeed)).filter((w): w is number => w != null);
    const lowF = Math.round(toF(low));

    nights.push({
      date: hours[0]!.startTime.slice(0, 10),
      lowF,
      lowAt: low.startTime,
      hoursAtOrBelow32: freezing.length,
      hoursAtOrBelow20: hours.filter((hour) => toF(hour) <= HIGH_RISK_LOW_F).length,
      maxFreezingWindMph: winds.length ? Math.max(...winds) : null,
      staysBelowFreezingNextDay:
        nextDay.length >= 6 && nextDay.every((hour) => toF(hour) <= FREEZING_F),
      risk: riskForNight(lowF),
    });
  }
  return nights;
}

const RISK_ORDER: Record<FreezeRisk, number> = { low: 0, watch: 1, high: 2 };

export function worstRisk(nights: FreezeNight[]): FreezeRisk {
  return nights.reduce<FreezeRisk>(
    (worst, night) => (RISK_ORDER[night.risk] > RISK_ORDER[worst] ? night.risk : worst),
    "low",
  );
}

/** One plain sentence per night, shown under its card. */
export function describeFreezeNight(night: FreezeNight): string {
  const parts: string[] = [];
  if (night.risk === "high") {
    parts.push(
      `Low of ${night.lowF}°F, at or below the 20°F mark where pipes in unheated garages, crawlspaces, and attics are commonly at risk.`,
    );
  } else if (night.risk === "watch") {
    parts.push(
      `Below freezing for about ${night.hoursAtOrBelow32} hour${night.hoursAtOrBelow32 === 1 ? "" : "s"}, low ${night.lowF}°F. Exposed pipes on exterior walls, near garage doors, or in vented crawlspaces can still freeze on a long or windy night.`,
    );
  } else {
    parts.push(`Stays above freezing (low ${night.lowF}°F).`);
  }
  if (night.maxFreezingWindMph != null && night.maxFreezingWindMph >= WINDY_MPH) {
    parts.push(`Wind up to ${night.maxFreezingWindMph} mph while below freezing pulls heat from exposed pipes faster.`);
  }
  if (night.staysBelowFreezingNextDay) {
    parts.push("The next day stays below freezing too, so unheated spaces won't warm back up.");
  }
  return parts.join(" ");
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** iframe plus a plain attribution link: links inside an iframe don't count for the host page. */
export function embedSnippet(origin: string, place: { label: string; lat: number; lon: number }): string {
  const params = new URLSearchParams({
    lat: place.lat.toFixed(3),
    lon: place.lon.toFixed(3),
    place: place.label,
  });
  return [
    `<iframe src="${origin}/embed/pipe-freeze?${params.toString().replace(/&/g, "&amp;")}" title="Pipe freeze forecast for ${escapeAttr(place.label)}" width="100%" height="200" style="border:0" loading="lazy"></iframe>`,
    `<p><a href="${origin}/pipe-freeze-forecast">Pipe freeze forecast</a> by ProbeHarbor</p>`,
  ].join("\n");
}

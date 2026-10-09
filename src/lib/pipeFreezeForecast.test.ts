import { describe, expect, it } from "vitest";
import {
  describeFreezeNight,
  embedSnippet,
  parseWindMph,
  riskForNight,
  summarizeFreezeNights,
  worstRisk,
  type NwsHourlyPeriod,
} from "./pipeFreezeForecast";

/** Hourly periods starting at `startHour` local on 2026-01-10, one per entry. */
function hours(temps: number[], opts: { startHour?: number; wind?: string } = {}): NwsHourlyPeriod[] {
  const start = Date.UTC(2026, 0, 10, opts.startHour ?? 12);
  return temps.map((temperature, i) => {
    const at = new Date(start + i * 3_600_000);
    const hour = at.getUTCHours();
    return {
      startTime: `${at.toISOString().slice(0, 19)}-05:00`,
      isDaytime: hour >= 7 && hour < 18,
      temperature,
      temperatureUnit: "F",
      windSpeed: opts.wind ?? "5 mph",
    };
  });
}

describe("parseWindMph", () => {
  it("takes the larger number of a range and converts km/h", () => {
    expect(parseWindMph("10 mph")).toBe(10);
    expect(parseWindMph("5 to 15 mph")).toBe(15);
    expect(parseWindMph("20 km/h")).toBe(12);
    expect(parseWindMph(undefined)).toBeNull();
    expect(parseWindMph("calm")).toBeNull();
  });
});

describe("riskForNight", () => {
  it("uses 20°F for high and 32°F for watch", () => {
    expect(riskForNight(20)).toBe("high");
    expect(riskForNight(21)).toBe("watch");
    expect(riskForNight(32)).toBe("watch");
    expect(riskForNight(33)).toBe("low");
  });
});

describe("summarizeFreezeNights", () => {
  it("groups night hours and finds the low, freezing hours, and the next day", () => {
    // 12:00..17:00 day (6h), 18:00..06:00 night (13h), 07:00..17:00 day (11h)
    const day1 = [40, 40, 39, 38, 37, 36];
    const night = [33, 31, 29, 26, 24, 22, 19, 18, 19, 21, 24, 27, 30];
    const day2 = [31, 31, 32, 32, 32, 31, 31, 30, 30, 29, 29];
    const nights = summarizeFreezeNights(hours([...day1, ...night, ...day2]));

    expect(nights).toHaveLength(1);
    expect(nights[0]).toMatchObject({
      date: "2026-01-10",
      lowF: 18,
      hoursAtOrBelow32: 12,
      hoursAtOrBelow20: 3,
      staysBelowFreezingNextDay: true,
      risk: "high",
    });
    expect(nights[0]!.lowAt.startsWith("2026-01-11T01:00")).toBe(true);
  });

  it("treats a forecast that starts after dark as tonight", () => {
    const nights = summarizeFreezeNights(hours([34, 33, 35], { startHour: 22 }));
    expect(nights[0]).toMatchObject({ date: "2026-01-10", lowF: 33, risk: "low", hoursAtOrBelow32: 0 });
  });

  it("reports wind only during freezing hours", () => {
    const nights = summarizeFreezeNights(hours([30, 28, 27], { startHour: 20, wind: "10 to 20 mph" }));
    expect(nights[0]!.maxFreezingWindMph).toBe(20);
    expect(describeFreezeNight(nights[0]!)).toMatch(/Wind up to 20 mph/);
  });

  it("stops at maxNights", () => {
    const threeDays = hours(Array.from({ length: 72 }, () => 30));
    expect(summarizeFreezeNights(threeDays, 2)).toHaveLength(2);
  });
});

describe("worstRisk and describeFreezeNight", () => {
  it("picks the worst night and words each level", () => {
    const [watch] = summarizeFreezeNights(hours([31, 30, 31], { startHour: 20 }));
    const [low] = summarizeFreezeNights(hours([36, 35, 36], { startHour: 20 }));
    expect(worstRisk([low!, watch!])).toBe("watch");
    expect(worstRisk([])).toBe("low");
    expect(describeFreezeNight(watch!)).toMatch(/^Below freezing for about 3 hours, low 30°F\./);
    expect(describeFreezeNight(low!)).toBe("Stays above freezing (low 35°F).");
  });
});

describe("embedSnippet", () => {
  it("builds an iframe plus a plain attribution link, escaping the place name", () => {
    const snippet = embedSnippet("https://probeharbor.dev", { label: 'Joe\'s "Shop" <AK>', lat: 64.8378, lon: -147.7164 });
    const [iframe, credit] = snippet.split("\n");
    expect(iframe).toContain('src="https://probeharbor.dev/embed/pipe-freeze?lat=64.838&amp;lon=-147.716&amp;place=');
    expect(iframe).toContain('title="Pipe freeze forecast for Joe\'s &quot;Shop&quot; &lt;AK&gt;"');
    expect(credit).toBe('<p><a href="https://probeharbor.dev/pipe-freeze-forecast">Pipe freeze forecast</a> by ProbeHarbor</p>');
  });
});

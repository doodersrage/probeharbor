import type { IndoorOutdoorPoint } from "./indoorOutdoorDelta";
import type { ProbeSpreadPoint } from "./probeSpread";

/**
 * One-paragraph text alternatives for canvas charts (screen readers and
 * anyone who can't read the plot). Pure: templates and number/time
 * formatting come from the caller, so each chart keeps its own locale rules.
 */

type Fmt = (value: number) => string;
const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);

export function indoorOutdoorSummary(
  points: IndoorOutdoorPoint[],
  template: string,
  fmt: Fmt,
  unit = "°F",
): string {
  if (points.length === 0) return "";
  const latest = points[points.length - 1]!;
  let min = latest.deltaF;
  let max = latest.deltaF;
  for (const p of points) {
    if (p.deltaF < min) min = p.deltaF;
    if (p.deltaF > max) max = p.deltaF;
  }
  return fill(template, {
    indoor: fmt(latest.indoorF),
    outdoor: fmt(latest.outdoorF),
    delta: fmt(latest.deltaF),
    min: fmt(min),
    max: fmt(max),
    unit,
  });
}

export function probeSpreadSummary(
  points: ProbeSpreadPoint[],
  template: string,
  fmt: Fmt,
  time: (iso: string) => string,
  unit = "°F",
): string {
  if (points.length === 0) return "";
  const latest = points[points.length - 1]!;
  let widest = latest;
  for (const p of points) if (p.spreadF > widest.spreadF) widest = p;
  return fill(template, {
    spread: fmt(latest.spreadF),
    min: fmt(latest.minF),
    max: fmt(latest.maxF),
    widest: fmt(widest.spreadF),
    time: time(widest.timestamp),
    unit,
  });
}

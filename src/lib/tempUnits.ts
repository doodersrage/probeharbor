/**
 * °F/°C display for the public tools (forecast, embed, calculator). Math and
 * stored values stay in °F; only what people read changes.
 */
export type TempUnit = "F" | "C";

const STORAGE_KEY = "probeharbor.tempUnit";

export function fToC(f: number): number {
  return ((f - 32) * 5) / 9;
}

export function cToF(c: number): number {
  return (c * 9) / 5 + 32;
}

/** "28°F" or "-2°C", rounded to `digits` decimals. */
export function formatTemp(f: number, unit: TempUnit, digits = 0): string {
  const value = unit === "C" ? fToC(f) : f;
  const rounded = Number(value.toFixed(digits));
  // Avoid "-0°C".
  return `${Object.is(rounded, -0) ? 0 : rounded}°${unit}`;
}

/** A rate per hour, e.g. "1.2°F/hr" or "0.7°C/hr" (a temperature difference, so no 32° offset). */
export function formatRatePerHour(fPerHour: number, unit: TempUnit, digits = 1): string {
  const value = unit === "C" ? (fPerHour * 5) / 9 : fPerHour;
  return `${Math.abs(value).toFixed(digits)}°${unit}/hr`;
}

export function formatWind(mph: number, unit: TempUnit): string {
  return unit === "C" ? `${Math.round(mph * 1.609344)} km/h` : `${mph} mph`;
}

/** °F for US-region locales (and plain "en"), °C everywhere else. */
export function defaultTempUnit(locale: string | undefined): TempUnit {
  if (!locale) return "F";
  const tag = locale.toLowerCase();
  if (tag === "en" || /-(us|lr|mm)$/.test(tag)) return "F";
  return "C";
}

/** The visitor's saved choice, else their locale's default. Storage can be unavailable. */
export function loadTempUnit(): TempUnit {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "F" || saved === "C") return saved;
  } catch {
    // Private mode or blocked storage: fall through to the locale.
  }
  return defaultTempUnit(typeof navigator === "undefined" ? undefined : navigator.language);
}

export function saveTempUnit(unit: TempUnit): void {
  try {
    localStorage.setItem(STORAGE_KEY, unit);
  } catch {
    // Not persisted; the toggle still works for this page view.
  }
}

import { cToF, fToC } from "./tempUnits";

export { fToC };

/**
 * Display-unit helpers for the signed-in dashboard (the `useCelsius` display
 * preference). Readings, thresholds and everything stored stay in °F; only
 * what people read and type changes.
 *
 * Two kinds of value convert differently:
 * - a temperature (a reading, a threshold): °C = (°F − 32) × 5/9;
 * - a temperature difference (a margin, a spread, a rate per hour, an
 *   offset, degree-hours): °C = °F × 5/9, no 32° offset.
 */
export type DisplayTempUnitLabel = "°F" | "°C";

/** "°C" or "°F". */
export function tempUnitLabel(useCelsius: boolean): DisplayTempUnitLabel {
  return useCelsius ? "°C" : "°F";
}

/** A °F temperature in the display unit (unrounded). */
export function toDisplayTemp(tempF: number, useCelsius: boolean): number {
  return useCelsius ? fToC(tempF) : tempF;
}

/** A °F difference in the display unit (×5/9 for °C, no offset; unrounded). */
export function toDisplayDelta(deltaF: number, useCelsius: boolean): number {
  return useCelsius ? (deltaF * 5) / 9 : deltaF;
}

/** Stored values are kept to a tenth of a °F when they come from a °C input. */
function roundTenth(value: number): number {
  const rounded = Math.round(value * 10) / 10;
  return Object.is(rounded, -0) ? 0 : rounded;
}

/** A temperature typed in the display unit, back to °F (°C input rounds to 0.1 °F: 1 °C → 33.8 °F). */
export function fromDisplayTemp(value: number, useCelsius: boolean): number {
  return useCelsius ? roundTenth(cToF(value)) : value;
}

/** A difference typed in the display unit, back to °F (×9/5 for °C, rounded to 0.1 °F). */
export function fromDisplayDelta(value: number, useCelsius: boolean): number {
  return useCelsius ? roundTenth((value * 9) / 5) : value;
}

/**
 * The value to put in a number input for a stored °F temperature:
 * unchanged in °F; °C to one decimal (34 °F → 1.1).
 */
export function displayTempInputValue(tempF: number, useCelsius: boolean): number {
  return useCelsius ? roundTenth(fToC(tempF)) : tempF;
}

/** As `displayTempInputValue`, for a stored °F difference (2 °F/h → 1.1). */
export function displayDeltaInputValue(deltaF: number, useCelsius: boolean): number {
  return useCelsius ? roundTenth((deltaF * 5) / 9) : deltaF;
}

/**
 * Parse a temperature form field that may be in °C (`unit === "C"`) back to
 * °F. Returns `fallbackF` for a missing or invalid value. When the submitted
 * °C value is exactly what the form showed for `fallbackF`, `fallbackF` is
 * kept, so saving an untouched form never nudges the stored °F value.
 */
export function parseDisplayTempInput(
  raw: string | null | undefined,
  unit: string | null | undefined,
  fallbackF: number,
  kind: "temp" | "delta" = "temp",
): number {
  if (raw == null || raw.trim() === "") return fallbackF;
  const value = Number(raw);
  if (!Number.isFinite(value)) return fallbackF;
  if (unit !== "C") return value;
  const shown =
    kind === "delta" ? displayDeltaInputValue(fallbackF, true) : displayTempInputValue(fallbackF, true);
  if (Number.isFinite(fallbackF) && value === shown) return fallbackF;
  return kind === "delta" ? fromDisplayDelta(value, true) : fromDisplayTemp(value, true);
}

export function formatTemperature(
  tempF: number,
  useCelsius: boolean,
  decimals = 0,
): string {
  if (!Number.isFinite(tempF)) return "—";
  if (useCelsius) {
    return `${fToC(tempF).toFixed(decimals)}°C`;
  }
  return `${tempF.toFixed(decimals)}°F`;
}

/** Live tile °F: tenths, which is already finer than typical probe accuracy. */
export function formatLiveTempF(tempF: number | null, decimals = 1): string {
  if (tempF == null || !Number.isFinite(tempF)) return "—";
  return `${tempF.toFixed(decimals)}°F`;
}

export function formatLiveTempDetail(
  tempC: number | null,
  humidity: number | null,
  decimals = 1,
): string {
  const c = tempC != null && Number.isFinite(tempC) ? tempC.toFixed(decimals) : "—";
  // Humidity sensors are ±2–3%, so whole percents.
  const h = humidity != null && Number.isFinite(humidity) ? humidity.toFixed(0) : "—";
  return `${c}°C · ${h}% humidity`;
}

export function formatDeltaF(deltaF: number, useCelsius: boolean): string {
  if (!Number.isFinite(deltaF)) return "—";
  const sign = deltaF > 0 ? "+" : "";
  if (useCelsius) {
    const deltaC = (deltaF * 5) / 9;
    return `${sign}${deltaC.toFixed(1)}°C`;
  }
  return `${sign}${deltaF.toFixed(1)}°F`;
}

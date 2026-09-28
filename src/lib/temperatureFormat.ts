export function fToC(tempF: number): number {
  return ((tempF - 32) * 5) / 9;
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
export function formatLiveTempF(tempF: number, decimals = 1): string {
  if (!Number.isFinite(tempF)) return "—";
  return `${tempF.toFixed(decimals)}°F`;
}

export function formatLiveTempDetail(
  tempC: number,
  humidity: number,
  decimals = 1,
): string {
  const c = Number.isFinite(tempC) ? tempC.toFixed(decimals) : "—";
  // Humidity sensors are ±2–3%, so whole percents.
  const h = Number.isFinite(humidity) ? humidity.toFixed(0) : "—";
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

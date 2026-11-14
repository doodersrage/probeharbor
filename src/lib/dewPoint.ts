/**
 * Dew point from air temperature and relative humidity (Magnus formula,
 * Sonntag 1990 constants a = 17.62, b = 243.12 °C; good to ~0.35 °C over
 * -45..60 °C). One implementation for the Overview and the history chart.
 *
 * `temp` and the result share a unit: °F by default, °C when `celsius`.
 * null for impossible inputs (non-finite, RH outside (0, 100]).
 */
export function dewPoint(temp: number, rhPct: number, celsius = false): number | null {
  if (!Number.isFinite(temp) || !Number.isFinite(rhPct) || rhPct <= 0 || rhPct > 100) {
    return null;
  }
  const tC = celsius ? temp : (temp - 32) * (5 / 9);
  const a = 17.62;
  const b = 243.12;
  const gamma = Math.log(rhPct / 100) + (a * tC) / (b + tC);
  const tdC = (b * gamma) / (a - gamma);
  if (!Number.isFinite(tdC)) return null;
  return celsius ? tdC : tdC * (9 / 5) + 32;
}

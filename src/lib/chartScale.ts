/**
 * Y range for temperature charts. Guide lines (freeze, target, high) join the
 * range only when they sit near the data; a 34°F freeze line under an 80–90°F
 * summer week would otherwise flatten the curve into the top of the chart.
 * Guides left out are reported so the chart can mark them at the edge.
 */
export type OffscaleGuide = { value: number; side: "below" | "above" };

export function temperatureScale(
  dataTemps: number[],
  guideTemps: number[],
  padF = 2,
): { min: number; max: number; offscale: OffscaleGuide[] } {
  const data = dataTemps.filter(Number.isFinite);
  const guides = guideTemps.filter(Number.isFinite);
  if (data.length === 0) {
    const all = guides.length > 0 ? guides : [0];
    return { min: Math.min(...all) - padF, max: Math.max(...all) + padF, offscale: [] };
  }
  const dataMin = Math.min(...data);
  const dataMax = Math.max(...data);
  // Near enough to keep in view: within 10°F, or a quarter of the data's span.
  const reach = Math.max(10, (dataMax - dataMin) / 4);
  const inRange: number[] = [];
  const offscale: OffscaleGuide[] = [];
  for (const value of guides) {
    if (value < dataMin - reach) offscale.push({ value, side: "below" });
    else if (value > dataMax + reach) offscale.push({ value, side: "above" });
    else inRange.push(value);
  }
  return {
    min: Math.min(dataMin, ...inRange) - padF,
    max: Math.max(dataMax, ...inRange) + padF,
    offscale,
  };
}

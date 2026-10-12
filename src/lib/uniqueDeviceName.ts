/**
 * "Workshop probe", then "Workshop probe 2", "Workshop probe 3"... Default
 * names have to be unique in a household: new sensors are named after their
 * device, so two "Workshop probe" boards would again show identical lines.
 */
export function uniqueDeviceName(wanted: string, existingNames: Array<string | null | undefined>): string {
  const taken = new Set(existingNames.map((name) => (name ?? "").trim().toLowerCase()));
  if (!taken.has(wanted.trim().toLowerCase())) return wanted;
  for (let n = 2; n < 1000; n++) {
    const candidate = `${wanted} ${n}`;
    if (!taken.has(candidate.toLowerCase())) return candidate;
  }
  return wanted;
}

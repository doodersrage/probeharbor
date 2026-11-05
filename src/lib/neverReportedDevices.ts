/**
 * Push devices that have never reported (no last_seen_at). At the Free plan's
 * device limit these are usually leftovers from retried setup clicks, so the
 * Devices page offers to delete one or reuse it instead of upgrading.
 */
export type NeverReportedDevice = { id: string; name: string };

export function findNeverReportedPushDevices(
  devices: ReadonlyArray<{ id: string; name: string; source: string; last_seen_at: string | null }>,
): NeverReportedDevice[] {
  return devices
    .filter((d) => d.source === "push" && !d.last_seen_at)
    .map((d) => ({ id: d.id, name: d.name }));
}

/** Show the "never reported" hint only at the limit, to someone who can act on it. */
export function shouldOfferNeverReportedCleanup(options: {
  atDeviceLimit: boolean;
  canEdit: boolean;
  neverReported: ReadonlyArray<NeverReportedDevice>;
}): boolean {
  return options.atDeviceLimit && options.canEdit && options.neverReported.length > 0;
}

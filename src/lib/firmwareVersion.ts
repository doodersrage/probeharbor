import manifest from "../../public/firmware/manifest.json";

/** The version /flash installs today (from the manifest the flasher uses). */
export const LATEST_FIRMWARE_VERSION: string = manifest.version;

function parts(version: string): number[] {
  return version.split(".").map((part) => Number.parseInt(part, 10) || 0);
}

/** True when `reported` (e.g. "1.1.0") is older than the flasher's current version. */
export function firmwareUpdateAvailable(
  reported: unknown,
  latest: string = LATEST_FIRMWARE_VERSION,
): boolean {
  if (typeof reported !== "string" || !/^\d+\.\d+\.\d+$/.test(reported)) return false;
  const a = parts(reported);
  const b = parts(latest);
  for (let i = 0; i < 3; i++) {
    if ((a[i] ?? 0) !== (b[i] ?? 0)) return (a[i] ?? 0) < (b[i] ?? 0);
  }
  return false;
}

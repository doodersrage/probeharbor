import { EXAMPLE_FEED_PATH } from "./exampleFeed";

/**
 * Demo (simulated) data.
 *
 * "Try it with a demo feed" saves the public example feed
 * (`/api/feeds/example`) as an ordinary pull feed. Its probes are simulated
 * from the weather, not measured, so ProbeHarbor treats them as demo data:
 * labeled "Demo data" wherever they show, never alerted on, and never counted
 * as a connected sensor during onboarding.
 *
 * Detection needs no migration:
 * - a pull device whose URL path is `/api/feeds/example` is demo, on any host
 *   (feeds saved before this change, self-hosted sites pointing at the public
 *   example, `?format=…` variants);
 * - new and re-saved pull devices also carry `meta.demo` (true or false),
 *   written from the same URL check when the feed is saved.
 */

/** Key in `devices.meta` (JSON) marking a demo pull feed. */
export const DEMO_DEVICE_META_KEY = "demo";

function normalizedPath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

/** True when the URL points at the example (simulated) feed. */
export function isDemoFeedUrl(url: string | null | undefined): boolean {
  if (typeof url !== "string" || !url.trim()) return false;
  try {
    return normalizedPath(new URL(url.trim()).pathname) === EXAMPLE_FEED_PATH;
  } catch {
    return false;
  }
}

type DemoCheckDevice = {
  source?: string | null;
  pull_url?: string | null;
  meta?: unknown;
};

function metaRecord(meta: unknown): Record<string, unknown> {
  return meta && typeof meta === "object" && !Array.isArray(meta)
    ? (meta as Record<string, unknown>)
    : {};
}

/** True for a device whose readings are simulated demo data. */
export function isDemoDevice(device: DemoCheckDevice | null | undefined): boolean {
  if (!device) return false;
  if (metaRecord(device.meta)[DEMO_DEVICE_META_KEY] === true) return true;
  return device.source === "pull_url" && isDemoFeedUrl(device.pull_url);
}

/** Devices that report real (non-demo) readings. */
export function excludeDemoDevices<T extends DemoCheckDevice>(devices: T[]): T[] {
  return devices.filter((device) => !isDemoDevice(device));
}

/** Pull feeds (and their probes) minus the demo feed. */
export function excludeDemoFeeds<
  F extends { id: string; url: string },
  P extends { feedId: string },
>(feeds: F[], probes: P[]): { feeds: F[]; probes: P[] } {
  const realFeeds = feeds.filter((feed) => !isDemoFeedUrl(feed.url));
  const realIds = new Set(realFeeds.map((feed) => feed.id));
  return { feeds: realFeeds, probes: probes.filter((probe) => realIds.has(probe.feedId)) };
}

/** Latest-reading rows minus those from demo devices. */
export function excludeDemoRows<T extends { deviceDemo?: boolean }>(rows: T[]): T[] {
  return rows.filter((row) => row.deviceDemo !== true);
}

/**
 * Latest-reading rows from real devices. Also checks the device list, so rows
 * without the `deviceDemo` flag (e.g. a cached snapshot) are still caught.
 */
export function realReadingRows<T extends { sensor: { device_id: string }; deviceDemo?: boolean }>(
  rows: T[],
  devices: Array<DemoCheckDevice & { id: string }>,
): T[] {
  const demoIds = new Set(devices.filter((device) => isDemoDevice(device)).map((device) => device.id));
  return rows.filter((row) => row.deviceDemo !== true && !demoIds.has(row.sensor.device_id));
}

/**
 * Onboarding step 1 ("Connect your first sensor"):
 * - "done" once a real (non-demo) device has reported at least once;
 * - "waiting" while a real device exists but hasn't reported yet;
 * - "todo" otherwise (no devices, or only the demo feed).
 */
export type OnboardingDeviceStep = "todo" | "waiting" | "done";

export function onboardingDeviceStep(
  devices: Array<DemoCheckDevice & { id: string; last_seen_at?: string | null }>,
  latest: Array<{ sensor: { device_id: string }; deviceDemo?: boolean }>,
): OnboardingDeviceStep {
  const realDevices = excludeDemoDevices(devices);
  const realReported =
    realDevices.some((device) => Boolean(device.last_seen_at)) || realReadingRows(latest, devices).length > 0;
  if (realReported) return "done";
  return realDevices.length > 0 ? "waiting" : "todo";
}

/**
 * Which devices and latest readings the Overview status card ("Space status")
 * judges, so a simulated demo temperature is never described as the space's
 * real condition:
 * - any real (non-demo) device or reading: real ones only, demo excluded
 *   (a real device that hasn't reported yet reads "Waiting for a reading",
 *   even while the demo feed is posting);
 * - only demo devices: everything, with `demoOnly` set when there are demo
 *   readings, so the card shows its neutral "Demo data" state instead of a
 *   freeze/flood/stale verdict.
 * Used by the Overview page and /api/user/dashboard-snapshot alike.
 */
export function statusReadingScope<
  R extends { sensor: { device_id: string }; deviceDemo?: boolean },
  D extends DemoCheckDevice & { id: string },
>(rows: R[], devices: D[]): { rows: R[]; devices: D[]; demoOnly: boolean } {
  const realDevices = excludeDemoDevices(devices);
  const realRows = realReadingRows(rows, devices);
  if (realDevices.length > 0 || realRows.length > 0) {
    return { rows: realRows, devices: realDevices, demoOnly: false };
  }
  return { rows, devices, demoOnly: rows.length > 0 };
}

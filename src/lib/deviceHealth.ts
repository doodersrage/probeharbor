import type { DeviceWithSensors } from "./devices";
import type { DeviceHealth } from "./alerts";

export function readDeviceMetaNumber(
  meta: Record<string, unknown> | undefined,
  key: string,
): number | null {
  if (!meta) return null;
  const value = meta[key];
  // Number(null) / Number("") are 0, which would read as a dead battery.
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  }
  return null;
}

export function deviceHealthFromDevices(devices: DeviceWithSensors[]): DeviceHealth[] {
  return devices.map((device) => ({
    deviceName: device.name,
    batteryPct: readDeviceMetaNumber(device.meta, "battery_pct"),
    rssi: readDeviceMetaNumber(device.meta, "rssi"),
  }));
}

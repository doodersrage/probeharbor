import type { DeviceWithSensors } from "./devices";
import { readDeviceMetaNumber } from "./deviceHealth";
import { fmt, type Locale } from "../i18n";
import { libNumber, libTextMessages } from "../i18n/messages/app/libText";

export type LowBatteryDevice = {
  id: string;
  name: string;
  batteryPct: number;
};

export function listLowBatteryDevices(
  devices: DeviceWithSensors[],
  thresholdPct: number,
): LowBatteryDevice[] {
  return devices
    .filter((d) => d.enabled && d.source === "push")
    .map((device) => {
      const batteryPct = readDeviceMetaNumber(device.meta, "battery_pct");
      if (batteryPct == null || batteryPct > thresholdPct) return null;
      return { id: device.id, name: device.name, batteryPct };
    })
    .filter((row): row is LowBatteryDevice => row != null)
    .sort((a, b) => a.batteryPct - b.batteryPct);
}

export function lowBatteryBannerMessage(devices: LowBatteryDevice[], locale: Locale = "en"): string {
  if (devices.length === 0) return "";
  const t = libTextMessages(locale).lowBattery;
  if (devices.length === 1) {
    return fmt(t.single, { name: devices[0]!.name, pct: libNumber(devices[0]!.batteryPct, locale) });
  }
  const names = devices
    .slice(0, 3)
    .map((d) => fmt(t.item, { name: d.name, pct: libNumber(d.batteryPct, locale) }))
    .join(", ");
  const count = libNumber(devices.length, locale);
  return devices.length > 3
    ? fmt(t.listMore, { count, names, more: libNumber(devices.length - 3, locale) })
    : fmt(t.list, { count, names });
}

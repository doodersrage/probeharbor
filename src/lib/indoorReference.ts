import * as neonPlaces from "./db/places";
import type { DeviceWithSensors } from "./devices";

export type IndoorReferenceOption = {
  sensorId: string;
  label: string;
  deviceName: string;
};

export async function getIndoorReferenceSensorId(
  householdId: string,
): Promise<string | null> {
  try {
    return await neonPlaces.getIndoorReference(householdId);
  } catch (error) {
    console.error("getIndoorReferenceSensorId failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function updateIndoorReferenceSensor(
  householdId: string,
  sensorId: string | null,
): Promise<{ error: string | null }> {
  if (sensorId) {
    let kind: string | null;
    try {
      kind = await neonPlaces.householdSensorKind(householdId, sensorId);
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) };
    }
    if (kind !== "temperature") return { error: "Choose a temperature sensor from this household." };
  }
  return neonPlaces.setIndoorReference(householdId, sensorId);
}

export function listIndoorReferenceOptions(
  devices: DeviceWithSensors[],
): IndoorReferenceOption[] {
  const options: IndoorReferenceOption[] = [];
  for (const device of devices) {
    for (const sensor of device.sensors) {
      if (sensor.kind !== "temperature" || !sensor.visible) continue;
      options.push({
        sensorId: sensor.id,
        label: sensor.label,
        deviceName: device.name,
      });
    }
  }
  return options.sort((a, b) =>
    `${a.deviceName} ${a.label}`.localeCompare(`${b.deviceName} ${b.label}`),
  );
}

export function findReferenceSensorLabel(
  devices: DeviceWithSensors[],
  sensorId: string | null,
): string | null {
  if (!sensorId) return null;
  for (const device of devices) {
    for (const sensor of device.sensors) {
      if (sensor.id === sensorId) {
        return sensor.label;
      }
    }
  }
  return null;
}

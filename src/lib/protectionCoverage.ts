import type { DeviceWithSensors } from "./devices";
import type { LatestSensorRow } from "./sensorReadings";
import { isSensorLagging } from "./sensorFreshness";

/**
 * Which risks each space is actually watched for. "stale" means a sensor
 * exists but hasn't reported recently: covered on paper, not in practice.
 */
export type CoverageRisk = "freeze" | "leak" | "door" | "power";
export type CoverageState = "live" | "stale" | "none";

export type SpaceCoverage = {
  space: string;
  /** True for the bucket of devices with no space set. */
  unassigned: boolean;
  deviceCount: number;
  risks: Record<CoverageRisk, CoverageState>;
  gaps: string[];
};

export const COVERAGE_RISK_LABELS: Record<CoverageRisk, string> = {
  freeze: "Temperature",
  leak: "Leak",
  door: "Door",
  power: "Power",
};

const RISK_KINDS: Record<CoverageRisk, readonly string[]> = {
  freeze: ["temperature"],
  leak: ["flood", "level"],
  door: ["door"],
  power: ["power"],
};

/** Spaces that usually have plumbing, where a leak sensor earns its place. */
const WET_SPACE = /basement|crawl|utility|laundry|water heater|kitchen|bath|sump|mechanical|boiler|pump|well/i;

export const UNASSIGNED_SPACE = "No space set";

export function isWetSpace(space: string): boolean {
  return WET_SPACE.test(space);
}

export function buildProtectionCoverage(
  devices: DeviceWithSensors[],
  latest: LatestSensorRow[],
  now = Date.now(),
): SpaceCoverage[] {
  const recordedBySensor = new Map(latest.map((row) => [row.sensor.id, row.recorded_at]));
  const bySpace = new Map<string, DeviceWithSensors[]>();
  for (const device of devices) {
    if (!device.enabled) continue;
    const space = device.space?.trim() || UNASSIGNED_SPACE;
    bySpace.set(space, [...(bySpace.get(space) ?? []), device]);
  }

  const result: SpaceCoverage[] = [];
  for (const [space, spaceDevices] of bySpace) {
    const unassigned = space === UNASSIGNED_SPACE;
    const sensors = spaceDevices.flatMap((d) => d.sensors);
    const risks = {} as Record<CoverageRisk, CoverageState>;
    for (const risk of Object.keys(RISK_KINDS) as CoverageRisk[]) {
      const matching = sensors.filter((s) => RISK_KINDS[risk].includes(s.kind));
      if (matching.length === 0) risks[risk] = "none";
      else if (matching.some((s) => !isSensorLagging(recordedBySensor.get(s.id), now))) risks[risk] = "live";
      else risks[risk] = "stale";
    }

    const gaps: string[] = [];
    if (unassigned) {
      gaps.push("Set a space on these devices so coverage is tracked per room.");
    }
    if (risks.freeze === "none") {
      gaps.push("No temperature probe: freeze alerts can't cover this space.");
    } else if (risks.freeze === "stale") {
      gaps.push("Temperature probe hasn't reported recently, so freeze alerts can't fire here.");
    }
    if (risks.leak === "stale") {
      gaps.push("Leak sensor hasn't reported recently.");
    } else if (risks.leak === "none" && !unassigned && isWetSpace(space)) {
      gaps.push("No leak sensor here, and this kind of space usually has plumbing.");
    }
    if (risks.door === "stale") gaps.push("Door sensor hasn't reported recently.");
    if (risks.power === "stale") gaps.push("Power sensor hasn't reported recently.");

    result.push({ space, unassigned, deviceCount: spaceDevices.length, risks, gaps });
  }

  // Spaces needing attention first, the unassigned bucket last.
  return result.sort((a, b) => {
    if (a.unassigned !== b.unassigned) return a.unassigned ? 1 : -1;
    if ((a.gaps.length > 0) !== (b.gaps.length > 0)) return a.gaps.length > 0 ? -1 : 1;
    return a.space.localeCompare(b.space);
  });
}

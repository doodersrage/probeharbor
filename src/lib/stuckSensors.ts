import type { DeviceWithSensors } from "./devices";
import { stuckSensorFacts } from "./db/jobs";
import type { Locale } from "../i18n/locales";
import { fmt, formatNumber, plural } from "../i18n/format";
import { alertJobsMessages } from "../i18n/messages/app/alertJobs";
import { tempUnitLabel, toDisplayTemp } from "./temperatureFormat";

/**
 * A probe that keeps posting the same number looks healthy -- fresh
 * timestamps, no outage -- while telling you nothing. Real air in a garage
 * or crawlspace moves at least a tenth of a degree in a day, so a value that
 * hasn't changed across a full day of readings is worth a look.
 */
export const STUCK_WINDOW_MS = 24 * 60 * 60 * 1000;
/** Fewer readings than this in the window is slow reporting, not a stuck value. */
export const STUCK_MIN_SAMPLES = 12;
/** Older than this, the reading is the outage monitor's problem, not ours. */
const FRESH_MS = 2 * 60 * 60 * 1000;

/**
 * Values a DS18B20 sends on a fault, in °F: 185 is its power-on reset value
 * (read before a conversion finished, often a weak supply or long cable) and
 * -196.6 is the library's "disconnected". Our firmware drops both; other
 * sketches often don't.
 */
const FAULT_VALUES_F = [
  { value: 185, why: "faultReset" },
  { value: -196.6, why: "faultDisconnected" },
] as const;

export type StuckSensorInput = {
  sensorId: string;
  label: string;
  latestValue: number;
  latestAt: string;
  /** Most recent reading with a different value, or null if none in the lookback. */
  lastDifferentAt: string | null;
  /** True when a reading exists from before the window (the sensor is old enough to judge). */
  reportedBeforeWindow: boolean;
  samplesInWindow: number;
};

export type StuckSensor = {
  sensorId: string;
  label: string;
  /** Full sentence for an alert. */
  message: string;
  /** A few words for the Devices health table (in the dashboard display unit). */
  detail: string;
};

function oneDecimal(value: number, locale: Locale): string {
  return locale === "en"
    ? value.toFixed(1)
    : formatNumber(value, locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function evaluateStuckSensor(
  input: StuckSensorInput,
  nowMs = Date.now(),
  locale: Locale = "en",
  /** Display preference for `detail` only; `message` (alerts) and detection stay °F. */
  useCelsius = false,
): StuckSensor | null {
  const t = alertJobsMessages(locale).stuck;
  const value = oneDecimal(input.latestValue, locale);
  const shownValue = oneDecimal(toDisplayTemp(input.latestValue, useCelsius), locale);
  const unit = tempUnitLabel(useCelsius);
  const latestMs = Date.parse(input.latestAt);
  if (!Number.isFinite(latestMs) || nowMs - latestMs > FRESH_MS) return null;

  const fault = FAULT_VALUES_F.find((f) => Math.abs(input.latestValue - f.value) < 0.05);
  if (fault) {
    return {
      sensorId: input.sensorId,
      label: input.label,
      message: fmt(t.faultMessage, { label: input.label, value, why: t[fault.why] }),
      detail: fmt(t.faultDetail, { label: input.label, value: shownValue, unit }),
    };
  }

  if (!input.reportedBeforeWindow || input.samplesInWindow < STUCK_MIN_SAMPLES) return null;
  const changedMs = input.lastDifferentAt ? Date.parse(input.lastDifferentAt) : Number.NEGATIVE_INFINITY;
  if (nowMs - changedMs < STUCK_WINDOW_MS) return null;

  const hours = Number.isFinite(changedMs) ? Math.floor((nowMs - changedMs) / (60 * 60 * 1000)) : null;
  const span = hours != null && hours < 72 ? plural(t.spanHours, hours, locale) : t.spanOverDay;
  return {
    sensorId: input.sensorId,
    label: input.label,
    message: fmt(t.stuckMessage, { label: input.label, value, span }),
    detail: fmt(t.stuckDetail, { label: input.label, value: shownValue, span, unit }),
  };
}

/** Visible temperature sensors on enabled devices whose readings have stopped changing. */
export async function findStuckSensors(
  devices: DeviceWithSensors[],
  nowMs = Date.now(),
  locale: Locale = "en",
  useCelsius = false,
): Promise<StuckSensor[]> {
  const windowStart = new Date(nowMs - STUCK_WINDOW_MS).toISOString();
  const lookbackStart = new Date(nowMs - 3 * STUCK_WINDOW_MS).toISOString();
  const sensors = devices
    .filter((device) => device.enabled)
    .flatMap((device) => device.sensors)
    .filter((sensor) => sensor.kind === "temperature" && sensor.visible !== false);

  const results = await Promise.all(
    sensors.map(async (sensor): Promise<StuckSensor | null> => {
      try {
        const facts = await stuckSensorFacts(sensor.id, windowStart, lookbackStart);
        if (typeof facts?.latest_value !== "number" || typeof facts.latest_at !== "string") return null;
        return evaluateStuckSensor(
          {
            sensorId: sensor.id,
            label: sensor.label,
            latestValue: facts.latest_value,
            latestAt: facts.latest_at,
            lastDifferentAt: facts.last_different_at,
            reportedBeforeWindow: facts.reported_before_window,
            samplesInWindow: facts.samples_in_window,
          },
          nowMs,
          locale,
          useCelsius,
        );
      } catch {
        // A failed lookup means "don't know", never "stuck".
        return null;
      }
    }),
  );
  return results.filter((result): result is StuckSensor => result !== null);
}

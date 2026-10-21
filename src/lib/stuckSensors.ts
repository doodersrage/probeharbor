import type { DeviceWithSensors } from "./devices";
import { createServerClient } from "./supabase";
import type { Locale } from "../i18n/locales";
import { fmt, formatNumber, plural } from "../i18n/format";
import { alertJobsMessages } from "../i18n/messages/app/alertJobs";

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
  /** A few words for the Devices health table. */
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
): StuckSensor | null {
  const t = alertJobsMessages(locale).stuck;
  const value = oneDecimal(input.latestValue, locale);
  const latestMs = Date.parse(input.latestAt);
  if (!Number.isFinite(latestMs) || nowMs - latestMs > FRESH_MS) return null;

  const fault = FAULT_VALUES_F.find((f) => Math.abs(input.latestValue - f.value) < 0.05);
  if (fault) {
    return {
      sensorId: input.sensorId,
      label: input.label,
      message: fmt(t.faultMessage, { label: input.label, value, why: t[fault.why] }),
      detail: fmt(t.faultDetail, { label: input.label, value }),
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
    detail: fmt(t.stuckDetail, { label: input.label, value, span }),
  };
}

/** Visible temperature sensors on enabled devices whose readings have stopped changing. */
export async function findStuckSensors(
  devices: DeviceWithSensors[],
  nowMs = Date.now(),
  locale: Locale = "en",
): Promise<StuckSensor[]> {
  const supabase = createServerClient();
  const windowStart = new Date(nowMs - STUCK_WINDOW_MS).toISOString();
  const lookbackStart = new Date(nowMs - 3 * STUCK_WINDOW_MS).toISOString();
  const sensors = devices
    .filter((device) => device.enabled)
    .flatMap((device) => device.sensors)
    .filter((sensor) => sensor.kind === "temperature" && sensor.visible !== false);

  const results = await Promise.all(
    sensors.map(async (sensor): Promise<StuckSensor | null> => {
      try {
        const { data: latest } = await supabase
          .from("sensor_readings")
          .select("value_num, recorded_at")
          .eq("sensor_id", sensor.id)
          .not("value_num", "is", null)
          .order("recorded_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (typeof latest?.value_num !== "number" || typeof latest.recorded_at !== "string") return null;

        const [different, older, count] = await Promise.all([
          supabase
            .from("sensor_readings")
            .select("recorded_at")
            .eq("sensor_id", sensor.id)
            .gte("recorded_at", lookbackStart)
            .neq("value_num", latest.value_num)
            .order("recorded_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from("sensor_readings")
            .select("recorded_at")
            .eq("sensor_id", sensor.id)
            .lt("recorded_at", windowStart)
            .limit(1)
            .maybeSingle(),
          supabase
            .from("sensor_readings")
            .select("id", { count: "exact", head: true })
            .eq("sensor_id", sensor.id)
            .gte("recorded_at", windowStart),
        ]);

        return evaluateStuckSensor(
          {
            sensorId: sensor.id,
            label: sensor.label,
            latestValue: latest.value_num,
            latestAt: latest.recorded_at,
            lastDifferentAt: typeof different.data?.recorded_at === "string" ? different.data.recorded_at : null,
            reportedBeforeWindow: Boolean(older.data),
            samplesInWindow: count.count ?? 0,
          },
          nowMs,
          locale,
        );
      } catch {
        // A failed lookup means "don't know", never "stuck".
        return null;
      }
    }),
  );
  return results.filter((result): result is StuckSensor => result !== null);
}

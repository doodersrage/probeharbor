import { describe, expect, it } from "vitest";
import { buildDeviceDiagnostics, isSensitiveKey, REDACTED, redactUrl, redactValue } from "./deviceDiagnostics";
import type { DeviceWithSensors } from "./devices";

describe("redaction", () => {
  it("strips query values and opaque path tokens from pull URLs", () => {
    expect(redactUrl("https://user:pw@api.example.com/v1/feeds/abcdef0123456789abcd/data?apiKey=s3cret&units=f")).toBe(
      `https://api.example.com/v1/feeds/${REDACTED}/data?apiKey=${REDACTED}&units=${REDACTED}`,
    );
    expect(redactUrl("not a url")).toBe(REDACTED);
    expect(redactUrl(null)).toBeNull();
  });

  it("matches sensitive keys by whole word", () => {
    expect(isSensitiveKey("wifi_ssid")).toBe(true);
    expect(isSensitiveKey("apiKey")).toBe(true);
    expect(isSensitiveKey("local_ip")).toBe(true);
    expect(isSensitiveKey("relative_humidity")).toBe(false);
    expect(isSensitiveKey("ingest_client")).toBe(false);
    expect(isSensitiveKey("battery_pct")).toBe(false);
  });

  it("redacts nested secrets and emails but keeps diagnostics", () => {
    expect(
      redactValue({
        battery_pct: 81,
        ingest_client: { name: "home-assistant", contact: "me@example.com" },
        wifi: { ssid: "Home", rssi: -61 },
        token: "abc",
      }),
    ).toEqual({
      battery_pct: 81,
      ingest_client: { name: "home-assistant", contact: REDACTED },
      wifi: { ssid: REDACTED, rssi: -61 },
      token: REDACTED,
    });
  });
});

describe("buildDeviceDiagnostics", () => {
  const now = Date.parse("2026-10-14T12:00:00Z");
  const device: DeviceWithSensors = {
    id: "d1",
    household_id: "hh",
    name: "Garage board",
    source: "push",
    pull_url: null,
    ingest_key_prefix: "phk_abcd",
    enabled: true,
    last_seen_at: "2026-10-14T11:50:00Z",
    sort_order: 0,
    space: "Garage",
    meta: { firmware_version: "1.0.0", battery_pct: 70 },
    sensors: [
      { id: "s1", device_id: "d1", key: "temp1", label: "Pipe", kind: "temperature", unit: "°F", visible: true, sort_order: 0, offset_num: 0.5 },
    ],
  };

  it("summarizes the device without the ingest key", () => {
    const bundle = buildDeviceDiagnostics({
      device,
      latest: [{ sensor: device.sensors[0]!, deviceName: "Garage board", value_num: 41, value_bool: null, value_text: null, recorded_at: "2026-10-14T11:45:00Z" }],
      health: { score: 90, label: "healthy", detail: "ok", batteryPct: 70, rssi: -60, daysRemaining: null },
      stuck: [{ sensorId: "s1", label: "Pipe", message: "m", detail: "stuck at 41°F" }],
      ingestStats: [{ device_id: "d1", day: "2026-10-14", success_count: 140, error_count: 2 }, { device_id: "other", day: "2026-10-14", success_count: 1, error_count: 0 }],
      now,
    });
    expect(bundle.device.minutes_since_last_seen).toBe(10);
    expect(bundle.firmware.update_available).toBe(true);
    expect(bundle.sensors[0]).toMatchObject({ latest_value: 41, minutes_since_latest: 15, stuck: "stuck at 41°F" });
    expect(bundle.ingest_last_7_days).toEqual([{ day: "2026-10-14", accepted: 140, rejected: 2 }]);
    expect(JSON.stringify(bundle)).not.toContain("phk_abcd");
  });
});

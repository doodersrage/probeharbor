/**
 * Device, feed, puck and bay API text shown in the dashboard
 * (src/pages/api/{devices,feeds,pucks,bays}, src/lib/devices.ts,
 * src/lib/sensorReplacement.ts).
 */
const en = {
  /** src/lib/devices.ts */
  nameRequired: "Name is required",
  deviceNotFound: "Device not found",
  sameHousehold: "Same household",
  renameFailed: "Failed to rename device",
  updateSpaceFailed: "Failed to update space",
  /** src/lib/sensorReplacement.ts, by error code. */
  replaceErrors: {
    same_sensor: "Pick two different sensors.",
    kind_mismatch: "Both sensors need to be the same type (temperature with temperature).",
    sensor_not_found: "One of those sensors isn't in this property anymore.",
    failed: "Couldn't replace the sensor. Nothing was changed.",
  },
  /** /api/devices/reveal-ingest-key */
  reveal: {
    tooManyAttempts: "Too many reveal attempts. Try again in {seconds} seconds.",
    notConfigured: "Key recovery is not configured on this server.",
    verifyMfa: "Verify MFA again before revealing ingest keys.",
    deviceNotFound: "Device not found.",
    noRecoverableKey: "No recoverable key for this device. Rotate to generate a new one.",
    decryptFailed: "Could not decrypt stored key.",
  },
  /** /api/devices/sensors-batch */
  noSensorsProvided: "No sensors provided.",
  /** /api/devices/pull-fetch, one row per feed. */
  pullFetchProbes: { one: "{count} probe(s)", other: "{count} probe(s)" },
  /** /api/feeds/test */
  feedTest: {
    tooMany: "Too many feed tests. Try again shortly.",
    invalidUrl: "Enter a valid HTTPS feed URL.",
    requestFailed: "Feed request failed ({status}).",
    found: { one: "Found {count} probe ({format} JSON).", other: "Found {count} probes ({format} JSON)." },
    foundWithAverage: {
      one: "Found {count} probe ({format} JSON), average {average}°F.",
      other: "Found {count} probes ({format} JSON), average {average}°F.",
    },
    failed: "Feed test failed",
  },
};

export type ApiDevicesMessages = typeof en;
export default en;

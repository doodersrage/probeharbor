/**
 * Composite alert rules (src/lib/alertRules.ts): condition names in the rule
 * editor, the "Check saved rules now" explanations, and the line each matched
 * rule adds to a rule alert.
 */
const en = {
  /** Condition picker in the rule editor. */
  conditions: {
    temp_below: "Temperature below threshold",
    temp_above: "Temperature above (°F)",
    humidity_above: "Humidity above threshold",
    door_open: "Door open",
    door_open_duration: "Door open longer than (minutes)",
    rate_drop: "Rapid temperature drop",
    outage: "Device outage",
    flood: "Flood detected (also automatic)",
    power_off: "Power off",
    co2_above: "CO₂ above (ppm)",
    pressure_below: "Pressure below (hPa)",
    pm25_above: "PM2.5 above (µg/m³)",
    voc_above: "VOC above (ppb)",
    level_above: "Water / sump level above (%)",
    energy_below: "Energy below (W)",
    motion_detected: "Motion detected",
    outdoor_below: "Outdoor temperature below (°F, default {default})",
  },
  /** Short condition names joined into the alert line (`temp below AND door open`). */
  shortNames: {
    temp_below: "temp below",
    temp_above: "temp above",
    humidity_above: "humidity above",
    door_open: "door open",
    door_open_duration: "door open duration",
    rate_drop: "rate drop",
    outage: "outage",
    flood: "flood",
    power_off: "power off",
    co2_above: "co2 above",
    pressure_below: "pressure below",
    pm25_above: "pm25 above",
    voc_above: "voc above",
    level_above: "level above",
    energy_below: "energy below",
    motion_detected: "motion detected",
    outdoor_below: "outdoor below",
  } as Record<string, string>,
  and: " AND ",
  or: " OR ",
  matched: 'Rule "{name}" matched ({parts}).',

  /** What a condition looks at: `name` fills the "No … reporting" notes (translations may use the plural there), `count` is counted. */
  nouns: {
    temperatureProbe: { name: "temperature probe", count: { one: "{count} temperature probe", other: "{count} temperature probes" } },
    humidityReading: { name: "humidity reading", count: { one: "{count} humidity reading", other: "{count} humidity readings" } },
    doorSensor: { name: "door sensor", count: { one: "{count} door sensor", other: "{count} door sensors" } },
    leakSensor: { name: "leak sensor", count: { one: "{count} leak sensor", other: "{count} leak sensors" } },
    powerSensor: { name: "power sensor", count: { one: "{count} power sensor", other: "{count} power sensors" } },
    co2Sensor: { name: "CO₂ sensor", count: { one: "{count} CO₂ sensor", other: "{count} CO₂ sensors" } },
    pressureSensor: { name: "pressure sensor", count: { one: "{count} pressure sensor", other: "{count} pressure sensors" } },
    pm25Sensor: { name: "PM2.5 sensor", count: { one: "{count} PM2.5 sensor", other: "{count} PM2.5 sensors" } },
    vocSensor: { name: "VOC sensor", count: { one: "{count} VOC sensor", other: "{count} VOC sensors" } },
    levelSensor: { name: "level sensor", count: { one: "{count} level sensor", other: "{count} level sensors" } },
    energySensor: { name: "energy sensor", count: { one: "{count} energy sensor", other: "{count} energy sensors" } },
    motionSensor: { name: "motion sensor", count: { one: "{count} motion sensor", other: "{count} motion sensors" } },
    coolingProbe: {
      name: "probe cooling in the last hour",
      count: { one: "{count} probe cooling in the last hour", other: "{count} probes cooling in the last hour" },
    },
    outdoorReading: { name: "outdoor reading", count: { one: "{count} outdoor reading", other: "{count} outdoor readings" } },
    device: { name: "device", count: { one: "{count} device", other: "{count} devices" } },
  },
  /** States a yes/no sensor can read. */
  states: {
    open: "open",
    wet: "wet",
    off: "off",
    motion: "motion",
  },
  /** Unit suffix for silent devices (`3h silent`). */
  hoursSilent: "h silent",
  outdoorLabel: "Outdoor",

  noneNamed: 'No {noun} with "{includes}" in its name.',
  noneReporting: "No {noun} reporting.",
  compareHit: "{label} at {value} ({want}).",
  compareClosest: "Closest: {label} at {value}; needs {want}.",
  boolHit: "{label} reads {state}.",
  boolNone: "None of {sensors} reads {state}.",
  noOpenDoor: "No door is open now.",
  noOpenDoorFor: "No door matching \"{includes}\" is open now.",
  doorOpenFor: "{label} has been open {minutes} min (≥ {min} min).",
  doorOpenShort: "{label} has been open {minutes} min; needs {min}.",
  rateDropped: "{label} dropped {drop} in the last hour.",
  rateBiggest: "Biggest: {label} dropped {drop} in the last hour; needs {threshold}.",
  outdoorUnknown: "Outdoor temperature unknown, so this never matches.",
  unknownCondition: "Unknown condition type.",
};

export type AlertRulesMessages = typeof en;
export default en;

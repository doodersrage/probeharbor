/**
 * Text built by shared `src/lib` helpers (insights, cold-snap replay,
 * anomalies, device health, sensor values, battery trend, house context).
 * Temperatures stay in °F here: the helpers work on raw °F readings.
 */
const en = {
  seasonal: {
    coldestTitle: "Coldest reading",
    warmestTitle: "Warmest reading",
    humidityTitle: "Highest humidity",
    averageTitle: "{days}-day average",
    tempOn: "{temp}°F on {time} ({probe})",
    humidityOn: "{humidity}% on {time} ({probe})",
    averageDetail: { one: "{temp}°F across {count} readings", other: "{temp}°F across {count} readings" },
    warmerThan: "{warmer} averages {delta}°F warmer than {cooler} in this window.",
    yoyTitle: "Year-over-year",
    yoyDetail: "This window averages {current}°F vs {prior}°F last year ({delta}°F).",
    outdoorEstimate: "{detail} (outdoor estimate).",
    outdoorEstimateAt: "{detail} (outdoor estimate at {location}).",
  },
  coldSnap: {
    reached: "{probe} reached {temp}°F, at or below the {threshold}°F line.",
    lowest: "Lowest: {temp}°F.",
    backAbove: "Back above {threshold}°F.",
    alertSent: "Alert sent: {title} ({channels}).",
    allClearSent: "All-clear sent: {title} ({channels}).",
    notDelivered: "Alert not delivered: {title}.",
    notDeliveredChannels: "Alert not delivered: {title} ({channels}).",
    autoRecovered: "Alert closed automatically when it warmed up.",
    expired: "Alert expired.",
    handled: "Someone marked the alert handled.",
  },
  anomaly: {
    drop: {
      one: "{probe} dropped {drop}°F within {count} minutes ({from}°F → {to}°F).",
      other: "{probe} dropped {drop}°F within {count} minutes ({from}°F → {to}°F).",
    },
    dropDoor: {
      one: "{probe} dropped {drop}°F within {count} minutes ({from}°F → {to}°F). A door sensor was open around this time.",
      other:
        "{probe} dropped {drop}°F within {count} minutes ({from}°F → {to}°F). A door sensor was open around this time.",
    },
  },
  health: {
    disabled: "Device disabled",
    waiting: "Waiting for first reading",
    floodWet: "Flood / leak contact wet",
    noData: { one: "No data for {count} day, check power/Wi‑Fi", other: "No data for {count} days, check power/Wi‑Fi" },
    stale: "Probe data stale, check power/Wi‑Fi",
    batteryLow: "Battery {pct}% — replace soon",
    batteryDays: { one: "Battery ~{count} days left", other: "Battery ~{count} days left" },
    weakRssi: "Weak RSSI ({rssi} dBm)",
    healthy: "Reporting, dry flood contacts",
    etaReplaceSoon: "Replace soon",
    etaDays: { one: "~{count} days", other: "~{count} days" },
    etaWeeks: "~{weeks} wk",
  },
  sensorKinds: {
    temperature: "Temperature",
    humidity: "Humidity",
    co2: "CO₂",
    pressure: "Barometric pressure",
    pm25: "PM2.5",
    voc: "VOC",
    level: "Water / sump level",
    energy: "Energy",
    door: "Door",
    power: "Power",
    flood: "Flood / leak",
    motion: "Motion",
    generic: "Generic",
  },
  sensorValues: {
    open: "Open",
    closed: "Closed",
    on: "On",
    off: "Off",
    wet: "Wet",
    dry: "Dry",
    detected: "Detected",
    clear: "Clear",
  },
  battery: {
    dropped: "Battery dropped {drop}% since {date} ({from}% → {to}%).",
    mayLast: "{base} At this drain rate the pack may last {duration}.",
    aboutOneDay: "~1 day",
    aboutDays: { one: "~{count} days", other: "~{count} days" },
  },
  house: {
    fromReference: "From {label}",
    indoorReference: "Indoor reference probe",
    house: "House",
  },
  /** Templates for `freshnessDetail` in src/lib/relativeTime.ts. */
  freshness: {
    offline: "Offline · last seen {age}",
    mayBeOffline: "May be offline · last seen {age}",
    updated: "Updated {age}",
    polled: "Polled {age}",
    offlinePolled: "Offline · last polled {age}",
    awaitingPoll: "Awaiting poll · last polled {age}",
  },
  /** `summarizeStaleSensors` banner (src/lib/sensorFreshness.ts). */
  staleBanner: {
    pullOnly: {
      one: "{count} pull probe hasn't been polled in 30+ minutes",
      other: "{count} pull probes haven't been polled in 30+ minutes",
    },
    pushOnly: {
      one: "{count} probe hasn't posted in 30+ minutes",
      other: "{count} probes haven't posted in 30+ minutes",
    },
    mixed: { one: "{count} probe look stale ({parts})", other: "{count} probes look stale ({parts})" },
    partPush: "{count} push",
    partPull: "{count} pull",
    partUnknown: "{count} unknown",
  },
  /** `lowBatteryBannerMessage` (src/lib/deviceBatteryUi.ts). */
  lowBattery: {
    single: "{name} battery is {pct}%: charge or replace before it stops posting.",
    item: "{name} ({pct}%)",
    list: "Low battery on {count} devices: {names}.",
    listMore: "Low battery on {count} devices: {names} and {more} more.",
  },
  /** Thermal runway lines appended to freeze alerts (src/lib/thermalRunway.ts). */
  runway: {
    prefix: "Thermal runway: {message}",
    doorOpen: "A door sensor is open: expect faster heat loss until it closes.",
    forecastLow: "Forecast low ~{temp}°F in the next {hours}h: outdoor cold may accelerate indoor cooling.",
  },
  /** Regional comparison line (src/lib/regionalBenchmark.ts), also used in alerts. */
  benchmark: {
    yourRegion: "your region",
    typical: "About typical for other ProbeHarbor households in {city} tonight.",
    colder: "{delta}°F colder than typical ProbeHarbor households in {city} right now.",
    warmer: "{delta}°F warmer than typical ProbeHarbor households in {city} right now.",
  },
};

export type LibTextMessages = typeof en;
export default en;

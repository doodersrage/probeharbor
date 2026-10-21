/**
 * Devices → Devices tab: the device list, bulk actions and protection
 * coverage (DeviceListCard, DeviceBulkActions, ProtectionCoverageCard,
 * src/lib/protectionCoverage.ts).
 */
const en = {
  list: {
    title: "Devices ({count})",
    subtitle: "Worst first. Open a device to rename it, set its space, or fix its sensors.",
    addDevice: "Add device",
    /** Follows the sensor's name in bold. */
    warmHint:
      "reads {gap}°F warmer than your other probes. If that sensor sits right next to its board, move it a few inches away on its wires: ESP32 boards run warm and skew the reading.",
    unplaced: {
      one: "{count} device has no space set, so coverage and alerts can't say where it is.",
      other: "{count} devices have no space set, so coverage and alerts can't say where they are.",
    },
    unplacedBulk: "Use Select several below to place a batch at once.",
    unplacedSingle: "Open it to set one.",
    empty: "No devices yet.",
    emptyLink: "Connect your first sensor",
    noSpace: "No space",
    push: "Push",
    pullFeed: "Pull feed",
    disabled: "Disabled",
    health: {
      healthy: "Healthy",
      watch: "Watch",
      at_risk: "At risk",
      offline: "Offline",
    },
    noReading: "No reading",
    firmwareUpdate: "Firmware update available",
    never: "Never",
    battery: "{pct}% battery",
  },
  bulk: {
    summary: "Select several…",
    doThis: "Do this",
    ops: {
      set_space: "Set space",
      enable: "Enable",
      disable: "Disable",
      delete: "Delete",
    },
    space: "Space",
    spacePlaceholder: "Garage",
    apply: "Apply to selected",
    selectAll: "Select all",
    selectUnplaced: "Select ones with no space",
    selectSilent: "Select {count} silent 30+ days",
    noSpace: "no space",
    disabled: "disabled",
    /** confirm() before a bulk delete. */
    confirmDelete: {
      one: "Delete {count} device? This cannot be undone.",
      other: "Delete {count} devices? This cannot be undone.",
    },
  },
  coverage: {
    title: "Protection coverage",
    subtitle: "What each space is watched for, from the sensors on its devices.",
    noGaps: "No gaps found.",
    gapCount: "{gaps} of {total} spaces have a gap.",
    caption: "Monitoring coverage by space",
    spaceColumn: "Space",
    risks: {
      freeze: "Temperature",
      leak: "Leak",
      door: "Door",
      power: "Power",
    },
    states: {
      live: "reporting",
      stale: "not reporting",
      none: "not monitored",
    },
    devices: { one: "{count} device", other: "{count} devices" },
    legend:
      "✓ reporting · ! sensor exists but hasn't reported recently · — not monitored. Spaces come from each device's space setting.",
    /** Name shown for the bucket of devices with no space. */
    unassigned: "No space set",
    gaps: {
      unassigned: "Set a space on these devices so coverage is tracked per room.",
      noTemperature: "No temperature probe: freeze alerts can't cover this space.",
      staleTemperature: "Temperature probe hasn't reported recently, so freeze alerts can't fire here.",
      staleLeak: "Leak sensor hasn't reported recently.",
      noLeakWetSpace: "No leak sensor here, and this kind of space usually has plumbing.",
      staleDoor: "Door sensor hasn't reported recently.",
      stalePower: "Power sensor hasn't reported recently.",
    },
  },
};

export type DevicesListMessages = typeof en;
export default en;

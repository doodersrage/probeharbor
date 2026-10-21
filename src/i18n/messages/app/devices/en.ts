/** Dashboard → Devices page (src/pages/dashboard/devices.astro). */
const en = {
  title: "Devices",
  subtitle: {
    ops: "Every device, worst first. Open one to manage it.",
    pull: "HTTPS JSON feeds we fetch on a schedule.",
    thermostat: "Your house thermostat and indoor reference, for context next to your probes.",
    push: "Connect a new device, or finish setting one up.",
  },
  indoorRefError: {
    saveFailed: "Couldn't save the indoor reference, try again.",
    forbidden: "You don't have permission to change this setting.",
    noHousehold: "No household found.",
  },
  notice: {
    deviceTransferred: "Device moved to the other property.",
    deviceNotFound: "That device isn't in this property anymore.",
    sensorReplaced: {
      one: "Sensor replaced: {count} reading of history moved to the new sensor.",
      other: "Sensor replaced: {count} readings of history moved to the new sensor.",
    },
    deviceDeleted: "Device deleted.",
    bulkDeleted: { one: "Deleted {count} item.", other: "Deleted {count} items." },
    bulkUpdated: { one: "Updated {count} item.", other: "Updated {count} items." },
    bulkError: "Could not complete bulk action. Try again.",
    deviceRenamed: "Device renamed.",
    sensorAdded: "Sensor added.",
    sensorUpdated: "Sensor updated.",
    sensorDeleted: "Sensor deleted.",
    pullSavedDiscovered: "Pull setup saved: imported {count} probe key(s). Rename below if needed.",
    pullSaved: "Pull setup saved.",
    probesSaved: "Probe labels saved.",
    sensorsRenamed: "Sensor names saved.",
    feedDeleted: "Feed deleted.",
    probeDeleted: "Probe deleted.",
    saveFailed: "Could not save changes. Please try again.",
    deviceLimit: "Push device limit reached ({max} per property). Upgrade to add more.",
    viewer: "View-only access: you cannot change devices or feeds.",
    deviceActionFailed: "Could not complete that device action. Check the form and try again.",
    actionFailed: "Could not complete that action ({code}). Please try again.",
    viewPlans: "View plans",
  },
  tabs: {
    ariaLabel: "Device sections",
    ops: "Devices",
    push: "Add device",
    pull: "Pull feeds",
    thermostat: "Thermostat",
  },
  keyCallout: {
    titleRotated: "Save your new ingest key",
    title: "Save your ingest key",
    subtitleReporting:
      "Your device is connected. Keep a copy of the key in case you reflash it; it stays here for 30 minutes.",
    subtitle:
      "Scan the QR, download a pre-filled ESP32 sketch, or copy the URL. This key stays available for 30 minutes and survives refresh until you dismiss it.",
    summaryReporting: "Show key and setup steps",
    summary: "Key and setup steps",
    copySnippet: "Copy snippet",
    qrAria: "Ingest URL QR code",
    ingestUrl: "Ingest URL",
    postJsonTo: "POST JSON to",
    copyUrl: "Copy URL",
    copyKey: "Copy key",
    downloadSvg: "Download SVG",
    printLabel: "Print label",
    dismiss: "I've saved this",
    /** Title of the printable label page. */
    printTitle: "Ingest label",
    /** Label heading when no device name is known. */
    defaultDeviceName: "Push device",
  },
  via: {
    ha: {
      title: "Paste into Home Assistant",
      hint: "Swap in your entity ids, reload YAML, and the first reading lands within 5 minutes. °C sensors are converted for you.",
      guide: "Home Assistant guide",
    },
    esphome: {
      title: "Add to your ESPHome node",
      hint: "Call this from an interval or on_value automation, then flash the node.",
      guide: "ESPHome & Shelly recipes",
    },
    mqtt: {
      title: "Relay MQTT over HTTPS",
      hint: "Keep your broker on the LAN. Import the Node-RED flow and paste this key, or POST like this from any relay.",
      guide: "Node-RED flow",
    },
  },
  waiting: {
    titleWaiting: "Waiting for first POST",
    titleVerify: "Next: verify ingest",
    subtitle:
      "Point firmware at your ingest URL and POST JSON. Sensors auto-import on first POST: rename later if you want.",
    stepCreated: "Push device created",
    stepPost: "First ingest POST",
    statusListening: ": listening…",
    statusSendTest: ", send a test POST",
    sampleSummary: "Sample curl / payload",
    kitGuide: "Hardware kit QR guide",
    checkNow: "Check now",
    metaAuto: "Auto-checking every 5 seconds while this page is open.",
    metaManual: "Send a POST, then click Check now or refresh.",
  },
  wizard: {
    title: "Device setup",
    step: "Step {step} of 2: create a push device, POST JSON (sensors auto-import), then verify readings.",
    createStep: "Create push device",
    postStep: "POST JSON: sensors auto-import; rename afterward if needed",
    showAll: "Show all device settings",
  },
  /** Strings for the page's browser scripts. */
  client: {
    stillWaiting: "Still waiting: last check {time}. Auto-checking every 5 seconds.",
    lastCheck: "Last check {time}.",
    received: ": received!",
    listening: ": listening…",
    checkFailed: "Could not check status, try Check now.",
    couldNotSave: "Could not save.",
    saved: "Saved.",
  },
};

export type DevicesMessages = typeof en;
export default en;

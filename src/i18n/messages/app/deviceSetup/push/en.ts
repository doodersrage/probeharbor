/**
 * Dashboard → Devices: "Add a push device" panel (src/components/dashboard/PushDevicesPanel.astro)
 * and its islands (PushInlineRename, RevealIngestKeyButton).
 */
const en = {
  title: "Add a push device",
  subtitleHtml:
    'ESP32, Pico W, ESPHome, Home Assistant, or anything that can POST JSON. You get an ingest URL; sensors are added automatically from the first upload. Limit: {max} devices per property ({tier}). See <a class="text-link" href="/about/ingest-and-webhooks">ingest docs</a> · <a class="text-link" href="/docs/api">API quick reference</a>.',
  vaultOffHtml:
    "Ingest key recovery (Reveal) is not enabled on this deployment. Copy the key from the 30-minute callout when you create or <strong>Rotate key</strong> on a device card, there is nothing to decrypt later.",
  atLimitHtml:
    'You are at your push device limit. <a class="text-link" href="/dashboard/plans">Upgrade your plan</a> to add more, or delete a device below.',
  name: "Name",
  namePlaceholder: "Garage pipe probe",
  space: "Space",
  spacePlaceholder: "Garage",
  createDevice: "Create device",
  commonSpacesLabel: "Common spaces",
  /** Suggestions shown as chips and in the space datalist; saved as typed. */
  commonSpaces: [
    "Garage",
    "Attic",
    "Crawlspace",
    "Basement",
    "Workshop",
    "Utility room",
    "Shed",
  ],
  firstRunHtml:
    'Use <a class="text-link" href="#devices-first-run">Connect your first sensor</a> above to pick a path.',
  viewOnly: "View-only access: device creation is disabled.",
  otherDevicesHtml: {
    one: 'Your other {count} device is on the <a class="text-link" href="/dashboard/devices?view=ops">Devices</a> tab.',
    other:
      'Your other {count} devices are on the <a class="text-link" href="/dashboard/devices?view=ops">Devices</a> tab.',
  },
  keyPrefix: "key prefix {prefix}…",
  neverSeen: "never seen",
  freshness: {
    offline: "Offline · last seen {age}",
    lagging: "May be offline · last seen {age}",
    updated: "Updated {age}",
  },
  firmware: "firmware {version}",
  updateTo: "Update to {version}",
  labelsFine: "Labels are fine as-is.",
  renameLater: "Rename later",
  noPostsYet: "No POSTs yet: first JSON POST auto-imports sensor keys.",
  waitingKeys: "Waiting for first POST with keys",
  seeChecklist: "See waiting checklist",
  manage: "Manage",
  openDevice: "Open device page →",
  rename: "Rename",
  spaceExamplePlaceholder: "garage, attic, crawlspace…",
  saveSpace: "Save space",
  rotateConfirm:
    "Rotate this ingest key? The old key stops working immediately.",
  rotateKey: "Rotate key",
  moveTo: "Move to",
  transferDevice: "Transfer device",
  deleteConfirm: "Delete this push device and its sensors?",
  delete: "Delete",
  noSensorsYet:
    "No sensors yet: they appear automatically after your first POST. Use Advanced below only if you need to pre-map keys.",
  sensorsList: "Sensors: {list}.",
  editSensors: "Edit sensors, types, and calibration →",
  advancedSummary: "Advanced: map JSON keys manually",
  advancedHint:
    "Optional: skip this if you already POST JSON and let auto-import handle keys.",
  quickPairTitle: "Quick add: temperature + humidity pair",
  quickPairHintHtml:
    "Same JSON key for both (e.g. <code>0</code> or <code>temp1</code>): the usual DHT-style probe.",
  device: "Device",
  jsonKey: "JSON key",
  nameOnHome: "Name on Home",
  pairLabelDefault: "Workshop",
  addPair: "Add pair",
  orAddOne: "Or add one sensor",
  sensorLabelPlaceholder: "Shop door",
  type: "Type",
  addSensor: "Add sensor",
  kindLabels: {
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
  /** Browser strings for the create form script. */
  client: {
    suggestedName: "{space} probe",
  },
  inlineRename: {
    renameImported: "Rename auto-imported sensors",
    quickRename: "Quick rename",
    acceptSuggested: "Accept suggested",
    saving: "Saving…",
    saveNames: "Save names",
    couldNotSave: "Could not save.",
    saved: "Saved.",
  },
  revealKey: {
    loading: "Loading…",
    keyShown: "Key shown below",
    reveal: "Reveal ingest key",
    srKeyFor: "Ingest key for {name}: ",
    copied: "Copied",
    copyKey: "Copy key",
    errorDisabled:
      "Could not reveal key. If recovery is disabled on this server, use Rotate key on the device card.",
    errorNetwork:
      "Could not reveal key. If recovery is disabled, Rotate key on the device card for a new ingest URL.",
    errorCopy: "Could not copy to clipboard.",
  },
};

export type DeviceSetupPushMessages = typeof en;
export type PushInlineRenameText = typeof en.inlineRename;
export type RevealIngestKeyText = typeof en.revealKey;
export default en;

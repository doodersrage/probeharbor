/**
 * /payload-checker copy. `script` strings are read by the client script from a
 * data attribute: `{n}` is a count, `{value}` a device field value.
 * Warnings in the result come from the API and stay English.
 */

const en = {
  title: "Sensor payload checker",
  description:
    "Paste the JSON your ESP32, Arduino, Node-RED flow, or script sends and see exactly which readings ProbeHarbor would store, before you point a live device at it.",
  breadcrumbHome: "Home",
  kicker: "Tool",
  heading: "Will ProbeHarbor understand my sensor?",
  lede: "Paste the JSON your device sends. You'll see each reading it becomes, the sensor type it's filed under, and anything that would be skipped or misread. Nothing is saved, and you don't need an account.",
  apiDocs: "Ingest API docs",
  whichHardware: "Which hardware works?",
  inputTitle: "Your payload",
  tryExample: "Try an example:",
  examples: { flat: "Flat keys", classic: "Classic Arduino", typed: "Typed sensors" },
  jsonBody: "JSON body",
  check: "Check payload",
  resultTitle: "Result",
  tableCaption: "Readings this payload would store",
  colKey: "Key",
  colStoredAs: "Stored as",
  colType: "Type",
  colValue: "Value",
  nextTitle: "When it looks right",
  nextHtml:
    'Create a device in the dashboard to get an ingest key, then POST the same body to <code>/api/ingest/_</code> with an <code>X-Ingest-Key</code> header. The readings appear on the Devices tab within seconds. No code at all? The <a class="text-link" href="/flash">web flasher</a> puts working firmware on an ESP32 from your browser.',
  script: {
    invalidJson: "That isn't valid JSON yet.",
    invalidJsonHint: "Check quotes, commas, and brackets.",
    checkFailed: "Couldn't check that payload.",
    acceptedOne: "Accepted: 1 reading would be stored.",
    acceptedMany: "Accepted: {n} readings would be stored.",
    acceptedOneNotes: "Accepted: 1 reading would be stored, with notes below.",
    acceptedManyNotes: "Accepted: {n} readings would be stored, with notes below.",
    rejected: "Rejected: the endpoint would answer 400.",
    unreachable: "Couldn't reach the checker. Try again in a moment.",
    battery: "battery {value}%",
    signal: "signal {value} dBm",
    firmware: "firmware {value}",
    ignored: "ignored: {value}",
    deviceFields: "Device fields: {value}",
  },
};

export type PayloadCheckerMessages = typeof en;
export default en;

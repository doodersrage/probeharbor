/**
 * /payload-checker copy. `script` strings are read by the client script from a
 * data attribute: `{n}` is a count, `{value}` a device field value.
 * Warnings in the result come from the API and stay English.
 */
import type { PayloadCheckerMessages } from "./en";

const de: PayloadCheckerMessages = {
  title: "Payload-Prüfer für Sensoren",
  description:
    "Füge das JSON deines ESP32, Arduino, Node-RED-Flows oder Skripts ein und sieh, welche Messwerte ProbeHarbor speichern würde, bevor ein echtes Gerät sendet.",
  breadcrumbHome: "Start",
  kicker: "Tool",
  heading: "Versteht ProbeHarbor meinen Sensor?",
  lede: "Füge das JSON ein, das dein Gerät sendet. Du siehst jeden Messwert, der daraus wird, den Sensortyp, unter dem er abgelegt wird, und alles, was übersprungen oder falsch gelesen würde. Nichts wird gespeichert, und du brauchst kein Konto.",
  apiDocs: "Ingest-API-Doku",
  whichHardware: "Welche Hardware funktioniert?",
  inputTitle: "Deine Payload",
  tryExample: "Probier ein Beispiel:",
  examples: { flat: "Flache Schlüssel", classic: "Klassisches Arduino", typed: "Typisierte Sensoren" },
  jsonBody: "JSON-Body",
  check: "Payload prüfen",
  resultTitle: "Ergebnis",
  tableCaption: "Messwerte, die diese Payload speichern würde",
  colKey: "Schlüssel",
  colStoredAs: "Gespeichert als",
  colType: "Typ",
  colValue: "Wert",
  nextTitle: "Wenn alles passt",
  nextHtml:
    'Lege im Dashboard ein Gerät an, um einen Ingest-Schlüssel zu bekommen, und sende denselben Body per POST an <code>/api/ingest/_</code> mit einem <code>X-Ingest-Key</code>-Header. Die Messwerte erscheinen innerhalb von Sekunden im Tab Devices. Gar kein Code? Der <a class="text-link" href="/flash">Web-Flasher</a> spielt direkt aus deinem Browser eine funktionierende Firmware auf einen ESP32.',
  script: {
    invalidJson: "Das ist noch kein gültiges JSON.",
    invalidJsonHint: "Prüfe Anführungszeichen, Kommas und Klammern.",
    checkFailed: "Diese Payload konnte nicht geprüft werden.",
    acceptedOne: "Akzeptiert: 1 Messwert würde gespeichert.",
    acceptedMany: "Akzeptiert: {n} Messwerte würden gespeichert.",
    acceptedOneNotes: "Akzeptiert: 1 Messwert würde gespeichert, mit Hinweisen unten.",
    acceptedManyNotes: "Akzeptiert: {n} Messwerte würden gespeichert, mit Hinweisen unten.",
    rejected: "Abgelehnt: Der Endpunkt würde mit 400 antworten.",
    unreachable: "Der Prüfer ist nicht erreichbar. Versuch es gleich noch einmal.",
    battery: "Akku {value} %",
    signal: "Signal {value} dBm",
    firmware: "Firmware {value}",
    ignored: "ignoriert: {value}",
    deviceFields: "Gerätefelder: {value}",
  },
};

export default de;

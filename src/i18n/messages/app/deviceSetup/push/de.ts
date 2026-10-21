import type { DeviceSetupPushMessages } from "./en";

const de: DeviceSetupPushMessages = {
  title: "Push-Gerät hinzufügen",
  subtitleHtml:
    'ESP32, Pico W, ESPHome, Home Assistant oder alles, was JSON per POST senden kann. Du bekommst eine Ingest-URL; Sensoren werden beim ersten Upload automatisch angelegt. Limit: {max} Geräte pro Objekt ({tier}). Siehe <a class="text-link" href="/about/ingest-and-webhooks">Ingest-Doku</a> · <a class="text-link" href="/docs/api">API-Kurzreferenz</a>.',
  vaultOffHtml:
    "Die Wiederherstellung von Ingest-Schlüsseln (Anzeigen) ist auf dieser Installation nicht aktiviert. Kopiere den Schlüssel aus dem 30-Minuten-Hinweis, wenn du ein Gerät anlegst oder auf der Gerätekarte <strong>Schlüssel erneuern</strong> wählst – später gibt es nichts zu entschlüsseln.",
  atLimitHtml:
    'Du hast dein Limit für Push-Geräte erreicht. <a class="text-link" href="/dashboard/plans">Wechsle deinen Tarif</a>, um weitere hinzuzufügen, oder lösche unten ein Gerät.',
  name: "Name",
  namePlaceholder: "Garagen-Rohrfühler",
  space: "Bereich",
  spacePlaceholder: "Garage",
  createDevice: "Gerät anlegen",
  commonSpacesLabel: "Häufige Bereiche",
  commonSpaces: [
    "Garage",
    "Dachboden",
    "Kriechkeller",
    "Keller",
    "Werkstatt",
    "Hauswirtschaftsraum",
    "Schuppen",
  ],
  firstRunHtml:
    'Nutze oben <a class="text-link" href="#devices-first-run">Ersten Sensor verbinden</a>, um einen Weg auszuwählen.',
  viewOnly: "Nur-Lese-Zugriff: Geräte können nicht angelegt werden.",
  otherDevicesHtml: {
    one: '{count} weiteres Gerät findest du im Tab <a class="text-link" href="/dashboard/devices?view=ops">Geräte</a>.',
    other:
      '{count} weitere Geräte findest du im Tab <a class="text-link" href="/dashboard/devices?view=ops">Geräte</a>.',
  },
  keyPrefix: "Schlüsselpräfix {prefix}…",
  neverSeen: "noch nie gesehen",
  freshness: {
    offline: "Offline · zuletzt gesehen {age}",
    lagging: "Evtl. offline · zuletzt gesehen {age}",
    updated: "Aktualisiert {age}",
  },
  firmware: "Firmware {version}",
  updateTo: "Auf {version} aktualisieren",
  labelsFine: "Die Bezeichnungen passen so.",
  renameLater: "Später umbenennen",
  noPostsYet:
    "Noch keine POSTs: Der erste JSON-POST importiert die Sensorschlüssel automatisch.",
  waitingKeys: "Warte auf den ersten POST mit den Schlüsseln",
  seeChecklist: "Checkliste ansehen",
  manage: "Verwalten",
  openDevice: "Geräteseite öffnen →",
  rename: "Umbenennen",
  spaceExamplePlaceholder: "Garage, Dachboden, Kriechkeller…",
  saveSpace: "Bereich speichern",
  rotateConfirm:
    "Diesen Ingest-Schlüssel erneuern? Der alte Schlüssel funktioniert sofort nicht mehr.",
  rotateKey: "Schlüssel erneuern",
  moveTo: "Verschieben nach",
  transferDevice: "Gerät übertragen",
  deleteConfirm: "Dieses Push-Gerät und seine Sensoren löschen?",
  delete: "Löschen",
  noSensorsYet:
    "Noch keine Sensoren: Sie erscheinen automatisch nach deinem ersten POST. Nutze „Erweitert“ unten nur, wenn du Schlüssel vorab zuordnen musst.",
  sensorsList: "Sensoren: {list}.",
  editSensors: "Sensoren, Typen und Kalibrierung bearbeiten →",
  advancedSummary: "Erweitert: JSON-Schlüssel manuell zuordnen",
  advancedHint:
    "Optional: Überspringe das, wenn du bereits JSON per POST sendest und der Auto-Import die Schlüssel übernimmt.",
  quickPairTitle: "Schnell hinzufügen: Paar aus Temperatur + Luftfeuchte",
  quickPairHintHtml:
    "Derselbe JSON-Schlüssel für beide (z. B. <code>0</code> oder <code>temp1</code>): der übliche DHT-Fühler.",
  device: "Gerät",
  jsonKey: "JSON-Schlüssel",
  nameOnHome: "Name auf Start",
  pairLabelDefault: "Werkstatt",
  addPair: "Paar hinzufügen",
  orAddOne: "Oder einen einzelnen Sensor hinzufügen",
  sensorLabelPlaceholder: "Werkstatttür",
  type: "Typ",
  addSensor: "Sensor hinzufügen",
  kindLabels: {
    temperature: "Temperatur",
    humidity: "Luftfeuchte",
    co2: "CO₂",
    pressure: "Luftdruck",
    pm25: "PM2,5",
    voc: "VOC",
    level: "Wasser- / Pumpensumpfpegel",
    energy: "Energie",
    door: "Tür",
    power: "Strom",
    flood: "Überflutung / Leck",
    motion: "Bewegung",
    generic: "Allgemein",
  },
  client: {
    suggestedName: "Fühler {space}",
  },
  inlineRename: {
    renameImported: "Automatisch importierte Sensoren umbenennen",
    quickRename: "Schnell umbenennen",
    acceptSuggested: "Vorschläge übernehmen",
    saving: "Wird gespeichert…",
    saveNames: "Namen speichern",
    couldNotSave: "Speichern fehlgeschlagen.",
    saved: "Gespeichert.",
  },
  revealKey: {
    loading: "Wird geladen…",
    keyShown: "Schlüssel unten angezeigt",
    reveal: "Ingest-Schlüssel anzeigen",
    srKeyFor: "Ingest-Schlüssel für {name}: ",
    copied: "Kopiert",
    copyKey: "Schlüssel kopieren",
    errorDisabled:
      "Schlüssel konnte nicht angezeigt werden. Ist die Wiederherstellung auf diesem Server deaktiviert, nutze „Schlüssel erneuern“ auf der Gerätekarte.",
    errorNetwork:
      "Schlüssel konnte nicht angezeigt werden. Ist die Wiederherstellung deaktiviert, nutze „Schlüssel erneuern“ auf der Gerätekarte für eine neue Ingest-URL.",
    errorCopy: "Kopieren in die Zwischenablage fehlgeschlagen.",
  },
};

export default de;

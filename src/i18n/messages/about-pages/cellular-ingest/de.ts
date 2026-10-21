
/** Body copy for /about/cellular-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

const de: Messages = {
  introHtml:
    "Hütten, Brunnen und Nebengebäude haben oft Strom, aber kein WLAN aus der Garage. Ein <strong>Particle Boron</strong> (oder B-Series) mit LTE sendet dasselbe Ingest-JSON per POST über einen <strong>Particle-Console-Webhook</strong>. Mobilfunkaussetzer sind normal: ProbeHarbor markiert Sonden ohnehin als veraltet, wenn keine Daten mehr kommen, du brauchst also keine aggressive Wiederholungsflut auf dem Gerät.",
  bluesHtml:
    "Lieber Blues? Eine Route mit <strong>Notecard</strong> + Notehub kann dasselbe JSON weiterleiten; der Boron-Sketch ist aber der Standard-Download unter Devices.",
  partsTitle: "Teile",
  partsCaption: "Teile für eine Frostsonde mit Mobilfunk",
  colPart: "Teil",
  colWhy: "Wozu",
  colBuy: "Kaufen",
  boronWhy: "LTE-M / NB-IoT (SKU je nach Region). Nano-SIM oder Particle-SIM-Tarif erforderlich.",
  probePart: "Wasserdichter DS18B20",
  probeWhyHtml: "Sonde für Rohr oder Kriechkeller. Daten an <strong>D2</strong>.",
  resistorPart: "4.7kΩ-Widerstand",
  resistorWhy: "Pull-up von der DS18B20-Datenleitung auf 3.3V.",
  planPart: "Mobilfunktarif",
  planWhy: "Particle Cloud + Datenvolumen des Netzbetreibers. Plane das Budget für abgelegene Standorte, die nur stündlich aufwachen.",
  planBuy: "Abrechnung über die Particle Console oder deine eigene Nano-SIM, sofern die SKU das erlaubt.",
  bluesPart: "Optional: Blues Notecard",
  bluesWhy: "Alternativer Mobilfunkweg über eine Notehub-Webhook-Route (gleiche Ingest-URL).",
  wiringTitle: "Verdrahtung",
  wiringHtml: [
    "DS18B20 VDD → Boron <strong>3V3</strong>",
    "DS18B20 GND → GND",
    "DS18B20-Daten → <strong>D2</strong>, 4.7k auf 3V3",
    "USB zum Flashen und für die serielle Ausgabe mit 115200; Antenne vor dem Einsatz vor Ort anschließen",
  ],
  flashTitle: "Flashen und Webhook",
  stepsHtml: [
    'Öffne <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> und lade <strong>Particle Boron .ino</strong> sowie das Webhook-JSON herunter (Ingest-URL bereits eingetragen).',
    "Flashe mit Particle Workbench oder der Web IDE (Device OS 5+). Bibliotheken: <code>OneWire</code>, <code>spark-dallas-temperature</code>.",
    "Console → Integrations → Webhook: Event <code>probeharbor_ingest</code>, POST an deine Ingest-URL, das heruntergeladene Webhook-JSON verwenden (oder den Body auf den Wert des Particle-Events setzen), Content-Type <code>application/json</code>.",
    "Seriell mit 115200: <code>publish ok</code>. Der Webhook-Verlauf sollte HTTP 200 zeigen. Der Sensorschlüssel <code>temp1</code> wird beim ersten erfolgreichen POST übernommen.",
  ],
  repoLead: "Im Repo:",
  dropoutsTitle: "Aussetzer und veraltete Sonden",
  dropoutsHtml:
    'LTE verpasst bei Unwetter, Roaming oder leerem Prepaid-Guthaben Intervalle. Sende bei bestehender Verbindung etwa einmal pro Minute; lass die <a class="text-link" href="/about/debugging-stale-readings">Erkennung veralteter Messwerte</a> und die Frostalarme die Funkstille abdecken. Verschwende keinen Akku mit engen Wiederverbindungsschleifen.',
  relatedTitle: "Weiterlesen",
  related: {
    addingDevices: "Geräte hinzufügen",
    stale: "Veraltete Messwerte debuggen",
    teensy: "Teensy 4.1 mit Ethernet",
    pic18: "PIC18F67J60 mit Ethernet",
    allSketches: "Alle Sketches ↗",
  },
};

export default de;

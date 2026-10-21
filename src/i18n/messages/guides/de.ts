import type { AboutFaqItem } from "../../../lib/aboutFaqs";

/**
 * /guides hub copy. Category/link text lives in `src/i18n/content/guideHub/`.
 * `photoLabels` are keyed by `guidesHubPhotos` id (src/lib/aboutPhotos.ts);
 * `alsoUseful` is keyed by href.
 */
import type { GuidesMessages } from "./en";

const de: GuidesMessages = {
  title: "Anleitungen",
  description:
    "ProbeHarbor-Anleitungen nach Aufgabe: Hardware, Frost- und Hochwasser-/Leckalarme, Haushaltsfreigabe und HTTP-API, dazu alle Artikel in einer Bibliothek.",
  breadcrumbHome: "Startseite",
  breadcrumbPage: "Anleitungen",
  kicker: "Anleitungen",
  headerTitle: "Sonden, Frost-/Hochwasseralarme, Freigaben und die API einrichten",
  lede: "Fang mit der Aufgabe an, die du erledigen willst. Hardware, Frost- und Hochwasser-/Leckalarme, Haushaltsfreigabe und Ingest-/API-Dokumentation an einem Ort; danach kannst du alle Artikel durchstöbern, wenn du jede Anleitung sehen willst.",
  startFree: "Kostenlos starten",
  allArticles: "Alle Artikel",
  esp32Kit: "ESP32-Frost-Kit",
  photoLabels: {
    "dht22-module": "Hardware einrichten",
    "arduino-uno-board": "Arduino & Firmware",
    "attic-insulation": "Alarme & Frost",
    "ethernet-cable": "Integrationen & API",
  },
  alsoRelevant: "Auch relevant für:",
  alsoUsefulTitle: "Ebenfalls nützlich",
  alsoUsefulSubtitle: "Szenarien, Vergleiche und Integrationen ergänzen die Anleitungsbibliothek.",
  alsoUseful: {
    "/stories": {
      label: "Szenarien",
      summary: "Beispielhafte Abläufe bei Frost, Leck und Hitze, Alarm für Alarm.",
    },
    "/compare": {
      label: "Alternativen vergleichen",
      summary: "ProbeHarbor im Vergleich zu DIY-MQTT, Govee, Tempest, Nest, Ecobee und anderen.",
    },
    "/integrations": {
      label: "Integrationen",
      summary: "Home Assistant, Matter, Node-RED, Influx, MQTT und Webhooks.",
    },
    "/accessories": {
      label: "Zubehör",
      summary: "Claim Puck, Alarmleuchte, Tür-/Leck-/Stromkontakte, Kit-Etiketten, Halterungen.",
    },
    "/gift": {
      label: "Geschenk / Empfehlung",
      summary: "Teile einen Einladungslink: Die eingeladene Person bekommt zusätzliche Pro-Testtage, und du auch, sobald sie ein Abo abschließt.",
    },
  },
  itemListName: "ProbeHarbor-Anleitungen nach Aufgabe",
  itemListDescription:
    "Anleitungen zu Hardware-Einrichtung, Frost- und Hochwasseralarmen, Haushaltsfreigabe und API.",
  faqLede: "Kurze Antworten, bevor du in eine Kategorie einsteigst.",
  faqs: [
    {
      question: "Wo fange ich am besten an?",
      answer:
        "Wähle unten eine Aufgabe: Hardware einrichten (ESP32-Frost-Kit), Frost-/Hochwasseralarme, Haushaltsfreigabe oder die HTTP-API. Oder öffne die komplette About-Bibliothek.",
    },
    {
      question: "Verkauft ihr Hardware-Kits?",
      answer:
        "Nein. ProbeHarbor ist Software. Kauf die Teile bei Adafruit oder Amazon anhand der Stückliste des ESP32-Frost-Kits und der Zubehörseiten und flashe dann einen vorausgefüllten Sketch unter Devices.",
    },
    {
      question: "Wo finde ich Beispielszenarien und Vergleiche?",
      answer:
        "Beispielhafte Szenarien zu Frost, Leck und Hitze: probeharbor.dev/stories. Im Vergleich zu DIY-MQTT, Govee, Tempest, Nest und Ecobee: probeharbor.dev/compare. Home Assistant: probeharbor.dev/integrations.",
    },
  ],
};

export default de;

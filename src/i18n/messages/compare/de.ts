import type { AboutPhotoId } from "../../../lib/aboutPhotos";

/**
 * /compare hub copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <strong>); keep hrefs English, middleware localizes them.
 */
type Row = { capabilityHtml: string; probeharborHtml: string; diyHtml: string; consumerHtml: string };
import type { CompareMessages } from "./en";

const de: CompareMessages = {
  title: "Überwachungslösungen im Vergleich",
  description:
    "ProbeHarbor vs. Temp Stick, YoLink, SensorPush, Shelly, Govee, Eigenbau-MQTT, Tempest, Nest und Ecobee für Frost- und Leckalarme in unbeheizten Räumen.",
  breadcrumbHome: "Startseite",
  breadcrumbCompare: "Vergleich",
  kicker: "Vergleich",
  headerTitle: "Gebaut für Hausbesitzer, nicht für Heimserver",
  headerLede:
    "ProbeHarbor bietet Live-Fühler, Frost- und Hochwasser-/Leckalarme und optional SMS, ohne dass du eigene Infrastruktur betreiben musst. Planlimits und die Free/Member/Pro/Portfolio-Übersicht findest du unter Preise; diese Seite vergleicht ProbeHarbor mit anderen Ansätzen.",
  seePlansPricing: "Pläne & Preise ansehen",
  startFree: "Kostenlos starten",
  photoLabels: {
    "network-switch": "vs. Eigenbau-MQTT",
    "home-workshop": "vs. Govee / SmartThings",
    "frozen-thermometer": "vs. Tempest",
    "utility-pipes": "vs. TempStick",
    crawlspace: "vs. Nest / Ecobee",
  },
  guides: {
    title: "Ausführliche Vergleiche",
    subtitle: "Direkte Gegenüberstellungen gängiger Alternativen: Wartungsaufwand, Alarme und wann welche Lösung passt.",
    smartThingsHtml:
      '<strong class="text-[var(--color-text)]">SmartThings</strong> kann ProbeHarbor-Sensoren über die <a class="text-link" href="/integrations/smartthings">Matter-Bridge</a> einbinden (ohne Cloud-to-Cloud-App). Fertige Consumer-Sensoren behandeln wir weiterhin zusammen mit Govee: <a class="text-link" href="/compare/govee">Govee-Vergleich</a>.',
    haTitle: "Home Assistant (HACS)",
    haCopyHtml:
      'Ergänzung, keine Konkurrenz: Lass HA im Heimnetz laufen und nutze ProbeHarbor für Frost- und Leck-SMS an den ganzen Haushalt, Verlauf und Alarme von außerhalb. Die offizielle HACS-Integration und Hinweise zum Parallelbetrieb mit MQTT stehen auf der <a class="text-link" href="/integrations/home-assistant">Home-Assistant-Seite</a>; schau dir auch <a class="text-link" href="/compare/diy-mqtt">vs. Eigenbau-MQTT</a> an, wenn du einen komplett selbst gehosteten Stack abwägst.',
  },
  table: {
    title: "ProbeHarbor vs. Alternativen",
    caption: "ProbeHarbor im Vergleich zu Eigenbau-Skripten und Govee oder SmartThings",
    capability: "Funktion",
    probeharbor: "ProbeHarbor",
    diy: "Eigenes Skript + Cron",
    consumer: "Govee / SmartThings",
    rows: [
      { capabilityHtml: "Zeit bis zum Frost (in diesem Raum)", probeharborHtml: "Prognosebasierter Countdown + Alarm mit Reststunden", diyHtml: "Modell schreibst du selbst", consumerHtml: "Nur Schwellenwert" },
      { capabilityHtml: "Frostalarme (E-Mail/SMS/Push)", probeharborHtml: "Integriert, pro Haushalt", diyHtml: "Twilio + Cron verdrahtest du selbst", consumerHtml: "App-Push; SMS extra oder gar nicht" },
      { capabilityHtml: "Datenversand von ESP/Arduino", probeharborHtml: "Einmaliger Geräteschlüssel", diyHtml: "Eigener Endpunkt", consumerHtml: "Govee-Sensoren / SmartThings-Geräte" },
      { capabilityHtml: "Verlauf &amp; CSV-Export", probeharborHtml: "In den Bezahlplänen", diyHtml: "Selbst gehostete Datenbank", consumerHtml: "Abostufen" },
      { capabilityHtml: "Freigabelinks &amp; Grafana", probeharborHtml: "1 Live-Link für die Familie; Pro ergänzt Verlauf/Metriken", diyHtml: "Manuelle Einrichtung", consumerHtml: "Selten bei Consumer-Apps" },
      { capabilityHtml: "Home Assistant (HACS)", probeharborHtml: '<a class="text-link" href="/integrations/home-assistant">Offizielle Integration</a> (Freigabelink)', diyHtml: "REST-Sensoren + Webhooks", consumerHtml: "Je nach Hersteller" },
      { capabilityHtml: "Mehrere Nutzer pro Haushalt", probeharborHtml: "Kostenlos", diyHtml: "Entfällt", consumerHtml: "Teilen in der Familie ist umständlich" },
      { capabilityHtml: "Hosting &amp; Verfügbarkeit", probeharborHtml: 'Cloudflare-Edge; <a class="text-link" href="/system-status">öffentliche Statusseite</a>', diyHtml: "VPS / Cron betreibst du selbst", consumerHtml: "Hersteller-Cloud (undurchsichtig)" },
    ],
  },
  screenshotCaption: "Das bekommst du, ohne einen eigenen Stack zu betreiben: Fühlerkurven gegen deine Frostschwelle.",
  audience: {
    title: "Für wen es gedacht ist",
    itemsHtml: [
      "<strong>Free</strong>: ein Objekt, Live-Diagramme, Alarme per E-Mail und Chat und ein Live-Link für die Familie, während du testest.",
      "<strong>Member</strong>: CSV-Verlauf und mehr Geräte für eine ganze Kältesaison.",
      '<strong>Pro</strong>: SMS, Hauskontext von Nest/Ecobee, unbegrenzte Freigaben, <a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a>, <a class="text-link" href="/claims-pack">Schadensdokumentation</a> und Webhooks, wenn jemand um 2 Uhr nachts aufwachen muss. Free enthält bereits einen Live-Link für die Familie. Für Datenversand und Metriken siehe die <a class="text-link" href="/docs/api">HTTP-API</a>.',
      '<strong>Portfolio</strong>: für größere Bestände mit mehr Objekten, als Pro erlaubt, mit Zugängen für Hausverwaltungen. Details unter <a class="text-link" href="/pricing#portfolio">Preise</a> und <a class="text-link" href="/property-management">Hausverwaltung</a>.',
    ],
    startFree: "Kostenlos starten, ohne Kreditkarte",
    seePrices: "Planpreise ansehen",
    readScenario: "Ein Frost-Szenario lesen",
  },
  limits: {
    title: "Planlimits stehen unter Preise",
    subtitle:
      "Geräteanzahl, Speicherdauer, Nest/Ecobee, Zugänge für Hausverwaltungen sowie Free vs. Member vs. Pro vs. Portfolio vergleichen wir auf der Preisseite, damit sich diese Seite auf Alternativen konzentriert und keine zweite Planübersicht braucht.",
    openComparison: "Planvergleich öffnen",
    createAccount: "Kostenloses Konto erstellen",
  },
};

export default de;

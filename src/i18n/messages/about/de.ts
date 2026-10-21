/**
 * About hub (/about) copy. Keys ending in `Html` hold trusted inline HTML and
 * are rendered with `set:html`; keep hrefs English, middleware localizes them.
 */
import type { AboutMessages } from "./en";

const de: AboutMessages = {
  layoutTitle: "Über uns",
  title: "Über ProbeHarbor",
  description:
    "Anleitungen zu Temperaturfühlern, Frost- und Wasseralarmen, Arduino-Firmware, ESP-Ingest, Teilen im Haushalt und dem Monitoring-Stack hinter ProbeHarbor.",
  breadcrumbHome: "Start",
  breadcrumbAbout: "Über uns",
  kicker: "Über uns",
  lede: "Open-Source-Anleitungen zu Fühlern, Frost- und Wasseralarmen, Firmware und dem Stack hinter ProbeHarbor. Lieber eine kürzere Liste? Starte im Anleitungs-Hub.",
  startFree: "Kostenlos starten",
  guidesHub: "Anleitungs-Hub",
  findTitle: "Anleitung finden",
  findSubtitle: `Durchsuche {count} Artikel oder stöbere unten nach Lernpfad.`,
  probe: {
    eyebrow: "Live-Simulation",
    title: "Drei Fühler, ein Raum",
    lede: "Sieh zu, wie sich Temperatur und Luftfeuchte Zone für Zone verändern, wenn Sonneneinstrahlung, Außenluft und Luftzug wechseln – genau wie im Live-JSON-Feed.",
  },
  repos: {
    title: "Open-Source-Repositories",
    subtitleHtml:
      'Projekte, die du dir ansehen, forken oder für deinen eigenen Aufbau anpassen kannst. Programmatische Integrationen beginnen mit der <a class="text-link" href="/docs/api">HTTP-API</a> und <a class="text-link" href="/openapi.yaml">openapi.yaml</a>.',
    firmware: "Arduino-Sketch und Sensor-Firmware",
    website: "Diese Website (Astro auf Cloudflare): mit Beispiel-Sketches für Sensoren",
    relay: "Relay für den JSON-Feed (FastAPI mit Redis-Caching)",
  },
  faqLede: "Kurze Antworten, bevor du in eine Anleitung eintauchst.",
  faqs: [
    {
      question: "Was decken die Anleitungen unter „Über uns“ ab?",
      answer:
        "Platzierung der Fühler, Verkabelung von DHT22 und Arduino, Frostschwellen, Wasser- und Leckkontakte, Ingest-APIs, Teilen im Haushalt, PWA-Installation und wie ProbeHarbor Messwerte speichert und darstellt.",
    },
    {
      question: "Womit fange ich an?",
      answer:
        "Wähle auf dieser Seite einen Pfad nach Aufgabe (Frostschutz, Wasser- und Leckerkennung, Verkabelung, Ingest, Fehlersuche oder Einrichtung für den Haushalt) oder durchsuche den kompletten Anleitungsindex.",
    },
    {
      question: "Ist ProbeHarbor Open Source?",
      answer:
        "Ja: Die Repositories für Anwendung und Firmware sind von diesem Hub aus verlinkt, damit du den Stack ansehen, forken oder anpassen kannst.",
    },
    {
      question: "Wo läuft ProbeHarbor?",
      answer:
        "Die Website und die Ingest-APIs laufen am Edge von Cloudflare (Workers). Den Live-Zustand von Jobs und Ingest findest du unter /system-status: Wir veröffentlichen gemessene Werte statt einer Marketing-Verfügbarkeitsquote. Details zum Stack: /about/astro-applications.",
    },
  ],
};

export default de;

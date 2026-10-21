
/** /about/probe-demo page copy (the simulator island's strings live in messages/probeDemo.ts). */
import type { ProbeDemoPageMessages } from "./en";

const de: ProbeDemoPageMessages = {
  title: "Interaktive Fühler-Demo",
  description:
    "Simuliere Temperaturen in mehreren Garagenzonen. Stell Außenluft, Sonne, Torstatus und Frostschwelle mit derselben Logik wie im echten Betrieb ein.",
  breadcrumbHome: "Startseite",
  breadcrumbAbout: "Über",
  kicker: "Über · Simulator",
  ctaTryReal: "Will ich für meine Garage",
  ctaColdSnap: "Zum Kälteeinbruch",
  ctaKit: "ESP32-Frostkit",
  heroNoteHtml:
    'Lös die Änderung selbst aus: Klick auf <strong>Zugluft am Tor</strong> und sieh zu, wie der Tor-/Eingangsbereich gegenüber der Werkbank abfällt, oder auf <strong>Kälteeinbruch</strong> für Frostgefahr wie in Overview. Die Messwerte aktualisieren sich alle zwei Sekunden mit sensortypischem Rauschen. Kopiere das <strong>Push ingest</strong>-JSON für dieselben flachen Schlüssel, die ein ESP per POST senden würde. Theorie zur Platzierung: <a class="text-link" href="/about/temperature-probes">Temperaturfühler</a> und <a class="text-link" href="/about/temperature-changes">was Schwankungen verursacht</a>.',
  figureCaption:
    "Eine echte Werkbank: Im Simulator oben ist die Werkbank-/Werkzeugbank-Ecke die wärmste Zone. Ein Fühler nur dort kann unauffällig wirken, während der Torbereich schon nahe am Frost ist.",
  faqTitle: "FAQ zur Fühler-Demo",
  paginationAria: "Seiten im Bereich Über",
  prev: "Leitfaden Temperaturfühler",
  next: "Geräte hinzufügen",
};

export default de;

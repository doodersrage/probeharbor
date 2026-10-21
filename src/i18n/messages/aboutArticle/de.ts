type ProductCta = { title: string; body: string; label: string };

/**
 * Shared chrome around every /about/* article: breadcrumbs, pagination,
 * topic sidebar, related guides, learning-path strip, product CTA, convert bar,
 * hub sections (journeys, quick start, topic nav) and the client islands.
 */
import type { AboutArticleMessages } from "./en";

const de: AboutArticleMessages = {
  breadcrumbHome: "Start",
  breadcrumbAbout: "Über uns",
  breadcrumbLabel: "Brotkrümelnavigation",
  ogSectionFallback: "Anleitungen",
  faqHeading: "Häufige Fragen",
  paginationLabel: "Seiten im Bereich „Über uns“",
  aboutOverview: "Übersicht „Über uns“",
  backToOverview: "Zurück zur Übersicht",
  convertBar: {
    label: "ProbeHarbor ausprobieren",
    copyHtml: "<strong>Live-Demo</strong>, ohne Konto. Bereit, Fühler anzuschließen? Für immer kostenlos, ohne Karte.",
    demo: "Live-Demo ausprobieren",
    startFree: "Kostenlos starten",
  },
  sidebar: {
    label: "Anleitungen zu diesem Thema",
    inThisTopic: "In diesem Thema",
    relatedLabel: "Verwandte Anleitungen",
    backToOverview: "← Zurück zur Übersicht",
    guidesHub: "Anleitungs-Hub",
    allArticles: "Alle Artikel",
  },
  related: {
    title: "Verwandte Anleitungen",
    moreUnder: "Mehr unter",
  },
  journeyStrip: {
    label: "Lernpfad",
    path: "Pfad:",
    step: `Schritt {n} von {total}`,
    next: `Weiter: {label} →`,
  },
  journeys: {
    title: "Wähle einen Pfad",
    subtitle:
      "Aufgabenbezogene Wege durch die Anleitungen: Starte mit dem Ergebnis, das dir wichtig ist, und vertiefe dann die Themen.",
    startFree: "Kostenlos starten",
  },
  quickStart: {
    title: "Hier starten",
    lead: "Beliebte Einstiegspunkte: Notfallpläne, Demo, Ingest, Kanäle und Teilen im Haushalt.",
  },
  hubNav: {
    label: "Themen im Bereich „Über uns“",
    title: "Nach Thema stöbern",
    lead: `{core} Themenübersichten und {guides} vertiefende Anleitungen in fünf Lernpfaden. Suche oben oder springe unten zu einem Abschnitt.`,
    topics: { one: "Thema", other: "Themen" },
    guides: "Anleitungen",
    readOverview: "Übersicht lesen",
    deepDive: "Vertiefende Anleitungen",
  },
  productCta: {
    liveDemo: "Live-Demo",
    seePlans: "Tarife ansehen",
    fallback: {
      title: "Richte das in ProbeHarbor ein",
      body: "Für immer kostenlos, ohne Kreditkarte: Fühler, Frost- und Leckalarme und Verlauf im Blick, ohne eigenen Server.",
      label: "Kostenloses Konto erstellen",
    },
    bySlug: {
      "cold-snap-playbook": {
        title: "Setze den Plan in die Praxis um",
        body: "Lege die Frostschwelle in °F und die E-Mail unter Alerts → When to alert fest oder schließe nach dem ersten Ingest die Karte auf Devices ab.",
        label: "Alarmeinstellungen öffnen",
      },
      "alert-channel-cookbook": {
        title: "Richte deine Kanäle ein",
        body: "Beginne mit E-Mail unter Alerts → How you're told und ergänze Chat-Apps oder Pro-SMS, wenn du nachts lautere Alarme brauchst.",
        label: "Alarmeinstellungen öffnen",
      },
      "household-sharing-walkthrough": {
        title: "Lade deinen Haushalt ein",
        body: "Teile Live-Fühler per Einladung oder schicke einen kostenlosen Familien-Live-Link an alle, auch ohne Konto.",
        label: "Freigabelinks öffnen",
      },
      "freeze-protection-thresholds": {
        title: "Lege deine Frostschwelle fest",
        body: "Starte die Überwachung mit einer Schwelle, die zu deiner kältesten Zone passt.",
        label: "Schwelle festlegen",
      },
      "ingest-and-webhooks": {
        title: "Geräteschlüssel hinzufügen",
        body: "Erstelle auf der Seite Devices Zugangsdaten für Push-Ingest und sende einen Testmesswert.",
        label: "Geräte öffnen",
      },
      "adding-devices": {
        title: "Erstelle deinen kostenlosen Geräteschlüssel",
        body: "Für immer kostenlos, ohne Kreditkarte: Öffne Devices, erstelle einen Push-Schlüssel und sende per POST einen Testmesswert.",
        label: "Kostenlos starten",
      },
      "dht22-sensor-overview": {
        title: "Sieh es auf einem Live-Dashboard",
        body: "Erstelle ein kostenloses Konto (ohne Karte), ordne deine Fühlerschlüssel zu und behalte das Frost- und Leckrisiko über Nacht im Blick.",
        label: "Kostenlos starten",
      },
    },
  },
  search: {
    label: "Anleitungen durchsuchen",
    placeholder: "Fühlerverkabelung, CSV-Export, Ingest-API, Alarme…",
    featured: "Beliebte Einstiegspunkte",
    noMatchBefore: "Keine Anleitung passt zu „",
    noMatchAfter: "“.",
  },
  probeActivity: {
    northWall: "Nordwand",
    doorZone: "Torbereich",
    workbench: "Werkbank",
    sunLoad: "Sonne {n} %",
    bayInterior: "Garageninnenraum",
    outside: "{t} außen",
    humidity: "{n} % rF",
    feed: "JSON-Feed → Website-Dashboard",
    staticPreview: "Statische Vorschau",
    simulated: "Simulierte Fühleraktivität",
    ariaLabel:
      "Animierter Querschnitt einer Garage: drei Temperaturfühler melden Live-Messwerte, ein Tor öffnet und schließt sich, die Sonneneinstrahlung ändert sich und Datenimpulse wandern zum Website-Dashboard.",
    caption:
      "Die Fühler an Nordwand, Torbereich und Werkbank aktualisieren sich alle paar Sekunden – im selben Takt wie der Feed des Live-Dashboards.",
    celsius: true,
  },
};

export default de;

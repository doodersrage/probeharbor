import type { ShellMessages } from "./en";

const de: ShellMessages = {
  defaultTitle: "Dashboard",
  nav: {
    overview: "Übersicht",
    live: "Live",
    portfolio: "Portfolio",
    devices: "Geräte",
    alerts: "Alarme",
    history: "Verlauf",
    household: "Haushalt",
    share: "Teilen",
    plans: "Tarife",
    settings: "Einstellungen",
    ops: "Betrieb",
    dashboard: "Dashboard",
  },
  sidebar: {
    ariaLabel: "Dashboard",
    mobileAriaLabel: "Überwachung – Schnellzugriff",
    menu: "Menü",
    groups: { monitor: "Überwachung", account: "Konto", admin: "Admin" },
    unhandledBadge: "{count} unbearbeitet",
    laggingProbes: "Fühler mit Verzögerung",
    search: "Suchen",
    refresh: "Aktualisieren",
    backToSite: "Zur Website",
    signOut: "Abmelden",
  },
  topbar: {
    noReading: "Kein Messwert",
    refresh: "Aktualisieren",
    switched: "Aktives Objekt gewechselt.",
    switchError: "Objekt konnte nicht gewechselt werden. Bitte versuch es noch einmal.",
  },
  kiosk: {
    enter: "Kioskmodus",
    exit: "Kiosk beenden",
    enterTitle: "Kiosk-/Werkstattmodus – Vollbild, Bildschirm bleibt an",
    exitTitle: "Kiosk-/Werkstattmodus beenden",
  },
  switcher: {
    activeProperty: "Aktives Objekt",
    selectHousehold: "Haushalt auswählen",
    switchHousehold: "Haushalt wechseln",
    property: "Objekt",
  },
  roles: {
    owner: "Eigentümer",
    member: "Bearbeiter",
    viewer: "Betrachter",
    alert_only: "Nur Alarme",
    property_manager: "Objektverwaltung",
  },
  readingAge: {
    never: "Nie",
  },
  unacked: {
    label: { one: "unbearbeiteter Alarm.", other: "unbearbeitete Alarme." },
    review: "Ansehen",
    claimsPack: "Nachweispaket für die Versicherung herunterladen",
  },
  lowBattery: {
    deviceHealth: "Gerätezustand",
    alertSettings: "Alarmeinstellungen",
  },
  adminTabs: {
    ariaLabel: "Admin-Bereiche",
    ops: "Übersicht",
    feeds: "Feed-Zustand",
    jobs: "Jobs",
    email: "E-Mail-Sperren",
    users: "Nutzer",
    contacts: "Kontakte",
  },
  shareTabs: {
    ariaLabel: "Bereiche zum Teilen",
    links: "Links",
    api: "API & Webhooks",
    integrations: "Integrationen",
  },
  nudge: {
    comparePlans: "Tarife vergleichen",
    upgradeTo: "Auf {plan} upgraden",
    notNow: "Nicht jetzt",
    retentionDays: { one: "{count} Tag", other: "{count} Tage" },
    retentionYears: { one: "{count} Jahr", other: "{count} Jahre" },
    items: {
      csv_export: {
        title: "Verlauf als CSV exportieren",
        body: "Mit Member lädst du deine gespeicherten Messwerte als CSV herunter – praktisch für Versicherungsunterlagen und zum Einstellen der Heizung oder Lüftung.",
      },
      history_charts: {
        title: "Mehr Verlauf griffbereit",
        body: "Member bietet CSV-Export und alle Diagrammwerkzeuge. Free-Konten sehen weiterhin Live-Daten und aktuelle Diagramme.",
      },
      sms_alerts: {
        title: "Frost- und Leckalarme per SMS",
        body: "Pro ergänzt SMS über Twilio – entscheidend, wenn E-Mail bei einer Kältewelle oder einem nassen Kontakt nicht schnell genug ist.",
      },
      push_alerts: {
        title: "Browser-Push auf diesem Gerät",
        body: "Browser-Push gibt es in jedem Tarif, damit Alarme dich auch erreichen, wenn das Dashboard nicht offen ist.",
      },
      webhooks: {
        title: "Alarme mit Home Assistant oder Zapier verbinden",
        body: "Pro ergänzt ausgehende Alarm-Webhooks, Messwert-Webhooks beim Ingest, eingehende Endpunkte zum Pausieren und für den Status sowie die offizielle Home-Assistant-Integration über HACS.",
      },
      share_links: {
        title: "Mehr Freigabearten für Gäste und Grafana",
        body: "Free enthält bereits einen Live-Link für die Familie. Pro ergänzt Verlauf, Metriken, Einbettungen und Links ohne Ablaufdatum.",
      },
      api_keys: {
        title: "API-Schlüssel für Grafana und Skripte",
        body: "Pro enthält Dashboard-API-Schlüssel und ein Grafana-Dashboard als JSON zum Herunterladen.",
      },
      embed_widget: {
        title: "Live-Temperaturen auf deiner Website",
        body: "Pro-Freigabelinks können ein einbettbares Widget für ein Familienportal oder deine Werkstattseite speisen.",
      },
      status_pages: {
        title: "Öffentliche Statusseite",
        body: "Pro-Haushalte können eine per Token geschützte Statusseite und einen iCal-Feed mit Frostprognose veröffentlichen.",
      },
      device_limit: {
        title: "Mehr Push-Geräte nötig?",
        body: "Free erlaubt {free} Push-Geräte pro Objekt, Member {member}, Pro {pro}: Upgrade, wenn du an die Grenze stößt.",
      },
      data_retention: {
        title: "Längeren Verlauf behalten",
        body: "Free speichert Messwerte für {free}. Member verlängert das auf {member}; Pro speichert {pro} und mehr für Vergleiche über Jahreszeiten und Jahre.",
      },
      cold_risk: {
        title: "Frostnächten zuvorkommen",
        body: "Jeder Tarif hat eine Frost-Countdown-Uhr für diesen unbeheizten Bereich. Member ergänzt Frostwarnungen aus der Außenprognose. Pro ergänzt offizielle Frost- und Kältewarnungen des NWS (USA).",
      },
      prometheus: {
        title: "Metriken in Grafana abfragen",
        body: "Pro schaltet Metriken im Prometheus-Format und API-Schlüssel für deinen Observability-Stack frei.",
      },
      multi_property: {
        title: "Ein zweites Objekt überwachen?",
        body: "Pro unterstützt bis zu {max} eigene Objekte: Ferienhaus, Mietwohnung oder Werkstatt.",
      },
      portfolio_scale: {
        title: "Größeres Immobilienportfolio?",
        body: "Portfolio hebt die Grenze für eigene Objekte auf {max} an und ergänzt Zugänge für die Objektverwaltung vor Ort.",
      },
      claims_pack: {
        title: "Nachweispaket für die Versicherung exportieren",
        body: "Pro erstellt eine druckbare Frost-/Leck-Zusammenfassung mit passenden Messwerten und Alarmereignissen als CSV für einen Zeitraum deiner Wahl.",
      },
      thermostat_integration: {
        title: "Nest oder Ecobee verbinden",
        body: "Pro zeigt Messwert und Sollwert deines Hausthermostats neben diesem Fühler und ergänzt diesen Kontext in Frostalarmen.",
      },
    },
  },
  pwa: {
    eyebrow: "Läuft schon heute auf deinem Handy",
    title: "Web-App (PWA) installieren",
    body: "ProbeHarbor funktioniert schon jetzt – füge es in Chrome oder Safari zum Startbildschirm hinzu. Gleiches Konto, Live-Messwerte und Alarme. Die native Android-App ist im Vorabzugang auf GitHub, solange die Prüfung bei Google Play läuft; du musst nicht auf Play warten.",
    step1: "Öffne probeharbor.dev in Chrome (Android) oder Safari (iPhone).",
    step2Html: "Tippe auf <strong>App installieren</strong> oder Teilen → <strong>Zum Home-Bildschirm</strong>.",
    step3: "Öffne das Symbol; Push kannst du später unter Dashboard → Alarme aktivieren.",
    installApp: "App installieren",
    guide: "PWA-Installationsschritte",
    android: "Native Android-App (folgt)",
    client: {
      installStarted: "Installation gestartet.",
      installDismissed: "Installation abgebrochen: Die Schritt-für-Schritt-Anleitung funktioniert weiterhin.",
      installed: "App installiert.",
    },
  },
};

export default de;

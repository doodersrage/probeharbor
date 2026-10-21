import type { AuthErrorPagesMessages } from "./en";

const de: AuthErrorPagesMessages = {
  notFound: {
    title: "Seite nicht gefunden",
    description: "Diese Seite gibt es auf {brand} nicht.",
    heading: "Seite nicht gefunden",
    lede: "Diese URL gibt es auf ProbeHarbor nicht: Die Seite wurde vielleicht verschoben, oder der Link ist veraltet.",
    home: "Startseite",
    guides: "Anleitungen",
    dashboard: "Dashboard",
    lookingFor: "Suchst du Frost-/Wasserschaden-Alarme oder die Ingest-Dokumentation?",
    ingest: "Ingest & Webhooks",
    contact: "Kontakt",
  },
  serverError: {
    title: "Etwas ist schiefgelaufen",
    description: "Ein unerwarteter Fehler ist aufgetreten.",
    heading: "Etwas ist schiefgelaufen",
    lede: "Beim Laden dieser Seite ist ein unerwarteter Fehler aufgetreten. Der Vorfall wurde automatisch protokolliert.",
    home: "Zurück zur Startseite",
    status: "Systemstatus",
  },
};

export default de;

import type { StatusEmailMessages } from "./en";

const de: StatusEmailMessages = {
  confirm: {
    subject: "Bestätige dein ProbeHarbor-Status-Abo",
    eyebrow: "Status-Updates",
    title: "Bestätige dein Abo",
    intro:
      "Klicke unten, um eine E-Mail zu erhalten, sobald sich der Systemstatus von ProbeHarbor ändert.",
    body: "Falls du das nicht angefordert hast, kannst du diese Nachricht ignorieren – ohne Bestätigung wirst du nicht eingetragen.",
    cta: "Abo bestätigen",
    footerNote:
      "Du erhältst diese E-Mail, weil jemand diese Adresse auf der ProbeHarbor-Statusseite eingegeben hat. Mit der Bestätigung abonnierst du nur E-Mails zu Statusänderungen.",
  },
  change: {
    eyebrow: "Status-Update",
    subjectHealthy: "ProbeHarbor: wieder normal",
    subjectDegraded: "ProbeHarbor: Dienst beeinträchtigt",
    titleHealthy: "ProbeHarbor läuft wieder normal",
    titleDegraded: "ProbeHarbor ist beeinträchtigt",
    introHealthy: "Geplante Jobs und die Ingest-Überwachung laufen wieder einwandfrei.",
    introDegraded: "Wir sehen fehlgeschlagene Jobs oder verpasste Zeitpläne und untersuchen das.",
    cta: "Systemstatus ansehen",
    unsubscribe: "Status-Updates abbestellen",
    footerNote: "Du erhältst diese E-Mail, weil du Status-Updates von ProbeHarbor abonniert hast.",
  },
};

export default de;

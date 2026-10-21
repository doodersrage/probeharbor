import type { SystemStatusMessages } from "./en";

const de: SystemStatusMessages = {
  title: "Systemstatus",
  description:
    "Live-Systemzustand von ProbeHarbor: geplante Alarm-Jobs, Ingest-Aktivität, Cloudflare-Hosting und ob die Crons pünktlich laufen.",
  breadcrumbHome: "Startseite",
  kicker: "Status",
  lede: "Öffentlicher Zustand der ProbeHarbor-Jobs und des Ingests: was wir selbst messen. Wird bei jedem Seitenaufruf aktualisiert.",
  banner: {
    degraded: "Beeinträchtigt: wird untersucht",
    elevated: "In Betrieb: erhöhte Ingest-Ratenbegrenzung",
    operational: "Alle Systeme in Betrieb",
    pollOverdue: "Die Verlaufsabfrage ist überfällig.",
    jobErrors: {
      one: "{count} Cron-Job-Fehler in den letzten 24 Stunden.",
      other: "{count} Cron-Job-Fehler in den letzten 24 Stunden.",
    },
    latestFailed: "Der letzte Cron-Lauf ist fehlgeschlagen.",
    noCron: "Keine aktuellen Cron-Läufe erfasst.",
    healthyDetail:
      "Fehlerfrei heißt: Die Verlaufsabfrage läuft planmäßig und in den letzten 24 Stunden ist kein Cron-Job fehlgeschlagen. Ereignisse der Ingest-Ratenbegrenzung werden separat angezeigt und setzen dieses Banner allein nicht auf „beeinträchtigt“.",
  },
  stats: {
    lastPoll: "Letzte Verlaufsabfrage",
    overdue: " (überfällig)",
    pollSchedule: "Abfrageplan",
    pollScheduleValue: "Alle 15 Minuten (:00, :15, :30, :45 UTC)",
    lastCronJob: "Letzter Cron-Job",
    lastJobStatus: "Status des letzten Jobs",
    jobErrors: "Job-Fehler (24 h)",
    rateLimitEvents: "Ingest-Ratenbegrenzungen (24 h)",
    checkedAt: "Geprüft am",
  },
  incidents: {
    title: "Vorfälle",
    lede: "Schriftliche Berichte zu Ausfällen oder Beeinträchtigungen, die Kunden betreffen. Die Cron-Fehler oben steuern auch das Live-Banner und die Status-E-Mails an Abonnenten.",
    none: "Bisher sind keine Vorfälle erfasst. Sobald wir einen behobenen Vorfall veröffentlichen (Datum, Auswirkung, Behebung), erscheint er hier. Bis dahin gelten das Live-Banner und die Tabelle der letzten Cron-Läufe.",
    open: "Offen: Dienst beeinträchtigt",
    started: "Begonnen etwa zum Zeitpunkt dieses Seitenaufrufs ({when}). Status-Abonnenten werden bei Beeinträchtigung und Wiederherstellung benachrichtigt.",
  },
  runs: {
    title: "Letzte Cron-Läufe",
    lede: "Die letzten 14 Job-Ausführungen (ohne sensible Details).",
    empty: "Noch keine Job-Läufe erfasst.",
    started: "Gestartet",
    job: "Job",
    status: "Status",
  },
  jobStatus: { success: "erfolgreich", error: "Fehler", running: "läuft" },
  monitor: {
    title: "Was wir überwachen",
    items: [
      "Stündliche Verlaufserfassung und Alarmauswertung",
      "Wöchentliche Zusammenfassung und Monats-/Quartalsberichte per E-Mail",
      "Aufbewahrung der Sensormesswerte und Aggregate der Frostkarte",
      "Erinnerungen zum Testzeitraum und Onboarding-E-Mails",
    ],
  },
  hosting: {
    title: "Hosting",
    bodyHtml:
      "ProbeHarbor läuft im <strong>Edge-Netzwerk von Cloudflare</strong> (Workers). So bleiben Dashboard und Ingest-APIs nah an den Besuchern, ohne dass du einen Server zu Hause betreiben musst. Wir veröffentlichen den Job- und Ingest-Zustand <em>dieser</em> Seite, keine Marketing-Verfügbarkeitsquote und nicht das Plattform-SLA von Cloudflare, als wäre es unser eigenes.",
    stackNotes: "Technische Hinweise:",
    astro: "Astro auf Cloudflare",
    workers: "Workers-Deployment",
    cloudflareIncidents: "Vorfälle der Cloudflare-Plattform:",
  },
  notify: {
    title: "Benachrichtigt werden",
    lede: "Erhalte eine einmalige E-Mail, wenn sich dieser Status ändert (beeinträchtigt oder wieder normal). Keine Routine-E-Mails. Das Formular ist durch Cloudflare Turnstile geschützt.",
    subscribed: "Sieh in deinem Posteingang nach: Erst wenn du auf den Bestätigungslink klickst, bist du angemeldet.",
    confirmed: "Du hast die Status-Updates abonniert.",
    unsubscribed: "Du hast die Status-Updates abbestellt.",
    errors: {
      invalid_email: "Gib eine gültige E-Mail-Adresse ein.",
      verification: "Die Überprüfung ist fehlgeschlagen. Bitte versuch es noch einmal.",
      rate_limited: "Zu viele Versuche. Bitte versuch es in ein paar Minuten noch einmal.",
      invalid_token: "Dieser Link ist ungültig oder wurde bereits verwendet.",
    },
    company: "Firma",
    email: "E-Mail",
    submit: "Bei Statusänderungen benachrichtigen",
  },
  age: { never: "nie", justNow: "gerade eben" },
  chip: {
    unknown: "Systemstatus",
    healthy: "Alle Systeme in Betrieb",
    degraded: "Beeinträchtigt, Status ansehen",
  },
};

export default de;

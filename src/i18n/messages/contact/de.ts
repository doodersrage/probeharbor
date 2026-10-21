/**
 * /contact page copy plus the `ContactForm` island strings (`form`, passed as
 * the `text` prop). Keys ending in `Html` hold trusted inline HTML; the
 * GitHub issues href is passed in.
 */
import type { ContactMessages } from "./en";

const de: ContactMessages = {
  title: "Kontakt",
  description:
    "Kontaktiere ProbeHarbor bei Fragen zu Konto oder Abrechnung, oder melde Fehler als GitHub-Issue. Die Anleitungen behandeln Fühler, Datenanbindung und Alarme.",
  breadcrumbHome: "Start",
  kicker: "Kontakt",
  heading: "Schreib uns",
  lede: "Fragen zu Konto und Abrechnung gehören hierher. Fehler und Feature-Ideen gehören auf GitHub. Wir antworten meist innerhalb von 1–2 Werktagen.",
  browseGuides: "Anleitungen durchsuchen",
  githubIssues: "GitHub-Issues",
  formTitle: "Dieses Formular",
  formCopy:
    "Nutze es für Fragen zu Konto, Abrechnung und Haushalt sowie für alles, was die Anleitungen nicht abdecken.",
  formTopics: [
    "Konto, Abrechnung oder Haushaltszugang",
    "Dashboard-Einrichtung, Verlauf, Frost- und Wasseralarme oder CSV-Export",
    "Fragen zu Android bzw. zum Play-Eintrag oder Wunsch nach einer Benachrichtigung zum Start",
    "Fragen zu Datenanbindung oder Fühlern, nachdem du die Anleitungen geprüft hast",
  ],
  issuesTitle: "GitHub-Issues",
  issuesHtml: 'Fehler, Firmware-Patches und Feature-Ideen gehören in die <a class="text-link" href="{url}" target="_blank" rel="noreferrer">GitHub-Issues</a>, damit andere Bastler mitlesen können. Du möchtest kein Webformular nutzen? Dann ist das der beste öffentliche Weg.',
  beforeTitle: "Bevor du schreibst",
  beforeHtml:
    'Viele Antworten findest du bereits im <a class="text-link" href="/guides">Anleitungs-Hub</a>, in der <a class="text-link" href="/about">Wissensbibliothek</a>, in der <a class="text-link" href="/about/probe-demo">Fühler-Demo</a> und bei den <a class="text-link" href="/about/arduino-sketches">Arduino-Sketches</a>. Hilfreich für eine Antwort: Board, Sensoren, erwartete und tatsächliche Messwerte sowie alle Feed-URLs.',
  form: {
    nameLabel: "Name",
    namePlaceholder: "Dein Name",
    emailLabel: "E-Mail",
    emailPlaceholder: "du@beispiel.de",
    messageLabel: "Nachricht",
    messagePlaceholder:
      "Wie können wir helfen? Bei Problemen mit Fühlern gib bitte Board, Sensoren, erwartete und tatsächliche Messwerte sowie Feed-URLs an.",
    honeypotLabel: "Firma",
    turnstileHint: "Geschützt durch Cloudflare Turnstile.",
    sending: "Wird gesendet…",
    send: "Nachricht senden",
    success: "Danke, deine Nachricht ist angekommen. Wir antworten meist innerhalb von 1–2 Werktagen.",
    genericError: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
    androidTopicMessage:
      "Bitte benachrichtigt mich, sobald die ProbeHarbor-App für Android bei Google Play verfügbar ist.",
  },
};

export default de;

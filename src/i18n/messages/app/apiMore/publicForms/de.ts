import type { ApiMorePublicFormsMessages } from "./en";

const de: ApiMorePublicFormsMessages = {
  contact: {
    success: "Danke, deine Nachricht ist angekommen. Wir antworten in der Regel innerhalb von 1–2 Werktagen.",
    verificationFailed: "Überprüfung fehlgeschlagen.",
    missingFields: "Pflichtfelder fehlen.",
    tooLong: "Die Nachricht ist zu lang.",
    recipientMissing: "Kein E-Mail-Empfänger konfiguriert.",
    sendFailed: "Nachricht konnte nicht gesendet werden. Bitte versuche es erneut.",
  },
  freezeAlerts: {
    success: "Prüfe dein E-Mail-Postfach und bestätige. Die Alarme starten in der nächsten Frostnacht nach deiner Bestätigung.",
    tooMany: "Zu viele Versuche. Versuche es in ein paar Minuten erneut.",
    verificationFailed: "Überprüfung fehlgeschlagen. Bitte versuche es erneut.",
    genericError: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
    unsubscribe: {
      forecastLink: "Frostprognose für Rohrleitungen",
      invalidTitle: "Link ungültig",
      invalidBodyHtml: "<p>In diesem Abmeldelink fehlt das Token.</p>",
      confirmTitle: "Frostalarme abbestellen?",
      confirmBodyHtml: "<p>Du erhältst an diese Adresse keine Frostalarm-E-Mails mehr.</p>",
      button: "Abmelden",
      doneTitle: "Du bist abgemeldet",
      doneBodyHtml: "<p>An diese Adresse werden keine Frostalarm-E-Mails mehr gesendet.</p>",
      usedTitle: "Bereits abgemeldet",
      usedBodyHtml: "<p>Dieser Link wurde schon verwendet oder ist ungültig.</p>",
    },
  },
  shareReadings: {
    missingToken: "Token fehlt",
    tooManyRequests: "Zu viele Anfragen",
    invalidLink: "Link ungültig oder abgelaufen",
  },
};

export default de;

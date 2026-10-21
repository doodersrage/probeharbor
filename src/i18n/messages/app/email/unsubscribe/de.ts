import type { UnsubscribeMessages } from "./en";

const de: UnsubscribeMessages = {
  labels: {
    digest: "wöchentliche Berichts-E-Mails",
    monthly_report: "Monatsbericht-E-Mails",
    quarterly_report: "Quartalsbericht-E-Mails",
    drip: "Tipp- und Einstiegs-E-Mails",
    freeze_drill: "E-Mails zum Frost-Check",
  },
  emailSettings: "E-Mail-Einstellungen",
  invalidTitle: "Link ungültig",
  invalidBody:
    "Dieser Abmeldelink ist ungültig. Deine E-Mail-Einstellungen kannst du im Dashboard ändern.",
  confirmTitle: "Abmelden?",
  confirmBody: "Keine {emails} mehr senden? Frost- und Wasseralarme sind davon nicht betroffen.",
  confirmButton: "Abmelden",
  errorTitle: "Etwas ist schiefgelaufen",
  errorBody:
    "Wir konnten deine Einstellungen nicht aktualisieren. Bitte versuche es erneut oder ändere sie im Dashboard.",
  doneTitle: "Du bist abgemeldet",
  doneBody: "Du erhältst keine {emails} mehr. Frost- und Wasseralarme sind davon nicht betroffen.",
};

export default de;

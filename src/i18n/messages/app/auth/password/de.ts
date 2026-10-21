import type { AuthPasswordMessages } from "./en";

const de: AuthPasswordMessages = {
  backToSignIn: "Zurück zur Anmeldung",
  email: "E-Mail",
  errors: {
    missing_email: "Gib die E-Mail-Adresse deines Kontos ein.",
    verification: "Überprüfung fehlgeschlagen. Bitte versuche es erneut.",
  },
  forgot: {
    title: "Passwort vergessen",
    description: "Fordere einen Link zum Zurücksetzen des Passworts für dein ProbeHarbor-Konto an.",
    heading: "Passwort vergessen",
    lede: "Gib die E-Mail-Adresse deines Kontos ein, und wir schicken dir einen Link, mit dem du ein neues Passwort wählen kannst.",
    sent: "Falls es ein Konto mit dieser E-Mail-Adresse gibt, ist ein Link zum Zurücksetzen unterwegs. Sieh in deinem Posteingang und im Spam-Ordner nach.",
    submit: "Link senden",
  },
  reset: {
    title: "Passwort zurücksetzen",
    description: "Wähle ein neues Passwort für dein ProbeHarbor-Konto.",
    heading: "Neues Passwort wählen",
    withSession: "Gib dein neues Passwort ein und bestätige es.",
    withoutSession: "Öffne den Link aus der E-Mail, um fortzufahren.",
    needsLinkHtml:
      'Für diese Seite brauchst du einen gültigen Link zum Zurücksetzen. <a class="text-link" href="/forgot-password">Neuen Link anfordern</a>.',
    newPassword: "Neues Passwort",
    confirmPassword: "Passwort bestätigen",
    submit: "Passwort ändern",
    errors: {
      weak: "Das Passwort muss mindestens 8 Zeichen lang sein.",
      mismatch: "Die Passwörter stimmen nicht überein.",
      session: "Deine Sitzung zum Zurücksetzen ist abgelaufen. Fordere einen neuen Link an.",
      update: "Das Passwort konnte nicht geändert werden. Versuche es erneut.",
    },
  },
  resend: {
    title: "Bestätigung erneut senden",
    description: "Fordere einen neuen Bestätigungslink für dein ProbeHarbor-Konto an.",
    heading: "Bestätigungs-E-Mail erneut senden",
    lede: "Bestätigungslinks laufen ab. Gib die E-Mail-Adresse ein, mit der du dich registriert hast, und wir schicken dir einen neuen.",
    sentHtml:
      'Falls zu dieser Adresse ein unbestätigtes Konto gehört, ist ein neuer Bestätigungslink unterwegs. Sieh in deinem Posteingang und im Spam-Ordner nach. Schon bestätigt? <a class="text-link" href="/signin">Anmelden</a>.',
    submit: "Bestätigungslink senden",
  },
};

export default de;

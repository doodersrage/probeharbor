import type { AuthSigninMessages } from "./en";

const de: AuthSigninMessages = {
  signin: {
    title: "Anmelden",
    description:
      "Melde dich in deinem Dashboard an, um Anzeigeeinstellungen, Fühler-Feeds, den Messwertverlauf und den CSV-Export zu verwalten.",
    heading: "Anmelden",
    lede: "Mach da weiter, wo du aufgehört hast: Einstellungen, Feeds und gespeicherte Messwerte findest du in deinem Dashboard.",
    registeredHtml:
      "Konto erstellt. Bestätige es über die E-Mail, die wir dir geschickt haben, und melde dich dann an. Nächster Schritt nach der Anmeldung: <strong>Geräte</strong>: Erstelle einen Push-Schlüssel und sende (POST) deinen ersten Messwert.",
    confirmedHtml:
      "E-Mail bestätigt. Melde dich an, um die Einrichtung abzuschließen: Als Nächstes geht es zu <strong>Geräte</strong>, wo du deinen ersten Sensor verbindest.",
    signedOutAll: "Auf allen Geräten abgemeldet. Melde dich hier wieder an, wenn du so weit bist.",
    resendConfirmation: "Bestätigungs-E-Mail erneut senden",
    email: "E-Mail",
    password: "Passwort",
    submit: "Mit E-Mail anmelden",
    forgotPassword: "Passwort vergessen?",
    newHere: "Neu hier?",
    createAccount: "Kostenloses Konto erstellen",
    privacy: "Datenschutz",
    terms: "Nutzungsbedingungen",
  },
  register: {
    title: "Registrieren",
    description:
      "Kostenloses ProbeHarbor-Konto, ohne Kreditkarte. ESP/Arduino-Fühler verbinden, Frost- und Wasserschaden/Leck-Alarme und Verlauf für deinen Haushalt.",
    heading: "Konto erstellen",
    lede: "Für immer kostenlos, ohne Kreditkarte. Nach der Registrierung landest du bei Geräte, um deinen ersten Fühler oder deine Leckmeldung per Feuchtekontakt zu verbinden.",
    preferLook: "Erst mal reinschauen?",
    liveDemo: "Live-Demo (ohne Konto)",
    referral:
      "Empfehlungscode {code} angewendet. Die Pro-Testphase verlängert sich um 7 Tage.",
    email: "E-Mail",
    password: "Passwort",
    passwordHint: "Mindestens 8 Zeichen.",
    submit: "Konto mit E-Mail erstellen",
    agreeHtml:
      'Mit dem Erstellen eines Kontos stimmst du unseren <a class="text-link" href="/terms">Nutzungsbedingungen</a> und der <a class="text-link" href="/privacy">Datenschutzerklärung</a> zu.',
    haveAccount: "Du hast schon ein Konto?",
    signIn: "Anmelden",
    errors: {
      missing_fields: "Bitte gib deine E-Mail-Adresse und dein Passwort ein.",
      verification: "Überprüfung fehlgeschlagen. Bitte versuche es erneut.",
      weak_password: "Das Passwort muss mindestens 8 Zeichen lang sein.",
      generic: "Beim Erstellen deines Kontos ist etwas schiefgelaufen. Bitte versuche es erneut.",
      signup_failed: "Beim Erstellen deines Kontos ist etwas schiefgelaufen. Bitte versuche es erneut.",
    },
  },
  oauth: {
    google: "Weiter mit Google",
    github: "Weiter mit GitHub",
    discord: "Weiter mit Discord",
    orContinueWith: "oder weiter mit",
    orUseEmail: "oder mit E-Mail",
  },
  errors: {
    missing_fields: "Bitte gib deine E-Mail-Adresse und dein Passwort ein.",
    invalid_credentials:
      "Die Anmeldung hat nicht geklappt. Prüfe E-Mail-Adresse und Passwort und versuche es erneut.",
    email_not_confirmed:
      "Bitte bestätige deine E-Mail-Adresse, bevor du dich anmeldest. Den Bestätigungslink findest du in deinem Posteingang.",
    oauth_failed:
      "Die Anmeldung über ein soziales Konto konnte nicht gestartet werden. Versuche es erneut oder melde dich mit E-Mail an.",
    oauth_denied: "Die Anmeldung über ein soziales Konto wurde abgebrochen. Versuche es erneut, wenn du so weit bist.",
    oauth_provider_failed:
      "Die Anmeldung über ein soziales Konto ist beim Anbieter fehlgeschlagen. Versuche es erneut oder melde dich mit E-Mail an.",
    oauth_secret_mismatch:
      "Die Zugangsdaten für die soziale Anmeldung sind veraltet. Erzeuge in der App des Anbieters (Discord, GitHub oder Google) ein neues Client Secret und füge den neuen Wert in Supabase → Authentication → Providers ein.",
    oauth_github_profile:
      "Die GitHub-Anmeldung konnte dein Profil oder deine E-Mail nicht lesen. Entziehe ProbeHarbor unter GitHub → Settings → Authorized OAuth Apps den Zugriff und versuche es erneut: Der Autorisierungsbildschirm muss ProbeHarbor anzeigen und Zugriff auf die E-Mail anfordern.",
    oauth_exchange_failed:
      "Beim Abschließen der Anmeldung über ein soziales Konto ist etwas schiefgelaufen. Bitte versuche es erneut.",
    confirm_link:
      "Dieser Bestätigungslink ist abgelaufen oder wurde bereits verwendet. Wenn du schon bestätigt hast, melde dich einfach an.",
    turnstile_failed: "Bitte setze das Häkchen bei der Prüfung, ob du ein Mensch bist, und versuche es erneut.",
    rate_limited:
      "Zu viele Anmeldeversuche für dieses Konto. Bitte warte ein paar Minuten und versuche es erneut.",
    generic: "Bei der Anmeldung ist etwas schiefgelaufen. Bitte versuche es erneut.",
  },
  mfa: {
    title: "Zwei-Faktor-Authentifizierung",
    description: "Schließe die Anmeldung mit einem Authenticator-Code oder einem YubiKey-OTP ab.",
    yourAccount: "dein Konto",
    errors: {
      invalid_code:
        "Dieser Code war falsch oder abgelaufen. Gib einen neuen Code aus deiner Authenticator-App ein.",
      invalid_yubikey:
        "Dieses YubiKey-OTP wurde nicht akzeptiert. Klicke in das Feld YubiKey OTP, berühre deinen Schlüssel (lange berühren) und warte, bis der vollständige Code eingegeben ist, bevor du absendest.",
      replayed_otp:
        "Dieses YubiKey-OTP wurde bereits verwendet. Berühre deinen Schlüssel erneut, um einen neuen Code zu erzeugen.",
      yubikey_not_enrolled:
        "Dieser YubiKey ist für dieses Konto nicht registriert. Füge ihn unter Einstellungen → Sicherheit hinzu oder verwende deinen Authenticator-Code.",
      no_factor:
        "Für dieses Konto ist kein MFA-Faktor registriert. Melde dich erneut an und füge unter Einstellungen einen hinzu.",
      rate_limited: "Zu viele falsche Versuche. Bitte warte ein paar Minuten und versuche es erneut.",
      generic: "Bei der Prüfung deines Codes ist etwas schiefgelaufen. Versuche es erneut.",
    },
    challenge: {
      heading: "Zwei-Faktor-Authentifizierung",
      lede: "Schließe die Anmeldung für {email} mit einem Authenticator-Code oder einem YubiKey-OTP ab.",
      codeLabel: "Authenticator-Code",
      verifyCode: "Code prüfen",
      totpHint: "Du nutzt Yubico Authenticator auf deinem YubiKey? Gib oben den 6-stelligen Code ein.",
      yubikeyLabel: "YubiKey OTP",
      verifyYubikey: "Mit YubiKey prüfen",
      otpHint:
        "Oder berühre deinen YubiKey im OTP-Feld unten (lange berühren, keine Codes aus Yubico Authenticator).",
      differentAccount: "Anderes Konto verwenden",
    },
  },
};

export default de;

import type { AuthHandoffMessages } from "./en";

const de: AuthHandoffMessages = {
  invite: {
    title: "Haushaltseinladung",
    description: "Nimm eine Einladung zu einem geteilten Haushalt an.",
    heading: "Haushaltseinladung",
    aHousehold: "einem Haushalt",
    invalid: "Dieser Einladungslink ist ungültig.",
    expired: "Diese Einladung ist abgelaufen. Bitte die Person, der der Haushalt gehört, um eine neue.",
    alreadyAccepted: "Diese Einladung wurde bereits angenommen.",
    openHousehold: "Haushalt öffnen",
    invited: "Du wurdest eingeladen, die Sensoren in {household} mitzunutzen.",
    invitedAs: "Du wurdest als {email} eingeladen, die Sensoren in {household} mitzunutzen.",
    signOutButton: "Abmelden",
    signOut: "Melde dich ab",
    useInvitedEmail: "und verwende die eingeladene E-Mail-Adresse.",
    signInOrRegisterAs: "Melde dich mit {email} an oder registriere dich, um die Einladung anzunehmen.",
    signInOrRegister:
      "Melde dich mit der eingeladenen E-Mail-Adresse an oder registriere dich, um die Einladung anzunehmen.",
    signIn: "Anmelden",
    createAccount: "Konto erstellen",
    signedInMismatch:
      "Angemeldet als {email}. Melde dich ab und verwende die eingeladene Adresse, um beizutreten.",
    signInAs: "Als {email} anmelden",
    signInAsInvited: "Mit der eingeladenen E-Mail-Adresse anmelden",
    signedInAs: "Angemeldet als {email}",
    join: "Haushalt beitreten",
  },
  appOAuth: {
    signInFinished: "Die Anmeldung im Browser ist abgeschlossen.",
    missingTitle: "Anmeldetoken fehlt",
    baybuddy: {
      title: "Zurück zu Bay Buddy",
      description: "Schließe die ProbeHarbor-Anmeldung ab, indem du zu Bay Buddy zurückkehrst.",
      open: "Bay Buddy öffnen",
      handoff: "Wenn Bay Buddy wartet, sollte es automatisch weitergehen. Falls nicht, tippe auf den Button unten.",
      close: "Du kannst diesen Tab schließen, sobald Bay Buddy die Live-Stimmung deiner Garage zeigt.",
      missing:
        "Diese Seite bringt dich nach der Anmeldung zurück zu Bay Buddy. Öffne Bay Buddy und wähle erneut Connect.",
    },
    desktop: {
      title: "Zurück zu ProbeHarbor Desktop",
      description: "Schließe die ProbeHarbor-Anmeldung ab, indem du zu ProbeHarbor Desktop zurückkehrst.",
      open: "ProbeHarbor Desktop öffnen",
      handoff:
        "Wenn ProbeHarbor Desktop auf die Loopback-Übergabe wartet, sollte die Anmeldung automatisch abgeschlossen werden. Falls nicht, ist diese Seite nur ein Ausweichweg: Öffne die App erneut und wähle noch einmal Connect.",
      close: "Du kannst diesen Tab schließen, sobald ProbeHarbor Desktop dein Dashboard zeigt.",
      missing:
        "Diese Seite bringt dich nach der Anmeldung zurück zu ProbeHarbor Desktop. Öffne die Desktop-App und wähle erneut Connect.",
    },
    android: {
      title: "Zurück zur Android-App",
      description: "Schließe die ProbeHarbor-Anmeldung ab, indem du zur Android-App zurückkehrst.",
      open: "ProbeHarbor öffnen",
      handoff:
        "Chrome bleibt nach einem Sicherheitsschritt von Google oder YubiKey oft auf dieser Seite: Tippe auf den Button, um zur App zurückzukehren und dort bei Bedarf die MFA abzuschließen.",
      close:
        "Wenn nichts passiert, kehre mit der Zurück-Taste des Handys zur App zurück oder öffne ProbeHarbor über die App-Übersicht.",
      missing:
        "Diese Seite dient nur dazu, nach der Google-Anmeldung zur Android-App zurückzukehren. Öffne ProbeHarbor auf deinem Handy und versuche es erneut mit Google.",
    },
  },
};

export default de;

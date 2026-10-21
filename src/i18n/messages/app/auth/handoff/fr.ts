import type { AuthHandoffMessages } from "./en";

const fr: AuthHandoffMessages = {
  invite: {
    title: "Invitation au foyer",
    description: "Acceptez une invitation à partager un foyer.",
    heading: "Invitation au foyer",
    aHousehold: "un foyer",
    invalid: "Ce lien d’invitation n’est pas valide.",
    expired: "Cette invitation a expiré. Demandez au propriétaire du foyer de vous en envoyer une nouvelle.",
    alreadyAccepted: "Cette invitation a déjà été acceptée.",
    openHousehold: "Ouvrir le foyer",
    invited: "Vous êtes invité à partager des capteurs dans {household}.",
    invitedAs: "Vous êtes invité à partager des capteurs dans {household} en tant que {email}.",
    signOutButton: "Se déconnecter",
    signOut: "Déconnectez-vous",
    useInvitedEmail: "et utilisez l’e-mail invité.",
    signInOrRegisterAs: "Connectez-vous ou inscrivez-vous avec {email} pour accepter.",
    signInOrRegister: "Connectez-vous ou inscrivez-vous avec l’e-mail invité pour accepter.",
    signIn: "Se connecter",
    createAccount: "Créer un compte",
    signedInMismatch:
      "Connecté en tant que {email}. Déconnectez-vous et utilisez l’adresse invitée pour rejoindre le foyer.",
    signInAs: "Se connecter en tant que {email}",
    signInAsInvited: "Se connecter avec l’e-mail invité",
    signedInAs: "Connecté en tant que {email}",
    join: "Rejoindre le foyer",
  },
  appOAuth: {
    signInFinished: "Connexion terminée dans le navigateur.",
    missingTitle: "Jeton de connexion manquant",
    baybuddy: {
      title: "Retour à Bay Buddy",
      description: "Terminez la connexion à ProbeHarbor en revenant dans Bay Buddy.",
      open: "Ouvrir Bay Buddy",
      handoff:
        "Si Bay Buddy est en attente, il devrait reprendre automatiquement. Sinon, touchez le bouton ci-dessous.",
      close: "Vous pouvez fermer cet onglet dès que Bay Buddy affiche l’humeur de votre garage en direct.",
      missing:
        "Cette page vous ramène à Bay Buddy après la connexion. Ouvrez Bay Buddy et choisissez à nouveau Connect.",
    },
    desktop: {
      title: "Retour à ProbeHarbor Desktop",
      description: "Terminez la connexion à ProbeHarbor en revenant dans ProbeHarbor Desktop.",
      open: "Ouvrir ProbeHarbor Desktop",
      handoff:
        "Si ProbeHarbor Desktop attend le transfert par loopback, la connexion devrait se terminer automatiquement. Sinon, cette page sert de solution de repli : rouvrez l’application et choisissez à nouveau Connect.",
      close: "Vous pouvez fermer cet onglet dès que ProbeHarbor Desktop affiche votre tableau de bord.",
      missing:
        "Cette page vous ramène à ProbeHarbor Desktop après la connexion. Ouvrez l’application de bureau et choisissez à nouveau Connect.",
    },
    android: {
      title: "Retour à l’application Android",
      description: "Terminez la connexion à ProbeHarbor en revenant dans l’application Android.",
      open: "Ouvrir ProbeHarbor",
      handoff:
        "Chrome reste souvent sur cette page après une étape de sécurité Google ou YubiKey : touchez le bouton pour revenir à l’application et y terminer la MFA si nécessaire.",
      close:
        "Si rien ne se passe, utilisez le bouton Retour du téléphone pour revenir à l’application, ou ouvrez ProbeHarbor depuis la liste de vos applications.",
      missing:
        "Cette page sert uniquement à revenir à l’application Android après une connexion Google. Ouvrez ProbeHarbor sur votre téléphone et réessayez avec Google.",
    },
  },
};

export default fr;

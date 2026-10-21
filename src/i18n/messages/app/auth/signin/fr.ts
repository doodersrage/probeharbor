import type { AuthSigninMessages } from "./en";

const fr: AuthSigninMessages = {
  signin: {
    title: "Connexion",
    description:
      "Connectez-vous à votre tableau de bord pour gérer vos préférences d’affichage, les flux de vos sondes, l’historique des mesures et l’export CSV.",
    heading: "Connexion",
    lede: "Reprenez là où vous vous étiez arrêté : vos préférences, flux et mesures enregistrées vous attendent dans votre tableau de bord.",
    registeredHtml:
      "Compte créé. Consultez vos e-mails pour le confirmer, puis connectez-vous. Étape suivante après la connexion : <strong>Appareils</strong> : créez une clé d’envoi et envoyez (POST) votre première mesure.",
    confirmedHtml:
      "Adresse e-mail confirmée. Connectez-vous pour terminer la configuration : prochaine étape, <strong>Appareils</strong>, où vous connectez votre premier capteur.",
    signedOutAll: "Déconnecté sur tous les appareils. Reconnectez-vous ici quand vous le souhaitez.",
    resendConfirmation: "Renvoyer l’e-mail de confirmation",
    email: "E-mail",
    password: "Mot de passe",
    submit: "Se connecter avec un e-mail",
    forgotPassword: "Mot de passe oublié ?",
    newHere: "Nouveau ici ?",
    createAccount: "Créer un compte gratuit",
    privacy: "Confidentialité",
    terms: "Conditions",
  },
  register: {
    title: "Inscription",
    description:
      "Créez un compte ProbeHarbor gratuit, sans carte bancaire. Sondes ESP/Arduino, alertes gel et inondation/fuite, historique pour votre foyer.",
    heading: "Créez votre compte",
    lede: "Gratuit pour toujours, sans carte bancaire. Après l’inscription, vous arrivez sur Appareils pour connecter votre première sonde ou votre détection de fuite par contact humide.",
    preferLook: "Vous préférez jeter un œil d’abord ?",
    liveDemo: "Démo en direct (sans compte)",
    referral:
      "Code de parrainage {code} appliqué. L’essai Pro inclut 7 jours supplémentaires.",
    email: "E-mail",
    password: "Mot de passe",
    passwordHint: "Utilisez au moins 8 caractères.",
    submit: "Créer un compte avec un e-mail",
    agreeHtml:
      'En créant un compte, vous acceptez nos <a class="text-link" href="/terms">Conditions</a> et notre <a class="text-link" href="/privacy">Politique de confidentialité</a>.',
    haveAccount: "Vous avez déjà un compte ?",
    signIn: "Se connecter",
    errors: {
      missing_fields: "Saisissez votre adresse e-mail et votre mot de passe.",
      verification: "La vérification a échoué. Veuillez réessayer.",
      weak_password: "Le mot de passe doit contenir au moins 8 caractères.",
      generic: "Une erreur s’est produite lors de la création de votre compte. Veuillez réessayer.",
      signup_failed: "Une erreur s’est produite lors de la création de votre compte. Veuillez réessayer.",
    },
  },
  oauth: {
    google: "Continuer avec Google",
    github: "Continuer avec GitHub",
    discord: "Continuer avec Discord",
    orContinueWith: "ou continuer avec",
    orUseEmail: "ou utiliser un e-mail",
  },
  errors: {
    missing_fields: "Saisissez votre adresse e-mail et votre mot de passe.",
    invalid_credentials:
      "Connexion impossible. Vérifiez votre adresse e-mail et votre mot de passe, puis réessayez.",
    email_not_confirmed:
      "Confirmez votre adresse e-mail avant de vous connecter. Le lien de confirmation se trouve dans votre boîte de réception.",
    oauth_failed:
      "Impossible de lancer la connexion via un réseau social. Réessayez ou connectez-vous avec votre e-mail.",
    oauth_denied: "La connexion via un réseau social a été annulée. Réessayez quand vous voulez.",
    oauth_provider_failed:
      "La connexion via un réseau social a échoué chez le fournisseur. Réessayez ou connectez-vous avec votre e-mail.",
    oauth_secret_mismatch:
      "Les identifiants de connexion sociale sont obsolètes. Régénérez le client secret dans l’application du fournisseur (Discord, GitHub ou Google) et collez la nouvelle valeur dans Supabase → Authentication → Providers.",
    oauth_github_profile:
      "La connexion GitHub n’a pas pu lire votre profil ni votre e-mail. Révoquez ProbeHarbor dans GitHub → Settings → Authorized OAuth Apps, puis réessayez : l’écran d’autorisation doit afficher ProbeHarbor et demander l’accès à l’e-mail.",
    oauth_exchange_failed:
      "Une erreur s’est produite pendant la connexion via un réseau social. Veuillez réessayer.",
    confirm_link:
      "Ce lien de confirmation a expiré ou a déjà été utilisé. Si vous avez déjà confirmé, connectez-vous simplement.",
    turnstile_failed: "Cochez la case de vérification humaine, puis réessayez.",
    rate_limited:
      "Trop de tentatives de connexion pour ce compte. Patientez quelques minutes et réessayez.",
    generic: "Une erreur s’est produite lors de la connexion. Veuillez réessayer.",
  },
  mfa: {
    title: "Authentification à deux facteurs",
    description: "Terminez la connexion avec un code d’authentification ou un OTP YubiKey.",
    yourAccount: "votre compte",
    errors: {
      invalid_code:
        "Ce code est incorrect ou a expiré. Saisissez un nouveau code de votre application d’authentification.",
      invalid_yubikey:
        "Cet OTP YubiKey n’a pas été accepté. Cliquez dans le champ YubiKey OTP, touchez votre clé (appui long) et attendez le code complet avant de valider.",
      replayed_otp: "Cet OTP YubiKey a déjà été utilisé. Touchez à nouveau votre clé pour générer un nouveau code.",
      yubikey_not_enrolled:
        "Cette YubiKey n’est pas enregistrée sur ce compte. Ajoutez-la dans Paramètres → Sécurité ou utilisez votre code d’authentification.",
      no_factor:
        "Aucun facteur MFA n’est enregistré sur ce compte. Reconnectez-vous et ajoutez-en un dans Paramètres.",
      rate_limited: "Trop de tentatives incorrectes. Patientez quelques minutes et réessayez.",
      generic: "Une erreur s’est produite lors de la vérification de votre code. Réessayez.",
    },
    challenge: {
      heading: "Authentification à deux facteurs",
      lede: "Terminez la connexion de {email} avec un code d’authentification ou un OTP YubiKey.",
      codeLabel: "Code d’authentification",
      verifyCode: "Vérifier le code",
      totpHint:
        "Vous utilisez Yubico Authenticator sur votre YubiKey ? Saisissez le code à 6 chiffres ci-dessus.",
      yubikeyLabel: "YubiKey OTP",
      verifyYubikey: "Vérifier avec la YubiKey",
      otpHint:
        "Ou touchez votre YubiKey dans le champ OTP ci-dessous (appui long, pas les codes Yubico Authenticator).",
      differentAccount: "Utiliser un autre compte",
    },
  },
};

export default fr;

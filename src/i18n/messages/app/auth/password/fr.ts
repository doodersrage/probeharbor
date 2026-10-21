import type { AuthPasswordMessages } from "./en";

const fr: AuthPasswordMessages = {
  backToSignIn: "Retour à la connexion",
  email: "E-mail",
  errors: {
    missing_email: "Saisissez l’adresse e-mail de votre compte.",
    verification: "La vérification a échoué. Veuillez réessayer.",
  },
  forgot: {
    title: "Mot de passe oublié",
    description: "Demandez un lien de réinitialisation du mot de passe de votre compte ProbeHarbor.",
    heading: "Mot de passe oublié",
    lede: "Saisissez l’e-mail de votre compte et nous vous enverrons un lien pour choisir un nouveau mot de passe.",
    sent: "Si un compte existe pour cette adresse, un lien de réinitialisation est en route. Vérifiez votre boîte de réception et vos spams.",
    submit: "Envoyer le lien",
  },
  reset: {
    title: "Réinitialiser le mot de passe",
    description: "Choisissez un nouveau mot de passe pour votre compte ProbeHarbor.",
    heading: "Choisissez un nouveau mot de passe",
    withSession: "Saisissez et confirmez votre nouveau mot de passe ci-dessous.",
    withoutSession: "Ouvrez le lien de réinitialisation reçu par e-mail pour continuer.",
    needsLinkHtml:
      'Cette page nécessite un lien de réinitialisation valide. <a class="text-link" href="/forgot-password">Demandez-en un nouveau</a>.',
    newPassword: "Nouveau mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    submit: "Mettre à jour le mot de passe",
    errors: {
      weak: "Le mot de passe doit contenir au moins 8 caractères.",
      mismatch: "Les mots de passe ne correspondent pas.",
      session: "Votre session de réinitialisation a expiré. Demandez un nouveau lien.",
      update: "Impossible de mettre à jour le mot de passe. Réessayez.",
    },
  },
  resend: {
    title: "Renvoyer la confirmation",
    description: "Demandez un nouveau lien de confirmation d’e-mail pour votre compte ProbeHarbor.",
    heading: "Renvoyer l’e-mail de confirmation",
    lede: "Les liens de confirmation expirent. Saisissez l’e-mail utilisé à l’inscription et nous vous en enverrons un nouveau.",
    sentHtml:
      'Si cette adresse correspond à un compte non confirmé, un nouveau lien de confirmation est en route. Vérifiez votre boîte de réception et vos spams. Déjà confirmé ? <a class="text-link" href="/signin">Connectez-vous</a>.',
    submit: "Envoyer le lien de confirmation",
  },
};

export default fr;

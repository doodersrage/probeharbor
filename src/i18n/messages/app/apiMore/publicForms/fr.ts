import type { ApiMorePublicFormsMessages } from "./en";

const fr: ApiMorePublicFormsMessages = {
  contact: {
    success: "Merci, nous avons bien reçu votre message. Nous répondons généralement sous 1 à 2 jours ouvrés.",
    verificationFailed: "La vérification a échoué.",
    missingFields: "Des champs obligatoires sont manquants.",
    tooLong: "Le message est trop long.",
    recipientMissing: "Le destinataire des e-mails n’est pas configuré.",
    sendFailed: "Impossible d’envoyer le message. Veuillez réessayer.",
  },
  freezeAlerts: {
    success: "Consultez vos e-mails pour confirmer. Les alertes commencent la première nuit de gel qui suit votre confirmation.",
    tooMany: "Trop de tentatives. Réessayez dans quelques minutes.",
    verificationFailed: "La vérification a échoué. Veuillez réessayer.",
    genericError: "Une erreur s’est produite. Veuillez réessayer.",
    unsubscribe: {
      forecastLink: "Prévisions de gel des canalisations",
      invalidTitle: "Lien non valide",
      invalidBodyHtml: "<p>Il manque le jeton dans ce lien de désinscription.</p>",
      confirmTitle: "Arrêter les alertes de gel ?",
      confirmBodyHtml: "<p>Vous ne recevrez plus d’e-mails d’alerte de gel à cette adresse.</p>",
      button: "Me désinscrire",
      doneTitle: "Vous êtes désinscrit",
      doneBodyHtml: "<p>Plus aucun e-mail d’alerte de gel ne sera envoyé à cette adresse.</p>",
      usedTitle: "Déjà désinscrit",
      usedBodyHtml: "<p>Ce lien a déjà été utilisé ou n’est pas valide.</p>",
    },
  },
  shareReadings: {
    missingToken: "Jeton manquant",
    tooManyRequests: "Trop de requêtes",
    invalidLink: "Lien non valide ou expiré",
  },
};

export default fr;

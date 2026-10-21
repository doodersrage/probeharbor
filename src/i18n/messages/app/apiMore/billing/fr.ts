import type { ApiMoreBillingMessages } from "./en";

const fr: ApiMoreBillingMessages = {
  stripe: {
    unknownPlan: "Offre inconnue",
    noItems: "L’abonnement ne contient aucun élément à modifier",
    sessionFailed: "Impossible de créer la session de paiement",
    checkoutFailed: "Impossible de lancer le paiement",
    portalFailed: "Impossible d’ouvrir le portail de facturation",
  },
  claims: {
    requiresPro: "Le dossier de sinistre nécessite l’offre Pro",
    pdfUnavailable: "La génération de PDF est temporairement indisponible. Essayez ?format=html ou réessayez dans un instant.",
  },
  certificate: {
    failed: "Impossible de générer le certificat",
    pdfUnavailable: "Génération de PDF indisponible",
  },
  claimsEmail: {
    eyebrow: "Dossier de sinistre",
    range: "{from} au {to}",
    preheader: "Un rapport ProbeHarbor d’exposition au gel pour {household} est prêt à être consulté.",
    title: "Dossier de sinistre : {household}",
    intro: "Un membre d’un foyer ProbeHarbor a partagé un rapport d’exposition au gel et d’historique des alertes couvrant la période du {range}.",
    body: "Le rapport comprend des statistiques d’exposition au gel, des tableaux des appareils et des sondes, ainsi qu’une chronologie des alertes critiques pour la période choisie, avec un code de vérification permettant de reconfirmer plus tard cet export précis.",
    verificationCode: "Code de vérification : {code}",
    cta: "Voir le dossier de sinistre",
    historyCta: "Ouvrir cette période dans Historique",
    footerNote:
      "Ce rapport a été envoyé par un membre d’un foyer ProbeHarbor. Il s’agit d’un résumé de surveillance, pas d’une inspection certifiée -- consultez le rapport lui-même pour le contexte complet.",
    subject: "Dossier de sinistre : {household}",
  },
};

export default fr;

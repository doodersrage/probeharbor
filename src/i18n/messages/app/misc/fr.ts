import type { MiscMessages } from "./en";

const fr: MiscMessages = {
  feeds: {
    requestFailed: "La requête vers le flux de température a échoué ({status})",
    invalidPayload: "Données du flux de température non valides",
    missingRoot: "Il manque un objet « {root} » dans le flux de température",
    timedOut: "Le flux n’a pas répondu à temps.",
    invalidJson: "Le flux n’a pas renvoyé de JSON valide.",
    unreachableDetail: "Impossible de joindre le flux ({detail})",
    unknown: "Erreur de flux inconnue",
    unreachable: "Flux injoignable",
    responding: { one: "{count} sonde répond", other: "{count} sondes répondent" },
  },
  forms: {
    turnstileMissing: "Vérification Turnstile manquante.",
    turnstileFailed: "La vérification Turnstile a échoué.",
    tooManyAttempts: "Trop de tentatives. Réessayez dans quelques minutes.",
    tooManyMessages: "Trop de messages. Réessayez dans quelques minutes.",
  },
  share: {
    metricsNotAllowed: "Ce lien de partage n’autorise pas les formats de métriques",
  },
};

export default fr;

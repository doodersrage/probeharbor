import type { ApiUserMessages } from "./en";

const fr: ApiUserMessages = {
  testAlert: {
    title: "Alerte de test ProbeHarbor",
    body: "Ceci est une notification de test envoyée depuis votre tableau de bord ProbeHarbor. Si vous la recevez, vos canaux d’alerte fonctionnent.",
    unknownChannel: "Canal inconnu",
    noChannels: "Aucun canal n’a reçu l’alerte",
    failed: "Échec de l’alerte de test",
  },
  snooze: {
    snoozed: { one: "Alertes en pause pendant {count} heure.", other: "Alertes en pause pendant {count} heures." },
    vacationUntil: "Vacances jusqu’au {date}.",
    vacationDays: { one: "Mode vacances pendant {count} jour.", other: "Mode vacances pendant {count} jours." },
    snoozeCleared: "Pause annulée.",
    vacationCleared: "Mode vacances désactivé.",
  },
  ack: {
    nothing: "Aucune alerte dont accuser réception",
    handled: { one: "{count} alerte traitée.", other: "{count} alertes traitées." },
  },
  chartShare: {
    upgradeRequired: "Le partage de graphiques nécessite une offre supérieure",
    invalidPng: "PNG non valide",
  },
  pinned: {
    invalidMetric: "Indicateur non valide",
    max: "Vous pouvez épingler jusqu’à {max} indicateurs d’état.",
    noMetrics: "Aucun indicateur",
  },
  noEditableProperties: "Aucun bien modifiable",
  noProperty: "Aucun bien",
  noValidFeeds: "Aucun flux valide fourni.",
  feedIdRequired: "L’identifiant du flux est obligatoire",
  csvRequiresPlan: "L’export CSV nécessite un abonnement actif ou un accès administrateur",
  doorCsvFailed: "L’export de l’historique des portes a échoué. Réessayez dans un instant.",
  doorCsvTooMany: "Trop d’ouvertures de portes pour un seul CSV (plus de 5 000). Choisissez moins de jours et réessayez.",
  push: {
    invalidSubscription: "Abonnement non valide",
    missingEndpoint: "Endpoint manquant",
    invalidFcmToken: "Jeton FCM non valide",
    invalidPlatform: "Plateforme non valide",
    missingToken: "Jeton manquant",
  },
  weather: {
    historyUnavailable: "Historique météo indisponible",
    notConfigured: "L’API météo n’est pas configurée",
    locationUnavailable: "Impossible de charger la météo pour ce lieu.",
    geocodeFailed: "Lieu introuvable",
    geocodeRequestFailed: "Échec de la recherche du lieu",
  },
};

export default fr;

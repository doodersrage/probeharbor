import type { ApiDevicesMessages } from "./en";

const fr: ApiDevicesMessages = {
  nameRequired: "Le nom est obligatoire",
  deviceNotFound: "Appareil introuvable",
  sameHousehold: "C’est le même foyer",
  renameFailed: "Impossible de renommer l’appareil",
  updateSpaceFailed: "Impossible de mettre à jour l’espace",
  replaceErrors: {
    same_sensor: "Choisissez deux capteurs différents.",
    kind_mismatch: "Les deux capteurs doivent être du même type (température avec température).",
    sensor_not_found: "L’un de ces capteurs ne fait plus partie de ce bien.",
    failed: "Impossible de remplacer le capteur. Rien n’a été modifié.",
  },
  reveal: {
    tooManyAttempts: "Trop de tentatives d’affichage. Réessayez dans {seconds} secondes.",
    notConfigured: "La récupération des clés n’est pas configurée sur ce serveur.",
    verifyMfa: "Validez à nouveau la MFA avant d’afficher les clés d’ingestion.",
    deviceNotFound: "Appareil introuvable.",
    noRecoverableKey: "Aucune clé récupérable pour cet appareil. Régénérez-la pour en obtenir une nouvelle.",
    decryptFailed: "Impossible de déchiffrer la clé enregistrée.",
  },
  noSensorsProvided: "Aucun capteur fourni.",
  pullFetchProbes: { one: "{count} sonde", other: "{count} sondes" },
  feedTest: {
    tooMany: "Trop de tests de flux. Réessayez dans un instant.",
    invalidUrl: "Saisissez une URL de flux HTTPS valide.",
    requestFailed: "La requête vers le flux a échoué ({status}).",
    found: { one: "{count} sonde trouvée (JSON {format}).", other: "{count} sondes trouvées (JSON {format})." },
    foundWithAverage: {
      one: "{count} sonde trouvée (JSON {format}), moyenne {average} °F.",
      other: "{count} sondes trouvées (JSON {format}), moyenne {average} °F.",
    },
    failed: "Échec du test du flux",
  },
};

export default fr;

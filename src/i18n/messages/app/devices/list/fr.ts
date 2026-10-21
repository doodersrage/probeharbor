import type { DevicesListMessages } from "./en";

const fr: DevicesListMessages = {
  list: {
    title: "Appareils ({count})",
    subtitle: "Les plus critiques d’abord. Ouvrez un appareil pour le renommer, définir son espace ou corriger ses capteurs.",
    addDevice: "Ajouter un appareil",
    warmHint:
      "affiche {gap}°F de plus que vos autres sondes. Si ce capteur est collé à sa carte, éloignez-le de quelques centimètres au bout de ses fils : les cartes ESP32 chauffent et faussent la mesure.",
    unplaced: {
      one: "{count} appareil n’a pas d’espace défini, la couverture et les alertes ne peuvent donc pas dire où il se trouve.",
      other: "{count} appareils n’ont pas d’espace défini, la couverture et les alertes ne peuvent donc pas dire où ils se trouvent.",
    },
    unplacedBulk: "Utilisez Sélectionner plusieurs ci-dessous pour en placer un lot d’un coup.",
    unplacedSingle: "Ouvrez-le pour en définir un.",
    empty: "Aucun appareil pour l’instant.",
    emptyLink: "Connectez votre premier capteur",
    noSpace: "Aucun espace",
    push: "Push",
    pullFeed: "Flux récupéré",
    disabled: "Désactivé",
    health: {
      healthy: "En bonne santé",
      watch: "À surveiller",
      at_risk: "À risque",
      offline: "Hors ligne",
    },
    noReading: "Aucune mesure",
    firmwareUpdate: "Mise à jour du firmware disponible",
    never: "Jamais",
    battery: "Batterie {pct} %",
  },
  bulk: {
    summary: "Sélectionner plusieurs…",
    doThis: "Action",
    ops: {
      set_space: "Définir l’espace",
      enable: "Activer",
      disable: "Désactiver",
      delete: "Supprimer",
    },
    space: "Espace",
    spacePlaceholder: "Garage",
    apply: "Appliquer à la sélection",
    selectAll: "Tout sélectionner",
    selectUnplaced: "Sélectionner ceux sans espace",
    selectSilent: "Sélectionner les {count} muets depuis 30 jours ou plus",
    noSpace: "aucun espace",
    disabled: "désactivé",
    confirmDelete: {
      one: "Supprimer {count} appareil ? Cette action est irréversible.",
      other: "Supprimer {count} appareils ? Cette action est irréversible.",
    },
  },
  coverage: {
    title: "Couverture de protection",
    subtitle: "Ce qui est surveillé dans chaque espace, d’après les capteurs de ses appareils.",
    noGaps: "Aucune lacune détectée.",
    gapCount: "{gaps} espaces sur {total} présentent une lacune.",
    caption: "Couverture de surveillance par espace",
    spaceColumn: "Espace",
    risks: {
      freeze: "Température",
      leak: "Fuite",
      door: "Porte",
      power: "Courant",
    },
    states: {
      live: "transmet",
      stale: "ne transmet pas",
      none: "non surveillé",
    },
    devices: { one: "{count} appareil", other: "{count} appareils" },
    legend:
      "✓ transmet · ! le capteur existe mais n’a rien transmis récemment · — non surveillé. Les espaces proviennent du paramètre d’espace de chaque appareil.",
    unassigned: "Aucun espace défini",
    gaps: {
      unassigned: "Définissez un espace pour ces appareils afin de suivre la couverture pièce par pièce.",
      noTemperature: "Aucune sonde de température : les alertes de gel ne peuvent pas couvrir cet espace.",
      staleTemperature: "La sonde de température n’a rien transmis récemment, les alertes de gel ne peuvent donc pas se déclencher ici.",
      staleLeak: "Le capteur de fuite n’a rien transmis récemment.",
      noLeakWetSpace: "Aucun capteur de fuite ici, alors que ce type d’espace a généralement de la plomberie.",
      staleDoor: "Le capteur de porte n’a rien transmis récemment.",
      stalePower: "Le capteur de courant n’a rien transmis récemment.",
    },
  },
};

export default fr;

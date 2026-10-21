import type { DeviceSetupPushMessages } from "./en";

const fr: DeviceSetupPushMessages = {
  title: "Ajouter un appareil push",
  subtitleHtml:
    'ESP32, Pico W, ESPHome, Home Assistant ou tout ce qui sait envoyer du JSON en POST. Vous obtenez une URL d’ingestion ; les capteurs sont ajoutés automatiquement dès le premier envoi. Limite : {max} appareils par bien ({tier}). Voir la <a class="text-link" href="/about/ingest-and-webhooks">documentation d’ingestion</a> · <a class="text-link" href="/docs/api">référence rapide de l’API</a>.',
  vaultOffHtml:
    "La récupération de la clé d’ingestion (Afficher) n’est pas activée sur cette instance. Copiez la clé dans l’encadré affiché 30 minutes lorsque vous créez un appareil ou cliquez sur <strong>Renouveler la clé</strong> sur sa carte : il n’y aura rien à déchiffrer plus tard.",
  atLimitHtml:
    'Vous avez atteint votre limite d’appareils push. <a class="text-link" href="/dashboard/plans">Passez à une offre supérieure</a> pour en ajouter, ou supprimez un appareil ci-dessous.',
  name: "Nom",
  namePlaceholder: "Sonde tuyau du garage",
  space: "Espace",
  spacePlaceholder: "Garage",
  createDevice: "Créer l’appareil",
  commonSpacesLabel: "Espaces courants",
  commonSpaces: [
    "Garage",
    "Grenier",
    "Vide sanitaire",
    "Sous-sol",
    "Atelier",
    "Buanderie",
    "Abri de jardin",
  ],
  firstRunHtml:
    'Utilisez <a class="text-link" href="#devices-first-run">Connecter votre premier capteur</a> ci-dessus pour choisir une méthode.',
  viewOnly: "Accès en lecture seule : la création d’appareils est désactivée.",
  otherDevicesHtml: {
    one: 'Vous avez {count} autre appareil dans l’onglet <a class="text-link" href="/dashboard/devices?view=ops">Appareils</a>.',
    other:
      'Vous avez {count} autres appareils dans l’onglet <a class="text-link" href="/dashboard/devices?view=ops">Appareils</a>.',
  },
  keyPrefix: "préfixe de clé {prefix}…",
  neverSeen: "jamais vu",
  freshness: {
    offline: "Hors ligne · vu pour la dernière fois {age}",
    lagging: "Peut-être hors ligne · vu pour la dernière fois {age}",
    updated: "Mis à jour {age}",
  },
  firmware: "firmware {version}",
  updateTo: "Mettre à jour vers {version}",
  labelsFine: "Les libellés conviennent tels quels.",
  renameLater: "Renommer plus tard",
  noPostsYet:
    "Aucun envoi pour l’instant : le premier POST JSON importe automatiquement les clés des capteurs.",
  waitingKeys: "En attente du premier POST avec les clés",
  seeChecklist: "Voir la liste de vérification",
  manage: "Gérer",
  openDevice: "Ouvrir la page de l’appareil →",
  rename: "Renommer",
  spaceExamplePlaceholder: "garage, grenier, vide sanitaire…",
  saveSpace: "Enregistrer l’espace",
  rotateConfirm:
    "Renouveler cette clé d’ingestion ? L’ancienne clé cesse de fonctionner immédiatement.",
  rotateKey: "Renouveler la clé",
  moveTo: "Déplacer vers",
  transferDevice: "Transférer l’appareil",
  deleteConfirm: "Supprimer cet appareil push et ses capteurs ?",
  delete: "Supprimer",
  noSensorsYet:
    "Aucun capteur pour l’instant : ils apparaîtront automatiquement après votre premier POST. N’utilisez la section Avancé que pour associer des clés à l’avance.",
  sensorsList: "Capteurs : {list}.",
  editSensors: "Modifier capteurs, types et étalonnage →",
  advancedSummary: "Avancé : associer les clés JSON manuellement",
  advancedHint:
    "Facultatif : ignorez cette étape si vous envoyez déjà du JSON et laissez l’import automatique gérer les clés.",
  quickPairTitle: "Ajout rapide : paire température + humidité",
  quickPairHintHtml:
    "Même clé JSON pour les deux (par ex. <code>0</code> ou <code>temp1</code>) : la sonde type DHT habituelle.",
  device: "Appareil",
  jsonKey: "Clé JSON",
  nameOnHome: "Nom sur l’accueil",
  pairLabelDefault: "Atelier",
  addPair: "Ajouter la paire",
  orAddOne: "Ou ajoutez un capteur",
  sensorLabelPlaceholder: "Porte de l’atelier",
  type: "Type",
  addSensor: "Ajouter le capteur",
  kindLabels: {
    temperature: "Température",
    humidity: "Humidité",
    co2: "CO₂",
    pressure: "Pression barométrique",
    pm25: "PM2,5",
    voc: "COV",
    level: "Niveau d’eau / puisard",
    energy: "Énergie",
    door: "Porte",
    power: "Alimentation",
    flood: "Inondation / fuite",
    motion: "Mouvement",
    generic: "Générique",
  },
  client: {
    suggestedName: "Sonde {space}",
  },
  inlineRename: {
    renameImported: "Renommer les capteurs importés",
    quickRename: "Renommage rapide",
    acceptSuggested: "Accepter les suggestions",
    saving: "Enregistrement…",
    saveNames: "Enregistrer les noms",
    couldNotSave: "Enregistrement impossible.",
    saved: "Enregistré.",
  },
  revealKey: {
    loading: "Chargement…",
    keyShown: "Clé affichée ci-dessous",
    reveal: "Afficher la clé d’ingestion",
    srKeyFor: "Clé d’ingestion de {name} : ",
    copied: "Copiée",
    copyKey: "Copier la clé",
    errorDisabled:
      "Impossible d’afficher la clé. Si la récupération est désactivée sur ce serveur, utilisez Renouveler la clé sur la carte de l’appareil.",
    errorNetwork:
      "Impossible d’afficher la clé. Si la récupération est désactivée, utilisez Renouveler la clé sur la carte de l’appareil pour obtenir une nouvelle URL d’ingestion.",
    errorCopy: "Impossible de copier dans le presse-papiers.",
  },
};

export default fr;

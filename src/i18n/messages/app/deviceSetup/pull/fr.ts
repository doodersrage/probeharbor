import type { DeviceSetupPullMessages } from "./en";

const fr: DeviceSetupPullMessages = {
  title: "Flux JSON interrogés",
  subtitle:
    "Du JSON en HTTPS que nous récupérons à intervalles réguliers. Les clés des sondes sont importées à l’enregistrement : renommez-les ci-dessous si besoin.",
  exampleSummary: "Pas encore de flux à vous ? Essayez le flux d’exemple",
  viewOnly:
    "Accès en lecture seule : les réglages des flux et des sondes sont masqués.",
  feeds: {
    heading: "URL des flux",
    introHtml:
      'Points d’accès JSON en HTTPS que nous interrogeons à intervalles réguliers. Les objets sonde se trouvent sous une clé racine (par défaut <code>temp</code>). <a class="text-link" href="/about/json-probe-output-schema">documentation du schéma</a>.',
    selectAll: "Tout sélectionner",
    enable: "Activer",
    disable: "Désactiver",
    deleteSelected: "Supprimer la sélection",
    selectFeed: "Sélectionner {name}",
    name: "Nom",
    namePlaceholder: "Atelier",
    url: "URL HTTPS",
    jsonRoot: "Clé racine JSON",
    jsonRootTitle:
      "Une lettre ou un tiret bas, puis des lettres, chiffres ou tirets bas",
    jsonRootHintHtml:
      "Objet qui contient les clés des sondes (généralement <code>temp</code>).",
    enabled: "Activé",
    delete: "Supprimer",
    deleteConfirm: "Supprimer ce flux ?",
    addFeed: "Ajouter un flux",
  },
  client: {
    bulkDeleteConfirm: {
      one: "Supprimer {count} flux ? Cette action est irréversible.",
      other: "Supprimer {count} flux ? Cette action est irréversible.",
    },
  },
  feedTest: {
    enterUrl: "Saisissez d’abord l’URL d’un flux.",
    ok: "Flux OK",
    failed: "Échec du test du flux",
    unable: "Impossible de tester le flux.",
    testing: "Test en cours…",
    test: "Tester l’URL du flux",
  },
  probeMapper: {
    importedAuto:
      "Clés des sondes importées depuis votre flux : renommez-les ci-dessous, puis enregistrez.",
    enterUrl: "Saisissez d’abord l’URL d’un flux.",
    noProbes: "Aucune sonde trouvée dans le flux.",
    imported: {
      one: "{count} sonde importée. Renommez-la ci-dessous, puis enregistrez.",
      other:
        "{count} sondes importées. Renommez-les ci-dessous, puis enregistrez.",
    },
    unableRead: "Impossible de lire le flux.",
    appliedSuggested:
      "Noms suggérés appliqués : modifiez-les ci-dessous, puis enregistrez.",
    hiddenAvg:
      "Sondes « avg » masquées sur l’accueil : enregistrez la configuration pour conserver ce choix.",
    saveFailed: "Échec de l’enregistrement de la configuration.",
    unableSave: "Impossible d’enregistrer la configuration.",
    saveFeedFirst:
      "Enregistrez d’abord l’URL d’un flux, puis détectez ici les clés des sondes.",
    heading: "Noms des sondes",
    intro:
      "Détectez les sondes dans le JSON de votre flux, puis renommez-les pour l’accueil. Les clés restent liées au flux ; vous ne modifiez que les noms affichés.",
    readingFeed: "Lecture du flux…",
    discover: "Détecter dans le flux",
    feed: "Flux",
    jsonKey: "Clé JSON",
    nameOnHome: "Nom sur l’accueil",
    showOnHome: "Afficher sur l’accueil",
    remove: "Retirer",
    importing: "Lecture du flux et import des clés des sondes…",
    emptyHint:
      "Enregistrez l’URL d’un flux pour importer les clés automatiquement, ou cliquez sur Détecter dans le flux.",
    savePullSetup: "Enregistrer la configuration",
    acceptSuggested: "Accepter les noms suggérés",
    hideAvg: "Masquer avg sur l’accueil",
  },
  saveBar: {
    saveFailed: "Échec de l’enregistrement.",
    enterUrl: "Saisissez d’abord l’URL d’un flux.",
    saving: "Enregistrement…",
    save: "Enregistrer la configuration",
    hintWithFeeds:
      "Les modifications d’URL ou de noms de sondes ne sont enregistrées que lorsque vous cliquez sur Enregistrer la configuration.",
    hintNoFeeds:
      "Ajoutez l’URL d’un flux, puis enregistrez pour importer automatiquement les clés des sondes.",
  },
  fetch: {
    fetching: "Récupération…",
    fetchFailed: "Échec de la récupération.",
    errorPrefix: "Erreur : {message}",
    notFetched: "Non récupéré",
    complete:
      "Récupération terminée : actualisez l’accueil pour voir les nouvelles mesures.",
    couldNotFetch: "Impossible de récupérer les flux.",
    rowFailed: "Échec de la récupération",
    fetchNow: "Récupérer maintenant",
    hint: "Récupérez les mesures tout de suite au lieu d’attendre la prochaine interrogation planifiée.",
  },
  demo: {
    button: "Essayer le flux de démo",
    buttonFirstRun: "Essayer avec un flux de démo",
    settingUp: "Configuration…",
    hint: "JSON météo en direct, sans matériel.",
    couldNotSave: "Impossible d’enregistrer le flux d’exemple.",
  },
};

export default fr;

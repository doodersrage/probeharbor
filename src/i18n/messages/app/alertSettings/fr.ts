import type { AlertSettingsMessages } from "./en";

const fr: AlertSettingsMessages = {
  viewOnly: "Lecture seule : les paramètres d’alerte ne peuvent pas être modifiés sur ce compte.",
  essentialsIntroHtml:
    "Commencez par <strong>Quand alerter</strong> et <strong>Comment vous êtes prévenu</strong>, enregistrez, puis envoyez une alerte de test ci-dessous.",
  defaultValue: "Par défaut : {value}",

  essentials: {
    title: "Quand alerter",
    subtitle: "Gel, fuites, capteurs muets et alertes anticipées.",
    turnOn: "Activer les alertes",
    freezeBelow: "Gel en dessous de (°F)",
    freezeHint: "Alerte quand une sonde est à cette température ou en dessous.",
    dwellLabel: "Attendre avant d’alerter (minutes)",
    dwellHint:
      "Durée pendant laquelle une sonde doit rester au seuil de gel ou en dessous. Avec 5 à 15, une porte ouverte un instant est ignorée ; avec 0, l’alerte part dès la première mesure froide.",
    leakHint: "Les capteurs de fuite alertent automatiquement dès qu’ils détectent de l’eau.",
    powerAlerts:
      "Alerter quand un capteur d’alimentation indique une coupure (chauffages, câbles chauffants et pompes de relevage peuvent aussi être coupés)",
    outageToggle: "Alerter si un capteur cesse d’envoyer des mesures",
    outageHours: "Après ce nombre d’heures sans mesure",
    outageHint:
      "Une sonde muette ne peut pas vous prévenir du gel : c’est souvent l’alerte la plus utile.",
    earlyWarnings: "Alertes anticipées",
    runwayToggle: "Prévenir avant qu’une sonde atteigne le gel, tant qu’il est encore temps d’agir",
    runwayHint:
      "Estime quand chaque espace atteindra votre seuil de gel d’après sa vitesse de refroidissement (et la prévision extérieure si un lieu météo est défini), puis prévient dans la fenêtre ci-dessus pour que vous puissiez laisser goutter les robinets ou ajouter du chauffage.",
    forecastToggle: "Prévenir quand la prévision extérieure passe sous zéro",
    forecastHours: "Combien d’heures à l’avance",
    forecastHoursHint: "Utilisé par les deux alertes anticipées : prévision de gel et délai avant gel.",
    nwsSummary: "Humidité, chutes rapides et alertes officielles de gel",
    humidityAbove: "Humidité au-dessus de (%)",
    rateDrop: "Chute rapide (°F / heure)",
    nwsToggle: "Alertes officielles gel / froid du NWS (États-Unis)",
    perSensorSummary: "Seuils différents par capteur",
    perSensorHint:
      "Par défaut, chaque capteur de température utilise les seuils de gel et d’humidité du foyer ci-dessus. Cochez certains capteurs pour limiter les alertes de seuil, ou définissez une valeur propre par capteur.",
    allSensors: "Tous les capteurs de température (par défaut)",
    freezeOverride: "Seuil de gel propre (°F, facultatif)",
    humidityOverride: "Seuil d’humidité propre (%, facultatif)",
    healthSummary: "Batterie, signal Wi-Fi et vérification des flux",
    lowBattery: "Alertes de batterie faible",
    batteryTrend: "Baisse continue de la batterie",
    batteryBelow: "Batterie en dessous de (%)",
    weakWifi: "Signal Wi-Fi faible",
    rssiBelow: "RSSI en dessous de (dBm)",
    feedUptime: "Flux injoignable (vérification horaire des flux JSON interrogés)",
  },

  channels: {
    title: "Comment vous êtes prévenu",
    subtitle:
      "E-mail plus toute appli de messagerie, SMS, push ou webhook. Chaque canal coché reçoit toutes les alertes.",
    alertEmail: "E-mail d’alerte",
    sendByEmail: "Envoyer les alertes par e-mail",
    otherChannels: "Autres canaux",
    push: "Push (navigateur + Android)",
    outboundWebhook: "Webhook sortant",
    twilioMissing:
      "Votre offre inclut les SMS, mais Twilio n’est pas configuré sur ce serveur. Les messages seront ignorés tant que les secrets `TWILIO_*` ne sont pas définis.",
    unlockProHtml: 'Débloquez les SMS et les webhooks avec <a class="text-link" href="/dashboard/plans">Pro</a>.',
    webhookUrl: "URL du webhook",
    botToken: "Jeton du bot",
    chatId: "ID de discussion (requis pour les commandes)",
    webhookSecret: "Secret du webhook (facultatif)",
    telegramHintHtml:
      "Utilisez <code>setWebhook</code> de Telegram avec <code>secret_token</code> pour que Telegram envoie <code>X-Telegram-Bot-Api-Secret-Token</code> (le paramètre <code>?secret=</code> n’est pas accepté). Enregistrez un ID de discussion ci-dessus : les commandes ne fonctionnent que depuis cette discussion (/status [nom], /snooze [heures], /vacation [jours]).",
    incomingWebhookUrl: "URL du webhook entrant",
    topic: "Sujet",
    serverOptional: "Serveur (facultatif)",
    userKey: "Clé utilisateur",
    appToken: "Jeton de l’appli",
    phoneNumber: "Numéro de téléphone",
    smsHint: "Format international, par ex. +1 pour les numéros américains.",
    url: "URL",
    signingSecret: "Secret de signature (facultatif)",
    pushHintHtml:
      "Un seul canal couvre <strong>ce navigateur</strong> (Web Push) et l’<strong>appli Android ProbeHarbor</strong> (FCM). Activez-le ci-dessous pour ce navigateur ; l’appli Android s’enregistre automatiquement quand vous vous connectez avec Pro.",
    pushNotConfigured: "Le push navigateur n’est pas encore configuré sur le serveur (clés VAPID manquantes).",
    pushChecking: "Vérification de l’état du push…",
    pushEnable: "Activer le push navigateur sur cet appareil",
  },

  quiet: {
    title: "Mettre les alertes en pause",
    subtitle: "Heures calmes la nuit, ou pause et mode vacances quand vous êtes déjà au courant.",
    enable: "Activer les heures calmes",
    bypassFreeze: "Toujours envoyer les alertes de gel, d’inondation et de prévision",
    smsCritical: "Envoyer quand même par SMS les alertes critiques gel/inondation/prévision (Pro)",
    upgradeLinkHtml: ' : <a class="text-link" href="/dashboard/plans">Passer à l’offre supérieure</a>',
    start: "Début",
    end: "Fin",
    timezone: "Fuseau horaire",
    snoozeSummary: "Pause ou vacances",
    snoozeHint:
      "La pause suspend la plupart des alertes (les alertes de capteur muet et d’inondation restent actives). Le mode vacances coupe les alertes de routine (vitesse de variation, règles, batterie, résumés) jusqu’à une date de retour ou pendant un nombre de jours donné ; les alertes de gel, de prévision et d’inondation restent actives.",
    snoozedUntil: "En pause jusqu’au {date}.",
    vacationUntil: "En vacances jusqu’au {date}.",
    snooze24: "Pause 24 h",
    vacation7: "Vacances 7 j",
    clearSnooze: "Annuler la pause",
    endVacation: "Terminer les vacances",
    vacationUntilLabel: "Vacances jusqu’au",
    setVacationUntil: "Définir la date de retour",
  },

  reports: {
    title: "E-mails récapitulatifs",
    subtitle: "Résumé hebdomadaire et rapports plus complets. Aucun de ces e-mails n’est une alerte.",
    weeklyDigest: "Résumé hebdomadaire par e-mail (le lundi) : nuit la plus froide, fuites et coupures",
    portfolioDigest: "Résumé des biens à risque : e-mail dès qu’un bien atteint le gel",
    monthlyReport: "Rapport mensuel sur le gel (le 1er du mois, pièce jointe HTML)",
    quarterlyReport: "Rapport saisonnier trimestriel (janv., avr., juil., oct.)",
    dripEmails: "Conseils de démarrage (1, 3 et 7 jours après l’inscription)",
    freezeDrill: "Exercice gel d’avant-saison (e-mail de septembre à novembre avec score de préparation)",
  },

  automation: {
    title: "Règles et escalade",
    subtitle:
      "Vos propres conditions (par ex. tuyau sous 3 °C (38 °F) pendant qu’une porte est ouverte), étapes de suivi et renvois par SMS.",
    compositeRules: "Règles combinées",
    compositeHintHtml:
      'Se déclenchent quand toutes (ou l’une) des conditions d’une règle sont vraies, par ex. tuyau sous 3 °C (38 °F) ET extérieur sous −7 °C (20 °F). Les inondations alertent déjà dès que c’est mouillé ; n’ajoutez une condition d’inondation ici que pour la combiner à d’autres vérifications. Exemple porte + froid : <a class="text-link" href="/about/garage-door-cold-playbook">guide de la porte de garage</a>.',
    addRule: "Ajouter une règle",
    addHeatRule: "Ajouter une règle de chaleur ({threshold} °F)",
    playbooks: "Scénarios d’alerte",
    playbooksHint: "Étapes de suivi après l’alerte initiale : par ex. un SMS 15 minutes plus tard si personne n’en a accusé réception.",
    addStep: "Ajouter une étape",
    smsEscalation: "Escalade par SMS",
    escalationToggle: "Renvoyer par SMS les alertes de seuil",
    afterMinutes: "Après (minutes)",
  },

  advanced: {
    title: "Avancé",
    subtitle: "Routage des canaux par type et par espace, textes de message personnalisés et webhooks de mesures.",
    severitySummary: "Routage par gravité (facultatif)",
    severityHint:
      "Laissez vide pour utiliser les cases de canaux générales. Sinon, seuls les canaux choisis sont utilisés pour ce type.",
    spaceSummary: "Routage des canaux par espace",
    spaceEmpty:
      "Attribuez un espace à vos appareils (Tableau de bord → Appareils) pour router les alertes selon l’emplacement.",
    spaceHint:
      "Choisissez les canaux par espace et par type d’alerte. Les types non cochés suivent le routage général ou par gravité.",
    templatesSummary: "Messages d’alerte personnalisés",
    templatesHintHtml: "Remplacez le titre ou le corps par type d’alerte. Variables : {vars}.",
    templateTitle: "Titre",
    templateBody: "Corps",
    templatePlaceholder: "Laisser vide pour le texte par défaut",
    readingSummary: "Webhooks de mesures (Pro)",
    readingUrl: "URL du webhook de mesures",
    readingHint: "POST à chaque ingestion réussie d’un appareil, avec le JSON des dernières mesures.",
  },

  save: {
    button: "Enregistrer les paramètres d’alerte",
    incompleteHint: "Un canal coché doit avoir sa destination renseignée, sinon il sera ignoré lors des alertes.",
    notApplied: "Les modifications ne s’appliquent qu’après l’enregistrement.",
  },

  channelLabels: {
    email: "E-mail",
  },
  channelIds: {
    email: "e-mail",
  },
  kindIds: {
    threshold: "seuil",
    flood: "inondation",
    power: "alimentation",
    runway: "délai avant gel",
    forecast: "prévision",
    nws: "NWS",
    rate: "variation",
    outage: "silence",
    rule: "règle",
    battery: "batterie",
    rssi: "RSSI",
    stuck: "sonde bloquée",
    recovery: "rétablissement",
  },
  kindLabels: {
    threshold: "Seuil",
    flood: "Inondation / fuite",
    power: "Coupure de courant",
    runway: "Délai avant gel",
    forecast: "Prévision",
    nws: "NWS",
    rule: "Règle",
    outage: "Capteur muet",
    rate: "Chute rapide",
    battery: "Batterie",
    rssi: "Signal",
    generic: "Générique",
  },

  delivery: {
    lastFailed: "Dernière tentative échouée {age}",
    lastDelivered: "Dernière acceptation par le fournisseur {age}",
    none: "Aucune livraison pour l’instant",
    failedTitle: "Vérifiez la destination ci-dessous, puis envoyez un test.",
    sendTest: "Envoyer un test",
    sendTestTitle: "Envoyer un test à ce canal uniquement",
    saveFirstTitle: "Enregistrez d’abord les paramètres avec ce canal activé",
  },

  clientSubmit: {
    saving: "Enregistrement…",
    saveButton: "Enregistrer les paramètres d’alerte",
    saveFailed: "Impossible d’enregistrer les paramètres d’alerte.",
    pickVacationDate: "Choisissez une date de retour de vacances.",
    snoozeFailed: "Impossible de mettre à jour la pause.",
    updated: "Mis à jour.",
    sending: "Envoi…",
    sent: "Envoyé. Vérifiez {channel}.",
    notSentReasons: "Non envoyé : {reasons}.",
    notSent: "Non envoyé. Vérifiez la destination de ce canal, enregistrez et réessayez.",
    unreachable: "Impossible de joindre le serveur. Réessayez.",
  },

  clientRules: {
    valuePlaceholder: "valeur",
    labelPlaceholder: "le nom contient",
    remove: "Retirer",
    on: "Active",
    namePlaceholder: "Nom de la règle",
    deleteRule: "Supprimer la règle",
    fireWhen: "Déclencher quand",
    allOf: "toutes",
    anyOf: "au moins une",
    theseAreTrue: "de ces conditions sont vraies :",
    addCondition: "Ajouter une condition",
    newRuleName: "Nouvelle règle",
    heatRuleName: "Trop chaud",
  },

  clientPlaybooks: {
    namePlaceholder: "Nom de l’étape",
    afterMinutes: "Après (min)",
    onlyIfUnacked: "Seulement sans accusé de réception",
    delete: "Supprimer",
    channels: "Canaux",
    kinds: "Types (aucun = tous)",
    newStepName: "Étape d’escalade",
  },

  clientPush: {
    noVapidKey: "La clé publique VAPID n’est pas configurée",
    noVapidKeyServer: "La clé publique VAPID n’est pas configurée sur le serveur",
    permissionDenied: "L’autorisation des notifications n’a pas été accordée",
    serverRejected: "Le serveur a refusé l’abonnement",
    subscribed: "Abonné sur ce navigateur. Enregistrez les paramètres d’alerte, puis envoyez un test.",
    subscribedHint:
      "Le canal « Push (navigateur + Android) » a été coché : cliquez sur Enregistrer les paramètres d’alerte avant de tester.",
    refresh: "Réactiver / actualiser le push",
    unsupported: "Ce navigateur ne prend pas en charge le push.",
    blocked:
      "Les notifications sont bloquées pour ce site. Autorisez-les dans les paramètres du navigateur, puis réessayez.",
    retry: "Réessayer d’activer le push",
    enabled: "Push activé sur ce navigateur.",
    androidDevices: {
      one: "{count} appareil Android est aussi enregistré.",
      other: "{count} appareils Android sont aussi enregistrés.",
    },
    channelOnHint: "Le canal push est activé : testez ci-dessous (navigateur + Android).",
    channelOffHint:
      "Cochez « Push (navigateur + Android) » dans les canaux ci-dessus, enregistrez, puis envoyez un test.",
    finishing: "Autorisation accordée : finalisation de l’abonnement du navigateur…",
    subscribeFailed: "Autorisation accordée, mais l’abonnement a échoué : {error}",
    subscribe: "Abonner ce navigateur",
    notSubscribed: "Autorisation accordée, mais ce navigateur n’est pas encore abonné.",
    notEnabled: "Pas encore activé sur ce navigateur.",
    enable: "Activer le push navigateur sur cet appareil",
    vapidMissing:
      "Les clés VAPID du serveur sont manquantes : le push navigateur ne peut rien envoyer tant qu’elles ne sont pas configurées.",
    androidRegistered:
      "L’appli Android est enregistrée : cochez « Push (navigateur + Android) », enregistrez, puis testez.",
    statusFailed: "Impossible de lire l’état du push.",
    enableFailed: "Impossible d’activer le push : {error}",
  },
};

export default fr;

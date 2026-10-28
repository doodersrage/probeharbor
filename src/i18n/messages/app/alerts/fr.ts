import type { AlertsMessages } from "./en";

const fr: AlertsMessages = {
  page: {
    title: "Alertes",
    subtitle: "Ce qui s’est déclenché et qui a été prévenu. Les paramètres décident quand et comment alerter.",
    tabsLabel: "Sections des alertes",
    tabActivity: "Activité",
    tabActivityCount: "Activité ({count})",
    tabSettings: "Paramètres",
  },
  notices: {
    restored:
      "Anciens paramètres d’alerte restaurés. Votre version précédente se trouve dans Modifications récentes si vous voulez la récupérer.",
    savedIncomplete:
      "Paramètres d’alerte enregistrés. Certains canaux activés n’ont pas de destination et seront ignorés tant qu’elle n’est pas renseignée.",
    saved: "Paramètres d’alerte enregistrés.",
    invalidWebhookUrl:
      "L’une de vos URL de webhook n’est pas une adresse https:// valide ou pointe vers un réseau privé. Corrigez-la et enregistrez à nouveau.",
    weakTelegramSecret:
      "Le secret du webhook Telegram doit compter au moins 16 caractères : c’est la seule protection de ce point de terminaison. Utilisez une valeur aléatoire plus longue et enregistrez à nouveau.",
    restoreFailed: "Impossible de restaurer ces paramètres. Rien n’a été modifié.",
    saveFailed: "Impossible d’enregistrer les paramètres d’alerte.",
    testSentSkipped: "Test envoyé via {sent}. Ignorés car incomplets : {skipped}.",
    testSentVia: "Alerte de test envoyée via {channels}.",
    yourEnabledChannels: "vos canaux activés",
    testIncomplete:
      "Aucun canal n’a pu envoyer : activez un canal et renseignez sa destination, puis réessayez.",
    testNoChannels: "Aucun canal d’alerte n’est activé. Activez-en au moins un, enregistrez, puis réessayez.",
    testFailed: "Impossible d’envoyer l’alerte de test. Vérifiez les paramètres des canaux et réessayez.",
    ackOk: "Alerte marquée comme traitée.",
    ackError: "Impossible d’accuser réception de l’alerte.",
  },
  status: {
    label: "État :",
    on: "Activées",
    off: "Désactivées",
    lastAlert: "Dernière alerte {age}",
    noAlertsYet: "Aucune alerte envoyée pour l’instant",
  },
  activity: {
    heading: "Activité récente des alertes",
    subtitle: "Journal des canaux livrés et ignorés.",
    kindLabel: "Type",
    kinds: {
      all: "Toutes",
      freeze: "Gel",
      flood: "Inondation",
      forecast: "Prévision",
      threshold: "Seuil",
      test: "Test",
    },
    unhandledOnly: "Non traitées uniquement",
    filter: "Filtrer",
    clear: "Effacer",
    confirmAckAll: "Marquer les {count} alertes non traitées comme traitées ?",
    markAllHandled: "Marquer les {count} comme traitées",
    newer: "Plus récentes",
    older: "Plus anciennes",
  },
  claims: {
    heading: "Besoin de preuves pour un sinistre ?",
    body: "Après un vrai épisode de gel ou de fuite, exportez depuis Historique un résumé daté avec les mesures correspondantes.",
    open: "Ouvrir le dossier sinistre",
    seePro: "Voir le dossier sinistre (Pro)",
  },
  testSent: {
    heading: "Les alertes fonctionnent",
    body: "Chemin de livraison confirmé. Quelques étapes utiles pendant que vous y êtes :",
    shareFamily: "Partager un lien en direct avec la famille",
    shareLinks: "Liens de partage",
    downloadClaims: "Télécharger le dossier sinistre",
    claimsEvidence: "Dossier de preuves pour sinistre",
    comparePlans: "Comparer les offres",
  },
  testCard: {
    heading: "Envoyer une alerte de test",
    bodyRepeat:
      "Envoie un message d’exemple sur chaque canal actuellement activé. Enregistrez d’abord vos paramètres si vous venez de les modifier.",
    bodyFirst:
      "Confirmez la livraison une fois avant de compter sur les alertes de gel. Activez au moins un canal ci-dessus, enregistrez, puis envoyez.",
    sendNow: "Envoyer un test",
  },
  history: {
    heading: "Modifications récentes",
    body: "Chaque enregistrement, du plus récent au plus ancien. Restaurer remet les paramètres tels qu’ils étaient juste avant cet enregistrement ; votre version actuelle est aussi conservée ici.",
    confirmUndo: "Annuler votre dernière modification des paramètres d’alerte ?",
    confirmRestore:
      "Remettre les paramètres d’alerte tels qu’ils étaient avant cette modification ? Les modifications suivantes sont aussi annulées.",
    undo: "Annuler",
    restoreBefore: "Restaurer l’état d’avant",
  },
  list: {
    empty:
      "Aucun événement d’alerte ne correspond encore à ce filtre. Après un gel, une inondation ou un test, les lignes apparaissent ici avec le détail du motif et des actions contre les fausses alertes.",
    sent: "Acceptée par {channels}",
    skipped: "Ignorée sur {channels}",
    why: "Motif",
    suggested: "Suggestion : {tip}.",
    suggestedFix: "Correction suggérée : {tip}.",
    open: "Ouvrir",
    raiseThreshold: "Relever le seuil de gel de 1,1 °C (2 °F)",
    checkPlacement: "Vérifier l’emplacement de la sonde",
    handled: "Traitée",
    recovered: "Rétablie",
    expired: "Expirée",
    showMore: {
      one: "Afficher {count} autre similaire (jusqu’à {oldest})",
      other: "Afficher {count} autres similaires (jusqu’à {oldest})",
    },
    hideSimilar: { one: "Masquer {count} similaire", other: "Masquer {count} similaires" },
    caption: "Événements récents de livraison et d’accusé de réception des alertes",
    columns: {
      when: "Quand",
      kind: "Type",
      title: "Titre",
      why: "Motif",
      sent: "Envoyée",
      skipped: "Ignorée",
      ack: "Accusé",
    },
  },
  ack: {
    imOnIt: "Je m’en occupe",
    imOnItTitle: "Arrête les alertes répétées jusqu’à ce que l’espace repasse au-dessus de votre seuil",
    more: "Plus",
    snooze1h: "Traiter et mettre en pause 1 h",
    snooze4h: "Traiter et mettre en pause 4 h",
    snooze24h: "Traiter et mettre en pause 24 h",
    falseAlarm: "Fausse alerte (pause 24 h)",
    raiseThreshold: "Fausse alerte + relever le seuil de 1,1 °C (2 °F)",
    notifyTenant: "Traiter et prévenir le locataire par e-mail",
    webhookPing: "Traiter et appeler le webhook",
  },
  tipsCard: {
    summary: "Trop d’alertes ? Conseils pour réduire les fausses alertes",
    intro:
      "Les fausses alertes de gel viennent en général de l’emplacement ou du seuil. Celles d’inondation viennent d’éclaboussures, de condensation ou des cycles de la pompe de puisard : un contact mouillé alerte même pendant une pause.",
    freeze: "Gel",
    flood: "Inondation / fuite",
  },
  tips: {
    placement: {
      title: "Vérifiez l’emplacement de la sonde",
      detail:
        "Une sonde sur un rail de porte, près d’un extracteur ou contre un mur exposé au soleil varie fortement et déclenche des alertes de gel que les tuyaux ne subissent jamais. Rapprochez-la du tuyau le plus froid ou d’un angle de la dalle.",
      hrefLabel: "Simulateur de sonde",
    },
    unplugged: {
      title: "Silence signifie souvent débranchée",
      detail:
        "Si une sonde se tait pendant des heures, pensez d’abord à l’alimentation ou au Wi‑Fi, pas au gel. Activez les alertes de capteur silencieux et vérifiez dans Appareils que l’ESP envoie toujours ses POST.",
      hrefLabel: "Guide des mesures figées",
    },
    threshold: {
      title: "Relevez le seuil d’un ou deux degrés",
      detail:
        "Un seuil à 0 °C (32 °F) se déclenche au moindre courant d’air. Beaucoup de foyers utilisent 1–2 °C (34–36 °F) pour agir avant la formation de glace sans être réveillés à chaque ouverture de porte.",
      hrefLabel: "Alertes essentielles",
    },
    snooze: {
      title: "Coupez le bruit pendant la réparation",
      detail:
        "Vous travaillez dans un espace froid ? Touchez « Je m’en occupe » sur l’alerte : elle ne se répétera pas tant que ce gel dure. La pause coupe les alertes de routine, mais les alertes gel, fuite et coupure de courant passent toujours. Pour une fausse alerte, relevez le seuil ou replacez la sonde.",
    },
    splash: {
      title: "Éclaboussures et condensation",
      detail:
        "Un contact sous un chauffe-eau ou un bac à laver peut passer brièvement à l’état mouillé à cause de la condensation ou d’un goutte-à-goutte déjà arrêté. Fixez-le au fond du bac, loin des points de goutte, et essuyez-le après une fausse alerte.",
    },
    sump_cycle: {
      title: "Cycle de la pompe de puisard ≠ fuite",
      detail:
        "Le niveau du puisard qui monte pendant un orage est normal. Utilisez un contact d’inondation/fuite pour l’eau stagnante, et une règle personnalisée level_above seulement si vous voulez être prévenu tôt d’une panne de pompe, pas à chaque cycle.",
      hrefLabel: "Règles d’alerte",
    },
    test_wet: {
      title: "Testez avec un chiffon humide, puis séchez",
      detail:
        "Les alertes d’inondation se déclenchent automatiquement en présence d’eau (même en vacances). Après un test d’emplacement, séchez le contact pour ne pas le laisser à l’état mouillé toute la nuit.",
    },
  },
  staleProbes: {
    one: "{count} sonde semble figée : probablement débranchée, Wi‑Fi hors ligne ou batterie à plat. Vérifiez l’alimentation et Appareils avant de conclure à un gel.",
    other:
      "{count} sondes semblent figées : probablement débranchées, Wi‑Fi hors ligne ou batterie à plat. Vérifiez l’alimentation et Appareils avant de conclure à un gel.",
  },
  wetFlood: {
    one: "{count} capteur d’inondation/fuite est mouillé en ce moment : les alertes d’inondation passent outre la pause et le mode vacances. Vérifiez le bac, le puisard ou l’arrivée d’eau.",
    other:
      "{count} capteurs d’inondation/fuite sont mouillés en ce moment : les alertes d’inondation passent outre la pause et le mode vacances. Vérifiez le bac, le puisard ou l’arrivée d’eau.",
  },
  why: {
    probeAt: "{probe} à {temp} °F",
    probeAtUnnamed: "Sonde à {temp} °F",
    threshold: "seuil {temp} °F",
    outdoor: "extérieur {temp} °F",
    deltaT: "ΔT {delta} °F",
    runway: "~{hours} h de marge",
    doorOpen: "porte ouverte à proximité",
  },
  referral: {
    heading: "Offrez un hiver de surveillance",
    introHtml:
      "Partagez votre lien : les nouveaux inscrits obtiennent <strong>7 jours supplémentaires</strong> d’essai Pro.",
    bonusDays: {
      one: "Vous avez {count} jour d’essai bonus grâce à vos parrainages réussis.",
      other: "Vous avez {count} jours d’essai bonus grâce à vos parrainages réussis.",
    },
    earn: "Vous gagnez +7 jours d’essai quand un ami parrainé s’abonne à Pro.",
    howGifting: "Comment fonctionne le cadeau",
    loading: "Chargement du lien de parrainage…",
    copyInvite: "Copier le lien d’invitation",
    copied: "Copié !",
    copyFailed: "Échec de la copie",
    unavailable: "Lien de parrainage indisponible.",
    friendsJoined: {
      one: "{count} ami s’est inscrit via votre lien.",
      other: "{count} amis se sont inscrits via votre lien.",
    },
    noSignups: "Aucune inscription pour l’instant, partagez le lien ci-dessus.",
  },
};

export default fr;

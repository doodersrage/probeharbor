import type { AlertJobsMessages } from "./en";

const fr: AlertJobsMessages = {
  freeze: {
    confirm: {
      eyebrow: "Alertes gel",
      title: "Confirmez vos alertes gel",
      intro: "Cliquez ci-dessous et nous vous enverrons un e-mail l’après-midi précédant chaque nuit de gel à {place}.",
      ignore: "Si vous n’avez rien demandé, ignorez ce message. Vous ne recevrez rien sans confirmation.",
      cta: "Confirmer les alertes gel",
      footerNote:
        "Vous recevez ce message parce que quelqu’un a saisi cette adresse sur la prévision de gel des canalisations de ProbeHarbor.",
      subject: "Confirmez les alertes gel pour {place}",
    },
    errors: {
      invalidEmail: "Saisissez une adresse e-mail valide.",
      pickLocation: "Choisissez d’abord un lieu.",
      generic: "Une erreur s’est produite. Veuillez réessayer.",
    },
    alert: {
      subjectHigh: "Risque élevé de gel des canalisations cette nuit à {place} : minimale {low}",
      subjectWatch: "Gel cette nuit à {place} : minimale {low}",
      eyebrow: "Alerte gel",
      titleHigh: "Risque de gel élevé cette nuit à {place}",
      titleWatch: "Températures négatives cette nuit à {place}",
      bullets: [
        "Ouvrez les portes des placards sous les éviers situés contre un mur extérieur.",
        "Gardez la porte du garage fermée.",
        "Laissez goutter un robinet sur une conduite exposée.",
        "Repérez où se trouve le robinet d’arrêt général de l’eau.",
      ],
      alsoLater: "Également sous zéro plus tard dans la semaine : {nights}.",
      laterNight: "{date} (minimale {low})",
      outdoorNote:
        "Il s’agit de la prévision extérieure. Un garage attenant ou isolé peut rester bien plus chaud, et un garage plein de courants d’air peut devenir presque aussi froid. Une sonde à 25 $ US placée près de la canalisation vous indique ce qui se passe réellement dans l’espace et vous alerte avant le gel.",
      ctaForecast: "Voir la prévision sur 5 nuits",
      ctaProbe: "Installer une sonde dans votre garage",
      footerNote:
        "Nous envoyons un e-mail l’après-midi précédant la première nuit de gel d’une vague de froid et avant chaque nuit à −7 °C (20 °F) ou moins. Prévisions du National Weather Service (États-Unis).",
    },
    night: {
      high: "Minimale de {low}, au niveau ou en dessous du seuil de {mark} à partir duquel les canalisations des garages, vides sanitaires et combles non chauffés sont souvent menacées.",
      watch: {
        one: "Sous zéro pendant environ {count} heure, minimale {low}. Les canalisations exposées sur les murs extérieurs, près des portes de garage ou dans les vides sanitaires ventilés peuvent geler lors d’une nuit longue ou venteuse.",
        other:
          "Sous zéro pendant environ {count} heures, minimale {low}. Les canalisations exposées sur les murs extérieurs, près des portes de garage ou dans les vides sanitaires ventilés peuvent geler lors d’une nuit longue ou venteuse.",
      },
      above: "Reste au-dessus de zéro (minimale {low}).",
      wind: "Un vent jusqu’à {wind} par températures négatives refroidit plus vite les canalisations exposées.",
      nextDay: "Le lendemain reste aussi sous zéro : les espaces non chauffés ne se réchaufferont pas.",
    },
  },
  stuck: {
    faultReset: "la valeur qu’envoie un DS18B20 après une réinitialisation (souvent une alimentation trop faible ou un câble trop long)",
    faultDisconnected: "la valeur qu’envoie la bibliothèque DS18B20 quand la sonde est déconnectée",
    faultMessage: "{label} indique {value} °F, {why}. Vérifiez le câblage de la sonde : ce n’est pas une vraie température.",
    faultDetail: "{label} indique {value} °F (défaut du capteur), vérifiez le câblage",
    stuckMessage:
      "{label} envoie exactement {value} °F depuis {span}. La sonde est peut-être bloquée ou la carte renvoie une ancienne valeur ; un gel ici pourrait passer inaperçu.",
    stuckDetail: "{label} bloqué à {value} °F depuis {span}",
    spanHours: { one: "{count} heure", other: "{count} heures" },
    spanOverDay: "plus d’une journée",
  },
  portfolio: {
    title: "Biens à risque aujourd’hui ({count})",
    intro: {
      one: "Synthèse propriétaire : {count} bien est au seuil de gel ou en dessous :",
      other: "Synthèse propriétaire : {count} biens sont au seuil de gel ou en dessous :",
    },
    line: "{name} : {temp} °F (seuil {threshold} °F)",
  },
  tenant: {
    greetingName: "Bonjour {name},",
    greeting: "Bonjour,",
    intro: "Le gestionnaire de {household} nous a demandé de vous transmettre une alerte de risque de gel :",
    eyebrow: "Alerte transmise au locataire",
    footerNote:
      "Vous recevez ce message parce que le propriétaire vous a désigné comme contact sur place. Ce n’est pas un accès complet au tableau de bord.",
    errors: {
      invalidEmail: "Adresse e-mail non valide.",
      notAuthorized: "Vous n’êtes pas autorisé à prévenir le locataire.",
      noContact: "Aucun contact locataire configuré.",
      deliveryFailed: "L’envoi de l’e-mail a échoué.",
    },
  },
  feedUptime: {
    title: "Flux injoignable",
  },
  playbook: {
    titleFallback: "Procédure : {title}",
  },
  ackPlaybook: {
    notFound: "Alerte introuvable.",
    noHousehold: "Aucun foyer pour transmettre au locataire.",
    defaultPropertyName: "Bien",
    relayFailed: "La transmission au locataire a échoué.",
    noWebhook: "Aucun webhook sortant configuré.",
    ackFailed: "Impossible d’accuser réception de l’alerte.",
    raised:
      "Fausse alerte traitée : seuil de gel relevé à {value} °F et alertes mises en pause 24 h.",
    falseAlarmTip:
      "Marquée comme fausse alerte : alertes mises en pause 24 h. Solution suggérée : {tip}. Ouvrez {href}",
    results: {
      ack: "Alerte marquée comme traitée.",
      snooze_1h: "Alerte traitée : alertes gel mises en pause pendant 1 heure.",
      snooze_4h: "Alerte traitée : alertes gel mises en pause pendant 4 heures.",
      snooze_24h: "Alerte traitée : alertes gel mises en pause pendant 24 heures.",
      false_alarm:
        "Marquée comme fausse alerte : alertes mises en pause 24 h. Vérifiez l’emplacement de la sonde si cela se reproduit.",
      raise_threshold: "Fausse alerte traitée et seuil de gel relevé.",
      notify_tenant: "Alerte traitée : e-mail envoyé au contact locataire.",
      webhook_ping: "Alerte traitée : webhook sortant notifié.",
    },
  },
  telegram: {
    help: "Commandes : /status [nom], /snooze [heures], /vacation [jours], /help",
    commandsDisabled:
      "Les commandes Telegram sont désactivées tant que vous n’avez pas enregistré un Chat ID dans Alertes.",
    snoozed: {
      one: "Alertes mises en pause pendant {count} heure. Les alertes gel et fuite restent actives.",
      other: "Alertes mises en pause pendant {count} heures. Les alertes gel et fuite restent actives.",
    },
    vacation: {
      one: "Mode vacances activé pour {count} jour. Les alertes gel et fuite restent actives.",
      other: "Mode vacances activé pour {count} jours. Les alertes gel et fuite restent actives.",
    },
    noHousehold: "Aucun foyer actif.",
    open: "OUVERT",
    closed: "fermé",
    noMatch: "Aucun capteur ne correspond à « {query} ».",
    noReadings: "Aucune mesure pour l’instant.",
  },
  events: {
    notFound: "Alerte introuvable.",
    noUnhandled: "Aucune alerte non traitée.",
  },
  ackPage: {
    title: "Accuser réception de l’alerte",
    heading: "Accuser réception de l’alerte ?",
    body: "Confirmez que vous prenez en charge cette alerte gel ou inondation. Les aperçus automatiques de liens ne valideront pas cette action.",
    button: "Oui, marquer comme traitée",
    cancel: "Annuler",
    resultInvalid: "Lien d’accusé de réception non valide ou expiré.",
    resultNone: "Aucune alerte non traitée à accuser.",
    resultHandled: "Alerte marquée comme traitée.",
  },
  snoozePage: {
    title: "Mettre les alertes en pause",
    heading: "Mettre les alertes en pause ?",
    body: "Confirmez la mise en pause des alertes de seuil. Les alertes critiques de gel ou d’inondation peuvent encore être envoyées. Les aperçus automatiques de liens ne valideront pas cette action.",
    button: "Oui, mettre en pause",
    cancel: "Annuler",
    missingToken: "Jeton manquant",
    resultInvalid: "Lien de mise en pause non valide ou déjà utilisé.",
    resultExpired: "Le lien de mise en pause a expiré.",
    resultSnoozed: { one: "Alertes mises en pause pendant {count} heure.", other: "Alertes mises en pause pendant {count} heures." },
  },
};

export default fr;

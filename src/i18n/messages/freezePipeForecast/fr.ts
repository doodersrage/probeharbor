import type { PipeForecastMessages } from "./en";

const fr: PipeForecastMessages = {
  title: "Mes canalisations vont-elles geler cette nuit ? Prévisions de gel",
  description:
    "Saisissez une ville ou un code ZIP (États-Unis) : minimales sur cinq nuits, heures sous zéro et risque de gel dans les garages et greniers non chauffés.",
  appName: "Prévisions de gel des canalisations",
  breadcrumbHome: "Accueil",
  breadcrumb: "Prévisions de gel des canalisations",
  kicker: "Outil gratuit",
  heading: "Mes canalisations vont-elles geler cette nuit ?",
  lede: "Consultez les cinq prochaines nuits dans votre secteur : la minimale, le nombre d’heures sous zéro, le vent et le risque pour les canalisations d’un garage, d’un vide sanitaire ou d’un grenier non chauffé.",
  getAlerts: "Recevoir gratuitement les alertes de gel par e-mail",
  whenGaragePipes: "Quand les canalisations du garage gèlent",
  alertsConfirmed: "Les alertes de gel sont activées. Nous vous écrirons l’après-midi précédant une nuit de gel.",
  alertsInvalid: "Ce lien de confirmation n’est plus valide. Recherchez votre secteur ci-dessous et inscrivez-vous à nouveau.",
  levelsTitle: "Comprendre les niveaux de risque",
  levelsHtml: [
    "<strong>Risque élevé :</strong> la minimale extérieure est de −7 °C (20 °F) ou moins, le seuil le plus souvent cité à partir duquel les canalisations gèlent dans les espaces non chauffés.",
    "<strong>Vigilance :</strong> sous zéro, mais au-dessus de −7 °C (20 °F). Les canalisations exposées peuvent quand même geler lors d’une nuit longue ou venteuse.",
    "<strong>Risque faible :</strong> la nuit reste au-dessus de 0 °C (32 °F).",
  ],
  levelsActionHtml:
    'Lors d’une nuit à risque élevé ou en vigilance : ouvrez les portes des placards contre les murs extérieurs, gardez la porte du garage fermée, laissez goutter un robinet sur une conduite exposée et repérez le robinet d’arrêt général. Voir <a class="text-link" href="/answers/drip-faucets-to-prevent-frozen-pipes">si laisser goutter les robinets est utile</a>, <a class="text-link" href="/answers/how-long-for-pipes-to-freeze">combien de temps les canalisations mettent à geler</a> et le <a class="text-link" href="/freeze-time-calculator">calculateur de délai de gel</a> si vous avez un thermomètre dans l’espace.',
  insideTitle: "La prévision concerne l’extérieur. Vos canalisations sont à l’intérieur.",
  insideBody:
    "Une sonde à côté de la canalisation vous indique ce qui se passe réellement dans l’espace et vous alerte avant le gel, quand il reste du temps pour agir. L’offre gratuite inclut les alertes par e-mail ; utilisez une sonde ESP32 (environ 25 $ US de pièces) ou les capteurs que vous avez déjà dans Home Assistant.",
  startFree: "Commencer gratuitement",
  kitParts: "Pièces du kit gel ESP32",
  sourcesTitle: "Sources",
  sourceKxan: "At what temperature do pipes freeze? (KXAN, en anglais, d’après des travaux de l’université de l’Illinois)",
  sourceFarmBureau: "How pipes freeze and burst (Farm Bureau Insurance, en anglais)",
  sourceNws: "API du National Weather Service",
  sourceNwsNote: " : données de prévision horaire",
  faqs: [
    {
      question: "À quelle température extérieure les canalisations gèlent-elles ?",
      answer:
        "L’eau gèle à 0 °C (32 °F), mais les canalisations à l’intérieur d’un bâtiment ont généralement besoin d’un air extérieur plus froid pour geler. Des travaux de l’université de l’Illinois, largement cités par les assureurs, situent le seuil de danger pour les canalisations des espaces non chauffés à une température extérieure d’environ −7 °C (20 °F). C’est pourquoi cette prévision classe en risque élevé les nuits à −7 °C (20 °F) ou moins.",
    },
    {
      question: "Les canalisations peuvent-elles geler si la minimale dépasse −7 °C (20 °F) ?",
      answer:
        "Oui. Une longue nuit sous 0 °C (32 °F) peut faire geler une canalisation non isolée, contre un mur extérieur, près d’une porte de garage ou dans un vide sanitaire ventilé, surtout avec du vent. C’est pour cela que les nuits entre −6 °C et 0 °C (21–32 °F) sont classées en vigilance.",
    },
    {
      question: "Pourquoi le vent compte-t-il ?",
      answer:
        "L’air en mouvement retire la chaleur d’un tuyau bien plus vite que l’air immobile : les canalisations près des aérations, des jours de porte et des fissures des murs extérieurs gèlent donc en premier. La prévision signale les vents de 24 km/h (15 mph) ou plus pendant les heures de gel.",
    },
    {
      question: "Est-ce que cela m’indique à quel point mon garage va se refroidir ?",
      answer:
        "Non. La prévision porte sur l’air extérieur. Un garage attenant ou isolé peut rester bien au-dessus de la minimale extérieure, et un garage plein de courants d’air peut devenir presque aussi froid. Le seul moyen de savoir est un thermomètre près des canalisations, idéalement un modèle qui vous alerte avant le gel.",
    },
    {
      question: "D’où vient la prévision ?",
      answer:
        "De la prévision horaire du National Weather Service (le service météorologique des États-Unis) pour votre emplacement, actualisée environ toutes les 30 minutes. Elle couvre les États-Unis et leurs territoires.",
    },
  ],
  tool: {
    riskHigh: "Risque élevé",
    riskWatch: "Vigilance",
    riskLow: "Risque faible",
    errorUsOnly: "Cette prévision utilise le National Weather Service et ne couvre donc que les États-Unis.",
    errorRateLimited: "Trop de recherches en une minute. Réessayez dans un instant.",
    errorService: "Le service de prévision n’a pas répondu. Réessayez dans une minute.",
    errorNoGeolocation: "Ce navigateur ne peut pas partager sa position. Recherchez plutôt une ville ou un code ZIP.",
    errorGeoDeclined: "L’accès à la position a été refusé. Recherchez plutôt une ville ou un code ZIP.",
    tonight: "Cette nuit",
    weekdayNight: "Nuit de {weekday}",
    headlineNone: "Aucune nuit de prévision reçue",
    headlineHigh: "Cette nuit : risque de gel élevé pour les espaces non chauffés (minimale {low})",
    headlineWatch: "Cette nuit : sous zéro (minimale {low}), surveillez les canalisations exposées",
    headlineColderLater: "Pas de gel cette nuit, mais des nuits plus froides arrivent",
    headlineClear: "Aucune nuit de gel dans les prévisions",
    describeHigh:
      "Minimale de {low}, égale ou inférieure au seuil de {mark} où les canalisations des garages, vides sanitaires et greniers non chauffés sont couramment menacées.",
    describeWatchOne:
      "Sous zéro pendant environ {hours} heure, minimale {low}. Les canalisations exposées contre les murs extérieurs, près des portes de garage ou dans les vides sanitaires ventilés peuvent quand même geler lors d’une nuit longue ou venteuse.",
    describeWatchMany:
      "Sous zéro pendant environ {hours} heures, minimale {low}. Les canalisations exposées contre les murs extérieurs, près des portes de garage ou dans les vides sanitaires ventilés peuvent quand même geler lors d’une nuit longue ou venteuse.",
    describeAbove: "Reste au-dessus de zéro (minimale {low}).",
    describeWind: "Un vent jusqu’à {wind} pendant le gel retire plus vite la chaleur des canalisations exposées.",
    describeNextDay: "La journée suivante reste aussi sous zéro : les espaces non chauffés ne se réchaufferont pas.",
    signupTitle: "M’avertir par e-mail avant les nuits de gel à {place}",
    signupLede:
      "Gratuit, sans matériel. Un e-mail l’après-midi précédant la première nuit de gel d’une vague de froid, puis avant chaque nuit à {temp} ou moins. Désinscription en un clic.",
    emailLabel: "E-mail",
    emailPlaceholder: "vous@exemple.com",
    sending: "Envoi…",
    submit: "Recevoir les alertes de gel",
    genericError: "Une erreur s’est produite. Veuillez réessayer.",
    heading: "Vérifiez votre secteur",
    unitLegend: "Unité de température",
    searchLabel: "Ville ou code ZIP (États-Unis)",
    searchPlaceholder: "p. ex. 23219 ou Richmond, VA",
    useMyLocation: "Utiliser ma position",
    myLocation: "Ma position",
    resultsLabel: "Lieux correspondants",
    loading: "Chargement de la prévision pour {place}…",
    source: " · prévision extérieure du National Weather Service",
    updated: ", mise à jour le {time}",
    nightLow: "minimale · {hours} h à {temp} ou moins",
    nightBelow20: " · {hours} h à {temp} ou moins",
    embedSummary: "Intégrer cette prévision à votre site",
    embedLede:
      "Un petit widget en direct pour le site d’un plombier, d’un gestionnaire immobilier ou d’un quartier. Il affiche cette nuit et les deux suivantes, et se met à jour tout seul.",
    copied: "Copié",
    copyEmbed: "Copier le code d’intégration",
  },
};

export default fr;

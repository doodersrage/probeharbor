import type { AboutFaqItem } from "../../lib/aboutFaqs";
import {
  PIPE_FREEZE_FORECAST_TEXT,
  type PipeFreezeForecastText,
} from "../../components/PipeFreezeForecast";
import { defineMessages } from "../translate";

/**
 * /pipe-freeze-forecast page copy plus the forecast island's strings
 * (`tool`, passed as its `text` prop). Island templates use `{name}`
 * placeholders, filled in the browser with temperatures in the visitor's unit.
 */
const en = {
  title: "Will my pipes freeze tonight? Pipe freeze forecast",
  description:
    "Enter a US city or ZIP to see the next five nights' lows, hours below freezing, and pipe freeze risk for unheated garages, crawlspaces, and attics.",
  appName: "Pipe freeze forecast",
  breadcrumbHome: "Home",
  breadcrumb: "Pipe freeze forecast",
  kicker: "Free tool",
  heading: "Will my pipes freeze tonight?",
  lede: "Check the next five nights for your area: the low, how many hours it stays below freezing, wind, and whether pipes in an unheated garage, crawlspace, or attic are at risk.",
  getAlerts: "Get free freeze alerts by email",
  whenGaragePipes: "When garage pipes freeze",
  alertsConfirmed: "Freeze alerts are on. We'll email you the afternoon before a freezing night.",
  alertsInvalid: "That confirmation link isn't valid anymore. Look up your area below and sign up again.",
  levelsTitle: "How to read the risk levels",
  levelsHtml: [
    "<strong>High risk:</strong> the outdoor low is 20°F or colder, the commonly cited point where pipes in unheated spaces freeze.",
    "<strong>Watch:</strong> below freezing but above 20°F. Exposed pipes can still freeze on a long or windy night.",
    "<strong>Low risk:</strong> the night stays above freezing.",
  ],
  levelsActionHtml:
    'On a High or Watch night: open cabinet doors on exterior walls, keep the garage door shut, let a faucet on an exposed line drip, and know where your main shutoff is. See <a class="text-link" href="/answers/drip-faucets-to-prevent-frozen-pipes">whether dripping faucets helps</a>, <a class="text-link" href="/answers/how-long-for-pipes-to-freeze">how long pipes take to freeze</a>, and the <a class="text-link" href="/freeze-time-calculator">freeze time calculator</a> if you have a thermometer in the space.',
  insideTitle: "The forecast is outdoors. Your pipes are inside.",
  insideBody:
    "A probe next to the pipe tells you what the space is actually doing and alerts you before it reaches freezing, while there is still time to act. The free plan includes email alerts; use an ESP32 probe (about $25 in parts) or sensors you already have in Home Assistant.",
  startFree: "Start free",
  kitParts: "ESP32 freeze kit parts",
  sourcesTitle: "Sources",
  sourceKxan: "At what temperature do pipes freeze? (KXAN, citing University of Illinois research)",
  sourceFarmBureau: "How pipes freeze and burst (Farm Bureau Insurance)",
  sourceNws: "National Weather Service API",
  sourceNwsNote: ": hourly forecast data",
  faqs: [
    {
      question: "At what outdoor temperature do pipes freeze?",
      answer:
        "Water freezes at 32°F, but pipes inside a building usually need colder air outside before they freeze. Research from the University of Illinois, widely cited by insurers, puts the danger point for pipes in unheated spaces at an outdoor temperature of about 20°F. That is why this forecast marks nights at or below 20°F as high risk.",
    },
    {
      question: "Can pipes freeze when the low is above 20°F?",
      answer:
        "Yes. A long night below 32°F can freeze a pipe that is uninsulated, on an exterior wall, near a garage door, or in a vented crawlspace, especially with wind. Nights between 21°F and 32°F are marked Watch for that reason.",
    },
    {
      question: "Why does wind matter?",
      answer:
        "Moving air strips heat from a pipe much faster than still air, so pipes near vents, door gaps, and cracks in exterior walls freeze first. The forecast calls out wind of 15 mph or more during freezing hours.",
    },
    {
      question: "Does this tell me how cold my garage will get?",
      answer:
        "No. It forecasts outdoor air. An attached or insulated garage can stay well above the outdoor low, and a drafty one can get almost as cold. The only way to know is a thermometer near the pipes, ideally one that alerts you before they reach freezing.",
    },
    {
      question: "Where does the forecast come from?",
      answer:
        "The National Weather Service hourly forecast for your location, refreshed about every 30 minutes. It covers the United States and its territories.",
    },
  ] as AboutFaqItem[],
  tool: PIPE_FREEZE_FORECAST_TEXT as PipeFreezeForecastText,
};

type PipeForecastMessages = typeof en;

const es: PipeForecastMessages = {
  title: "¿Se congelarán mis tuberías esta noche? Pronóstico de heladas",
  description:
    "Introduce una ciudad o ZIP de EE. UU.: mínimas de cinco noches, horas bajo cero y riesgo de helada en garajes, sótanos y áticos sin calefacción.",
  appName: "Pronóstico de congelación de tuberías",
  breadcrumbHome: "Inicio",
  breadcrumb: "Pronóstico de congelación de tuberías",
  kicker: "Herramienta gratuita",
  heading: "¿Se congelarán mis tuberías esta noche?",
  lede: "Consulta las próximas cinco noches en tu zona: la mínima, cuántas horas se queda bajo cero, el viento y si las tuberías de un garaje, sótano o ático sin calefacción están en riesgo.",
  getAlerts: "Recibe alertas de helada gratis por correo",
  whenGaragePipes: "Cuándo se congelan las tuberías del garaje",
  alertsConfirmed: "Las alertas de helada están activadas. Te escribiremos la tarde antes de una noche de helada.",
  alertsInvalid: "Ese enlace de confirmación ya no es válido. Busca tu zona abajo y vuelve a suscribirte.",
  levelsTitle: "Cómo leer los niveles de riesgo",
  levelsHtml: [
    "<strong>Riesgo alto:</strong> la mínima exterior es de −7 °C (20 °F) o menos, el punto más citado a partir del cual se congelan las tuberías en espacios sin calefacción.",
    "<strong>Vigilar:</strong> bajo cero, pero por encima de −7 °C (20 °F). Las tuberías expuestas aún pueden congelarse en una noche larga o con viento.",
    "<strong>Riesgo bajo:</strong> la noche se mantiene por encima de 0 °C (32 °F).",
  ],
  levelsActionHtml:
    'En una noche de riesgo alto o de vigilancia: abre las puertas de los armarios en paredes exteriores, mantén cerrada la puerta del garaje, deja gotear un grifo de una tubería expuesta y ten localizada la llave de paso general. Consulta <a class="text-link" href="/answers/drip-faucets-to-prevent-frozen-pipes">si sirve dejar gotear los grifos</a>, <a class="text-link" href="/answers/how-long-for-pipes-to-freeze">cuánto tardan en congelarse las tuberías</a> y la <a class="text-link" href="/freeze-time-calculator">calculadora de tiempo de congelación</a> si tienes un termómetro en el espacio.',
  insideTitle: "El pronóstico es del exterior. Tus tuberías están dentro.",
  insideBody:
    "Una sonda junto a la tubería te dice lo que realmente está pasando en el espacio y te avisa antes de que llegue a la helada, cuando aún hay tiempo para actuar. El plan gratuito incluye alertas por correo; usa una sonda ESP32 (unos 25 US$ en piezas) o los sensores que ya tienes en Home Assistant.",
  startFree: "Empieza gratis",
  kitParts: "Piezas del kit de helada ESP32",
  sourcesTitle: "Fuentes",
  sourceKxan: "At what temperature do pipes freeze? (KXAN, en inglés, cita una investigación de la Universidad de Illinois)",
  sourceFarmBureau: "How pipes freeze and burst (Farm Bureau Insurance, en inglés)",
  sourceNws: "API del National Weather Service",
  sourceNwsNote: ": datos de pronóstico por hora",
  faqs: [
    {
      question: "¿A qué temperatura exterior se congelan las tuberías?",
      answer:
        "El agua se congela a 0 °C (32 °F), pero las tuberías dentro de un edificio suelen necesitar un aire exterior más frío para congelarse. Una investigación de la Universidad de Illinois, muy citada por las aseguradoras, sitúa el punto de peligro para tuberías en espacios sin calefacción en una temperatura exterior de unos −7 °C (20 °F). Por eso este pronóstico marca como riesgo alto las noches a −7 °C (20 °F) o menos.",
    },
    {
      question: "¿Pueden congelarse las tuberías si la mínima está por encima de −7 °C (20 °F)?",
      answer:
        "Sí. Una noche larga bajo 0 °C (32 °F) puede congelar una tubería sin aislar, en una pared exterior, cerca de la puerta del garaje o en un sótano ventilado, sobre todo con viento. Por eso las noches entre −6 °C y 0 °C (21–32 °F) se marcan como Vigilar.",
    },
    {
      question: "¿Por qué importa el viento?",
      answer:
        "El aire en movimiento le quita calor a una tubería mucho más rápido que el aire quieto, así que las tuberías cerca de rejillas, rendijas de puertas y grietas en paredes exteriores se congelan primero. El pronóstico avisa de vientos de 24 km/h (15 mph) o más durante las horas bajo cero.",
    },
    {
      question: "¿Esto me dice cuánto se enfriará mi garaje?",
      answer:
        "No. Pronostica el aire exterior. Un garaje adosado o aislado puede quedarse muy por encima de la mínima exterior, y uno con corrientes puede llegar a estar casi igual de frío. La única forma de saberlo es un termómetro cerca de las tuberías, idealmente uno que te avise antes de que lleguen a la helada.",
    },
    {
      question: "¿De dónde sale el pronóstico?",
      answer:
        "Del pronóstico por hora del National Weather Service (el servicio meteorológico de EE. UU.) para tu ubicación, actualizado más o menos cada 30 minutos. Cubre Estados Unidos y sus territorios.",
    },
  ],
  tool: {
    riskHigh: "Riesgo alto",
    riskWatch: "Vigilar",
    riskLow: "Riesgo bajo",
    errorUsOnly: "Este pronóstico usa el National Weather Service, así que solo cubre ubicaciones de EE. UU.",
    errorRateLimited: "Demasiadas búsquedas en un minuto. Vuelve a intentarlo en un momento.",
    errorService: "El servicio de pronóstico no respondió. Vuelve a intentarlo en un minuto.",
    errorNoGeolocation: "Este navegador no puede compartir tu ubicación. Busca una ciudad o un código ZIP.",
    errorGeoDeclined: "Se denegó el permiso de ubicación. Busca una ciudad o un código ZIP.",
    tonight: "Esta noche",
    weekdayNight: "Noche del {weekday}",
    headlineNone: "No se recibieron noches de pronóstico",
    headlineHigh: "Esta noche: riesgo alto de helada en espacios sin calefacción (mínima {low})",
    headlineWatch: "Esta noche: bajo cero (mínima {low}), vigila las tuberías expuestas",
    headlineColderLater: "Esta noche no hiela, pero vienen noches más frías",
    headlineClear: "No hay noches de helada en el pronóstico",
    describeHigh:
      "Mínima de {low}, en o por debajo de los {mark}, el punto en que las tuberías de garajes, sótanos y áticos sin calefacción suelen estar en riesgo.",
    describeWatchOne:
      "Bajo cero durante aproximadamente {hours} hora, mínima {low}. Las tuberías expuestas en paredes exteriores, cerca de la puerta del garaje o en sótanos ventilados aún pueden congelarse en una noche larga o con viento.",
    describeWatchMany:
      "Bajo cero durante aproximadamente {hours} horas, mínima {low}. Las tuberías expuestas en paredes exteriores, cerca de la puerta del garaje o en sótanos ventilados aún pueden congelarse en una noche larga o con viento.",
    describeAbove: "Se mantiene sobre cero (mínima {low}).",
    describeWind: "Un viento de hasta {wind} mientras hiela le quita calor más rápido a las tuberías expuestas.",
    describeNextDay: "El día siguiente también se queda bajo cero, así que los espacios sin calefacción no volverán a calentarse.",
    signupTitle: "Avísame por correo antes de las noches de helada en {place}",
    signupLede:
      "Gratis y sin hardware. Un correo la tarde antes de la primera noche de helada de una ola de frío, y antes de cada noche a {temp} o menos. Date de baja con un clic.",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "tu@ejemplo.com",
    sending: "Enviando…",
    submit: "Recibir alertas de helada",
    genericError: "Algo salió mal. Inténtalo de nuevo.",
    heading: "Consulta tu zona",
    unitLegend: "Unidad de temperatura",
    searchLabel: "Ciudad o código ZIP de EE. UU.",
    searchPlaceholder: "p. ej., 23219 o Richmond, VA",
    useMyLocation: "Usar mi ubicación",
    myLocation: "Mi ubicación",
    resultsLabel: "Lugares coincidentes",
    loading: "Cargando el pronóstico para {place}…",
    source: " · pronóstico exterior del National Weather Service",
    updated: ", actualizado el {time}",
    nightLow: "mínima · {hours} h a {temp} o menos",
    nightBelow20: " · {hours} h a {temp} o menos",
    embedSummary: "Inserta este pronóstico en tu sitio",
    embedLede:
      "Un pequeño widget en vivo para el sitio de un fontanero, de una administradora de propiedades o de un barrio. Muestra esta noche y las dos siguientes, y se actualiza solo.",
    copied: "Copiado",
    copyEmbed: "Copiar código",
  },
};

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

const de: PipeForecastMessages = {
  title: "Frieren meine Rohre heute Nacht? Rohrfrost-Prognose",
  description:
    "Gib eine US-Stadt oder ZIP ein: Tiefstwerte für fünf Nächte, Stunden unter null und Rohrfrostrisiko in unbeheizten Garagen, Kriechkellern und Dachböden.",
  appName: "Rohrfrost-Prognose",
  breadcrumbHome: "Startseite",
  breadcrumb: "Rohrfrost-Prognose",
  kicker: "Kostenloses Tool",
  heading: "Frieren meine Rohre heute Nacht?",
  lede: "Prüfe die nächsten fünf Nächte für deine Gegend: den Tiefstwert, wie viele Stunden es unter null bleibt, den Wind und ob Rohre in einer unbeheizten Garage, einem Kriechkeller oder auf dem Dachboden gefährdet sind.",
  getAlerts: "Kostenlose Frostalarme per E-Mail",
  whenGaragePipes: "Wann Rohre in der Garage einfrieren",
  alertsConfirmed: "Frostalarme sind aktiv. Wir schreiben dir am Nachmittag vor einer Frostnacht.",
  alertsInvalid: "Dieser Bestätigungslink ist nicht mehr gültig. Such unten deine Gegend und melde dich erneut an.",
  levelsTitle: "So liest du die Risikostufen",
  levelsHtml: [
    "<strong>Hohes Risiko:</strong> Der Tiefstwert draußen liegt bei −7 °C (20 °F) oder darunter, dem häufig genannten Punkt, an dem Rohre in unbeheizten Räumen einfrieren.",
    "<strong>Beobachten:</strong> unter null, aber über −7 °C (20 °F). Freiliegende Rohre können in einer langen oder windigen Nacht trotzdem einfrieren.",
    "<strong>Geringes Risiko:</strong> Die Nacht bleibt über 0 °C (32 °F).",
  ],
  levelsActionHtml:
    'In einer Nacht mit hohem Risiko oder Beobachten: Öffne Schranktüren an Außenwänden, halte das Garagentor geschlossen, lass einen Wasserhahn an einer freiliegenden Leitung tropfen und wisse, wo dein Hauptabsperrventil ist. Siehe <a class="text-link" href="/answers/drip-faucets-to-prevent-frozen-pipes">ob tropfende Wasserhähne helfen</a>, <a class="text-link" href="/answers/how-long-for-pipes-to-freeze">wie lange Rohre zum Einfrieren brauchen</a> und den <a class="text-link" href="/freeze-time-calculator">Rechner für die Zeit bis zum Frost</a>, wenn du ein Thermometer im Raum hast.',
  insideTitle: "Die Prognose gilt für draußen. Deine Rohre sind drinnen.",
  insideBody:
    "Eine Sonde neben dem Rohr zeigt dir, was im Raum tatsächlich passiert, und warnt dich vor dem Gefrierpunkt, solange noch Zeit zum Handeln bleibt. Der Free-Tarif enthält E-Mail-Alarme; nimm eine ESP32-Sonde (Teile für etwa 25 US$) oder Sensoren, die du schon in Home Assistant hast.",
  startFree: "Kostenlos starten",
  kitParts: "Teile für das ESP32-Frost-Kit",
  sourcesTitle: "Quellen",
  sourceKxan: "At what temperature do pipes freeze? (KXAN, englisch, mit Verweis auf Forschung der University of Illinois)",
  sourceFarmBureau: "How pipes freeze and burst (Farm Bureau Insurance, englisch)",
  sourceNws: "National Weather Service API",
  sourceNwsNote: ": stündliche Prognosedaten",
  faqs: [
    {
      question: "Bei welcher Außentemperatur frieren Rohre ein?",
      answer:
        "Wasser gefriert bei 0 °C (32 °F), aber Rohre in einem Gebäude brauchen meist kältere Außenluft, bevor sie einfrieren. Forschung der University of Illinois, auf die sich Versicherer häufig berufen, sieht den Gefahrenpunkt für Rohre in unbeheizten Räumen bei einer Außentemperatur von etwa −7 °C (20 °F). Deshalb stuft diese Prognose Nächte mit −7 °C (20 °F) oder weniger als hohes Risiko ein.",
    },
    {
      question: "Können Rohre einfrieren, wenn der Tiefstwert über −7 °C (20 °F) liegt?",
      answer:
        "Ja. Eine lange Nacht unter 0 °C (32 °F) kann ein Rohr einfrieren lassen, das nicht gedämmt ist, an einer Außenwand, nahe am Garagentor oder in einem belüfteten Kriechkeller liegt, besonders bei Wind. Darum sind Nächte zwischen −6 °C und 0 °C (21–32 °F) mit Beobachten markiert.",
    },
    {
      question: "Warum spielt Wind eine Rolle?",
      answer:
        "Bewegte Luft entzieht einem Rohr viel schneller Wärme als ruhende Luft, deshalb frieren Rohre an Lüftungsöffnungen, Türspalten und Rissen in Außenwänden zuerst ein. Die Prognose weist auf Wind ab 24 km/h (15 mph) während der Froststunden hin.",
    },
    {
      question: "Sagt mir das, wie kalt meine Garage wird?",
      answer:
        "Nein. Sie sagt die Außenluft voraus. Eine angebaute oder gedämmte Garage kann deutlich über dem Tiefstwert draußen bleiben, eine zugige fast genauso kalt werden. Sicher weißt du es nur mit einem Thermometer an den Rohren, am besten einem, das dich warnt, bevor sie den Gefrierpunkt erreichen.",
    },
    {
      question: "Woher kommt die Prognose?",
      answer:
        "Aus der stündlichen Prognose des National Weather Service (des US-Wetterdienstes) für deinen Standort, etwa alle 30 Minuten aktualisiert. Sie deckt die USA und ihre Außengebiete ab.",
    },
  ],
  tool: {
    riskHigh: "Hohes Risiko",
    riskWatch: "Beobachten",
    riskLow: "Geringes Risiko",
    errorUsOnly: "Diese Prognose nutzt den National Weather Service und deckt deshalb nur Orte in den USA ab.",
    errorRateLimited: "Zu viele Suchen in einer Minute. Versuch es gleich noch einmal.",
    errorService: "Der Prognosedienst hat nicht geantwortet. Versuch es in einer Minute noch einmal.",
    errorNoGeolocation: "Dieser Browser kann seinen Standort nicht teilen. Such stattdessen nach einer Stadt oder ZIP-Postleitzahl.",
    errorGeoDeclined: "Der Standortzugriff wurde abgelehnt. Such stattdessen nach einer Stadt oder ZIP-Postleitzahl.",
    tonight: "Heute Nacht",
    weekdayNight: "{weekday}nacht",
    headlineNone: "Keine Prognosenächte erhalten",
    headlineHigh: "Heute Nacht: hohes Frostrisiko für unbeheizte Räume (Tiefstwert {low})",
    headlineWatch: "Heute Nacht: unter null (Tiefstwert {low}), freiliegende Rohre im Blick behalten",
    headlineColderLater: "Heute Nacht bleibt es frostfrei, aber kältere Nächte kommen",
    headlineClear: "Keine Frostnächte in der Prognose",
    describeHigh:
      "Tiefstwert {low}, auf oder unter der {mark}-Marke, bei der Rohre in unbeheizten Garagen, Kriechkellern und Dachböden häufig gefährdet sind.",
    describeWatchOne:
      "Etwa {hours} Stunde unter null, Tiefstwert {low}. Freiliegende Rohre an Außenwänden, nahe am Garagentor oder in belüfteten Kriechkellern können in einer langen oder windigen Nacht trotzdem einfrieren.",
    describeWatchMany:
      "Etwa {hours} Stunden unter null, Tiefstwert {low}. Freiliegende Rohre an Außenwänden, nahe am Garagentor oder in belüfteten Kriechkellern können in einer langen oder windigen Nacht trotzdem einfrieren.",
    describeAbove: "Bleibt über null (Tiefstwert {low}).",
    describeWind: "Wind bis {wind} bei Frost entzieht freiliegenden Rohren schneller Wärme.",
    describeNextDay: "Auch der nächste Tag bleibt unter null, unbeheizte Räume wärmen sich also nicht wieder auf.",
    signupTitle: "Schick mir vor Frostnächten in {place} eine E-Mail",
    signupLede:
      "Kostenlos, ohne Hardware. Eine E-Mail am Nachmittag vor der ersten Frostnacht einer Kältewelle und vor jeder Nacht mit {temp} oder kälter. Abmeldung mit einem Klick.",
    emailLabel: "E-Mail",
    emailPlaceholder: "du@beispiel.de",
    sending: "Wird gesendet…",
    submit: "Frostalarme erhalten",
    genericError: "Etwas ist schiefgelaufen. Bitte versuch es noch einmal.",
    heading: "Prüfe deine Gegend",
    unitLegend: "Temperatureinheit",
    searchLabel: "US-Stadt oder ZIP-Postleitzahl",
    searchPlaceholder: "z. B. 23219 oder Richmond, VA",
    useMyLocation: "Meinen Standort verwenden",
    myLocation: "Mein Standort",
    resultsLabel: "Passende Orte",
    loading: "Prognose für {place} wird geladen…",
    source: " · Außenprognose des National Weather Service",
    updated: ", aktualisiert {time}",
    nightLow: "Tiefstwert · {hours} h bei {temp} oder kälter",
    nightBelow20: " · {hours} h bei {temp} oder kälter",
    embedSummary: "Diese Prognose auf deiner Website einbetten",
    embedLede:
      "Ein kleines Live-Widget für die Website eines Installateurs, einer Hausverwaltung oder einer Nachbarschaft. Es zeigt heute Nacht und die nächsten zwei Nächte und aktualisiert sich von selbst.",
    copied: "Kopiert",
    copyEmbed: "Einbettungscode kopieren",
  },
};

const ptBr: PipeForecastMessages = {
  title: "Meus canos vão congelar hoje à noite? Previsão de congelamento",
  description:
    "Informe uma cidade ou CEP (ZIP) dos EUA: mínimas de cinco noites, horas abaixo de zero e risco de congelamento em garagens, porões e sótãos sem aquecimento.",
  appName: "Previsão de congelamento de canos",
  breadcrumbHome: "Início",
  breadcrumb: "Previsão de congelamento de canos",
  kicker: "Ferramenta grátis",
  heading: "Meus canos vão congelar hoje à noite?",
  lede: "Confira as próximas cinco noites na sua região: a mínima, quantas horas fica abaixo de zero, o vento e se os canos de uma garagem, porão ou sótão sem aquecimento correm risco.",
  getAlerts: "Receba alertas de congelamento grátis por e-mail",
  whenGaragePipes: "Quando os canos da garagem congelam",
  alertsConfirmed: "Os alertas de congelamento estão ativados. Enviaremos um e-mail na tarde anterior a uma noite de congelamento.",
  alertsInvalid: "Esse link de confirmação não é mais válido. Procure sua região abaixo e cadastre-se de novo.",
  levelsTitle: "Como ler os níveis de risco",
  levelsHtml: [
    "<strong>Risco alto:</strong> a mínima externa é de −7 °C (20 °F) ou menos, o ponto mais citado a partir do qual os canos congelam em espaços sem aquecimento.",
    "<strong>Atenção:</strong> abaixo de zero, mas acima de −7 °C (20 °F). Canos expostos ainda podem congelar numa noite longa ou com vento.",
    "<strong>Risco baixo:</strong> a noite fica acima de 0 °C (32 °F).",
  ],
  levelsActionHtml:
    'Numa noite de risco alto ou de atenção: abra as portas dos armários em paredes externas, mantenha a porta da garagem fechada, deixe pingar uma torneira de uma linha exposta e saiba onde fica o registro geral. Veja <a class="text-link" href="/answers/drip-faucets-to-prevent-frozen-pipes">se deixar a torneira pingando ajuda</a>, <a class="text-link" href="/answers/how-long-for-pipes-to-freeze">quanto tempo os canos levam para congelar</a> e a <a class="text-link" href="/freeze-time-calculator">calculadora de tempo até o congelamento</a> se você tiver um termômetro no espaço.',
  insideTitle: "A previsão é do lado de fora. Seus canos estão do lado de dentro.",
  insideBody:
    "Uma sonda ao lado do cano mostra o que está realmente acontecendo no espaço e avisa você antes do congelamento, enquanto ainda há tempo para agir. O plano gratuito inclui alertas por e-mail; use uma sonda ESP32 (cerca de US$ 25 em peças) ou sensores que você já tem no Home Assistant.",
  startFree: "Comece grátis",
  kitParts: "Peças do kit de congelamento ESP32",
  sourcesTitle: "Fontes",
  sourceKxan: "At what temperature do pipes freeze? (KXAN, em inglês, citando pesquisa da Universidade de Illinois)",
  sourceFarmBureau: "How pipes freeze and burst (Farm Bureau Insurance, em inglês)",
  sourceNws: "API do National Weather Service",
  sourceNwsNote: ": dados de previsão por hora",
  faqs: [
    {
      question: "Em que temperatura externa os canos congelam?",
      answer:
        "A água congela a 0 °C (32 °F), mas os canos dentro de um imóvel geralmente precisam de um ar externo mais frio para congelar. Uma pesquisa da Universidade de Illinois, muito citada por seguradoras, coloca o ponto de perigo para canos em espaços sem aquecimento numa temperatura externa de cerca de −7 °C (20 °F). Por isso esta previsão marca como risco alto as noites a −7 °C (20 °F) ou menos.",
    },
    {
      question: "Os canos podem congelar quando a mínima fica acima de −7 °C (20 °F)?",
      answer:
        "Sim. Uma noite longa abaixo de 0 °C (32 °F) pode congelar um cano sem isolamento, numa parede externa, perto da porta da garagem ou num porão ventilado, principalmente com vento. Por isso as noites entre −6 °C e 0 °C (21–32 °F) são marcadas como Atenção.",
    },
    {
      question: "Por que o vento importa?",
      answer:
        "O ar em movimento tira calor de um cano muito mais rápido que o ar parado, então canos perto de respiros, frestas de portas e rachaduras em paredes externas congelam primeiro. A previsão destaca ventos de 24 km/h (15 mph) ou mais durante as horas de congelamento.",
    },
    {
      question: "Isso me diz o quanto minha garagem vai esfriar?",
      answer:
        "Não. A previsão é do ar externo. Uma garagem anexa ou com isolamento pode ficar bem acima da mínima externa, e uma cheia de frestas pode ficar quase tão fria quanto lá fora. O único jeito de saber é um termômetro perto dos canos, de preferência um que avise você antes de eles chegarem ao congelamento.",
    },
    {
      question: "De onde vem a previsão?",
      answer:
        "Da previsão por hora do National Weather Service (o serviço meteorológico dos EUA) para a sua localização, atualizada mais ou menos a cada 30 minutos. Ela cobre os Estados Unidos e seus territórios.",
    },
  ],
  tool: {
    riskHigh: "Risco alto",
    riskWatch: "Atenção",
    riskLow: "Risco baixo",
    errorUsOnly: "Esta previsão usa o National Weather Service, então só cobre locais nos EUA.",
    errorRateLimited: "Pesquisas demais em um minuto. Tente de novo daqui a pouco.",
    errorService: "O serviço de previsão não respondeu. Tente de novo em um minuto.",
    errorNoGeolocation: "Este navegador não consegue compartilhar a localização. Pesquise uma cidade ou CEP (ZIP).",
    errorGeoDeclined: "A permissão de localização foi negada. Pesquise uma cidade ou CEP (ZIP).",
    tonight: "Hoje à noite",
    weekdayNight: "Noite de {weekday}",
    headlineNone: "Nenhuma noite de previsão recebida",
    headlineHigh: "Hoje à noite: risco alto de congelamento em espaços sem aquecimento (mínima {low})",
    headlineWatch: "Hoje à noite: abaixo de zero (mínima {low}), fique de olho nos canos expostos",
    headlineColderLater: "Hoje à noite não congela, mas vêm noites mais frias",
    headlineClear: "Nenhuma noite de congelamento na previsão",
    describeHigh:
      "Mínima de {low}, no limite de {mark} ou abaixo dele, ponto em que canos de garagens, porões e sótãos sem aquecimento costumam correr risco.",
    describeWatchOne:
      "Abaixo de zero por cerca de {hours} hora, mínima {low}. Canos expostos em paredes externas, perto da porta da garagem ou em porões ventilados ainda podem congelar numa noite longa ou com vento.",
    describeWatchMany:
      "Abaixo de zero por cerca de {hours} horas, mínima {low}. Canos expostos em paredes externas, perto da porta da garagem ou em porões ventilados ainda podem congelar numa noite longa ou com vento.",
    describeAbove: "Fica acima de zero (mínima {low}).",
    describeWind: "Vento de até {wind} abaixo de zero tira calor mais rápido dos canos expostos.",
    describeNextDay: "O dia seguinte também fica abaixo de zero, então os espaços sem aquecimento não vão se aquecer de novo.",
    signupTitle: "Avise-me por e-mail antes das noites de congelamento em {place}",
    signupLede:
      "Grátis, sem hardware. Um e-mail na tarde anterior à primeira noite de congelamento de uma onda de frio, e antes de cada noite a {temp} ou menos. Cancele com um clique.",
    emailLabel: "E-mail",
    emailPlaceholder: "voce@exemplo.com",
    sending: "Enviando…",
    submit: "Receber alertas de congelamento",
    genericError: "Algo deu errado. Tente de novo.",
    heading: "Confira sua região",
    unitLegend: "Unidade de temperatura",
    searchLabel: "Cidade ou CEP (ZIP) dos EUA",
    searchPlaceholder: "ex.: 23219 ou Richmond, VA",
    useMyLocation: "Usar minha localização",
    myLocation: "Minha localização",
    resultsLabel: "Locais encontrados",
    loading: "Carregando a previsão para {place}…",
    source: " · previsão externa do National Weather Service",
    updated: ", atualizada em {time}",
    nightLow: "mínima · {hours} h a {temp} ou menos",
    nightBelow20: " · {hours} h a {temp} ou menos",
    embedSummary: "Incorpore esta previsão no seu site",
    embedLede:
      "Um pequeno widget ao vivo para o site de um encanador, de uma administradora de imóveis ou de um bairro. Mostra hoje à noite e as duas noites seguintes, e se atualiza sozinho.",
    copied: "Copiado",
    copyEmbed: "Copiar código de incorporação",
  },
};

export const freezePipeForecastMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

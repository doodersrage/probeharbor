import type { FreezeTimeCalculatorMessages } from "./en";

const fr: FreezeTimeCalculatorMessages = {
  title: "Calculateur de délai de gel des canalisations",
  description:
    "Deux relevés de température et un seuil de gel suffisent pour estimer combien d’heures il reste avant le gel des canalisations d’un garage ou d’un chalet.",
  breadcrumbHome: "Accueil",
  kicker: "Outil",
  heading: "Dans combien de temps cet espace atteindra-t-il le gel ?",
  lede: "Relevez un thermomètre dans l’espace maintenant, comparez avec un relevé précédent et voyez à peu près combien d’heures il reste avant d’atteindre votre seuil de gel au rythme de refroidissement actuel.",
  startFree: "Commencer gratuitement",
  howLongLink: "Combien de temps les canalisations mettent à geler",
  readingTitle: "Interpréter le résultat",
  readingIntro:
    "L’estimation suppose que l’espace continue de se refroidir au rythme mesuré. Servez-vous-en pour juger de l’urgence de la nuit : une heure ou deux, il faut agir maintenant ; un jour ou plus, revérifiez plus tard.",
  readingLinksHtml:
    'Les canalisations sur les murs extérieurs et près des portes sont plus froides que la pièce : mesurez donc au plus près du tuyau. Voir <a class="text-link" href="/answers/garage-pipe-freeze-temperature">quand les canalisations du garage gèlent</a>, <a class="text-link" href="/answers/freeze-alarm-temperature-setting">à quelle température régler une alarme de gel</a> et <a class="text-link" href="/about/time-to-freeze">comment fonctionne le compte à rebours avant le gel</a> du tableau de bord.',
  sensorTitle: "Laissez un capteur faire le calcul",
  sensorBody:
    "Une sonde sur la canalisation envoie un relevé toutes les quelques minutes : l’estimation se met à jour toute seule et une alerte vous parvient avant le seuil. L’offre gratuite inclut les alertes par e-mail ; utilisez une sonde ESP32 ou connectez Home Assistant.",
  seeDemo: "Voir la démo en direct",
  faqs: [
    {
      question: "Comment fonctionne le calculateur ?",
      answer:
        "Il prend le rythme de refroidissement entre vos deux relevés et le prolonge en ligne droite jusqu’à votre seuil. Si l’espace a perdu 1 °C (2 °F) au cours de la dernière heure et se trouve 5,5 °C (10 °F) au-dessus du seuil, l’estimation est de cinq heures.",
    },
    {
      question: "L’estimation est-elle précise ?",
      answer:
        "C’est une marge, pas un chronomètre. Un espace se refroidit plus lentement à mesure qu’il approche de la température extérieure, et plus vite si le vent se lève ou si une porte s’ouvre : refaites le calcul avec des relevés récents environ toutes les heures.",
    },
    {
      question: "Quel seuil choisir ?",
      answer:
        "Entre 1 et 3 °C (34–38 °F), mesurés au niveau de la canalisation. Atteindre le seuil ne signifie pas que le tuyau a gelé : cela signifie qu’il reste du temps pour rétablir le chauffage, fermer une porte ou ouvrir un robinet.",
    },
    {
      question: "Ce calcul peut-il se faire automatiquement ?",
      answer:
        "Oui. ProbeHarbor effectue le même calcul en continu à partir des relevés de votre capteur, quelle que soit l’offre, et l’affiche sous forme de compte à rebours avant le gel, avec une alerte quand l’espace atteint votre seuil.",
    },
  ],
  calculator: {
    heading: "Calculateur",
    unitLegend: "Unité de température",
    nowLabel: "Température actuelle (°{unit})",
    nowHint: "Au niveau du tuyau si possible, sinon l’air à proximité.",
    earlierLabel: "Température précédente (°{unit})",
    earlierHint: "Même capteur, même endroit.",
    minutesLabel: "Minutes entre les relevés",
    minutesHint: "15 ou plus ; une heure donne une tendance plus fiable.",
    thresholdLabel: "Seuil de gel (°{unit})",
    thresholdHint: "{low}–{high} laisse le temps d’agir avant {freezing}.",
    resultLabel: "Temps avant le seuil",
    headlineEmpty: "Saisissez quatre nombres",
    headlineAtThreshold: "Seuil déjà atteint",
    headlineNotCooling: "Pas de refroidissement vers le gel",
    headlineNeedGap: "Écart trop court entre les relevés",
    detailEmpty: "Remplissez chaque champ avec un nombre pour obtenir une estimation.",
    detailCooling: "Refroidissement d’environ {rate} : à peu près {duration} avant {threshold} à ce rythme.",
    ratePerHour: "{value}°{unit}/h",
    minutes: "{n} minutes",
    hours: "{n} heures",
    days: "{n} jours",
    msgAtThreshold: "Déjà au niveau de votre seuil de gel ou en dessous.",
    msgNeedReadings: "Il faut des relevés plus récents pour estimer une tendance.",
    msgTooClose: "Les relevés sont trop rapprochés pour dégager une tendance.",
    msgRising: "La température monte : aucun risque de gel selon la tendance actuelle.",
    msgStable: "La température est stable : la tendance n’annonce pas de gel imminent.",
    reset: "Rétablir l’exemple",
  },
};

export default fr;

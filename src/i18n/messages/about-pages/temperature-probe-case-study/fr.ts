
/** Body copy for /about/temperature-probe-case-study. Hrefs stay English; middleware localizes them. */
const FIRMWARE_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/arduino-network-json-temperature-sever">arduino-network-json-temperature-sever</a>';
import type { Messages } from "./en";

const fr: Messages = {
  heroAlt:
    "Contrôleur de sondes de température pour garage, deuxième révision, avec connexion Ethernet et plusieurs entrées capteurs",
  heroCaption: "Révision deux de la carte de sondes ProbeHarbor. Ethernet, écran LCD et deux entrées DHT22.",
  intro:
    "Cette étude de cas retrace la construction de la sonde de température qui alimente ProbeHarbor : pourquoi un simple thermomètre extérieur ne suffisait pas, comment deux zones DHT22 et une moyenne de synthèse ont été retenues, et ce qui a changé entre la première installation sur platine d’essai et la révision connectée au réseau qui sert aujourd’hui du JSON en direct à ce site.",
  challengeTitle: "Le défi",
  challenge: [
    "L’objectif était concret, pas théorique : savoir si un garage attenant approchait du risque de gel, si l’humidité montait assez pour faire rouiller les outils, et si les conditions différaient près de la porte et au fond du garage. Les applis météo grand public ne donnent que l’air extérieur à la station la plus proche, qui peut s’écarter d’environ 5 °C (10 °F) ou plus de l’intérieur d’un garage isolé par un après-midi d’hiver ensoleillé.",
    "Un seul capteur aurait masqué les écarts qui comptent. Ouvrir la porte de garage, garer un véhicule encore chaud ou le soleil de l’après-midi sur un mur exposé à l’ouest font évoluer différentes parties de l’espace à des vitesses différentes. L’intérêt de plusieurs sondes était évident avant même la première soudure.",
  ],
  environmentTitle: "L’environnement",
  environment:
    "L’espace surveillé est un garage attenant typique : une grande porte basculante, une dalle en béton, une isolation limitée par rapport aux pièces à vivre, et des variations saisonnières dues autant à l’ensoleillement et aux infiltrations d’air qu’à la température extérieure. En été, la zone côté porte est plus chaude ; en hiver, la dalle et le mur nord suivent les minimales extérieures avec plusieurs heures de retard.",
  zonesHtml: [
    "<strong>Zone du mur nord :</strong> évolue plus lentement ; utile pour suivre la tendance des minimales nocturnes.",
    "<strong>Zone de la porte :</strong> grimpe dès que la porte s’ouvre ; révèle les infiltrations rapides.",
    "<strong>Zone de l’établi :</strong> représente l’endroit où l’on travaille vraiment, à hauteur d’épaule.",
  ],
  demoHtml:
    'La <a class="text-link" href="/about/probe-demo">démo interactive des sondes</a> modélise ces trois zones pour vous montrer comment le soleil et l’état de la porte font diverger les relevés, sans installer de matériel.',
  approachTitle: "Démarche et matériel",
  approachHtml: [
    "Chaque sonde utilise un capteur numérique d’humidité et de température DHT22 relié par un câble court à un Arduino Uno. Le firmware lit les deux capteurs à intervalle régulier, refait une tentative en cas d’erreur passagère du bus, calcule un <code>avg</code> des sondes en bon état et sert un JSON compact sur le réseau local via un shield Ethernet. Un écran LCD 16×2 sur la carte affiche les valeurs en direct pour vérifier sur place sans ordinateur portable.",
    'L’emplacement suit les règles du <a class="text-link" href="/about/temperature-probes">guide des sondes de température</a> : à l’écart des taches de soleil direct et des extracteurs, à peu près à hauteur d’épaule, avec un montage ventilé pour que l’air circule autour de la tête du capteur. Dans le dashboard, des libellés associent les clés JSON <code>0</code> et <code>1</code> à des noms de zone lisibles.',
  ],
  rev1Alt: "Carte de sonde première révision sur platine d’essai avec capteurs DHT22 et écran LCD",
  rev1Caption: "La révision un a validé sur l’établi le câblage, les intervalles de lecture et la structure du JSON avant la pose dans le garage.",
  timelineTitle: "Étapes de la construction",
  timelineHtml: [
    "<strong>Mise en route sur l’établi :</strong> les journaux série ont confirmé les lectures du DHT22, l’affichage LCD et des clés JSON <code>temp</code> stables avant que la carte ne quitte le bureau.",
    "<strong>Révision un dans le garage :</strong> a prouvé que les écarts entre sondes étaient réels : la zone de la porte s’écartait régulièrement du mur nord aux heures des trajets domicile-travail.",
    "<strong>Flux JSON réseau :</strong> l’Ethernet a évité d’apporter un portable à chaque vérification ; le site pouvait récupérer le même document que celui déjà affiché par l’écran LCD.",
    "<strong>Révision deux :</strong> empilement plus propre du shield Ethernet, connecteurs de sonde améliorés et logique de redémarrage compatible watchdog pour les rares blocages réseau.",
    "<strong>Intégration au site :</strong> les pages Astro associent les flux à des cartes ; l’historique des utilisateurs connectés enregistre des instantanés pour analyser les tendances et exporter en CSV.",
  ],
  dataTitle: "Ce que les données ont montré",
  dataLede: "Après un cycle complet hiver-été, les sondes se sont révélées utiles là où un relevé unique serait passé à côté :",
  data: [
    "Près de la porte, la température pouvait varier de 4 à 7 °C (8–12 °F) quelques minutes après l’ouverture de la porte de garage, alors que le mur du fond bougeait à peine.",
    "Les minimales nocturnes près du mur nord suivaient le risque de gel de façon plus fiable que les seules prévisions extérieures.",
    "L’humidité augmentait après de longues vagues de froid, quand la dalle tardait à se réchauffer : utile pour savoir quand faire tourner un déshumidificateur.",
    "La moyenne calculée lissait le bruit des graphiques d’historique, tandis que les cartes par sonde de la page d’accueil gardaient le détail de chaque zone.",
  ],
  flowHtml:
    'Les relevés passent de la sonde au dashboard selon le chemin décrit dans <a class="text-link" href="/about/data-flow">flux de données de bout en bout</a>. Quand il a fallu du TLS en bordure, un <a class="text-link" href="/about/python-feeds">relais Python</a> a mis en cache le JSON amont sans reporter cette complexité sur le microcontrôleur.',
  lessonsTitle: "Leçons retenues",
  lessonsHtml: [
    "<strong>L’emplacement compte plus que le prix du capteur :</strong> un DHT22 bien monté a toujours fait mieux qu’un capteur haut de gamme mal placé.",
    "<strong>Nommez les zones dans le logiciel :</strong> des clés JSON stables et des libellés dans le dashboard ont permis de garder firmware et site faiblement couplés.",
    "<strong>Attendez-vous à des trous :</strong> redémarrages et micro-coupures réseau créent de courtes lacunes ; distinguez-les d’une mauvaise configuration grâce aux guides sur les relevés obsolètes.",
    "<strong>Prévoyez d’itérer :</strong> la révision un sur platine d’essai a évité de remonter à l’échelle quand le brochage a changé.",
  ],
  relatedTitle: "Pour aller plus loin",
  relatedHtml: `Poursuivez avec la <a class="text-link" href="/about/temperature-probes">présentation des sondes de température</a>, le guide des <a class="text-link" href="/about/arduino-sketches">sketches Arduino</a>, <a class="text-link" href="/about/temperature-changes">ce qui fait varier les relevés</a> et l’<a class="text-link" href="/about/historical-data">utilisation des données historiques</a> dans le dashboard. Code source du firmware : ${FIRMWARE_LINK}.`,
};

export default fr;

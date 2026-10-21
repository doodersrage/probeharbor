
/** /about/temperature-probes body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

const fr: Messages = {
  introHtml:
    'Les sondes de température constituent la couche de mesure de tout système de surveillance ambiante. Dans un garage, un atelier, des combles, un vide sanitaire ou un local professionnel, elles traduisent la chaleur et l’humidité en chiffres que le reste du système peut stocker, tracer et utiliser pour alerter. Ce projet utilise des capteurs numériques d’humidité et de température reliés à un Arduino, avec plusieurs canaux de sonde pour comparer les zones plutôt que de se fier à une seule mesure. Pour l’histoire complète du montage, lisez l’<a class="text-link" href="/about/temperature-probe-case-study">étude de cas sur la sonde de température</a>.',
  measureTitle: "Ce que mesurent concrètement les sondes",
  measureHtml:
    "Chaque sonde remonte deux valeurs utiles pour les décisions du quotidien : la température de l’air et l’humidité relative. La température vous indique si les canalisations, la peinture ou les objets stockés approchent de limites risquées. L’humidité aide à expliquer la condensation sur les surfaces froides, la rouille sur les outils, et à savoir s’il vaut la peine de déshumidifier la nuit.",
  jsonHtml:
    "Dans ce montage, les sondes exposent leurs mesures dans un objet JSON indexé par numéro de sonde : <code>0</code>, <code>1</code> et une moyenne <code>avg</code> calculée sur les capteurs actifs. Cette structure se transpose facilement en libellés du tableau de bord comme « Mur nord » ou « Zone de l’établi ».",
  usesTitle: "Usages courants des sondes dans les espaces non chauffés",
  uses: [
    "<strong>Protection contre le gel :</strong> suivez les minimales nocturnes près des murs extérieurs avant que la plomberie ne soit menacée.",
    "<strong>Comparaison saisonnière :</strong> comparez les zones proches des combles avec le niveau du sol pendant les chaleurs estivales.",
    "<strong>État du matériel :</strong> surveillez l’humidité autour des outils métalliques, des batteries ou des archives papier.",
    "<strong>Confort de travail :</strong> vérifiez si les changements d’isolation ou de ventilation sont vraiment efficaces.",
    "<strong>Contrôle à distance :</strong> consultez les mesures en direct quand vous êtes absent, au lieu de vous fier seulement à la météo extérieure.",
  ],
  placementTitle: "L’emplacement compte plus que le prix du capteur",
  placementHtml:
    "Une sonde près d’une porte de garage non isolée variera fortement à chaque ouverture. Une autre sur un mur exposé au nord peut suivre la température extérieure avec plusieurs heures de retard. Pour des tendances stables, installez les sondes à l’écart du soleil direct, des courants d’air des ventilateurs et des sources de chaleur comme les congélateurs ou les chauffe-eau. La hauteur d’épaule (1,2 à 1,5 m) représente généralement l’air que ressentent les personnes et les objets stockés.",
  multipleTitle: "Pourquoi plusieurs sondes valent mieux qu’une",
  multipleHtml:
    "Garages, ateliers et combles ne sont pas des boîtes homogènes. Un seul capteur peut indiquer 7 °C (45 °F) près du sol alors que le haut du local est à 14 °C (58 °F) par un après-midi d’hiver ensoleillé. Plusieurs sondes révèlent les gradients, les défauts d’isolation et la zone qui représente vraiment le risque qui vous préoccupe. Le firmware fait la moyenne des sondes actives : la page d’historique conserve ainsi un instantané de synthèse par chargement, tandis que la page d’accueil garde le détail par sonde.",
  boardAlt: "Carte contrôleur de sondes ProbeHarbor avec connexion Ethernet et capteurs DHT22",
  boardCaption: "Deuxième révision de la carte de sondes ProbeHarbor : Ethernet, écran LCD et deux entrées DHT22.",
  webTitle: "Du fil de la sonde à la page web",
  webHtml:
    'Les sondes ne communiquent pas directement avec le site. Le sketch Arduino lit chaque capteur à intervalles réguliers, valide les plages de valeurs et publie du JSON en HTTPS. Le site récupère ce flux, associe les clés aux libellés lisibles que vous configurez dans le tableau de bord et, si vous êtes connecté, peut enregistrer les mesures. Essayez la <a class="text-link" href="/about/probe-demo">démo interactive des sondes</a> pour voir comment se comportent plusieurs zones et les moyennes, ou lisez le guide du <a class="text-link" href="/about/data-flow">flux de données de bout en bout</a>.',
};

export default fr;

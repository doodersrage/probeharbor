import type { DripEmailMessages } from "./en";

const fr: DripEmailMessages = {
  day1: {
    subject: "Ajoutez votre première sonde à ProbeHarbor",
    eyebrow: "Premiers pas",
    preheader:
      "Créez une clé d’appareil, envoyez du JSON en POST, les capteurs s’importent automatiquement — environ 10 minutes.",
    title: "Connectez votre première sonde",
    intro:
      "Bienvenue sur ProbeHarbor. Votre compte gratuit est prêt — prochaine étape : une mesure en direct dans la Vue d’ensemble.",
    paragraphs: [
      "Ouvrez Appareils et choisissez ce que vous avez. Chaque parcours crée un appareil et vous fournit un extrait de code avec sa clé ; les capteurs s’importent automatiquement dès la première mesure.",
    ],
    bullets: [
      "Capteurs dans Home Assistant, ESPHome ou MQTT : copiez-collez du YAML ou un relais, environ 5 minutes",
      "Un ESP32, Pico W ou Arduino : téléchargez un sketch prérempli avec votre URL d’ingestion",
      "Pas encore de matériel : un clic ajoute un flux de démo en direct pour voir le tableau de bord fonctionner",
    ],
    cta: "Ouvrir Appareils",
    secondaryCta: "Guide d’ajout d’appareils",
  },
  day3: {
    subject: "Activez les alertes gel et fuite avant la prochaine mauvaise surprise",
    eyebrow: "Protection contre le gel et les inondations",
    preheader:
      "La plupart des espaces non chauffés déclenchent les alertes gel vers 1 °C (34 °F) — et les contacts d’inondation mouillés alertent automatiquement une fois les alertes activées.",
    title: "N’attendez pas la vague de froid ou un capteur mouillé",
    intro:
      "ProbeHarbor peut vous prévenir quand la température approche du gel ou qu’un contact de fuite détecte de l’eau — par e-mail et notification push dès maintenant, et par SMS avec Pro.",
    paragraphs: [
      "Définissez un seuil de gel sur votre zone la plus froide, activez les canaux que vous consultez vraiment et envoyez un test pendant que vous êtes réveillé. Ajoutez un contact d’inondation sec/mouillé sous un bac de chauffe-eau, près du lave-linge ou d’une pompe de relevage si vous en avez un.",
    ],
    bullets: [
      "Commencez avec un seuil de gel vers 1–3 °C (34–38 °F), puis ajustez après avoir vu les minimums nocturnes",
      "Autorisez les alertes gel et inondation pendant les heures calmes",
      "En option : invitez les membres du foyer pour que quelqu’un d’autre voie l’alerte",
    ],
    cta: "Configurer les alertes",
    secondaryCta: "Guide vague de froid",
  },
  day7: {
    subject: "Essayez Pro gratuitement — SMS, webhooks et plus d’options de partage",
    eyebrow: "Essai Pro",
    preheader: "SMS, WhatsApp, options de partage Pro et webhooks — essai gratuit de 14 jours.",
    title: "Passez à la vitesse supérieure avec un essai Pro gratuit",
    intro:
      "Vous avez eu une semaine pour découvrir ProbeHarbor. Pro ajoute les canaux et les outils de partage qui comptent à 2 h du matin. (Free inclut déjà un lien familial en direct.)",
    paragraphs: [
      "Démarrez un essai de 14 jours depuis la page Tarifs — résiliable à tout moment depuis le portail de facturation du tableau de bord.",
    ],
    bullets: [
      "Alertes gel et fuite par SMS et notifications push du navigateur",
      "Historique, métriques et liens de partage sans expiration, plus intégrations",
      "Webhooks sortants et jusqu’à {maxDevices} appareils par bien",
    ],
    cta: "Comparer les offres et démarrer l’essai",
    secondaryCta: "Ouvrir le tableau de bord",
  },
  day3Setup: {
    subject: "Toujours en cours d’installation ? Trois façons rapides d’obtenir une première mesure",
    eyebrow: "Premiers pas",
    preheader: "Home Assistant, un ESP32 flashé ou un flux de démo en un clic.",
    title: "Votre tableau de bord attend une première mesure",
    intro:
      "Rien n’a encore été reçu. Choisissez ce que vous avez sous la main aujourd’hui ; chaque option prend quelques minutes depuis Appareils → Installation.",
    paragraphs: [],
    bullets: [
      "Home Assistant, ESPHome ou MQTT : nous générons le YAML ou la commande de relais avec votre clé",
      "ESP32 + DS18B20 (environ 25 $ US) : téléchargez un sketch avec votre URL d’ingestion déjà renseignée",
      "Rien pour l’instant : ajoutez le flux de démo pour voir les graphiques et les alertes fonctionner avant d’acheter des composants",
    ],
    cta: "Ouvrir l’installation des appareils",
    secondaryCta: "Composants du kit gel ESP32",
  },
  day7Setup: {
    subject: "Qu’essayez-vous de connecter ?",
    eyebrow: "Aide à l’installation",
    preheader: "Indiquez-nous votre capteur ou votre hub et nous vous montrerons le chemin le plus court.",
    title: "Bloqué à l’installation ? Dites-nous ce que vous avez",
    intro:
      "Votre compte n’a toujours aucune mesure. Si un capteur, un hub ou une carte ne correspond à aucun parcours d’installation, écrivez-nous en indiquant ce que vous utilisez et nous vous aiderons à le faire remonter des données.",
    paragraphs: [
      "La saison du gel approche. Une seule sonde près du tuyau le plus froid suffit pour recevoir une alerte à temps.",
    ],
    bullets: [],
    cta: "Demander de l’aide",
    secondaryCta: "Ouvrir l’installation des appareils",
  },
  confirm: {
    subject: "Confirmez votre e-mail pour finaliser votre compte ProbeHarbor",
    eyebrow: "Plus qu’une étape",
    preheader:
      "Votre compte attend la confirmation de votre e-mail ; les liens expirent, demandez-en un nouveau.",
    title: "Confirmez votre e-mail pour vous connecter",
    intro:
      "Vous avez créé un compte ProbeHarbor mais l’adresse n’a jamais été confirmée : la connexion reste donc bloquée.",
    paragraphs: [
      "Les liens de confirmation expirent. Demandez-en un nouveau, cliquez dessus et vous arriverez sur Appareils, prêt à connecter un premier capteur (ou un flux de démo si vous n’avez pas encore de matériel).",
    ],
    bullets: [],
    cta: "Envoyer un nouveau lien de confirmation",
    secondaryCta: "Se connecter",
  },
};

export default fr;

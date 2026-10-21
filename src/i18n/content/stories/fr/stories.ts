import type { StoryOverlay } from "..";

export default {
  "garage-freeze-alert": {
    headline: "Scénario : panne du chauffage du garage",
    title: "Le chauffage du garage disjoncte à 2 h du matin",
    description:
      "Scénario : le chauffage d’un garage lâche en pleine vague de froid. Une sonde ESP32, un seuil de 1 °C (34 °F) et des SMS laissent le temps d’agir avant le gel.",
    setting: "Garage chauffé avec plomberie, climat froid",
    setup: [
      "ESP32 + DHT22 qui envoie une mesure toutes les 5 minutes à l’ingest ProbeHarbor",
      "Seuil de gel à 1 °C (34 °F) avec SMS (Pro) et relais vers Telegram",
      "Récapitulatif hebdomadaire pour le foyer ; lien en direct familial pour un voisin qui garde un œil sur la maison",
    ],
    timeline: [
      { time: "2 h 14", detail: "Le garage passe sous 1 °C (34 °F) ; ProbeHarbor envoie un SMS aux deux propriétaires et publie sur un canal Telegram familial." },
      { time: "2 h 22", detail: "L’un des propriétaires redémarre le chauffage via une prise connectée." },
      { time: "3 h 05", detail: "Le graphique montre la température qui remonte, bien avant que les canalisations n’atteignent 0 °C (32 °F)." },
    ],
    outcome:
      "Une panne de chauffage ne tourne à la catastrophe que si personne ne s’en aperçoit avant le matin. Le seuil est fixé quelques degrés au-dessus du point de congélation pour laisser le temps de réagir, et c’est le SMS qui vous réveille à 2 h du matin ; un e-mail, on le rate facilement en dormant.",
    faqs: [
      {
        question: "Quels canaux d’alerte vous réveillent la nuit ?",
        answer:
          "Le SMS (Pro) et les notifications push (toutes les offres) sont ceux qui réveillent vraiment. L’e-mail et les messageries comme Telegram sont aussi inclus dans toutes les offres et font un bon canal de secours.",
      },
      {
        question: "Quel matériel faut-il ?",
        answer:
          "Un ESP32 avec un DHT22 ou un DS18B20 étanche qui envoie une mesure à quelques minutes d’intervalle à l’ingest ProbeHarbor, et un seuil de gel autour de 1 °C (34 °F).",
      },
    ],
  },
  "cabin-winter-watch": {
    headline: "Scénario : la chaudière d’un chalet vide s’arrête",
    title: "La chaudière du chalet s’arrête en pleine semaine",
    description:
      "Scénario : une micro-coupure relance la chaudière d’un chalet vide en hiver. Une sonde dans le vide sanitaire et des alertes e-mail et push le signalent.",
    setting: "Chalet de vacances, vide la majeure partie de la semaine",
    setup: [
      "ESP8266 en Wi-Fi près du local technique, deux sondes (pièce de vie + vide sanitaire)",
      "E-mail et notifications push du navigateur ; seuil de gel à 2 °C (36 °F)",
      "Un ami du coin invité dans le foyer comme relais en cas de besoin",
    ],
    timeline: [
      { time: "Mar. 11 h 40", detail: "Une micro-coupure réinitialise la chaudière ; le vide sanitaire descend sous 2 °C (36 °F)." },
      { time: "Mar. 11 h 41", detail: "La notification push et l’e-mail partent ; le propriétaire appelle son ami sur place." },
      { time: "Mar. 13 h 10", detail: "L’ami relance la chaudière et la courbe remonte avant le froid du soir." },
    ],
    outcome:
      "Les bâtiments vides tombent en panne en silence. Tout l’intérêt, c’est l’avance : une alerte le mardi plutôt que des canalisations gelées découvertes le vendredi.",
    faqs: [
      {
        question: "Faut-il des SMS pour un chalet ?",
        answer:
          "Pas toujours. L’e-mail et le push suffisent quand quelqu’un peut intervenir en quelques heures. Le SMS (Pro) aide si vous risquez d’être sans connexion de données.",
      },
      {
        question: "Combien de sondes ?",
        answer:
          "Deux : une dans la pièce de vie comme repère, une dans le vide sanitaire, là où les canalisations risquent vraiment de geler.",
      },
    ],
  },
  "server-closet-heat": {
    headline: "Scénario : surchauffe du placard serveur",
    title: "Le ventilateur du placard lâche avant le week-end",
    description:
      "Scénario : le ventilateur du placard homelab lâche en votre absence. Une règle de chaleur et un webhook Home Assistant coupent le matériel à temps.",
    setting: "Placard homelab à côté d’un garage",
    setup: [
      "Un ESP32 qui surveille déjà le garage ; une seconde sonde dans le placard",
      "Règle de chaleur à 35 °C (95 °F) (Alerts → Rules → Add heat rule), en plus de la surveillance du gel côté garage",
      "Webhook sortant (Pro) vers Home Assistant pour couper une prise connectée",
    ],
    timeline: [
      { time: "Ven. 18 h 05", detail: "Le placard atteint 36 °C (96 °F) après la panne d’un ventilateur ; la règle de chaleur se déclenche et le webhook arrive dans Home Assistant." },
      { time: "Ven. 18 h 06", detail: "Une automatisation éteint le matériel non critique ; un SMS confirme l’alerte." },
      { time: "Samedi matin", detail: "Le propriétaire remplace le ventilateur ; l’historique montre à quelle vitesse le placard a chauffé." },
    ],
    outcome:
      "Les mêmes sondes et le même circuit d’ingest couvrent les deux types de panne : le gel côté garage, la chaleur dans le placard.",
    faqs: [
      {
        question: "ProbeHarbor ne sert-il que pour le froid ?",
        answer:
          "Non. Les alertes de gel sont intégrées, et la chaleur passe par une règle (« Temperature above », 35 °C/95 °F par défaut) que vous ajoutez en un clic dans Alerts → Rules.",
      },
      {
        question: "Où intervient Home Assistant ?",
        answer:
          "Les webhooks sortants de l’offre Pro envoient le JSON de l’alerte en POST à Home Assistant, où une automatisation peut couper une prise connectée. L’intégration HACS officielle expose aussi les mesures comme capteurs et ajoute des services de mise en veille des alertes ; voir probeharbor.dev/integrations/home-assistant.",
      },
    ],
  },
  "pipe-near-miss": {
    headline: "Scénario : le coin froid d’un garage attenant",
    title: "Le même coin passe sous 1 °C (34 °F) chaque nuit claire",
    description:
      "Scénario : alertes de gel répétées dans un garage attenant. L’historique et l’export CSV révèlent un joint de porte qui fuit avant que les tuyaux gèlent.",
    setting: "Garage attenant avec chauffe-eau",
    setup: [
      "Arduino + DHT22 sur une étagère au-dessus du chauffe-eau",
      "Alertes e-mail à 1 °C (34 °F) avec l’offre Free ; Member pour l’export CSV",
      "Température du garage comparée à la météo extérieure dans le dashboard",
    ],
    timeline: [
      { time: "Semaine 1", detail: "Les alertes se déclenchent par nuits claires et sans vent ; on dirait du froid ordinaire." },
      { time: "Semaine 2", detail: "L’historique et le CSV montrent que la sonde côté porte descend toujours en premier." },
      { time: "Semaine 3", detail: "Après la pose d’un joint d’étanchéité sur la porte, les nuits restent au-dessus du seuil." },
    ],
    outcome:
      "Une alerte vous dit que quelque chose ne va pas ; l’historique vous dit où. Un joint bon marché vaut mieux qu’attendre la nuit assez froide pour faire éclater un tuyau.",
    faqs: [
      {
        question: "L’offre Free suffit-elle ?",
        answer:
          "Les alertes e-mail de l’offre Free repèrent le problème. Member ajoute l’export CSV et un historique plus long, ce qui rend un schéma récurrent facile à voir.",
      },
      {
        question: "Un garage attenant peut-il geler ?",
        answer:
          "Oui, surtout le long des murs extérieurs et des portes mal isolées. Attenant ne veut pas dire chauffé.",
      },
    ],
  },
  "crawlspace-pipe-watch": {
    headline: "Scénario : grille du vide sanitaire",
    title: "Une grille du vide sanitaire reste ouverte toute la nuit",
    description:
      "Scénario : une grille d’aération reste ouverte par une nuit froide. Un DS18B20 étanche sur la conduite et les alertes de gel laissent le temps d’agir.",
    setting: "Vide sanitaire sous une maison, climat froid",
    setup: [
      "ESP32 + DS18B20 étanche fixé par collier près de la conduite d’arrivée principale",
      "Seuil de gel à 2 °C (36 °F) avec e-mail et SMS (Pro)",
      "Lien en direct familial pour un proche qui habite à côté",
    ],
    timeline: [
      { time: "Dim. 4 h 05", detail: "Le vide sanitaire passe sous 2 °C (36 °F), une grille d’aération restée bloquée ouverte." },
      { time: "Dim. 4 h 06", detail: "SMS et e-mail partent ; le proche consulte le lien en direct et se met en route." },
      { time: "Dim. 5 h 20", detail: "La grille est refermée et la courbe remonte avant le minimum du matin." },
    ],
    outcome:
      "Personne ne va vérifier un vide sanitaire à 4 h du matin. Une sonde sur la conduite, pas à la trappe, transforme une grille bloquée en simple formalité.",
    faqs: [
      {
        question: "Où placer la sonde dans le vide sanitaire ?",
        answer:
          "Sur la conduite d’arrivée la plus froide ou juste à côté, pas à la trappe d’accès. Ajoutez une sonde dans la pièce de vie si vous voulez un repère à l’étage.",
      },
      {
        question: "Un capteur d’humidité suffit-il ?",
        answer:
          "Non. L’humidité aide à repérer l’excès d’eau, mais le risque de gel dépend de la température au niveau des tuyaux. Utilisez une sonde étanche et un seuil quelques degrés au-dessus de 0 °C (32 °F).",
      },
    ],
  },
  "detached-garage-winter": {
    headline: "Scénario : chauffage d’un atelier indépendant",
    title: "Une alerte météo, puis un chauffage qui disjoncte",
    description:
      "Scénario : par une nuit froide annoncée, le chauffage d’un atelier disjoncte. L’alerte météo couvre la veille, l’alerte de seuil la nuit même.",
    setting: "Atelier indépendant avec évier utilitaire",
    setup: [
      "ESP32 en Wi-Fi au-dessus de l’évier ; seconde sonde près de la porte sectionnelle",
      "Alertes de gel selon les prévisions (Member) et e-mail",
      "Mode vacances désactivé avant un voyage pour que les alertes continuent d’arriver",
    ],
    timeline: [
      { time: "Mercredi", detail: "Une alerte météo signale le minimum de la nuit de jeudi ; le propriétaire vérifie que le chauffage est allumé." },
      { time: "Jeu. 1 h 50", detail: "Le chauffage fait sauter le différentiel ; l’atelier passe sous 1 °C (34 °F) et l’e-mail part." },
      { time: "Jeu. 2 h 15", detail: "Le propriétaire réarme le circuit via une prise connectée avant que la conduite de l’évier ne gèle." },
    ],
    outcome:
      "Les bâtiments indépendants perdent vite leur chaleur. L’alerte météo couvre le temps de l’anticipation ; l’alerte de seuil couvre la panne elle-même.",
    faqs: [
      {
        question: "Un garage indépendant a-t-il besoin de deux sondes ?",
        answer:
          "Une près des tuyaux ou de l’évier suffit pour commencer. Une seconde près de la porte repère les courants d’air que le mur du fond ne voit jamais.",
      },
      {
        question: "L’offre Free suffit-elle pour un atelier indépendant ?",
        answer:
          "Les alertes e-mail de l’offre Free fonctionnent. Member ajoute les alertes selon les prévisions, utiles quand vous êtes absent et voulez être prévenu avant le minimum de la nuit.",
      },
    ],
  },
  "water-heater-pad-leak": {
    headline: "Scénario : fuite du chauffe-eau",
    title: "Le chauffe-eau goutte à 3 h du matin",
    description:
      "Scénario : la vanne de vidange du chauffe-eau du garage goutte la nuit. Un contact d’inondation dans le bac vous alerte avant que le sol soit trempé.",
    setting: "Garage avec chauffe-eau et rangement",
    setup: [
      "L’ESP32 qui envoie déjà la température du garage ; un contact sec/mouillé ajouté dans le bac du chauffe-eau",
      "Type d’ingest flood : alerte automatique dès qu’il est mouillé, sans règle personnalisée",
      "E-mail et SMS (Pro) ; le seuil de gel continue de surveiller le même espace",
    ],
    timeline: [
      { time: "3 h 08", detail: "Le contact d’inondation signale de l’eau ; SMS et e-mail partent alors que le mode vacances est activé." },
      { time: "3 h 20", detail: "Un voisin qui a le lien en direct familial passe voir et trouve une goutte à la vanne de vidange." },
      { time: "Le matin", detail: "Un plombier resserre la vanne alors que le sol est encore presque sec." },
    ],
    outcome:
      "Les fuites n’attendent pas le gel. Les contacts d’inondation partagent le même appareil et le même circuit d’ingest, et les alertes d’eau passent même quand le mode vacances fait taire les alertes de routine.",
    faqs: [
      {
        question: "Les alertes d’inondation demandent-elles une règle personnalisée ?",
        answer:
          "Non. Avec les alertes activées, les contacts d’inondation ou de fuite mouillés préviennent automatiquement. N’utilisez une règle que pour combiner l’inondation avec des conditions de porte ou de température.",
      },
      {
        question: "Où placer le contact ?",
        answer:
          "Au fond du bac, à l’écart des gouttes de condensation normales. Testez avec un chiffon humide, puis séchez-le pour qu’il ne reste pas en état mouillé.",
      },
    ],
  },
} satisfies StoryOverlay;

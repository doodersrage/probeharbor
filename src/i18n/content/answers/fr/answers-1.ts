import type { AnswerOverlay } from "../index";

export default {
  "garage-pipe-freeze-temperature": {
    question: "À quelle température les tuyaux gèlent-ils dans un garage ?",
    description:
      "L’eau gèle à 0 °C (32 °F), mais les tuyaux du garage gèlent plutôt vers -7 °C (20 °F) dehors. Pourquoi, ce qui accélère le gel et où régler l’alerte.",
    shortAnswer:
      "L’eau gèle à 0 °C (32 °F), mais les tuyaux gèlent rarement dès que l’air atteint 0 °C. Des recherches de l’Université de l’Illinois ont montré que les tuyaux non isolés dans les locaux non chauffés commencent à geler quand il fait environ -7 °C (20 °F) dehors, et un garage reste généralement quelques degrés plus chaud que l’extérieur. Ce qui compte, c’est la température au niveau du tuyau : réglez-y une alerte entre 1 et 3 °C (34–38 °F) pour avoir le temps d’agir.",
    sections: [
      {
        heading: "Pourquoi 0 °C ne dit pas tout",
        paragraphs: [
          "Un tuyau doit perdre de la chaleur pendant un certain temps avant que l’eau qu’il contient gèle, et l’eau peut descendre de quelques degrés sous 0 °C (32 °F) avant que la glace se forme. Les brèves incursions sous zéro passent souvent sans dégâts ; une longue nuit glaciale, non.",
          "L’éclatement ne se produit généralement pas là où la glace se forme. La glace bouche le tuyau, et la pression monte entre ce bouchon et un robinet fermé jusqu’à ce que le tuyau se fende à cet endroit.",
        ],
      },
      {
        heading: "Ce qui fait geler plus tôt les tuyaux du garage",
        paragraphs: [
          "Les tuyaux le long des murs extérieurs, près de la porte basculante ou dans des recoins exposés aux courants d’air deviennent bien plus froids que le centre du garage. Le vent qui s’infiltre par les interstices peut faire geler un tuyau exposé même quand il fait plus de -7 °C (20 °F) dehors.",
          "Une porte de garage ouverte ou mal étanche, un chauffage qui fait disjoncter et l’absence d’isolant sur les tuyaux sont les causes habituelles quand un tuyau gèle dans un garage.",
        ],
      },
      {
        heading: "Comment le savoir avant que ça arrive",
        paragraphs: [
          "Mesurez au niveau du tuyau, pas au milieu de la pièce : une sonde étanche (comme une DS18B20) plaquée contre la portion de tuyau la plus froide vous indique ce que subit réellement le tuyau.",
          "Réglez l’alerte quelques degrés au-dessus de 0 °C pour avoir le temps de fermer une porte, de relancer un chauffage ou d’ouvrir un robinet. Une alerte météo la veille d’un fort gel vous donne encore plus d’avance.",
        ],
      },
    ],
    faqs: [
      {
        question: "Les tuyaux peuvent-ils geler à 0 °C (32 °F) ?",
        answer:
          "Oui, si le tuyau lui-même reste à 0 °C ou moins assez longtemps, surtout avec du vent ou sans isolant. La plupart des gels surviennent lors de longues nuits bien en dessous de zéro, c’est pourquoi le seuil extérieur de -7 °C (20 °F) est un signal d’alerte utile.",
      },
      {
        question: "Un garage attenant protège-t-il les tuyaux du gel ?",
        answer:
          "Pas de façon fiable. Les garages attenants sont souvent non chauffés, et leurs murs extérieurs et leurs portes peuvent devenir presque aussi froids que l’extérieur par une nuit venteuse.",
      },
      {
        question: "À quelle température maintenir un garage pour protéger les tuyaux ?",
        answer:
          "L’objectif est de garder l’air autour des tuyaux au-dessus de zéro ; beaucoup visent 4 °C (40 °F) ou plus dans un garage avec de la plomberie et déclenchent une alerte quand la température descend vers 1–3 °C (34–38 °F).",
      },
    ],
    related: [
      { label: "Mes tuyaux vont-ils geler cette nuit ? (prévisions)" },
      { label: "À quelle température régler une alarme antigel ?" },
      { label: "Combien de temps faut-il pour que les tuyaux gèlent ?" },
      { label: "Liste des pièces du kit antigel ESP32" },
      { label: "Scénario : panne du chauffage du garage" },
    ],
    sources: [
      { label: "At what temperature do pipes freeze? (KXAN, citant des recherches de l’Université de l’Illinois)" },
      { label: "How pipes freeze and burst (Farm Bureau Insurance)" },
    ],
  },
  "freeze-alarm-temperature-setting": {
    question: "À quelle température régler une alarme antigel ?",
    description:
      "Réglez l’alarme antigel entre 1 et 3 °C (34–38 °F) mesurés au tuyau. Quand descendre ou monter, et comment éviter les fausses alertes sans perdre de temps.",
    shortAnswer:
      "Réglez-la entre 1 et 3 °C (34–38 °F) si le capteur est sur le tuyau ou juste à côté. Rapprochez-vous de 1 °C (34 °F) si vous pouvez intervenir en moins d’une heure ; montez vers 3–4 °C (38–40 °F) si le capteur mesure l’air de la pièce loin des tuyaux ou s’il vous faut des heures pour vous rendre sur place, comme pour un chalet inoccupé.",
    sections: [
      {
        heading: "Le compromis : délai d’alerte contre fausses alertes",
        paragraphs: [
          "Un seuil plus élevé vous laisse plus de temps, mais se déclenche par des nuits froides où tout va bien. Un seuil plus bas est plus discret, mais laisse moins de temps entre l’alerte et un tuyau gelé.",
          "Commencez à 2 °C (36 °F). Si l’alerte se déclenche lors de nuits ordinaires, rapprochez la sonde du tuyau avant de baisser le seuil : c’est la mesure au niveau du tuyau qui compte.",
        ],
      },
      {
        heading: "Adaptez-le à votre éloignement",
        paragraphs: [
          "Chez vous, 1–2 °C (34–36 °F) suffit généralement : vous pouvez fermer une porte ou relancer un chauffage en quelques minutes.",
          "Pour un chalet, un logement loué ou une maison inoccupée, choisissez 3–4 °C (38–40 °F) et ajoutez une deuxième personne capable d’intervenir, car quelqu’un devra prendre la voiture.",
        ],
      },
      {
        heading: "Ajoutez une alerte météo",
        paragraphs: [
          "Une alerte de seuil vous dit qu’il fait froid maintenant. Une alerte basée sur les prévisions vous prévient la veille que la nuit sera dangereuse : c’est le moment de vérifier le chauffage et de tout fermer.",
        ],
      },
    ],
    faqs: [
      {
        question: "0 °C (32 °F) est-il un bon réglage pour une alarme antigel ?",
        answer:
          "C’est trop tard dans la plupart des installations. Quand l’air près du capteur affiche 0 °C, un tuyau plus froid ailleurs est peut-être déjà en train de geler, et il ne vous reste plus de temps pour réagir.",
      },
      {
        question: "Pourquoi mon alarme antigel se déclenche-t-elle alors que tout va bien ?",
        answer:
          "En général, le capteur est près d’une porte, d’une fenêtre ou d’une bouche d’aération qui se refroidit davantage que les tuyaux. Déplacez-le à côté du tuyau qui vous importe, ou ajoutez un court délai pour que les baisses passagères ne déclenchent pas d’alerte.",
      },
    ],
    related: [
      { label: "À quelle température les tuyaux gèlent-ils dans un garage ?" },
      { label: "Où placer une sonde antigel dans un vide sanitaire ?" },
      { label: "Check-list de la saison du gel" },
    ],
  },
  "crawlspace-freeze-sensor-placement": {
    question: "Où placer une sonde antigel dans un vide sanitaire ?",
    description:
      "Placez la sonde sur la conduite d’eau la plus froide du vide sanitaire, souvent près des aérations ou de l’entrée des tuyaux, pas à la trappe. Comment la fixer.",
    shortAnswer:
      "Sur la conduite d’alimentation en eau la plus froide ou juste à côté, pas à la trappe d’accès. C’est généralement près d’une grille d’aération des fondations, le long de la lisse périphérique du côté exposé au vent, ou là où la conduite traverse les fondations. Une sonde étanche fixée au tuyau avec du ruban adhésif mesure ce que le tuyau ressent vraiment.",
    sections: [
      {
        heading: "Trouvez le tuyau le plus froid",
        paragraphs: [
          "L’air froid entre par les aérations, les interstices au niveau de la lisse périphérique et autour du passage du tuyau. La conduite d’alimentation la plus proche de ces points gèle en premier.",
          "En cas de doute, installez deux sondes pendant une semaine et comparez-les par une nuit froide : celle qui baisse en premier indique l’emplacement de la sonde.",
        ],
      },
      {
        heading: "Comment la fixer",
        paragraphs: [
          "Utilisez une sonde étanche sur câble, comme une DS18B20. Fixez-la au tuyau avec du ruban adhésif et remettez l’isolant du tuyau par-dessus pour qu’elle mesure le tuyau et non l’air.",
          "Gardez la carte et l’alimentation hors du sol, dans un endroit sec : les vides sanitaires sont humides. Une deuxième sonde à l’air libre apporte un repère utile.",
        ],
      },
      {
        heading: "Ajoutez un détecteur de fuite pendant que vous y êtes",
        paragraphs: [
          "Un contact sec/mouillé posé au sol sous la conduite principale détecte une fuite lente ou un dégel après un gel, moment où les dégâts apparaissent souvent.",
        ],
      },
    ],
    faqs: [
      {
        question: "Un capteur d’humidité dans le vide sanitaire suffit-il pour détecter le gel ?",
        answer:
          "Non. L’humidité aide à repérer les problèmes d’humidité, mais le risque de gel dépend de la température au niveau du tuyau. Utilisez une sonde de température sur le tuyau.",
      },
      {
        question: "Faut-il fermer les aérations du vide sanitaire en hiver ?",
        answer:
          "Dans les climats où il gèle, beaucoup de propriétaires ferment ou couvrent les aérations des fondations pendant l’hiver pour éloigner l’air froid des tuyaux. Une aération bloquée en position ouverte est une cause fréquente de gel dans les vides sanitaires.",
      },
    ],
    related: [
      { label: "Scénario : l’aération du vide sanitaire" },
      { label: "DS18B20 ou DHT22 : quel capteur choisir pour surveiller le gel ?" },
      { label: "À quelle température régler une alarme antigel ?" },
      { label: "Liste des pièces du kit antigel ESP32" },
    ],
  },
  "home-assistant-freeze-alert": {
    question: "Comment créer une alerte gel dans Home Assistant ?",
    description:
      "Une alerte gel dans Home Assistant tient en une automatisation : si un capteur reste sous 2 °C (35 °F) 10 minutes, notifiez votre téléphone. YAML fourni.",
    shortAnswer:
      "Créez une automatisation avec un déclencheur d’état numérique sur votre capteur de température, en dessous de 2 °C (35 °F) pendant 10 minutes, et une action de notification vers votre téléphone. Le hic : si Home Assistant ou votre connexion internet tombe, l’alerte ne part jamais. Associez-la donc à un service qui remarque quand les relevés cessent d’arriver.",
    sections: [
      {
        heading: "L’automatisation",
        paragraphs: [
          "Remplacez le capteur et le service de notification par les vôtres. Le délai de 10 minutes évite qu’un bref courant d’air déclenche une alerte. L’exemple suppose que Home Assistant est réglé en °F ; en Celsius, utilisez environ 2 °C.",
        ],
      },
      {
        heading: "Le point faible : quand c’est Home Assistant qui tombe en panne",
        paragraphs: [
          "Une coupure de courant ou d’internet est souvent ce qui laisse un local se refroidir, et elle met aussi Home Assistant ou sa connexion hors ligne. L’automatisation ne peut pas vous prévenir de la panne qui la neutralise.",
          "Un service externe comble cette lacune. ProbeHarbor, par exemple, peut recevoir les mêmes relevés depuis Home Assistant et vous alerte à la fois quand il fait froid et quand les relevés n’arrivent plus. Dans Devices → Setup, choisir Home Assistant génère le YAML avec votre clé.",
        ],
      },
    ],
    faqs: [
      {
        question: "Home Assistant peut-il envoyer un SMS pour une alerte gel ?",
        answer:
          "Oui, via une intégration de notification pour un fournisseur de SMS comme Twilio, ou via l’application compagnon pour les notifications push.",
      },
      {
        question: "Quel capteur utiliser avec Home Assistant pour les alertes gel ?",
        answer:
          "N’importe quel capteur de température proche des tuyaux convient : ESPHome avec une DS18B20, un capteur Zigbee ou un capteur Wi-Fi doté d’une intégration. L’emplacement près du tuyau le plus froid compte davantage que la marque.",
      },
    ],
    related: [
      { label: "Intégration ProbeHarbor pour Home Assistant" },
      { label: "Comment créer une alerte gel avec ESPHome ?" },
      { label: "Une alarme antigel Wi-Fi fonctionne-t-elle pendant une coupure de courant ?" },
      { label: "À quelle température régler une alarme antigel ?" },
      { label: "Passerelle MQTT" },
    ],
  },
  "freeze-alarm-without-subscription": {
    question: "Peut-on avoir une alarme antigel sans abonnement mensuel ?",
    description:
      "Oui. Temp Stick, Govee, Home Assistant et l’offre gratuite de ProbeHarbor alertent sans abonnement. Ce que coûte chaque option et ce que vous sacrifiez.",
    shortAnswer:
      "Oui. Temp Stick vend des capteurs prêts à l’emploi (à partir de 149 $ US) avec alertes gratuites par SMS, e-mail et application. Les capteurs Wi-Fi de Govee (environ 35–50 $ US avec la passerelle) envoient des alertes dans l’application. Home Assistant est gratuit si vous l’hébergez vous-même, et l’offre gratuite de ProbeHarbor envoie des alertes par e-mail et messagerie depuis un capteur fait maison. Les SMS sur ProbeHarbor nécessitent l’offre Pro.",
    sections: [
      {
        heading: "Les options",
        paragraphs: [
          "Temp Stick : un capteur Wi-Fi sur batterie prêt à l’emploi. Le plus cher par capteur, mais sans installation ni frais, et les alertes SMS sont incluses.",
          "Govee : une passerelle Wi-Fi et des capteurs bon marché avec notifications dans l’application. Convient pour une pièce ; vérifiez que les alertes vous parviennent de façon fiable quand vous n’êtes pas chez vous.",
          "Home Assistant : gratuit et flexible si vous l’utilisez déjà, mais il dépend de votre connexion internet et de votre alimentation électrique (voir la réponse sur l’alerte gel dans Home Assistant).",
          "ProbeHarbor : environ 25 $ US de pièces DIY par sonde, alertes gratuites par e-mail, messagerie et push, détecteurs de fuite et historique. Les SMS et un historique plus long sont dans les offres payantes.",
        ],
      },
      {
        heading: "Les critères à peser",
        paragraphs: [
          "Installation : les capteurs prêts à l’emploi l’emportent. Coût par zone : les sondes DIY gagnent dès que vous en voulez plusieurs. Être réveillé la nuit : un SMS ou une notification push compte plus qu’un e-mail, vérifiez donc quelle offre l’inclut.",
        ],
      },
    ],
    faqs: [
      {
        question: "Temp Stick facture-t-il un abonnement mensuel ?",
        answer:
          "Non. Selon Temp Stick, la surveillance, l’historique des données et les alertes par SMS, e-mail et application sont gratuits pendant toute la durée de vie du capteur.",
      },
      {
        question: "ProbeHarbor est-il gratuit ?",
        answer:
          "Il existe une offre gratuite avec alertes par e-mail et messagerie, une semaine d’historique et jusqu’à deux appareils. Member et Pro ajoutent un historique plus long, l’export CSV, les alertes météo et les SMS.",
      },
    ],
    related: [
      { label: "ProbeHarbor ou Temp Stick" },
      { label: "ProbeHarbor ou Govee" },
      { label: "Offres et tarifs" },
    ],
    sources: [
      { label: "Temp Stick : questions fréquentes" },
      { label: "GoveeLife Smart Thermometer R1" },
    ],
  },
  "how-long-for-pipes-to-freeze": {
    question: "Combien de temps faut-il pour que les tuyaux gèlent ?",
    description:
      "Pas de chiffre fixe : il faut des heures de froid, souvent vers -7 °C (20 °F) dehors ou moins. Ce qui accélère le gel et comment l’anticiper.",
    shortAnswer:
      "Il n’y a pas de chiffre unique. Les tuyaux gèlent après des heures de froid persistant, pas dès que l’on atteint 0 °C (32 °F), et des recherches de terrain ont montré que les tuyaux non isolés dans les locaux non chauffés commencent à geler à partir d’environ -7 °C (20 °F) dehors. Le vent, les courants d’air et l’absence d’isolant raccourcissent ce délai ; un bref passage sous zéro passe généralement sans dégâts. La vitesse à laquelle baisse la température au niveau du tuyau en dit plus que n’importe quelle règle empirique.",
    sections: [
      {
        heading: "Ce qui détermine la vitesse de gel d’un tuyau",
        paragraphs: [
          "Le froid et sa durée : une longue nuit entre -12 et -7 °C (10 à 19 °F) est bien plus dangereuse qu’une heure à -1 °C (30 °F).",
          "Les mouvements d’air : des recherches de l’Université de l’Illinois ont montré que le vent et les courants d’air passant par les interstices d’un mur jouent un rôle majeur dans la formation rapide du bouchon de glace ; un tuyau exposé dans un coin plein de courants d’air peut donc geler même quand il fait plus de -7 °C (20 °F) dehors.",
          "L’isolation, le diamètre du tuyau et la circulation de l’eau : un petit tuyau nu rempli d’eau immobile gèle en premier.",
        ],
      },
      {
        heading: "Estimez-le à partir de la vitesse de refroidissement",
        paragraphs: [
          "Si l’air au niveau du tuyau est à 7 °C (44 °F) et baisse de 1,1 °C (2 °F) par heure, il atteint 1 °C (34 °F) en cinq heures environ. Cette estimation simple, recalculée à chaque nouveau relevé, est plus utile qu’un chiffre générique, car elle reflète votre local cette nuit-là.",
          "ProbeHarbor l’affiche sous forme de compte à rebours avant le gel, dans toutes les offres : le nombre d’heures avant d’atteindre votre seuil de gel au rythme de refroidissement actuel.",
        ],
      },
      {
        heading: "Que faire du temps dont vous disposez",
        paragraphs: [
          "Fermez la porte du garage, rétablissez le chauffage, ouvrez les portes des meubles sous les éviers et laissez goutter un robinet sur la conduite exposée. Si vous êtes absent, c’est là qu’un voisin qui a la clé fait toute la différence.",
        ],
      },
    ],
    faqs: [
      {
        question: "Les tuyaux peuvent-ils geler en une seule nuit ?",
        answer:
          "Oui. Une seule longue nuit avec des températures extérieures sous -7 °C (20 °F) suffit pour un tuyau non isolé dans un garage, un vide sanitaire ou des combles non chauffés.",
      },
      {
        question: "Les tuyaux gèlent-ils plus vite quand il y a du vent ?",
        answer:
          "Oui. L’air en mouvement arrache la chaleur d’un tuyau bien plus vite que l’air immobile ; c’est pourquoi les tuyaux proches des aérations, des jours sous les portes et des fissures des murs extérieurs gèlent en premier.",
      },
    ],
    related: [
      { label: "Mes tuyaux vont-ils geler cette nuit ? (prévisions)" },
      { label: "À quelle température les tuyaux gèlent-ils dans un garage ?" },
      { label: "Calculateur du temps de gel des tuyaux" },
      { label: "Le temps avant le gel, expliqué" },
      { label: "Faut-il laisser goutter les robinets pour éviter le gel des tuyaux ?" },
    ],
    sources: [
      { label: "How pipes freeze and burst (Farm Bureau Insurance, citant des recherches de l’Université de l’Illinois)" },
    ],
  },
  "vacant-house-winter-thermostat-setting": {
    question: "À quelle température laisser sa maison en hiver quand on s’absente ?",
    description:
      "Laissez le chauffage à 13 °C (55 °F) minimum, selon la Croix-Rouge américaine. Pourquoi ce n’est pas une garantie, et comment savoir si le chauffage lâche.",
    shortAnswer:
      "Laissez le chauffage allumé, réglé à 13 °C (55 °F) minimum : c’est la recommandation de la Croix-Rouge américaine pour s’absenter par temps froid. Mais le thermostat ne renseigne que sur la pièce où il se trouve. Les tuyaux d’un garage, d’un vide sanitaire ou d’un mur extérieur peuvent être bien plus froids, et le réglage ne sert à rien si la chaudière ou l’électricité tombe en panne : il faut que quelqu’un ou quelque chose surveille.",
    sections: [
      {
        heading: "Pourquoi 13 °C et pas moins",
        paragraphs: [
          "La maison perd sa chaleur par ses parois. Avec les pièces à vivre à 13 °C (55 °F), les tuyaux des murs extérieurs et des zones non chauffées gardent une petite marge au-dessus de zéro. Réglez-le à 7 °C (45 °F) et cette marge disparaît par une nuit très froide et venteuse.",
          "Avant de partir, ouvrez les portes des meubles sous les éviers de la cuisine et de la salle de bains pour que l’air plus chaud de la pièce atteigne la plomberie, et gardez la porte du garage fermée si des conduites d’eau y passent.",
        ],
      },
      {
        heading: "Le réglage ne sert à rien si le chauffage s’arrête",
        paragraphs: [
          "Une chaudière en sécurité, une cuve de propane ou de fioul vide ou une coupure de courant laissent la maison se refroidir jusqu’à la température extérieure, quoi qu’indique le thermostat.",
          "Placez un capteur de température là où passent les tuyaux, réglez l’alerte à 3–4 °C (38–40 °F) pour laisser à quelqu’un le temps d’arriver, et assurez-vous qu’une deuxième personne reçoive l’alerte. Une alerte qui se déclenche quand le capteur cesse d’émettre couvre les coupures de courant et d’internet.",
        ],
      },
      {
        heading: "Pour une longue absence",
        paragraphs: [
          "Si la maison doit rester vide plusieurs semaines, couper l’eau au compteur et vidanger les canalisations élimine l’essentiel du risque ; un plombier peut faire la mise hors gel dans les règles. Laissez quand même le chauffage pour protéger le bâtiment et tout ce qui ne peut pas être vidangé.",
        ],
      },
    ],
    faqs: [
      {
        question: "10 °C (50 °F) suffisent-ils pour éviter le gel des tuyaux ?",
        answer:
          "Souvent, mais cela laisse moins de marge que les 13 °C (55 °F) recommandés par la Croix-Rouge américaine. Plus le climat est froid et plus il y a de plomberie dans les murs extérieurs ou les zones non chauffées, plus cette marge compte.",
      },
      {
        question: "Faut-il couper le chauffage pour économiser pendant son absence ?",
        answer:
          "Non, pas quand il gèle. La Croix-Rouge conseille de laisser le chauffage allumé ; un tuyau éclaté coûte bien plus cher que la facture de chauffage.",
      },
    ],
    related: [
      { label: "Comment surveiller à distance la température d’un chalet ?" },
      { label: "À quelle température régler une alarme antigel ?" },
      { label: "Check-list de la saison du gel" },
    ],
    sources: [
      { label: "Frozen pipes: prevention and thawing (Croix-Rouge américaine)" },
    ],
  },
  "drip-faucets-to-prevent-frozen-pipes": {
    question: "Faut-il laisser goutter les robinets pour éviter le gel des tuyaux ?",
    description:
      "Oui, par grand froid : laissez goutter l’eau froide des robinets alimentés par des tuyaux exposés. Lesquels, quel débit, et ce qu’un filet d’eau ne fait pas.",
    shortAnswer:
      "Oui. Par grand froid, laissez goutter l’eau froide des robinets alimentés par des tuyaux exposés ; la Croix-Rouge américaine note que l’eau qui coule, même en filet, aide à empêcher les tuyaux de geler. Cela ne concerne que les robinets alimentés par des tuyaux qui traversent des zones non chauffées ou des murs extérieurs, pas tous les robinets de la maison.",
    sections: [
      {
        heading: "Pourquoi un filet d’eau aide",
        paragraphs: [
          "L’eau en mouvement amène de l’eau plus chaude du réseau dans la portion froide du tuyau, ce qui ralentit le gel.",
          "Elle soulage aussi la pression. Les tuyaux éclatent généralement parce que la glace bouche la conduite et que la pression monte entre ce bouchon et un robinet fermé. Un robinet ouvert donne à cette pression une échappatoire.",
        ],
      },
      {
        heading: "Quels robinets, et quel débit",
        paragraphs: [
          "Choisissez les robinets situés au bout des conduites qui traversent un garage, un vide sanitaire, des combles ou un mur extérieur. Un goutte-à-goutte régulier ou un filet de l’épaisseur d’une mine de crayon suffit.",
          "Si un robinet a des arrivées d’eau chaude et d’eau froide séparées qui passent toutes deux par la zone froide, ouvrez légèrement les deux.",
        ],
      },
      {
        heading: "Ce qu’un filet d’eau ne fait pas",
        paragraphs: [
          "Il ne sauvera pas un tuyau dans un local qui reste bien en dessous de zéro pendant des jours, et il ne sert à rien quand vous êtes absent sans personne pour ouvrir le robinet. Les vraies solutions sont d’isoler le tuyau, de calfeutrer les courants d’air et de maintenir le local au-dessus de zéro ; une alerte de température vous indique quand il est temps d’ouvrir le robinet.",
        ],
      },
    ],
    faqs: [
      {
        question: "À partir de quelle température faut-il laisser goutter les robinets ?",
        answer:
          "Un repère courant est une minimale prévue d’environ -7 °C (20 °F) ou moins, seuil auquel les recherches ont montré que les tuyaux non isolés dans les locaux non chauffés commencent à geler. Commencez plus tôt si le tuyau est exposé aux courants d’air.",
      },
      {
        question: "Laisser goutter les robinets gaspille-t-il beaucoup d’eau ?",
        answer:
          "Un goutte-à-goutte lent consomme peu d’eau, et il n’est nécessaire que les quelques nuits assez froides pour menacer le tuyau. C’est peu de chose comparé au coût d’un tuyau éclaté.",
      },
    ],
    related: [
      { label: "Mes tuyaux vont-ils geler cette nuit ? (prévisions)" },
      { label: "Combien de temps faut-il pour que les tuyaux gèlent ?" },
      { label: "Comment dégeler un tuyau gelé en toute sécurité ?" },
      { label: "Plan d’action en cas de vague de froid" },
    ],
    sources: [
      { label: "Frozen pipes: prevention and thawing (Croix-Rouge américaine)" },
      { label: "How pipes freeze and burst (Farm Bureau Insurance)" },
    ],
  },
} satisfies AnswerOverlay;

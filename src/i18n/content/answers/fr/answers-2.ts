import type { AnswerOverlay } from "../index";

export default {
  "how-to-thaw-frozen-pipes": {
    question: "Comment dégeler un tuyau gelé en toute sécurité ?",
    description:
      "Robinet ouvert, chauffez le tuyau au sèche-cheveux, au coussin chauffant ou avec des serviettes chaudes. Jamais de flamme. Étapes, et quand appeler un plombier.",
    shortAnswer:
      "Laissez le robinet ouvert, puis réchauffez la portion gelée avec un sèche-cheveux électrique, un coussin chauffant électrique, un radiateur d’appoint tenu à l’écart de tout ce qui est inflammable, ou des serviettes trempées dans de l’eau chaude. N’utilisez jamais de chalumeau ni aucune flamme nue. Continuez à chauffer jusqu’au retour d’une pression d’eau normale, et appelez un plombier qualifié si vous ne trouvez pas la portion gelée ou ne pouvez pas l’atteindre. Ces étapes suivent les recommandations de la Croix-Rouge américaine.",
    sections: [
      {
        heading: "Trouvez la portion gelée",
        paragraphs: [
          "Si un robinet ne donne qu’un filet d’eau par temps froid, soupçonnez un tuyau gelé. Les endroits les plus probables sont le long des murs extérieurs et là où l’arrivée d’eau entre dans la maison à travers les fondations.",
          "Vérifiez aussi les autres robinets. Si un tuyau a gelé, d’autres ont peut-être gelé aussi.",
        ],
      },
      {
        heading: "Dégelez-le",
        paragraphs: [
          "Laissez le robinet ouvert. À mesure que la glace fond, l’eau recommence à couler, et l’eau qui coule aide à faire fondre le reste.",
          "Chauffez doucement le tuyau : un sèche-cheveux, un coussin chauffant électrique enroulé autour, un radiateur d’appoint portable ou des serviettes mouillées d’eau chaude. N’utilisez pas de chalumeau, de poêle à pétrole ou au propane, de réchaud à charbon ni aucune autre flamme nue.",
        ],
      },
      {
        heading: "Surveillez les fuites pendant le dégel",
        paragraphs: [
          "Un tuyau qui s’est fendu en gelant ne fuit souvent qu’une fois la glace fondue. Repérez votre robinet d’arrêt général avant de commencer, et inspectez le tuyau dès que l’eau circule.",
          "C’est là qu’un détecteur de fuite posé au sol sous la portion vulnérable fait ses preuves : l’alerte gel vous prévient du froid, l’alerte fuite vous prévient du dégel.",
        ],
      },
    ],
    faqs: [
      {
        question: "Un tuyau gelé dégèle-t-il tout seul ?",
        answer:
          "Oui, à terme, une fois que le local se réchauffe, mais attendre laisse la pression dans la conduite et vous ne serez peut-être pas là quand un tuyau fendu commencera à fuir. Le dégeler volontairement, robinet ouvert, est plus sûr.",
      },
      {
        question: "Un tuyau gelé éclate-t-il toujours ?",
        answer:
          "Non. Beaucoup de tuyaux gelés dégèlent sans dégâts. Le risque vient de la pression piégée entre la glace et un robinet fermé : c’est pourquoi le robinet doit rester ouvert.",
      },
    ],
    related: [
      { label: "Plan d’action contre les dégâts des eaux après gel et dégel" },
      { label: "Où placer les détecteurs de fuite d’eau ?" },
      { label: "Faut-il laisser goutter les robinets pour éviter le gel des tuyaux ?" },
    ],
    sources: [
      { label: "Frozen pipes: prevention and thawing (Croix-Rouge américaine)" },
      { label: "How pipes freeze and burst (Farm Bureau Insurance)" },
    ],
  },
  "wifi-freeze-alarm-power-outage": {
    question: "Une alarme antigel Wi-Fi fonctionne-t-elle pendant une coupure de courant ?",
    description:
      "En général non : une coupure éteint la box même si le capteur a des piles. Alertes de silence, onduleur, capteurs cellulaires : comment combler la faille.",
    shortAnswer:
      "En général, non. Même un capteur sur piles a besoin de votre box et de votre modem, qui s’éteignent avec le courant. La solution : un service qui vous alerte quand le capteur se tait, car en hiver le silence est en soi un avertissement : la coupure qui a interrompu les relevés a probablement aussi arrêté le chauffage.",
    sections: [
      {
        heading: "Pourquoi l’alarme se tait au moment où vous en avez besoin",
        paragraphs: [
          "Une alerte gel part du capteur, passe par votre Wi-Fi et votre connexion internet, puis arrive à un serveur qui envoie le message. Une coupure de courant rompt cette chaîne au niveau de la box, et la chaudière a elle aussi besoin d’électricité : la maison commence donc à se refroidir au moment même où l’alarme cesse d’émettre.",
          "Tout ce qui fonctionne uniquement à l’intérieur de la maison, y compris une automatisation Home Assistant, présente le même point faible.",
        ],
      },
      {
        heading: "Trois façons de s’en prémunir",
        paragraphs: [
          "Alerter sur le silence. Un service hébergé peut remarquer que les relevés se sont arrêtés et vous prévenir. ProbeHarbor propose une alerte de panne qui se déclenche quand un appareil est resté muet pendant un nombre d’heures défini (deux par défaut).",
          "Maintenir le réseau. Un petit onduleur sur le modem, la box et le capteur assure la transmission des relevés pendant les coupures brèves, à condition que l’équipement de votre fournisseur d’accès à l’extérieur de la maison reste alimenté.",
          "Se passer du réseau domestique. Un capteur cellulaire sur batterie transmet sans Wi-Fi. Il coûte plus cher et nécessite un forfait de données, mais c’est le bon choix pour un chalet ou une maison souvent privée de courant.",
        ],
      },
      {
        heading: "Qui reçoit le message",
        paragraphs: [
          "Une coupure touche souvent tout le quartier, y compris le Wi-Fi de votre propre téléphone. Envoyez les alertes par SMS ou push en plus de l’e-mail, et ajoutez une deuxième personne capable d’aller vérifier la maison.",
        ],
      },
    ],
    faqs: [
      {
        question: "Les capteurs de température Wi-Fi sur piles fonctionnent-ils sans courant ?",
        answer:
          "Le capteur continue de mesurer, mais il ne peut rien envoyer tant que la box et la connexion internet ne sont pas rétablies. Certains stockent les relevés et les transmettent plus tard, ce qui aide pour l’historique mais pas pour l’alerte.",
      },
      {
        question: "Combien de temps met une maison à se refroidir après une coupure de courant ?",
        answer:
          "Cela dépend de l’isolation et du froid extérieur. Un capteur qui transmettait jusqu’à la coupure vous donne la dernière température connue et la vitesse de refroidissement, une base raisonnable pour décider de l’urgence d’envoyer quelqu’un sur place.",
      },
    ],
    related: [
      { label: "Comment surveiller à distance la température d’un chalet ?" },
      { label: "Transmission cellulaire (Particle Boron)" },
      { label: "Comment créer une alerte gel dans Home Assistant ?" },
    ],
  },
  "remote-cabin-temperature-monitoring": {
    question: "Comment surveiller à distance la température d’un chalet ?",
    description:
      "Avec internet au chalet, un capteur Wi-Fi qui alerte votre téléphone. Sans internet, un capteur cellulaire. Quoi mesurer, où, et qui doit recevoir l’alerte.",
    shortAnswer:
      "Si le chalet a internet, installez un capteur de température Wi-Fi près de la plomberie et faites-le alerter votre téléphone. Sinon, utilisez un capteur cellulaire doté de sa propre connexion de données. Dans les deux cas, alertez tôt (3–4 °C / 38–40 °F), alertez quand le capteur cesse d’émettre, et incluez quelqu’un qui habite assez près pour s’y rendre.",
    sections: [
      {
        heading: "Choisissez d’abord la connexion",
        paragraphs: [
          "Wi-Fi : la solution la moins chère si le chalet garde une connexion internet tout l’hiver. Un capteur prêt à l’emploi comme le Temp Stick fonctionne dès la sortie de la boîte ; une sonde ESP32 DIY coûte environ 25 $ US de pièces et transmet à un service comme ProbeHarbor.",
          "Cellulaire : pour les chalets sans internet ou à l’alimentation électrique peu fiable. Une carte cellulaire secourue par batterie (ProbeHarbor propose un sketch pour la Particle Boron) envoie les relevés via le réseau mobile.",
        ],
      },
      {
        heading: "Quoi mesurer",
        paragraphs: [
          "Mesurez au niveau des tuyaux, pas seulement dans le séjour : la zone de la pompe ou du réservoir sous pression, le vide sanitaire et le mur le plus froid de la salle de bains ou de la cuisine. Un détecteur de fuite au sol près du chauffe-eau ou de la pompe repère le dégel après un gel.",
          "Ajoutez une alerte en cas d’arrêt des relevés. Dans un chalet inoccupé, un capteur muet signifie généralement que le courant ou internet est coupé, et le chauffage peut l’être aussi.",
        ],
      },
      {
        heading: "Pensez au trajet",
        paragraphs: [
          "Une alerte à 1 °C (34 °F) arrive trop tard si vous êtes à trois heures de route. Choisissez 3–4 °C (38–40 °F), activez une alerte météo pour être prévenu d’un fort gel la veille, et donnez à un voisin ou un gardien proche ses propres alertes et une clé.",
          "Si personne ne peut intervenir en hiver, coupez l’eau et vidangez avant de partir, et surveillez pour protéger le bâtiment plutôt que la plomberie.",
        ],
      },
    ],
    faqs: [
      {
        question: "Peut-on surveiller un chalet sans Wi-Fi ?",
        answer:
          "Oui, avec un capteur cellulaire. Il utilise le réseau mobile au lieu de la connexion internet du chalet : il faut donc une couverture sur place et, généralement, un petit forfait de données.",
      },
      {
        question: "À quelle température maintenir un chalet en hiver ?",
        answer:
          "Si l’eau n’est pas coupée, laissez le chauffage allumé à 13 °C (55 °F) minimum, comme le recommande la Croix-Rouge américaine pour un logement dont vous êtes absent.",
      },
    ],
    related: [
      { label: "Scénario : surveillance hivernale d’un chalet" },
      { label: "À quelle température laisser sa maison en hiver quand on s’absente ?" },
      { label: "Une alarme antigel Wi-Fi fonctionne-t-elle pendant une coupure de courant ?" },
    ],
    sources: [
      { label: "Frozen pipes: prevention and thawing (Croix-Rouge américaine)" },
      { label: "Temp Stick : questions fréquentes" },
    ],
  },
  "ds18b20-vs-dht22-freeze-sensor": {
    question: "DS18B20 ou DHT22 : quel capteur choisir pour surveiller le gel ?",
    description:
      "La DS18B20 : une sonde étanche scellée à fixer sur un tuyau, et plusieurs partagent une broche. Le DHT22 ajoute l’humidité mais ne mesure que l’air ambiant.",
    shortAnswer:
      "La DS18B20, pour la plupart des usages antigel. Les deux sont précis à environ ±0,5 °C près du point de congélation, mais la DS18B20 est vendue sous forme de sonde étanche scellée sur câble, que l’on peut fixer directement sur un tuyau, et plusieurs peuvent partager une même broche du microcontrôleur. Choisissez le DHT22 si vous voulez aussi l’humidité et n’avez besoin que de la température de l’air de la pièce.",
    sections: [
      {
        heading: "Les chiffres",
        paragraphs: [
          "DS18B20 : mesure de −55 à 125 °C (−67 à 257 °F), précision de ±0,5 °C entre −10 et 85 °C, alimentation de 3,0 à 5,5 V, et bus 1-Wire : plusieurs sondes peuvent partager une broche de données, chacune avec un identifiant unique.",
          "DHT22 (AM2302) : mesure de −40 à 80 °C à ±0,5 °C et l’humidité de 0 à 100 % à ±2 % (±5 % au pire), alimentation de 3,3 à 5,5 V, et ne doit pas être lu plus d’une fois toutes les deux secondes.",
        ],
      },
      {
        heading: "Pourquoi la forme de sonde compte plus que la fiche technique",
        paragraphs: [
          "Le risque de gel, c’est la température au niveau du tuyau. Une sonde DS18B20 sur câble peut se loger sous l’isolant du tuyau dans un vide sanitaire humide pendant que la carte reste au sec. Un DHT22 est un boîtier plastique ajouré qui mesure l’air autour de la carte.",
          "Avec le 1-Wire, vous pouvez brancher une sonde sur le tuyau et une seconde à l’air libre sur la même broche, ce qui montre la marge dont dispose le tuyau.",
        ],
      },
      {
        heading: "Quand le DHT22 est le bon choix",
        paragraphs: [
          "Utilisez-le là où l’humidité compte autant que le froid : un sous-sol, un atelier avec des outils qui rouillent, ou un contrôle d’humidité dans un vide sanitaire. Beaucoup d’installations utilisent les deux : une DS18B20 sur le tuyau et un DHT22 pour la pièce.",
        ],
      },
    ],
    faqs: [
      {
        question: "La DS18B20 a-t-elle besoin d’une résistance ?",
        answer:
          "Oui. La ligne de données 1-Wire nécessite une résistance de rappel (pull-up) vers la tension d’alimentation, généralement de 4,7 kΩ. Certaines cartes d’interface l’intègrent.",
      },
      {
        question: "Les deux capteurs sont-ils assez précis pour une alarme antigel ?",
        answer:
          "Oui. Un demi-degré Celsius correspond à environ 1 °F, bien moins que les quelques degrés de marge à laisser entre le seuil d’alerte et 0 °C (32 °F).",
      },
    ],
    related: [
      { label: "Liste des pièces du kit antigel ESP32" },
      { label: "Où placer une sonde antigel dans un vide sanitaire ?" },
      { label: "Comment créer une alerte gel avec ESPHome ?" },
    ],
    sources: [
      { label: "Waterproof DS18B20 digital temperature sensor : caractéristiques techniques (Adafruit)" },
      { label: "Fiche technique AM2302 / DHT22 (Aosong, hébergée par Adafruit)" },
    ],
  },
  "esphome-freeze-alert": {
    question: "Comment créer une alerte gel avec ESPHome ?",
    description:
      "Branchez une DS18B20 sur un ESP32 avec le capteur dallas_temp d’ESPHome, puis alertez via Home Assistant ou envoyez les relevés à un service tiers. YAML inclus.",
    shortAnswer:
      "Branchez une sonde étanche DS18B20 sur un ESP32, ajoutez les composants one_wire et dallas_temp d’ESPHome, et fixez la sonde sur le tuyau avec du ruban adhésif. ESPHome ne fait que mesurer ; l’alerte vient de ce qui reçoit le relevé : une automatisation Home Assistant ou un service externe auquel l’appareil envoie ses données en HTTPS.",
    sections: [
      {
        heading: "Le capteur",
        paragraphs: [
          "Reliez le fil de données de la sonde à une broche GPIO, avec une résistance de rappel de 4,7 kΩ vers le 3,3 V. Avec une seule sonde sur le bus, inutile de préciser son adresse. ESPHome transmet en °C.",
        ],
      },
      {
        heading: "Option 1 : alerter depuis Home Assistant",
        paragraphs: [
          "Une fois l’appareil adopté, le capteur apparaît dans Home Assistant et une automatisation d’état numérique peut envoyer une notification à votre téléphone. C’est la solution la plus rapide, mais l’alerte dépend du bon fonctionnement de Home Assistant et de votre connexion internet.",
        ],
      },
      {
        heading: "Option 2 : envoyer les relevés à l’extérieur",
        paragraphs: [
          "Le composant http_request d’ESPHome peut envoyer chaque relevé par POST à un service hébergé, qui gère ensuite les alertes, l’historique et la détection d’un appareil devenu muet. ProbeHarbor publie un extrait prêt à l’emploi sur probeharbor.dev/esphome/probeharbor.yaml : créez un appareil push, placez son URL d’ingestion dans secrets.yaml et pointez l’extrait vers l’ID de votre capteur.",
          "Vous pouvez faire les deux : garder l’appareil dans Home Assistant pour les automatisations locales et envoyer les données à un service externe pour les alertes qui doivent impérativement vous parvenir.",
        ],
      },
    ],
    faqs: [
      {
        question: "ESPHome peut-il envoyer une notification tout seul ?",
        answer:
          "Pas directement sur votre téléphone. Il peut appeler une action Home Assistant ou faire une requête HTTP : la notification vient donc de Home Assistant ou du service qui reçoit la requête.",
      },
      {
        question: "Quel seuil d’alerte utiliser ?",
        answer:
          "1–3 °C (34–38 °F) au niveau du tuyau ; ESPHome travaille en °C. Visez le haut de la fourchette s’il vous faut un moment pour intervenir.",
      },
    ],
    related: [
      { label: "Recettes ESPHome et Shelly" },
      { label: "Comment créer une alerte gel dans Home Assistant ?" },
      { label: "DS18B20 ou DHT22 : quel capteur choisir pour surveiller le gel ?" },
    ],
  },
  "water-leak-sensor-placement": {
    question: "Où placer les détecteurs de fuite d’eau ?",
    description:
      "Au sol, au point le plus bas près de chaque source d’eau : chauffe-eau, lave-linge, sous les éviers, puisard et sous les tuyaux qui risquent de geler.",
    shortAnswer:
      "Au sol, au point le plus bas à côté de tout ce qui peut fuir : le chauffe-eau, le lave-linge, sous les éviers de la cuisine et de la salle de bains, à côté du puisard et sous toute portion de tuyau susceptible de geler. L’eau suit la pente du sol : un détecteur placé 2,5 cm plus haut que le point bas peut rester sec pendant que la flaque grandit.",
    sections: [
      {
        heading: "Commencez par les endroits où une fuite coûterait le plus cher",
        paragraphs: [
          "Chauffe-eau : dans le bac de récupération s’il y en a un, sinon au sol à sa base.",
          "Lave-linge et lave-vaisselle : derrière ou à côté de l’appareil, près des tuyaux d’arrivée.",
          "Sous les éviers : au fond du meuble, sous les robinets d’arrêt et le siphon.",
          "Puisard et siphons de sol : un détecteur juste au-dessus du niveau d’eau maximal habituel vous signale que la pompe est en panne.",
        ],
      },
      {
        heading: "Ajoutez les portions sujettes au gel",
        paragraphs: [
          "Un tuyau qui se fend en gelant fuit au dégel, souvent des heures après l’alerte de froid. Posez un détecteur de fuite au sol sous les tuyaux du garage, du vide sanitaire ou le long des murs extérieurs pour que le dégel ne passe pas inaperçu.",
        ],
      },
      {
        heading: "Installation",
        paragraphs: [
          "Les contacts doivent toucher le sol, à plat, au point le plus bas. Versez une fois une tasse d’eau à proximité pour voir où elle s’écoule, et testez le détecteur avec un chiffon humide lors de l’installation.",
          "ProbeHarbor traite un détecteur de fuite mouillé comme une alerte dans toutes les offres, sans règle à configurer.",
        ],
      },
    ],
    faqs: [
      {
        question: "Combien de détecteurs de fuite faut-il dans une maison ?",
        answer:
          "Un par source d’eau dont vous ne remarqueriez pas vite une fuite. Pour la plupart des maisons, cela fait quatre à six : chauffe-eau, lave-linge, évier de la cuisine, une ou deux salles de bains, et le puisard ou le siphon de sol le plus bas.",
      },
      {
        question: "Un détecteur de fuite peut-il couper l’eau ?",
        answer:
          "Un détecteur seul ne fait qu’alerter. Pour couper l’eau, il faut une vanne motorisée sur la conduite principale, déclenchée par une automatisation ou un webhook quand le détecteur est mouillé.",
      },
    ],
    related: [
      { label: "Scénario : fuite dans le bac du chauffe-eau" },
      { label: "Leak Puck" },
      { label: "Comment dégeler un tuyau gelé en toute sécurité ?" },
    ],
  },
  "landlord-vacant-rental-freeze-monitoring": {
    question: "Comment un propriétaire bailleur peut-il surveiller le gel dans un logement vacant ?",
    description:
      "Chauffage à 13 °C (55 °F) minimum, un capteur de température près de la plomberie de chaque logement, et des alertes pour qui peut arriver le plus vite.",
    shortAnswer:
      "Laissez le chauffage à 13 °C (55 °F) ou plus, installez un capteur de température connecté près de la plomberie de chaque logement vacant, et envoyez les alertes à la personne qui peut arriver le plus vite, pas seulement à vous. Ajoutez une alerte en cas de silence d’un capteur, car un logement vacant dont le courant ou internet a été coupé est justement celui qui gèle.",
    sections: [
      {
        heading: "Entre deux locataires, la période à risque",
        paragraphs: [
          "Personne n’est là pour remarquer une chaudière arrêtée, et les contrats d’énergie changent souvent de titulaire. Vérifiez que le chauffage et l’électricité restent actifs à votre nom avant la fin des contrats du locataire.",
          "Si le logement doit rester vide tout l’hiver, couper l’eau et vidanger les canalisations élimine l’essentiel du risque.",
        ],
      },
      {
        heading: "Quoi installer",
        paragraphs: [
          "Un capteur près de la plomberie la plus exposée (souvent une cuisine ou une salle de bains sur un mur extérieur, ou le sous-sol) et un détecteur de fuite près du chauffe-eau. Le logement doit disposer d’une connexion internet qui fonctionne, ou d’un capteur cellulaire s’il n’en a pas.",
          "Réglez l’alerte à 3–4 °C (38–40 °F) pour avoir le temps d’envoyer quelqu’un, et activez les alertes météo pour vérifier le bâtiment la veille d’un fort gel.",
        ],
      },
      {
        heading: "Gérer plusieurs biens",
        paragraphs: [
          "Séparez chaque bien pour que l’alerte indique l’adresse, et donnez à votre contact de maintenance ses propres alertes. L’historique des relevés et des alertes constitue aussi une preuve utile pour une déclaration de sinistre si un problème survient.",
          "La page gestion locative de ProbeHarbor explique comment le service gère plusieurs biens.",
        ],
      },
    ],
    faqs: [
      {
        question: "À quelle température maintenir un logement locatif vacant ?",
        answer:
          "Pas en dessous de 13 °C (55 °F) tant que l’eau n’est pas coupée, conformément à la recommandation de la Croix-Rouge américaine pour un logement inoccupé.",
      },
      {
        question: "Peut-on demander de l’aide aux locataires ?",
        answer:
          "Dans les logements occupés, oui : demandez aux locataires de laisser le chauffage allumé quand ils partent en voyage et de signaler immédiatement tout problème de chaudière. La surveillance couvre les cas où personne n’est là pour s’en apercevoir.",
      },
    ],
    related: [
      { label: "ProbeHarbor pour les propriétaires bailleurs et gestionnaires" },
      { label: "Dossier de preuves pour sinistre" },
      { label: "À quelle température laisser sa maison en hiver quand on s’absente ?" },
    ],
    sources: [
      { label: "Frozen pipes: prevention and thawing (Croix-Rouge américaine)" },
    ],
  },
} satisfies AnswerOverlay;

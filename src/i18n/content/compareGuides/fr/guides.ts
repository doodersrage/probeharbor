import type { CompareGuideOverlay } from "../index";

export default {
  "diy-mqtt": {
    competitor: "MQTT maison / Node-RED",
    title: "ProbeHarbor vs MQTT maison",
    seoTitle: "Alternative hébergée aux alertes gel sur MQTT maison",
    headline: "ProbeHarbor vs MQTT maison + Node-RED",
    description:
      "Comparez les alertes gel et fuite de ProbeHarbor à une pile MQTT, Node-RED et cron auto-hébergée : maintenance, SMS, historique et partage au foyer.",
    summary:
      "Un MQTT maison est puissant si vous aimez gérer des brokers, des tableaux de bord et des scripts d’alerte. ProbeHarbor offre le même résultat (sondes en direct, alertes gel et fuite, historique) sans avoir à surveiller la pile à 2 h du matin.",
    lede:
      "Un broker Mosquitto, des flux Node-RED et une tâche cron peuvent vous prévenir du gel dans un garage. Le prix à payer : correctifs, TLS, Twilio et un Raspberry Pi qui doit rester allumé. ProbeHarbor est la couche hébergée d’alertes et d’historique : gardez MQTT sur votre réseau local si vous le souhaitez, relayez les relevés en HTTPS et laissez les canaux d’alerte gel et fuite du foyer vivre dans le cloud.",
    whenProbeHarbor: [
      "Vous voulez des alertes gel et fuite par SMS, e-mail ou push sans câbler Twilio vous-même",
      "Les membres du foyer ont besoin d’un accès sans VPN vers votre Raspberry Pi",
      "Vous utilisez toujours ESP/Arduino : envoi HTTPS ou passerelle MQTT→HTTP",
    ],
    whenOther: [
      "Vous faites déjà tourner une pile MQTT + Grafana solide et aimez l’entretenir",
      "Chaque automatisation doit rester entièrement sur le réseau local, sans dépendance au cloud",
      "Vous avez besoin de protocoles industriels spécifiques que ProbeHarbor ne parle pas",
    ],
    rows: [
      { capability: "Entretien du broker / serveur", probeharbor: "Hébergé (pas de Mosquitto à corriger)", other: "Vous mettez à jour Mosquitto/HA" },
      { capability: "Alertes gel et fuite", probeharbor: "Canaux intégrés + compte à rebours d’heures avant le gel", other: "Node-RED + Twilio/e-mail" },
      { capability: "Envoi depuis ESP", probeharbor: "Clé d’appareil HTTPS ou passerelle MQTT", other: "Conception des topics MQTT" },
      { capability: "Historique et CSV", probeharbor: "Sur les forfaits payants", other: "Influx/Postgres à gérer vous-même" },
      { capability: "Partage en famille", probeharbor: "Invitations au foyer", other: "VPN ou reverse proxy" },
    ],
    faqs: [
      {
        question: "Puis-je garder MQTT et utiliser ProbeHarbor ?",
        answer:
          "Oui. Gardez Mosquitto ou Home Assistant sur votre réseau local pour les automatisations locales et relayez les topics choisis en HTTPS. ProbeHarbor sert de couche externe pour les alertes gel/fuite et l’historique.",
      },
      {
        question: "Dois-je gérer Twilio moi-même ?",
        answer:
          "Non. Les canaux push et messagerie sont hébergés sur tous les forfaits, et les SMS sur Pro. Avec un MQTT maison, il faut généralement câbler Twilio ou l’e-mail vous-même et garder cette pile en ligne.",
      },
      {
        question: "Où trouver la recette de passerelle MQTT ?",
        answer:
          "Sur probeharbor.dev/about/mqtt-bridge, et l’intégration HACS sur probeharbor.dev/integrations/home-assistant.",
      },
    ],
  },
  govee: {
    title: "ProbeHarbor vs Govee",
    seoTitle: "Alternative à Govee pour les alertes gel au garage",
    headline: "ProbeHarbor vs capteurs Govee",
    description:
      "Govee vs ProbeHarbor pour surveiller gel et fuites en local non chauffé : alertes, envoi depuis ESP, zones multi-sondes et historique exportable.",
    summary:
      "Govee et les hubs grand public comme SmartThings sont parfaits pour des capteurs de pièce bon marché et une application soignée. ProbeHarbor est conçu pour surveiller le gel et les fuites dans les garages, ateliers, combles et hangars : vos propres sondes ESP, des alertes pour tout le foyer et un historique exportable.",
    lede:
      "Les hygromètres Govee (et les hubs façon SmartThings qui intègrent le même type de capteurs Bluetooth/Wi-Fi) l’emportent sur le prix et sur une application conviviale pour les chambres et les placards. Ils sont moins à l’aise dans un garage ou un atelier séparé de la maison : portée Bluetooth, dépendance au fabricant et alertes qui restent surtout dans l’application. ProbeHarbor part du principe que vous apportez un ESP32, puis vous offre le routage des alertes gel et fuite pour le foyer et une saison entière d’historique exportable.",
    whenProbeHarbor: [
      "Vous voulez des sondes ESP, Pico W, STM32, CH32V ou Arduino que vous maîtrisez (pas seulement des capteurs du fabricant)",
      "Les alertes gel et fuite doivent passer par SMS, webhooks ou un routage au foyer",
      "Vous tenez au CSV et à l’historique sur toute une saison froide",
    ],
    whenOther: [
      "Il vous faut seulement quelques capteurs Bluetooth sur pile en intérieur",
      "Vous préférez une application grand public tout-en-un sans matériel à bricoler",
      "Le Wi-Fi est impossible au garage et la portée Bluetooth suffit",
    ],
    rows: [
      { capability: "Matériel", probeharbor: "Le vôtre : ESP / Pico / Arduino", other: "Capteurs Govee" },
      { capability: "Garages / bâtiments séparés", probeharbor: "Conçu pour", other: "Portée aléatoire" },
      { capability: "Canaux d’alerte", probeharbor: "E-mail, SMS, push, messagerie, webhooks + compte à rebours avant le gel", other: "Surtout push de l’application" },
      { capability: "Prix", probeharbor: "Environ 25 $ US de pièces par sonde ; forfait Free, Member 4 $ US/mois, Pro 10 $ US/mois", other: "Environ 35–50 $ US pour une passerelle Wi-Fi + capteur ; sans abonnement" },
      { capability: "Export des données", probeharbor: "CSV (Member+) et API (Pro)", other: "Export depuis l’application ; 2 ans de données stockées sur certains modèles" },
      { capability: "Plusieurs utilisateurs par foyer", probeharbor: "Inclus", other: "Partage de compte peu pratique" },
    ],
    faqs: [
      {
        question: "ProbeHarbor remplace-t-il Govee pour les chambres ?",
        answer:
          "Ce n’est pas sa vocation première. Govee l’emporte pour les capteurs Bluetooth d’intérieur bon marché et une application grand public soignée. ProbeHarbor sert à surveiller le gel et les fuites dans les garages, ateliers et autres locaux non chauffés, avec du matériel que vous maîtrisez.",
      },
      {
        question: "Puis-je utiliser un ESP32 à la place des capteurs Govee ?",
        answer:
          "Oui. ProbeHarbor s’attend à ce que vous apportiez votre ESP/Pico/Arduino (ou un envoi JSON). C’est tout l’intérêt pour les garages séparés où la portée Bluetooth ne suffit pas.",
      },
      {
        question: "Lequel offre les meilleurs canaux d’alerte gel ?",
        answer:
          "ProbeHarbor : e-mail, push et messageries sur tous les forfaits, SMS et webhooks sur Pro, plus un compte à rebours avant le gel. Les alertes Govee sont des notifications de l’application, et il faut la version avec passerelle Wi-Fi pour les recevoir loin de chez vous.",
      },
    ],
    sources: {
      checkedOn: "septembre 2026",
      links: [
        { label: "GoveeLife Smart Thermometer R1 (passerelle + capteur)" },
        { label: "Govee Wi-Fi Thermo-Hygrometer" },
      ],
    },
  },
  tempest: {
    title: "ProbeHarbor vs Tempest",
    seoTitle: "Tempest ou sondes intérieures contre le gel des canalisations",
    headline: "ProbeHarbor vs WeatherFlow Tempest",
    description:
      "Stations météo extérieures comme Tempest ou sondes intérieures ProbeHarbor : pour une alerte gel des canalisations là où se trouve vraiment l’eau.",
    summary:
      "Tempest excelle pour la météo du jardin : vent, pluie, température extérieure. Mais le risque de gel des canalisations est à l’intérieur. ProbeHarbor surveille le garage, le vide sanitaire ou l’atelier où passe la plomberie.",
    lede:
      "Une Tempest sur le toit vous donne l’air extérieur, le vent et la pluie avec une excellente fidélité. Les canalisations gèlent là où se trouve l’eau, généralement un garage, un vide sanitaire ou un atelier que la station ne voit jamais. Utilisez Tempest pour la météo du jardin et ProbeHarbor pour la sonde intérieure placée près de la plomberie.",
    whenProbeHarbor: [
      "Il vous faut la température des espaces intérieurs ou non chauffés pour évaluer le risque sur les canalisations",
      "Les alertes doivent se déclencher sur la température du local, pas seulement celle de l’air extérieur",
      "Vous avez déjà ou voulez des capteurs maison en Wi-Fi",
    ],
    whenOther: [
      "Vous voulez une station météo personnelle extérieure haut de gamme",
      "Votre objectif est une prévision hyperlocale et des données d’orage",
      "Vous n’avez pas de risque de gel de la plomberie intérieure",
    ],
    rows: [
      { capability: "Rôle principal", probeharbor: "Surveillance du gel / des locaux intérieurs", other: "Météo extérieure" },
      { capability: "Emplacement de la sonde", probeharbor: "Garage, vide sanitaire, placard", other: "Toit / jardin" },
      { capability: "Alertes gel sur les canalisations", probeharbor: "Directes + compte à rebours d’heures avant le gel", other: "Déduites de l’extérieur seulement" },
      { capability: "Envoi depuis un ESP maison", probeharbor: "Oui", other: "Sans objet" },
      { capability: "Complémentaires ?", probeharbor: "Oui, utilisez les deux", other: "Oui : contexte extérieur" },
    ],
    faqs: [
      {
        question: "Tempest remplace-t-il une sonde de gel intérieure ?",
        answer:
          "Non. Tempest mesure la météo extérieure du jardin. Le risque de gel des canalisations est à l’intérieur (garage, vide sanitaire, atelier). Utilisez Tempest pour le contexte extérieur et ProbeHarbor pour la sonde près de la plomberie.",
      },
      {
        question: "Puis-je utiliser Tempest et ProbeHarbor ensemble ?",
        answer:
          "Oui. Beaucoup de foyers gardent Tempest pour la météo et ProbeHarbor pour les alertes de température là où l’eau se trouve réellement.",
      },
      {
        question: "L’air extérieur suffit-il à détecter le gel dans un garage ?",
        answer:
          "Pas de façon fiable. Les garages suivent l’air extérieur avec un décalage : ils peuvent geler alors que le jardin semble plus doux, ou rester plus chauds pendant que la température extérieure chute. Mettez une sonde dans le local.",
      },
    ],
  },
  nest: {
    title: "ProbeHarbor vs thermostat Nest",
    seoTitle: "Thermostat Nest ou capteur de gel pour le garage",
    headline: "ProbeHarbor vs un thermostat Nest pour protéger du gel les locaux non chauffés",
    description:
      "Un thermostat Nest ne reçoit aucun signal d’un garage non chauffé. ProbeHarbor surveille ce local et peut afficher la mesure du Nest dans les alertes gel.",
    summary:
      "Nest excelle à piloter votre chauffage et à indiquer la température là où il est installé (lui ou un Nest Temperature Sensor) : presque jamais le garage, le vide sanitaire ou l’atelier où les canalisations gèlent vraiment. ProbeHarbor surveille directement ce local et, si vous connectez votre compte Nest, ajoute sa mesure et l’état du chauffage à chaque alerte gel pour donner du contexte.",
    lede:
      "Nest fait très bien une chose : piloter la chaudière et suivre la température de la pièce où il se trouve. Un garage, un vide sanitaire ou un atelier non chauffé n’est pas climatisé par définition, donc Nest n’en a aucune mesure : il n’y a rien sur quoi alerter. ProbeHarbor place une sonde dédiée dans ce local et, si vous connectez votre compte Nest (Pro), chaque alerte gel affiche la température intérieure de la maison et indique si le chauffage tourne, pour savoir d’un coup d’œil si le froid est normal (le garage n’est pas chauffé, la maison va bien) ou si quelque chose ne va vraiment pas.",
    whenProbeHarbor: [
      "Vous avez un garage, un vide sanitaire, un sous-sol ou un atelier hors du circuit de chauffage de Nest",
      "Vous voulez une alerte provenant du local non chauffé lui-même, pas une déduction à partir du thermostat",
      "Vous utilisez déjà Nest et voulez voir sa mesure à côté des alertes gel, pas le remplacer",
    ],
    whenOther: [
      "Il vous faut seulement la température des pièces de vie chauffées par Nest",
      "Vous voulez piloter les horaires de chauffage et de climatisation, pas seulement surveiller un local froid",
      "Vous n’avez pas de local séparé non chauffé qui nécessite sa propre sonde",
    ],
    rows: [
      { capability: "Rôle principal", probeharbor: "Surveillance gel/fuite de n’importe quel local", other: "Pilotage du chauffage et de la climatisation des pièces chauffées" },
      { capability: "Voit un garage / vide sanitaire non chauffé", probeharbor: "Oui : sonde dédiée", other: "Non : les locaux non chauffés sont hors du circuit" },
      { capability: "Alertes gel/fuite (SMS, push, e-mail)", probeharbor: "Oui, avec le délai restant avant le gel", other: "Non" },
      { capability: "Affiche la mesure du thermostat dans les alertes gel", probeharbor: "Oui, si connecté (Pro)", other: "Sans objet" },
      { capability: "Pilote les horaires de chauffage", probeharbor: "Non", other: "Oui" },
      { capability: "Complémentaires ?", probeharbor: "Oui : connectez les deux", other: "Oui : connectez les deux" },
    ],
    faqs: [
      {
        question: "Nest voit-il mon garage non chauffé ?",
        answer:
          "En général, non. Nest mesure l’espace chauffé où il est installé (lui ou un Nest Temperature Sensor). Les garages et vides sanitaires non chauffés sont hors de ce circuit.",
      },
      {
        question: "ProbeHarbor peut-il afficher les mesures du Nest ?",
        answer:
          "Oui, sur Pro lorsque Nest est connecté via OAuth : les alertes gel et la vue Overview peuvent afficher la température intérieure de la maison et l’état du chauffage à côté de la sonde du garage.",
      },
      {
        question: "Dois-je remplacer Nest par ProbeHarbor ?",
        answer:
          "Non. Nest pilote le chauffage ; ProbeHarbor surveille les locaux non chauffés. Connectez les deux si vous voulez le contexte du thermostat dans les alertes gel.",
      },
    ],
  },
  ecobee: {
    title: "ProbeHarbor vs thermostat Ecobee",
    seoTitle: "Thermostat Ecobee ou capteur de gel pour le garage",
    headline: "ProbeHarbor vs un thermostat Ecobee pour protéger du gel les locaux non chauffés",
    description:
      "Un thermostat Ecobee ne reçoit aucun signal d’un garage non chauffé. ProbeHarbor surveille ce local et peut afficher la mesure de l’Ecobee dans les alertes.",
    summary:
      "Ecobee excelle à piloter votre chauffage et à indiquer la température là où il est installé (lui ou un Ecobee SmartSensor) : presque jamais le garage, le vide sanitaire ou l’atelier où les canalisations gèlent vraiment. ProbeHarbor surveille directement ce local et, si vous connectez votre compte Ecobee, ajoute sa mesure et l’état du chauffage à chaque alerte gel pour donner du contexte.",
    lede:
      "Ecobee fait très bien une chose : piloter la chaudière et suivre la température de la pièce où il se trouve. Un garage, un vide sanitaire ou un atelier non chauffé n’est pas climatisé par définition, donc Ecobee n’en a aucune mesure : il n’y a rien sur quoi alerter. ProbeHarbor place une sonde dédiée dans ce local et, si vous connectez votre compte Ecobee (Pro), chaque alerte gel affiche la température intérieure de la maison et indique si le chauffage tourne, pour savoir d’un coup d’œil si le froid est normal (le garage n’est pas chauffé, la maison va bien) ou si quelque chose ne va vraiment pas.",
    whenProbeHarbor: [
      "Vous avez un garage, un vide sanitaire, un sous-sol ou un atelier hors du circuit de chauffage d’Ecobee",
      "Vous voulez une alerte provenant du local non chauffé lui-même, pas une déduction à partir du thermostat",
      "Vous utilisez déjà Ecobee et voulez voir sa mesure à côté des alertes gel, pas le remplacer",
    ],
    whenOther: [
      "Il vous faut seulement la température des pièces de vie chauffées par Ecobee",
      "Vous voulez piloter les horaires de chauffage et de climatisation, pas seulement surveiller un local froid",
      "Vous n’avez pas de local séparé non chauffé qui nécessite sa propre sonde",
    ],
    rows: [
      { capability: "Rôle principal", probeharbor: "Surveillance gel/fuite de n’importe quel local", other: "Pilotage du chauffage et de la climatisation des pièces chauffées" },
      { capability: "Voit un garage / vide sanitaire non chauffé", probeharbor: "Oui : sonde dédiée", other: "Non : les locaux non chauffés sont hors du circuit" },
      { capability: "Alertes gel/fuite (SMS, push, e-mail)", probeharbor: "Oui, avec le délai restant avant le gel", other: "Non" },
      { capability: "Affiche la mesure du thermostat dans les alertes gel", probeharbor: "Oui, si connecté (Pro)", other: "Sans objet" },
      { capability: "Pilote les horaires de chauffage", probeharbor: "Non", other: "Oui" },
      { capability: "Complémentaires ?", probeharbor: "Oui : connectez les deux", other: "Oui : connectez les deux" },
    ],
    faqs: [
      {
        question: "Ecobee voit-il mon garage non chauffé ?",
        answer:
          "En général, non. Ecobee mesure les pièces de vie chauffées (ou les SmartSensors de ce circuit), pas un garage séparé ni un vide sanitaire par défaut.",
      },
      {
        question: "ProbeHarbor peut-il afficher les mesures de l’Ecobee ?",
        answer:
          "Oui, sur Pro lorsque l’OAuth Ecobee est disponible et connecté. Si l’inscription développeur d’Ecobee est fermée, passez plutôt par Home Assistant → envoi de données → référence intérieure.",
      },
      {
        question: "Dois-je remplacer Ecobee par ProbeHarbor ?",
        answer:
          "Non. Ecobee pilote le chauffage ; ProbeHarbor surveille les locaux non chauffés. Ils sont complémentaires.",
      },
    ],
  },
  tempstick: {
    title: "ProbeHarbor vs TempStick",
    seoTitle: "Alternative à Temp Stick : capteurs de gel à monter soi-même",
    headline: "ProbeHarbor vs capteurs Wi‑Fi Temp Stick",
    description:
      "Temp Stick vs ProbeHarbor : capteurs à 149–209 $ US avec SMS gratuits, ou sondes maison à 25 $ US multi-zones, avec détection de fuite et Home Assistant.",
    summary:
      "Temp Stick est le choix le plus simple pour un ou deux locaux : un capteur sur pile prêt à l’emploi, sans abonnement, avec alertes gratuites par SMS, e-mail et application. ProbeHarbor coûte moins cher par capteur et offre plus de souplesse (plusieurs sondes, détecteurs de fuite, Home Assistant), mais vous montez le capteur et les SMS nécessitent Pro.",
    lede:
      "Temp Stick vend des capteurs Wi‑Fi prêts à l’emploi : 149 $ US pour le modèle standard ou environ 199 $ US pour le PRO avec sonde à collier pour canalisation, avec alertes gratuites par SMS, e-mail et application, sans abonnement. Difficile de faire mieux si vous voulez un seul capteur sans aucune configuration. ProbeHarbor convient si vous voulez plusieurs sondes, un détecteur de fuite sous le chauffe-eau ou des relevés dans Home Assistant : un ESP32 et une sonde coûtent environ 25 $ US, les alertes par e-mail et messagerie sont gratuites, et les SMS sont inclus dans Pro.",
    whenProbeHarbor: [
      "Vous voulez des sondes à plusieurs endroits (canalisations, côté porte, vide sanitaire) sans acheter un capteur à 149 $ US ou plus pour chacun",
      "Vous voulez des contacts de fuite humide/sec et des alertes gel sur un même compte",
      "Vous utilisez déjà Home Assistant, ESPHome ou MQTT et voulez que les relevés circulent dans les deux sens",
      "Vous voulez des alertes de gel prévisionnelles, une estimation du délai avant le gel ou un logiciel open source que vous pouvez examiner",
    ],
    whenOther: [
      "Vous voulez un capteur prêt à l’emploi, sans soudure, sans flashage, sans autre réglage que le Wi‑Fi",
      "Il vous faut une alimentation sur pile là où il n’y a pas de prise",
      "Vous voulez des alertes SMS gratuites sans abonnement",
      "Un ou deux capteurs couvrent tous vos besoins",
    ],
    rows: [
      { capability: "Matériel", probeharbor: "À monter : ESP32 / Pico / Arduino + DS18B20 ou DHT22", other: "Capteur prêt à l’emploi sur pile ou secteur" },
      { capability: "Coût initial", probeharbor: "Environ 25 $ US de pièces par sonde", other: "149 $ US le standard ; environ 199 $ US le PRO avec collier" },
      { capability: "Coût récurrent", probeharbor: "Forfait Free ; Member 4 $ US/mois ; Pro 10 $ US/mois pour les SMS", other: "Aucun" },
      { capability: "Sonde fixée sur la canalisation", probeharbor: "Oui (DS18B20 étanche sur le tuyau)", other: "Oui sur le PRO (collier)" },
      { capability: "Contacts de fuite / inondation", probeharbor: "Oui, alerte automatique en cas d’humidité", other: "Non mentionné sur le modèle à collier" },
      { capability: "Canaux d’alerte", probeharbor: "E-mail, push, messageries gratuits ; SMS, webhooks sur Pro", other: "SMS, e-mail, application, tout gratuit" },
      { capability: "Partage et données", probeharbor: "Invitations au foyer, CSV (Member+), API (Pro)", other: "Jusqu’à 10 contacts d’alerte, export CSV, API publique" },
      { capability: "Home Assistant", probeharbor: "Intégration HACS officielle + envoi depuis HA", other: "Via leur API" },
      { capability: "Alertes prévisionnelles", probeharbor: "Gel prévu (Member+), alertes NWS (Pro, États-Unis)", other: "Non mentionné ; alertes de seuil" },
    ],
    faqs: [
      {
        question: "Temp Stick est-il plus simple à installer que ProbeHarbor ?",
        answer:
          "Oui. Un Temp Stick se connecte au Wi‑Fi et fonctionne via son application. ProbeHarbor demande un ESP32 ou une carte similaire flashée avec un sketch prérempli, ou une installation Home Assistant, ESPHome ou MQTT existante.",
      },
      {
        question: "Lequel est le moins cher ?",
        answer:
          "Pour un capteur avec SMS, Temp Stick : 149–209 $ US une fois, contre environ 25 $ US de pièces plus 100 $ US par an pour ProbeHarbor Pro. Pour plusieurs zones ou des alertes uniquement par e-mail, ProbeHarbor : trois sondes coûtent environ 75 $ US de pièces et le forfait Free inclut les alertes e-mail, contre 447 $ US ou plus pour trois Temp Stick.",
      },
      {
        question: "Temp Stick facture-t-il un abonnement ?",
        answer:
          "Non. Temp Stick indique que la surveillance, l’enregistrement des données et les alertes par SMS, e-mail et application sont gratuits pendant toute la durée de vie du capteur.",
      },
      {
        question: "ProbeHarbor peut-il surveiller un chalet inoccupé comme un Temp Stick ?",
        answer:
          "Oui, si le chalet dispose du Wi‑Fi et d’une alimentation pour un ESP32. Placez une sonde étanche sur la canalisation la plus froide, ajoutez un contact de fuite si vous le souhaitez, et choisissez les alertes e-mail (gratuites) ou SMS (Pro).",
      },
    ],
    sources: {
      checkedOn: "septembre 2026",
      links: [
        { label: "Capteur Wi‑Fi Temp Stick (149 $ US)" },
        { label: "Temp Stick PRO avec collier pour canalisation" },
        { label: "Questions fréquentes Temp Stick (frais, contacts, export, API)" },
      ],
    },
  },
  yolink: {
    title: "ProbeHarbor vs YoLink",
    seoTitle: "Alternative à YoLink pour les alertes de gel des canalisations",
    headline: "ProbeHarbor vs capteurs de température YoLink",
    description:
      "YoLink vs ProbeHarbor : un kit hub à 59,99 $ US avec capteurs sur pile et SMS, ou des sondes maison sur la canalisation avec un logiciel open source.",
    summary:
      "YoLink est le choix le plus simple, et souvent le moins cher, en capteurs prêts à l’emploi : un hub et deux capteurs sur pile coûtent 59,99 $ US et alertent par push, e-mail et SMS. ProbeHarbor convient si vous voulez une sonde scotchée sur le tuyau, pas de hub, votre propre matériel ou des relevés dans un système ouvert.",
    lede:
      "YoLink vend un hub avec deux capteurs de température et d’humidité sur pile pour 59,99 $ US. Les capteurs sont prévus pour −30 °C à 60 °C (−22 °F à 140 °F), tiennent deux ans ou plus avec une paire de piles et envoient des alertes push, e-mail et SMS. Pour la plupart des gens qui veulent un produit fini dans un garage froid, c’est une option solide. ProbeHarbor convient mieux si vous voulez une sonde étanche directement sur la canalisation, les contacts de fuite et les alertes gel au même endroit, aucun hub propriétaire, ou un logiciel que vous pouvez lire et auto-héberger : un ESP32 et une sonde coûtent environ 25 $ US, les alertes par e-mail et messagerie sont gratuites, et les SMS sont inclus dans Pro.",
    whenProbeHarbor: [
      "Vous voulez une sonde étanche scotchée sur le tuyau lui-même plutôt qu’un capteur d’ambiance au mur",
      "Vous utilisez déjà Home Assistant, ESPHome ou MQTT et voulez une destination de plus, pas un hub de plus",
      "Vous voulez un logiciel open source, une API HTTP accessible depuis n’importe quelle carte et aucun matériel du fabricant",
      "Vous voulez des alertes de gel prévisionnelles et une estimation du délai avant le gel en plus des alertes de seuil",
    ],
    whenOther: [
      "Vous voulez des capteurs sur pile prêts à l’emploi, sans câblage ni flashage",
      "Il n’y a pas de prise à l’endroit où doit aller le capteur",
      "Vous voulez des alertes push, e-mail et SMS depuis l’application d’un seul fabricant",
      "Le local est loin de votre Wi‑Fi et un hub longue portée lui convient mieux",
    ],
    rows: [
      { capability: "Matériel", probeharbor: "À monter : ESP32 / Pico / Arduino + DS18B20 ou DHT22", other: "Capteur sur pile prêt à l’emploi ; hub YoLink requis" },
      { capability: "Coût initial", probeharbor: "Environ 25 $ US de pièces par sonde", other: "59,99 $ US pour un hub et deux capteurs" },
      { capability: "Coût récurrent", probeharbor: "Forfait Free ; Member 4 $ US/mois ; Pro 10 $ US/mois pour les SMS", other: "Non indiqué sur la page produit" },
      { capability: "Prévu pour les locaux qui gèlent", probeharbor: "Oui (sonde DS18B20 : −55 °C à 125 °C (−67 °F à 257 °F))", other: "Oui (−30 °C à 60 °C (−22 °F à 140 °F))" },
      { capability: "Alimentation", probeharbor: "USB sur la carte", other: "Deux piles, plus de 2 ans annoncés" },
      { capability: "Sonde fixée sur la canalisation", probeharbor: "Oui (DS18B20 étanche sur le tuyau)", other: "Capteur extérieur séparé avec sonde (YS8005)" },
      { capability: "Canaux d’alerte", probeharbor: "E-mail, push, messageries gratuits ; SMS, webhooks sur Pro", other: "Push, e-mail, SMS" },
      { capability: "Export des données", probeharbor: "CSV (Member+), API (Pro)", other: "Export CSV" },
      { capability: "Home Assistant", probeharbor: "Intégration HACS officielle + envoi depuis HA", other: "Annoncé comme compatible" },
    ],
    faqs: [
      {
        question: "YoLink est-il moins cher que ProbeHarbor ?",
        answer:
          "En capteurs prêts à l’emploi, généralement oui. Le hub YoLink avec deux capteurs coûte 59,99 $ US. Deux sondes ProbeHarbor coûtent environ 50 $ US de pièces et le forfait Free inclut les alertes e-mail, mais vous les montez vous-même, et les SMS nécessitent Pro.",
      },
      {
        question: "YoLink a-t-il besoin d’un hub ?",
        answer:
          "Oui. Les capteurs YoLink communiquent avec un hub YoLink, lui-même connecté à votre réseau. Les appareils ProbeHarbor envoient directement leurs données sur Internet en Wi‑Fi, Ethernet ou réseau mobile, sans hub.",
      },
      {
        question: "Les capteurs YoLink fonctionnent-ils dans un garage non chauffé ?",
        answer:
          "Oui. YoLink annonce son capteur YS8003 pour −30 °C à 60 °C (−22 °F à 140 °F) et cite les congélateurs parmi ses usages.",
      },
      {
        question: "Pourquoi choisir ProbeHarbor plutôt que YoLink ?",
        answer:
          "Pour l’emplacement de la sonde et l’ouverture : une sonde étanche sur la canalisation la plus froide, plusieurs sondes sur une seule carte, des contacts de fuite sur le même compte et un logiciel open source qui accepte les relevés de tout appareil capable d’envoyer une requête HTTPS.",
      },
    ],
    sources: {
      checkedOn: "octobre 2026",
      links: [
        { label: "Hub YoLink avec deux capteurs de température et d’humidité (59,99 $ US)" },
        { label: "Fiche technique YoLink YS8003 (plage, pile, alertes)" },
      ],
    },
  },
  sensorpush: {
    title: "ProbeHarbor vs SensorPush",
    seoTitle: "Alternative à SensorPush pour les alertes gel à distance",
    headline: "ProbeHarbor vs capteurs SensorPush",
    description:
      "SensorPush vs ProbeHarbor : capteurs Bluetooth précis qui exigent une passerelle à 99,95 $ US pour alerter à distance, ou sondes Wi‑Fi maison sur le tuyau.",
    summary:
      "SensorPush fabrique de petits capteurs Bluetooth précis avec une application soignée et sans frais mensuels, mais les alertes loin de chez vous exigent la passerelle Wi‑Fi à 99,95 $ US. Les sondes ProbeHarbor transmettent directement en Wi‑Fi et peuvent se fixer sur le tuyau ; vous les montez vous-même, et les SMS nécessitent Pro.",
    lede:
      "Les capteurs SensorPush sont compacts et précis : le HT1 coûte 54,95 $ US et le HT.w résistant à l’eau 69,99 $ US, tous deux prévus pour −40 °C à 60 °C (−40 °F à 140 °F) avec un an ou plus d’autonomie. Ce sont des capteurs Bluetooth : votre téléphone doit être à portée, sauf si vous ajoutez la G1 Wi‑Fi Gateway à 99,95 $ US, qui inclut l’accès cloud sans frais mensuels et des alertes dans l’application et par e-mail. ProbeHarbor part de l’autre bout : un ESP32 avec une sonde étanche (environ 25 $ US de pièces) transmet seul en Wi‑Fi, les alertes par e-mail et messagerie sont gratuites, et les contacts de fuite, les alertes prévisionnelles et Home Assistant sont intégrés. Les SMS sont inclus dans Pro.",
    whenProbeHarbor: [
      "Vous voulez des alertes à distance sans acheter de passerelle",
      "Vous voulez une sonde étanche sur le tuyau, ou plusieurs sondes sur une même carte",
      "Vous voulez des alertes par SMS, messagerie ou webhook, ou un contact de fuite sur le même compte",
      "Vous utilisez Home Assistant, ESPHome ou MQTT et voulez y faire remonter les relevés",
    ],
    whenOther: [
      "Vous voulez un petit capteur prêt à l’emploi avec un an ou plus d’autonomie",
      "Vous êtes souvent chez vous, donc la portée Bluetooth jusqu’à votre téléphone suffit",
      "Vous voulez une température et une humidité de l’air très précises (cave à cigares, étui d’instrument, cave à vin)",
      "Vous préférez un achat unique, sans forfait à gérer",
    ],
    rows: [
      { capability: "Matériel", probeharbor: "À monter : ESP32 / Pico / Arduino + DS18B20 ou DHT22", other: "Capteur Bluetooth prêt à l’emploi" },
      { capability: "Coût initial", probeharbor: "Environ 25 $ US de pièces par sonde", other: "54,95 $ US (HT1) ou 69,99 $ US (HT.w) par capteur" },
      { capability: "Alertes loin de chez vous", probeharbor: "Oui, les capteurs transmettent en Wi‑Fi", other: "Nécessite la G1 Wi‑Fi Gateway (99,95 $ US)" },
      { capability: "Coût récurrent", probeharbor: "Forfait Free ; Member 4 $ US/mois ; Pro 10 $ US/mois pour les SMS", other: "Aucun ; le cloud de la passerelle est sans frais mensuels" },
      { capability: "Prévu pour les locaux qui gèlent", probeharbor: "Oui (sonde DS18B20 : −55 °C à 125 °C (−67 °F à 257 °F))", other: "Oui (−40 °C à 60 °C (−40 °F à 140 °F))" },
      { capability: "Canaux d’alerte", probeharbor: "E-mail, push, messageries gratuits ; SMS, webhooks sur Pro", other: "Application et e-mail ; SMS non mentionné" },
      { capability: "Alimentation", probeharbor: "USB sur la carte", other: "Pile : plus d’un an (HT1), plus de 2 ans (HT.w)" },
      { capability: "API", probeharbor: "Envoi HTTP sur tous les forfaits ; clés API sur Pro", other: "API pour le cloud de la passerelle" },
    ],
    faqs: [
      {
        question: "SensorPush fonctionne-t-il sans la passerelle ?",
        answer:
          "Oui, en Bluetooth quand votre téléphone est à portée (SensorPush annonce environ 100 mètres (325 pieds) en champ libre). Pour voir les relevés ou recevoir des alertes quand vous êtes absent, il faut la G1 Wi‑Fi Gateway.",
      },
      {
        question: "SensorPush facture-t-il un abonnement ?",
        answer:
          "Non. SensorPush indique que le service cloud inclus avec la G1 Wi‑Fi Gateway est sans frais mensuels.",
      },
      {
        question: "Lequel coûte le moins cher pour des alertes gel à distance ?",
        answer:
          "Pour un capteur avec alertes à distance, SensorPush coûte 154,90 $ US (HT1 plus passerelle) une fois. Une sonde ProbeHarbor coûte environ 25 $ US de pièces avec alertes e-mail gratuites, ou 100 $ US de plus par an si vous voulez les SMS avec Pro. Chaque capteur SensorPush supplémentaire ajoute 54,95 $ US ; chaque sonde ProbeHarbor supplémentaire environ 25 $ US, voire moins si elles partagent une carte.",
      },
      {
        question: "SensorPush est-il plus précis ?",
        answer:
          "Pour la température de l’air, oui : SensorPush annonce ±0,3 °C (±0,5 °F) typique pour le HT1, contre environ ±0,5 °C (±1 °F) pour un DS18B20. Pour une alarme gel, l’un comme l’autre suffit largement, puisque le seuil d’alerte doit de toute façon se situer quelques degrés au-dessus de 0 °C (32 °F).",
      },
    ],
    sources: {
      checkedOn: "octobre 2026",
      links: [
        { label: "Capteur SensorPush HT1 (54,95 $ US)" },
        { label: "Capteur résistant à l’eau SensorPush HT.w (69,99 $ US)" },
        { label: "SensorPush G1 Wi‑Fi Gateway (99,95 $ US ; cloud, alertes, API)" },
      ],
    },
  },
  shelly: {
    title: "ProbeHarbor vs Shelly H&T",
    seoTitle: "Shelly H&T contre le gel : limites et alternatives",
    headline: "ProbeHarbor vs Shelly H&T Gen3 pour les alertes gel",
    description:
      "Le Shelly H&T Gen3 est un bon capteur d’ambiance à 40,99 $ US, mais prévu pour 0–40 °C : inadapté à un garage qui gèle. Ce qui change avec une sonde.",
    summary:
      "Le Shelly H&T Gen3 est un capteur d’ambiance Wi‑Fi soigné à 40,99 $ US, avec écran, MQTT et webhooks. Mais Shelly le prévoit pour 0 °C à 40 °C (32 °F à 105 °F), ce qui l’exclut des locaux qui gèlent réellement. ProbeHarbor utilise une sonde prévue bien en dessous de zéro, fixée sur la canalisation.",
    lede:
      "Le Shelly H&T Gen3 coûte 40,99 $ US, tient environ un an sur quatre piles AA ou fonctionne en USB‑C, affiche la température et l’humidité sur un écran e-paper, et parle Wi‑Fi, MQTT et webhooks. C’est un bon capteur pour une pièce chauffée. Shelly indique une température ambiante de fonctionnement de 0 °C à 40 °C (32 °F à 105 °F) et 30–70 % d’humidité : un garage ou un vide sanitaire non chauffé pendant une vague de froid sort donc de sa plage prévue. ProbeHarbor est conçu pour ces locaux : une sonde DS18B20 étanche prévue jusqu’à −55 °C (−67 °F), fixée sur la canalisation, avec alertes gel, fuite et coupure, et alertes prévisionnelles. Si vous utilisez déjà des appareils Shelly à l’intérieur, leurs relevés peuvent rejoindre ProbeHarbor via Home Assistant ou MQTT.",
    whenProbeHarbor: [
      "Le local peut descendre sous 0 °C (32 °F), hors de la plage prévue du Shelly H&T",
      "Vous voulez la mesure au niveau du tuyau, sous l’isolant, pas celle de l’air de la pièce",
      "Vous voulez des alertes gel, fuite et capteur hors ligne, et une alerte prévisionnelle, sans créer d’automatisations",
      "Vous voulez que les membres du foyer reçoivent les alertes grâce aux invitations au foyer",
    ],
    whenOther: [
      "Vous surveillez une pièce chauffée : sous-sol, buanderie ou pièce de vie",
      "Vous voulez un capteur sur pile avec écran, sans câblage",
      "Vous utilisez déjà l’application Shelly, Home Assistant ou MQTT et créerez l’alerte vous-même",
      "L’humidité d’un espace chauffé compte davantage pour vous que la température des canalisations",
    ],
    rows: [
      { capability: "Matériel", probeharbor: "À monter : ESP32 / Pico / Arduino + DS18B20 ou DHT22", other: "Capteur Wi‑Fi prêt à l’emploi avec écran e-paper" },
      { capability: "Coût initial", probeharbor: "Environ 25 $ US de pièces par sonde", other: "40,99 $ US" },
      { capability: "Température de fonctionnement prévue", probeharbor: "Sonde DS18B20 : −55 °C à 125 °C (−67 °F à 257 °F)", other: "0 °C à 40 °C (32 °F à 105 °F)" },
      { capability: "Sonde fixée sur la canalisation", probeharbor: "Oui (DS18B20 étanche sur le tuyau)", other: "Non ; mesure l’air autour de l’appareil" },
      { capability: "Alimentation", probeharbor: "USB sur la carte", other: "4 piles AA (environ 1 an) ou USB‑C" },
      { capability: "Intégrations locales", probeharbor: "Home Assistant (HACS), ESPHome, passerelle MQTT", other: "MQTT et webhooks (actions URL)" },
      { capability: "Contacts de fuite / inondation", probeharbor: "Oui, alerte automatique en cas d’humidité", other: "Pas sur cet appareil" },
    ],
    faqs: [
      {
        question: "Peut-on utiliser un Shelly H&T dans un garage non chauffé ?",
        answer:
          "Shelly indique pour le H&T Gen3 une température ambiante de fonctionnement de 0 °C à 40 °C (32 °F à 105 °F). Un garage qui passe sous zéro sort de cette plage : ce n’est donc pas le bon outil pour une alarme gel à cet endroit.",
      },
      {
        question: "Un appareil Shelly peut-il envoyer ses relevés à ProbeHarbor ?",
        answer:
          "Oui. Le plus simple pour un H&T est de passer par Home Assistant ou MQTT, pour lesquels ProbeHarbor propose une intégration et une recette de passerelle. Le guide des recettes ESPHome et Shelly sur probeharbor.dev/about/esphome-shelly-recipes explique l’envoi direct depuis les modules Shelly Plus et Gen2.",
      },
      {
        question: "Un Shelly H&T coûte-t-il moins cher qu’une sonde ProbeHarbor ?",
        answer:
          "Non. Le H&T Gen3 coûte 40,99 $ US ; un ESP32 avec un DS18B20 étanche revient à environ 25 $ US de pièces. Le Shelly est prêt à l’emploi et fonctionne sur pile : c’est ce que paie la différence.",
      },
    ],
    sources: {
      checkedOn: "octobre 2026",
      links: [
        { label: "Page produit et caractéristiques du Shelly H&T Gen3 (40,99 $ US)" },
        { label: "Caractéristiques techniques du DS18B20 étanche (Adafruit)" },
      ],
    },
  },
} satisfies CompareGuideOverlay;

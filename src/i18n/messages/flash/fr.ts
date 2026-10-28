/**
 * /flash page copy, plus the BrowserFlasher component (also used in the
 * English-only dashboard). Keys ending in `Html` are trusted inline HTML.
 */
import type { FlashMessages } from "./en";

const fr: FlashMessages = {
  title: "Flasher un capteur de gel ESP32 depuis le navigateur",
  description:
    "Transformez un ESP32 et une sonde DS18B20 en capteur de gel sans installer d’IDE : flashez depuis le navigateur, saisissez Wi-Fi et clé d’appareil, c’est fait.",
  breadcrumbHome: "Accueil",
  breadcrumbFlash: "Outil de flashage web",
  faqs: [
    {
      question: "De quoi ai-je besoin ?",
      answer:
        "Une carte ESP32 (l’ESP32 d’origine est testé ; les ESP32-S3 et ESP32-C3 sont compilés, mais pas encore testés sur du matériel), une sonde étanche DS18B20 ou un capteur de température et d’humidité DHT22 (le DHT11 est pris en charge, mais pas encore testé sur du matériel) avec une résistance de tirage de 4,7 kΩ sur GPIO 4, un câble USB de données, et Chrome ou Edge sur un ordinateur fixe ou portable.",
    },
    {
      question: "Ai-je besoin de l’Arduino IDE ?",
      answer:
        "Non. Le firmware est précompilé et installé par le navigateur. Le Wi-Fi et la clé de l’appareil sont envoyés à la carte après le flashage : rien n’est à compiler.",
    },
    {
      question: "Puis-je ajouter plusieurs sondes ?",
      answer:
        "Oui, jusqu’à quatre sondes DS18B20 sur la même broche. Elles remontent en temp1 à temp4 et peuvent être renommées dans le tableau de bord. Un DHT22 compte pour un seul capteur par carte.",
    },
    {
      question: "Que puis-je connecter d’autre ?",
      answer:
        "Un capteur I²C de température et d’humidité (BME280, SHT31 ou AHT20, détecté automatiquement ; le BME280 mesure aussi la pression atmosphérique), un contact de fuite ou d’eau pour les alertes d’inondation, un interrupteur magnétique de porte et une batterie via un pont diviseur 1:1 pour estimer son autonomie. Cochez les options fuite, porte et batterie en envoyant les réglages pour que la carte sache qu’ils sont câblés. Testés sur du matériel à ce jour : le BME280 et l’interrupteur de porte. Les SHT31, AHT20, la fuite et la batterie sont pris en charge, mais pas encore testés sur du matériel.",
    },
    {
      question: "Est-ce que ça marche avec un DHT22 ?",
      answer:
        "Oui. Il se câble de la même façon (données sur GPIO 4, 4,7 kΩ vers le 3,3 V). Le firmware cherche d’abord des sondes DS18B20 et, s’il n’y en a pas, lit un DHT22 ou un DHT11 sur cette broche, avec température et humidité. Une DS18B20 convient mieux contre un tuyau ; un DHT22 est adapté à l’air ambiant et à l’humidité d’un vide sanitaire ou d’un sous-sol.",
    },
    {
      question: "Comment passer la carte sur un autre réseau ?",
      answer:
        "Maintenez le bouton BOOT cinq secondes pour effacer le Wi-Fi et la clé enregistrés, puis envoyez de nouveaux réglages depuis cette page ou via le réseau ProbeHarbor-Setup.",
    },
    {
      question: "Le firmware est-il open source ?",
      answer:
        "Oui. Le code source se trouve dans le dépôt ProbeHarbor, sous firmware/probeharbor-probe, à côté de sketches que vous pouvez modifier et flasher vous-même.",
    },
  ],
  buy: {
    board: "Carte (choisissez-en une)",
    s3c3: "Ou une carte S3 / C3 (pas encore testée sur du matériel ; stock variable)",
    sensor: "Capteur sur GPIO 4",
    i2c: "Ou un capteur d’air I²C (sans résistance)",
    extras: "Extras facultatifs",
    ds18b20: "Sonde étanche DS18B20",
    resistor4k7: "Résistances de 4,7 kΩ",
    bme280: "BME280 (ajoute la pression atmosphérique)",
    reed: "Interrupteur magnétique de porte",
    resistor100k: "Résistances de 100 kΩ (pont diviseur batterie)",
  },
  kicker: "Installation · Bêta",
  heading: "Flashez un capteur de gel depuis votre navigateur",
  lede: "Ni Arduino IDE ni code à modifier. Branchez une sonde DS18B20 ou un DHT22 sur un ESP32, installez le firmware depuis cette page, puis envoyez-lui votre Wi‑Fi et la clé de l’appareil par le même câble USB.",
  getKey: "Obtenir une clé d’appareil",
  startFreeGetKey: "Commencer gratuitement → obtenir une clé d’appareil",
  partsAndWiring: "Liste des pièces et câblage",
  beforeTitle: "Avant de commencer",
  wireHtml:
    'Câblez le capteur : alimentation sur 3,3 V, masse sur GND, données sur GPIO 4, avec une résistance de 4,7 kΩ entre les données et le 3,3 V (<a class="text-link" href="/about/esp32-freeze-kit">schéma</a>). C’est pareil pour une sonde DS18B20 (fils rouge, noir et jaune) et pour un DHT22 ; le firmware détecte lequel est branché.',
  extrasIntro: "Extras facultatifs, sur ces broches (chaque interrupteur ou contact se place entre la broche et GND) :",
  pinTable: {
    connect: "Branchement",
    data: "Données DS18B20 ou DHT22",
    i2c: "Capteur I²C SDA / SCL (BME280, SHT31, AHT20)",
    leak: "Contact de fuite / d’eau",
    door: "Interrupteur reed de porte",
    battery: "Batterie + via un pont diviseur 1:1 (2 × 100 kΩ)",
  },
  i2cNote:
    "Les capteurs I²C sont détectés automatiquement ; cochez fuite, porte ou batterie ci-dessous pour que la carte sache qu’ils sont câblés.",
  featherHtml:
    "<strong>Adafruit Feather (HUZZAH32 ou ESP32 Feather V2) :</strong> utilisez la colonne ESP32. Les données de la sonde (GPIO 4) vont sur la broche marquée A5, l’interrupteur de porte (GPIO 26) sur A0 et le contact de fuite sur la broche 27. Le pont diviseur de batterie est déjà sur la carte : branchez une LiPo sur le connecteur batterie et cochez batterie, sans résistance. Un capteur I²C se branche sur les broches SDA/SCL de la Feather ou sur son port STEMMA QT ; le firmware le détecte au démarrage (coupez et remettez l’alimentation après l’avoir branché). Les Feather n’ont pas de bouton BOOT sur GPIO 0, donc la réinitialisation de 5 secondes ne fonctionne pas ; pour changer de Wi-Fi, envoyez plutôt de nouveaux réglages depuis cette page.",
  deviceKeyHtml:
    'Ajoutez un appareil push dans <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> et copiez sa clé d’appareil. L’offre gratuite inclut deux appareils.',
  buyTitle: "Quoi acheter",
  buyIntro:
    "Des pièces qui correspondent aux broches ci-dessus. Un ESP32 classique est le choix testé. Les liens S3 et C3 renvoient aux cartes de développement d’Espressif, pour lesquelles le firmware est compilé ; en cas de rupture, une autre carte ESP32-S3-DevKitC-1 ou ESP32-C3-DevKitM-1 (ou un clone au brochage identique) devrait aussi fonctionner, mais les cartes S3 et C3 ne sont pas encore testées sur du matériel.",
  leakHtml:
    '<strong>Capteur de fuite :</strong> l’option bon marché la plus simple est un module LM393 « capteur de pluie / d’eau » (vendu par de nombreuses boutiques) : VCC sur la broche 3,3 V de la carte (jamais 5 V, pour que sa sortie reste sans danger pour l’ESP32), GND sur GND, DO sur la broche de fuite. Tournez son potentiomètre jusqu’à ce qu’une goutte d’eau donne mouillé, puis vérifiez qu’il repasse à sec. Ses pistes à nu se corrodent si elles restent mouillées : voyez-le comme une pièce pour débuter. Pour une installation plus durable, utilisez deux vis ou pointes en inox espacées d’environ 5&nbsp;mm, l’une sur la broche de fuite, l’autre sur GND. Dans tous les cas, testez avec votre propre eau : une eau très pure ou une fine pellicule peut ne pas le déclencher. Les capteurs dont la sortie passe à l’état haut quand ils sont mouillés, comme le capteur d’eau d’Adafruit, nécessitent une autre entrée et ne fonctionnent pas avec ce firmware.',
  afterTitle: "Une fois en service",
  afterHtml:
    'Les relevés arrivent une fois par minute. Fixez la sonde contre le tuyau le plus froid, réglez un seuil de gel de 1 à 3 °C (34–38 °F) dans <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a> et envoyez une alerte de test. Voyez <a class="text-link" href="/answers/crawlspace-freeze-sensor-placement">où placer le capteur</a> et <a class="text-link" href="/answers/freeze-alarm-temperature-setting">à quelle température déclencher l’alerte</a>. Vous préférez modifier le code vous-même ? Les <a class="text-link" href="/about/esp32-web-flash">autres méthodes de flashage</a> couvrent Arduino, PlatformIO, MicroPython et ESPHome.',
};

export default fr;

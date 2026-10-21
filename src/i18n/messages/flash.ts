import { defineMessages } from "../translate";

/**
 * /flash page copy, plus the BrowserFlasher component (also used in the
 * English-only dashboard). Keys ending in `Html` are trusted inline HTML.
 */
const en = {
  title: "Flash an ESP32 freeze sensor from your browser",
  description:
    "Turn an ESP32 and a DS18B20 probe into a freeze sensor without installing an IDE: flash from the browser, enter Wi-Fi and a device key, done.",
  breadcrumbHome: "Home",
  breadcrumbFlash: "Browser flasher",
  faqs: [
    {
      question: "What do I need?",
      answer:
        "An ESP32, ESP32-S3, or ESP32-C3 board, a waterproof DS18B20 probe or a DHT22 (or DHT11) temperature and humidity sensor with a 4.7kΩ pull-up resistor on GPIO 4, a USB data cable, and Chrome or Edge on a desktop or laptop.",
    },
    {
      question: "Do I need the Arduino IDE?",
      answer:
        "No. The firmware is prebuilt and installed by the browser. Wi-Fi and your device key are sent to the board after flashing, so nothing has to be compiled.",
    },
    {
      question: "Can I add more than one probe?",
      answer:
        "Yes, up to four DS18B20 probes on the same pin. They report as temp1 to temp4 and can be renamed in the dashboard. A DHT22 is one sensor per board.",
    },
    {
      question: "What else can I connect?",
      answer:
        "An I²C temperature and humidity sensor (BME280, SHT31, or AHT20, found automatically; a BME280 also reports air pressure), a leak or water contact for flood alerts, a magnetic door switch, and a battery through a 1:1 resistor divider for battery-life estimates. Tick the leak, door, and battery options when you send settings so the board knows they're wired.",
    },
    {
      question: "Does it work with a DHT22?",
      answer:
        "Yes. Wire it the same way (data to GPIO 4, 4.7kΩ to 3.3V). The firmware looks for DS18B20 probes first and, if there are none, reads a DHT22 or DHT11 on that pin, reporting temperature and humidity. A DS18B20 is the better choice against a pipe; a DHT22 suits room air and humidity in a crawlspace or basement.",
    },
    {
      question: "How do I move the board to another network?",
      answer:
        "Hold the BOOT button for five seconds to erase the saved Wi-Fi and device key, then send new settings from this page or through the ProbeHarbor-Setup network.",
    },
    {
      question: "Is the firmware open source?",
      answer:
        "Yes. The source is in the ProbeHarbor repository under firmware/probeharbor-probe, alongside sketches you can edit and flash yourself.",
    },
  ],
  buy: {
    board: "Board (pick one)",
    s3c3: "Or an S3 / C3 board (stock varies)",
    sensor: "Sensor on GPIO 4",
    i2c: "Or an I²C air sensor (no resistor needed)",
    extras: "Optional extras",
    ds18b20: "Waterproof DS18B20 probe",
    resistor4k7: "4.7kΩ resistors",
    bme280: "BME280 (adds air pressure)",
    reed: "Magnetic door switch",
    resistor100k: "100kΩ resistors (battery divider)",
  },
  kicker: "Setup · Beta",
  heading: "Flash a freeze sensor from your browser",
  lede: "No Arduino IDE, no editing code. Wire a DS18B20 probe or a DHT22 to an ESP32, install the firmware from this page, then send it your Wi‑Fi and device key over the same USB cable.",
  getKey: "Get a device key",
  startFreeGetKey: "Start free → get a device key",
  partsAndWiring: "Parts list and wiring",
  beforeTitle: "Before you start",
  wireHtml:
    'Wire the sensor: power to 3.3V, ground to GND, data to GPIO 4, with a 4.7kΩ resistor between data and 3.3V (<a class="text-link" href="/about/esp32-freeze-kit">diagram</a>). That\'s the same for a DS18B20 probe (red, black, yellow wires) and a DHT22; the firmware detects which one is connected.',
  extrasIntro: "Optional extras, on these pins (each switch or contact goes between the pin and GND):",
  pinTable: {
    connect: "Connect",
    data: "DS18B20 or DHT22 data",
    i2c: "I²C sensor SDA / SCL (BME280, SHT31, AHT20)",
    leak: "Leak / water contact",
    door: "Door reed switch",
    battery: "Battery + through a 1:1 divider (2 × 100kΩ)",
  },
  i2cNote: "I²C sensors are found automatically; tick leak, door, or battery below so the board knows they're wired.",
  featherHtml:
    "<strong>Adafruit Feather (HUZZAH32 or ESP32 Feather V2):</strong> use the ESP32 column. Probe data (GPIO 4) is the pin labelled A5, the door switch (GPIO 26) is A0, and the leak contact goes on pin 27. The battery divider is already on the board: plug a LiPo into the battery connector and tick battery, no resistors needed. An I²C sensor goes on the Feather's own SDA/SCL pins or its STEMMA QT port; the firmware finds it there at startup (power-cycle after plugging one in). Feathers have no BOOT button on GPIO 0, so the 5-second reset won't work; to change Wi-Fi, send new settings from this page instead.",
  deviceKeyHtml:
    'Add a push device under <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> and copy its device key. The free plan includes two devices.',
  buyTitle: "What to buy",
  buyIntro:
    "Parts that match the pins above. A plain ESP32 is the tested choice and does everything here. The S3 and C3 links are Espressif's own dev boards, which the firmware is built for; when they're sold out, another ESP32-S3-DevKitC-1 or ESP32-C3-DevKitM-1 board (or a clone with the same pinout) works too.",
  leakHtml:
    '<strong>Leak sensor:</strong> the easiest low-cost option is an LM393 "rain / water sensor" module (sold by many shops): VCC to the board\'s 3.3V pin (never 5V, so its output stays safe for the ESP32), GND to GND, DO to the leak pin. Turn its dial until a drop of water reads Wet, then check it reads Dry again. Its exposed pads corrode if left wet, so treat it as a starter part. For a longer-lasting install, use two stainless screws or probes about 5&nbsp;mm apart, one to the leak pin and one to GND. Either way, test with your own water: very clean water or a thin film may not trip it. Sensors whose output goes high when wet, such as Adafruit\'s water sensor, need a different input and don\'t work with this firmware.',
  afterTitle: "After it is live",
  afterHtml:
    'Readings arrive once a minute. Mount the probe against the coldest pipe, set a freeze threshold of 34–38°F under <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a>, and send a test alert. See <a class="text-link" href="/answers/crawlspace-freeze-sensor-placement">where to put the sensor</a> and <a class="text-link" href="/answers/freeze-alarm-temperature-setting">what temperature to alert at</a>. Prefer to edit the code yourself? The <a class="text-link" href="/about/esp32-web-flash">other flashing options</a> cover Arduino, PlatformIO, MicroPython, and ESPHome.',
};

type FlashMessages = typeof en;

const es: FlashMessages = {
  title: "Flashea un sensor de congelación ESP32 desde el navegador",
  description:
    "Convierte un ESP32 y una sonda DS18B20 en sensor de congelación sin un IDE: flashea desde el navegador, pon el Wi-Fi y una clave de dispositivo, y listo.",
  breadcrumbHome: "Inicio",
  breadcrumbFlash: "Instalador web",
  faqs: [
    {
      question: "¿Qué necesito?",
      answer:
        "Una placa ESP32, ESP32-S3 o ESP32-C3; una sonda impermeable DS18B20 o un sensor de temperatura y humedad DHT22 (o DHT11) con una resistencia pull-up de 4,7 kΩ en GPIO 4; un cable USB de datos, y Chrome o Edge en un ordenador de sobremesa o portátil.",
    },
    {
      question: "¿Necesito el Arduino IDE?",
      answer:
        "No. El firmware viene precompilado y lo instala el navegador. El Wi-Fi y la clave del dispositivo se envían a la placa después de flashearla, así que no hay que compilar nada.",
    },
    {
      question: "¿Puedo añadir más de una sonda?",
      answer:
        "Sí, hasta cuatro sondas DS18B20 en el mismo pin. Aparecen como temp1 a temp4 y puedes renombrarlas en el panel. Un DHT22 es un único sensor por placa.",
    },
    {
      question: "¿Qué más puedo conectar?",
      answer:
        "Un sensor I²C de temperatura y humedad (BME280, SHT31 o AHT20, que se detectan automáticamente; el BME280 también mide la presión del aire), un contacto de fuga o de agua para alertas de inundación, un interruptor magnético de puerta y una batería a través de un divisor resistivo 1:1 para estimar su duración. Marca las opciones de fuga, puerta y batería al enviar los ajustes para que la placa sepa que están conectadas.",
    },
    {
      question: "¿Funciona con un DHT22?",
      answer:
        "Sí. Se cablea igual (datos a GPIO 4, 4,7 kΩ a 3,3 V). El firmware busca primero sondas DS18B20 y, si no hay ninguna, lee un DHT22 o DHT11 en ese pin, con temperatura y humedad. Una DS18B20 es mejor opción pegada a una tubería; un DHT22 va bien para el aire ambiente y la humedad de un sótano o un espacio bajo el suelo.",
    },
    {
      question: "¿Cómo cambio la placa a otra red?",
      answer:
        "Mantén pulsado el botón BOOT cinco segundos para borrar el Wi-Fi y la clave guardados, y luego envía los nuevos ajustes desde esta página o a través de la red ProbeHarbor-Setup.",
    },
    {
      question: "¿El firmware es de código abierto?",
      answer:
        "Sí. El código está en el repositorio de ProbeHarbor, en firmware/probeharbor-probe, junto con sketches que puedes editar y flashear tú mismo.",
    },
  ],
  buy: {
    board: "Placa (elige una)",
    s3c3: "O una placa S3 / C3 (la disponibilidad varía)",
    sensor: "Sensor en GPIO 4",
    i2c: "O un sensor de aire I²C (sin resistencia)",
    extras: "Extras opcionales",
    ds18b20: "Sonda impermeable DS18B20",
    resistor4k7: "Resistencias de 4,7 kΩ",
    bme280: "BME280 (añade presión del aire)",
    reed: "Interruptor magnético de puerta",
    resistor100k: "Resistencias de 100 kΩ (divisor de batería)",
  },
  kicker: "Instalación · Beta",
  heading: "Flashea un sensor de congelación desde el navegador",
  lede: "Sin Arduino IDE y sin tocar código. Conecta una sonda DS18B20 o un DHT22 a un ESP32, instala el firmware desde esta página y envíale tu Wi‑Fi y la clave del dispositivo por el mismo cable USB.",
  getKey: "Obtén una clave de dispositivo",
  startFreeGetKey: "Empieza gratis → obtén una clave de dispositivo",
  partsAndWiring: "Lista de piezas y cableado",
  beforeTitle: "Antes de empezar",
  wireHtml:
    'Cablea el sensor: alimentación a 3,3 V, tierra a GND y datos a GPIO 4, con una resistencia de 4,7 kΩ entre datos y 3,3 V (<a class="text-link" href="/about/esp32-freeze-kit">esquema</a>). Es igual para una sonda DS18B20 (cables rojo, negro y amarillo) que para un DHT22; el firmware detecta cuál está conectado.',
  extrasIntro: "Extras opcionales, en estos pines (cada interruptor o contacto va entre el pin y GND):",
  pinTable: {
    connect: "Conexión",
    data: "Datos del DS18B20 o DHT22",
    i2c: "Sensor I²C SDA / SCL (BME280, SHT31, AHT20)",
    leak: "Contacto de fuga / agua",
    door: "Interruptor reed de puerta",
    battery: "Batería + por un divisor 1:1 (2 × 100 kΩ)",
  },
  i2cNote:
    "Los sensores I²C se detectan automáticamente; marca fuga, puerta o batería abajo para que la placa sepa que están conectados.",
  featherHtml:
    "<strong>Adafruit Feather (HUZZAH32 o ESP32 Feather V2):</strong> usa la columna ESP32. Los datos de la sonda (GPIO 4) van al pin marcado A5, el interruptor de puerta (GPIO 26) al A0 y el contacto de fuga al pin 27. El divisor de batería ya viene en la placa: conecta una LiPo al conector de batería y marca batería, sin resistencias. Un sensor I²C va en los pines SDA/SCL de la propia Feather o en su puerto STEMMA QT; el firmware lo encuentra al arrancar (desconecta y vuelve a conectar la alimentación después de enchufarlo). Las Feather no tienen botón BOOT en GPIO 0, así que el reinicio de 5 segundos no funciona; para cambiar el Wi-Fi, envía nuevos ajustes desde esta página.",
  deviceKeyHtml:
    'Añade un dispositivo push en <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> y copia su clave de dispositivo. El plan gratuito incluye dos dispositivos.',
  buyTitle: "Qué comprar",
  buyIntro:
    "Piezas que encajan con los pines de arriba. Un ESP32 normal es la opción probada y hace todo lo que se describe aquí. Los enlaces S3 y C3 son las placas de desarrollo de la propia Espressif, para las que está compilado el firmware; si están agotadas, también sirve otra placa ESP32-S3-DevKitC-1 o ESP32-C3-DevKitM-1 (o un clon con el mismo pinout).",
  leakHtml:
    '<strong>Sensor de fugas:</strong> la opción barata más sencilla es un módulo LM393 de «sensor de lluvia / agua» (lo venden muchas tiendas): VCC al pin de 3,3 V de la placa (nunca a 5 V, para que su salida sea segura para el ESP32), GND a GND y DO al pin de fuga. Gira su potenciómetro hasta que una gota de agua marque mojado y comprueba que vuelve a marcar seco. Sus pistas expuestas se corroen si quedan mojadas, así que tómalo como una pieza para empezar. Para una instalación más duradera, usa dos tornillos o puntas de acero inoxidable separados unos 5&nbsp;mm, uno al pin de fuga y otro a GND. En cualquier caso, prueba con tu propia agua: el agua muy limpia o una película fina pueden no activarlo. Los sensores cuya salida pasa a nivel alto al mojarse, como el sensor de agua de Adafruit, necesitan otra entrada y no funcionan con este firmware.',
  afterTitle: "Cuando ya esté funcionando",
  afterHtml:
    'Las lecturas llegan una vez por minuto. Monta la sonda contra la tubería más fría, define un umbral de congelación de 1–3 °C (34–38 °F) en <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a> y envía una alerta de prueba. Consulta <a class="text-link" href="/answers/crawlspace-freeze-sensor-placement">dónde colocar el sensor</a> y <a class="text-link" href="/answers/freeze-alarm-temperature-setting">a qué temperatura alertar</a>. ¿Prefieres editar el código tú mismo? Las <a class="text-link" href="/about/esp32-web-flash">otras opciones de flasheo</a> cubren Arduino, PlatformIO, MicroPython y ESPHome.',
};

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
        "Une carte ESP32, ESP32-S3 ou ESP32-C3, une sonde étanche DS18B20 ou un capteur de température et d’humidité DHT22 (ou DHT11) avec une résistance de tirage de 4,7 kΩ sur GPIO 4, un câble USB de données, et Chrome ou Edge sur un ordinateur fixe ou portable.",
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
        "Un capteur I²C de température et d’humidité (BME280, SHT31 ou AHT20, détecté automatiquement ; le BME280 mesure aussi la pression atmosphérique), un contact de fuite ou d’eau pour les alertes d’inondation, un interrupteur magnétique de porte et une batterie via un pont diviseur 1:1 pour estimer son autonomie. Cochez les options fuite, porte et batterie en envoyant les réglages pour que la carte sache qu’ils sont câblés.",
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
    s3c3: "Ou une carte S3 / C3 (stock variable)",
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
    "Des pièces qui correspondent aux broches ci-dessus. Un ESP32 classique est le choix testé et fait tout ce qui est décrit ici. Les liens S3 et C3 renvoient aux cartes de développement d’Espressif, pour lesquelles le firmware est compilé ; en cas de rupture, une autre carte ESP32-S3-DevKitC-1 ou ESP32-C3-DevKitM-1 (ou un clone au brochage identique) fonctionne aussi.",
  leakHtml:
    '<strong>Capteur de fuite :</strong> l’option bon marché la plus simple est un module LM393 « capteur de pluie / d’eau » (vendu par de nombreuses boutiques) : VCC sur la broche 3,3 V de la carte (jamais 5 V, pour que sa sortie reste sans danger pour l’ESP32), GND sur GND, DO sur la broche de fuite. Tournez son potentiomètre jusqu’à ce qu’une goutte d’eau donne mouillé, puis vérifiez qu’il repasse à sec. Ses pistes à nu se corrodent si elles restent mouillées : voyez-le comme une pièce pour débuter. Pour une installation plus durable, utilisez deux vis ou pointes en inox espacées d’environ 5&nbsp;mm, l’une sur la broche de fuite, l’autre sur GND. Dans tous les cas, testez avec votre propre eau : une eau très pure ou une fine pellicule peut ne pas le déclencher. Les capteurs dont la sortie passe à l’état haut quand ils sont mouillés, comme le capteur d’eau d’Adafruit, nécessitent une autre entrée et ne fonctionnent pas avec ce firmware.',
  afterTitle: "Une fois en service",
  afterHtml:
    'Les relevés arrivent une fois par minute. Fixez la sonde contre le tuyau le plus froid, réglez un seuil de gel de 1 à 3 °C (34–38 °F) dans <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a> et envoyez une alerte de test. Voyez <a class="text-link" href="/answers/crawlspace-freeze-sensor-placement">où placer le capteur</a> et <a class="text-link" href="/answers/freeze-alarm-temperature-setting">à quelle température déclencher l’alerte</a>. Vous préférez modifier le code vous-même ? Les <a class="text-link" href="/about/esp32-web-flash">autres méthodes de flashage</a> couvrent Arduino, PlatformIO, MicroPython et ESPHome.',
};

const de: FlashMessages = {
  title: "ESP32-Frostsensor im Browser flashen",
  description:
    "Mach aus einem ESP32 und einem DS18B20-Fühler einen Frostsensor, ohne IDE: im Browser flashen, WLAN und Geräteschlüssel eingeben, fertig.",
  breadcrumbHome: "Start",
  breadcrumbFlash: "Web-Flasher",
  faqs: [
    {
      question: "Was brauche ich?",
      answer:
        "Ein ESP32-, ESP32-S3- oder ESP32-C3-Board, einen wasserdichten DS18B20-Fühler oder einen DHT22- (bzw. DHT11-)Sensor für Temperatur und Luftfeuchtigkeit mit 4,7-kΩ-Pull-up-Widerstand an GPIO 4, ein USB-Datenkabel sowie Chrome oder Edge auf einem Desktop-PC oder Laptop.",
    },
    {
      question: "Brauche ich die Arduino IDE?",
      answer:
        "Nein. Die Firmware ist vorkompiliert und wird vom Browser installiert. WLAN und Geräteschlüssel werden nach dem Flashen ans Board geschickt, du musst also nichts kompilieren.",
    },
    {
      question: "Kann ich mehr als einen Fühler anschließen?",
      answer:
        "Ja, bis zu vier DS18B20-Fühler am selben Pin. Sie melden sich als temp1 bis temp4 und lassen sich im Dashboard umbenennen. Ein DHT22 ist ein Sensor pro Board.",
    },
    {
      question: "Was kann ich noch anschließen?",
      answer:
        "Einen I²C-Sensor für Temperatur und Luftfeuchtigkeit (BME280, SHT31 oder AHT20, wird automatisch erkannt; ein BME280 meldet zusätzlich den Luftdruck), einen Leck- oder Wasserkontakt für Überschwemmungsalarme, einen magnetischen Türschalter und einen Akku über einen 1:1-Spannungsteiler für die Schätzung der Akkulaufzeit. Hake beim Senden der Einstellungen Leck, Tür und Akku an, damit das Board weiß, dass sie angeschlossen sind.",
    },
    {
      question: "Funktioniert es mit einem DHT22?",
      answer:
        "Ja. Er wird genauso verkabelt (Daten an GPIO 4, 4,7 kΩ an 3,3 V). Die Firmware sucht zuerst nach DS18B20-Fühlern und liest, wenn keine da sind, einen DHT22 oder DHT11 an diesem Pin aus, mit Temperatur und Luftfeuchtigkeit. Am Rohr ist ein DS18B20 die bessere Wahl; ein DHT22 eignet sich für Raumluft und Feuchte im Kriechkeller oder Keller.",
    },
    {
      question: "Wie bringe ich das Board in ein anderes Netzwerk?",
      answer:
        "Halte die BOOT-Taste fünf Sekunden gedrückt, um das gespeicherte WLAN und den Geräteschlüssel zu löschen, und sende dann neue Einstellungen über diese Seite oder über das Netzwerk ProbeHarbor-Setup.",
    },
    {
      question: "Ist die Firmware Open Source?",
      answer:
        "Ja. Der Quellcode liegt im ProbeHarbor-Repository unter firmware/probeharbor-probe, zusammen mit Sketches, die du selbst bearbeiten und flashen kannst.",
    },
  ],
  buy: {
    board: "Board (eins auswählen)",
    s3c3: "Oder ein S3-/C3-Board (Verfügbarkeit schwankt)",
    sensor: "Sensor an GPIO 4",
    i2c: "Oder ein I²C-Luftsensor (kein Widerstand nötig)",
    extras: "Optionale Extras",
    ds18b20: "Wasserdichter DS18B20-Fühler",
    resistor4k7: "4,7-kΩ-Widerstände",
    bme280: "BME280 (mit Luftdruck)",
    reed: "Magnetischer Türschalter",
    resistor100k: "100-kΩ-Widerstände (Akku-Spannungsteiler)",
  },
  kicker: "Einrichtung · Beta",
  heading: "Frostsensor im Browser flashen",
  lede: "Keine Arduino IDE, kein Code zum Anpassen. Schließ einen DS18B20-Fühler oder einen DHT22 an einen ESP32 an, installiere die Firmware über diese Seite und schick ihm dann WLAN und Geräteschlüssel über dasselbe USB-Kabel.",
  getKey: "Geräteschlüssel holen",
  startFreeGetKey: "Kostenlos starten → Geräteschlüssel holen",
  partsAndWiring: "Teileliste und Verkabelung",
  beforeTitle: "Bevor du anfängst",
  wireHtml:
    'Verkable den Sensor: Versorgung an 3,3 V, Masse an GND, Daten an GPIO 4, mit einem 4,7-kΩ-Widerstand zwischen Daten und 3,3 V (<a class="text-link" href="/about/esp32-freeze-kit">Schaltplan</a>). Das gilt für einen DS18B20-Fühler (rote, schwarze, gelbe Ader) genauso wie für einen DHT22; die Firmware erkennt, welcher angeschlossen ist.',
  extrasIntro: "Optionale Extras an diesen Pins (jeder Schalter oder Kontakt kommt zwischen Pin und GND):",
  pinTable: {
    connect: "Anschluss",
    data: "DS18B20- oder DHT22-Daten",
    i2c: "I²C-Sensor SDA / SCL (BME280, SHT31, AHT20)",
    leak: "Leck-/Wasserkontakt",
    door: "Tür-Reedschalter",
    battery: "Akku + über 1:1-Teiler (2 × 100 kΩ)",
  },
  i2cNote:
    "I²C-Sensoren werden automatisch erkannt; hake unten Leck, Tür oder Akku an, damit das Board weiß, dass sie angeschlossen sind.",
  featherHtml:
    "<strong>Adafruit Feather (HUZZAH32 oder ESP32 Feather V2):</strong> Nimm die ESP32-Spalte. Die Fühlerdaten (GPIO 4) liegen am Pin mit der Beschriftung A5, der Türschalter (GPIO 26) an A0, und der Leckkontakt kommt an Pin 27. Der Akku-Spannungsteiler ist schon auf dem Board: Steck einen LiPo-Akku in die Akkubuchse und hake Akku an, Widerstände brauchst du nicht. Ein I²C-Sensor kommt an die SDA/SCL-Pins des Feather oder an seinen STEMMA-QT-Port; die Firmware findet ihn beim Start (nach dem Anstecken einmal stromlos machen). Feathers haben keine BOOT-Taste an GPIO 0, daher funktioniert der 5-Sekunden-Reset nicht; um das WLAN zu wechseln, sende stattdessen neue Einstellungen über diese Seite.",
  deviceKeyHtml:
    'Lege unter <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> ein Push-Gerät an und kopiere seinen Geräteschlüssel. Im kostenlosen Tarif sind zwei Geräte enthalten.',
  buyTitle: "Was du kaufen solltest",
  buyIntro:
    "Teile, die zu den Pins oben passen. Ein normaler ESP32 ist die getestete Wahl und kann alles, was hier beschrieben ist. Die S3- und C3-Links führen zu Espressifs eigenen Entwicklerboards, für die die Firmware gebaut ist; sind sie ausverkauft, funktioniert auch ein anderes ESP32-S3-DevKitC-1- oder ESP32-C3-DevKitM-1-Board (oder ein Klon mit derselben Pinbelegung).",
  leakHtml:
    '<strong>Lecksensor:</strong> Die einfachste günstige Lösung ist ein LM393-Modul „Regen-/Wassersensor“ (gibt es in vielen Shops): VCC an den 3,3-V-Pin des Boards (nie 5 V, damit sein Ausgang für den ESP32 sicher bleibt), GND an GND, DO an den Leck-Pin. Dreh am Poti, bis ein Wassertropfen „nass“ ergibt, und prüfe dann, dass er wieder „trocken“ meldet. Die offenen Kontaktflächen korrodieren, wenn sie nass bleiben, also sieh ihn als Einsteigerteil. Für eine langlebigere Installation nimm zwei Edelstahlschrauben oder -spitzen im Abstand von etwa 5&nbsp;mm, eine an den Leck-Pin und eine an GND. So oder so: Teste mit deinem eigenen Wasser, denn sehr sauberes Wasser oder ein dünner Film lösen ihn eventuell nicht aus. Sensoren, deren Ausgang bei Nässe auf High geht, etwa der Wassersensor von Adafruit, brauchen einen anderen Eingang und funktionieren mit dieser Firmware nicht.',
  afterTitle: "Wenn er läuft",
  afterHtml:
    'Messwerte kommen einmal pro Minute an. Befestige den Fühler am kältesten Rohr, stell unter <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a> eine Frostschwelle von 1–3 °C (34–38 °F) ein und sende einen Testalarm. Lies, <a class="text-link" href="/answers/crawlspace-freeze-sensor-placement">wo der Sensor hingehört</a> und <a class="text-link" href="/answers/freeze-alarm-temperature-setting">bei welcher Temperatur du alarmieren solltest</a>. Du bearbeitest den Code lieber selbst? Die <a class="text-link" href="/about/esp32-web-flash">anderen Flash-Optionen</a> decken Arduino, PlatformIO, MicroPython und ESPHome ab.',
};

const ptBr: FlashMessages = {
  title: "Grave um sensor de congelamento ESP32 pelo navegador",
  description:
    "Transforme um ESP32 e uma sonda DS18B20 em sensor de congelamento sem instalar IDE: grave pelo navegador, informe o Wi-Fi e uma chave de dispositivo e pronto.",
  breadcrumbHome: "Início",
  breadcrumbFlash: "Gravador web",
  faqs: [
    {
      question: "Do que eu preciso?",
      answer:
        "Uma placa ESP32, ESP32-S3 ou ESP32-C3, uma sonda DS18B20 à prova d’água ou um sensor de temperatura e umidade DHT22 (ou DHT11) com um resistor pull-up de 4,7 kΩ no GPIO 4, um cabo USB de dados e o Chrome ou o Edge em um computador ou notebook.",
    },
    {
      question: "Preciso do Arduino IDE?",
      answer:
        "Não. O firmware vem pré-compilado e é instalado pelo navegador. O Wi-Fi e a chave do dispositivo são enviados para a placa depois da gravação, então não é preciso compilar nada.",
    },
    {
      question: "Posso adicionar mais de uma sonda?",
      answer:
        "Sim, até quatro sondas DS18B20 no mesmo pino. Elas aparecem como temp1 a temp4 e podem ser renomeadas no painel. Um DHT22 é um sensor por placa.",
    },
    {
      question: "O que mais posso conectar?",
      answer:
        "Um sensor I²C de temperatura e umidade (BME280, SHT31 ou AHT20, detectado automaticamente; o BME280 também informa a pressão do ar), um contato de vazamento ou de água para alertas de alagamento, um interruptor magnético de porta e uma bateria por um divisor resistivo 1:1 para estimar a autonomia. Marque as opções de vazamento, porta e bateria ao enviar as configurações para que a placa saiba que estão ligados.",
    },
    {
      question: "Funciona com um DHT22?",
      answer:
        "Sim. A ligação é a mesma (dados no GPIO 4, 4,7 kΩ para 3,3 V). O firmware procura primeiro sondas DS18B20 e, se não houver nenhuma, lê um DHT22 ou DHT11 nesse pino, informando temperatura e umidade. A DS18B20 é a melhor escolha encostada em um cano; o DHT22 serve para o ar do ambiente e a umidade de um porão ou vão sob o piso.",
    },
    {
      question: "Como passo a placa para outra rede?",
      answer:
        "Segure o botão BOOT por cinco segundos para apagar o Wi-Fi e a chave salvos e depois envie novas configurações por esta página ou pela rede ProbeHarbor-Setup.",
    },
    {
      question: "O firmware é open source?",
      answer:
        "Sim. O código-fonte está no repositório do ProbeHarbor, em firmware/probeharbor-probe, junto com sketches que você mesmo pode editar e gravar.",
    },
  ],
  buy: {
    board: "Placa (escolha uma)",
    s3c3: "Ou uma placa S3 / C3 (o estoque varia)",
    sensor: "Sensor no GPIO 4",
    i2c: "Ou um sensor de ar I²C (sem resistor)",
    extras: "Extras opcionais",
    ds18b20: "Sonda DS18B20 à prova d’água",
    resistor4k7: "Resistores de 4,7 kΩ",
    bme280: "BME280 (acrescenta pressão do ar)",
    reed: "Interruptor magnético de porta",
    resistor100k: "Resistores de 100 kΩ (divisor da bateria)",
  },
  kicker: "Instalação · Beta",
  heading: "Grave um sensor de congelamento pelo navegador",
  lede: "Sem Arduino IDE, sem mexer em código. Ligue uma sonda DS18B20 ou um DHT22 a um ESP32, instale o firmware por esta página e envie o Wi‑Fi e a chave do dispositivo pelo mesmo cabo USB.",
  getKey: "Pegue uma chave de dispositivo",
  startFreeGetKey: "Comece grátis → pegue uma chave de dispositivo",
  partsAndWiring: "Lista de peças e ligação",
  beforeTitle: "Antes de começar",
  wireHtml:
    'Ligue o sensor: alimentação em 3,3 V, terra em GND e dados no GPIO 4, com um resistor de 4,7 kΩ entre dados e 3,3 V (<a class="text-link" href="/about/esp32-freeze-kit">diagrama</a>). É igual para uma sonda DS18B20 (fios vermelho, preto e amarelo) e para um DHT22; o firmware detecta qual está conectado.',
  extrasIntro: "Extras opcionais, nestes pinos (cada interruptor ou contato fica entre o pino e o GND):",
  pinTable: {
    connect: "Ligação",
    data: "Dados do DS18B20 ou DHT22",
    i2c: "Sensor I²C SDA / SCL (BME280, SHT31, AHT20)",
    leak: "Contato de vazamento / água",
    door: "Reed switch da porta",
    battery: "Bateria + por um divisor 1:1 (2 × 100 kΩ)",
  },
  i2cNote:
    "Os sensores I²C são detectados automaticamente; marque vazamento, porta ou bateria abaixo para que a placa saiba que estão ligados.",
  featherHtml:
    "<strong>Adafruit Feather (HUZZAH32 ou ESP32 Feather V2):</strong> use a coluna ESP32. Os dados da sonda (GPIO 4) vão no pino marcado A5, o interruptor da porta (GPIO 26) no A0 e o contato de vazamento no pino 27. O divisor da bateria já está na placa: conecte uma LiPo no conector de bateria e marque bateria, sem resistores. Um sensor I²C vai nos pinos SDA/SCL da própria Feather ou na porta STEMMA QT; o firmware o encontra na inicialização (desligue e religue a alimentação depois de conectar). As Feather não têm botão BOOT no GPIO 0, então o reset de 5 segundos não funciona; para trocar o Wi-Fi, envie novas configurações por esta página.",
  deviceKeyHtml:
    'Adicione um dispositivo push em <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> e copie a chave do dispositivo. O plano gratuito inclui dois dispositivos.',
  buyTitle: "O que comprar",
  buyIntro:
    "Peças que combinam com os pinos acima. Um ESP32 comum é a opção testada e faz tudo o que está aqui. Os links S3 e C3 são das placas de desenvolvimento da própria Espressif, para as quais o firmware foi compilado; se estiverem esgotadas, outra placa ESP32-S3-DevKitC-1 ou ESP32-C3-DevKitM-1 (ou um clone com a mesma pinagem) também funciona.",
  leakHtml:
    '<strong>Sensor de vazamento:</strong> a opção barata mais fácil é um módulo LM393 de “sensor de chuva / água” (vendido em muitas lojas): VCC no pino de 3,3 V da placa (nunca 5 V, para a saída continuar segura para o ESP32), GND no GND e DO no pino de vazamento. Gire o trimpot até uma gota de água indicar molhado e confira que ele volta a indicar seco. As trilhas expostas oxidam se ficarem molhadas, então considere-o uma peça para começar. Para uma instalação mais durável, use dois parafusos ou pontas de aço inox a cerca de 5&nbsp;mm um do outro, um no pino de vazamento e outro no GND. De qualquer forma, teste com a sua própria água: água muito limpa ou uma película fina podem não acioná-lo. Sensores cuja saída vai para nível alto quando molhados, como o sensor de água da Adafruit, precisam de outra entrada e não funcionam com este firmware.',
  afterTitle: "Depois que estiver funcionando",
  afterHtml:
    'As leituras chegam uma vez por minuto. Prenda a sonda no cano mais frio, defina um limite de congelamento de 1–3 °C (34–38 °F) em <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a> e envie um alerta de teste. Veja <a class="text-link" href="/answers/crawlspace-freeze-sensor-placement">onde colocar o sensor</a> e <a class="text-link" href="/answers/freeze-alarm-temperature-setting">em que temperatura alertar</a>. Prefere editar o código você mesmo? As <a class="text-link" href="/about/esp32-web-flash">outras opções de gravação</a> cobrem Arduino, PlatformIO, MicroPython e ESPHome.',
};

export const flashMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

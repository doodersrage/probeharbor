import { defineMessages } from "../../translate";

/**
 * /about/esp32-freeze-kit body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Dashboard UI paths such as
 * "Dashboard → Devices" stay English because the dashboard is English-only.
 */
const en = {
  howTo: {
    name: "Build an ESP32 freeze probe for ProbeHarbor",
    steps: [
      {
        name: "Buy the freeze BOM",
        text: "Get an ESP32 with Wi-Fi, a waterproof DS18B20, and a 4.7kΩ pull-up if the probe pack does not include one. Prefer Adafruit product pages; Amazon /dp/ links are optional alternatives.",
      },
      {
        name: "Wire the DS18B20",
        text: "Connect VCC to 3.3V, GND to GND, and data to GPIO 4 with a 4.7kΩ pull-up between data and 3.3V. Strap the stainless tip to the coldest pipe or north wall.",
      },
      {
        name: "Create a push device",
        text: "Create a free ProbeHarbor account and a push device on Dashboard → Devices, and copy its device key.",
      },
      {
        name: "Install from the browser and verify",
        text: "Plug the ESP32 into USB, open the web flasher in Chrome or Edge, install the firmware, and send your Wi-Fi and device key. The page confirms when the first reading arrives. No Arduino IDE needed.",
      },
      {
        name: "Enable freeze alerts",
        text: "Set freeze threshold and email under Alerts → When to alert, send a test alert, and optionally turn on the time-to-freeze warning.",
      },
    ],
  },
  introHtml:
    'ProbeHarbor does not sell hardware. Buy the parts below, then install the firmware from your browser with the <a class="text-link" href="/flash">web flasher</a>: no Arduino IDE, no code, and it sends the board your Wi‑Fi and device key over the same USB cable. If you\'d rather read or edit the code, the sketches under <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer">ds18b20_ingest</a> expect an <strong>ESP32 with Wi‑Fi</strong> and a <strong>waterproof DS18B20</strong>. Buy the parts below (Adafruit for known SKUs, Amazon product links when you want a cheaper DevKit), then create a push device and flash a pre-filled sketch from <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> instead.',
  bom: {
    title: "Recommended freeze BOM",
    caption: "Parts for an ESP32 freeze probe",
    colPart: "Part",
    colWhy: "Why",
    colBuy: "Buy",
    boardPart: "ESP32 board",
    boardWhy: "HTTPS push ingest over Wi‑Fi (TLS on-chip)",
    amazonDevKit: "Amazon DevKit",
    probePart: "Waterproof DS18B20",
    probeWhy: "Pipe / crawlspace probe; works below freezing",
    includesPullupHtml: "(includes 4.7&nbsp;kΩ)",
    amazonProbe: "Amazon probe",
    pullupPartHtml: "4.7&nbsp;kΩ pull-up",
    pullupWhy: "Required on the 1-Wire data line if the probe pack does not include one",
    amazonResistor: "Amazon 4.7k",
    powerPart: "USB power",
    powerWhy: "Wall wart or USB-C cable; keep the board warmer than the probe bay when you can",
    powerBuyHtml: "Any 5&nbsp;V USB supply rated ≥500&nbsp;mA",
  },
  bomNoteHtml:
    "Product listings rotate: treat Adafruit as the reference BOM. Amazon <code>/dp/</code> links in <code>bomLinks</code> are Associates-friendly alternatives when a listing is still live. Generic “ESP32 + DS18B20 kit” bundles often ship DHT11 instead of a waterproof probe — skip those.",
  wire: {
    title: "Wire it",
    diagramAlt: "Wiring diagram: ESP32 DevKit to waterproof DS18B20 with 4.7 kilohm pull-up on GPIO 4",
    captionHtml:
      "Red → 3.3&nbsp;V, black → GND, yellow/white data → GPIO 4, with a 4.7&nbsp;kΩ pull-up between data and 3.3&nbsp;V. The sample ingest sketch defaults to GPIO 4.",
    itemsHtml: [
      "<strong>Red</strong> (VCC) → ESP32 3.3&nbsp;V",
      "<strong>Black</strong> (GND) → GND",
      "<strong>Yellow / white</strong> (data) → GPIO 4 (sample sketch default; any free digital GPIO works if you change the pin)",
      "4.7&nbsp;kΩ between data and 3.3&nbsp;V",
    ],
    featherHtml:
      'On an Adafruit Feather (HUZZAH32 or ESP32 Feather V2), GPIO 4 is the pin labelled <strong>A5</strong>. See the <a class="text-link" href="/flash#feather-pins">Feather notes on the flasher page</a> for the extras.',
    strap:
      "Strap the stainless probe to the coldest pipe or north wall with a cable tie, then wrap foam insulation over probe + a short pipe segment so you read pipe temperature, not room air.",
  },
  flash: {
    title: "Flash and connect",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Create a free account</a> and a push device on Devices.',
      'Open the <a class="text-link" href="/flash">web flasher</a> in Chrome or Edge, plug in the ESP32, click Install, then send your Wi‑Fi and device key. It reports "First reading delivered" when the probe is live.',
      'Prefer code? Download the pre-filled Arduino <code>.ino</code> or MicroPython <code>.py</code> from Devices and flash it per <a class="text-link" href="/about/esp32-web-flash">ESP32 flashing options</a> (Serial 115200 should show <code>POST 200</code>).',
      'Optional: print the ingest <a class="text-link" href="/about/kit-qr-onboarding">kit QR</a> on the enclosure.',
      'Set freeze threshold + email under <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> and turn on the time-to-freeze warning if you want a heads-up before the probe crosses freeze.',
    ],
  },
  avoid: {
    title: "What not to buy for pipe freeze",
    itemsHtml: [
      "<strong>DHT11-only starter kits</strong>: weak below freezing; short leads; not waterproof.",
      "<strong>Bluetooth / Zigbee room pods</strong>: they do not speak ProbeHarbor push ingest.",
      "<strong>Uno + Ethernet alone</strong>: needs a LAN HTTPS relay; fine for advanced builds, not first kit.",
    ],
    dhtNoteHtml: (highTempLink: string) =>
      `DHT22 still works for shop air + humidity (your Ethernet garage case study). For pipes, prefer DS18B20. High-temp PTFE cable: ${highTempLink} if the probe sits near a water heater or heat tape.`,
  },
  extras: {
    title: "Optional extras",
    itemsHtml: [
      "Second DS18B20 on the same 1-Wire bus for door bay vs pipe wall (multi-zone).",
      "Ventilated ABS enclosure + cable gland for the ESP32 in a dusty garage.",
      "ELEGOO / generic ESP32 starter kits are fine <em>if</em> you still add a waterproof DS18B20: their bundled DHT11 is not the freeze probe.",
    ],
  },
  related: {
    title: "Related",
    labels: [
      "Adding push and pull devices",
      "ESP32 flashing options",
      "Raspberry Pi Pico W ingest",
      "Kit QR onboarding",
      "Probe mount kit",
      "Hardware accessories",
      "Probe mounting and enclosures",
      "Freeze season checklist",
    ],
  },
};
type Esp32FreezeKitMessages = typeof en;

const es: Esp32FreezeKitMessages = {
  howTo: {
    name: "Arma una sonda de congelación ESP32 para ProbeHarbor",
    steps: [
      {
        name: "Compra la lista de materiales",
        text: "Consigue un ESP32 con Wi-Fi, un DS18B20 impermeable y una resistencia pull-up de 4,7 kΩ si el paquete de la sonda no la incluye. Prioriza las páginas de producto de Adafruit; los enlaces /dp/ de Amazon son alternativas opcionales.",
      },
      {
        name: "Conecta el DS18B20",
        text: "Conecta VCC a 3,3 V, GND a GND y datos a GPIO 4, con una pull-up de 4,7 kΩ entre datos y 3,3 V. Sujeta la punta de acero inoxidable a la tubería más fría o a la pared norte.",
      },
      {
        name: "Crea un dispositivo push",
        text: "Crea una cuenta gratuita de ProbeHarbor y un dispositivo push en Dashboard → Devices, y copia su clave de dispositivo.",
      },
      {
        name: "Instala desde el navegador y verifica",
        text: "Conecta el ESP32 por USB, abre el flasheador web en Chrome o Edge, instala el firmware y envía tu Wi-Fi y tu clave de dispositivo. La página confirma cuando llega la primera lectura. No necesitas el Arduino IDE.",
      },
      {
        name: "Activa las alertas de congelación",
        text: "Define el umbral de congelación y el correo en Alerts → When to alert, envía una alerta de prueba y, si quieres, activa el aviso de tiempo hasta la congelación.",
      },
    ],
  },
  introHtml:
    'ProbeHarbor no vende hardware. Compra las piezas de abajo y luego instala el firmware desde tu navegador con el <a class="text-link" href="/flash">flasheador web</a>: sin Arduino IDE, sin código, y envía a la placa tu Wi‑Fi y tu clave de dispositivo por el mismo cable USB. Si prefieres leer o editar el código, los sketches de <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer">ds18b20_ingest</a> esperan un <strong>ESP32 con Wi‑Fi</strong> y un <strong>DS18B20 impermeable</strong>. Compra las piezas de abajo (Adafruit para SKU conocidos, enlaces de producto de Amazon si quieres un DevKit más barato) y, en su lugar, crea un dispositivo push y flashea un sketch ya rellenado desde <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>.',
  bom: {
    title: "Lista de materiales recomendada",
    caption: "Piezas para una sonda de congelación ESP32",
    colPart: "Pieza",
    colWhy: "Por qué",
    colBuy: "Comprar",
    boardPart: "Placa ESP32",
    boardWhy: "Ingesta push por HTTPS sobre Wi‑Fi (TLS integrado en el chip)",
    amazonDevKit: "DevKit en Amazon",
    probePart: "DS18B20 impermeable",
    probeWhy: "Sonda para tuberías o sótano ventilado; funciona bajo cero",
    includesPullupHtml: "(incluye 4,7&nbsp;kΩ)",
    amazonProbe: "Sonda en Amazon",
    pullupPartHtml: "Pull-up de 4,7&nbsp;kΩ",
    pullupWhy: "Obligatoria en la línea de datos 1-Wire si el paquete de la sonda no la incluye",
    amazonResistor: "4,7k en Amazon",
    powerPart: "Alimentación USB",
    powerWhy: "Cargador de pared o cable USB-C; cuando puedas, deja la placa en un lugar más cálido que el de la sonda",
    powerBuyHtml: "Cualquier fuente USB de 5&nbsp;V de ≥500&nbsp;mA",
  },
  bomNoteHtml:
    "Los anuncios de productos cambian: toma Adafruit como lista de referencia. Los enlaces <code>/dp/</code> de Amazon en <code>bomLinks</code> son alternativas compatibles con Associates mientras el anuncio siga activo. Los paquetes genéricos “kit ESP32 + DS18B20” suelen traer un DHT11 en lugar de una sonda impermeable: evítalos.",
  wire: {
    title: "Conéctalo",
    diagramAlt: "Diagrama de cableado: ESP32 DevKit a un DS18B20 impermeable con pull-up de 4,7 kiloohmios en GPIO 4",
    captionHtml:
      "Rojo → 3,3&nbsp;V, negro → GND, datos amarillo/blanco → GPIO 4, con una pull-up de 4,7&nbsp;kΩ entre datos y 3,3&nbsp;V. El sketch de ingesta de ejemplo usa GPIO 4 por defecto.",
    itemsHtml: [
      "<strong>Rojo</strong> (VCC) → ESP32 3,3&nbsp;V",
      "<strong>Negro</strong> (GND) → GND",
      "<strong>Amarillo / blanco</strong> (datos) → GPIO 4 (valor por defecto del sketch de ejemplo; sirve cualquier GPIO digital libre si cambias el pin)",
      "4,7&nbsp;kΩ entre datos y 3,3&nbsp;V",
    ],
    featherHtml:
      'En una Adafruit Feather (HUZZAH32 o ESP32 Feather V2), GPIO 4 es el pin marcado como <strong>A5</strong>. Consulta las <a class="text-link" href="/flash#feather-pins">notas sobre Feather en la página del flasheador</a> para los detalles adicionales.',
    strap:
      "Sujeta la sonda de acero inoxidable a la tubería más fría o a la pared norte con una brida y envuelve la sonda y un tramo corto de tubería con aislante de espuma, para medir la temperatura de la tubería y no la del aire de la habitación.",
  },
  flash: {
    title: "Flashea y conecta",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Crea una cuenta gratuita</a> y un dispositivo push en Devices.',
      'Abre el <a class="text-link" href="/flash">flasheador web</a> en Chrome o Edge, conecta el ESP32, haz clic en Install y envía tu Wi‑Fi y tu clave de dispositivo. Muestra "First reading delivered" cuando la sonda ya está activa.',
      '¿Prefieres código? Descarga el <code>.ino</code> de Arduino o el <code>.py</code> de MicroPython ya rellenados desde Devices y flashéalos según las <a class="text-link" href="/about/esp32-web-flash">opciones de flasheo del ESP32</a> (el monitor serie a 115200 debería mostrar <code>POST 200</code>).',
      'Opcional: imprime el <a class="text-link" href="/about/kit-qr-onboarding">QR del kit</a> de ingesta en la caja.',
      'Define el umbral de congelación y el correo en <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> y activa el aviso de tiempo hasta la congelación si quieres saberlo antes de que la sonda llegue al punto de congelación.',
    ],
  },
  avoid: {
    title: "Qué no comprar para la congelación de tuberías",
    itemsHtml: [
      "<strong>Kits de inicio solo con DHT11</strong>: rinden mal bajo cero, cables cortos y no son impermeables.",
      "<strong>Sensores de ambiente Bluetooth / Zigbee</strong>: no hablan la ingesta push de ProbeHarbor.",
      "<strong>Uno + Ethernet a secas</strong>: necesita un relé HTTPS en la LAN; bien para montajes avanzados, no para el primer kit.",
    ],
    dhtNoteHtml: (highTempLink: string) =>
      `El DHT22 sigue sirviendo para el aire y la humedad del taller (tu caso de garaje con Ethernet). Para tuberías, mejor DS18B20. Cable de PTFE para alta temperatura: ${highTempLink} si la sonda está cerca de un calentador de agua o de un cable calefactor.`,
  },
  extras: {
    title: "Extras opcionales",
    itemsHtml: [
      "Un segundo DS18B20 en el mismo bus 1-Wire para comparar la zona de la puerta con la pared de la tubería (multizona).",
      "Caja de ABS ventilada + prensaestopas para el ESP32 en un garaje con polvo.",
      "Los kits de inicio ELEGOO o ESP32 genéricos sirven <em>si</em> añades igualmente un DS18B20 impermeable: el DHT11 que traen no es la sonda de congelación.",
    ],
  },
  related: {
    title: "Relacionado",
    labels: [
      "Añadir dispositivos push y pull",
      "Opciones de flasheo del ESP32",
      "Ingesta con Raspberry Pi Pico W",
      "Alta con el QR del kit",
      "Kit de montaje de sondas",
      "Accesorios de hardware",
      "Montaje de sondas y cajas",
      "Lista de control para la temporada de heladas",
    ],
  },
};

const fr: Esp32FreezeKitMessages = {
  howTo: {
    name: "Fabriquer une sonde antigel ESP32 pour ProbeHarbor",
    steps: [
      {
        name: "Acheter la nomenclature",
        text: "Procurez-vous un ESP32 avec Wi-Fi, un DS18B20 étanche et une résistance de pull-up de 4,7 kΩ si le lot de la sonde n’en contient pas. Privilégiez les fiches produit Adafruit ; les liens Amazon /dp/ sont des alternatives facultatives.",
      },
      {
        name: "Câbler le DS18B20",
        text: "Reliez VCC au 3,3 V, GND à GND et la donnée au GPIO 4, avec une pull-up de 4,7 kΩ entre la donnée et le 3,3 V. Fixez la pointe inox sur le tuyau le plus froid ou le mur nord.",
      },
      {
        name: "Créer un appareil push",
        text: "Créez un compte ProbeHarbor gratuit et un appareil push dans Dashboard → Devices, puis copiez sa clé d’appareil.",
      },
      {
        name: "Installer depuis le navigateur et vérifier",
        text: "Branchez l’ESP32 en USB, ouvrez le flasheur web dans Chrome ou Edge, installez le firmware et envoyez votre Wi-Fi et votre clé d’appareil. La page confirme l’arrivée de la première mesure. Pas besoin de l’Arduino IDE.",
      },
      {
        name: "Activer les alertes de gel",
        text: "Réglez le seuil de gel et l’e-mail dans Alerts → When to alert, envoyez une alerte de test et, si vous le souhaitez, activez l’avertissement de délai avant le gel.",
      },
    ],
  },
  introHtml:
    'ProbeHarbor ne vend pas de matériel. Achetez les pièces ci-dessous, puis installez le firmware depuis votre navigateur avec le <a class="text-link" href="/flash">flasheur web</a> : ni Arduino IDE ni code, et il transmet à la carte votre Wi‑Fi et votre clé d’appareil par le même câble USB. Si vous préférez lire ou modifier le code, les sketches de <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer">ds18b20_ingest</a> attendent un <strong>ESP32 avec Wi‑Fi</strong> et un <strong>DS18B20 étanche</strong>. Achetez les pièces ci-dessous (Adafruit pour les références connues, les liens produit Amazon si vous voulez un DevKit moins cher), puis créez un appareil push et flashez plutôt un sketch prérempli depuis <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>.',
  bom: {
    title: "Nomenclature antigel recommandée",
    caption: "Pièces pour une sonde antigel ESP32",
    colPart: "Pièce",
    colWhy: "Pourquoi",
    colBuy: "Acheter",
    boardPart: "Carte ESP32",
    boardWhy: "Envoi push en HTTPS via Wi‑Fi (TLS intégré à la puce)",
    amazonDevKit: "DevKit sur Amazon",
    probePart: "DS18B20 étanche",
    probeWhy: "Sonde pour tuyau ou vide sanitaire ; fonctionne sous zéro",
    includesPullupHtml: "(4,7&nbsp;kΩ inclus)",
    amazonProbe: "Sonde sur Amazon",
    pullupPartHtml: "Pull-up de 4,7&nbsp;kΩ",
    pullupWhy: "Obligatoire sur la ligne de données 1-Wire si le lot de la sonde n’en contient pas",
    amazonResistor: "4,7k sur Amazon",
    powerPart: "Alimentation USB",
    powerWhy: "Bloc secteur ou câble USB-C ; si possible, gardez la carte plus au chaud que l’emplacement de la sonde",
    powerBuyHtml: "N’importe quelle alimentation USB 5&nbsp;V d’au moins 500&nbsp;mA",
  },
  bomNoteHtml:
    "Les fiches produit changent : considérez Adafruit comme la nomenclature de référence. Les liens Amazon <code>/dp/</code> de <code>bomLinks</code> sont des alternatives compatibles Partenaires tant que l’annonce existe. Les lots génériques « kit ESP32 + DS18B20 » livrent souvent un DHT11 au lieu d’une sonde étanche : évitez-les.",
  wire: {
    title: "Câblage",
    diagramAlt: "Schéma de câblage : ESP32 DevKit vers un DS18B20 étanche avec pull-up de 4,7 kiloohms sur le GPIO 4",
    captionHtml:
      "Rouge → 3,3&nbsp;V, noir → GND, donnée jaune/blanc → GPIO 4, avec une pull-up de 4,7&nbsp;kΩ entre la donnée et le 3,3&nbsp;V. Le sketch d’ingestion d’exemple utilise le GPIO 4 par défaut.",
    itemsHtml: [
      "<strong>Rouge</strong> (VCC) → ESP32 3,3&nbsp;V",
      "<strong>Noir</strong> (GND) → GND",
      "<strong>Jaune / blanc</strong> (donnée) → GPIO 4 (valeur par défaut du sketch d’exemple ; tout GPIO numérique libre convient si vous changez la broche)",
      "4,7&nbsp;kΩ entre la donnée et le 3,3&nbsp;V",
    ],
    featherHtml:
      'Sur une Adafruit Feather (HUZZAH32 ou ESP32 Feather V2), le GPIO 4 est la broche marquée <strong>A5</strong>. Consultez les <a class="text-link" href="/flash#feather-pins">notes Feather de la page du flasheur</a> pour les détails supplémentaires.',
    strap:
      "Fixez la sonde inox sur le tuyau le plus froid ou le mur nord avec un collier de serrage, puis entourez la sonde et un court tronçon de tuyau d’isolant en mousse : vous mesurez ainsi la température du tuyau, pas celle de l’air ambiant.",
  },
  flash: {
    title: "Flasher et connecter",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Créez un compte gratuit</a> et un appareil push dans Devices.',
      'Ouvrez le <a class="text-link" href="/flash">flasheur web</a> dans Chrome ou Edge, branchez l’ESP32, cliquez sur Install, puis envoyez votre Wi‑Fi et votre clé d’appareil. Il affiche « First reading delivered » quand la sonde est en ligne.',
      'Vous préférez le code ? Téléchargez le <code>.ino</code> Arduino ou le <code>.py</code> MicroPython prérempli depuis Devices et flashez-le selon les <a class="text-link" href="/about/esp32-web-flash">options de flashage de l’ESP32</a> (le moniteur série à 115200 doit afficher <code>POST 200</code>).',
      'Facultatif : imprimez le <a class="text-link" href="/about/kit-qr-onboarding">QR du kit</a> d’ingestion sur le boîtier.',
      'Réglez le seuil de gel et l’e-mail dans <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> et activez l’avertissement de délai avant le gel si vous voulez être prévenu avant que la sonde n’atteigne le gel.',
    ],
  },
  avoid: {
    title: "Ce qu’il ne faut pas acheter contre le gel des tuyaux",
    itemsHtml: [
      "<strong>Kits de démarrage avec DHT11 seul</strong> : peu fiables sous zéro, fils courts, pas étanches.",
      "<strong>Capteurs d’ambiance Bluetooth / Zigbee</strong> : ils ne parlent pas l’ingestion push de ProbeHarbor.",
      "<strong>Uno + Ethernet seul</strong> : nécessite un relais HTTPS sur le réseau local ; bien pour les montages avancés, pas pour un premier kit.",
    ],
    dhtNoteHtml: (highTempLink: string) =>
      `Le DHT22 convient toujours pour l’air et l’humidité de l’atelier (votre étude de cas du garage en Ethernet). Pour les tuyaux, préférez le DS18B20. Câble PTFE haute température : ${highTempLink} si la sonde se trouve près d’un chauffe-eau ou d’un câble chauffant.`,
  },
  extras: {
    title: "Extras facultatifs",
    itemsHtml: [
      "Un second DS18B20 sur le même bus 1-Wire pour comparer la zone de la porte et le mur du tuyau (multizone).",
      "Boîtier ABS ventilé + presse-étoupe pour l’ESP32 dans un garage poussiéreux.",
      "Les kits de démarrage ELEGOO ou ESP32 génériques conviennent <em>si</em> vous ajoutez quand même un DS18B20 étanche : leur DHT11 fourni n’est pas la sonde antigel.",
    ],
  },
  related: {
    title: "À lire aussi",
    labels: [
      "Ajouter des appareils push et pull",
      "Options de flashage de l’ESP32",
      "Ingestion avec le Raspberry Pi Pico W",
      "Mise en service par QR du kit",
      "Kit de fixation de sonde",
      "Accessoires matériels",
      "Fixation des sondes et boîtiers",
      "Check-list de la saison du gel",
    ],
  },
};

const de: Esp32FreezeKitMessages = {
  howTo: {
    name: "Einen ESP32-Frostfühler für ProbeHarbor bauen",
    steps: [
      {
        name: "Die Frost-Stückliste kaufen",
        text: "Besorge einen ESP32 mit WLAN, einen wasserdichten DS18B20 und einen 4,7-kΩ-Pull-up-Widerstand, falls dem Fühler keiner beiliegt. Bevorzuge die Adafruit-Produktseiten; Amazon-/dp/-Links sind optionale Alternativen.",
      },
      {
        name: "Den DS18B20 verdrahten",
        text: "Verbinde VCC mit 3,3 V, GND mit GND und die Datenleitung mit GPIO 4, mit einem 4,7-kΩ-Pull-up zwischen Daten und 3,3 V. Befestige die Edelstahlspitze am kältesten Rohr oder an der Nordwand.",
      },
      {
        name: "Ein Push-Gerät anlegen",
        text: "Lege ein kostenloses ProbeHarbor-Konto und unter Dashboard → Devices ein Push-Gerät an und kopiere dessen Geräteschlüssel.",
      },
      {
        name: "Im Browser installieren und prüfen",
        text: "Schließe den ESP32 per USB an, öffne den Web-Flasher in Chrome oder Edge, installiere die Firmware und sende dein WLAN und den Geräteschlüssel. Die Seite bestätigt, sobald der erste Messwert ankommt. Keine Arduino IDE nötig.",
      },
      {
        name: "Frostalarme aktivieren",
        text: "Lege unter Alerts → When to alert Frostschwelle und E-Mail fest, sende einen Testalarm und schalte optional die Warnung zur Zeit bis zum Frost ein.",
      },
    ],
  },
  introHtml:
    'ProbeHarbor verkauft keine Hardware. Kauf die Teile unten und installiere die Firmware dann im Browser mit dem <a class="text-link" href="/flash">Web-Flasher</a>: keine Arduino IDE, kein Code, und er überträgt WLAN und Geräteschlüssel über dasselbe USB-Kabel an die Platine. Wenn du den Code lieber lesen oder anpassen willst: Die Sketches unter <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer">ds18b20_ingest</a> erwarten einen <strong>ESP32 mit WLAN</strong> und einen <strong>wasserdichten DS18B20</strong>. Kauf die Teile unten (Adafruit für bekannte Artikelnummern, Amazon-Produktlinks für ein günstigeres DevKit), lege dann ein Push-Gerät an und flashe stattdessen einen vorausgefüllten Sketch aus <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>.',
  bom: {
    title: "Empfohlene Frost-Stückliste",
    caption: "Teile für einen ESP32-Frostfühler",
    colPart: "Teil",
    colWhy: "Wozu",
    colBuy: "Kaufen",
    boardPart: "ESP32-Platine",
    boardWhy: "HTTPS-Push-Übertragung per WLAN (TLS auf dem Chip)",
    amazonDevKit: "DevKit bei Amazon",
    probePart: "Wasserdichter DS18B20",
    probeWhy: "Fühler für Rohr oder Kriechkeller; funktioniert unter dem Gefrierpunkt",
    includesPullupHtml: "(inkl. 4,7&nbsp;kΩ)",
    amazonProbe: "Fühler bei Amazon",
    pullupPartHtml: "4,7-kΩ-Pull-up",
    pullupWhy: "Auf der 1-Wire-Datenleitung erforderlich, falls dem Fühler keiner beiliegt",
    amazonResistor: "4,7k bei Amazon",
    powerPart: "USB-Stromversorgung",
    powerWhy: "Steckernetzteil oder USB-C-Kabel; die Platine nach Möglichkeit wärmer unterbringen als den Fühler",
    powerBuyHtml: "Beliebiges 5-V-USB-Netzteil mit ≥500&nbsp;mA",
  },
  bomNoteHtml:
    "Produktangebote wechseln: Nimm Adafruit als Referenz-Stückliste. Die Amazon-<code>/dp/</code>-Links in <code>bomLinks</code> sind Partnerprogramm-taugliche Alternativen, solange das Angebot noch besteht. Generische „ESP32 + DS18B20 Kit“-Bundles enthalten oft einen DHT11 statt eines wasserdichten Fühlers – lass die besser liegen.",
  wire: {
    title: "Verdrahten",
    diagramAlt: "Schaltplan: ESP32 DevKit an wasserdichten DS18B20 mit 4,7-Kiloohm-Pull-up an GPIO 4",
    captionHtml:
      "Rot → 3,3&nbsp;V, Schwarz → GND, Gelb/Weiß (Daten) → GPIO 4, mit einem 4,7-kΩ-Pull-up zwischen Daten und 3,3&nbsp;V. Der Beispiel-Sketch nutzt standardmäßig GPIO 4.",
    itemsHtml: [
      "<strong>Rot</strong> (VCC) → ESP32 3,3&nbsp;V",
      "<strong>Schwarz</strong> (GND) → GND",
      "<strong>Gelb / Weiß</strong> (Daten) → GPIO 4 (Standard im Beispiel-Sketch; jeder freie digitale GPIO geht, wenn du den Pin änderst)",
      "4,7&nbsp;kΩ zwischen Daten und 3,3&nbsp;V",
    ],
    featherHtml:
      'Auf einem Adafruit Feather (HUZZAH32 oder ESP32 Feather V2) ist GPIO 4 der Pin mit der Beschriftung <strong>A5</strong>. Weitere Details findest du in den <a class="text-link" href="/flash#feather-pins">Feather-Hinweisen auf der Flasher-Seite</a>.',
    strap:
      "Befestige den Edelstahlfühler mit einem Kabelbinder am kältesten Rohr oder an der Nordwand und umwickle Fühler und ein kurzes Rohrstück mit Schaumstoffisolierung, damit du die Rohrtemperatur misst und nicht die Raumluft.",
  },
  flash: {
    title: "Flashen und verbinden",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Lege ein kostenloses Konto an</a> und unter Devices ein Push-Gerät.',
      'Öffne den <a class="text-link" href="/flash">Web-Flasher</a> in Chrome oder Edge, schließe den ESP32 an, klicke auf Install und sende dann WLAN und Geräteschlüssel. Sobald der Fühler live ist, meldet er "First reading delivered".',
      'Lieber Code? Lade den vorausgefüllten Arduino-<code>.ino</code> oder MicroPython-<code>.py</code> unter Devices herunter und flashe ihn wie in den <a class="text-link" href="/about/esp32-web-flash">ESP32-Flash-Optionen</a> beschrieben (der serielle Monitor mit 115200 sollte <code>POST 200</code> zeigen).',
      'Optional: Druck den <a class="text-link" href="/about/kit-qr-onboarding">Kit-QR-Code</a> für die Datenübertragung aufs Gehäuse.',
      'Lege Frostschwelle und E-Mail unter <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> fest und schalte die Warnung zur Zeit bis zum Frost ein, wenn du vorab Bescheid bekommen willst, bevor der Fühler die Frostgrenze unterschreitet.',
    ],
  },
  avoid: {
    title: "Was du gegen eingefrorene Rohre nicht kaufen solltest",
    itemsHtml: [
      "<strong>Starterkits nur mit DHT11</strong>: schwach unter dem Gefrierpunkt, kurze Leitungen, nicht wasserdicht.",
      "<strong>Bluetooth-/Zigbee-Raumsensoren</strong>: Sie sprechen kein ProbeHarbor-Push.",
      "<strong>Uno + Ethernet allein</strong>: braucht ein HTTPS-Relay im LAN; gut für fortgeschrittene Aufbauten, nicht fürs erste Kit.",
    ],
    dhtNoteHtml: (highTempLink: string) =>
      `Ein DHT22 taugt weiterhin für Werkstattluft und Luftfeuchte (deine Ethernet-Garagen-Fallstudie). Für Rohre lieber DS18B20. Hochtemperatur-PTFE-Kabel: ${highTempLink}, wenn der Fühler nahe am Warmwasserbereiter oder an einem Heizband sitzt.`,
  },
  extras: {
    title: "Optionale Extras",
    itemsHtml: [
      "Ein zweiter DS18B20 am selben 1-Wire-Bus für Torbereich vs. Rohrwand (mehrere Zonen).",
      "Belüftetes ABS-Gehäuse + Kabelverschraubung für den ESP32 in einer staubigen Garage.",
      "ELEGOO- oder generische ESP32-Starterkits sind in Ordnung, <em>wenn</em> du trotzdem einen wasserdichten DS18B20 ergänzt: Der beiliegende DHT11 ist nicht der Frostfühler.",
    ],
  },
  related: {
    title: "Verwandte Themen",
    labels: [
      "Push- und Pull-Geräte hinzufügen",
      "ESP32-Flash-Optionen",
      "Datenübertragung mit dem Raspberry Pi Pico W",
      "Einrichtung per Kit-QR-Code",
      "Fühler-Montageset",
      "Hardware-Zubehör",
      "Fühlermontage und Gehäuse",
      "Checkliste für die Frostsaison",
    ],
  },
};

const ptBr: Esp32FreezeKitMessages = {
  howTo: {
    name: "Monte uma sonda de congelamento ESP32 para o ProbeHarbor",
    steps: [
      {
        name: "Compre a lista de materiais",
        text: "Arrume um ESP32 com Wi-Fi, um DS18B20 à prova d’água e um resistor pull-up de 4,7 kΩ se o pacote da sonda não incluir um. Prefira as páginas de produto da Adafruit; os links /dp/ da Amazon são alternativas opcionais.",
      },
      {
        name: "Ligue o DS18B20",
        text: "Ligue VCC em 3,3 V, GND em GND e dados no GPIO 4, com um pull-up de 4,7 kΩ entre dados e 3,3 V. Prenda a ponta de inox no cano mais frio ou na parede norte.",
      },
      {
        name: "Crie um dispositivo push",
        text: "Crie uma conta gratuita no ProbeHarbor e um dispositivo push em Dashboard → Devices, e copie a chave do dispositivo.",
      },
      {
        name: "Instale pelo navegador e confira",
        text: "Conecte o ESP32 via USB, abra o gravador web no Chrome ou Edge, instale o firmware e envie seu Wi-Fi e a chave do dispositivo. A página confirma quando a primeira leitura chega. Não precisa do Arduino IDE.",
      },
      {
        name: "Ative os alertas de congelamento",
        text: "Defina o limite de congelamento e o e-mail em Alerts → When to alert, envie um alerta de teste e, se quiser, ative o aviso de tempo até o congelamento.",
      },
    ],
  },
  introHtml:
    'O ProbeHarbor não vende hardware. Compre as peças abaixo e instale o firmware pelo navegador com o <a class="text-link" href="/flash">gravador web</a>: sem Arduino IDE, sem código, e ele envia à placa seu Wi‑Fi e a chave do dispositivo pelo mesmo cabo USB. Se preferir ler ou editar o código, os sketches em <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer">ds18b20_ingest</a> esperam um <strong>ESP32 com Wi‑Fi</strong> e um <strong>DS18B20 à prova d’água</strong>. Compre as peças abaixo (Adafruit para SKUs conhecidos, links de produto da Amazon quando quiser um DevKit mais barato) e, em vez disso, crie um dispositivo push e grave um sketch já preenchido a partir de <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>.',
  bom: {
    title: "Lista de materiais recomendada",
    caption: "Peças para uma sonda de congelamento ESP32",
    colPart: "Peça",
    colWhy: "Por quê",
    colBuy: "Comprar",
    boardPart: "Placa ESP32",
    boardWhy: "Envio push via HTTPS por Wi‑Fi (TLS no próprio chip)",
    amazonDevKit: "DevKit na Amazon",
    probePart: "DS18B20 à prova d’água",
    probeWhy: "Sonda para cano ou porão; funciona abaixo de zero",
    includesPullupHtml: "(inclui 4,7&nbsp;kΩ)",
    amazonProbe: "Sonda na Amazon",
    pullupPartHtml: "Pull-up de 4,7&nbsp;kΩ",
    pullupWhy: "Obrigatório na linha de dados 1-Wire se o pacote da sonda não incluir um",
    amazonResistor: "4,7k na Amazon",
    powerPart: "Alimentação USB",
    powerWhy: "Fonte de tomada ou cabo USB-C; quando der, deixe a placa num lugar mais quente que o da sonda",
    powerBuyHtml: "Qualquer fonte USB de 5&nbsp;V com ≥500&nbsp;mA",
  },
  bomNoteHtml:
    "Os anúncios de produtos mudam: use a Adafruit como lista de referência. Os links <code>/dp/</code> da Amazon em <code>bomLinks</code> são alternativas compatíveis com o programa de Associados enquanto o anúncio estiver ativo. Kits genéricos “ESP32 + DS18B20” costumam vir com um DHT11 em vez de uma sonda à prova d’água — evite-os.",
  wire: {
    title: "Faça a ligação",
    diagramAlt: "Diagrama de ligação: ESP32 DevKit a um DS18B20 à prova d’água com pull-up de 4,7 quilo-ohms no GPIO 4",
    captionHtml:
      "Vermelho → 3,3&nbsp;V, preto → GND, dados amarelo/branco → GPIO 4, com um pull-up de 4,7&nbsp;kΩ entre dados e 3,3&nbsp;V. O sketch de exemplo usa o GPIO 4 por padrão.",
    itemsHtml: [
      "<strong>Vermelho</strong> (VCC) → ESP32 3,3&nbsp;V",
      "<strong>Preto</strong> (GND) → GND",
      "<strong>Amarelo / branco</strong> (dados) → GPIO 4 (padrão do sketch de exemplo; qualquer GPIO digital livre funciona se você mudar o pino)",
      "4,7&nbsp;kΩ entre dados e 3,3&nbsp;V",
    ],
    featherHtml:
      'Numa Adafruit Feather (HUZZAH32 ou ESP32 Feather V2), o GPIO 4 é o pino marcado como <strong>A5</strong>. Veja as <a class="text-link" href="/flash#feather-pins">notas sobre a Feather na página do gravador</a> para os detalhes extras.',
    strap:
      "Prenda a sonda de inox no cano mais frio ou na parede norte com uma abraçadeira e envolva a sonda e um trecho curto do cano com isolamento de espuma, para medir a temperatura do cano e não a do ar do ambiente.",
  },
  flash: {
    title: "Grave e conecte",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Crie uma conta gratuita</a> e um dispositivo push em Devices.',
      'Abra o <a class="text-link" href="/flash">gravador web</a> no Chrome ou Edge, conecte o ESP32, clique em Install e envie seu Wi‑Fi e a chave do dispositivo. Ele mostra "First reading delivered" quando a sonda está ativa.',
      'Prefere código? Baixe o <code>.ino</code> do Arduino ou o <code>.py</code> do MicroPython já preenchidos em Devices e grave conforme as <a class="text-link" href="/about/esp32-web-flash">opções de gravação do ESP32</a> (o monitor serial a 115200 deve mostrar <code>POST 200</code>).',
      'Opcional: imprima o <a class="text-link" href="/about/kit-qr-onboarding">QR do kit</a> de ingestão na caixa.',
      'Defina o limite de congelamento e o e-mail em <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> e ative o aviso de tempo até o congelamento se quiser ser avisado antes de a sonda chegar ao ponto de congelamento.',
    ],
  },
  avoid: {
    title: "O que não comprar contra cano congelado",
    itemsHtml: [
      "<strong>Kits iniciais só com DHT11</strong>: fracos abaixo de zero, fios curtos, não são à prova d’água.",
      "<strong>Sensores de ambiente Bluetooth / Zigbee</strong>: não falam a ingestão push do ProbeHarbor.",
      "<strong>Uno + Ethernet sozinho</strong>: precisa de um relay HTTPS na rede local; bom para montagens avançadas, não para o primeiro kit.",
    ],
    dhtNoteHtml: (highTempLink: string) =>
      `O DHT22 continua servindo para o ar e a umidade da oficina (seu estudo de caso da garagem com Ethernet). Para canos, prefira o DS18B20. Cabo de PTFE para alta temperatura: ${highTempLink} se a sonda ficar perto de um aquecedor de água ou de um cabo de aquecimento.`,
  },
  extras: {
    title: "Extras opcionais",
    itemsHtml: [
      "Um segundo DS18B20 no mesmo barramento 1-Wire para comparar a área da porta com a parede do cano (multizona).",
      "Caixa de ABS ventilada + prensa-cabo para o ESP32 numa garagem empoeirada.",
      "Kits iniciais ELEGOO ou ESP32 genéricos servem <em>se</em> você ainda adicionar um DS18B20 à prova d’água: o DHT11 que vem junto não é a sonda de congelamento.",
    ],
  },
  related: {
    title: "Relacionados",
    labels: [
      "Adicionar dispositivos push e pull",
      "Opções de gravação do ESP32",
      "Ingestão com Raspberry Pi Pico W",
      "Ativação pelo QR do kit",
      "Kit de fixação de sondas",
      "Acessórios de hardware",
      "Fixação de sondas e caixas",
      "Checklist da temporada de frio",
    ],
  },
};

export const esp32FreezeKitMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

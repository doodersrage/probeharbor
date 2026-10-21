import { defineMessages } from "../../translate";

/** Body copy for /about/arduino-sketches. Hrefs stay English; middleware localizes them. */
const REPO = "https://github.com/doodersrage/probeharbor";
const ext = (href: string, label: string) =>
  `<a class="text-link" target="_blank" rel="noreferrer" href="${href}">${label}</a>`;
const ETH_INGEST = ext(`${REPO}/tree/main/sketches/arduino/ethernet_dht22_ingest`, "<code>ethernet_dht22_ingest</code>");
const RELAY = ext(`${REPO}/blob/main/sketches/relay/push_https_forward.py`, "<code>push_https_forward.py</code>");
const SKETCHES = ext(`${REPO}/tree/main/sketches`, "sketches/");
const FIRMWARE = ext(
  "https://github.com/doodersrage/arduino-network-json-temperature-sever",
  "arduino-network-json-temperature-sever",
);

const en = {
  intro:
    "The probe hardware runs on Arduino-compatible microcontrollers. Firmware: commonly called a sketch: reads sensors on a timer, formats the results as JSON, and serves them over the network so the website and other clients can fetch live data without serial cables.",
  responsibilitiesTitle: "Sketch responsibilities",
  responsibilities: [
    "Initialize sensor buses and the local 16×2 LCD for on-site readouts.",
    "Read each DHT22 probe with retry logic for transient bus errors.",
    "Compute an average across healthy probes for a quick summary value in JSON.",
    "Respond to HTTP requests with a compact JSON document via the Ethernet shield.",
    "Optionally log errors to serial for on-site debugging.",
  ],
  jsonTitle: "Typical JSON shape",
  jsonHtml:
    "Consumers expect a top-level <code>temp</code> object with numeric keys for each probe plus <code>avg</code>. Humidity appears alongside temperature per probe. Keeping keys stable matters more than pretty printing: dashboard mappings reference those keys directly.",
  pushJsonHtml:
    'For <a class="text-link" href="/about/ingest-and-webhooks">push ingest</a>, the same probe object can be posted to <code>/api/ingest/&lt;key&gt;</code>. Optional top-level <code>battery</code> (or <code>battery_pct</code>) and <code>rssi</code> fields update device health on the Devices page without requiring extra sensor keys.',
  pushTitle: "Push ingest from the Ethernet shield",
  pushHtml: `The W5100 stack on an Uno cannot TLS, so it cannot POST directly to <code>https://probeharbor.dev</code>. Use ${ETH_INGEST} to POST the classic <code>temp</code> JSON over HTTP (DHT22 on A4/A5, optional JSON on port 80 for LAN pull). Run ${RELAY} on a Pi, NAS, or laptop so those POSTs reach ProbeHarbor over HTTPS. ESP32 Wi‑Fi samples that speak TLS live in ${SKETCHES}.`,
  wiringTitle: "Hardware wiring guides",
  wiringLede:
    "The physical build uses an Arduino Uno, W5100 Ethernet shield, breadboard, contrast potentiometer, 16×2 LCD, and two DHT22 sensors. Three companion pages document the schematics and pin map in detail:",
  networkTitle: "Network stack choices",
  networkHtml: `This revision uses an Ethernet shield on SPI. The sketch handles DHCP, reconnect loops, and JSON serving while the LCD continues to show live probe values. When TLS is too heavy for the MCU, a Python relay can terminate HTTPS: see <a class="text-link" href="/about/python-feeds">Python scripts and feeds</a>. For push ingest from the same shield, see ${ETH_INGEST}.`,
  rev2Alt: "ProbeHarbor revision-two probe board with Ethernet shield, LCD, and DHT22 sensors",
  rev2Caption: "ProbeHarbor revision two: Ethernet, LCD readout, and dual DHT22 inputs in one stack.",
  workflowTitle: "Development workflow",
  workflow:
    "Sketches are edited in the Arduino IDE or PlatformIO, flashed over USB, then verified with serial logging before the board is mounted in the monitored space. Confirm JSON shape with curl before adding the feed URL to the website dashboard.",
  samplesHtml: `Ready-to-adapt samples for DS18B20, MAX31855, MAX6675, and Uno + Ethernet live in this repo under ${SKETCHES}. Raspberry Pi Pico W / Pico 2 W uses the same ingest JSON with <a class="text-link" href="/about/pico-w-ingest">CircuitPython or MicroPython</a>. Full Ethernet + DHT + LCD firmware: ${FIRMWARE}.`,
  tipsTitle: "Reliability tips",
  tips: [
    "Watchdog resets recover from rare network hangs without climbing a ladder.",
    "Separate sensor power noise from MCU power where long cable runs exist.",
    "Version your JSON schema in documentation when adding fields.",
    "Document which GPIO pins map to which physical probe labels, see the pin wiring guide.",
  ],
};
type Messages = typeof en;

const es: Messages = {
  intro:
    "El hardware de las sondas funciona con microcontroladores compatibles con Arduino. El firmware, que suele llamarse sketch, lee los sensores a intervalos fijos, da formato JSON a los resultados y los sirve por la red para que el sitio web y otros clientes obtengan datos en vivo sin cables serie.",
  responsibilitiesTitle: "Qué hace el sketch",
  responsibilities: [
    "Inicializa los buses de sensores y la pantalla LCD local de 16×2 para lecturas in situ.",
    "Lee cada sonda DHT22 con reintentos ante errores transitorios del bus.",
    "Calcula un promedio de las sondas en buen estado como valor resumen rápido en el JSON.",
    "Responde a las solicitudes HTTP con un documento JSON compacto a través del shield Ethernet.",
    "Opcionalmente, registra errores por serie para depurar in situ.",
  ],
  jsonTitle: "Estructura JSON típica",
  jsonHtml:
    "Los clientes esperan un objeto <code>temp</code> en el nivel superior con claves numéricas para cada sonda, además de <code>avg</code>. La humedad aparece junto a la temperatura en cada sonda. Mantener las claves estables importa más que un formato bonito: las asignaciones del dashboard hacen referencia directa a esas claves.",
  pushJsonHtml:
    'Para la <a class="text-link" href="/about/ingest-and-webhooks">ingesta push</a>, el mismo objeto de sonda puede enviarse a <code>/api/ingest/&lt;key&gt;</code>. Los campos opcionales de nivel superior <code>battery</code> (o <code>battery_pct</code>) y <code>rssi</code> actualizan el estado del dispositivo en la página Devices sin necesidad de claves de sensor adicionales.',
  pushTitle: "Ingesta push desde el shield Ethernet",
  pushHtml: `La pila W5100 de un Uno no admite TLS, así que no puede hacer POST directamente a <code>https://probeharbor.dev</code>. Usa ${ETH_INGEST} para enviar por HTTP el JSON <code>temp</code> clásico (DHT22 en A4/A5, JSON opcional en el puerto 80 para consultas desde la LAN). Ejecuta ${RELAY} en una Raspberry Pi, un NAS o un portátil para que esos POST lleguen a ProbeHarbor por HTTPS. Los ejemplos para ESP32 con Wi‑Fi que hablan TLS están en ${SKETCHES}.`,
  wiringTitle: "Guías de cableado del hardware",
  wiringLede:
    "El montaje físico usa un Arduino Uno, un shield Ethernet W5100, una protoboard, un potenciómetro de contraste, una pantalla LCD de 16×2 y dos sensores DHT22. Tres páginas complementarias documentan en detalle los esquemas y el mapa de pines:",
  networkTitle: "Opciones de pila de red",
  networkHtml: `Esta revisión usa un shield Ethernet por SPI. El sketch gestiona DHCP, los bucles de reconexión y el servicio del JSON mientras la LCD sigue mostrando los valores de las sondas en vivo. Cuando TLS es demasiado pesado para el MCU, un relay en Python puede terminar HTTPS: consulta <a class="text-link" href="/about/python-feeds">Scripts y feeds en Python</a>. Para la ingesta push desde el mismo shield, consulta ${ETH_INGEST}.`,
  rev2Alt: "Placa de sonda ProbeHarbor de segunda revisión con shield Ethernet, LCD y sensores DHT22",
  rev2Caption: "ProbeHarbor, revisión dos: Ethernet, lectura en LCD y dos entradas DHT22 en un solo montaje.",
  workflowTitle: "Flujo de desarrollo",
  workflow:
    "Los sketches se editan en el Arduino IDE o en PlatformIO, se graban por USB y se verifican con registros por serie antes de montar la placa en el espacio vigilado. Comprueba la estructura del JSON con curl antes de añadir la URL del feed al dashboard del sitio.",
  samplesHtml: `En este repositorio, dentro de ${SKETCHES}, hay ejemplos listos para adaptar para DS18B20, MAX31855, MAX6675 y Uno + Ethernet. La Raspberry Pi Pico W / Pico 2 W usa el mismo JSON de ingesta con <a class="text-link" href="/about/pico-w-ingest">CircuitPython o MicroPython</a>. Firmware completo de Ethernet + DHT + LCD: ${FIRMWARE}.`,
  tipsTitle: "Consejos de fiabilidad",
  tips: [
    "Los reinicios por watchdog se recuperan de los raros bloqueos de red sin tener que subir a una escalera.",
    "Separa el ruido de la alimentación de los sensores de la del MCU cuando haya tiradas de cable largas.",
    "Versiona tu esquema JSON en la documentación cuando añadas campos.",
    "Documenta qué pines GPIO corresponden a qué etiquetas físicas de sonda; consulta la guía de cableado de pines.",
  ],
};

const fr: Messages = {
  intro:
    "Le matériel des sondes tourne sur des microcontrôleurs compatibles Arduino. Le firmware, qu’on appelle couramment un sketch, lit les capteurs à intervalle régulier, met les résultats au format JSON et les sert sur le réseau, pour que le site web et d’autres clients récupèrent les données en direct sans câble série.",
  responsibilitiesTitle: "Rôle du sketch",
  responsibilities: [
    "Initialiser les bus des capteurs et l’écran LCD 16×2 local pour une lecture sur place.",
    "Lire chaque sonde DHT22, avec nouvelles tentatives en cas d’erreur passagère du bus.",
    "Calculer une moyenne des sondes en bon état, comme valeur de synthèse rapide dans le JSON.",
    "Répondre aux requêtes HTTP avec un document JSON compact via le shield Ethernet.",
    "En option, journaliser les erreurs sur le port série pour le débogage sur place.",
  ],
  jsonTitle: "Structure JSON type",
  jsonHtml:
    "Les clients attendent un objet <code>temp</code> au premier niveau, avec une clé numérique par sonde plus <code>avg</code>. L’humidité figure à côté de la température pour chaque sonde. Garder des clés stables compte plus qu’une mise en forme soignée : les correspondances du dashboard font directement référence à ces clés.",
  pushJsonHtml:
    'Pour l’<a class="text-link" href="/about/ingest-and-webhooks">ingestion push</a>, le même objet sonde peut être envoyé à <code>/api/ingest/&lt;key&gt;</code>. Les champs optionnels de premier niveau <code>battery</code> (ou <code>battery_pct</code>) et <code>rssi</code> mettent à jour l’état de l’appareil sur la page Devices sans clé de capteur supplémentaire.',
  pushTitle: "Ingestion push depuis le shield Ethernet",
  pushHtml: `La pile W5100 d’un Uno ne gère pas TLS : elle ne peut donc pas envoyer de POST directement à <code>https://probeharbor.dev</code>. Utilisez ${ETH_INGEST} pour envoyer en HTTP le JSON <code>temp</code> classique (DHT22 sur A4/A5, JSON optionnel sur le port 80 pour une lecture depuis le LAN). Lancez ${RELAY} sur un Raspberry Pi, un NAS ou un ordinateur portable pour que ces POST atteignent ProbeHarbor en HTTPS. Les exemples ESP32 en Wi‑Fi qui parlent TLS se trouvent dans ${SKETCHES}.`,
  wiringTitle: "Guides de câblage du matériel",
  wiringLede:
    "Le montage utilise un Arduino Uno, un shield Ethernet W5100, une platine d’essai, un potentiomètre de contraste, un écran LCD 16×2 et deux capteurs DHT22. Trois pages associées détaillent les schémas et le brochage :",
  networkTitle: "Choix de la pile réseau",
  networkHtml: `Cette révision utilise un shield Ethernet en SPI. Le sketch gère le DHCP, les boucles de reconnexion et la diffusion du JSON pendant que l’écran LCD continue d’afficher les valeurs des sondes en direct. Quand TLS est trop lourd pour le MCU, un relais Python peut terminer le HTTPS : voir <a class="text-link" href="/about/python-feeds">Scripts et flux Python</a>. Pour l’ingestion push depuis le même shield, voir ${ETH_INGEST}.`,
  rev2Alt: "Carte de sonde ProbeHarbor révision deux avec shield Ethernet, écran LCD et capteurs DHT22",
  rev2Caption: "ProbeHarbor révision deux : Ethernet, affichage LCD et deux entrées DHT22 dans un seul empilement.",
  workflowTitle: "Méthode de développement",
  workflow:
    "Les sketches sont modifiés dans l’Arduino IDE ou PlatformIO, flashés en USB, puis vérifiés grâce aux journaux série avant de fixer la carte dans l’espace surveillé. Vérifiez la structure du JSON avec curl avant d’ajouter l’URL du flux au dashboard du site.",
  samplesHtml: `Des exemples prêts à adapter pour DS18B20, MAX31855, MAX6675 et Uno + Ethernet se trouvent dans ce dépôt, sous ${SKETCHES}. Le Raspberry Pi Pico W / Pico 2 W utilise le même JSON d’ingestion avec <a class="text-link" href="/about/pico-w-ingest">CircuitPython ou MicroPython</a>. Firmware complet Ethernet + DHT + LCD : ${FIRMWARE}.`,
  tipsTitle: "Conseils de fiabilité",
  tips: [
    "Les redémarrages par watchdog rattrapent les rares blocages réseau sans avoir à monter sur une échelle.",
    "Séparez le bruit d’alimentation des capteurs de celle du MCU quand les câbles sont longs.",
    "Versionnez votre schéma JSON dans la documentation quand vous ajoutez des champs.",
    "Notez quelles broches GPIO correspondent à quelles étiquettes de sonde physiques ; voir le guide de câblage des broches.",
  ],
};

const de: Messages = {
  intro:
    "Die Sondenhardware läuft auf Arduino-kompatiblen Mikrocontrollern. Die Firmware, meist Sketch genannt, liest die Sensoren in festen Abständen aus, formatiert die Ergebnisse als JSON und stellt sie im Netzwerk bereit, damit die Website und andere Clients Live-Daten ohne serielles Kabel abrufen können.",
  responsibilitiesTitle: "Aufgaben des Sketches",
  responsibilities: [
    "Sensorbusse und das lokale 16×2-LCD für die Anzeige vor Ort initialisieren.",
    "Jede DHT22-Sonde auslesen, mit Wiederholversuchen bei vorübergehenden Busfehlern.",
    "Einen Mittelwert über alle funktionierenden Sonden als schnellen Übersichtswert im JSON berechnen.",
    "HTTP-Anfragen über das Ethernet-Shield mit einem kompakten JSON-Dokument beantworten.",
    "Optional Fehler seriell protokollieren, um vor Ort zu debuggen.",
  ],
  jsonTitle: "Typischer JSON-Aufbau",
  jsonHtml:
    "Clients erwarten auf oberster Ebene ein <code>temp</code>-Objekt mit numerischen Schlüsseln für jede Sonde sowie <code>avg</code>. Die Luftfeuchtigkeit steht bei jeder Sonde neben der Temperatur. Stabile Schlüssel sind wichtiger als hübsche Formatierung: Die Zuordnungen im Dashboard verweisen direkt auf diese Schlüssel.",
  pushJsonHtml:
    'Für <a class="text-link" href="/about/ingest-and-webhooks">Push-Ingest</a> lässt sich dasselbe Sondenobjekt an <code>/api/ingest/&lt;key&gt;</code> senden. Die optionalen Felder <code>battery</code> (oder <code>battery_pct</code>) und <code>rssi</code> auf oberster Ebene aktualisieren den Gerätezustand auf der Devices-Seite, ohne dass zusätzliche Sensorschlüssel nötig sind.',
  pushTitle: "Push-Ingest vom Ethernet-Shield",
  pushHtml: `Der W5100-Stack auf einem Uno beherrscht kein TLS und kann daher nicht direkt an <code>https://probeharbor.dev</code> POSTen. Nutze ${ETH_INGEST}, um das klassische <code>temp</code>-JSON per HTTP zu senden (DHT22 an A4/A5, optional JSON auf Port 80 zum Abrufen im LAN). Lass ${RELAY} auf einem Pi, NAS oder Laptop laufen, damit diese POSTs ProbeHarbor über HTTPS erreichen. ESP32-Beispiele mit WLAN und TLS findest du in ${SKETCHES}.`,
  wiringTitle: "Verdrahtungsanleitungen",
  wiringLede:
    "Der Aufbau besteht aus einem Arduino Uno, einem W5100-Ethernet-Shield, einem Steckbrett, einem Kontrastpotentiometer, einem 16×2-LCD und zwei DHT22-Sensoren. Drei begleitende Seiten beschreiben Schaltpläne und Pinbelegung im Detail:",
  networkTitle: "Wahl des Netzwerk-Stacks",
  networkHtml: `Diese Revision nutzt ein Ethernet-Shield über SPI. Der Sketch übernimmt DHCP, Wiederverbindungsschleifen und die JSON-Ausgabe, während das LCD weiter die Live-Werte der Sonden zeigt. Ist TLS für den MCU zu schwer, kann ein Python-Relay HTTPS terminieren: siehe <a class="text-link" href="/about/python-feeds">Python-Skripte und Feeds</a>. Für Push-Ingest vom selben Shield siehe ${ETH_INGEST}.`,
  rev2Alt: "ProbeHarbor-Sondenplatine, zweite Revision, mit Ethernet-Shield, LCD und DHT22-Sensoren",
  rev2Caption: "ProbeHarbor, zweite Revision: Ethernet, LCD-Anzeige und zwei DHT22-Eingänge in einem Aufbau.",
  workflowTitle: "Entwicklungsablauf",
  workflow:
    "Sketches werden in der Arduino IDE oder in PlatformIO bearbeitet, per USB geflasht und dann anhand der seriellen Ausgabe geprüft, bevor die Platine im überwachten Raum montiert wird. Prüfe den JSON-Aufbau mit curl, bevor du die Feed-URL im Dashboard der Website einträgst.",
  samplesHtml: `Anpassbare Beispiele für DS18B20, MAX31855, MAX6675 und Uno + Ethernet liegen in diesem Repo unter ${SKETCHES}. Der Raspberry Pi Pico W / Pico 2 W nutzt dasselbe Ingest-JSON mit <a class="text-link" href="/about/pico-w-ingest">CircuitPython oder MicroPython</a>. Vollständige Ethernet-+-DHT-+-LCD-Firmware: ${FIRMWARE}.`,
  tipsTitle: "Tipps für einen zuverlässigen Betrieb",
  tips: [
    "Watchdog-Resets beheben seltene Netzwerkhänger, ohne dass du auf die Leiter musst.",
    "Trenne bei langen Kabelwegen das Störrauschen der Sensorversorgung von der MCU-Versorgung.",
    "Versioniere dein JSON-Schema in der Dokumentation, wenn du Felder hinzufügst.",
    "Dokumentiere, welche GPIO-Pins zu welchen Sondenbeschriftungen gehören; siehe die Anleitung zur Pinbelegung.",
  ],
};

const ptBr: Messages = {
  intro:
    "O hardware das sondas roda em microcontroladores compatíveis com Arduino. O firmware, normalmente chamado de sketch, lê os sensores em intervalos fixos, formata os resultados em JSON e os disponibiliza na rede para que o site e outros clientes busquem dados ao vivo sem cabo serial.",
  responsibilitiesTitle: "O que o sketch faz",
  responsibilities: [
    "Inicializa os barramentos dos sensores e o LCD local de 16×2 para leitura no local.",
    "Lê cada sonda DHT22 com novas tentativas em caso de erros temporários no barramento.",
    "Calcula a média das sondas em bom estado como valor-resumo rápido no JSON.",
    "Responde às requisições HTTP com um documento JSON compacto pelo shield Ethernet.",
    "Opcionalmente, registra erros na serial para depuração no local.",
  ],
  jsonTitle: "Formato JSON típico",
  jsonHtml:
    "Os clientes esperam um objeto <code>temp</code> no nível superior com chaves numéricas para cada sonda, além de <code>avg</code>. A umidade aparece ao lado da temperatura em cada sonda. Manter as chaves estáveis importa mais do que uma formatação bonita: os mapeamentos do dashboard fazem referência direta a essas chaves.",
  pushJsonHtml:
    'Para <a class="text-link" href="/about/ingest-and-webhooks">ingestão push</a>, o mesmo objeto de sonda pode ser enviado para <code>/api/ingest/&lt;key&gt;</code>. Os campos opcionais de nível superior <code>battery</code> (ou <code>battery_pct</code>) e <code>rssi</code> atualizam a saúde do dispositivo na página Devices sem exigir chaves de sensor extras.',
  pushTitle: "Ingestão push a partir do shield Ethernet",
  pushHtml: `A pilha W5100 de um Uno não suporta TLS, então não consegue fazer POST diretamente para <code>https://probeharbor.dev</code>. Use ${ETH_INGEST} para enviar o JSON <code>temp</code> clássico por HTTP (DHT22 em A4/A5, JSON opcional na porta 80 para leitura pela LAN). Rode ${RELAY} em um Raspberry Pi, NAS ou notebook para que esses POSTs cheguem ao ProbeHarbor por HTTPS. Os exemplos para ESP32 com Wi‑Fi que falam TLS ficam em ${SKETCHES}.`,
  wiringTitle: "Guias de ligação do hardware",
  wiringLede:
    "A montagem usa um Arduino Uno, um shield Ethernet W5100, uma protoboard, um potenciômetro de contraste, um LCD de 16×2 e dois sensores DHT22. Três páginas complementares documentam em detalhes os esquemas e o mapa de pinos:",
  networkTitle: "Escolhas da pilha de rede",
  networkHtml: `Esta revisão usa um shield Ethernet via SPI. O sketch cuida do DHCP, dos loops de reconexão e do envio do JSON enquanto o LCD continua mostrando os valores das sondas ao vivo. Quando o TLS é pesado demais para o MCU, um relay em Python pode terminar o HTTPS: veja <a class="text-link" href="/about/python-feeds">Scripts e feeds em Python</a>. Para ingestão push a partir do mesmo shield, veja ${ETH_INGEST}.`,
  rev2Alt: "Placa de sonda ProbeHarbor da segunda revisão com shield Ethernet, LCD e sensores DHT22",
  rev2Caption: "ProbeHarbor, revisão dois: Ethernet, leitura no LCD e duas entradas DHT22 em uma única montagem.",
  workflowTitle: "Fluxo de desenvolvimento",
  workflow:
    "Os sketches são editados no Arduino IDE ou no PlatformIO, gravados via USB e verificados com logs na serial antes de a placa ser instalada no espaço monitorado. Confira o formato do JSON com curl antes de adicionar a URL do feed ao dashboard do site.",
  samplesHtml: `Exemplos prontos para adaptar para DS18B20, MAX31855, MAX6675 e Uno + Ethernet ficam neste repositório, em ${SKETCHES}. O Raspberry Pi Pico W / Pico 2 W usa o mesmo JSON de ingestão com <a class="text-link" href="/about/pico-w-ingest">CircuitPython ou MicroPython</a>. Firmware completo de Ethernet + DHT + LCD: ${FIRMWARE}.`,
  tipsTitle: "Dicas de confiabilidade",
  tips: [
    "Reinicializações por watchdog recuperam a placa de travamentos raros de rede sem você precisar subir na escada.",
    "Separe o ruído da alimentação dos sensores da alimentação do MCU quando houver cabos longos.",
    "Versione seu esquema JSON na documentação ao adicionar campos.",
    "Documente quais pinos GPIO correspondem a quais etiquetas físicas de sonda; veja o guia de ligação dos pinos.",
  ],
};

export const arduinoSketchesMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

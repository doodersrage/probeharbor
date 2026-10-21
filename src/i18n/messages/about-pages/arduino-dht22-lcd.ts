import { defineMessages } from "../../translate";

/** /about/arduino-dht22-lcd body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
const ETH_LINK =
  '<a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest" target="_blank" rel="noreferrer"><code>ethernet_dht22_ingest</code></a>';

const en = {
  heroAlt: "Arduino probe board with network connectivity and sensor wiring headers",
  heroCaption: "ProbeHarbor probe board with Ethernet, LCD, and DHT22 wiring headers.",
  intro:
    "The firmware treats the LCD and the JSON feed as two views of the same data. The LCD gives instant local feedback while you install or troubleshoot probes; the Ethernet interface publishes the same readings to the website and any other HTTP clients.",
  twoSensorsTitle: "Reading two DHT22 sensors independently",
  twoSensorsBody:
    "Each DHT22 exposes temperature and relative humidity over a single-wire data protocol. Because each sensor has its own data pin (A4 and A5 in this build), the sketch can poll them sequentially without bus collisions. That is why the LCD shows two distinct pairs: such as 21.75 °C with 71.15% humidity on one line and a different temperature on the next, rather than a single averaged local value.",
  keysHtml:
    "On the website, those same probes map to JSON keys (for example <code>0</code>, <code>1</code>, and <code>avg</code>). Labels you assign in the dashboard can rename them “North wall” and “Door zone” without changing firmware keys.",
  wiresTitle: "Three-wire sensor connections",
  wiresItemsHtml: [
    "<strong>Data</strong>, one digital pin per sensor, with a pull-up resistor as recommended by the DHT22 datasheet.",
    "<strong>VCC</strong>: 5 V from the breadboard rail (stable supply matters for consistent readings).",
    "<strong>GND</strong>: common ground with the Arduino, LCD, and Ethernet shield.",
  ],
  wiresBody:
    "Long cable runs to remote probe locations may need twisted pairs or shielding; the workshop build keeps sensors near the controller for simplicity, but the same firmware pattern scales to wired remote probes.",
  lcdTitle: "LCD layout and contrast",
  lcdBody1:
    "The 16×2 display shows live values during boot, calibration, and network outages. The contrast potentiometer on the breadboard adjusts V0 so text remains readable across temperature swings in the space. If the screen looks blank after upload, adjust contrast before debugging code.",
  lcdBody2:
    "Four-bit mode (D4–D7 only) reduces pin usage compared with eight-bit wiring: important when Ethernet already consumes SPI pins and two DHT22 data lines are allocated.",
  backlightTitle: "Backlight control",
  backlightBody:
    "Driving the backlight from pin 7 through a transistor keeps current draw off the Arduino pin itself. Firmware can dim or flash the backlight for warnings: useful when a probe reads below freezing: without blocking network serving.",
  ethernetTitle: "Ethernet alongside sensors",
  ethernetBodyHtml: `The W5100 Ethernet shield stacks on the Uno and uses SPI, leaving digital and analog pins free for the LCD and DHT22 wiring described in the <a class="text-link" href="/about/arduino-pin-wiring">pin-level guide</a>. The shield mostly “rides along” on the stack: once configured, the sketch can serve JSON over HTTP and POST the same payload for <a class="text-link" href="/about/ingest-and-webhooks">push ingest</a> (see ${ETH_LINK}).`,
  jsonTitle: "From LCD numbers to website JSON",
  jsonBodyHtml:
    'After each successful sensor read, the sketch updates the LCD and builds the JSON document served to clients. The website fetches that JSON, stores optional history when you are signed in, and renders the same probe keys on the home page. Try the <a class="text-link" href="/about/probe-demo">interactive probe demo</a> to see how multiple keys and averages appear to downstream consumers.',
};

type ArduinoDht22LcdMessages = typeof en;

const es: ArduinoDht22LcdMessages = {
  heroAlt: "Placa de sonda Arduino con conectividad de red y conectores para el cableado de sensores",
  heroCaption: "Placa de sonda de ProbeHarbor con Ethernet, LCD y conectores para los DHT22.",
  intro:
    "El firmware trata el LCD y el feed JSON como dos vistas de los mismos datos. El LCD da una respuesta local inmediata mientras instalas sondas o resuelves problemas; la interfaz Ethernet publica las mismas lecturas en el sitio web y en cualquier otro cliente HTTP.",
  twoSensorsTitle: "Lectura independiente de dos sensores DHT22",
  twoSensorsBody:
    "Cada DHT22 ofrece temperatura y humedad relativa mediante un protocolo de datos de un solo hilo. Como cada sensor tiene su propio pin de datos (A4 y A5 en este montaje), el sketch puede consultarlos uno tras otro sin colisiones en el bus. Por eso el LCD muestra dos pares distintos, por ejemplo 21,75 °C con 71,15 % de humedad en una línea y otra temperatura en la siguiente, en lugar de un único valor local promediado.",
  keysHtml:
    "En el sitio web, esas mismas sondas corresponden a claves JSON (por ejemplo <code>0</code>, <code>1</code> y <code>avg</code>). Las etiquetas que asignes en el dashboard pueden renombrarlas como «Pared norte» y «Zona de la puerta» sin cambiar las claves del firmware.",
  wiresTitle: "Conexión de sensores de tres hilos",
  wiresItemsHtml: [
    "<strong>Datos</strong>: un pin digital por sensor, con una resistencia pull-up, como recomienda la hoja de datos del DHT22.",
    "<strong>VCC</strong>: 5 V desde el riel de la protoboard (una alimentación estable es clave para lecturas coherentes).",
    "<strong>GND</strong>: tierra común con el Arduino, el LCD y el shield Ethernet.",
  ],
  wiresBody:
    "Los tendidos de cable largos hasta sondas remotas pueden necesitar pares trenzados o apantallamiento; el montaje del taller mantiene los sensores cerca del controlador por sencillez, pero el mismo esquema de firmware sirve para sondas remotas cableadas.",
  lcdTitle: "Disposición y contraste del LCD",
  lcdBody1:
    "La pantalla 16×2 muestra valores en directo durante el arranque, la calibración y los cortes de red. El potenciómetro de contraste de la protoboard ajusta V0 para que el texto siga siendo legible con los cambios de temperatura del espacio. Si la pantalla parece vacía tras cargar el sketch, ajusta el contraste antes de depurar el código.",
  lcdBody2:
    "El modo de cuatro bits (solo D4–D7) usa menos pines que el cableado de ocho bits: importante cuando Ethernet ya ocupa los pines SPI y hay dos líneas de datos de DHT22 asignadas.",
  backlightTitle: "Control de la retroiluminación",
  backlightBody:
    "Alimentar la retroiluminación desde el pin 7 a través de un transistor evita que la corriente pase por el propio pin del Arduino. El firmware puede atenuarla o hacerla parpadear como aviso (útil cuando una sonda marca bajo cero) sin bloquear el servicio de red.",
  ethernetTitle: "Ethernet junto a los sensores",
  ethernetBodyHtml: `El shield Ethernet W5100 se apila sobre el Uno y usa SPI, de modo que deja libres los pines digitales y analógicos para el LCD y los DHT22 descritos en la <a class="text-link" href="/about/arduino-pin-wiring">guía pin a pin</a>. El shield básicamente «va montado» en la pila: una vez configurado, el sketch puede servir JSON por HTTP y enviar la misma carga por POST para la <a class="text-link" href="/about/ingest-and-webhooks">ingesta push</a> (consulta ${ETH_LINK}).`,
  jsonTitle: "De los números del LCD al JSON del sitio web",
  jsonBodyHtml:
    'Después de cada lectura correcta de los sensores, el sketch actualiza el LCD y genera el documento JSON que sirve a los clientes. El sitio web obtiene ese JSON, guarda un historial opcional si has iniciado sesión y muestra las mismas claves de sonda en la página de inicio. Prueba la <a class="text-link" href="/about/probe-demo">demo interactiva de sondas</a> para ver cómo llegan las distintas claves y los promedios a los consumidores.',
};

const fr: ArduinoDht22LcdMessages = {
  heroAlt: "Carte de sonde Arduino avec connectivité réseau et connecteurs de câblage des capteurs",
  heroCaption: "Carte de sonde ProbeHarbor avec Ethernet, écran LCD et connecteurs pour les DHT22.",
  intro:
    "Le firmware considère l’écran LCD et le flux JSON comme deux vues des mêmes données. Le LCD offre un retour local immédiat pendant l’installation ou le dépannage des sondes ; l’interface Ethernet publie les mêmes relevés vers le site web et tout autre client HTTP.",
  twoSensorsTitle: "Lire deux capteurs DHT22 indépendamment",
  twoSensorsBody:
    "Chaque DHT22 fournit la température et l’humidité relative via un protocole de données sur un seul fil. Comme chaque capteur a sa propre broche de données (A4 et A5 dans ce montage), le sketch peut les interroger l’un après l’autre sans collision sur le bus. C’est pourquoi le LCD affiche deux paires distinctes, par exemple 21,75 °C avec 71,15 % d’humidité sur une ligne et une autre température sur la suivante, plutôt qu’une seule valeur locale moyennée.",
  keysHtml:
    "Sur le site web, ces mêmes sondes correspondent à des clés JSON (par exemple <code>0</code>, <code>1</code> et <code>avg</code>). Les libellés que vous définissez dans le tableau de bord peuvent les renommer « Mur nord » et « Zone de la porte » sans toucher aux clés du firmware.",
  wiresTitle: "Raccordement des capteurs à trois fils",
  wiresItemsHtml: [
    "<strong>Données</strong> : une broche numérique par capteur, avec une résistance de tirage comme le recommande la fiche technique du DHT22.",
    "<strong>VCC</strong> : 5 V depuis le rail de la platine d’essai (une alimentation stable compte pour des relevés cohérents).",
    "<strong>GND</strong> : masse commune avec l’Arduino, le LCD et le shield Ethernet.",
  ],
  wiresBody:
    "Les longues liaisons vers des sondes éloignées peuvent nécessiter des paires torsadées ou un blindage ; le montage de l’atelier garde les capteurs près du contrôleur par simplicité, mais le même principe de firmware s’applique à des sondes distantes filaires.",
  lcdTitle: "Affichage et contraste du LCD",
  lcdBody1:
    "L’écran 16×2 affiche les valeurs en direct pendant le démarrage, l’étalonnage et les coupures réseau. Le potentiomètre de contraste de la platine d’essai règle V0 pour que le texte reste lisible malgré les variations de température du local. Si l’écran semble vide après le téléversement, réglez le contraste avant de déboguer le code.",
  lcdBody2:
    "Le mode 4 bits (D4–D7 uniquement) consomme moins de broches qu’un câblage 8 bits : important quand l’Ethernet occupe déjà les broches SPI et que deux lignes de données DHT22 sont attribuées.",
  backlightTitle: "Commande du rétroéclairage",
  backlightBody:
    "Piloter le rétroéclairage depuis la broche 7 via un transistor évite de faire passer le courant par la broche de l’Arduino elle-même. Le firmware peut atténuer ou faire clignoter le rétroéclairage en cas d’avertissement (utile quand une sonde passe sous zéro) sans bloquer le service réseau.",
  ethernetTitle: "Ethernet aux côtés des capteurs",
  ethernetBodyHtml: `Le shield Ethernet W5100 s’empile sur l’Uno et utilise le SPI, ce qui laisse les broches numériques et analogiques libres pour le câblage du LCD et des DHT22 décrit dans le <a class="text-link" href="/about/arduino-pin-wiring">guide broche par broche</a>. Le shield « suit le mouvement » sur la pile : une fois configuré, le sketch peut servir du JSON en HTTP et envoyer la même charge utile en POST pour l’<a class="text-link" href="/about/ingest-and-webhooks">ingestion push</a> (voir ${ETH_LINK}).`,
  jsonTitle: "Des chiffres du LCD au JSON du site",
  jsonBodyHtml:
    'Après chaque lecture réussie des capteurs, le sketch met à jour le LCD et construit le document JSON servi aux clients. Le site web récupère ce JSON, conserve un historique facultatif lorsque vous êtes connecté et affiche les mêmes clés de sonde sur la page d’accueil. Essayez la <a class="text-link" href="/about/probe-demo">démo interactive des sondes</a> pour voir comment plusieurs clés et moyennes apparaissent côté consommateurs.',
};

const de: ArduinoDht22LcdMessages = {
  heroAlt: "Arduino-Fühlerplatine mit Netzwerkanschluss und Stiftleisten für die Sensorverdrahtung",
  heroCaption: "ProbeHarbor-Fühlerplatine mit Ethernet, LCD und Anschlüssen für die DHT22.",
  intro:
    "Die Firmware behandelt LCD und JSON-Feed als zwei Ansichten derselben Daten. Das LCD liefert sofortige Rückmeldung vor Ort, während du Fühler installierst oder Fehler suchst; die Ethernet-Schnittstelle veröffentlicht dieselben Messwerte für die Website und alle anderen HTTP-Clients.",
  twoSensorsTitle: "Zwei DHT22-Sensoren unabhängig auslesen",
  twoSensorsBody:
    "Jeder DHT22 liefert Temperatur und relative Luftfeuchtigkeit über ein Eindraht-Datenprotokoll. Da jeder Sensor seinen eigenen Datenpin hat (in diesem Aufbau A4 und A5), kann der Sketch sie nacheinander abfragen, ohne dass es auf dem Bus zu Kollisionen kommt. Deshalb zeigt das LCD zwei getrennte Wertepaare, etwa 21,75 °C bei 71,15 % Luftfeuchtigkeit in einer Zeile und eine andere Temperatur in der nächsten, statt eines einzigen gemittelten lokalen Werts.",
  keysHtml:
    "Auf der Website entsprechen dieselben Fühler JSON-Schlüsseln (zum Beispiel <code>0</code>, <code>1</code> und <code>avg</code>). Mit Bezeichnungen im Dashboard kannst du sie in „Nordwand“ und „Torbereich“ umbenennen, ohne die Schlüssel in der Firmware zu ändern.",
  wiresTitle: "Dreiadrige Sensoranschlüsse",
  wiresItemsHtml: [
    "<strong>Daten</strong>: ein Digital-Pin pro Sensor, mit Pull-up-Widerstand gemäß DHT22-Datenblatt.",
    "<strong>VCC</strong>: 5 V von der Versorgungsschiene des Steckbretts (eine stabile Versorgung ist wichtig für gleichmäßige Messwerte).",
    "<strong>GND</strong>: gemeinsame Masse mit Arduino, LCD und Ethernet-Shield.",
  ],
  wiresBody:
    "Lange Kabelwege zu entfernten Fühlern brauchen unter Umständen verdrillte Adernpaare oder eine Abschirmung; der Werkstattaufbau hält die Sensoren der Einfachheit halber nah am Controller, aber dasselbe Firmware-Muster funktioniert auch mit kabelgebundenen entfernten Fühlern.",
  lcdTitle: "LCD-Layout und Kontrast",
  lcdBody1:
    "Das 16×2-Display zeigt Live-Werte beim Start, bei der Kalibrierung und bei Netzausfällen. Das Kontrastpotentiometer auf dem Steckbrett stellt V0 ein, damit der Text auch bei Temperaturschwankungen im Raum lesbar bleibt. Wirkt das Display nach dem Hochladen leer, stell zuerst den Kontrast nach, bevor du den Code debuggst.",
  lcdBody2:
    "Der 4-Bit-Modus (nur D4–D7) belegt weniger Pins als die 8-Bit-Verdrahtung: wichtig, wenn Ethernet schon die SPI-Pins belegt und zwei DHT22-Datenleitungen vergeben sind.",
  backlightTitle: "Steuerung der Hintergrundbeleuchtung",
  backlightBody:
    "Wird die Hintergrundbeleuchtung von Pin 7 über einen Transistor geschaltet, fließt der Strom nicht über den Arduino-Pin selbst. Die Firmware kann die Beleuchtung bei Warnungen dimmen oder blinken lassen (nützlich, wenn ein Fühler Minusgrade misst), ohne die Netzwerkauslieferung zu blockieren.",
  ethernetTitle: "Ethernet neben den Sensoren",
  ethernetBodyHtml: `Das Ethernet-Shield W5100 wird auf den Uno gesteckt und nutzt SPI, sodass Digital- und Analog-Pins für die LCD- und DHT22-Verdrahtung frei bleiben, wie im <a class="text-link" href="/about/arduino-pin-wiring">Pinbelegungs-Leitfaden</a> beschrieben. Das Shield „fährt“ auf dem Stapel weitgehend nur mit: Einmal konfiguriert, kann der Sketch JSON über HTTP ausliefern und dieselbe Payload per POST für den <a class="text-link" href="/about/ingest-and-webhooks">Push-Ingest</a> senden (siehe ${ETH_LINK}).`,
  jsonTitle: "Von LCD-Zahlen zum Website-JSON",
  jsonBodyHtml:
    'Nach jeder erfolgreichen Sensormessung aktualisiert der Sketch das LCD und erstellt das JSON-Dokument für die Clients. Die Website ruft dieses JSON ab, speichert bei Anmeldung optional den Verlauf und zeigt dieselben Fühlerschlüssel auf der Startseite. Probier die <a class="text-link" href="/about/probe-demo">interaktive Fühler-Demo</a> aus, um zu sehen, wie mehrere Schlüssel und Mittelwerte bei nachgelagerten Abnehmern ankommen.',
};

const ptBr: ArduinoDht22LcdMessages = {
  heroAlt: "Placa de sonda Arduino com conectividade de rede e conectores para a ligação dos sensores",
  heroCaption: "Placa de sonda do ProbeHarbor com Ethernet, LCD e conectores para os DHT22.",
  intro:
    "O firmware trata o LCD e o feed JSON como duas visões dos mesmos dados. O LCD dá um retorno local imediato enquanto você instala sondas ou resolve problemas; a interface Ethernet publica as mesmas leituras no site e em qualquer outro cliente HTTP.",
  twoSensorsTitle: "Lendo dois sensores DHT22 de forma independente",
  twoSensorsBody:
    "Cada DHT22 fornece temperatura e umidade relativa por um protocolo de dados de um fio. Como cada sensor tem o próprio pino de dados (A4 e A5 nesta montagem), o sketch consegue consultá-los em sequência sem colisões no barramento. É por isso que o LCD mostra dois pares distintos, como 21,75 °C com 71,15% de umidade em uma linha e outra temperatura na seguinte, em vez de um único valor local médio.",
  keysHtml:
    "No site, essas mesmas sondas correspondem a chaves JSON (por exemplo <code>0</code>, <code>1</code> e <code>avg</code>). Os rótulos que você define no dashboard podem renomeá-las para “Parede norte” e “Zona da porta” sem mudar as chaves do firmware.",
  wiresTitle: "Ligação de sensores de três fios",
  wiresItemsHtml: [
    "<strong>Dados</strong>: um pino digital por sensor, com resistor de pull-up, como recomenda o datasheet do DHT22.",
    "<strong>VCC</strong>: 5 V do barramento da protoboard (uma alimentação estável faz diferença para leituras consistentes).",
    "<strong>GND</strong>: terra comum com o Arduino, o LCD e o shield Ethernet.",
  ],
  wiresBody:
    "Cabos longos até sondas distantes podem exigir pares trançados ou blindagem; a montagem da oficina mantém os sensores perto do controlador por simplicidade, mas o mesmo padrão de firmware funciona com sondas remotas cabeadas.",
  lcdTitle: "Layout e contraste do LCD",
  lcdBody1:
    "O display 16×2 mostra valores ao vivo durante a inicialização, a calibração e as quedas de rede. O potenciômetro de contraste na protoboard ajusta o V0 para que o texto continue legível com as variações de temperatura do ambiente. Se a tela parecer vazia depois do upload, ajuste o contraste antes de depurar o código.",
  lcdBody2:
    "O modo de quatro bits (só D4–D7) usa menos pinos que a ligação de oito bits: importante quando o Ethernet já ocupa os pinos SPI e duas linhas de dados de DHT22 estão alocadas.",
  backlightTitle: "Controle da luz de fundo",
  backlightBody:
    "Acionar a luz de fundo pelo pino 7 por meio de um transistor evita que a corrente passe pelo próprio pino do Arduino. O firmware pode diminuir ou piscar a luz de fundo como aviso (útil quando uma sonda marca abaixo de zero) sem travar o atendimento da rede.",
  ethernetTitle: "Ethernet junto com os sensores",
  ethernetBodyHtml: `O shield Ethernet W5100 encaixa sobre o Uno e usa SPI, deixando os pinos digitais e analógicos livres para a ligação do LCD e dos DHT22 descrita no <a class="text-link" href="/about/arduino-pin-wiring">guia pino a pino</a>. O shield basicamente “vai junto” na pilha: depois de configurado, o sketch pode servir JSON via HTTP e enviar o mesmo payload por POST para a <a class="text-link" href="/about/ingest-and-webhooks">ingestão push</a> (veja ${ETH_LINK}).`,
  jsonTitle: "Dos números do LCD ao JSON do site",
  jsonBodyHtml:
    'Depois de cada leitura bem-sucedida dos sensores, o sketch atualiza o LCD e monta o documento JSON servido aos clientes. O site busca esse JSON, guarda um histórico opcional quando você está conectado e mostra as mesmas chaves de sonda na página inicial. Experimente a <a class="text-link" href="/about/probe-demo">demo interativa de sondas</a> para ver como várias chaves e médias chegam aos consumidores.',
};

export const arduinoDht22LcdMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

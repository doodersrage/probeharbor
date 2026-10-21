import { defineMessages } from "../../translate";

/** /about/arduino-pin-wiring body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
const ETH_LINK =
  '<a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest" target="_blank" rel="noreferrer"><code>ethernet_dht22_ingest</code></a>';

const en = {
  introHtml:
    "The pin-level diagram below matches the firmware's <code>LiquidCrystal</code> constructor and the DHT22 data lines used in this project. Use it when verifying jumper wires against the sketch: especially if analog pins are serving as digital I/O.",
  diagramAlt: "Pin-level wiring diagram for Arduino Uno connecting LCD and two DHT22 sensors",
  diagramCaption: "RS, RW, EN, data lines, backlight, and both DHT22 data pins mapped to specific Uno pins.",
  lcdTitle: "16×2 LCD pin map",
  lcdIntroHtml:
    "The sketch uses the seven-argument <code>LiquidCrystal(rs, rw, enable, d4, d5, d6, d7)</code> form. In this build:",
  lcdItemsHtml: [
    "<strong>RS</strong> → digital pin 8",
    "<strong>RW</strong> → digital pin 9",
    "<strong>Enable</strong> → analog pin A2 (used as digital output)",
    "<strong>D4–D7</strong> → digital pins 5, 6, 3, and analog pin A3 respectively",
  ],
  lcdRw:
    "Most tutorials tie RW straight to ground and use a six-argument constructor. Wiring RW to pin 9 is less common but valid: it allows the library to read the LCD busy flag instead of blind-writing every character.",
  backlightTitle: "Backlight on pin 7",
  backlightBody:
    "Pin 7 is not an LCD data line. It drives the backlight through a small transistor on the breadboard (visible near the header in the physical build). Switching the backlight separately saves power and lets you blink the display for alerts without rewriting LCD text.",
  dhtTitle: "DHT22 data pins",
  dhtItemsHtml: [
    "<strong>Sensor 1 data</strong> → analog pin A4",
    "<strong>Sensor 2 data</strong> → analog pin A5",
    "Both sensors also connect to 5 V and GND",
  ],
  dhtBodyHtml:
    "Analog pins A4 and A5 work perfectly as digital inputs on the Uno. They appear as <code>A4</code> and <code>A5</code> in code rather than <code>D14</code>/<code>D15</code> aliases: worth remembering when tracing wires by eye.",
  spiTitle: "Reserved SPI pins (Ethernet)",
  spiBody:
    "The Ethernet shield reserves pins 10–13 for SPI. None of the LCD or DHT22 wiring may use those lines; they are effectively off-limits on the header. Planning around that reservation is what makes Ethernet plus local sensors feasible on one Uno.",
  outroHtml: `Return to the <a class="text-link" href="/about/arduino-circuit-wiring">circuit wiring overview</a> for breadboard layout context, or read <a class="text-link" href="/about/arduino-dht22-lcd">DHT22 sensors and LCD display</a> for runtime behavior. Push ingest sample (no LCD): ${ETH_LINK}.`,
};

type ArduinoPinWiringMessages = typeof en;

const es: ArduinoPinWiringMessages = {
  introHtml:
    "El diagrama de pines de abajo coincide con el constructor <code>LiquidCrystal</code> del firmware y con las líneas de datos de los DHT22 usadas en este proyecto. Úsalo para comprobar los cables puente frente al sketch, sobre todo si hay pines analógicos funcionando como E/S digitales.",
  diagramAlt: "Diagrama de conexiones pin a pin de un Arduino Uno con una pantalla LCD y dos sensores DHT22",
  diagramCaption:
    "RS, RW, EN, líneas de datos, retroiluminación y los dos pines de datos de los DHT22 asignados a pines concretos del Uno.",
  lcdTitle: "Mapa de pines del LCD 16×2",
  lcdIntroHtml:
    "El sketch usa la forma de siete argumentos <code>LiquidCrystal(rs, rw, enable, d4, d5, d6, d7)</code>. En este montaje:",
  lcdItemsHtml: [
    "<strong>RS</strong> → pin digital 8",
    "<strong>RW</strong> → pin digital 9",
    "<strong>Enable</strong> → pin analógico A2 (usado como salida digital)",
    "<strong>D4–D7</strong> → pines digitales 5, 6, 3 y pin analógico A3, respectivamente",
  ],
  lcdRw:
    "La mayoría de los tutoriales conectan RW directamente a tierra y usan un constructor de seis argumentos. Conectar RW al pin 9 es menos habitual pero válido: permite que la biblioteca lea el indicador de ocupado del LCD en lugar de escribir cada carácter a ciegas.",
  backlightTitle: "Retroiluminación en el pin 7",
  backlightBody:
    "El pin 7 no es una línea de datos del LCD. Controla la retroiluminación a través de un pequeño transistor en la protoboard (visible junto al conector en el montaje físico). Encender y apagar la retroiluminación por separado ahorra energía y permite hacer parpadear la pantalla para las alertas sin reescribir el texto del LCD.",
  dhtTitle: "Pines de datos de los DHT22",
  dhtItemsHtml: [
    "<strong>Datos del sensor 1</strong> → pin analógico A4",
    "<strong>Datos del sensor 2</strong> → pin analógico A5",
    "Ambos sensores se conectan también a 5 V y GND",
  ],
  dhtBodyHtml:
    "Los pines analógicos A4 y A5 funcionan perfectamente como entradas digitales en el Uno. En el código aparecen como <code>A4</code> y <code>A5</code>, no con los alias <code>D14</code>/<code>D15</code>: conviene recordarlo al seguir los cables a simple vista.",
  spiTitle: "Pines SPI reservados (Ethernet)",
  spiBody:
    "El shield Ethernet reserva los pines 10–13 para SPI. Ninguna conexión del LCD ni de los DHT22 puede usar esas líneas; en la práctica están vetadas en el conector. Planificar en torno a esa reserva es lo que hace posible combinar Ethernet y sensores locales en un solo Uno.",
  outroHtml: `Vuelve a la <a class="text-link" href="/about/arduino-circuit-wiring">vista general del cableado del circuito</a> para ver la disposición en la protoboard, o lee <a class="text-link" href="/about/arduino-dht22-lcd">Sensores DHT22 y pantalla LCD</a> para conocer el comportamiento en funcionamiento. Ejemplo de ingesta push (sin LCD): ${ETH_LINK}.`,
};

const fr: ArduinoPinWiringMessages = {
  introHtml:
    "Le schéma broche par broche ci-dessous correspond au constructeur <code>LiquidCrystal</code> du firmware et aux lignes de données DHT22 utilisées dans ce projet. Servez-vous-en pour vérifier les fils de liaison par rapport au sketch, surtout si des broches analogiques servent d’E/S numériques.",
  diagramAlt: "Schéma de câblage broche par broche d’un Arduino Uno relié à un écran LCD et à deux capteurs DHT22",
  diagramCaption:
    "RS, RW, EN, lignes de données, rétroéclairage et les deux broches de données DHT22 associés à des broches précises de l’Uno.",
  lcdTitle: "Brochage de l’écran LCD 16×2",
  lcdIntroHtml:
    "Le sketch utilise la forme à sept arguments <code>LiquidCrystal(rs, rw, enable, d4, d5, d6, d7)</code>. Dans ce montage :",
  lcdItemsHtml: [
    "<strong>RS</strong> → broche numérique 8",
    "<strong>RW</strong> → broche numérique 9",
    "<strong>Enable</strong> → broche analogique A2 (utilisée en sortie numérique)",
    "<strong>D4–D7</strong> → broches numériques 5, 6, 3 et broche analogique A3, respectivement",
  ],
  lcdRw:
    "La plupart des tutoriels relient RW directement à la masse et utilisent un constructeur à six arguments. Câbler RW sur la broche 9 est moins courant mais valable : la bibliothèque peut alors lire l’indicateur d’occupation du LCD au lieu d’écrire chaque caractère à l’aveugle.",
  backlightTitle: "Rétroéclairage sur la broche 7",
  backlightBody:
    "La broche 7 n’est pas une ligne de données du LCD. Elle pilote le rétroéclairage via un petit transistor sur la platine d’essai (visible près du connecteur sur le montage réel). Commander le rétroéclairage séparément économise de l’énergie et permet de faire clignoter l’écran pour les alertes sans réécrire le texte du LCD.",
  dhtTitle: "Broches de données DHT22",
  dhtItemsHtml: [
    "<strong>Données du capteur 1</strong> → broche analogique A4",
    "<strong>Données du capteur 2</strong> → broche analogique A5",
    "Les deux capteurs sont aussi reliés au 5 V et à GND",
  ],
  dhtBodyHtml:
    "Les broches analogiques A4 et A5 fonctionnent parfaitement comme entrées numériques sur l’Uno. Dans le code, elles s’écrivent <code>A4</code> et <code>A5</code> plutôt que via les alias <code>D14</code>/<code>D15</code> : bon à savoir quand on suit les fils à l’œil.",
  spiTitle: "Broches SPI réservées (Ethernet)",
  spiBody:
    "Le shield Ethernet réserve les broches 10 à 13 au SPI. Aucun câblage du LCD ou des DHT22 ne peut utiliser ces lignes ; elles sont de fait interdites sur le connecteur. C’est en tenant compte de cette réservation que l’on peut combiner Ethernet et capteurs locaux sur un seul Uno.",
  outroHtml: `Revenez à la <a class="text-link" href="/about/arduino-circuit-wiring">vue d’ensemble du câblage</a> pour la disposition sur la platine d’essai, ou lisez <a class="text-link" href="/about/arduino-dht22-lcd">Capteurs DHT22 et écran LCD</a> pour le fonctionnement en conditions réelles. Exemple d’ingestion push (sans LCD) : ${ETH_LINK}.`,
};

const de: ArduinoPinWiringMessages = {
  introHtml:
    "Der Pinbelegungsplan unten entspricht dem <code>LiquidCrystal</code>-Konstruktor der Firmware und den in diesem Projekt verwendeten DHT22-Datenleitungen. Nutze ihn, um die Steckbrücken mit dem Sketch abzugleichen, vor allem wenn Analog-Pins als digitale Ein-/Ausgänge dienen.",
  diagramAlt: "Pin-genauer Schaltplan eines Arduino Uno mit LCD und zwei DHT22-Sensoren",
  diagramCaption:
    "RS, RW, EN, Datenleitungen, Hintergrundbeleuchtung und beide DHT22-Datenpins, jeweils bestimmten Uno-Pins zugeordnet.",
  lcdTitle: "Pinbelegung des 16×2-LCD",
  lcdIntroHtml:
    "Der Sketch verwendet die Variante mit sieben Argumenten <code>LiquidCrystal(rs, rw, enable, d4, d5, d6, d7)</code>. In diesem Aufbau:",
  lcdItemsHtml: [
    "<strong>RS</strong> → Digital-Pin 8",
    "<strong>RW</strong> → Digital-Pin 9",
    "<strong>Enable</strong> → Analog-Pin A2 (als Digitalausgang genutzt)",
    "<strong>D4–D7</strong> → Digital-Pins 5, 6, 3 bzw. Analog-Pin A3",
  ],
  lcdRw:
    "Die meisten Anleitungen legen RW direkt auf Masse und nutzen einen Konstruktor mit sechs Argumenten. RW an Pin 9 anzuschließen ist seltener, aber zulässig: So kann die Bibliothek das Busy-Flag des LCD auslesen, statt jedes Zeichen blind zu schreiben.",
  backlightTitle: "Hintergrundbeleuchtung an Pin 7",
  backlightBody:
    "Pin 7 ist keine LCD-Datenleitung. Er steuert die Hintergrundbeleuchtung über einen kleinen Transistor auf dem Steckbrett (im realen Aufbau neben der Stiftleiste zu sehen). Wird die Beleuchtung separat geschaltet, spart das Strom, und das Display kann bei Warnungen blinken, ohne dass der LCD-Text neu geschrieben werden muss.",
  dhtTitle: "DHT22-Datenpins",
  dhtItemsHtml: [
    "<strong>Daten Sensor 1</strong> → Analog-Pin A4",
    "<strong>Daten Sensor 2</strong> → Analog-Pin A5",
    "Beide Sensoren sind außerdem an 5 V und GND angeschlossen",
  ],
  dhtBodyHtml:
    "Die Analog-Pins A4 und A5 funktionieren am Uno einwandfrei als Digitaleingänge. Im Code heißen sie <code>A4</code> und <code>A5</code> statt der Aliasse <code>D14</code>/<code>D15</code>: gut zu wissen, wenn du Leitungen mit bloßem Auge verfolgst.",
  spiTitle: "Reservierte SPI-Pins (Ethernet)",
  spiBody:
    "Das Ethernet-Shield reserviert die Pins 10–13 für SPI. Keine LCD- oder DHT22-Verbindung darf diese Leitungen nutzen; an der Stiftleiste sind sie praktisch tabu. Erst die Planung um diese Reservierung herum macht Ethernet plus lokale Sensoren auf einem einzigen Uno möglich.",
  outroHtml: `Zurück zur <a class="text-link" href="/about/arduino-circuit-wiring">Übersicht der Schaltungsverdrahtung</a> für den Aufbau auf dem Steckbrett, oder lies <a class="text-link" href="/about/arduino-dht22-lcd">DHT22-Sensoren und LCD-Anzeige</a> zum Verhalten im Betrieb. Push-Ingest-Beispiel (ohne LCD): ${ETH_LINK}.`,
};

const ptBr: ArduinoPinWiringMessages = {
  introHtml:
    "O diagrama de pinos abaixo corresponde ao construtor <code>LiquidCrystal</code> do firmware e às linhas de dados dos DHT22 usadas neste projeto. Use-o para conferir os jumpers com o sketch, principalmente quando pinos analógicos estiverem sendo usados como E/S digital.",
  diagramAlt: "Diagrama de ligação pino a pino de um Arduino Uno conectado a um LCD e a dois sensores DHT22",
  diagramCaption:
    "RS, RW, EN, linhas de dados, luz de fundo e os dois pinos de dados dos DHT22 mapeados para pinos específicos do Uno.",
  lcdTitle: "Mapa de pinos do LCD 16×2",
  lcdIntroHtml:
    "O sketch usa a forma de sete argumentos <code>LiquidCrystal(rs, rw, enable, d4, d5, d6, d7)</code>. Nesta montagem:",
  lcdItemsHtml: [
    "<strong>RS</strong> → pino digital 8",
    "<strong>RW</strong> → pino digital 9",
    "<strong>Enable</strong> → pino analógico A2 (usado como saída digital)",
    "<strong>D4–D7</strong> → pinos digitais 5, 6, 3 e pino analógico A3, respectivamente",
  ],
  lcdRw:
    "A maioria dos tutoriais liga o RW direto no terra e usa um construtor de seis argumentos. Ligar o RW ao pino 9 é menos comum, mas válido: permite que a biblioteca leia a flag de ocupado do LCD em vez de escrever cada caractere às cegas.",
  backlightTitle: "Luz de fundo no pino 7",
  backlightBody:
    "O pino 7 não é uma linha de dados do LCD. Ele aciona a luz de fundo por meio de um pequeno transistor na protoboard (visível perto do conector na montagem física). Controlar a luz de fundo separadamente economiza energia e permite piscar a tela nos alertas sem reescrever o texto do LCD.",
  dhtTitle: "Pinos de dados dos DHT22",
  dhtItemsHtml: [
    "<strong>Dados do sensor 1</strong> → pino analógico A4",
    "<strong>Dados do sensor 2</strong> → pino analógico A5",
    "Os dois sensores também são ligados a 5 V e GND",
  ],
  dhtBodyHtml:
    "Os pinos analógicos A4 e A5 funcionam perfeitamente como entradas digitais no Uno. No código, eles aparecem como <code>A4</code> e <code>A5</code>, e não pelos apelidos <code>D14</code>/<code>D15</code>: vale lembrar disso ao seguir os fios a olho.",
  spiTitle: "Pinos SPI reservados (Ethernet)",
  spiBody:
    "O shield Ethernet reserva os pinos 10–13 para SPI. Nenhuma ligação do LCD ou dos DHT22 pode usar essas linhas; na prática, elas estão proibidas no conector. É o planejamento em torno dessa reserva que torna possível usar Ethernet e sensores locais em um único Uno.",
  outroHtml: `Volte à <a class="text-link" href="/about/arduino-circuit-wiring">visão geral da ligação do circuito</a> para ver a disposição na protoboard, ou leia <a class="text-link" href="/about/arduino-dht22-lcd">Sensores DHT22 e display LCD</a> para entender o funcionamento. Exemplo de ingestão push (sem LCD): ${ETH_LINK}.`,
};

export const arduinoPinWiringMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

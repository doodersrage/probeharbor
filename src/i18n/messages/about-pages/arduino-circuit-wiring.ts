import { defineMessages } from "../../translate";

/** /about/arduino-circuit-wiring body copy. `*Html` keys are trusted inline HTML (English hrefs). */
const en = {
  introHtml:
    "This build centers on an Arduino Uno with a W5100 Ethernet shield stacked on top, a solderless breadboard for power distribution and LCD support components, a 16×2 character LCD for local readouts, and two DHT22 temperature and humidity sensors. USB supplies bench power during development; a permanent install typically moves to a regulated 5 V supply.",
  diagramAlt: "Wiring diagram of Arduino Uno with Ethernet shield, breadboard, LCD, and two DHT22 sensors",
  diagramCaption:
    "High-level wiring: power enters the Uno, signals route through the breadboard to the LCD and both DHT22 sensors.",
  breadboardTitle: "Breadboard and power rails",
  breadboardHtml:
    "The breadboard mainly carries 5 V and GND power rails plus the LCD signal wiring. Keeping power and signals organized on the breadboard makes it easier to swap the contrast potentiometer or LCD without disturbing sensor leads. Tie the Arduino ground to the breadboard ground rail so every component shares a common reference.",
  contrastTitle: "LCD contrast circuit",
  contrastHtml:
    "A trim potentiometer on the breadboard sets the contrast voltage on the LCD's V0 pin. Without that divider, the display may look blank or fully dark even when the sketch is running correctly. Adjust the pot after power-up until both lines of text are readable at a glance from across the space.",
  dhtTitle: "Dual DHT22 sensors",
  dhtHtml:
    "Each DHT22 uses three connections: data, VCC, and GND. Routing data to separate Arduino pins lets the firmware poll the sensors independently, which is why the LCD can show two different temperature and humidity pairs side by side, for example 21.75 °C / 71.15% on one line and a second probe reading on the next.",
  ethernetTitle: "Ethernet shield placement",
  ethernetHtml:
    "The Ethernet shield sits piggybacked on the Uno and communicates over SPI (pins 10–13 on a classic Uno layout). It does not share data pins with the LCD or DHT22 wiring, leaving room on the header for sensor and display connections. That separation is what makes this combination workable on a single board without pin conflicts.",
  nextHtml:
    'For exact GPIO numbers matching the sketch, continue to <a class="text-link" href="/about/arduino-pin-wiring">Arduino pin-level wiring</a>. For how the LCD and probes behave in firmware, see <a class="text-link" href="/about/arduino-dht22-lcd">DHT22 sensors and LCD display</a>.',
};

type Messages = typeof en;

const es: Messages = {
  introHtml:
    "Este montaje se basa en un Arduino Uno con un shield Ethernet W5100 encima, una protoboard sin soldadura para repartir la alimentación y los componentes auxiliares del LCD, un LCD de caracteres de 16×2 para ver las lecturas en local y dos sensores de temperatura y humedad DHT22. Durante el desarrollo, el USB alimenta el banco de pruebas; en una instalación permanente se suele pasar a una fuente regulada de 5 V.",
  diagramAlt: "Esquema de cableado de un Arduino Uno con shield Ethernet, protoboard, LCD y dos sensores DHT22",
  diagramCaption:
    "Cableado general: la alimentación entra por el Uno y las señales pasan por la protoboard hasta el LCD y los dos sensores DHT22.",
  breadboardTitle: "Protoboard y líneas de alimentación",
  breadboardHtml:
    "La protoboard lleva sobre todo las líneas de alimentación de 5 V y GND, además del cableado de señal del LCD. Tener la alimentación y las señales ordenadas en la protoboard facilita cambiar el potenciómetro de contraste o el LCD sin tocar los cables de los sensores. Une la tierra del Arduino con la línea de tierra de la protoboard para que todos los componentes compartan la misma referencia.",
  contrastTitle: "Circuito de contraste del LCD",
  contrastHtml:
    "Un potenciómetro de ajuste en la protoboard fija la tensión de contraste en el pin V0 del LCD. Sin ese divisor, la pantalla puede verse en blanco o totalmente oscura aunque el sketch funcione bien. Ajusta el potenciómetro después de encender hasta que las dos líneas de texto se lean de un vistazo desde el otro lado del espacio.",
  dhtTitle: "Dos sensores DHT22",
  dhtHtml:
    "Cada DHT22 usa tres conexiones: datos, VCC y GND. Llevar los datos a pines distintos del Arduino permite al firmware consultar los sensores por separado; por eso el LCD puede mostrar dos pares de temperatura y humedad distintos, por ejemplo 21,75 °C / 71,15 % en una línea y la lectura de la segunda sonda en la siguiente.",
  ethernetTitle: "Ubicación del shield Ethernet",
  ethernetHtml:
    "El shield Ethernet va montado sobre el Uno y se comunica por SPI (pines 10–13 en la disposición clásica del Uno). No comparte pines de datos con el cableado del LCD ni de los DHT22, lo que deja sitio en el conector para los sensores y la pantalla. Esa separación es lo que hace viable esta combinación en una sola placa sin conflictos de pines.",
  nextHtml:
    'Para los números de GPIO exactos que usa el sketch, sigue con el <a class="text-link" href="/about/arduino-pin-wiring">cableado pin a pin del Arduino</a>. Para ver cómo se comportan el LCD y las sondas en el firmware, consulta <a class="text-link" href="/about/arduino-dht22-lcd">sensores DHT22 y pantalla LCD</a>.',
};

const fr: Messages = {
  introHtml:
    "Ce montage s’articule autour d’un Arduino Uno surmonté d’un shield Ethernet W5100, d’une platine d’essai sans soudure pour distribuer l’alimentation et accueillir les composants de l’écran, d’un écran LCD de 16×2 caractères pour l’affichage local et de deux capteurs de température et d’humidité DHT22. Pendant le développement, l’USB alimente le banc d’essai ; une installation permanente passe généralement à une alimentation régulée de 5 V.",
  diagramAlt: "Schéma de câblage d’un Arduino Uno avec shield Ethernet, platine d’essai, écran LCD et deux capteurs DHT22",
  diagramCaption:
    "Câblage simplifié : l’alimentation arrive sur l’Uno, les signaux passent par la platine d’essai vers l’écran LCD et les deux capteurs DHT22.",
  breadboardTitle: "Platine d’essai et rails d’alimentation",
  breadboardHtml:
    "La platine d’essai porte surtout les rails d’alimentation 5 V et GND ainsi que le câblage des signaux de l’écran LCD. Des alimentations et des signaux bien rangés sur la platine permettent de remplacer le potentiomètre de contraste ou l’écran sans déranger les fils des capteurs. Reliez la masse de l’Arduino au rail de masse de la platine pour que tous les composants partagent la même référence.",
  contrastTitle: "Circuit de contraste de l’écran LCD",
  contrastHtml:
    "Un potentiomètre d’ajustement sur la platine règle la tension de contraste sur la broche V0 de l’écran. Sans ce diviseur, l’affichage peut paraître vide ou entièrement sombre alors même que le sketch fonctionne correctement. Ajustez le potentiomètre après la mise sous tension jusqu’à ce que les deux lignes de texte se lisent d’un coup d’œil depuis l’autre bout de la pièce.",
  dhtTitle: "Deux capteurs DHT22",
  dhtHtml:
    "Chaque DHT22 utilise trois connexions : données, VCC et GND. Relier les données à des broches distinctes de l’Arduino permet au firmware d’interroger les capteurs séparément ; c’est pourquoi l’écran peut afficher deux couples température-humidité différents, par exemple 21,75 °C / 71,15 % sur une ligne et la mesure d’une seconde sonde sur la suivante.",
  ethernetTitle: "Position du shield Ethernet",
  ethernetHtml:
    "Le shield Ethernet s’enfiche directement sur l’Uno et communique en SPI (broches 10 à 13 sur un Uno classique). Il ne partage aucune broche de données avec le câblage de l’écran ou des DHT22, ce qui laisse de la place sur le connecteur pour les capteurs et l’affichage. C’est cette séparation qui rend cette combinaison possible sur une seule carte, sans conflit de broches.",
  nextHtml:
    'Pour les numéros de GPIO exacts utilisés par le sketch, poursuivez avec le <a class="text-link" href="/about/arduino-pin-wiring">câblage broche par broche de l’Arduino</a>. Pour le comportement de l’écran et des sondes dans le firmware, voir <a class="text-link" href="/about/arduino-dht22-lcd">capteurs DHT22 et écran LCD</a>.',
};

const de: Messages = {
  introHtml:
    "Im Mittelpunkt dieses Aufbaus steht ein Arduino Uno mit aufgestecktem W5100-Ethernet-Shield, ein lötfreies Steckbrett für die Stromverteilung und die Zusatzbauteile des LCD, ein 16×2-Zeichen-LCD für die Anzeige vor Ort und zwei DHT22-Temperatur- und Feuchtesensoren. Während der Entwicklung liefert USB den Strom am Arbeitstisch; bei einer festen Installation wechselt man meist auf ein geregeltes 5-V-Netzteil.",
  diagramAlt: "Schaltplan eines Arduino Uno mit Ethernet-Shield, Steckbrett, LCD und zwei DHT22-Sensoren",
  diagramCaption:
    "Verkabelung im Überblick: Der Strom kommt am Uno an, die Signale laufen über das Steckbrett zum LCD und zu beiden DHT22-Sensoren.",
  breadboardTitle: "Steckbrett und Stromschienen",
  breadboardHtml:
    "Das Steckbrett trägt vor allem die 5-V- und GND-Schienen sowie die Signalleitungen des LCD. Wenn Strom und Signale auf dem Steckbrett ordentlich verlegt sind, lassen sich Kontrastpoti oder LCD tauschen, ohne die Sensorkabel anzufassen. Verbinde die Masse des Arduino mit der Masseschiene des Steckbretts, damit alle Bauteile dasselbe Bezugspotenzial haben.",
  contrastTitle: "Kontrastschaltung des LCD",
  contrastHtml:
    "Ein Trimmpoti auf dem Steckbrett stellt die Kontrastspannung am V0-Pin des LCD ein. Ohne diesen Spannungsteiler wirkt das Display leer oder komplett dunkel, selbst wenn der Sketch einwandfrei läuft. Dreh nach dem Einschalten so lange am Poti, bis beide Textzeilen auch von der anderen Seite des Raums auf einen Blick lesbar sind.",
  dhtTitle: "Zwei DHT22-Sensoren",
  dhtHtml:
    "Jeder DHT22 hat drei Anschlüsse: Daten, VCC und GND. Führt man die Datenleitungen auf getrennte Arduino-Pins, kann die Firmware die Sensoren unabhängig voneinander abfragen. Deshalb zeigt das LCD zwei verschiedene Temperatur- und Feuchtepaare untereinander an, zum Beispiel 21,75 °C / 71,15 % in einer Zeile und den Wert des zweiten Fühlers in der nächsten.",
  ethernetTitle: "Lage des Ethernet-Shields",
  ethernetHtml:
    "Das Ethernet-Shield sitzt huckepack auf dem Uno und kommuniziert über SPI (Pins 10–13 beim klassischen Uno-Layout). Es teilt sich keine Datenpins mit der Verkabelung von LCD oder DHT22, sodass auf der Stiftleiste Platz für Sensoren und Display bleibt. Genau diese Trennung macht die Kombination auf einer einzigen Platine ohne Pin-Konflikte möglich.",
  nextHtml:
    'Die genauen GPIO-Nummern passend zum Sketch findest du unter <a class="text-link" href="/about/arduino-pin-wiring">Arduino-Verkabelung Pin für Pin</a>. Wie sich LCD und Fühler in der Firmware verhalten, erklärt <a class="text-link" href="/about/arduino-dht22-lcd">DHT22-Sensoren und LCD-Anzeige</a>.',
};

const ptBr: Messages = {
  introHtml:
    "Esta montagem gira em torno de um Arduino Uno com um shield Ethernet W5100 encaixado por cima, uma protoboard sem solda para distribuir a alimentação e os componentes de apoio do LCD, um LCD de caracteres 16×2 para mostrar as leituras no local e dois sensores de temperatura e umidade DHT22. Durante o desenvolvimento, o USB alimenta a bancada; em uma instalação permanente, normalmente se passa para uma fonte regulada de 5 V.",
  diagramAlt: "Diagrama de ligação de um Arduino Uno com shield Ethernet, protoboard, LCD e dois sensores DHT22",
  diagramCaption:
    "Ligação geral: a alimentação entra pelo Uno e os sinais passam pela protoboard até o LCD e os dois sensores DHT22.",
  breadboardTitle: "Protoboard e trilhas de alimentação",
  breadboardHtml:
    "A protoboard carrega principalmente as trilhas de alimentação de 5 V e GND, além da fiação de sinal do LCD. Manter alimentação e sinais organizados na protoboard facilita trocar o potenciômetro de contraste ou o LCD sem mexer nos fios dos sensores. Ligue o terra do Arduino à trilha de terra da protoboard para que todos os componentes compartilhem a mesma referência.",
  contrastTitle: "Circuito de contraste do LCD",
  contrastHtml:
    "Um trimpot na protoboard define a tensão de contraste no pino V0 do LCD. Sem esse divisor, a tela pode parecer vazia ou totalmente escura mesmo com o sketch funcionando direitinho. Ajuste o trimpot depois de ligar até que as duas linhas de texto fiquem legíveis num relance do outro lado do ambiente.",
  dhtTitle: "Dois sensores DHT22",
  dhtHtml:
    "Cada DHT22 usa três ligações: dados, VCC e GND. Levar os dados a pinos separados do Arduino permite que o firmware consulte os sensores de forma independente; é por isso que o LCD consegue mostrar dois pares diferentes de temperatura e umidade, por exemplo 21,75 °C / 71,15% em uma linha e a leitura da segunda sonda na seguinte.",
  ethernetTitle: "Posição do shield Ethernet",
  ethernetHtml:
    "O shield Ethernet fica encaixado sobre o Uno e se comunica por SPI (pinos 10–13 no layout clássico do Uno). Ele não compartilha pinos de dados com a fiação do LCD nem dos DHT22, deixando espaço no conector para os sensores e a tela. É essa separação que torna a combinação viável em uma única placa, sem conflito de pinos.",
  nextHtml:
    'Para os números exatos de GPIO usados no sketch, continue em <a class="text-link" href="/about/arduino-pin-wiring">ligação pino a pino do Arduino</a>. Para ver como o LCD e as sondas se comportam no firmware, veja <a class="text-link" href="/about/arduino-dht22-lcd">sensores DHT22 e tela LCD</a>.',
};

export const arduinoCircuitWiringMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

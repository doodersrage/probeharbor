
/** /about/arduino-circuit-wiring body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

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

export default fr;


/** /about/arduino-pin-wiring body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
const ETH_LINK =
  '<a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest" target="_blank" rel="noreferrer"><code>ethernet_dht22_ingest</code></a>';
import type { ArduinoPinWiringMessages } from "./en";

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

export default fr;


/** /about/arduino-dht22-lcd body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
const ETH_LINK =
  '<a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest" target="_blank" rel="noreferrer"><code>ethernet_dht22_ingest</code></a>';
import type { ArduinoDht22LcdMessages } from "./en";

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

export default fr;

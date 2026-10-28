/**
 * BrowserFlasher component (/flash and the English-only dashboard).
 * `status` strings are read by the inline script from a data attribute;
 * `{sensor}` and `{error}` are filled in on the client.
 */
import type { BrowserFlasherMessages } from "./en";

const fr: BrowserFlasherMessages = {
  installTitle: "1. Installer le firmware",
  installCopy:
    "Branchez l’ESP32 sur cet ordinateur avec un câble USB de données, cliquez sur Installer et choisissez le port série de la carte. Cela prend environ une minute. Testé sur l’ESP32 d’origine ; les images ESP32-S3 et ESP32-C3 sont compilées, mais pas encore testées sur du matériel.",
  installButton: "Installer le firmware",
  unsupportedHtml:
    'Ce navigateur ne peut pas communiquer avec les périphériques série USB. Ouvrez cette page dans Chrome ou Edge sur un ordinateur fixe ou portable, ou utilisez les <a class="text-link" href="/about/esp32-web-flash">autres méthodes de flashage</a>.',
  notAllowed: "L’installateur nécessite une page sécurisée (https).",
  noPort:
    "Aucun port dans la liste ? Essayez un autre câble (beaucoup ne font que charger) et installez le pilote CP210x ou CH340 de votre carte.",
  connectTitle: "2. Le connecter au Wi‑Fi et à votre compte",
  connectCopy:
    "Fermez l’installateur, puis envoyez ces réglages par le même câble. Ils vont directement à la carte et ne sont pas enregistrés sur cette page.",
  ssidLabel: "Nom du réseau Wi‑Fi",
  ssidHint: "Réseau 2,4 GHz ; les cartes ESP32 ne peuvent pas se connecter en 5 GHz.",
  passwordLabel: "Mot de passe Wi‑Fi",
  keyLabel: "Clé de l’appareil",
  keyHintPrefilled: "Pré-remplie pour l’appareil que vous venez de créer.",
  keyHint:
    "Dans Dashboard → Devices, après avoir ajouté un appareil push. Coller l’URL d’ingestion complète fonctionne aussi.",
  extrasLegend: "Également câblé sur cette carte (facultatif)",
  extraLeak: "Contact de fuite / d’eau",
  extraDoor: "Interrupteur reed de porte",
  extraBattery: "Batterie (pont diviseur 1:1)",
  extrasHint:
    "Ne cochez que ce que vous avez branché : une broche non câblée serait lue comme « sec » ou « ouvert ». Les broches figurent dans le tableau ci-dessus. Les capteurs DS18B20, DHT22 et I²C (BME280, SHT31, AHT20) sont détectés automatiquement.",
  sendButton: "Envoyer les réglages par USB",
  phoneSetupHtml:
    "Pas de série USB dans votre navigateur, ou la carte est déjà installée ailleurs ? Mettez-la sous tension et connectez un téléphone au réseau Wi‑Fi <strong>ProbeHarbor-Setup</strong> pour saisir les mêmes réglages. Maintenir le bouton BOOT cinq secondes les efface.",
  status: {
    noSerial:
      "Ce navigateur ne prend pas en charge la série USB. Utilisez Chrome ou Edge sur un ordinateur, ou la configuration par téléphone ci-dessous.",
    pickPort: "Choisissez le port série de la carte…",
    waiting: "Attente du démarrage de la carte…",
    sending: "Envoi des réglages…",
    received: "Réglages reçus. Connexion au Wi‑Fi…",
    wifiOk: "Connectée au Wi‑Fi. Envoi du premier relevé…",
    liveWithSensor:
      "Premier relevé reçu de votre {sensor}, avec l’humidité. C’est en service : vous pouvez le débrancher et l’installer.",
    live: "Premier relevé reçu. La sonde est en service : vous pouvez la débrancher et l’installer.",
    noReading:
      "La carte a reçu les réglages, mais aucun relevé n’est encore arrivé. Vérifiez le câblage du capteur (données sur GPIO 4, 4,7 kΩ vers le 3,3 V), puis réessayez.",
    noAnswer: "Pas de réponse de la carte. Vérifiez que l’installation du firmware est terminée, puis réessayez.",
    noPortSelected: "Aucun port sélectionné.",
    couldNotTalk: "Impossible de communiquer avec la carte : {error}",
  },
};

export default fr;

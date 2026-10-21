
/** /about/esp32-web-flash body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
import type { Esp32WebFlashMessages } from "./en";

const fr: Esp32WebFlashMessages = {
  introHtml:
    'Le plus rapide, c’est le <a class="text-link" href="/flash">flasheur dans le navigateur</a> (bêta) : il installe un firmware précompilé par USB et transmet à la carte votre Wi‑Fi et la clé de l’appareil, sans IDE. Il fonctionne avec des sondes DS18B20 (jusqu’à quatre) ou un DHT22/DHT11 pour la température et l’humidité, le tout câblé sur GPIO 4. Si vous voulez lire ou modifier le code, créez un appareil push → <strong>téléchargez un sketch prérempli</strong> → flashez-le avec l’outil que vous connaissez déjà.',
  devicesTitle: "1. Télécharger depuis Devices (recommandé)",
  devicesStep1Html:
    'Ouvrez <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> et créez un appareil push.',
  devicesStep2Html:
    "Dans l’encart d’ingestion, téléchargez <strong>Arduino .ino</strong>, <strong>MicroPython .py</strong>, <strong>CircuitPython code.py</strong> (Pico W) ou <strong>ESPHome</strong> : l’URL d’ingestion est déjà renseignée, il ne reste que le Wi‑Fi à configurer.",
  devicesStep3Html:
    "Suivez la check-list ESP32 de cette carte (paquet de cartes, bibliothèques, Serial 115200 → <code>POST 200</code>).",
  arduinoTitle: "2. Arduino IDE",
  arduinoItem1Html:
    "Installez la prise en charge des cartes <strong>ESP32</strong> (Espressif), et non le parcours Uno Ethernet avec écran LCD de garage.",
  arduinoItem2Html:
    "Bibliothèques : <code>OneWire</code>, <code>DallasTemperature</code> (gestionnaire de bibliothèques).",
  arduinoItem3Html:
    "Ouvrez le <code>.ino</code> téléchargé, renseignez <code>WIFI_*</code>, choisissez le port, puis flashez.",
  pioTitle: "3. PlatformIO",
  pioBodyHtml:
    'L’exemple du dépôt <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer"><code>sketches/arduino/ds18b20_ingest/</code></a> fournit un <code>platformio.ini</code> avec des bibliothèques aux versions figées et <code>monitor_speed = 115200</code>. Passez l’URL d’ingestion via les build flags ou collez le sketch généré par Devices dans <code>src/main.cpp</code>.',
  microTitle: "4. MicroPython (Thonny / mpremote)",
  microBodyHtml:
    "Flashez une image MicroPython une seule fois, puis copiez le <code>main.py</code> téléchargé (URL d’ingestion préremplie). Aucun paquet de cartes Arduino nécessaire.",
  esptoolTitle: "5. esptool dans le navigateur (si vous avez déjà un .bin)",
  esptoolBodyHtml:
    "Si vous compilez un binaire en local (PlatformIO <code>pio run</code>), vous pouvez le flasher depuis Chrome/Edge avec l’outil Web Serial d’Espressif, pratique sur les PC verrouillés sans IDE complet :",
  esptoolNote:
    "Cet outil flashe les données que vous lui fournissez ; il ne connaît pas votre clé ProbeHarbor. Continuez à utiliser le téléchargement Devices pour intégrer l’URL au code avant de compiler.",
  portalTitle: "6. Wi‑Fi via un portail captif",
  portalBodyHtml:
    'Évitez d’inscrire le SSID et le mot de passe dans le code grâce à l’<a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_wifimanager" target="_blank" rel="noreferrer">exemple WiFiManager</a> : connectez-vous une fois au point d’accès de configuration, puis la sonde mémorise les identifiants. Renseignez tout de même <code>INGEST_URL</code> depuis Devices (ou téléchargez et fusionnez).',
  relatedTitle: "Voir aussi",
  related: {
    kit: "Liste des pièces du kit antigel ESP32",
    pico: "Ingestion avec Raspberry Pi Pico W",
    stm32: "Ingestion avec STM32 Zephyr",
    ch32v: "Ingestion avec CH32V RISC-V",
    avr: "Ingestion en assembleur AVR",
    adding: "Ajouter des appareils",
    ota: "OTA et batterie / RSSI",
    qr: "QR du kit",
    sketches: "Tous les sketches ↗",
  },
};

export default fr;

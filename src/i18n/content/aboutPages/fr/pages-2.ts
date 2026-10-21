import type { AboutPageOverlay } from "..";

/** Pin wiring, DHT22/LCD, Python feeds, accounts, alerts and ingest guides. */
export default {
  "arduino-pin-wiring": {
    title: "Câblage Arduino broche par broche",
    description:
      "Affectation exacte des GPIO pour l’écran LCD 16×2, les lignes de données DHT22, le transistor du rétroéclairage et les broches SPI réservées.",
    summary: "Plan broche par broche conforme au constructeur LiquidCrystal et aux lignes de données des capteurs dans le firmware.",
  },
  "liquid-crystal-gpio-map": {
    title: "Carte des GPIO LiquidCrystal",
    description:
      "Faites correspondre les broches RS, E et D4–D7 de LiquidCrystal au constructeur de votre sketch pour que l’écran LCD s’allume au lieu de rester vide.",
    summary: "Les broches du LCD doivent correspondre exactement au sketch, sinon l’écran reste vide.",
  },
  "dht22-data-line-wiring": {
    title: "Câblage de la ligne de données DHT22",
    description:
      "Reliez chaque DHT22 à son propre GPIO avec un pull-up de 10 kΩ et une masse commune, loin des moteurs de porte et charges bruyantes, pour limiter les erreurs.",
    summary: "Une broche de données par sonde, avec le bon pull-up et des longueurs limitées.",
  },
  "spi-pins-ethernet-reserved": {
    title: "Broches SPI réservées à l’Ethernet",
    description:
      "Les broches Arduino qu’un shield Ethernet W5100 réserve au SPI, et les GPIO qui restent libres pour LiquidCrystal et les sondes DHT22.",
    summary: "Évitez les conflits de broches entre la pile Ethernet et les périphériques locaux.",
  },
  "backlight-pwm-options": {
    title: "Options PWM pour le rétroéclairage LCD",
    description:
      "Atténuez le rétroéclairage du LCD 16×2 avec un transistor, une broche PWM ou une extinction programmée pour limiter l’éblouissement et la consommation la nuit.",
    summary:
      "Le rétroéclairage se pilote indépendamment des broches de données LiquidCrystal : câblez-le en connaissance de cause.",
  },
  "jumper-wire-standards": {
    title: "Bonnes pratiques pour les fils de breadboard",
    description:
      "Choisissez entre fils rigides ou souples, conventions de couleurs et serre-câbles pour les montages soumis aux vibrations.",
    summary:
      "Des couleurs cohérentes et des connexions bien enfoncées évitent les sondes intermittentes quand la porte fait trembler le mur.",
  },
  "arduino-dht22-lcd": {
    title: "Capteurs DHT22 et écran LCD",
    description:
      "Lecture de deux DHT22, affichage sur l’écran LCD local, pilotage du rétroéclairage et partage des connecteurs avec le shield Ethernet.",
    summary:
      "Pourquoi les deux sondes s’affichent séparément sur l’écran LCD alors que les flux JSON les exposent toutes deux au site web.",
  },
  "dht22-read-errors-retries": {
    title: "Erreurs de lecture DHT22 et nouvelles tentatives",
    description:
      "Gérez les erreurs de checksum et de timing avec un délai progressif pour qu’une mauvaise lecture ne vide pas le flux.",
    summary: "Nouvelles tentatives et intervalles minimum gardent le JSON stable dans les installations exposées aux courants d’air.",
  },
  "lcd-local-display-format": {
    title: "Format de l’affichage LCD local",
    description:
      "Mettez en forme les lignes température et humidité de l’écran LCD pour valider les sondes sur place sans ouvrir d’ordinateur portable.",
    summary: "Conventions d’affichage sur deux lignes pour les contrôleurs à double sonde.",
  },
  "dual-probe-averaging": {
    title: "Logique de moyenne à double sonde",
    description:
      "Calculez la moyenne JSON sur les sondes en bon état tout en gardant les valeurs par zone sur l’écran LCD et dans les flux.",
    summary: "Quand moyenner, quand exclure une lecture ratée, et comment l’historique utilise avg.",
  },
  "sensor-warm-up-time": {
    title: "Temps de chauffe du capteur DHT22",
    description:
      "Laissez le capteur se stabiliser après la mise sous tension avant de vous fier à l’humidité pour juger d’un risque de condensation ou de moisissure.",
    summary:
      "Les premières lectures après le démarrage peuvent être en retard ; les minutes de chauffe comptent plus pour l’humidité que pour la température.",
  },
  "lcd-i2c-alternative": {
    title: "Alternative : écran LCD I²C",
    description:
      "Libérez des GPIO en passant du LiquidCrystal parallèle à un module I²C quand le shield Ethernet accapare les broches disponibles.",
    summary:
      "Les LCD I²C à deux fils économisent des broches, au prix d’une autre bibliothèque et d’une gestion des adresses.",
  },
  "python-feeds": {
    title: "Scripts Python et flux JSON",
    description:
      "Services relais FastAPI, cache Redis et outils Python placés entre les sondes et le tableau de bord.",
    summary:
      "Les scripts backend normalisent le JSON des sondes, mettent les réponses en cache et exposent des endpoints HTTPS stables.",
  },
  "fastapi-relay-setup": {
    title: "Mise en place du relais FastAPI",
    description:
      "Installez et lancez le relais Python FastAPI qui interroge le JSON de l’Arduino et expose un flux HTTPS stable que ProbeHarbor vient lire.",
    summary: "Installez, configurez l’URL source et vérifiez les réponses en cache avec curl.",
  },
  "data-flow": {
    title: "Le flux de données de bout en bout",
    description:
      "Suivez un relevé du fil de la sonde aux flux JSON, au stockage, jusqu’au tableau de bord d’historique connecté.",
    summary: "Matériel, relais, récupération par le site, stockage Supabase et export CSV en une seule chaîne.",
  },
  "debugging-stale-readings": {
    title: "Déboguer des relevés figés",
    description:
      "Remontez un relevé figé ou absent du firmware au cache du relais puis au mapping du tableau de bord ProbeHarbor, avec une checklist curl et auth.",
    summary: "Checklist dans l’ordre : curl, cache, authentification et fautes de frappe dans les clés.",
  },
  "weather-api-parallel-path": {
    title: "API météo : un flux de données parallèle",
    description:
      "Récupérez prévisions et conditions extérieures en parallèle du JSON des sondes pour donner du contexte sur la page d’accueil ou dans vos CSV fusionnés.",
    summary:
      "La météo extérieure explique les variations du garage dues à l’humidité et au vent, pas seulement aux ouvertures de porte.",
  },
  "accounts-and-dashboard": {
    title: "Comptes, abonnements et outils du tableau de bord",
    description:
      "Checklist une fois connecté : appareils et capteurs, alertes, foyers, liens de partage, offres Stripe et outils d’administration.",
    summary:
      "Créez un compte, connectez le matériel, configurez les alertes, invitez votre foyer et passez à l’offre supérieure quand il vous faut les canaux Pro.",
  },
  "configuring-temperature-feeds": {
    title: "Configurer les flux de température",
    description:
      "Ajoutez des URL de flux HTTPS interrogés, définissez la clé racine JSON, nommez les sondes et vérifiez que Home se met à jour.",
    summary: "URL de flux interrogés, clé racine JSON, libellés de sondes et dépannage.",
  },
  "group-membership-model": {
    title: "Le modèle d’appartenance aux groupes",
    description:
      "Comment les groupes default, member et admin de Supabase régissent l’export CSV, les outils d’opérateur et les fonctions des offres, sans e-mails codés en dur.",
    summary:
      "Les groupes portent les rôles d’abonnement et d’opérateur sans e-mails écrits en dur dans le code source.",
  },
  "display-preferences-deep-dive": {
    title: "Préférences d’affichage en détail",
    description:
      "Choisissez Celsius ou Fahrenheit par défaut, l’ordre des cartes et la visibilité de chaque flux sur la page d’accueil connectée.",
    summary:
      "Les préférences sont enregistrées par compte : les flux JSON partagés s’affichent dans vos unités préférées.",
  },
  "cold-snap-playbook": {
    title: "Plan d’action vague de froid",
    description:
      "Que faire avant, pendant et après une alerte gel : seuils, heures de silence, accusé de réception et escalade.",
    summary: "Une checklist concrète pour que les alertes gel débouchent sur des actions, pas sur du bruit.",
  },
  "alert-channel-cookbook": {
    title: "Guide pratique des canaux d’alerte",
    description:
      "Activez e-mail, messagerie, SMS, push et webhooks : renseignez les destinataires, testez l’envoi et escaladez sans accusé de réception.",
    summary: "Choisissez les canaux qui réveillent vraiment votre foyer en cas de vague de froid.",
  },
  "household-sharing-walkthrough": {
    title: "Partager avec votre foyer, pas à pas",
    description:
      "Invitez vos proches par e-mail, attribuez les rôles éditeur ou lecture seule et partagez un tableau de bord du risque de gel sans donner votre mot de passe.",
    summary: "Gardez sondes et alertes au sein d’un même foyer sans partager de mot de passe.",
  },
  "garage-door-cold-playbook": {
    title: "Plan d’action porte de garage + alerte froid",
    description:
      "Soyez alerté si la porte reste ouverte quand la température baisse : ingestion du contact de porte, règles combinées et étapes pour le foyer.",
    summary: "Stoppez la perte de chaleur et le risque de gel quand la porte du garage reste ouverte par une nuit froide.",
  },
  "personal-weather-stations": {
    title: "Stations météo personnelles (Ambient et WeatherFlow)",
    description:
      "Utilisez une station Ambient Weather ou WeatherFlow Tempest au jardin pour le contexte extérieur, les alertes NWS (États-Unis) et le risque de gel prévu.",
    summary: "Reliez ProbeHarbor à la station de votre terrain : un contexte de gel plus juste, à l’échelle de votre jardin.",
  },
  "freeze-thaw-flood-playbook": {
    title: "Plan d’action gel puis dégel : inondations",
    description:
      "Placez des contacts d’eau contre les fuites au dégel : fonctionnement des alertes, pourquoi le mode vacances les déclenche, que faire si un capteur est mouillé.",
    summary:
      "Complément du plan vague de froid : repérez les fuites de dégel sous chauffe-eau, machines à laver et puisards en fin de saison froide.",
  },
  "time-to-freeze": {
    title: "Le temps avant gel expliqué",
    description:
      "Alertes à seuil, heures restantes avant le gel, prévisions Member et NWS Pro : ce qu’utilise le modèle de retard et comment l’activer dans Alerts.",
    summary:
      "Comprenez le compte à rebours avant gel pour agir avant que la sonde ne franchisse votre seuil de gel.",
  },
  "ingest-and-webhooks": {
    title: "API d’ingestion et webhooks d’alerte",
    description:
      "Envoyez vos relevés à ProbeHarbor via l’API d’ingestion (JSON natif, SenML ou REST Home Assistant) et vos alertes vers Discord, IFTTT ou Home Assistant.",
    summary:
      "Clés d’API par appareil, charges typées, détection auto SenML et REST HA, webhooks sortants signés HMAC et canaux d’alerte Pro.",
  },
  "kit-qr-onboarding": {
    title: "Mise en service du kit par QR code",
    description:
      "Collez sur le boîtier un QR code contenant l’URL d’ingestion pour ajouter l’appareil à ProbeHarbor en un scan, sans saisir de longues clés.",
    summary: "Encodez l’URL d’ingestion sur une étiquette : un nouveau matériel se configure d’un seul scan au téléphone.",
  },
  "esp32-ota-firmware": {
    title: "OTA ESP32 et remontée de batterie",
    description:
      "Mettez à jour le firmware des sondes ESP32 en OTA sur le LAN pendant que l’ingestion push envoie batterie et RSSI à l’API HTTP de ProbeHarbor.",
    summary: "Gardez le firmware ESP32 à jour sur votre LAN pendant que la télémétrie part vers l’API d’ingestion.",
  },
  "zapier-make-recipes": {
    title: "Recettes Zapier et Make.com",
    description:
      "Reliez les webhooks d’alerte et les actions de mise en pause de ProbeHarbor à Zapier ou Make.com pour automatiser gel, fuite et vacances sans code.",
    summary: "Envoyez les alertes vers Zapier/Make et suspendez les notifications depuis d’autres scénarios domotiques.",
  },
  "esphome-shelly-recipes": {
    title: "Recettes ESPHome et Shelly",
    description:
      "Envoyez température, humidité et contact de porte depuis un firmware ESPHome ou Shelly vers l’ingestion push de ProbeHarbor, sans sketch Arduino sur mesure.",
    summary:
      "Recettes HTTP POST prêtes à copier pour les capteurs LAN courants, en parallèle de MQTT Home Assistant.",
  },
  "home-assistant-notify-recipes": {
    title: "Recettes de notification Home Assistant",
    description:
      "Envoyez les alertes gel et fuite de ProbeHarbor vers notify, TTS et push mobile de Home Assistant : webhooks sortants, services HACS et pause entrante.",
    summary:
      "Annonces vocales et notifications locales sur le téléphone en cas de risque de gel ou de fuite, en parallèle des e-mails/SMS ProbeHarbor.",
  },
  "thermostat-oauth": {
    title: "OAuth des thermostats Nest et Ecobee (opérateurs)",
    description:
      "Activez l’OAuth Nest et Ecobee sur votre déploiement ProbeHarbor pour que les foyers Pro relient leurs thermostats et enrichissent les alertes.",
    summary:
      "Device Access Console, application développeur Ecobee, URI de redirection et secrets du Worker pour NEST_* et ECOBEE_CLIENT_ID.",
  },
  "adding-devices": {
    title: "Ajouter des appareils push et pull",
    description:
      "Pas à pas : créez un appareil d’ingestion push ou un flux HTTPS interrogé, associez les clés JSON aux libellés de Home et vérifiez les relevés en direct.",
    summary:
      "Choisissez push ou pull, créez l’appareil ou le flux, envoyez ou récupérez des relevés et vérifiez que Home affiche des valeurs en direct.",
  },
  "esp32-freeze-kit": {
    title: "Liste des pièces du kit antigel ESP32",
    description:
      "Achetez un ESP32 et une DS18B20 étanche compatibles avec les sketches d’ingestion push de ProbeHarbor. Fiches Adafruit et Amazon, pas un kit de marque.",
    summary:
      "Nomenclature vérifiée ESP32 + DS18B20 étanche, avec liens Adafruit stables et alternatives Amazon /dp/.",
  },
  "esp32-web-flash": {
    title: "Options de flashage de l’ESP32",
    description:
      "Flashez les sondes ESP32 ProbeHarbor avec l’IDE Arduino, PlatformIO, MicroPython ou l’esptool web d’Espressif, après avoir téléchargé un sketch prérempli.",
    summary:
      "Flashez depuis le navigateur avec un firmware précompilé (bêta), ou téléchargez un sketch personnalisé à flasher avec un IDE, PlatformIO ou esptool-js.",
  },
  "pico-w-ingest": {
    title: "Ingestion avec Raspberry Pi Pico W",
    description:
      "Envoyez des relevés DS18B20 depuis un Pico W ou Pico 2 W en CircuitPython, MicroPython ou avec le core Arduino-Pico. Même ingestion HTTPS que l’ESP32.",
    summary:
      "Sondes Wi‑Fi RP2040 / RP2350 : code.py CircuitPython, MicroPython ou Arduino d’Earle Philhower, DS18B20 sur GP4.",
  },
  "stm32-zephyr-ingest": {
    title: "Ingestion STM32 avec Zephyr",
    description:
      "Envoyez des relevés DS18B20 depuis une Nucleo-F767ZI en C sous Zephyr avec l’Ethernet intégré. west, ST-LINK et le même relais HTTPS LAN que l’Uno.",
    summary:
      "Sonde Ethernet Cortex-M7 : Zephyr en C sur Nucleo-F767ZI, DS18B20 sur Arduino D4, HTTP vers un relais TLS sur le LAN.",
  },
  "ch32v-riscv-ingest": {
    title: "Ingestion CH32V RISC-V",
    description:
      "Envoyez des relevés DS18B20 depuis un WCH CH32V307 en C avec WCHNET et l’Ethernet intégré. MounRiver Studio et le même relais HTTPS LAN que l’Uno.",
    summary: "Sonde Ethernet RISC-V : WCHNET en C sur CH32V307, DS18B20 sur PB12, HTTP vers un relais TLS sur le LAN.",
  },
  "avr-asm-ingest": {
    title: "Ingestion en assembleur AVR",
    description:
      "Envoyez des relevés DS18B20 depuis un ATmega328P en assembleur GNU AVR avec un shield W5100. avr-gcc, avrdude et le même relais HTTPS LAN que l’Uno.",
    summary: "Uno + W5100 en assembleur GNU AVR : DS18B20 sur D7, HTTP vers un relais TLS sur le LAN, sans C Arduino.",
  },
  "cellular-ingest": {
    title: "Ingestion cellulaire (Particle Boron)",
    description:
      "Envoyez des relevés DS18B20 depuis une Particle Boron en LTE via un webhook de la Console. Pour les sites isolés sans Wi-Fi dans le garage.",
    summary: "Sonde de gel LTE : Particle Boron + DS18B20 sur D2, webhook Particle vers l’ingestion HTTPS.",
  },
  "pic18-ethernet-ingest": {
    title: "Ingestion Ethernet PIC18F67J60",
    description:
      "Envoyez des relevés DS18B20 depuis un PIC18F67J60 avec la pile TCP/IP de Microchip sous MPLAB X et le même relais HTTPS LAN que l’Uno.",
    summary: "Sonde Ethernet Microchip : MLA en C sur PIC18F67J60, DS18B20 sur RD0, HTTP vers un relais TLS sur le LAN.",
  },
  "teensy41-ingest": {
    title: "Ingestion Ethernet Teensy 4.1",
    description:
      "Envoyez des relevés DS18B20 depuis une Teensy 4.1 avec QNEthernet. Une sonde de garage rapide i.MX RT1062 avec le même relais HTTPS LAN que l’Uno.",
    summary: "Teensy 4.1 + QNEthernet : DS18B20 sur la broche 4, HTTP vers un relais TLS sur le LAN.",
  },
  "mqtt-bridge": {
    title: "Recette de pont MQTT",
    description:
      "Gardez Mosquitto ou le MQTT de Home Assistant sur votre LAN et répliquez les relevés vers ProbeHarbor en HTTPS pour les alertes gel et fuite et l’historique.",
    summary:
      "POST /api/ingest/mqtt, rest_command Home Assistant et flux Node-RED : en parallèle, sans exposer votre broker.",
  },
  "install-pwa": {
    title: "Installer comme une application (PWA)",
    description:
      "Installez ProbeHarbor en PWA sur ordinateur, Android ou iOS pour accéder plus vite au tableau de bord et recevoir, si vous le voulez, des alertes push.",
    summary: "Étapes d’installation sur ordinateur, Android et iOS, et limites de Web Push sur les appareils Apple.",
  },
} satisfies AboutPageOverlay;

import type { AboutFaqOverlay } from "../index";

// French typography: narrow no-break space (U+202F) before ? ! ; and no-break space (U+00A0) before :
export default {
  "temperature-probes": [
    {
      question: "Quelles sondes de température fonctionnent avec ProbeHarbor ?",
      answer:
        "Tout capteur capable de publier la température (et éventuellement l’humidité) en JSON : le plus souvent un DHT22, un DS18B20 ou équivalent sur Arduino/ESP32. Associez les index des sondes dans le tableau de bord après l’ingestion.",
    },
    {
      question: "Combien de sondes faut-il dans un garage, un atelier ou un espace similaire ?",
      answer:
        "Une sonde, c’est un début ; deux ou trois zones (près de la porte, mur nord, établi) repèrent un risque de gel qu’une moyenne unique ne voit pas.",
    },
  ],
  "temperature-changes": [
    {
      question: "Pourquoi la température d’un espace non chauffé varie-t-elle si vite ?",
      answer:
        "L’ouverture des portes, le soleil sur les murs, les infiltrations de vent et la chaleur des véhicules brassent rapidement l’air intérieur. Consultez l’historique du graphique sur une nuit pour distinguer la météo du bruit du capteur.",
    },
  ],
  "historical-data": [
    {
      question: "Combien de temps ProbeHarbor conserve-t-il l’historique ?",
      answer:
        "La rétention dépend de l’offre et de la fenêtre de rétention définie dans Settings. Free conserve des fenêtres plus courtes ; les offres payantes gardent davantage d’historique pour les graphiques et l’export CSV.",
    },
    {
      question: "Puis-je exporter les relevés vers un tableur ?",
      answer:
        "Oui, avec Member et Pro : téléchargez le CSV depuis History et ouvrez-le dans Excel ou Google Sheets pour vos bilans de gel et vos comparaisons saisonnières.",
    },
  ],
  "arduino-sketches": [
    {
      question: "Où trouver des exemples de sketches Arduino ?",
      answer:
        "Dans le dépôt GitHub probeharbor, sous sketches/, ainsi que dans les guides Arduino de la section About. Les exemples ESP32 envoient directement en POST HTTPS. L’Uno + Ethernet W5100 utilise ethernet_dht22_ingest (JSON de température classique sur A4/A5) avec un relais HTTP→HTTPS sur le réseau local : le shield ne peut pas établir de connexion TLS avec probeharbor.dev.",
    },
  ],
  "arduino-pin-wiring": [
    {
      question: "Quelles broches utiliser pour un DHT22 ?",
      answer:
        "Utilisez une GPIO numérique libre pour la ligne de données, du 3.3V ou du 5V selon votre carte et les caractéristiques du capteur, et une masse commune. Évitez les broches réservées par les shields Ethernet/SPI.",
    },
  ],
  "arduino-dht22-lcd": [
    {
      question: "Ai-je besoin d’un écran LCD si j’utilise ProbeHarbor ?",
      answer:
        "Non : le tableau de bord dans le cloud suffit. Un écran LCD local est facultatif, pour garder un œil sur l’atelier quand le Wi‑Fi est coupé.",
    },
  ],
  "dht22-sensor-overview": [
    {
      question: "Quelle est la précision d’un DHT22 dans un garage ou un atelier ?",
      answer:
        "Environ ±0.5 °C et quelques points d’HR en air stable. Les courants d’air et l’ouverture des portes créent de vrais pics, pas toujours des erreurs du capteur. Comparez les zones avant de changer de matériel.",
    },
    {
      question: "À quelle fréquence le firmware doit-il interroger le DHT22 ?",
      answer:
        "Respectez au moins deux secondes entre deux lectures. Des requêtes qui se chevauchent renvoient des valeurs périmées ou erronées ; c’est pourquoi les sketches utilisent des minuteries et des nouvelles tentatives.",
    },
    {
      question: "Un seul DHT22 peut-il couvrir tout un garage, des combles ou un atelier ?",
      answer:
        "Un seul capteur masque les écarts. La zone de la porte, les murs nord et les établis diffèrent souvent de plusieurs degrés ; utilisez plusieurs sondes lorsque le risque de gel ou les outils comptent.",
    },
  ],
  "dht22-data-line-wiring": [
    {
      question: "Pourquoi les lectures du DHT22 échouent-elles par intermittence ?",
      answer:
        "Câbles longs, résistances de tirage absentes, bruit sur une alimentation partagée et lectures trop fréquentes sont des causes courantes. Raccourcissez la liaison, vérifiez le câblage et ajoutez des nouvelles tentatives avec un délai croissant.",
    },
  ],
  "freeze-protection-thresholds": [
    {
      question: "Par quel seuil de gel commencer ?",
      answer:
        "Beaucoup d’espaces non chauffés (garages, ateliers, vides sanitaires) démarrent vers 2–3 °C (35–38 °F) pour être prévenus avant que les tuyaux ne gèlent franchement. Ajustez une fois que vous connaissez les minimales nocturnes de votre zone la plus froide.",
    },
    {
      question: "Faut-il déclencher les alertes sur les prévisions extérieures ou sur les sondes intérieures ?",
      answer:
        "Les deux si possible : les sondes surveillent votre espace ; les prévisions et les alertes du NWS (États-Unis) repèrent les vagues de froid régionales avant que l’air intérieur ne baisse.",
    },
  ],
  "cold-snap-playbook": [
    {
      question: "Que faire quand une alerte de gel se déclenche ?",
      answer:
        "Accusez-en réception, vérifiez la zone la plus froide et l’état de la porte, activez le contournement des heures calmes si nécessaire et passez à d’autres canaux si personne ne répond dans le délai prévu par votre procédure.",
    },
    {
      question: "Comment les heures calmes interagissent-elles avec les alertes de gel ?",
      answer:
        "Vous pouvez couper les notifications de routine la nuit tout en recevant les alertes de gel, d’inondation et de prévisions ; gardez le contournement activé pour les types critiques.",
    },
  ],
  "freeze-thaw-flood-playbook": [
    {
      question: "Faut-il une règle personnalisée pour les pastilles de fuite ?",
      answer:
        "Non. Une fois les alertes activées, les contacts d’inondation/fuite mouillés préviennent automatiquement. Utilisez Rules → flood uniquement pour combiner la présence d’eau avec des conditions de porte, de température ou de durée.",
    },
    {
      question: "Le mode vacances coupe-t-il les alertes d’inondation ?",
      answer:
        "Non. Les alertes d’inondation sont toujours envoyées. Le mode vacances laisse aussi passer les alertes de gel par seuil et les alertes de prévisions/NWS, pour qu’une maison vide continue de vous prévenir ; une courte mise en sourdine suspend les alertes de gel par seuil, mais pas celles d’inondation.",
    },
    {
      question: "Où placer les contacts d’eau pour les inondations de dégel ?",
      answer:
        "Dans les bacs de chauffe-eau, les points bas de la buanderie ou du local technique, au bord du puisard et dans les flaques du vide sanitaire où l’eau de fonte s’accumule en premier, pas sur une étagère sèche. Voir la page de l’accessoire leak-puck pour la nomenclature des pastilles.",
    },
  ],
  "time-to-freeze": [
    {
      question: "Quelle différence entre le délai avant gel et une alerte par seuil ?",
      answer:
        "Un seuil se déclenche quand la sonde est déjà à votre température de gel (°F) ou en dessous. Le délai avant gel estime le nombre d’heures restantes avant ce franchissement, à partir du décalage de cet espace par rapport à l’air extérieur.",
    },
    {
      question: "Qu’apportent les prévisions de Member et le NWS de Pro ?",
      answer:
        "Toutes les offres incluent le seuil et le compte à rebours intérieur avant gel. Member ajoute les avertissements de gel selon les prévisions extérieures ; Pro ajoute les alertes officielles de gel et de froid du NWS (États-Unis).",
    },
    {
      question: "Où activer le délai avant gel ?",
      answer:
        "Dashboard → Alerts → When to alert : définissez un seuil de gel, activez les alertes et un canal de diffusion, puis laissez les alertes activées pour que les avertissements de délai avant gel puissent se déclencher. Envoyez une alerte de test pendant que vous êtes réveillé.",
    },
  ],
  "alert-channel-cookbook": [
    {
      question: "Quels canaux fonctionnent avec l’offre gratuite ?",
      answer:
        "L’e-mail, le push navigateur et Android, et les destinations de messagerie (Discord, Telegram, Slack, Teams, ntfy, Pushover). Les SMS, WhatsApp et les webhooks sortants nécessitent Pro.",
    },
    {
      question: "Pourquoi un canal a-t-il été ignoré ?",
      answer:
        "Un canal coché sans destination (téléphone, URL de webhook, identifiant de conversation) est ignoré au moment de l’envoi. Renseignez les destinations, enregistrez, puis envoyez une alerte de test.",
    },
  ],
  "household-sharing-walkthrough": [
    {
      question: "Les membres du foyer peuvent-ils modifier les réglages d’alerte ?",
      answer:
        "Les éditeurs et les propriétaires, oui ; les membres en lecture seule voient les données en direct sans pouvoir modifier les appareils, les alertes ou le partage.",
    },
    {
      question: "Les invitations nécessitent-elles une offre payante ?",
      answer:
        "Le partage au sein du foyer est disponible sur les comptes gratuits, pour que toute la famille suive ensemble les mêmes sondes et alertes.",
    },
  ],
  "accounts-and-dashboard": [
    {
      question: "Que configurer après la création d’un compte ?",
      answer:
        "Créez un appareil push (Workshop probe par défaut), envoyez un POST pour que les capteurs s’importent automatiquement, définissez le seuil de gel en °F et l’e-mail dans Alerts → When to alert (ou directement dans Devices après la première ingestion), invitez les membres du foyer et, si vous le souhaitez, partagez un lien en direct gratuit avec la famille. Lancez un essai Pro quand vous avez besoin des SMS, du push ou de portées de partage étendues.",
    },
  ],
  "ingest-and-webhooks": [
    {
      question: "L’Arduino a-t-il besoin d’une IP publique ?",
      answer:
        "Non. L’ingestion push envoie les données en sortie vers ProbeHarbor avec une clé d’appareil. Les flux pull nécessitent une URL JSON HTTPS accessible si vous choisissez cette voie.",
    },
    {
      question: "Que doit contenir un payload d’ingestion ?",
      answer:
        "La température (et l’humidité) indexées par sonde, plus des champs facultatifs de porte/alimentation, de batterie et de RSSI. Les formats natifs sont des clés à plat, un objet temp ou sensors[]. Les tableaux SenML (RFC 8428) et le JSON d’état REST de Home Assistant sont aussi détectés automatiquement. Gardez des clés stables pour que les associations du tableau de bord restent valides.",
    },
  ],
  "adding-devices": [
    {
      question: "Push ou pull ?",
      answer:
        "Utilisez le push pour les nœuds ESP/Arduino capables d’envoyer un POST HTTPS sortant. Utilisez le pull si vous disposez déjà d’un flux JSON HTTPS public (ou d’un relais TLS) que ProbeHarbor peut récupérer à intervalles réguliers.",
    },
    {
      question: "Pourquoi les relevés n’apparaissent-ils pas dans Home alors que l’ingestion réussit ?",
      answer:
        "Envoyez d’abord du JSON en POST : les clés des capteurs s’importent automatiquement dans Devices. Si Home reste vide, vérifiez que l’appareil a bien reçu un POST et consultez Devices → Device health. Flux pull : racine JSON correcte (temp par défaut), sauf si l’URL renvoie du SenML ou du JSON REST Home Assistant, détectés automatiquement.",
    },
  ],
  "json-probe-output-schema": [
    {
      question: "Quelle structure JSON ProbeHarbor attend-il ?",
      answer:
        "La structure pull par défaut est un objet temp avec des clés de sonde (f, c, h). Le push accepte aussi les clés à plat, sensors[], les tableaux JSON SenML et les objets d’état REST de Home Assistant. Les champs facultatifs battery_pct et rssi aident à diagnostiquer les appareils au signal faible. Voir /about/ingest-and-webhooks ou le flux d’exemple sur /api/feeds/example?format=document.",
    },
  ],
  "kit-qr-onboarding": [
    {
      question: "Que contient le QR code d’un kit ?",
      answer:
        "En général, l’URL d’ingestion ou le lien profond d’activation de cet appareil, pour qu’un scan au téléphone termine la configuration sans saisir de longues clés.",
    },
  ],
  "esp32-freeze-kit": [
    {
      question: "ProbeHarbor vend-il un kit ESP32 ?",
      answer:
        "Non. ProbeHarbor est un logiciel. Achetez un ESP32 et un DS18B20 étanche chez Adafruit ou Amazon, puis téléchargez un sketch d’ingestion préconfiguré depuis Dashboard → Devices. Liste des pièces : probeharbor.dev/about/esp32-freeze-kit.",
    },
    {
      question: "Un kit de démarrage avec DHT11 suffit-il contre le gel des tuyaux ?",
      answer:
        "Pas à lui seul. Le DHT11 est peu fiable sous zéro et généralement pas étanche. Utilisez un DS18B20 étanche pour les tuyaux ; gardez le DHT22 pour l’air et l’humidité de l’atelier si vous voulez l’HR.",
    },
    {
      question: "Faut-il absolument la carte Adafruit ?",
      answer:
        "Non. N’importe quel ESP32 DevKit compatible Arduino IDE ou MicroPython fonctionne avec les sketches ProbeHarbor. Les liens Adafruit sont des références stables ; un DevKit trouvé sur Amazon convient très bien pour réduire le coût.",
    },
  ],
  "esp32-ota-firmware": [
    {
      question: "Les ESP32 peuvent-ils mettre à jour leur firmware tout en envoyant des données à ProbeHarbor ?",
      answer:
        "Oui : faites les mises à jour OTA du firmware sur votre réseau local et laissez l’ingestion push envoyer les relevés à l’API cloud. Les champs batterie et RSSI sont facultatifs dans le payload. Téléchargez un sketch préconfiguré depuis Dashboard → Devices pour le premier flashage en USB.",
    },
    {
      question: "Faut-il recompiler quand le mot de passe Wi‑Fi change ?",
      answer:
        "Non si vous utilisez l’exemple WiFiManager (portail captif). Sinon, modifiez WIFI_SSID / WIFI_PASS et reflashez. L’URL d’ingestion vient toujours de Devices.",
    },
  ],
  "esp32-web-flash": [
    {
      question: "ProbeHarbor intègre-t-il un flasheur dans le navigateur ?",
      answer:
        "Oui, en bêta : probeharbor.dev/flash installe un firmware précompilé sur un ESP32 depuis Chrome ou Edge (testé sur l’ESP32 d’origine ; les images ESP32-S3 et ESP32-C3 sont compilées, mais pas encore testées sur du matériel), puis envoie à la carte votre Wi‑Fi et votre clé d’appareil par USB. Pour modifier le code, téléchargez plutôt un .ino/.py préconfiguré depuis Devices et flashez-le avec Arduino IDE, PlatformIO ou Thonny. Guide : probeharbor.dev/about/esp32-web-flash.",
    },
  ],
  "pico-w-ingest": [
    {
      question: "Un Raspberry Pi Pico W peut-il envoyer des données à ProbeHarbor ?",
      answer:
        "Oui. Les Pico W et Pico 2 W gèrent HTTPS directement sur la puce. Téléchargez le code.py CircuitPython (ou le sketch MicroPython / Arduino) depuis Dashboard → Devices, branchez un DS18B20 sur GP4 avec une résistance de tirage de 4.7k vers le 3.3V, et guettez POST 200 sur le moniteur série. Guide : probeharbor.dev/about/pico-w-ingest.",
    },
    {
      question: "Un Pico W est-il la même chose que le claim puck ?",
      answer:
        "Non. Le claim puck est un Waveshare RP2040-Zero en USB, pour la présence sur l’espace et les LED d’état. Le Pico W est une sonde de température Wi‑Fi. Ne flashez pas le firmware claim-puck sur une sonde de gel, ni l’inverse.",
    },
    {
      question: "Pico W ou ESP32 ?",
      answer:
        "L’ESP32 reste le kit gel par défaut (DevKits moins chers, ESPHome, exemples OTA). Choisissez le Pico W si vous en avez déjà un, si vous préférez le glisser-déposer de CircuitPython ou si vous voulez du RP2040/RP2350. Les deux envoient le même JSON d’ingestion.",
    },
  ],
  "stm32-zephyr-ingest": [
    {
      question: "Un STM32 peut-il envoyer des données à ProbeHarbor sans Arduino ni Python ?",
      answer:
        "Oui. L’exemple pour Nucleo-F767ZI est en C sous Zephyr : west build, flashage ST-LINK, Ethernet intégré. DS18B20 sur la broche Arduino D4 (PF14). HTTP vers le relais TLS du réseau local, comme pour la voie Uno W5100. Guide : probeharbor.dev/about/stm32-zephyr-ingest.",
    },
    {
      question: "Pourquoi pas du HTTPS directement depuis la Nucleo ?",
      answer:
        "C’est possible, avec mbedTLS de Zephyr et une autorité de certification intégrée. Mais ProbeHarbor est derrière Cloudflare, donc cette AC peut changer. Le relais local garde le microcontrôleur en HTTP et laisse le Pi/NAS gérer TLS, sur le même principe que l’Uno Ethernet.",
    },
    {
      question: "Le connecteur Arduino exécute-t-il un firmware Arduino ?",
      answer:
        "Non. D4 n’est que la broche au format Arduino de la Nucleo (PF14). Le firmware est en C sous Zephyr, pas un .ino.",
    },
  ],
  "ch32v-riscv-ingest": [
    {
      question: "Un CH32V peut-il envoyer des données à ProbeHarbor sans Arduino ni Python ?",
      answer:
        "Oui. L’exemple pour CH32V307V-EVT est en C avec WCHNET dans MounRiver Studio : un User/main.c à déposer dans le projet officiel ETH/DHCP, flashage WCH-Link, Ethernet 10M intégré. DS18B20 sur PB12. HTTP vers le relais TLS du réseau local, comme pour Uno W5100 et STM32 Zephyr. Guide : probeharbor.dev/about/ch32v-riscv-ingest.",
    },
    {
      question: "Pourquoi pas du HTTPS directement depuis le CH32V ?",
      answer:
        "WCHNET fournit TCP/UDP en IPv4 sans client TLS maintenu. L’ingestion ProbeHarbor est en HTTPS. Le relais local garde le microcontrôleur en HTTP et laisse un Pi/NAS gérer TLS, sur le même principe que l’Uno Ethernet et le STM32 Zephyr.",
    },
    {
      question: "Est-ce Arduino-CH32 ou Arduino sous PlatformIO ?",
      answer:
        "Non. Certains cores communautaires adaptent le CH32V à l’Arduino IDE. Cet exemple est en C du fabricant (QingKe RISC-V, WCHNET), pas un .ino.",
    },
  ],
  "avr-asm-ingest": [
    {
      question: "Certaines cartes ProbeHarbor exigent-elles de l’assembleur ?",
      answer:
        "Aucune sonde de gel Ethernet n’exige d’assembleur. Les PADAUK et PIC10F se programment avant tout en assembleur, mais ne peuvent pas envoyer de POST HTTP. La voie assembleur prise en charge est GNU AVR sur un Uno + W5100 : avr-gcc, sans C Arduino, DS18B20 sur D7, HTTP vers le relais TLS du réseau local. Guide : probeharbor.dev/about/avr-asm-ingest.",
    },
    {
      question: "Pourquoi ne pas mettre le DS18B20 sur D4 comme dans l’exemple ESP32 ?",
      answer:
        "Le shield Ethernet W5100 utilise D4 comme sélection de puce de la carte SD. Ce firmware maintient D4 à l’état haut et lit la sonde sur D7.",
    },
    {
      question: "Puis-je continuer à utiliser le sketch C Arduino Ethernet ?",
      answer:
        "Oui. sketches/arduino/ethernet_dht22_ingest est la voie en C sur le même shield (DHT22 sur A4/A5). N’utilisez l’assembleur que si vous voulez programmer le 328P sans C Arduino.",
    },
  ],
  "cellular-ingest": [
    {
      question: "Une carte cellulaire peut-elle envoyer des données à ProbeHarbor sans Wi‑Fi ?",
      answer:
        "Oui. L’exemple Particle Boron publie du JSON sur l’événement probeharbor_ingest ; un webhook de la Particle Console envoie ce corps en POST à votre URL d’ingestion HTTPS. DS18B20 sur D2. Guide : probeharbor.dev/about/cellular-ingest.",
    },
    {
      question: "Que se passe-t-il quand la 4G LTE décroche ?",
      answer:
        "Des intervalles manqués sont normaux. ProbeHarbor signale les sondes figées quand les envois s’arrêtent, et les alertes de gel se déclenchent toujours à partir du dernier relevé froid connu et du silence. Évitez les boucles de reconnexion serrées qui vident la batterie.",
    },
    {
      question: "Blues Notecard est-il pris en charge ?",
      answer:
        "Comme voie alternative : routez Notehub vers la même URL d’ingestion. Devices propose au téléchargement le firmware Particle Boron officiellement pris en charge et le JSON du webhook.",
    },
  ],
  "pic18-ethernet-ingest": [
    {
      question: "Un PIC18F67J60 peut-il envoyer des données à ProbeHarbor ?",
      answer:
        "Oui. Du C prêt à l’emploi pour la pile TCP/IP MLA dans MPLAB X : MAC/PHY Ethernet intégré, DS18B20 sur RD0, HTTP vers le relais TLS du réseau local. Guide : probeharbor.dev/about/pic18-ethernet-ingest.",
    },
    {
      question: "Pourquoi pas du HTTPS depuis le PIC ?",
      answer:
        "La pile TCP/IP classique de Microchip ne fournit pas de client HTTPS maintenu compatible avec Cloudflare. Le relais local garde le microcontrôleur en HTTP, comme pour Uno W5100 et STM32 Zephyr.",
    },
    {
      question: "Est-ce de l’Arduino ou du XC8 ?",
      answer:
        "XC8 / MPLAB X sur la démo Ethernet MLA. Pas un .ino Arduino.",
    },
  ],
  "teensy41-ingest": [
    {
      question: "Une Teensy 4.1 peut-elle envoyer des données à ProbeHarbor ?",
      answer:
        "Oui. Teensyduino + QNEthernet sur une Teensy 4.1 avec le kit Ethernet : DS18B20 sur la broche 4, HTTP vers le relais TLS du réseau local. Guide : probeharbor.dev/about/teensy41-ingest.",
    },
    {
      question: "Pourquoi pas du HTTPS directement depuis la Teensy ?",
      answer:
        "Vous pouvez ajouter des bibliothèques TLS, mais les AC de Cloudflare peuvent changer. Le relais local est identique à celui des Uno / STM32 / CH32V et évite d’intégrer des AC dans le microcontrôleur.",
    },
    {
      question: "Faut-il le kit Ethernet PJRC ?",
      answer:
        "Oui pour cet exemple. La Teensy 4.1 intègre le MAC sur la puce ; le kit (ou un câblage MagJack équivalent) fournit les transformateurs et le RJ45.",
    },
  ],
  "install-pwa": [
    {
      question: "La PWA prend-elle en charge les alertes push de gel ?",
      answer:
        "Oui, avec toutes les offres. Le push fonctionne dans le navigateur (PWA) et dans l’application Android ProbeHarbor. Installez la PWA ou l’application Android, activez Push dans Alerts et autorisez les notifications là où le système l’exige (Safari sur iOS impose des limites supplémentaires au push web).",
    },
  ],
  "data-flow": [
    {
      question: "Comment les relevés arrivent-ils dans le tableau de bord ?",
      answer:
        "Les appareils envoient leurs données (push) ou les flux sont récupérés (pull), les relevés sont stockés, les graphiques interrogent ou reçoivent les mises à jour en continu, et des tâches d’alerte évaluent les seuils à intervalles réguliers.",
    },
  ],
  "debugging-stale-readings": [
    {
      question: "Pourquoi les relevés de ma sonde sont-ils figés ?",
      answer:
        "Vérifiez l’alimentation et le Wi‑Fi de l’appareil, contrôlez la clé d’ingestion, confirmez les tâches cron/historique dans System status et cherchez des trous dans History avant de remplacer les capteurs.",
    },
  ],
  "group-membership-model": [
    {
      question: "Quelle différence entre éditeur et lecture seule ?",
      answer:
        "Les éditeurs peuvent modifier les appareils, les alertes et le partage. Les membres en lecture seule suivent les données en direct et l’historique sans modifier la configuration du foyer.",
    },
  ],
  "temperature-probe-case-study": [
    {
      question: "Quelle est la conclusion de l’étude de cas sur les sondes ?",
      answer:
        "Des sondes multizones associées à des seuils de gel repèrent des épisodes de froid qu’un capteur unique manque, surtout près des portes et des murs non isolés lors des vagues de froid polaire.",
    },
  ],
  "multi-zone-garage-layout": [
    {
      question: "Où placer les sondes pour surveiller le risque de gel ?",
      answer:
        "Donnez la priorité aux zones censées être les plus froides : murs nord, rails de porte et angles extérieurs, pas seulement l’établi où vous vous tenez.",
    },
  ],
  "probe-demo": [
    {
      question: "La démo de sondes utilise-t-elle du vrai matériel ?",
      answer:
        "Non : elle simule trois zones pour vous montrer comment l’air extérieur, l’ensoleillement, l’état de la porte et le seuil de gel modifient les relevés et le JSON, avec les mêmes structures que Devices et Overview.",
    },
    {
      question: "Passer de Garage / Workshop / Attic / Crawlspace change-t-il le modèle ?",
      answer:
        "Oui. Chaque espace a son propre décalage de base, sa sensibilité au soleil (les combles amplifient l’apport de chaleur ; les vides sanitaires l’atténuent), l’intensité du brassage d’air par la porte et ses libellés de zone. Ce n’est pas un simple changement de libellé : essayez Sun load sur Attic puis sur Crawlspace pour sentir la différence.",
    },
    {
      question: "Quelle différence entre le JSON push et le JSON pull ?",
      answer:
        "L’ingestion push est un objet à plat que l’ESP/Arduino envoie en POST à /api/ingest/<key>. Le flux pull regroupe les mêmes sondes nommées sous temp (par exemple north_wall, door_zone, workbench, plus avg) dans un JSON HTTPS récupéré à intervalles réguliers.",
    },
    {
      question: "L’état de l’espace correspond-il au tableau de bord ?",
      answer:
        "Oui pour le risque de gel et la surveillance à l’approche du seuil. Le simulateur réutilise le même calcul d’état de l’espace d’Overview, avec la température de gel (°F) de votre choix et la sonde simulée la plus froide.",
    },
  ],
  "zapier-make-recipes": [
    {
      question: "Puis-je connecter ProbeHarbor à Zapier ou Make ?",
      answer:
        "Oui avec Pro, via les webhooks sortants pour les alertes et des jetons entrants pour des actions comme la mise en sourdine. Les recettes se trouvent dans les guides Zapier/Make de la section About.",
    },
  ],
  "csv-export-spreadsheet-analysis": [
    {
      question: "Que faire des exports CSV ?",
      answer:
        "Examiner les minimales nocturnes, comparer les saisons et documenter les quasi-gels pour l’assurance ou l’organisation de l’atelier, dans n’importe quel tableur.",
    },
  ],
  "esphome-shelly-recipes": [
    {
      question: "Dois-je arrêter d’utiliser MQTT avec Home Assistant ?",
      answer:
        "Non. Beaucoup de foyers utilisent les deux : Mosquitto en local pour les automatisations, et l’ingestion push en HTTPS pour les SMS de gel et de fuite et l’historique de ProbeHarbor.",
    },
    {
      question: "Quels modèles Shelly fonctionnent ?",
      answer:
        "Tout Shelly capable d’envoyer un HTTP POST (scripts Plus / Gen2 ou actions webhook). Associez la clé de porte dans Dashboard → Devices après le premier POST.",
    },
  ],
  "garage-door-cold-playbook": [
    {
      question: "Puis-je déclencher une alerte sur la seule ouverture de la porte ?",
      answer:
        "Oui, avec une règle « porte ouverte », mais associer porte + température sous le seuil réduit les fausses alertes quand vous travaillez dans un garage ou un atelier chauffé.",
    },
    {
      question: "Où créer la règle combinée ?",
      answer:
        "Dashboard → Alerts → Rules. Ajoutez des conditions « porte ouverte » (ou durée d’ouverture) ET « température sous votre seuil de gel », puis enregistrez et envoyez une alerte de test.",
    },
  ],
  "personal-weather-stations": [
    {
      question: "Ai-je encore besoin d’OpenWeather ?",
      answer:
        "OpenWeather est la source par défaut et de secours. Les stations personnelles remplacent la carte extérieure et améliorent le contexte NWS (États-Unis) et prévisions au niveau de votre jardin.",
    },
    {
      question: "Où sont stockées mes clés Ambient/WeatherFlow ?",
      answer:
        "Dans les métadonnées de votre compte (Dashboard → Settings), comme les préférences d’affichage, et non dans le dépôt git public.",
    },
  ],
  "astro-server-side-rendering": [
    {
      question: "ProbeHarbor utilise-t-il le SSR d’Astro ?",
      answer:
        "Oui. Les pages marketing, les pages About et la structure du tableau de bord sont rendues sur l’edge de Cloudflare Workers via l’adaptateur Astro, pour un premier affichage rapide.",
    },
    {
      question: "Tout est-il en HTML statique ?",
      answer:
        "Non. De nombreuses routes sont en SSR. Les éléments interactifs s’hydratent sous forme d’îlots ; voir probeharbor.dev/about/astro-islands-and-hydration.",
    },
  ],
  "astro-islands-and-hydration": [
    {
      question: "Qu’est-ce qu’un îlot Astro sur ProbeHarbor ?",
      answer:
        "Un petit composant client (graphiques, formulaire de contact, démo de sondes) hydraté uniquement là où c’est nécessaire, tandis que le reste de la page est rendu côté serveur.",
    },
    {
      question: "Faut-il une SPA React complète pour la surveillance ?",
      answer:
        "ProbeHarbor s’en passe. Préférez SSR + îlots pour les pages publiques et gardez l’interactivité localisée. Accueil du produit : probeharbor.dev.",
    },
  ],
  "nextjs-monitoring-dashboards": [
    {
      question: "Pourquoi ProbeHarbor n’est-il pas développé avec Next.js ?",
      answer:
        "Astro sur Cloudflare Workers convient au SSR en edge et aux îlots légers de ce produit. L’App Router de Next.js est une solide alternative pour des tableaux de bord React très axés sur l’authentification ; voir les notes comparatives sur cette page.",
    },
    {
      question: "Puis-je quand même utiliser ProbeHarbor avec un site Next.js ?",
      answer:
        "Oui, en tant que client : les sondes envoient leurs POST à l’ingestion ProbeHarbor, quelles que soient vos autres applications. ProbeHarbor reste la couche hébergée d’alertes et d’historique.",
    },
  ],
  "node-express-api-patterns": [
    {
      question: "ProbeHarbor utilise-t-il Express ?",
      answer:
        "Non. Les API publiques et les pages tournent sur Cloudflare Workers avec des routes Astro. Express est abordé ici à titre de comparaison avec les API Node à exécution longue.",
    },
    {
      question: "Où se trouve l’API HTTP ?",
      answer:
        "probeharbor.dev/docs/api et openapi.yaml : endpoints d’ingestion, de métriques, de webhooks et du claim puck.",
    },
  ],
  "comparing-full-stack-options": [
    {
      question: "Quelle stack ProbeHarbor utilise-t-il ?",
      answer:
        "Le SSR d’Astro sur Cloudflare Workers, Supabase pour les données et l’ingestion des sondes en HTTPS. Les alternatives (Next, Express) sont comparées sur cette page.",
    },
    {
      question: "Devrais-je reconstruire ProbeHarbor moi-même ?",
      answer:
        "Seulement si vous voulez gérer l’exploitation vous-même. La plupart des particuliers utilisent le produit hébergé : probeharbor.dev/pricing.",
    },
  ],
  "relay-security-and-access": [
    {
      question: "Les sondes de gel ESP32 ont-elles besoin d’une IP publique ?",
      answer:
        "Non pour l’ingestion push : la carte envoie un POST HTTPS sortant vers ProbeHarbor. Les flux pull nécessitent une URL JSON HTTPS accessible si vous choisissez cette voie.",
    },
    {
      question: "Comment sécuriser un relais JSON maison ?",
      answer:
        "Terminez TLS, restreignez les IP sources quand c’est possible et évitez d’intégrer des clés d’ingestion dans des dépôts publics. Préférez les clés push ProbeHarbor obtenues dans Dashboard → Devices.",
    },
  ],
  "thermostat-oauth": [
    {
      question: "Quels thermostats se connectent à ProbeHarbor ?",
      answer:
        "Nest (Google Device Access / SDM) quand les secrets du Worker sont définis, et Ecobee quand l’inscription développeur est ouverte. Guide : probeharbor.dev/about/thermostat-oauth.",
    },
    {
      question: "Nest est-il nécessaire pour les alertes de gel ?",
      answer:
        "Non. Les alertes de gel s’appuient sur vos sondes. Nest/Ecobee ajoutent le contexte intérieur du logement dans Overview si votre offre l’inclut (Pro).",
    },
    {
      question: "Et si l’inscription développeur Ecobee est fermée ?",
      answer:
        "Utilisez Home Assistant → ingestion → Indoor reference dans Dashboard → Devices pour que la température ambiante de la maison continue de s’afficher sur votre graphique hebdomadaire.",
    },
  ],
  "mqtt-bridge": [
    {
      question: "Faut-il abandonner MQTT pour utiliser ProbeHarbor ?",
      answer:
        "Non. Gardez Mosquitto/Home Assistant pour les automatisations locales et envoyez l’ingestion en POST HTTPS pour les alertes de gel/fuite et l’historique de ProbeHarbor.",
    },
    {
      question: "Que publie la passerelle MQTT ?",
      answer:
        "Elle convertit les topics du broker en JSON d’ingestion ProbeHarbor (températures, portes, fuites). Détails : probeharbor.dev/about/mqtt-bridge.",
    },
    {
      question: "TLS est-il obligatoire vers probeharbor.dev ?",
      answer:
        "Oui pour l’ingestion dans le cloud. MQTT peut rester sur votre réseau local ; la passerelle ou l’appareil doit envoyer un POST HTTPS à votre URL d’ingestion.",
    },
  ],
  "probe-mounting-enclosures": [
    {
      question: "Où fixer un DS18B20 étanche ?",
      answer:
        "Sur le métal du tuyau ou dans un air calme, loin des portes ensoleillées. N’écrasez pas la perle d’époxy. Guide : probeharbor.dev/about/probe-mounting-enclosures.",
    },
    {
      question: "L’ESP32 peut-il rester dans le vide sanitaire avec la sonde ?",
      answer:
        "Mettez plutôt le microcontrôleur dans un boîtier au sec et ne faites passer que l’extrémité de la sonde dans les zones humides. L’humidité détruit les cartes plus vite que les capteurs.",
    },
    {
      question: "Existe-t-il une liste de pièces pour les fixations ?",
      answer:
        "Oui : colliers, clips, pastilles et notes sur la résistance de 4.7k sur probeharbor.dev/probe-mount-kit, en plus de la nomenclature du kit gel ESP32.",
    },
  ],
} satisfies AboutFaqOverlay;

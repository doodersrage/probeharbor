import { defineMessages } from "../translate";

/**
 * BrowserFlasher component (/flash and the English-only dashboard).
 * `status` strings are read by the inline script from a data attribute;
 * `{sensor}` and `{error}` are filled in on the client.
 */
const en = {
  installTitle: "1. Install the firmware",
  installCopy:
    "Plug the ESP32 into this computer with a USB data cable, click Install, and pick the board's serial port. It takes about a minute. Works with ESP32, ESP32-S3, and ESP32-C3 boards.",
  installButton: "Install firmware",
  unsupportedHtml:
    'This browser cannot talk to USB serial devices. Open this page in Chrome or Edge on a desktop or laptop, or use the <a class="text-link" href="/about/esp32-web-flash">other flashing options</a>.',
  notAllowed: "The installer needs a secure (https) page.",
  noPort: "No port in the list? Try another cable (many are charge-only) and install the CP210x or CH340 driver for your board.",
  connectTitle: "2. Connect it to Wi‑Fi and your account",
  connectCopy:
    "Close the installer, then send these settings over the same cable. They go straight to the board and are not stored on this page.",
  ssidLabel: "Wi‑Fi network name",
  ssidHint: "2.4 GHz network; ESP32 boards cannot join 5 GHz.",
  passwordLabel: "Wi‑Fi password",
  keyLabel: "Device key",
  keyHintPrefilled: "Filled in for the device you just created.",
  keyHint: "From Dashboard → Devices after you add a push device. Pasting the whole ingest URL works too.",
  extrasLegend: "Also wired to this board (optional)",
  extraLeak: "Leak / water contact",
  extraDoor: "Door reed switch",
  extraBattery: "Battery (1:1 divider)",
  extrasHint:
    "Tick only what you've connected: an unwired pin would read as \"dry\" or \"open\". Pins are in the table above. DS18B20, DHT22 and I²C sensors (BME280, SHT31, AHT20) are found automatically.",
  sendButton: "Send settings over USB",
  phoneSetupHtml:
    "No USB serial in your browser, or the board is already mounted somewhere else? Power it up and join the <strong>ProbeHarbor-Setup</strong> Wi‑Fi network from a phone to enter the same settings. Holding the BOOT button for five seconds erases them.",
  status: {
    noSerial: "This browser has no USB serial support. Use Chrome or Edge on a computer, or the phone setup below.",
    pickPort: "Pick the board's serial port…",
    waiting: "Waiting for the board to start…",
    sending: "Sending settings…",
    received: "Settings received. Joining Wi‑Fi…",
    wifiOk: "On Wi‑Fi. Sending the first reading…",
    liveWithSensor: "First reading delivered from your {sensor}, with humidity. It's live: you can unplug it and mount it.",
    live: "First reading delivered. The probe is live: you can unplug it and mount it.",
    noReading:
      "The board has the settings but no reading arrived yet. Check the sensor wiring (data to GPIO 4, 4.7kΩ to 3.3V), then try again.",
    noAnswer: "No answer from the board. Make sure the firmware install finished, then try again.",
    noPortSelected: "No port selected.",
    couldNotTalk: "Could not talk to the board: {error}",
  },
};

export type BrowserFlasherMessages = typeof en;

const es: BrowserFlasherMessages = {
  installTitle: "1. Instala el firmware",
  installCopy:
    "Conecta el ESP32 a este ordenador con un cable USB de datos, haz clic en Instalar y elige el puerto serie de la placa. Tarda alrededor de un minuto. Funciona con placas ESP32, ESP32-S3 y ESP32-C3.",
  installButton: "Instalar firmware",
  unsupportedHtml:
    'Este navegador no puede comunicarse con dispositivos serie USB. Abre esta página en Chrome o Edge en un ordenador de sobremesa o portátil, o usa las <a class="text-link" href="/about/esp32-web-flash">otras opciones de flasheo</a>.',
  notAllowed: "El instalador necesita una página segura (https).",
  noPort:
    "¿No aparece ningún puerto? Prueba otro cable (muchos solo cargan) e instala el controlador CP210x o CH340 de tu placa.",
  connectTitle: "2. Conéctalo al Wi‑Fi y a tu cuenta",
  connectCopy:
    "Cierra el instalador y envía estos ajustes por el mismo cable. Van directamente a la placa y no se guardan en esta página.",
  ssidLabel: "Nombre de la red Wi‑Fi",
  ssidHint: "Red de 2,4 GHz; las placas ESP32 no pueden conectarse a 5 GHz.",
  passwordLabel: "Contraseña del Wi‑Fi",
  keyLabel: "Clave del dispositivo",
  keyHintPrefilled: "Rellenada para el dispositivo que acabas de crear.",
  keyHint:
    "En Dashboard → Devices, después de añadir un dispositivo push. También puedes pegar la URL de ingesta completa.",
  extrasLegend: "También conectado a esta placa (opcional)",
  extraLeak: "Contacto de fuga / agua",
  extraDoor: "Interruptor reed de puerta",
  extraBattery: "Batería (divisor 1:1)",
  extrasHint:
    "Marca solo lo que hayas conectado: un pin sin cablear se leería como «seco» o «abierto». Los pines están en la tabla de arriba. Los sensores DS18B20, DHT22 e I²C (BME280, SHT31, AHT20) se detectan automáticamente.",
  sendButton: "Enviar ajustes por USB",
  phoneSetupHtml:
    "¿Tu navegador no tiene serie USB o la placa ya está montada en otro sitio? Enciéndela y conéctate desde un móvil a la red Wi‑Fi <strong>ProbeHarbor-Setup</strong> para introducir los mismos ajustes. Mantener pulsado el botón BOOT cinco segundos los borra.",
  status: {
    noSerial:
      "Este navegador no admite serie USB. Usa Chrome o Edge en un ordenador, o la configuración desde el móvil que se explica abajo.",
    pickPort: "Elige el puerto serie de la placa…",
    waiting: "Esperando a que arranque la placa…",
    sending: "Enviando ajustes…",
    received: "Ajustes recibidos. Conectando al Wi‑Fi…",
    wifiOk: "Conectada al Wi‑Fi. Enviando la primera lectura…",
    liveWithSensor:
      "Primera lectura recibida de tu {sensor}, con humedad. Ya está funcionando: puedes desconectarlo y montarlo.",
    live: "Primera lectura recibida. La sonda ya está funcionando: puedes desconectarla y montarla.",
    noReading:
      "La placa tiene los ajustes, pero aún no ha llegado ninguna lectura. Revisa el cableado del sensor (datos a GPIO 4, 4,7 kΩ a 3,3 V) y vuelve a intentarlo.",
    noAnswer: "La placa no responde. Asegúrate de que la instalación del firmware terminó y vuelve a intentarlo.",
    noPortSelected: "No se ha seleccionado ningún puerto.",
    couldNotTalk: "No se pudo comunicar con la placa: {error}",
  },
};

const fr: BrowserFlasherMessages = {
  installTitle: "1. Installer le firmware",
  installCopy:
    "Branchez l’ESP32 sur cet ordinateur avec un câble USB de données, cliquez sur Installer et choisissez le port série de la carte. Cela prend environ une minute. Compatible avec les cartes ESP32, ESP32-S3 et ESP32-C3.",
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

const de: BrowserFlasherMessages = {
  installTitle: "1. Firmware installieren",
  installCopy:
    "Schließ den ESP32 mit einem USB-Datenkabel an diesen Computer an, klick auf Installieren und wähle den seriellen Port des Boards. Das dauert etwa eine Minute. Funktioniert mit ESP32-, ESP32-S3- und ESP32-C3-Boards.",
  installButton: "Firmware installieren",
  unsupportedHtml:
    'Dieser Browser kann nicht mit seriellen USB-Geräten kommunizieren. Öffne diese Seite in Chrome oder Edge auf einem Desktop-PC oder Laptop oder nutze die <a class="text-link" href="/about/esp32-web-flash">anderen Flash-Optionen</a>.',
  notAllowed: "Der Installer braucht eine sichere Seite (https).",
  noPort:
    "Kein Port in der Liste? Probier ein anderes Kabel (viele sind reine Ladekabel) und installiere den CP210x- oder CH340-Treiber für dein Board.",
  connectTitle: "2. Mit WLAN und deinem Konto verbinden",
  connectCopy:
    "Schließ den Installer und sende diese Einstellungen dann über dasselbe Kabel. Sie gehen direkt ans Board und werden nicht auf dieser Seite gespeichert.",
  ssidLabel: "WLAN-Name",
  ssidHint: "2,4-GHz-Netz; ESP32-Boards können sich nicht mit 5 GHz verbinden.",
  passwordLabel: "WLAN-Passwort",
  keyLabel: "Geräteschlüssel",
  keyHintPrefilled: "Für das gerade angelegte Gerät ausgefüllt.",
  keyHint:
    "Aus Dashboard → Devices, nachdem du ein Push-Gerät angelegt hast. Die komplette Ingest-URL einzufügen funktioniert auch.",
  extrasLegend: "Außerdem an diesem Board angeschlossen (optional)",
  extraLeak: "Leck-/Wasserkontakt",
  extraDoor: "Tür-Reedschalter",
  extraBattery: "Akku (1:1-Teiler)",
  extrasHint:
    "Hake nur an, was du angeschlossen hast: Ein unbelegter Pin würde als „trocken“ oder „offen“ gelesen. Die Pins stehen in der Tabelle oben. DS18B20, DHT22 und I²C-Sensoren (BME280, SHT31, AHT20) werden automatisch erkannt.",
  sendButton: "Einstellungen per USB senden",
  phoneSetupHtml:
    "Kein USB-Seriell in deinem Browser, oder das Board ist schon woanders montiert? Schalte es ein und verbinde ein Handy mit dem WLAN <strong>ProbeHarbor-Setup</strong>, um dieselben Einstellungen einzugeben. Wenn du die BOOT-Taste fünf Sekunden gedrückt hältst, werden sie gelöscht.",
  status: {
    noSerial:
      "Dieser Browser unterstützt kein USB-Seriell. Nutze Chrome oder Edge auf einem Computer oder die Einrichtung per Handy weiter unten.",
    pickPort: "Wähle den seriellen Port des Boards…",
    waiting: "Warte, bis das Board startet…",
    sending: "Einstellungen werden gesendet…",
    received: "Einstellungen empfangen. Verbinde mit dem WLAN…",
    wifiOk: "Im WLAN. Erster Messwert wird gesendet…",
    liveWithSensor:
      "Erster Messwert von deinem {sensor} angekommen, mit Luftfeuchtigkeit. Er ist live: Du kannst ihn abstecken und montieren.",
    live: "Erster Messwert angekommen. Der Fühler ist live: Du kannst ihn abstecken und montieren.",
    noReading:
      "Das Board hat die Einstellungen, aber es ist noch kein Messwert angekommen. Prüfe die Sensorverkabelung (Daten an GPIO 4, 4,7 kΩ an 3,3 V) und versuch es dann noch einmal.",
    noAnswer: "Keine Antwort vom Board. Stell sicher, dass die Firmware-Installation fertig ist, und versuch es dann noch einmal.",
    noPortSelected: "Kein Port ausgewählt.",
    couldNotTalk: "Keine Verbindung zum Board möglich: {error}",
  },
};

const ptBr: BrowserFlasherMessages = {
  installTitle: "1. Instale o firmware",
  installCopy:
    "Conecte o ESP32 a este computador com um cabo USB de dados, clique em Instalar e escolha a porta serial da placa. Leva cerca de um minuto. Funciona com placas ESP32, ESP32-S3 e ESP32-C3.",
  installButton: "Instalar firmware",
  unsupportedHtml:
    'Este navegador não consegue se comunicar com dispositivos seriais USB. Abra esta página no Chrome ou no Edge em um computador ou notebook, ou use as <a class="text-link" href="/about/esp32-web-flash">outras opções de gravação</a>.',
  notAllowed: "O instalador precisa de uma página segura (https).",
  noPort:
    "Nenhuma porta na lista? Tente outro cabo (muitos só carregam) e instale o driver CP210x ou CH340 da sua placa.",
  connectTitle: "2. Conecte ao Wi‑Fi e à sua conta",
  connectCopy:
    "Feche o instalador e envie estas configurações pelo mesmo cabo. Elas vão direto para a placa e não ficam salvas nesta página.",
  ssidLabel: "Nome da rede Wi‑Fi",
  ssidHint: "Rede de 2,4 GHz; as placas ESP32 não se conectam em 5 GHz.",
  passwordLabel: "Senha do Wi‑Fi",
  keyLabel: "Chave do dispositivo",
  keyHintPrefilled: "Preenchida para o dispositivo que você acabou de criar.",
  keyHint:
    "Em Dashboard → Devices, depois de adicionar um dispositivo push. Colar a URL de ingestão completa também funciona.",
  extrasLegend: "Também ligado a esta placa (opcional)",
  extraLeak: "Contato de vazamento / água",
  extraDoor: "Reed switch da porta",
  extraBattery: "Bateria (divisor 1:1)",
  extrasHint:
    "Marque só o que você ligou: um pino sem nada conectado seria lido como “seco” ou “aberto”. Os pinos estão na tabela acima. Sensores DS18B20, DHT22 e I²C (BME280, SHT31, AHT20) são detectados automaticamente.",
  sendButton: "Enviar configurações por USB",
  phoneSetupHtml:
    "Seu navegador não tem serial USB, ou a placa já está instalada em outro lugar? Ligue-a e conecte o celular à rede Wi‑Fi <strong>ProbeHarbor-Setup</strong> para informar as mesmas configurações. Segurar o botão BOOT por cinco segundos apaga tudo.",
  status: {
    noSerial:
      "Este navegador não tem suporte a serial USB. Use o Chrome ou o Edge em um computador, ou a configuração pelo celular explicada abaixo.",
    pickPort: "Escolha a porta serial da placa…",
    waiting: "Aguardando a placa iniciar…",
    sending: "Enviando configurações…",
    received: "Configurações recebidas. Conectando ao Wi‑Fi…",
    wifiOk: "No Wi‑Fi. Enviando a primeira leitura…",
    liveWithSensor:
      "Primeira leitura recebida do seu {sensor}, com umidade. Está funcionando: você já pode desconectar e instalar.",
    live: "Primeira leitura recebida. A sonda está funcionando: você já pode desconectar e instalar.",
    noReading:
      "A placa recebeu as configurações, mas nenhuma leitura chegou ainda. Confira a ligação do sensor (dados no GPIO 4, 4,7 kΩ para 3,3 V) e tente de novo.",
    noAnswer: "A placa não respondeu. Verifique se a instalação do firmware terminou e tente de novo.",
    noPortSelected: "Nenhuma porta selecionada.",
    couldNotTalk: "Não foi possível se comunicar com a placa: {error}",
  },
};

export const browserFlasherMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

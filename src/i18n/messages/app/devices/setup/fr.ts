import type { DevicesSetupMessages } from "./en";

const fr: DevicesSetupMessages = {
  firstRun: {
    title: "Connectez votre premier capteur",
    subtitle: "Choisissez ce que vous avez aujourd’hui. Chaque parcours se termine par une mesure en direct ; les alertes de gel et de fuite suivent juste après.",
    viewOnly: "Lecture seule : demandez à un propriétaire d’ajouter un appareil.",
    limitReached: "Limite d’appareils atteinte.",
    limitUpgrade: "Changez d’offre pour plus d’appareils",
    haveSensors: {
      title: "J’ai déjà des capteurs",
      copy: "Home Assistant, ESPHome ou un broker MQTT. Nous créons un appareil et vous donnons un extrait à copier-coller avec sa clé. Environ 5 minutes.",
    },
    haveBoard: {
      title: "J’ai une carte à flasher",
      copy: "Un ESP32 avec un capteur DS18B20, DHT22 ou I²C : installez le firmware depuis ce navigateur via USB, sans Arduino IDE. Pico W et Arduino reçoivent plutôt un sketch prérempli.",
      create: "Créer l’appareil et le flasher",
      otherBoards: "Guides pour d’autres cartes",
      browserFlasher: "Flasheur dans le navigateur (bêta)",
      espOptions: "Options de flashage ESP32",
      cellular: "Cellulaire",
    },
    noHardware: {
      title: "Pas encore de matériel",
      copy: "Voyez le tableau de bord fonctionner tout de suite avec un flux d’exemple en direct, puis montez le kit antigel ESP32 (environ 25 $ US) quand vous serez prêt.",
      demo: "Essayer avec un flux de démo",
      kitParts: "Liste des pièces du kit antigel ESP32",
    },
    also: "Et aussi :",
    jsonFeed: "Flux JSON HTTPS",
    leakPucks: "Leak pucks",
    httpApi: "API HTTP",
  },
  funnel: {
    title: "Vous recevez des données",
    firstPost: "Premier POST reçu",
    alertDone: "Alerte de gel configurée",
    alertTodo: "Réglez le seuil de gel en °F + l’e-mail, puis envoyez un test",
    shareLink: "Partagez un lien en direct avec votre famille",
    optional: " : facultatif",
    renameHtml:
      'Les noms des capteurs conviennent tels quels. <a class="text-link" href="/dashboard/devices?view=setup&rename_sensors=1">Renommez-les plus tard</a> sur la fiche de l’appareil si vous le souhaitez.',
    setAlert: "Régler le gel + l’e-mail",
    sendTest: "Envoyer une alerte de test",
    overview: "Vue d’ensemble",
    guides: "Guides de configuration du matériel",
    kitQr: "QR du kit",
    cellular: "Cellulaire",
  },
  firstAlert: {
    title: "Configurez votre première alerte froid + eau",
    subtitle:
      "Un seuil et un e-mail, sans quitter Appareils. Les contacts d’inondation/fuite mouillés déclenchent une alerte automatique dès que les alertes sont activées (et ignorent la mise en pause et le mode vacances). Ajoutez Telegram, Discord et d’autres canaux plus tard.",
    savedAndTested: "Alerte froid + eau enregistrée et test envoyé, vérifiez votre boîte de réception.",
    saved: "Alerte froid + eau enregistrée.",
    testFailed:
      "Paramètres enregistrés, mais le test n’a pas pu être envoyé. Vérifiez l’adresse e-mail ou réessayez depuis Alertes.",
    freezeLabel: "Seuil de gel (°F)",
    emailLabel: "E-mail d’alerte",
    emailPlaceholder: "vous@exemple.com",
    saveAndTest: "Enregistrer + envoyer un test",
    saveOnly: "Enregistrer seulement",
    fullSettings: "Tous les paramètres d’alerte",
  },
  integrations: {
    title: "Autres moyens de connexion",
    subtitle:
      "L’ingestion push depuis ESP32, Pico W, STM32, CH32V ou assembleur AVR est l’option par défaut. Dépliez un parcours ci-dessous pour une configuration à copier-coller.",
    claimPuck: {
      summary: "Claim puck (RP2040-Zero)",
      stepsHtml: [
        "Flashez le firmware claim-puck et câblez un bouton entre GP4 et GND.",
        "Donnez aux libellés <code>space</code> des appareils le nom de la place que vous allez réserver (p. ex. garage).",
        'Dans <a class="text-link" href="/bay-buddy">Bay Buddy</a>, connectez votre compte, branchez le puck, réservez la place, puis pilotez éventuellement la LED d’ambiance.',
      ],
      productPage: "Page produit",
      caseDiffuser: "Boîtier / diffuseur",
      claimApi: "API de réservation",
    },
    contacts: {
      summary: "Contacts de porte / fuite / courant",
      stepsHtml: [
        "Flashez les sketches ESP32 de <code>sketches/arduino/door_contact_ingest</code>, <code>leak_contact_ingest</code> ou <code>power_sense_ingest</code>.",
        "Envoyez en POST les booléens <code>door1</code> / <code>leak1</code> / <code>power1</code> à votre URL d’ingestion.",
      ],
      doorPuck: "Door puck",
      leakPuck: "Leak puck",
      powerNudge: "Power nudge",
      allAccessories: "Tous les accessoires",
    },
    beacon: {
      summary: "Balise d’alerte et éléments du kit",
      bodyHtml:
        '<a class="text-link" href="/alert-beacon">Balise d’alerte</a> NeoPixel d’ambiance, <a class="text-link" href="/kit-labels">étiquettes QR / NFC</a> et <a class="text-link" href="/probe-mount-kit">kit de fixation de sonde</a> : des compléments et du merch, pas des sondes antigel.',
    },
    homeAssistant: {
      summary: "REST Home Assistant",
      stepsHtml: [
        "Créez un appareil push ci-dessus et copiez l’URL d’ingestion.",
        "Dans HA, utilisez un capteur <code>rest</code> ou une automatisation avec <code>resource: https://probeharbor.dev/api/ingest/YOUR_KEY</code>.",
        'Envoyez le JSON de l’entité en POST. ProbeHarbor lit <code>friendly_name</code> pour les libellés. <a class="text-link" href="/integrations/home-assistant">Guide HA complet</a>',
      ],
    },
    mqtt: {
      summary: "Passerelle MQTT → HTTPS",
      stepsHtml: [
        "Gardez Mosquitto sur votre réseau local. ProbeHarbor n’est pas un broker MQTT.",
        'Importez le flux Node-RED depuis <a class="text-link" href="/dashboard/share/integrations#node-red">Intégrations → Node-RED</a> ou lancez la passerelle Python <code>scripts/mqtt-bridge.py</code>.',
        "Définissez <code>PROBEHARBOR_INGEST_KEY</code> sur la clé de votre appareil push.",
        '<a class="text-link" href="/about/mqtt-bridge">Documentation de la passerelle MQTT</a>',
      ],
    },
    esphome: {
      summary: "ESPHome / Shelly en réseau local",
      bodyHtml:
        "Pointez le <code>rest</code> d’ESPHome ou le HTTP de Shelly vers votre URL d’ingestion, ou exposez du JSON en HTTPS pour un flux récupéré.",
      recipes: "Recettes ESPHome et Shelly",
    },
    ingestFormats: "Formats d’ingestion",
    allIntegrations: "Toutes les intégrations",
  },
};

export default fr;

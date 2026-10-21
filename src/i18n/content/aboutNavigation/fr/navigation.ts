import type { AboutNavigationOverlay } from "../index";

export default {
  megaGroups: {
    environment: {
      title: "Environnements des sondes",
      description: "Sondes, emplacement et la physique qui fait varier les relevés.",
    },
    history: {
      title: "Données et historique",
      description: "Instantanés enregistrés, exports et chemin des relevés jusqu’au stockage.",
    },
    hardware: {
      title: "Matériel et firmware",
      description: "Firmware Arduino, ESP32, Pico W, STM32, CH32V et assembleur AVR, câblage et écran LCD local.",
    },
    software: {
      title: "Backend et site web",
      description: "Relais Python, Astro sur Cloudflare et comparatifs de stacks.",
    },
    product: {
      title: "Tableau de bord et intégrations",
      description: "Comptes, API d’ingestion, alertes, installation de la PWA et automatisation.",
    },
  },
  journeys: {
    "winter-pipes": {
      title: "Protéger les canalisations cet hiver",
      description:
        "Réglez les seuils de gel, ajoutez un contact de fuite sec/mouillé, configurez les alertes et découvrez dans les témoignages à quoi ressemblaient une vraie vague de froid ou une fuite sous dalle.",
      ctaLabel: "Commencer la surveillance gratuite",
      steps: [
        { label: "Seuils de gel" },
        { label: "Temps avant le gel" },
        { label: "Plan vague de froid" },
        { label: "Plan inondation au dégel" },
        { label: "Canaux d’alerte" },
        { label: "Étude de cas" },
      ],
    },
    "first-dht22": {
      title: "Câbler mon premier DHT22",
      description: "Les bases du capteur, le câblage des broches et le sketch Arduino qui publie du JSON.",
      ctaLabel: "Ouvrir la présentation Arduino",
      steps: [
        { label: "Présentation du DHT22" },
        { label: "Câblage de la ligne de données" },
        { label: "Plan des broches" },
        { label: "Sketch du firmware" },
      ],
    },
    "esp-ingest": {
      title: "Envoyer depuis ESP / Pico / MCU / assembleur AVR",
      description:
        "Créez un appareil push, envoyez un POST pour que les capteurs s’importent automatiquement, avec OTA et autocollants QR en option.",
      ctaLabel: "Ajouter un appareil",
      steps: [
        { label: "Ajouter en push ou pull" },
        { label: "Acheter le kit ESP32" },
        { label: "Ou flasher un Pico W" },
        { label: "Ou flasher un STM32" },
        { label: "Ou flasher un CH32V" },
        { label: "Ou assembleur AVR" },
        { label: "Ou LTE cellulaire" },
        { label: "Ou Teensy 4.1" },
        { label: "Ou PIC18 Ethernet" },
        { label: "API d’ingestion" },
        { label: "QR du kit" },
        { label: "Flasher l’ESP32" },
        { label: "OTA ESP32" },
      ],
    },
    "understand-readings": {
      title: "Comprendre mes relevés",
      description:
        "Pourquoi la température du garage varie, comment les données arrivent sur le site et comment repérer les flux figés.",
      ctaLabel: "Essayer la démo des sondes",
      steps: [
        { label: "Origine des variations" },
        { label: "Flux de données" },
        { label: "Relevés figés" },
        { label: "Historique et CSV" },
      ],
    },
    "share-household": {
      title: "Partager avec mon foyer",
      description: "Invitez votre famille, comprenez les rôles et regroupez les alertes de gel et de fuite au même endroit.",
      ctaLabel: "Créer un compte gratuit",
      steps: [
        { label: "Guide du partage" },
        { label: "Comptes et tableau de bord" },
        { label: "Rôles et groupes" },
        { label: "Installer la PWA" },
      ],
    },
  },
} satisfies AboutNavigationOverlay;

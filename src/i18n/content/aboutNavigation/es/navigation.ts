import type { AboutNavigationOverlay } from "../index";

export default {
  megaGroups: {
    environment: {
      title: "Entornos de sondas",
      description: "Sondas, ubicación y la física que mueve las lecturas.",
    },
    history: {
      title: "Datos e historial",
      description: "Instantáneas guardadas, exportaciones y cómo llegan las lecturas al almacenamiento.",
    },
    hardware: {
      title: "Hardware y firmware",
      description: "Firmware para Arduino, ESP32, Pico W, STM32, CH32V y ensamblador AVR, cableado y la pantalla LCD local.",
    },
    software: {
      title: "Backend y sitio web",
      description: "Relés en Python, Astro en Cloudflare y comparativas de stacks.",
    },
    product: {
      title: "Panel e integraciones",
      description: "Cuentas, API de ingesta, alertas, instalación de la PWA y automatización.",
    },
  },
  journeys: {
    "winter-pipes": {
      title: "Proteger las tuberías este invierno",
      description:
        "Define umbrales de congelación, añade un contacto de fugas húmedo/seco, configura las alertas y mira en las historias cómo se vio una ola de frío real o una fuga en una losa.",
      ctaLabel: "Empezar a monitorizar gratis",
      steps: [
        { label: "Umbrales de congelación" },
        { label: "Tiempo hasta la congelación" },
        { label: "Plan ante olas de frío" },
        { label: "Plan ante inundaciones por deshielo" },
        { label: "Canales de alerta" },
        { label: "Caso práctico" },
      ],
    },
    "first-dht22": {
      title: "Cablear mi primer DHT22",
      description: "Conceptos básicos del sensor, cableado de pines y el sketch de Arduino que publica JSON.",
      ctaLabel: "Abrir la introducción a Arduino",
      steps: [
        { label: "Introducción al DHT22" },
        { label: "Cableado de la línea de datos" },
        { label: "Mapa de pines" },
        { label: "Sketch de firmware" },
      ],
    },
    "esp-ingest": {
      title: "Enviar datos desde ESP / Pico / MCU / ensamblador AVR",
      description:
        "Crea un dispositivo push, haz POST para que los sensores se importen solos y, si quieres, añade OTA y pegatinas QR.",
      ctaLabel: "Añadir un dispositivo",
      steps: [
        { label: "Añadir push o pull" },
        { label: "Comprar el kit ESP32" },
        { label: "O flashear Pico W" },
        { label: "O flashear STM32" },
        { label: "O flashear CH32V" },
        { label: "O ensamblador AVR" },
        { label: "O LTE celular" },
        { label: "O Teensy 4.1" },
        { label: "O PIC18 Ethernet" },
        { label: "API de ingesta" },
        { label: "QR del kit" },
        { label: "Flashear ESP32" },
        { label: "OTA para ESP32" },
      ],
    },
    "understand-readings": {
      title: "Entender mis lecturas",
      description:
        "Por qué oscila la temperatura del garaje, cómo llegan los datos al sitio y cómo detectar feeds desactualizados.",
      ctaLabel: "Probar la demo de sondas",
      steps: [
        { label: "Qué causa las oscilaciones" },
        { label: "Flujo de datos" },
        { label: "Lecturas desactualizadas" },
        { label: "Historial y CSV" },
      ],
    },
    "share-household": {
      title: "Compartir con mi hogar",
      description: "Invita a tu familia, entiende los roles y reúne las alertas de congelación y fugas en un solo lugar.",
      ctaLabel: "Crear una cuenta gratis",
      steps: [
        { label: "Guía para compartir" },
        { label: "Cuentas y panel" },
        { label: "Roles y grupos" },
        { label: "Instalar la PWA" },
      ],
    },
  },
} satisfies AboutNavigationOverlay;

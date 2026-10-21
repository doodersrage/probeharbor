import type { AboutFaqItem } from "../../../lib/aboutFaqs";

/**
 * /guides hub copy. Category/link text lives in `src/i18n/content/guideHub/`.
 * `photoLabels` are keyed by `guidesHubPhotos` id (src/lib/aboutPhotos.ts);
 * `alsoUseful` is keyed by href.
 */
import type { GuidesMessages } from "./en";

const es: GuidesMessages = {
  title: "Guías",
  description:
    "Guías de ProbeHarbor por tarea: hardware, alertas de congelación e inundación/fugas, compartir con el hogar y la API HTTP, más todos los artículos en una biblioteca.",
  breadcrumbHome: "Inicio",
  breadcrumbPage: "Guías",
  kicker: "Guías",
  headerTitle: "Configura sondas, alertas de congelación e inundación, el acceso compartido y la API",
  lede: "Empieza por la tarea que necesitas resolver. Hardware, alertas de congelación e inundación/fugas, acceso compartido del hogar y documentación de ingesta/API en un solo lugar; después, explora todos los artículos si quieres ver cada guía.",
  startFree: "Empieza gratis",
  allArticles: "Todos los artículos",
  esp32Kit: "Kit antiheladas ESP32",
  photoLabels: {
    "dht22-module": "Configuración del hardware",
    "arduino-uno-board": "Arduino y firmware",
    "attic-insulation": "Alertas y congelación",
    "ethernet-cable": "Integraciones y API",
  },
  alsoRelevant: "También es útil para:",
  alsoUsefulTitle: "También útil",
  alsoUsefulSubtitle: "Escenarios, comparativas e integraciones, junto a la biblioteca de guías prácticas.",
  alsoUseful: {
    "/stories": {
      label: "Escenarios",
      summary: "Recorridos ilustrativos de congelación, fugas y calor, alerta por alerta.",
    },
    "/compare": {
      label: "Comparar alternativas",
      summary: "ProbeHarbor frente a MQTT casero, Govee, Tempest, Nest, Ecobee y otros.",
    },
    "/integrations": {
      label: "Integraciones",
      summary: "Home Assistant, Matter, Node-RED, Influx, MQTT y webhooks.",
    },
    "/accessories": {
      label: "Accesorios",
      summary: "Claim puck, baliza de alerta, contactos de puerta/fuga/corriente, etiquetas del kit y soportes.",
    },
    "/gift": {
      label: "Regalo / recomendación",
      summary: "Comparte un enlace de invitación: la otra persona recibe días extra de prueba de Pro, y tú también cuando se suscriba.",
    },
  },
  itemListName: "Guías de ProbeHarbor por tarea",
  itemListDescription:
    "Guías de configuración del hardware, alertas de congelación e inundación, acceso compartido del hogar y API.",
  faqLede: "Respuestas rápidas antes de entrar en una categoría.",
  faqs: [
    {
      question: "¿Por dónde empiezo?",
      answer:
        "Elige una tarea abajo: configuración del hardware (kit antiheladas ESP32), alertas de congelación/inundación, acceso compartido del hogar o la API HTTP. O abre la biblioteca completa de About.",
    },
    {
      question: "¿Venden kits de hardware?",
      answer:
        "No. ProbeHarbor es software. Compra las piezas en Adafruit o Amazon con la lista de materiales del kit antiheladas ESP32 y las páginas de accesorios, y luego carga un sketch ya rellenado desde Devices.",
    },
    {
      question: "¿Dónde están los escenarios de ejemplo y las comparativas?",
      answer:
        "Escenarios ilustrativos de congelación, fugas y calor: probeharbor.dev/stories. Frente a MQTT casero, Govee, Tempest, Nest y Ecobee: probeharbor.dev/compare. Home Assistant: probeharbor.dev/integrations.",
    },
  ],
};

export default es;

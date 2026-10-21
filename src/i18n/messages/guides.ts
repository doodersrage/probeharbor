import type { AboutFaqItem } from "../../lib/aboutFaqs";
import { defineMessages } from "../translate";

/**
 * /guides hub copy. Category/link text lives in `src/i18n/content/guideHub/`.
 * `photoLabels` are keyed by `guidesHubPhotos` id (src/lib/aboutPhotos.ts);
 * `alsoUseful` is keyed by href.
 */
const en = {
  title: "Guides",
  description:
    "ProbeHarbor guides by job: hardware setup, freeze and flood/leak alerts, household sharing, and the HTTP API, plus all articles in one library.",
  breadcrumbHome: "Home",
  breadcrumbPage: "Guides",
  kicker: "Guides",
  headerTitle: "Set up probes, freeze/flood alerts, sharing, and the API",
  lede: "Start with the job you need done. Hardware, freeze and flood/leak alerts, household sharing, and ingest/API docs in one place, then browse all articles if you want every guide.",
  startFree: "Start free",
  allArticles: "All articles",
  esp32Kit: "ESP32 freeze kit",
  photoLabels: {
    "dht22-module": "Hardware setup",
    "arduino-uno-board": "Arduino & firmware",
    "attic-insulation": "Alerts & freeze",
    "ethernet-cable": "Integrations & API",
  } as Record<string, string>,
  alsoRelevant: "Also relevant to:",
  alsoUsefulTitle: "Also useful",
  alsoUsefulSubtitle: "Stories, comparisons, and integrations sit beside the how-to library.",
  alsoUseful: {
    "/stories": {
      label: "Scenarios",
      summary: "Illustrative freeze, leak, and heat walkthroughs, alert by alert.",
    },
    "/compare": {
      label: "Compare alternatives",
      summary: "ProbeHarbor vs DIY MQTT, Govee, Tempest, Nest, Ecobee, and others.",
    },
    "/integrations": {
      label: "Integrations",
      summary: "Home Assistant, Matter, Node-RED, Influx, MQTT, and webhooks.",
    },
    "/accessories": {
      label: "Accessories",
      summary: "Claim puck, alert beacon, door/leak/power contacts, kit labels, mounts.",
    },
    "/gift": {
      label: "Gift / referral",
      summary: "Share an invite link: they get extra Pro trial days, and so do you when they subscribe.",
    },
  } as Record<string, { label: string; summary: string }>,
  itemListName: "ProbeHarbor guides by job",
  itemListDescription: "Hardware setup, freeze and flood alerts, household sharing, and API guides.",
  faqLede: "Quick answers before you dive into a category.",
  faqs: [
    {
      question: "Where should I start?",
      answer:
        "Pick a job below: hardware setup (ESP32 freeze kit), freeze/flood alerts, household sharing, or the HTTP API. Or open the full About library.",
    },
    {
      question: "Do you sell hardware kits?",
      answer:
        "No. ProbeHarbor is software. Buy parts from Adafruit or Amazon using the ESP32 freeze kit BOM and accessories pages, then flash a pre-filled sketch from Devices.",
    },
    {
      question: "Where are example scenarios and comparisons?",
      answer:
        "Illustrative freeze, leak, and heat scenarios: probeharbor.dev/stories. Versus DIY MQTT, Govee, Tempest, Nest, and Ecobee: probeharbor.dev/compare. Home Assistant: probeharbor.dev/integrations.",
    },
  ] as AboutFaqItem[],
};

type GuidesMessages = typeof en;

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

const fr: GuidesMessages = {
  title: "Guides",
  description:
    "Guides ProbeHarbor par besoin : matériel, alertes de gel et d’inondation/fuite, partage du foyer et API HTTP, plus tous les articles dans une bibliothèque.",
  breadcrumbHome: "Accueil",
  breadcrumbPage: "Guides",
  kicker: "Guides",
  headerTitle: "Installer les sondes, les alertes gel/inondation, le partage et l’API",
  lede: "Commencez par ce que vous avez à faire. Matériel, alertes de gel et d’inondation/fuite, partage du foyer et documentation ingestion/API au même endroit, puis parcourez tous les articles si vous voulez voir chaque guide.",
  startFree: "Commencer gratuitement",
  allArticles: "Tous les articles",
  esp32Kit: "Kit antigel ESP32",
  photoLabels: {
    "dht22-module": "Installation du matériel",
    "arduino-uno-board": "Arduino et firmware",
    "attic-insulation": "Alertes et gel",
    "ethernet-cable": "Intégrations et API",
  },
  alsoRelevant: "Concerne aussi :",
  alsoUsefulTitle: "À voir aussi",
  alsoUsefulSubtitle: "Scénarios, comparatifs et intégrations, à côté de la bibliothèque de guides pratiques.",
  alsoUseful: {
    "/stories": {
      label: "Scénarios",
      summary: "Des déroulés illustratifs de gel, de fuite et de chaleur, alerte après alerte.",
    },
    "/compare": {
      label: "Comparer les alternatives",
      summary: "ProbeHarbor face au MQTT maison, Govee, Tempest, Nest, Ecobee et d’autres.",
    },
    "/integrations": {
      label: "Intégrations",
      summary: "Home Assistant, Matter, Node-RED, Influx, MQTT et webhooks.",
    },
    "/accessories": {
      label: "Accessoires",
      summary: "Claim puck, balise d’alerte, contacts porte/fuite/courant, étiquettes de kit, supports.",
    },
    "/gift": {
      label: "Cadeau / parrainage",
      summary: "Partagez un lien d’invitation : la personne invitée obtient des jours d’essai Pro en plus, et vous aussi quand elle s’abonne.",
    },
  },
  itemListName: "Guides ProbeHarbor par besoin",
  itemListDescription:
    "Guides d’installation du matériel, d’alertes de gel et d’inondation, de partage du foyer et de l’API.",
  faqLede: "Des réponses rapides avant de plonger dans une catégorie.",
  faqs: [
    {
      question: "Par où commencer ?",
      answer:
        "Choisissez un besoin ci-dessous : installation du matériel (kit antigel ESP32), alertes de gel/inondation, partage du foyer ou API HTTP. Ou ouvrez la bibliothèque About complète.",
    },
    {
      question: "Vendez-vous des kits matériels ?",
      answer:
        "Non. ProbeHarbor est un logiciel. Achetez les composants chez Adafruit ou Amazon à l’aide de la nomenclature du kit antigel ESP32 et des pages d’accessoires, puis flashez un sketch prérempli depuis Devices.",
    },
    {
      question: "Où trouver des scénarios d’exemple et des comparatifs ?",
      answer:
        "Scénarios illustratifs de gel, de fuite et de chaleur : probeharbor.dev/stories. Face au MQTT maison, Govee, Tempest, Nest et Ecobee : probeharbor.dev/compare. Home Assistant : probeharbor.dev/integrations.",
    },
  ],
};

const de: GuidesMessages = {
  title: "Anleitungen",
  description:
    "ProbeHarbor-Anleitungen nach Aufgabe: Hardware, Frost- und Hochwasser-/Leckalarme, Haushaltsfreigabe und HTTP-API, dazu alle Artikel in einer Bibliothek.",
  breadcrumbHome: "Startseite",
  breadcrumbPage: "Anleitungen",
  kicker: "Anleitungen",
  headerTitle: "Sonden, Frost-/Hochwasseralarme, Freigaben und die API einrichten",
  lede: "Fang mit der Aufgabe an, die du erledigen willst. Hardware, Frost- und Hochwasser-/Leckalarme, Haushaltsfreigabe und Ingest-/API-Dokumentation an einem Ort; danach kannst du alle Artikel durchstöbern, wenn du jede Anleitung sehen willst.",
  startFree: "Kostenlos starten",
  allArticles: "Alle Artikel",
  esp32Kit: "ESP32-Frost-Kit",
  photoLabels: {
    "dht22-module": "Hardware einrichten",
    "arduino-uno-board": "Arduino & Firmware",
    "attic-insulation": "Alarme & Frost",
    "ethernet-cable": "Integrationen & API",
  },
  alsoRelevant: "Auch relevant für:",
  alsoUsefulTitle: "Ebenfalls nützlich",
  alsoUsefulSubtitle: "Szenarien, Vergleiche und Integrationen ergänzen die Anleitungsbibliothek.",
  alsoUseful: {
    "/stories": {
      label: "Szenarien",
      summary: "Beispielhafte Abläufe bei Frost, Leck und Hitze, Alarm für Alarm.",
    },
    "/compare": {
      label: "Alternativen vergleichen",
      summary: "ProbeHarbor im Vergleich zu DIY-MQTT, Govee, Tempest, Nest, Ecobee und anderen.",
    },
    "/integrations": {
      label: "Integrationen",
      summary: "Home Assistant, Matter, Node-RED, Influx, MQTT und Webhooks.",
    },
    "/accessories": {
      label: "Zubehör",
      summary: "Claim Puck, Alarmleuchte, Tür-/Leck-/Stromkontakte, Kit-Etiketten, Halterungen.",
    },
    "/gift": {
      label: "Geschenk / Empfehlung",
      summary: "Teile einen Einladungslink: Die eingeladene Person bekommt zusätzliche Pro-Testtage, und du auch, sobald sie ein Abo abschließt.",
    },
  },
  itemListName: "ProbeHarbor-Anleitungen nach Aufgabe",
  itemListDescription:
    "Anleitungen zu Hardware-Einrichtung, Frost- und Hochwasseralarmen, Haushaltsfreigabe und API.",
  faqLede: "Kurze Antworten, bevor du in eine Kategorie einsteigst.",
  faqs: [
    {
      question: "Wo fange ich am besten an?",
      answer:
        "Wähle unten eine Aufgabe: Hardware einrichten (ESP32-Frost-Kit), Frost-/Hochwasseralarme, Haushaltsfreigabe oder die HTTP-API. Oder öffne die komplette About-Bibliothek.",
    },
    {
      question: "Verkauft ihr Hardware-Kits?",
      answer:
        "Nein. ProbeHarbor ist Software. Kauf die Teile bei Adafruit oder Amazon anhand der Stückliste des ESP32-Frost-Kits und der Zubehörseiten und flashe dann einen vorausgefüllten Sketch unter Devices.",
    },
    {
      question: "Wo finde ich Beispielszenarien und Vergleiche?",
      answer:
        "Beispielhafte Szenarien zu Frost, Leck und Hitze: probeharbor.dev/stories. Im Vergleich zu DIY-MQTT, Govee, Tempest, Nest und Ecobee: probeharbor.dev/compare. Home Assistant: probeharbor.dev/integrations.",
    },
  ],
};

const ptBr: GuidesMessages = {
  title: "Guias",
  description:
    "Guias do ProbeHarbor por tarefa: hardware, alertas de congelamento e inundação/vazamento, compartilhamento da residência e API HTTP, mais todos os artigos.",
  breadcrumbHome: "Início",
  breadcrumbPage: "Guias",
  kicker: "Guias",
  headerTitle: "Configure sondas, alertas de congelamento/inundação, compartilhamento e a API",
  lede: "Comece pela tarefa que você precisa resolver. Hardware, alertas de congelamento e inundação/vazamento, compartilhamento da residência e documentação de ingestão/API em um só lugar; depois, navegue por todos os artigos se quiser ver cada guia.",
  startFree: "Comece grátis",
  allArticles: "Todos os artigos",
  esp32Kit: "Kit ESP32 contra congelamento",
  photoLabels: {
    "dht22-module": "Configuração do hardware",
    "arduino-uno-board": "Arduino e firmware",
    "attic-insulation": "Alertas e congelamento",
    "ethernet-cable": "Integrações e API",
  },
  alsoRelevant: "Também relevante para:",
  alsoUsefulTitle: "Também útil",
  alsoUsefulSubtitle: "Cenários, comparações e integrações ficam ao lado da biblioteca de guias práticos.",
  alsoUseful: {
    "/stories": {
      label: "Cenários",
      summary: "Passo a passo ilustrativo de congelamento, vazamento e calor, alerta por alerta.",
    },
    "/compare": {
      label: "Comparar alternativas",
      summary: "ProbeHarbor comparado a MQTT caseiro, Govee, Tempest, Nest, Ecobee e outros.",
    },
    "/integrations": {
      label: "Integrações",
      summary: "Home Assistant, Matter, Node-RED, Influx, MQTT e webhooks.",
    },
    "/accessories": {
      label: "Acessórios",
      summary: "Claim puck, sinalizador de alerta, contatos de porta/vazamento/energia, etiquetas do kit e suportes.",
    },
    "/gift": {
      label: "Presente / indicação",
      summary: "Compartilhe um link de convite: a pessoa ganha dias extras de teste do Pro, e você também quando ela assinar.",
    },
  },
  itemListName: "Guias do ProbeHarbor por tarefa",
  itemListDescription:
    "Guias de configuração do hardware, alertas de congelamento e inundação, compartilhamento da residência e API.",
  faqLede: "Respostas rápidas antes de mergulhar em uma categoria.",
  faqs: [
    {
      question: "Por onde eu começo?",
      answer:
        "Escolha uma tarefa abaixo: configuração do hardware (kit ESP32 contra congelamento), alertas de congelamento/inundação, compartilhamento da residência ou a API HTTP. Ou abra a biblioteca completa do About.",
    },
    {
      question: "Vocês vendem kits de hardware?",
      answer:
        "Não. O ProbeHarbor é software. Compre as peças na Adafruit ou na Amazon usando a lista de materiais do kit ESP32 contra congelamento e as páginas de acessórios, depois grave um sketch já preenchido pela tela Devices.",
    },
    {
      question: "Onde ficam os cenários de exemplo e as comparações?",
      answer:
        "Cenários ilustrativos de congelamento, vazamento e calor: probeharbor.dev/stories. Comparado a MQTT caseiro, Govee, Tempest, Nest e Ecobee: probeharbor.dev/compare. Home Assistant: probeharbor.dev/integrations.",
    },
  ],
};

export const guidesMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

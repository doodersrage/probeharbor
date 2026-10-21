import type { AboutFaqItem } from "../../../lib/aboutFaqs";

/**
 * /guides hub copy. Category/link text lives in `src/i18n/content/guideHub/`.
 * `photoLabels` are keyed by `guidesHubPhotos` id (src/lib/aboutPhotos.ts);
 * `alsoUseful` is keyed by href.
 */
import type { GuidesMessages } from "./en";

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

export default ptBr;

import type { AboutNavigationOverlay } from "../index";

export default {
  megaGroups: {
    environment: {
      title: "Ambientes das sondas",
      description: "Sondas, posicionamento e a física que mexe nas leituras.",
    },
    history: {
      title: "Dados e histórico",
      description: "Snapshots salvos, exportações e como as leituras chegam ao armazenamento.",
    },
    hardware: {
      title: "Hardware e firmware",
      description: "Firmware para Arduino, ESP32, Pico W, STM32, CH32V e assembly AVR, fiação e o LCD local.",
    },
    software: {
      title: "Backend e site",
      description: "Relays em Python, Astro na Cloudflare e comparações de stacks.",
    },
    product: {
      title: "Painel e integrações",
      description: "Contas, API de ingestão, alertas, instalação do PWA e automação.",
    },
  },
  journeys: {
    "winter-pipes": {
      title: "Proteger os canos neste inverno",
      description:
        "Defina limites de congelamento, adicione um contato de vazamento seco/molhado, configure os alertas e veja nas histórias como foi uma onda de frio real ou um vazamento sob o piso.",
      ctaLabel: "Começar a monitorar grátis",
      steps: [
        { label: "Limites de congelamento" },
        { label: "Tempo até congelar" },
        { label: "Plano para onda de frio" },
        { label: "Plano para enchente no degelo" },
        { label: "Canais de alerta" },
        { label: "Estudo de caso" },
      ],
    },
    "first-dht22": {
      title: "Ligar meu primeiro DHT22",
      description: "Noções básicas do sensor, fiação dos pinos e o sketch Arduino que publica JSON.",
      ctaLabel: "Abrir a visão geral do Arduino",
      steps: [
        { label: "Visão geral do DHT22" },
        { label: "Fiação da linha de dados" },
        { label: "Mapa de pinos" },
        { label: "Sketch do firmware" },
      ],
    },
    "esp-ingest": {
      title: "Enviar de ESP / Pico / MCU / assembly AVR",
      description:
        "Crie um dispositivo push, faça POST para os sensores serem importados automaticamente e, se quiser, use OTA e etiquetas QR.",
      ctaLabel: "Adicionar um dispositivo",
      steps: [
        { label: "Adicionar push ou pull" },
        { label: "Comprar o kit ESP32" },
        { label: "Ou gravar o Pico W" },
        { label: "Ou gravar o STM32" },
        { label: "Ou gravar o CH32V" },
        { label: "Ou assembly AVR" },
        { label: "Ou LTE celular" },
        { label: "Ou Teensy 4.1" },
        { label: "Ou PIC18 Ethernet" },
        { label: "API de ingestão" },
        { label: "QR do kit" },
        { label: "Gravar o ESP32" },
        { label: "OTA do ESP32" },
      ],
    },
    "understand-readings": {
      title: "Entender minhas leituras",
      description:
        "Por que a temperatura da garagem oscila, como os dados chegam ao site e como identificar feeds parados.",
      ctaLabel: "Testar a demo das sondas",
      steps: [
        { label: "O que causa as oscilações" },
        { label: "Fluxo de dados" },
        { label: "Leituras paradas" },
        { label: "Histórico e CSV" },
      ],
    },
    "share-household": {
      title: "Compartilhar com minha casa",
      description: "Convide a família, entenda os papéis e mantenha os alertas de congelamento e vazamento em um só lugar.",
      ctaLabel: "Criar uma conta grátis",
      steps: [
        { label: "Guia de compartilhamento" },
        { label: "Contas e painel" },
        { label: "Papéis e grupos" },
        { label: "Instalar o PWA" },
      ],
    },
  },
} satisfies AboutNavigationOverlay;

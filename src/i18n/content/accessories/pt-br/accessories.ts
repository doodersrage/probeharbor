import type { AccessoryOverlay } from "../index";

export default {
  "claim-puck": {
    tagline:
      "Chave de presença USB: faça o claim de um espaço apertando um botão e veja os humores de congelamento e inundação em um LED do RP2040-Zero.",
  },
  "alert-beacon": {
    tagline:
      "Luz de humor para mesa ou corredor que reflete os humores de congelamento/inundação do Bay Buddy. Não é uma sonda de temperatura.",
  },
  "door-puck": {
    name: "Door puck (contato de porta)",
    tagline:
      "Contato magnético reed ou botão que envia porta aberta/fechada por POST à ingestão, para o humor drafty e alertas personalizados.",
  },
  "leak-puck": {
    name: "Leak puck (contato de vazamento)",
    tagline:
      "Placas de contato com água que enviam por POST sensores de inundação molhado/seco. O ProbeHarbor alerta sozinho quando molha, com os alertas ativos.",
  },
  "power-nudge": {
    name: "Power nudge (falta de energia)",
    tagline:
      "Contato de detecção de rede via USB ou nobreak que envia energia perdida/restaurada por POST, para você saber quando o espaço ficou sem luz.",
  },
  "kit-labels": {
    name: "Etiquetas QR e NFC do kit",
    shortName: "Etiquetas do kit",
    tagline:
      "Adesivos QR imprimíveis e tags NFC opcionais com sua URL de ingestão push, para configurar sem digitar chaves.",
  },
  "probe-mount-kit": {
    name: "Kit de fixação da sonda",
    shortName: "Kit de fixação",
    tagline:
      "Abraçadeiras, presilhas para cano, fitas adesivas, pull-up de 4,7k e dicas de fixação do DS18B20 à prova d’água para uma sonda de congelamento confiável.",
  },
  "claim-puck-case": {
    name: "Case do Claim puck",
    shortName: "Case do puck",
    tagline:
      "Gabinete, botão e difusor de LED opcional para o claim puck RP2040-Zero — transforme a montagem da placa nua em produto.",
  },
} satisfies AccessoryOverlay;

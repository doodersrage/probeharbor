import type { AppsOverlay } from "..";

export default {
  desktop: {
    tagline:
      "Painel nativo do ProbeHarbor para Windows, macOS e Linux: leituras ao vivo, histórico, alertas, dispositivos e ferramentas da casa na sua conta atual.",
  },
  bayBuddy: {
    tagline:
      "App complementar de desktop do ProbeHarbor: o humor de congelamento e alagamento de uma garagem, oficina ou cabana, num relance.",
  },
  companionApps: {
    android: {
      name: "App para Android",
      platform: "Celular / tablet",
      summary:
        "App complementar nativo com sondas ao vivo, histórico, alertas de congelamento/alagamento, dispositivos, MFA e ferramentas da casa. O celular não é um sensor.",
      cta: "Detalhes do Android",
    },
    desktop: { cta: "Detalhes do Desktop" },
    "bay-buddy": { cta: "Detalhes do Bay Buddy" },
    pwa: {
      name: "Progressive Web App (PWA)",
      platform: "Navegador / tela inicial",
      summary:
        "Instale o painel pelo Chrome ou Edge e tenha um cliente prático no celular enquanto os apps nativos não chegam: mesma conta, sem esperar loja de apps.",
      cta: "Guia de instalação do PWA",
    },
  },
} satisfies AppsOverlay;

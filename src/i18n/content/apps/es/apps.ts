import type { AppsOverlay } from "..";

export default {
  desktop: {
    tagline:
      "Panel nativo de ProbeHarbor para Windows, macOS y Linux: lecturas en vivo, historial, alertas, dispositivos y herramientas del hogar con tu cuenta actual.",
  },
  bayBuddy: {
    tagline:
      "App complementaria de escritorio de ProbeHarbor: el estado de congelación e inundación de un garaje, taller o cabaña, de un vistazo.",
  },
  companionApps: {
    android: {
      name: "App para Android",
      platform: "Móvil / tableta",
      summary:
        "App complementaria nativa con sondas en vivo, historial, alertas de congelación/inundación, dispositivos, MFA y herramientas del hogar. El móvil no es un sensor.",
      cta: "Detalles de Android",
    },
    desktop: { cta: "Detalles de Desktop" },
    "bay-buddy": { cta: "Detalles de Bay Buddy" },
    pwa: {
      name: "Aplicación web progresiva (PWA)",
      platform: "Navegador / pantalla de inicio",
      summary:
        "Instala el panel desde Chrome o Edge y tendrás un cliente cómodo en el móvil mientras llegan las apps nativas: la misma cuenta, sin esperar a ninguna tienda.",
      cta: "Guía de instalación de la PWA",
    },
  },
} satisfies AppsOverlay;

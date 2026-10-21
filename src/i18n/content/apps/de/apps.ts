import type { AppsOverlay } from "..";

export default {
  desktop: {
    tagline:
      "Natives Begleit-Dashboard für ProbeHarbor unter Windows, macOS und Linux: Live-Werte, Verlauf, Alarme, Geräte und Haushaltsfunktionen für dein Konto.",
  },
  bayBuddy: {
    tagline:
      "Desktop-Begleit-App für ProbeHarbor: Frost- und Wasser-Stimmung für eine Garage, Werkstatt oder Hütte auf einen Blick.",
  },
  companionApps: {
    android: {
      name: "Android-App",
      platform: "Smartphone / Tablet",
      summary:
        "Native Begleit-App für Live-Fühler, Verlauf, Frost- und Wasseralarme, Geräte, MFA und Haushaltsfunktionen. Das Handy ist kein Sensor.",
      cta: "Android-Details",
    },
    desktop: { cta: "Desktop-Details" },
    "bay-buddy": { cta: "Bay-Buddy-Details" },
    pwa: {
      name: "Progressive Web App",
      platform: "Browser / Startbildschirm",
      summary:
        "Installiere das Dashboard aus Chrome oder Edge – ein handytauglicher Client, bis die nativen Apps nachziehen. Gleiches Konto, kein Warten auf einen App-Store.",
      cta: "PWA-Installationsanleitung",
    },
  },
} satisfies AppsOverlay;

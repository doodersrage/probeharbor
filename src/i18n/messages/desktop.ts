import { defineMessages } from "../translate";

/**
 * /desktop page copy. The page title/description come from `DESKTOP_NAME` and
 * the localized tagline (`src/i18n/content/apps`). Keys ending in `Html` hold
 * trusted inline HTML rendered with `set:html`; keep hrefs English.
 */
const en = {
  breadcrumbHome: "Home",
  breadcrumbApps: "Apps",
  kicker: "Desktop companion",
  lede: (brand: string) =>
    `Native dashboard for your ${brand} account on Windows, macOS, and Linux. Live probes, history, alerts, devices, household, and share tools — the desktop is not a sensor.`,
  download: "Download latest release",
  freeAccount: "Free ProbeHarbor account",
  sourceOnGithub: "Source on GitHub",
  doesTitle: "What it does (and does not)",
  doesHtml:
    "<strong>Does:</strong> sign in with your ProbeHarbor account, show live readings and time-to-freeze, history charts, alert settings, devices, household, share links, and portfolio. Pro can raise OS notifications for new alerts while the app is open; kiosk mode fullscreen live readings for shop displays.",
  doesNotHtml:
    '<strong>Does not:</strong> sense temperature from the PC. Probes keep posting to probeharbor.dev. For a one-space freeze/flood mood glance (and claim puck), use <a class="text-link" href="/bay-buddy">Bay Buddy</a>.',
  installTitle: "Install",
  installCopy: "Linux AppImage / deb / rpm, Windows MSI, and macOS DMG ship on GitHub Releases.",
  installStepsHtml: (releasesUrl: string) => [
    '<a class="text-link" href="/register?next=/dashboard/devices">Create a free ProbeHarbor account</a> and connect at least one probe (or the demo pull feed).',
    `<a class="text-link" href="${releasesUrl}" target="_blank" rel="noreferrer">Download ProbeHarbor Desktop</a> for your OS and install.`,
    "Click <strong>Connect</strong>, sign in on probeharbor.dev in the browser, and return to the desktop window when the handoff finishes.",
  ],
  openReleases: "Open releases",
  faqTitle: "Desktop FAQ",
  faqLede: "Desktop companion answers: download, connect, and how it differs from Bay Buddy.",
  backToApps: "← All companion apps",
};

type DesktopMessages = typeof en;

const es: DesktopMessages = {
  breadcrumbHome: "Inicio",
  breadcrumbApps: "Apps",
  kicker: "App complementaria de escritorio",
  lede: (brand) =>
    `Panel nativo para tu cuenta de ${brand} en Windows, macOS y Linux. Sondas en vivo, historial, alertas, dispositivos, hogar y herramientas para compartir: el ordenador no es un sensor.`,
  download: "Descargar la última versión",
  freeAccount: "Cuenta gratuita de ProbeHarbor",
  sourceOnGithub: "Código en GitHub",
  doesTitle: "Qué hace (y qué no)",
  doesHtml:
    "<strong>Sí hace:</strong> inicia sesión con tu cuenta de ProbeHarbor y muestra lecturas en vivo y el tiempo hasta la congelación, gráficos del historial, ajustes de alertas, dispositivos, hogar, enlaces para compartir y cartera de propiedades. Con Pro puede mostrar notificaciones del sistema para nuevas alertas mientras la app está abierta; el modo quiosco muestra las lecturas en vivo a pantalla completa en pantallas de taller.",
  doesNotHtml:
    '<strong>No hace:</strong> medir la temperatura desde el PC. Las sondas siguen enviando datos a probeharbor.dev. Para ver de un vistazo el estado de congelación/inundación de un solo espacio (y usar el Claim puck), usa <a class="text-link" href="/bay-buddy">Bay Buddy</a>.',
  installTitle: "Instalación",
  installCopy:
    "AppImage / deb / rpm para Linux, MSI para Windows y DMG para macOS se publican en GitHub Releases.",
  installStepsHtml: (releasesUrl) => [
    '<a class="text-link" href="/register?next=/dashboard/devices">Crea una cuenta gratuita de ProbeHarbor</a> y conecta al menos una sonda (o el feed de demostración).',
    `<a class="text-link" href="${releasesUrl}" target="_blank" rel="noreferrer">Descarga ProbeHarbor Desktop</a> para tu sistema operativo e instálalo.`,
    "Haz clic en <strong>Connect</strong>, inicia sesión en probeharbor.dev en el navegador y vuelve a la ventana de escritorio cuando termine el traspaso.",
  ],
  openReleases: "Ver versiones",
  faqTitle: "Preguntas frecuentes sobre Desktop",
  faqLede: "Respuestas sobre la app de escritorio: descarga, conexión y en qué se diferencia de Bay Buddy.",
  backToApps: "← Todas las apps complementarias",
};

const fr: DesktopMessages = {
  breadcrumbHome: "Accueil",
  breadcrumbApps: "Applications",
  kicker: "Compagnon de bureau",
  lede: (brand) =>
    `Tableau de bord natif pour votre compte ${brand} sous Windows, macOS et Linux. Sondes en direct, historique, alertes, appareils, foyer et outils de partage : l’ordinateur n’est pas un capteur.`,
  download: "Télécharger la dernière version",
  freeAccount: "Compte ProbeHarbor gratuit",
  sourceOnGithub: "Code source sur GitHub",
  doesTitle: "Ce qu’elle fait (et ne fait pas)",
  doesHtml:
    "<strong>Elle fait :</strong> se connecter avec votre compte ProbeHarbor, afficher les relevés en direct et le temps restant avant le gel, les graphiques d’historique, les réglages des alertes, les appareils, le foyer, les liens de partage et le portefeuille. Avec Pro, elle peut afficher des notifications système pour les nouvelles alertes tant que l’app est ouverte ; le mode kiosque affiche les relevés en direct en plein écran sur les écrans d’atelier.",
  doesNotHtml:
    '<strong>Elle ne fait pas :</strong> mesurer la température depuis le PC. Les sondes continuent d’envoyer leurs données à probeharbor.dev. Pour un coup d’œil sur l’état gel/inondation d’un seul espace (et le Claim puck), utilisez <a class="text-link" href="/bay-buddy">Bay Buddy</a>.',
  installTitle: "Installation",
  installCopy:
    "Les paquets Linux AppImage / deb / rpm, Windows MSI et macOS DMG sont publiés sur GitHub Releases.",
  installStepsHtml: (releasesUrl) => [
    '<a class="text-link" href="/register?next=/dashboard/devices">Créez un compte ProbeHarbor gratuit</a> et connectez au moins une sonde (ou le flux de démonstration).',
    `<a class="text-link" href="${releasesUrl}" target="_blank" rel="noreferrer">Téléchargez ProbeHarbor Desktop</a> pour votre système et installez-le.`,
    "Cliquez sur <strong>Connect</strong>, connectez-vous sur probeharbor.dev dans le navigateur, puis revenez à la fenêtre de l’application une fois le transfert terminé.",
  ],
  openReleases: "Voir les versions",
  faqTitle: "FAQ Desktop",
  faqLede: "Questions sur l’application de bureau : téléchargement, connexion et différences avec Bay Buddy.",
  backToApps: "← Toutes les applications compagnons",
};

const de: DesktopMessages = {
  breadcrumbHome: "Start",
  breadcrumbApps: "Apps",
  kicker: "Desktop-Begleit-App",
  lede: (brand) =>
    `Natives Dashboard für dein ${brand}-Konto unter Windows, macOS und Linux. Live-Fühler, Verlauf, Alarme, Geräte, Haushalt und Freigabefunktionen – der Rechner ist kein Sensor.`,
  download: "Neueste Version herunterladen",
  freeAccount: "Kostenloses ProbeHarbor-Konto",
  sourceOnGithub: "Quellcode auf GitHub",
  doesTitle: "Was sie kann (und was nicht)",
  doesHtml:
    "<strong>Kann:</strong> sich mit deinem ProbeHarbor-Konto anmelden und Live-Werte samt Zeit bis zum Frost, Verlaufsdiagramme, Alarmeinstellungen, Geräte, Haushalt, Freigabelinks und Portfolio anzeigen. Mit Pro gibt es Systembenachrichtigungen für neue Alarme, solange die App geöffnet ist; der Kioskmodus zeigt Live-Werte im Vollbild auf Werkstattbildschirmen.",
  doesNotHtml:
    '<strong>Kann nicht:</strong> die Temperatur am PC messen. Die Fühler senden weiterhin an probeharbor.dev. Für einen schnellen Blick auf die Frost- und Wasser-Stimmung eines Raums (und den Claim Puck) nimm <a class="text-link" href="/bay-buddy">Bay Buddy</a>.',
  installTitle: "Installation",
  installCopy:
    "Linux AppImage / deb / rpm, Windows MSI und macOS DMG stehen auf GitHub Releases bereit.",
  installStepsHtml: (releasesUrl) => [
    '<a class="text-link" href="/register?next=/dashboard/devices">Kostenloses ProbeHarbor-Konto anlegen</a> und mindestens einen Fühler (oder den Demo-Feed) verbinden.',
    `<a class="text-link" href="${releasesUrl}" target="_blank" rel="noreferrer">ProbeHarbor Desktop herunterladen</a> und für dein Betriebssystem installieren.`,
    "Auf <strong>Connect</strong> klicken, dich im Browser auf probeharbor.dev anmelden und nach der Übergabe zum Desktop-Fenster zurückkehren.",
  ],
  openReleases: "Releases öffnen",
  faqTitle: "Desktop-FAQ",
  faqLede: "Antworten zur Desktop-App: Download, Verbindung und der Unterschied zu Bay Buddy.",
  backToApps: "← Alle Begleit-Apps",
};

const ptBr: DesktopMessages = {
  breadcrumbHome: "Início",
  breadcrumbApps: "Apps",
  kicker: "App complementar de desktop",
  lede: (brand) =>
    `Painel nativo para sua conta ${brand} no Windows, macOS e Linux. Sondas ao vivo, histórico, alertas, dispositivos, casa e ferramentas de compartilhamento: o computador não é um sensor.`,
  download: "Baixar a versão mais recente",
  freeAccount: "Conta gratuita no ProbeHarbor",
  sourceOnGithub: "Código no GitHub",
  doesTitle: "O que ele faz (e o que não faz)",
  doesHtml:
    "<strong>Faz:</strong> entra com sua conta ProbeHarbor e mostra leituras ao vivo e o tempo até o congelamento, gráficos de histórico, configurações de alertas, dispositivos, casa, links de compartilhamento e portfólio. No Pro, pode exibir notificações do sistema para novos alertas enquanto o app está aberto; o modo quiosque mostra leituras ao vivo em tela cheia em monitores de oficina.",
  doesNotHtml:
    '<strong>Não faz:</strong> medir a temperatura pelo PC. As sondas continuam enviando dados para probeharbor.dev. Para ver num relance o humor de congelamento/alagamento de um único espaço (e usar o Claim puck), use o <a class="text-link" href="/bay-buddy">Bay Buddy</a>.',
  installTitle: "Instalação",
  installCopy:
    "AppImage / deb / rpm para Linux, MSI para Windows e DMG para macOS são publicados no GitHub Releases.",
  installStepsHtml: (releasesUrl) => [
    '<a class="text-link" href="/register?next=/dashboard/devices">Crie uma conta gratuita no ProbeHarbor</a> e conecte pelo menos uma sonda (ou o feed de demonstração).',
    `<a class="text-link" href="${releasesUrl}" target="_blank" rel="noreferrer">Baixe o ProbeHarbor Desktop</a> para o seu sistema e instale.`,
    "Clique em <strong>Connect</strong>, entre em probeharbor.dev no navegador e volte para a janela do app quando a transferência terminar.",
  ],
  openReleases: "Ver versões",
  faqTitle: "Perguntas frequentes sobre o Desktop",
  faqLede: "Respostas sobre o app de desktop: download, conexão e como ele difere do Bay Buddy.",
  backToApps: "← Todos os apps complementares",
};

export const desktopMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

import { defineMessages } from "../translate";

/**
 * /bay-buddy page copy. The description comes from the localized tagline
 * (`src/i18n/content/apps`). Keys ending in `Html` hold trusted inline HTML
 * rendered with `set:html`; keep hrefs English. Mood names (cozy, drafty…)
 * are translated in prose.
 */
const en = {
  breadcrumbHome: "Home",
  breadcrumbApps: "Apps",
  kicker: "Desktop companion",
  lede: (name: string, brand: string) =>
    `Not a second dashboard. ${name} shows the vibe of one ProbeHarbor space: cozy, drafty, shiver, panic, offline, or hero. Devices, alerts, history, and claims stay on ${brand}.`,
  download: "Download latest release",
  freeAccount: "Free ProbeHarbor account",
  sourceOnGithub: "Source on GitHub",
  showsTitle: "What it shows",
  doesHtml:
    "<strong>Does:</strong> live garage mood from your existing probes, freeze margin, time-to-freeze, door and leak signals, after you Connect with the same ProbeHarbor account.",
  doesNotHtml:
    '<strong>Does not:</strong> replace Overview, Devices, Alerts, History, or the claims pack. Those stay on probeharbor.dev (and on the <a class="text-link" href="/android">Android companion</a> / <a class="text-link" href="/about/install-pwa">PWA</a>).',
  installTitle: "Install",
  installCopy: "Linux AppImage / deb / rpm, Windows MSI, and macOS DMG ship on GitHub Releases.",
  installStepsHtml: (releasesUrl: string) => [
    '<a class="text-link" href="/register?next=/dashboard/devices">Create a free ProbeHarbor account</a> and connect at least one probe (or the demo pull feed).',
    `<a class="text-link" href="${releasesUrl}" target="_blank" rel="noreferrer">Download Bay Buddy</a> for your OS and install.`,
    "Click <strong>Connect</strong> in Bay Buddy, sign in on probeharbor.dev in the browser, and return to the desktop window when the handoff finishes.",
    'Optional: <a class="text-link" href="/claim-puck">claim a Claim puck</a> (RP2040-Zero) from the connected window to light bay moods on the desk.',
  ],
  openReleases: "Open releases",
  faqTitle: "Bay Buddy FAQ",
  faqLede: "Desktop companion answers: download, connect, and what stays on the web dashboard.",
  backToApps: "← All companion apps",
};

type BayBuddyMessages = typeof en;

const es: BayBuddyMessages = {
  breadcrumbHome: "Inicio",
  breadcrumbApps: "Apps",
  kicker: "App complementaria de escritorio",
  lede: (name, brand) =>
    `No es un segundo panel. ${name} muestra el ambiente de un espacio de ProbeHarbor: acogedor, con corriente, tiritando, en pánico, sin conexión o héroe. Los dispositivos, las alertas, el historial y las reclamaciones siguen en ${brand}.`,
  download: "Descargar la última versión",
  freeAccount: "Cuenta gratuita de ProbeHarbor",
  sourceOnGithub: "Código en GitHub",
  showsTitle: "Qué muestra",
  doesHtml:
    "<strong>Sí hace:</strong> muestra el estado del garaje en vivo a partir de tus sondas actuales, el margen hasta la congelación, el tiempo hasta la congelación y las señales de puertas y fugas, después de pulsar Connect con la misma cuenta de ProbeHarbor.",
  doesNotHtml:
    '<strong>No hace:</strong> sustituir Overview, Devices, Alerts, History ni el paquete para reclamaciones. Todo eso sigue en probeharbor.dev (y en la <a class="text-link" href="/android">app complementaria de Android</a> / <a class="text-link" href="/about/install-pwa">PWA</a>).',
  installTitle: "Instalación",
  installCopy:
    "AppImage / deb / rpm para Linux, MSI para Windows y DMG para macOS se publican en GitHub Releases.",
  installStepsHtml: (releasesUrl) => [
    '<a class="text-link" href="/register?next=/dashboard/devices">Crea una cuenta gratuita de ProbeHarbor</a> y conecta al menos una sonda (o el feed de demostración).',
    `<a class="text-link" href="${releasesUrl}" target="_blank" rel="noreferrer">Descarga Bay Buddy</a> para tu sistema operativo e instálalo.`,
    "Haz clic en <strong>Connect</strong> en Bay Buddy, inicia sesión en probeharbor.dev en el navegador y vuelve a la ventana de escritorio cuando termine el traspaso.",
    'Opcional: <a class="text-link" href="/claim-puck">vincula un Claim puck</a> (RP2040-Zero) desde la ventana conectada para que el estado del espacio se ilumine en tu mesa.',
  ],
  openReleases: "Ver versiones",
  faqTitle: "Preguntas frecuentes sobre Bay Buddy",
  faqLede: "Respuestas sobre la app de escritorio: descarga, conexión y qué sigue en el panel web.",
  backToApps: "← Todas las apps complementarias",
};

const fr: BayBuddyMessages = {
  breadcrumbHome: "Accueil",
  breadcrumbApps: "Applications",
  kicker: "Compagnon de bureau",
  lede: (name, brand) =>
    `Pas un second tableau de bord. ${name} montre l’ambiance d’un espace ProbeHarbor : douillet, courant d’air, frissons, panique, hors ligne ou héros. Appareils, alertes, historique et sinistres restent sur ${brand}.`,
  download: "Télécharger la dernière version",
  freeAccount: "Compte ProbeHarbor gratuit",
  sourceOnGithub: "Code source sur GitHub",
  showsTitle: "Ce qu’il affiche",
  doesHtml:
    "<strong>Il fait :</strong> afficher l’humeur du garage en direct à partir de vos sondes existantes, la marge avant le gel, le temps restant avant le gel et les signaux de porte et de fuite, une fois connecté (Connect) avec le même compte ProbeHarbor.",
  doesNotHtml:
    '<strong>Il ne fait pas :</strong> remplacer Overview, Devices, Alerts, History ni le dossier de sinistre. Tout cela reste sur probeharbor.dev (et dans l’<a class="text-link" href="/android">application compagnon Android</a> / la <a class="text-link" href="/about/install-pwa">PWA</a>).',
  installTitle: "Installation",
  installCopy:
    "Les paquets Linux AppImage / deb / rpm, Windows MSI et macOS DMG sont publiés sur GitHub Releases.",
  installStepsHtml: (releasesUrl) => [
    '<a class="text-link" href="/register?next=/dashboard/devices">Créez un compte ProbeHarbor gratuit</a> et connectez au moins une sonde (ou le flux de démonstration).',
    `<a class="text-link" href="${releasesUrl}" target="_blank" rel="noreferrer">Téléchargez Bay Buddy</a> pour votre système et installez-le.`,
    "Cliquez sur <strong>Connect</strong> dans Bay Buddy, connectez-vous sur probeharbor.dev dans le navigateur, puis revenez à la fenêtre de l’application une fois le transfert terminé.",
    'Facultatif : <a class="text-link" href="/claim-puck">associez un Claim puck</a> (RP2040-Zero) depuis la fenêtre connectée pour afficher l’humeur de l’espace en lumière sur votre bureau.',
  ],
  openReleases: "Voir les versions",
  faqTitle: "FAQ Bay Buddy",
  faqLede: "Questions sur l’application de bureau : téléchargement, connexion et ce qui reste sur le tableau de bord web.",
  backToApps: "← Toutes les applications compagnons",
};

const de: BayBuddyMessages = {
  breadcrumbHome: "Start",
  breadcrumbApps: "Apps",
  kicker: "Desktop-Begleit-App",
  lede: (name, brand) =>
    `Kein zweites Dashboard. ${name} zeigt die Stimmung eines ProbeHarbor-Raums: gemütlich, zugig, bibbernd, Panik, offline oder Held. Geräte, Alarme, Verlauf und Schadensfälle bleiben bei ${brand}.`,
  download: "Neueste Version herunterladen",
  freeAccount: "Kostenloses ProbeHarbor-Konto",
  sourceOnGithub: "Quellcode auf GitHub",
  showsTitle: "Was die App zeigt",
  doesHtml:
    "<strong>Kann:</strong> die Live-Stimmung der Garage aus deinen vorhandenen Fühlern, den Abstand zur Frostgrenze, die Zeit bis zum Frost sowie Tür- und Lecksignale anzeigen, sobald du dich per Connect mit demselben ProbeHarbor-Konto verbunden hast.",
  doesNotHtml:
    '<strong>Kann nicht:</strong> Übersicht, Geräte, Alarme, Verlauf oder das Nachweispaket ersetzen. Die bleiben auf probeharbor.dev (und in der <a class="text-link" href="/android">Android-Begleit-App</a> / <a class="text-link" href="/about/install-pwa">PWA</a>).',
  installTitle: "Installation",
  installCopy:
    "Linux AppImage / deb / rpm, Windows MSI und macOS DMG stehen auf GitHub Releases bereit.",
  installStepsHtml: (releasesUrl) => [
    '<a class="text-link" href="/register?next=/dashboard/devices">Kostenloses ProbeHarbor-Konto anlegen</a> und mindestens einen Fühler (oder den Demo-Feed) verbinden.',
    `<a class="text-link" href="${releasesUrl}" target="_blank" rel="noreferrer">Bay Buddy herunterladen</a> und für dein Betriebssystem installieren.`,
    "In Bay Buddy auf <strong>Connect</strong> klicken, dich im Browser auf probeharbor.dev anmelden und nach der Übergabe zum Desktop-Fenster zurückkehren.",
    'Optional: Im verbundenen Fenster <a class="text-link" href="/claim-puck">einen Claim Puck koppeln</a> (RP2040-Zero), der die Raumstimmung auf dem Schreibtisch aufleuchten lässt.',
  ],
  openReleases: "Releases öffnen",
  faqTitle: "Bay-Buddy-FAQ",
  faqLede: "Antworten zur Desktop-App: Download, Verbindung und was im Web-Dashboard bleibt.",
  backToApps: "← Alle Begleit-Apps",
};

const ptBr: BayBuddyMessages = {
  breadcrumbHome: "Início",
  breadcrumbApps: "Apps",
  kicker: "App complementar de desktop",
  lede: (name, brand) =>
    `Não é um segundo painel. O ${name} mostra o clima de um espaço no ProbeHarbor: aconchegante, com corrente de ar, tremendo, em pânico, offline ou herói. Dispositivos, alertas, histórico e sinistros continuam no ${brand}.`,
  download: "Baixar a versão mais recente",
  freeAccount: "Conta gratuita no ProbeHarbor",
  sourceOnGithub: "Código no GitHub",
  showsTitle: "O que ele mostra",
  doesHtml:
    "<strong>Faz:</strong> mostra o humor da garagem ao vivo a partir das suas sondas atuais, a margem até o congelamento, o tempo até o congelamento e os sinais de porta e vazamento, depois que você clica em Connect com a mesma conta ProbeHarbor.",
  doesNotHtml:
    '<strong>Não faz:</strong> substituir Overview, Devices, Alerts, History nem o pacote para sinistros. Eles continuam em probeharbor.dev (e no <a class="text-link" href="/android">app complementar para Android</a> / <a class="text-link" href="/about/install-pwa">PWA</a>).',
  installTitle: "Instalação",
  installCopy:
    "AppImage / deb / rpm para Linux, MSI para Windows e DMG para macOS são publicados no GitHub Releases.",
  installStepsHtml: (releasesUrl) => [
    '<a class="text-link" href="/register?next=/dashboard/devices">Crie uma conta gratuita no ProbeHarbor</a> e conecte pelo menos uma sonda (ou o feed de demonstração).',
    `<a class="text-link" href="${releasesUrl}" target="_blank" rel="noreferrer">Baixe o Bay Buddy</a> para o seu sistema e instale.`,
    "Clique em <strong>Connect</strong> no Bay Buddy, entre em probeharbor.dev no navegador e volte para a janela do app quando a transferência terminar.",
    'Opcional: <a class="text-link" href="/claim-puck">vincule um Claim puck</a> (RP2040-Zero) pela janela conectada para acender o humor do espaço na sua mesa.',
  ],
  openReleases: "Ver versões",
  faqTitle: "Perguntas frequentes sobre o Bay Buddy",
  faqLede: "Respostas sobre o app de desktop: download, conexão e o que continua no painel web.",
  backToApps: "← Todos os apps complementares",
};

export const bayBuddyMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

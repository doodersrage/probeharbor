import { defineMessages } from "../../translate";

/**
 * /about/install-pwa body copy. `*Html` keys are trusted inline HTML (English hrefs).
 * Browser menu labels (Install app, Add to Home Screen…) are translated to what the
 * browser shows in that language; dashboard labels stay English (the dashboard is English).
 */
const en = {
  introHtml:
    "ProbeHarbor includes a Progressive Web App manifest and service worker. You can install it like an app on supported browsers for a standalone window, offline shell caching, and Web Push alerts.",
  androidAppHtml:
    'A <strong>native Android app</strong> is also <a href="/android">Android early access on GitHub</a> same account as the web dashboard, without on-phone sensing. On the desktop, <a class="text-link" href="/bay-buddy">Bay Buddy</a> is a glanceable freeze/flood mood companion (not a second dashboard). Prefer a home-screen shortcut today? Follow the Android Chrome steps below, or <a class="text-link" href="/contact?topic=android">ask for a Play launch note</a>.',
  desktopTitle: "Desktop (Chrome / Edge)",
  desktopSteps: [
    "Open the site while signed in.",
    "Look for the install icon in the address bar, or use the browser menu → <strong>Install app</strong>.",
    "Confirm. The app opens without browser chrome and starts at the dashboard.",
  ],
  androidTitle: "Android",
  androidSteps: [
    "Open the site in Chrome.",
    "Tap the menu → <strong>Install app</strong> / <strong>Add to Home screen</strong>.",
  ],
  iosTitle: "iPhone / iPad (Safari)",
  iosIntroHtml:
    "iOS does not support the same Web Push / install APIs as desktop Chrome. You can still add a home-screen shortcut:",
  iosSteps: [
    "Open the site in <strong>Safari</strong> (not Chrome or in-app browsers).",
    "Tap the Share button → <strong>Add to Home Screen</strong>.",
    "Open the icon for a full-screen experience.",
  ],
  iosPushHtml:
    "<strong>Push notifications on iOS</strong> require iOS 16.4+ and installing via Add to Home Screen, then enabling push from the dashboard alert settings (Pro). Results vary by iOS version; email and Discord remain the most reliable channels on Apple devices.",
  afterTitle: "After install",
  afterItems: [
    "Enable browser push from <strong>Dashboard → Alerts</strong> (Pro).",
    "Keep the service worker updated by visiting the site occasionally.",
    "Live readings still need network access; the offline cache only helps the shell and last cached payload.",
  ],
};

type Messages = typeof en;

const es: Messages = {
  introHtml:
    "ProbeHarbor incluye un manifiesto de Progressive Web App y un service worker. En los navegadores compatibles puedes instalarlo como una app para tener una ventana independiente, la interfaz en caché sin conexión y alertas Web Push.",
  androidAppHtml:
    'También hay una <strong>app nativa para Android</strong>: <a href="/android">acceso anticipado para Android en GitHub</a>, con la misma cuenta que el panel web y sin sensores en el teléfono. En el escritorio, <a class="text-link" href="/bay-buddy">Bay Buddy</a> es un compañero que te muestra de un vistazo el estado de congelación e inundación (no es un segundo panel). ¿Prefieres un acceso directo en la pantalla de inicio ya? Sigue los pasos para Chrome en Android que verás abajo o <a class="text-link" href="/contact?topic=android">pide que te avisemos del lanzamiento en Play</a>.',
  desktopTitle: "Escritorio (Chrome / Edge)",
  desktopSteps: [
    "Abre el sitio con la sesión iniciada.",
    "Busca el icono de instalación en la barra de direcciones o usa el menú del navegador → <strong>Instalar app</strong>.",
    "Confirma. La app se abre sin la interfaz del navegador y empieza en el panel.",
  ],
  androidTitle: "Android",
  androidSteps: [
    "Abre el sitio en Chrome.",
    "Toca el menú → <strong>Instalar app</strong> / <strong>Añadir a pantalla de inicio</strong>.",
  ],
  iosTitle: "iPhone / iPad (Safari)",
  iosIntroHtml:
    "iOS no admite las mismas API de Web Push e instalación que Chrome de escritorio. Aun así, puedes añadir un acceso directo a la pantalla de inicio:",
  iosSteps: [
    "Abre el sitio en <strong>Safari</strong> (no en Chrome ni en navegadores integrados en otras apps).",
    "Toca el botón Compartir → <strong>Añadir a pantalla de inicio</strong>.",
    "Abre el icono para usarlo a pantalla completa.",
  ],
  iosPushHtml:
    "Las <strong>notificaciones push en iOS</strong> requieren iOS 16.4 o posterior y haber instalado el sitio con Añadir a pantalla de inicio; después hay que activar push en los ajustes de alertas del panel (Pro). Los resultados varían según la versión de iOS; el correo y Discord siguen siendo los canales más fiables en dispositivos Apple.",
  afterTitle: "Después de instalar",
  afterItems: [
    "Activa las notificaciones push del navegador en <strong>Dashboard → Alerts</strong> (Pro).",
    "Visita el sitio de vez en cuando para que el service worker se mantenga actualizado.",
    "Las lecturas en vivo siguen necesitando conexión; la caché sin conexión solo sirve para la interfaz y los últimos datos guardados.",
  ],
};

const fr: Messages = {
  introHtml:
    "ProbeHarbor comprend un manifeste de Progressive Web App et un service worker. Sur les navigateurs compatibles, vous pouvez l’installer comme une application pour profiter d’une fenêtre dédiée, de l’interface en cache hors ligne et des alertes Web Push.",
  androidAppHtml:
    'Une <strong>application Android native</strong> existe aussi : <a href="/android">accès anticipé Android sur GitHub</a>, avec le même compte que le tableau de bord web, sans mesure sur le téléphone. Sur ordinateur, <a class="text-link" href="/bay-buddy">Bay Buddy</a> est un compagnon qui indique d’un coup d’œil l’état gel/inondation (ce n’est pas un second tableau de bord). Vous préférez un raccourci sur l’écran d’accueil dès aujourd’hui ? Suivez les étapes Chrome pour Android ci-dessous, ou <a class="text-link" href="/contact?topic=android">demandez à être prévenu du lancement sur Play</a>.',
  desktopTitle: "Ordinateur (Chrome / Edge)",
  desktopSteps: [
    "Ouvrez le site en étant connecté.",
    "Repérez l’icône d’installation dans la barre d’adresse, ou passez par le menu du navigateur → <strong>Installer l’application</strong>.",
    "Confirmez. L’application s’ouvre sans l’interface du navigateur et démarre sur le tableau de bord.",
  ],
  androidTitle: "Android",
  androidSteps: [
    "Ouvrez le site dans Chrome.",
    "Touchez le menu → <strong>Installer l’application</strong> / <strong>Ajouter à l’écran d’accueil</strong>.",
  ],
  iosTitle: "iPhone / iPad (Safari)",
  iosIntroHtml:
    "iOS ne prend pas en charge les mêmes API Web Push et d’installation que Chrome sur ordinateur. Vous pouvez tout de même ajouter un raccourci sur l’écran d’accueil :",
  iosSteps: [
    "Ouvrez le site dans <strong>Safari</strong> (pas dans Chrome ni dans le navigateur intégré d’une autre app).",
    "Touchez le bouton Partager → <strong>Sur l’écran d’accueil</strong>.",
    "Ouvrez l’icône pour une expérience plein écran.",
  ],
  iosPushHtml:
    "Les <strong>notifications push sur iOS</strong> nécessitent iOS 16.4 ou ultérieur et une installation via Sur l’écran d’accueil, puis l’activation du push dans les réglages d’alerte du tableau de bord (Pro). Les résultats varient selon la version d’iOS ; l’e-mail et Discord restent les canaux les plus fiables sur les appareils Apple.",
  afterTitle: "Après l’installation",
  afterItems: [
    "Activez le push du navigateur dans <strong>Dashboard → Alerts</strong> (Pro).",
    "Revenez sur le site de temps en temps pour que le service worker reste à jour.",
    "Les mesures en direct nécessitent toujours une connexion ; le cache hors ligne ne sert qu’à l’interface et aux dernières données mises en cache.",
  ],
};

const de: Messages = {
  introHtml:
    "ProbeHarbor bringt ein Progressive-Web-App-Manifest und einen Service Worker mit. In unterstützten Browsern kannst du es wie eine App installieren und bekommst ein eigenes Fenster, eine offline zwischengespeicherte Oberfläche und Web-Push-Alarme.",
  androidAppHtml:
    'Außerdem gibt es eine <strong>native Android-App</strong>: <a href="/android">Android-Vorabzugang auf GitHub</a>, mit demselben Konto wie das Web-Dashboard, aber ohne Messung auf dem Handy. Auf dem Desktop ist <a class="text-link" href="/bay-buddy">Bay Buddy</a> ein Begleiter, der dir auf einen Blick die Frost- und Wasserlage zeigt (kein zweites Dashboard). Lieber heute schon eine Verknüpfung auf dem Startbildschirm? Folge unten den Schritten für Chrome unter Android oder <a class="text-link" href="/contact?topic=android">lass dich über den Start im Play Store informieren</a>.',
  desktopTitle: "Desktop (Chrome / Edge)",
  desktopSteps: [
    "Öffne die Website, während du angemeldet bist.",
    "Such das Installationssymbol in der Adressleiste oder nutze das Browsermenü → <strong>App installieren</strong>.",
    "Bestätige. Die App öffnet sich ohne Browserleisten und startet im Dashboard.",
  ],
  androidTitle: "Android",
  androidSteps: [
    "Öffne die Website in Chrome.",
    "Tippe auf das Menü → <strong>App installieren</strong> / <strong>Zum Startbildschirm hinzufügen</strong>.",
  ],
  iosTitle: "iPhone / iPad (Safari)",
  iosIntroHtml:
    "iOS unterstützt nicht dieselben Web-Push- und Installations-APIs wie Chrome auf dem Desktop. Eine Verknüpfung auf dem Home-Bildschirm kannst du trotzdem anlegen:",
  iosSteps: [
    "Öffne die Website in <strong>Safari</strong> (nicht in Chrome oder einem In-App-Browser).",
    "Tippe auf „Teilen“ → <strong>Zum Home-Bildschirm</strong>.",
    "Öffne das Symbol für die Vollbildansicht.",
  ],
  iosPushHtml:
    "<strong>Push-Benachrichtigungen unter iOS</strong> setzen iOS 16.4 oder neuer und die Installation über „Zum Home-Bildschirm“ voraus; danach aktivierst du Push in den Alarmeinstellungen des Dashboards (Pro). Wie gut das klappt, hängt von der iOS-Version ab; E-Mail und Discord bleiben auf Apple-Geräten die zuverlässigsten Kanäle.",
  afterTitle: "Nach der Installation",
  afterItems: [
    "Aktiviere Browser-Push unter <strong>Dashboard → Alerts</strong> (Pro).",
    "Besuche die Website ab und zu, damit der Service Worker aktuell bleibt.",
    "Live-Werte brauchen weiterhin eine Netzverbindung; der Offline-Cache hilft nur für die Oberfläche und die zuletzt zwischengespeicherten Daten.",
  ],
};

const ptBr: Messages = {
  introHtml:
    "O ProbeHarbor inclui um manifesto de Progressive Web App e um service worker. Nos navegadores compatíveis, você pode instalá-lo como um app para ter uma janela própria, a interface em cache para uso offline e alertas Web Push.",
  androidAppHtml:
    'Também existe um <strong>app nativo para Android</strong>: <a href="/android">acesso antecipado para Android no GitHub</a>, com a mesma conta do painel web e sem medição pelo celular. No computador, o <a class="text-link" href="/bay-buddy">Bay Buddy</a> é um companheiro que mostra num relance a situação de congelamento e inundação (não é um segundo painel). Prefere um atalho na tela inicial agora? Siga os passos do Chrome no Android abaixo ou <a class="text-link" href="/contact?topic=android">peça para ser avisado do lançamento na Play Store</a>.',
  desktopTitle: "Computador (Chrome / Edge)",
  desktopSteps: [
    "Abra o site com sua conta conectada.",
    "Procure o ícone de instalação na barra de endereço ou use o menu do navegador → <strong>Instalar app</strong>.",
    "Confirme. O app abre sem a interface do navegador e começa no painel.",
  ],
  androidTitle: "Android",
  androidSteps: [
    "Abra o site no Chrome.",
    "Toque no menu → <strong>Instalar app</strong> / <strong>Adicionar à tela inicial</strong>.",
  ],
  iosTitle: "iPhone / iPad (Safari)",
  iosIntroHtml:
    "O iOS não oferece as mesmas APIs de Web Push e instalação do Chrome no computador. Mesmo assim, você pode adicionar um atalho na tela de início:",
  iosSteps: [
    "Abra o site no <strong>Safari</strong> (não no Chrome nem em navegadores dentro de outros apps).",
    "Toque no botão Compartilhar → <strong>Adicionar à Tela de Início</strong>.",
    "Abra o ícone para usar em tela cheia.",
  ],
  iosPushHtml:
    "As <strong>notificações push no iOS</strong> exigem iOS 16.4 ou superior e instalação via Adicionar à Tela de Início; depois é preciso ativar o push nas configurações de alerta do painel (Pro). Os resultados variam conforme a versão do iOS; e-mail e Discord continuam sendo os canais mais confiáveis em aparelhos Apple.",
  afterTitle: "Depois de instalar",
  afterItems: [
    "Ative o push do navegador em <strong>Dashboard → Alerts</strong> (Pro).",
    "Visite o site de vez em quando para manter o service worker atualizado.",
    "As leituras ao vivo ainda precisam de conexão; o cache offline só ajuda com a interface e os últimos dados guardados.",
  ],
};

export const installPwaMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

import { defineMessages } from "../translate";

/**
 * /android page copy. Keys ending in `Html` hold trusted inline HTML rendered
 * with `set:html`; keep hrefs English (middleware localizes them).
 */
const en = {
  title: "Android app",
  descriptionLive: (brand: string) =>
    `${brand} Android companion on Google Play: live probes, freeze and flood alerts, MFA, and household tools. Phone is not a sensor.`,
  descriptionPwa: (brand: string) =>
    `Use ${brand} on Android via the installable web app. Native Play app is in review. Live probes, freeze and flood alerts. Phone is not a sensor.`,
  breadcrumbHome: "Home",
  breadcrumbApps: "Apps",
  breadcrumbAndroid: "Android app",
  schemaName: (brand: string) => `${brand} for Android`,
  kickerLive: "Google Play",
  kickerPwa: "Works today · native app next",
  heading: "ProbeHarbor for Android",
  ledeLive:
    "Native companion on Google Play, live readings, history, freeze/flood alerts, devices, MFA, and household tools for your ProbeHarbor account.",
  ledePwa:
    "Use ProbeHarbor on Android today with the installable web app — same account, live readings, and alerts. The native Play listing is in review; GitHub build/sideload is optional for early testers.",
  getOnPlay: "Get it on Google Play",
  installPwa: "Install the web app (PWA)",
  githubSideload: "GitHub · build or sideload",
  sourceOnGithub: "Source on GitHub",
  requestLaunchNote: "Request Play launch note",
  imageAlt: (brand: string) =>
    `${brand} lifestyle photo: checking probe readings on phone and laptop beside a DIY install near copper pipes`,
  imageCaption:
    "DIY install vibe: phone and laptop as companions to your own probes. Screens in this illustration are stylized, not a product screenshot.",
  phoneTitle: "What the phone does (and does not)",
  doesHtml:
    "<strong>Does:</strong> sign in to your ProbeHarbor account, show live curves, history, and the same forecast-backed time-to-freeze clock as Overview, manage alerts/devices/household settings, and receive freeze/flood push via Firebase Cloud Messaging.",
  doesNotHtml:
    "<strong>Does not:</strong> read temperature from the handset. Your ESP/Arduino (or JSON feeds) keep posting to probeharbor.dev; the app is a client over HTTPS.",
  bayBuddyNoteHtml:
    'Want a desktop glance instead? <a class="text-link" href="/bay-buddy">Bay Buddy</a> shows freeze and flood moods for one space without opening the full dashboard.',
  playTitle: "Google Play",
  playCopy:
    "Install from the Play Store with the same ProbeHarbor account you use on the web. Push alerts use Firebase Cloud Messaging on Android and are on every plan.",
  openInPlay: "Open in Google Play",
  pwaTitle: "Use Android today (PWA)",
  pwaCopy:
    "Install probeharbor.dev from Chrome — home screen icon, live readings, and alerts on your existing account. Native Play listing is next; GitHub build/sideload stays optional for early testers.",
  pwaSteps: "PWA install steps",
  githubRepo: "GitHub · probeharbor-android",
  pwaListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Create a free ProbeHarbor account</a> and connect at least one probe.',
    "Install the PWA (or build/sideload the native app) and sign in with the same credentials.",
    'Enable push alerts in <a class="text-link" href="/dashboard/alerts">Alert settings</a> for Firebase freeze notifications when the native app is installed.',
  ],
  pendingTitle: "While Play review is pending",
  pendingCopy:
    "You already have a full phone experience via the PWA. The native app will attach to the same account when the listing goes live.",
  pendingListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Create a free account</a> and connect a push device or HTTPS feed.',
    'Set freeze thresholds under <a class="text-link" href="/dashboard/alerts">Alert settings</a> (email, push, and chat on every plan; SMS on Pro).',
    'On Android Chrome, <a class="text-link" href="/about/install-pwa">install the PWA</a> for a home-screen shortcut and optional browser Web Push.',
    'Prefer a launch email? <a class="text-link" href="/contact?topic=android">Tell us you’re waiting on Play</a> we read every message.',
  ],
  deepLinksHtml:
    "Deep links stay aligned with the web app (<code>/dashboard</code>, alerts, household) so the native client and PWA feel familiar.",
  ossTitle: "Open source",
  ossHtml: (repo: string) =>
    `App repository: <a class="text-link" href="${repo}" target="_blank" rel="noreferrer">probeharbor-android</a> · Privacy: <a class="text-link" href="/privacy">how Android push tokens are handled</a> · API: <a class="text-link" href="/docs/api">HTTP reference</a>`,
  faqLede: "Straight answers for Play reviewers and homeowners waiting on the listing.",
  backToApps: "← All companion apps",
};

type AndroidMessages = typeof en;

const es: AndroidMessages = {
  title: "App para Android",
  descriptionLive: (brand) =>
    `App de ${brand} para Android en Google Play: sondas en vivo, alertas de congelación e inundación, MFA y herramientas del hogar. El móvil no es un sensor.`,
  descriptionPwa: (brand) =>
    `Usa ${brand} en Android con la app web instalable; la nativa está en revisión en Play. Sondas en vivo, alertas de helada e inundación. El móvil no es sensor.`,
  breadcrumbHome: "Inicio",
  breadcrumbApps: "Apps",
  breadcrumbAndroid: "App para Android",
  schemaName: (brand) => `${brand} para Android`,
  kickerLive: "Google Play",
  kickerPwa: "Funciona hoy · app nativa en camino",
  heading: "ProbeHarbor para Android",
  ledeLive:
    "App complementaria nativa en Google Play: lecturas en vivo, historial, alertas de congelación/inundación, dispositivos, MFA y herramientas del hogar para tu cuenta de ProbeHarbor.",
  ledePwa:
    "Usa ProbeHarbor en Android hoy mismo con la app web instalable: la misma cuenta, lecturas en vivo y alertas. La ficha nativa de Play está en revisión; compilar o instalar manualmente desde GitHub es opcional para quienes quieran probarla antes.",
  getOnPlay: "Descárgala en Google Play",
  installPwa: "Instala la app web (PWA)",
  githubSideload: "GitHub · compilar o instalar manualmente",
  sourceOnGithub: "Código en GitHub",
  requestLaunchNote: "Avísame del lanzamiento en Play",
  imageAlt: (brand) =>
    `Foto de ambiente de ${brand}: consultando lecturas de sondas en el móvil y el portátil junto a una instalación casera cerca de tuberías de cobre`,
  imageCaption:
    "Ambiente de instalación casera: el móvil y el portátil acompañan a tus propias sondas. Las pantallas de esta ilustración son estilizadas, no una captura del producto.",
  phoneTitle: "Qué hace el móvil (y qué no)",
  doesHtml:
    "<strong>Sí hace:</strong> inicia sesión en tu cuenta de ProbeHarbor, muestra curvas en vivo, el historial y la misma cuenta atrás hasta la congelación basada en el pronóstico que verás en Overview, gestiona alertas, dispositivos y ajustes del hogar, y recibe notificaciones push de congelación/inundación mediante Firebase Cloud Messaging.",
  doesNotHtml:
    "<strong>No hace:</strong> medir la temperatura con el teléfono. Tu ESP/Arduino (o tus feeds JSON) siguen enviando datos a probeharbor.dev; la app es un cliente que se conecta por HTTPS.",
  bayBuddyNoteHtml:
    '¿Prefieres un vistazo desde el escritorio? <a class="text-link" href="/bay-buddy">Bay Buddy</a> muestra el estado de congelación e inundación de un espacio sin abrir el panel completo.',
  playTitle: "Google Play",
  playCopy:
    "Instálala desde Play Store con la misma cuenta de ProbeHarbor que usas en la web. En Android, las alertas push usan Firebase Cloud Messaging y están incluidas en todos los planes.",
  openInPlay: "Abrir en Google Play",
  pwaTitle: "Usa Android hoy (PWA)",
  pwaCopy:
    "Instala probeharbor.dev desde Chrome: icono en la pantalla de inicio, lecturas en vivo y alertas con tu cuenta actual. La ficha nativa de Play llega pronto; compilar o instalar manualmente desde GitHub sigue siendo opcional para quienes quieran probarla antes.",
  pwaSteps: "Pasos para instalar la PWA",
  githubRepo: "GitHub · probeharbor-android",
  pwaListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Crea una cuenta gratuita de ProbeHarbor</a> y conecta al menos una sonda.',
    "Instala la PWA (o compila e instala manualmente la app nativa) e inicia sesión con las mismas credenciales.",
    'Activa las alertas push en <a class="text-link" href="/dashboard/alerts">Ajustes de alertas</a> para recibir avisos de congelación por Firebase cuando tengas instalada la app nativa.',
  ],
  pendingTitle: "Mientras se revisa en Play",
  pendingCopy:
    "Ya tienes una experiencia completa en el móvil con la PWA. La app nativa se vinculará a la misma cuenta cuando la ficha esté publicada.",
  pendingListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Crea una cuenta gratuita</a> y conecta un dispositivo que envíe datos o un feed HTTPS.',
    'Define los umbrales de congelación en <a class="text-link" href="/dashboard/alerts">Ajustes de alertas</a> (correo, push y chat en todos los planes; SMS en Pro).',
    'En Chrome para Android, <a class="text-link" href="/about/install-pwa">instala la PWA</a> para tener un acceso directo en la pantalla de inicio y, si quieres, Web Push en el navegador.',
    '¿Prefieres un correo cuando se lance? <a class="text-link" href="/contact?topic=android">Cuéntanos que esperas la versión de Play</a>: leemos todos los mensajes.',
  ],
  deepLinksHtml:
    "Los enlaces profundos coinciden con los de la app web (<code>/dashboard</code>, alertas, hogar), así que el cliente nativo y la PWA te resultarán familiares.",
  ossTitle: "Código abierto",
  ossHtml: (repo) =>
    `Repositorio de la app: <a class="text-link" href="${repo}" target="_blank" rel="noreferrer">probeharbor-android</a> · Privacidad: <a class="text-link" href="/privacy">cómo se gestionan los tokens push de Android</a> · API: <a class="text-link" href="/docs/api">referencia HTTP</a>`,
  faqLede: "Respuestas directas para los revisores de Play y para quienes esperan la ficha.",
  backToApps: "← Todas las apps complementarias",
};

const fr: AndroidMessages = {
  title: "Application Android",
  descriptionLive: (brand) =>
    `${brand} pour Android sur Google Play : sondes en direct, alertes gel et inondation, MFA et outils du foyer. Le téléphone n’est pas un capteur.`,
  descriptionPwa: (brand) =>
    `${brand} sur Android via l’app web installable (app Play en examen) : sondes en direct, alertes gel et inondation. Le téléphone n’est pas un capteur.`,
  breadcrumbHome: "Accueil",
  breadcrumbApps: "Applications",
  breadcrumbAndroid: "Application Android",
  schemaName: (brand) => `${brand} pour Android`,
  kickerLive: "Google Play",
  kickerPwa: "Disponible aujourd’hui · app native à venir",
  heading: "ProbeHarbor pour Android",
  ledeLive:
    "Application compagnon native sur Google Play : relevés en direct, historique, alertes gel/inondation, appareils, MFA et outils du foyer pour votre compte ProbeHarbor.",
  ledePwa:
    "Utilisez ProbeHarbor sur Android dès aujourd’hui avec l’application web installable : même compte, relevés en direct et alertes. La fiche native sur Play est en cours d’examen ; la compilation ou l’installation manuelle depuis GitHub reste possible pour les premiers testeurs.",
  getOnPlay: "Disponible sur Google Play",
  installPwa: "Installer l’application web (PWA)",
  githubSideload: "GitHub · compiler ou installer manuellement",
  sourceOnGithub: "Code source sur GitHub",
  requestLaunchNote: "Être prévenu du lancement sur Play",
  imageAlt: (brand) =>
    `Photo d’ambiance ${brand} : consultation des relevés de sondes sur téléphone et ordinateur portable à côté d’une installation maison près de tuyaux en cuivre`,
  imageCaption:
    "Ambiance installation maison : le téléphone et l’ordinateur portable accompagnent vos propres sondes. Les écrans de cette illustration sont stylisés, ce n’est pas une capture du produit.",
  phoneTitle: "Ce que fait le téléphone (et ce qu’il ne fait pas)",
  doesHtml:
    "<strong>Il fait :</strong> se connecter à votre compte ProbeHarbor, afficher les courbes en direct, l’historique et le même compte à rebours avant le gel, basé sur les prévisions, que dans Overview, gérer les alertes, les appareils et les réglages du foyer, et recevoir les notifications push gel/inondation via Firebase Cloud Messaging.",
  doesNotHtml:
    "<strong>Il ne fait pas :</strong> mesurer la température avec le téléphone. Votre ESP/Arduino (ou vos flux JSON) continue d’envoyer ses données à probeharbor.dev ; l’application est un client qui passe par HTTPS.",
  bayBuddyNoteHtml:
    'Vous préférez un coup d’œil depuis l’ordinateur ? <a class="text-link" href="/bay-buddy">Bay Buddy</a> affiche l’état gel et inondation d’un espace sans ouvrir le tableau de bord complet.',
  playTitle: "Google Play",
  playCopy:
    "Installez-la depuis le Play Store avec le même compte ProbeHarbor que sur le web. Sur Android, les alertes push passent par Firebase Cloud Messaging et sont incluses dans toutes les formules.",
  openInPlay: "Ouvrir dans Google Play",
  pwaTitle: "Android dès aujourd’hui (PWA)",
  pwaCopy:
    "Installez probeharbor.dev depuis Chrome : icône sur l’écran d’accueil, relevés en direct et alertes sur votre compte existant. La fiche native sur Play arrive ; la compilation ou l’installation manuelle depuis GitHub reste facultative pour les premiers testeurs.",
  pwaSteps: "Étapes d’installation de la PWA",
  githubRepo: "GitHub · probeharbor-android",
  pwaListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Créez un compte ProbeHarbor gratuit</a> et connectez au moins une sonde.',
    "Installez la PWA (ou compilez et installez manuellement l’app native) et connectez-vous avec les mêmes identifiants.",
    'Activez les alertes push dans les <a class="text-link" href="/dashboard/alerts">réglages des alertes</a> pour recevoir les notifications de gel Firebase une fois l’app native installée.',
  ],
  pendingTitle: "En attendant la validation sur Play",
  pendingCopy:
    "La PWA vous offre déjà une expérience complète sur téléphone. L’app native se rattachera au même compte dès la mise en ligne de la fiche.",
  pendingListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Créez un compte gratuit</a> et connectez un appareil qui envoie ses données ou un flux HTTPS.',
    'Définissez les seuils de gel dans les <a class="text-link" href="/dashboard/alerts">réglages des alertes</a> (e-mail, push et messagerie dans toutes les formules ; SMS avec Pro).',
    'Dans Chrome sur Android, <a class="text-link" href="/about/install-pwa">installez la PWA</a> pour un raccourci sur l’écran d’accueil et, si vous le souhaitez, le Web Push du navigateur.',
    'Vous préférez un e-mail au lancement ? <a class="text-link" href="/contact?topic=android">Dites-nous que vous attendez la version Play</a> : nous lisons tous les messages.',
  ],
  deepLinksHtml:
    "Les liens profonds suivent ceux de l’application web (<code>/dashboard</code>, alertes, foyer) : le client natif et la PWA vous sembleront familiers.",
  ossTitle: "Open source",
  ossHtml: (repo) =>
    `Dépôt de l’application : <a class="text-link" href="${repo}" target="_blank" rel="noreferrer">probeharbor-android</a> · Confidentialité : <a class="text-link" href="/privacy">traitement des jetons push Android</a> · API : <a class="text-link" href="/docs/api">référence HTTP</a>`,
  faqLede: "Des réponses claires pour les examinateurs Play et les particuliers qui attendent la fiche.",
  backToApps: "← Toutes les applications compagnons",
};

const de: AndroidMessages = {
  title: "Android-App",
  descriptionLive: (brand) =>
    `${brand} Android-Begleit-App bei Google Play: Live-Fühler, Frost- und Wasseralarme, MFA und Haushaltsfunktionen. Das Handy ist kein Sensor.`,
  descriptionPwa: (brand) =>
    `Nutze ${brand} auf Android per installierbarer Web-App; die native Play-App wird geprüft. Live-Fühler, Frost- und Wasseralarme. Das Handy ist kein Sensor.`,
  breadcrumbHome: "Start",
  breadcrumbApps: "Apps",
  breadcrumbAndroid: "Android-App",
  schemaName: (brand) => `${brand} für Android`,
  kickerLive: "Google Play",
  kickerPwa: "Funktioniert schon heute · native App folgt",
  heading: "ProbeHarbor für Android",
  ledeLive:
    "Native Begleit-App bei Google Play: Live-Werte, Verlauf, Frost- und Wasseralarme, Geräte, MFA und Haushaltsfunktionen für dein ProbeHarbor-Konto.",
  ledePwa:
    "Nutze ProbeHarbor schon heute auf Android mit der installierbaren Web-App – gleiches Konto, Live-Werte und Alarme. Der native Play-Eintrag wird gerade geprüft; Selbst-Bauen oder Sideloading über GitHub ist optional für frühe Tester.",
  getOnPlay: "Jetzt bei Google Play",
  installPwa: "Web-App (PWA) installieren",
  githubSideload: "GitHub · selbst bauen oder sideloaden",
  sourceOnGithub: "Quellcode auf GitHub",
  requestLaunchNote: "Bei Play-Start benachrichtigen",
  imageAlt: (brand) =>
    `${brand}-Stimmungsfoto: Fühlerwerte auf Handy und Laptop neben einer Eigenbau-Installation an Kupferrohren prüfen`,
  imageCaption:
    "Eigenbau-Stimmung: Handy und Laptop als Begleiter deiner eigenen Fühler. Die Bildschirme in dieser Illustration sind stilisiert und kein Produkt-Screenshot.",
  phoneTitle: "Was das Handy kann (und was nicht)",
  doesHtml:
    "<strong>Kann:</strong> sich bei deinem ProbeHarbor-Konto anmelden, Live-Kurven, den Verlauf und denselben prognosebasierten Countdown bis zum Frost wie in der Übersicht anzeigen, Alarme, Geräte und Haushaltseinstellungen verwalten und Frost- und Wasser-Pushmeldungen über Firebase Cloud Messaging empfangen.",
  doesNotHtml:
    "<strong>Kann nicht:</strong> die Temperatur mit dem Handy messen. Dein ESP/Arduino (oder deine JSON-Feeds) senden weiterhin an probeharbor.dev; die App ist ein Client über HTTPS.",
  bayBuddyNoteHtml:
    'Lieber ein kurzer Blick am Desktop? <a class="text-link" href="/bay-buddy">Bay Buddy</a> zeigt Frost- und Wasser-Stimmungen für einen Raum, ohne das volle Dashboard zu öffnen.',
  playTitle: "Google Play",
  playCopy:
    "Installiere die App aus dem Play Store mit demselben ProbeHarbor-Konto, das du im Web nutzt. Push-Alarme laufen auf Android über Firebase Cloud Messaging und sind in jedem Tarif enthalten.",
  openInPlay: "In Google Play öffnen",
  pwaTitle: "Android schon heute nutzen (PWA)",
  pwaCopy:
    "Installiere probeharbor.dev aus Chrome – Symbol auf dem Startbildschirm, Live-Werte und Alarme mit deinem bestehenden Konto. Der native Play-Eintrag folgt; Selbst-Bauen oder Sideloading über GitHub bleibt optional für frühe Tester.",
  pwaSteps: "PWA-Installationsschritte",
  githubRepo: "GitHub · probeharbor-android",
  pwaListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Kostenloses ProbeHarbor-Konto anlegen</a> und mindestens einen Fühler verbinden.',
    "Die PWA installieren (oder die native App selbst bauen bzw. sideloaden) und mit denselben Zugangsdaten anmelden.",
    'Push-Alarme in den <a class="text-link" href="/dashboard/alerts">Alarmeinstellungen</a> aktivieren, um Frostmeldungen über Firebase zu erhalten, sobald die native App installiert ist.',
  ],
  pendingTitle: "Solange die Play-Prüfung läuft",
  pendingCopy:
    "Mit der PWA hast du schon jetzt den vollen Funktionsumfang auf dem Handy. Die native App verbindet sich mit demselben Konto, sobald der Eintrag live ist.",
  pendingListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Kostenloses Konto anlegen</a> und ein sendendes Gerät oder einen HTTPS-Feed verbinden.',
    'Frostschwellen in den <a class="text-link" href="/dashboard/alerts">Alarmeinstellungen</a> festlegen (E-Mail, Push und Chat in jedem Tarif; SMS mit Pro).',
    'In Chrome auf Android <a class="text-link" href="/about/install-pwa">die PWA installieren</a> – für eine Verknüpfung auf dem Startbildschirm und optional Web Push im Browser.',
    'Lieber eine E-Mail zum Start? <a class="text-link" href="/contact?topic=android">Sag uns, dass du auf die Play-Version wartest</a> – wir lesen jede Nachricht.',
  ],
  deepLinksHtml:
    "Deep Links entsprechen denen der Web-App (<code>/dashboard</code>, Alarme, Haushalt), damit sich nativer Client und PWA vertraut anfühlen.",
  ossTitle: "Open Source",
  ossHtml: (repo) =>
    `App-Repository: <a class="text-link" href="${repo}" target="_blank" rel="noreferrer">probeharbor-android</a> · Datenschutz: <a class="text-link" href="/privacy">so werden Android-Push-Tokens behandelt</a> · API: <a class="text-link" href="/docs/api">HTTP-Referenz</a>`,
  faqLede: "Klare Antworten für Play-Prüfer und Hausbesitzer, die auf den Eintrag warten.",
  backToApps: "← Alle Begleit-Apps",
};

const ptBr: AndroidMessages = {
  title: "App para Android",
  descriptionLive: (brand) =>
    `${brand} para Android no Google Play: sondas ao vivo, alertas de congelamento e alagamento, MFA e ferramentas da casa. O celular não é um sensor.`,
  descriptionPwa: (brand) =>
    `${brand} no Android pelo app web instalável (o nativo está em análise no Play): sondas ao vivo, alertas de congelamento e alagamento. O celular não é sensor.`,
  breadcrumbHome: "Início",
  breadcrumbApps: "Apps",
  breadcrumbAndroid: "App para Android",
  schemaName: (brand) => `${brand} para Android`,
  kickerLive: "Google Play",
  kickerPwa: "Funciona hoje · app nativo a caminho",
  heading: "ProbeHarbor para Android",
  ledeLive:
    "App complementar nativo no Google Play: leituras ao vivo, histórico, alertas de congelamento/alagamento, dispositivos, MFA e ferramentas da casa para sua conta ProbeHarbor.",
  ledePwa:
    "Use o ProbeHarbor no Android hoje mesmo com o app web instalável: mesma conta, leituras ao vivo e alertas. A página nativa no Play está em análise; compilar ou instalar manualmente pelo GitHub é opcional para quem quer testar antes.",
  getOnPlay: "Disponível no Google Play",
  installPwa: "Instale o app web (PWA)",
  githubSideload: "GitHub · compilar ou instalar manualmente",
  sourceOnGithub: "Código no GitHub",
  requestLaunchNote: "Quero ser avisado do lançamento no Play",
  imageAlt: (brand) =>
    `Foto ilustrativa do ${brand}: conferindo leituras das sondas no celular e no notebook ao lado de uma instalação caseira perto de canos de cobre`,
  imageCaption:
    "Clima de instalação caseira: celular e notebook como companheiros das suas próprias sondas. As telas desta ilustração são estilizadas, não uma captura de tela do produto.",
  phoneTitle: "O que o celular faz (e o que não faz)",
  doesHtml:
    "<strong>Faz:</strong> entra na sua conta ProbeHarbor, mostra curvas ao vivo, o histórico e a mesma contagem regressiva até o congelamento baseada na previsão que aparece em Overview, gerencia alertas, dispositivos e configurações da casa, e recebe notificações push de congelamento/alagamento pelo Firebase Cloud Messaging.",
  doesNotHtml:
    "<strong>Não faz:</strong> medir a temperatura pelo aparelho. Seu ESP/Arduino (ou seus feeds JSON) continua enviando dados para probeharbor.dev; o app é um cliente via HTTPS.",
  bayBuddyNoteHtml:
    'Prefere uma olhada rápida no computador? O <a class="text-link" href="/bay-buddy">Bay Buddy</a> mostra o humor de congelamento e alagamento de um espaço sem abrir o painel completo.',
  playTitle: "Google Play",
  playCopy:
    "Instale pela Play Store com a mesma conta ProbeHarbor que você usa na web. No Android, os alertas push usam o Firebase Cloud Messaging e estão em todos os planos.",
  openInPlay: "Abrir no Google Play",
  pwaTitle: "Use no Android hoje (PWA)",
  pwaCopy:
    "Instale o probeharbor.dev pelo Chrome: ícone na tela inicial, leituras ao vivo e alertas na sua conta atual. A página nativa no Play vem a seguir; compilar ou instalar manualmente pelo GitHub continua opcional para quem quer testar antes.",
  pwaSteps: "Passos para instalar o PWA",
  githubRepo: "GitHub · probeharbor-android",
  pwaListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Crie uma conta gratuita no ProbeHarbor</a> e conecte pelo menos uma sonda.',
    "Instale o PWA (ou compile e instale manualmente o app nativo) e entre com as mesmas credenciais.",
    'Ative os alertas push em <a class="text-link" href="/dashboard/alerts">Configurações de alertas</a> para receber avisos de congelamento pelo Firebase quando o app nativo estiver instalado.',
  ],
  pendingTitle: "Enquanto a análise do Play não termina",
  pendingCopy:
    "Você já tem uma experiência completa no celular com o PWA. O app nativo vai se conectar à mesma conta quando a página for publicada.",
  pendingListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Crie uma conta gratuita</a> e conecte um dispositivo que envia dados ou um feed HTTPS.',
    'Defina os limites de congelamento em <a class="text-link" href="/dashboard/alerts">Configurações de alertas</a> (e-mail, push e chat em todos os planos; SMS no Pro).',
    'No Chrome para Android, <a class="text-link" href="/about/install-pwa">instale o PWA</a> para ter um atalho na tela inicial e, se quiser, Web Push no navegador.',
    'Prefere um e-mail no lançamento? <a class="text-link" href="/contact?topic=android">Conte que você está esperando a versão do Play</a>: lemos todas as mensagens.',
  ],
  deepLinksHtml:
    "Os deep links seguem os do app web (<code>/dashboard</code>, alertas, casa), então o cliente nativo e o PWA vão parecer familiares.",
  ossTitle: "Código aberto",
  ossHtml: (repo) =>
    `Repositório do app: <a class="text-link" href="${repo}" target="_blank" rel="noreferrer">probeharbor-android</a> · Privacidade: <a class="text-link" href="/privacy">como os tokens push do Android são tratados</a> · API: <a class="text-link" href="/docs/api">referência HTTP</a>`,
  faqLede: "Respostas diretas para revisores do Play e para quem está esperando a página.",
  backToApps: "← Todos os apps complementares",
};

export const androidMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

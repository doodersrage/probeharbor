import { defineMessages } from "../translate";

/**
 * /demo page copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <code>) rendered with `set:html`; keep hrefs English, middleware localizes them.
 * List arrays follow the page order; hrefs live in the page.
 */
const en = {
  title: "Live probe demo",
  description:
    "Try ProbeHarbor without an account: interactive probe simulator, real live demo probes, and the same freeze/flood alert path your hardware will use.",
  ogImageAlt: "ProbeHarbor live probe temperature curves, no account required",
  breadcrumbHome: "Home",
  breadcrumbDemo: "Live demo",
  schemaName: "ProbeHarbor live probe demo",
  schemaDescription:
    "No-account ProbeHarbor demos: interactive multi-zone probe simulator plus live demo probes on the production ingest path.",
  header: {
    kicker: "Try it (no account)",
    title: "Demos: simulator + live feed",
    lede: "Cause a freeze event in the interactive probe simulator, or watch real demo probes next to outdoor weather: same ingest path your ESP or Arduino will use for freeze and flood alerts.",
    simulator: "Interactive simulator",
    liveReadings: "Live readings",
    connect: "Connect my probes",
  },
  paths: {
    title: "Three ways to try ProbeHarbor",
    lede: "Start with the simulator if you want to feel freeze risk respond to you, then confirm with the live feed and auto-wet flood path.",
    items: [
      {
        label: "Interactive probe simulator",
        text: "Hands-on (best first stop). Tweak door open/closed, sun load, outdoor air, and freeze threshold. Cause a cold snap; watch multi-zone bars and push/pull JSON update.",
      },
      {
        label: "Live demo feed",
        text: "Observational. Real demo probes refresh here on the production ingest path. Best when you want “is this fake?” answered with live numbers.",
      },
      {
        label: "Kit QR onboarding",
        text: "Hardware path. After you create a push device, scan the ingest QR (or print it on a kit label) so firmware can POST temperature, flood, and other sensor kinds without typing the key.",
      },
    ],
  },
  sim: {
    title: "Cause the change: interactive simulator",
    lede: "Presets for cold snap, door draft, and sun load reuse the same Overview space-status helper as production. Open the bay door and watch the door zone diverge from the workbench: that’s why multi-probe placement matters.",
    doorDraft: "Try door draft",
    coldSnap: "Try cold snap",
    openFull: "Open full simulator",
  },
  live: {
    title: "Live demo feed",
    ledeHtml:
      'Real demo probe readings and outdoor weather, not a mockup. Prefer to manipulate variables yourself? <a class="text-link" href="/about/probe-demo">Open the interactive simulator</a>.',
    readingsLabel: "Live demo readings",
    historyNote:
      "Probe curves are the demo shop model run over the past week's real hourly weather; the dashed line is outdoor temperature.",
  },
  screenshotCaption:
    "Same product UI after you connect hardware. Insights with 30-day curves, freeze threshold, and nights-at-risk.",
  freeze: {
    title: "Same data that fires freeze and flood alerts",
    lede: "When a probe crosses your threshold, ProbeHarbor can reach you on email, browser push, Discord, Telegram, Slack, and on Pro, SMS. Wet flood/leak contacts auto-alert on the same stack. Set the line once; test it before the next cold night.",
    channelsLabel: "Alert channels",
    channels: [
      "Email · Discord · Telegram · Slack",
      "Push on every plan",
      "SMS · webhooks on Pro",
      "Leak / flood sensors alert automatically when wet",
    ],
    startFree: "Start free: open Devices",
    story: "Flood/leak story",
    cookbook: "Channel cookbook",
    imageAlt: "ProbeHarbor temperature trend with humidity, dew point, and freeze threshold at 34°F",
  },
  steps: {
    title: "Your kit next",
    ledeHtml:
      'Free account, no credit card, from blank dashboard to a live curve in one sitting. Physical kits can use <a class="text-link" href="/about/kit-qr-onboarding">kit QR onboarding</a> so the ingest URL is a scan away.',
    items: [
      {
        title: "Create a push device",
        copyHtml:
          "Sign up and pick a path on Devices: Home Assistant, ESPHome, or MQTT get a copy-paste snippet; a board gets a pre-filled sketch; no hardware gets a one-click demo feed.",
      },
      {
        title: "POST JSON",
        copyHtml:
          "POST to <code>/api/ingest/&lt;key&gt;</code>. Sensors auto-import on first POST: rename on Devices afterward.",
      },
      {
        title: "Watch Home & set alerts",
        copyHtml:
          "Confirm live values, set a freeze threshold, and know that wet flood/leak contacts auto-alert on the same account.",
      },
    ],
    startFree: "Start free: open Devices",
    guide: "Adding devices guide",
    walkthrough: "Kit QR walkthrough",
  },
  compat: {
    label: "Works with",
    push: "HTTPS JSON push",
    pull: "HTTPS JSON pull",
    mqtt: "MQTT bridge",
    homeAssistant: "Home Assistant (HACS)",
    noteHtml:
      'Keep MQTT on your LAN; mirror to ProbeHarbor over HTTPS for household freeze/flood alerts and history. <a class="text-link" href="/about/mqtt-bridge">MQTT bridge recipe</a>',
  },
  explore: {
    title: "Keep exploring",
    lede: "Already triggered a simulated cold snap? Confirm with the live feed, then try a flood/leak story, map a city, or set up kit QR.",
    items: [
      { label: "Interactive probe simulator", hint: "Primary hands-on demo: door, sun, outdoor, freeze threshold" },
      { label: "Community freeze map", hint: "Opt-in city aggregates, no account required" },
      { label: "Kit QR onboarding", hint: "Create device → scan ingest QR → first POST" },
      { label: "Freeze scenario", hint: "What a 2 a.m. heater failure looks like, alert by alert" },
    ],
  },
  faqLede: "Demo-specific answers, for plans and product basics see Pricing or the homepage FAQ.",
};

type DemoMessages = typeof en;

const es: DemoMessages = {
  title: "Demo de sondas en vivo",
  description:
    "Prueba ProbeHarbor sin cuenta: simulador interactivo de sondas, sondas de demo reales en vivo y la misma ruta de alertas de helada e inundación que usará tu hardware.",
  ogImageAlt: "Curvas de temperatura en vivo de las sondas de ProbeHarbor, sin necesidad de cuenta",
  breadcrumbHome: "Inicio",
  breadcrumbDemo: "Demo en vivo",
  schemaName: "Demo de sondas en vivo de ProbeHarbor",
  schemaDescription:
    "Demos de ProbeHarbor sin cuenta: simulador interactivo de sondas con varias zonas y sondas de demo en vivo sobre la ruta de ingesta de producción.",
  header: {
    kicker: "Pruébalo (sin cuenta)",
    title: "Demos: simulador + feed en vivo",
    lede: "Provoca una helada en el simulador interactivo de sondas o mira sondas de demo reales junto al tiempo exterior: la misma ruta de ingesta que usará tu ESP o Arduino para las alertas de helada e inundación.",
    simulator: "Simulador interactivo",
    liveReadings: "Lecturas en vivo",
    connect: "Conectar mis sondas",
  },
  paths: {
    title: "Tres formas de probar ProbeHarbor",
    lede: "Empieza por el simulador si quieres ver cómo reacciona el riesgo de helada a lo que haces y luego confírmalo con el feed en vivo y la ruta de inundación con sensor mojado automático.",
    items: [
      {
        label: "Simulador interactivo de sondas",
        text: "Práctico (la mejor primera parada). Ajusta la puerta abierta o cerrada, el sol, el aire exterior y el umbral de helada. Provoca una ola de frío y mira cómo se actualizan las barras de cada zona y el JSON push/pull.",
      },
      {
        label: "Feed de demo en vivo",
        text: "Para observar. Sondas de demo reales que se actualizan aquí por la ruta de ingesta de producción. Ideal si quieres responder a “¿esto es falso?” con números en vivo.",
      },
      {
        label: "Alta del kit con QR",
        text: "La ruta del hardware. Después de crear un dispositivo push, escanea el QR de ingesta (o imprímelo en una etiqueta del kit) para que el firmware envíe por POST temperatura, inundación y otros tipos de sensores sin escribir la clave.",
      },
    ],
  },
  sim: {
    title: "Provoca el cambio: simulador interactivo",
    lede: "Los ajustes predefinidos de ola de frío, corriente por la puerta y carga solar usan el mismo cálculo de estado de espacios de Overview que producción. Abre el portón y mira cómo la zona de la puerta se separa del banco de trabajo: por eso importa repartir varias sondas.",
    doorDraft: "Probar corriente por la puerta",
    coldSnap: "Probar ola de frío",
    openFull: "Abrir el simulador completo",
  },
  live: {
    title: "Feed de demo en vivo",
    ledeHtml:
      'Lecturas reales de sondas de demo y tiempo exterior, no una maqueta. ¿Prefieres mover tú las variables? <a class="text-link" href="/about/probe-demo">Abre el simulador interactivo</a>.',
    readingsLabel: "Lecturas de la demo en vivo",
    historyNote:
      "Las curvas de las sondas son el modelo del taller de demo calculado con el tiempo horario real de la última semana; la línea discontinua es la temperatura exterior.",
  },
  screenshotCaption:
    "La misma interfaz del producto cuando conectas tu hardware. Insights con curvas de 30 días, umbral de helada y noches de riesgo.",
  freeze: {
    title: "Los mismos datos que disparan las alertas de helada e inundación",
    lede: "Cuando una sonda cruza tu umbral, ProbeHarbor puede avisarte por correo, push del navegador, Discord, Telegram, Slack y, en Pro, SMS. Los contactos de inundación o fuga avisan automáticamente al mojarse, con la misma infraestructura. Define el límite una vez y pruébalo antes de la próxima noche fría.",
    channelsLabel: "Canales de alerta",
    channels: [
      "Correo · Discord · Telegram · Slack",
      "Push en todos los planes",
      "SMS · webhooks en Pro",
      "Los sensores de fuga o inundación avisan automáticamente al mojarse",
    ],
    startFree: "Empieza gratis: abre Devices",
    story: "Historia de una fuga",
    cookbook: "Recetario de canales",
    imageAlt:
      "Tendencia de temperatura de ProbeHarbor con humedad, punto de rocío y umbral de helada en 1 °C (34 °F)",
  },
  steps: {
    title: "Ahora, tu kit",
    ledeHtml:
      'Cuenta gratis, sin tarjeta, del dashboard vacío a una curva en vivo en una sola sesión. Los kits físicos pueden usar el <a class="text-link" href="/about/kit-qr-onboarding">alta del kit con QR</a>, así la URL de ingesta está a un escaneo.',
    items: [
      {
        title: "Crea un dispositivo push",
        copyHtml:
          "Regístrate y elige una ruta en Devices: Home Assistant, ESPHome o MQTT reciben un fragmento para copiar y pegar; una placa recibe un sketch ya completado; sin hardware tienes un feed de demo con un clic.",
      },
      {
        title: "Envía JSON por POST",
        copyHtml:
          "Haz POST a <code>/api/ingest/&lt;key&gt;</code>. Los sensores se importan solos en el primer POST: luego les cambias el nombre en Devices.",
      },
      {
        title: "Mira Home y configura alertas",
        copyHtml:
          "Confirma los valores en vivo, define un umbral de helada y ten en cuenta que los contactos de inundación o fuga avisan solos al mojarse, en la misma cuenta.",
      },
    ],
    startFree: "Empieza gratis: abre Devices",
    guide: "Guía para añadir dispositivos",
    walkthrough: "Paso a paso del QR del kit",
  },
  compat: {
    label: "Funciona con",
    push: "Push HTTPS JSON",
    pull: "Pull HTTPS JSON",
    mqtt: "Puente MQTT",
    homeAssistant: "Home Assistant (HACS)",
    noteHtml:
      'Mantén MQTT en tu red local y replica a ProbeHarbor por HTTPS para tener alertas de helada e inundación en casa e historial. <a class="text-link" href="/about/mqtt-bridge">Receta del puente MQTT</a>',
  },
  explore: {
    title: "Sigue explorando",
    lede: "¿Ya provocaste una ola de frío simulada? Confírmalo con el feed en vivo y luego lee una historia de fuga, mira tu ciudad en el mapa o configura el QR del kit.",
    items: [
      { label: "Simulador interactivo de sondas", hint: "La demo práctica principal: puerta, sol, exterior, umbral de helada" },
      { label: "Mapa comunitario de heladas", hint: "Datos agregados por ciudad (voluntarios), sin cuenta" },
      { label: "Alta del kit con QR", hint: "Crear dispositivo → escanear QR de ingesta → primer POST" },
      { label: "Escenario de helada", hint: "Cómo se ve, alerta a alerta, un calefactor que falla a las 2 de la madrugada" },
    ],
  },
  faqLede:
    "Respuestas sobre la demo; para planes y lo básico del producto, consulta Precios o las preguntas frecuentes de la página de inicio.",
};

const fr: DemoMessages = {
  title: "Démo des sondes en direct",
  description:
    "Essayez ProbeHarbor sans compte : simulateur de sondes interactif, vraies sondes de démo en direct et le même circuit d’alertes gel/inondation que votre matériel.",
  ogImageAlt: "Courbes de température en direct des sondes ProbeHarbor, sans compte",
  breadcrumbHome: "Accueil",
  breadcrumbDemo: "Démo en direct",
  schemaName: "Démo des sondes en direct ProbeHarbor",
  schemaDescription:
    "Démos ProbeHarbor sans compte : simulateur de sondes multizone interactif et sondes de démo en direct sur le circuit d’ingestion de production.",
  header: {
    kicker: "Essayez (sans compte)",
    title: "Démos : simulateur + flux en direct",
    lede: "Provoquez un épisode de gel dans le simulateur de sondes interactif, ou suivez de vraies sondes de démo à côté de la météo extérieure : le même circuit d’ingestion que votre ESP ou Arduino utilisera pour les alertes gel et inondation.",
    simulator: "Simulateur interactif",
    liveReadings: "Relevés en direct",
    connect: "Connecter mes sondes",
  },
  paths: {
    title: "Trois façons d’essayer ProbeHarbor",
    lede: "Commencez par le simulateur pour voir le risque de gel réagir à vos réglages, puis vérifiez avec le flux en direct et le circuit d’inondation déclenché automatiquement au contact de l’eau.",
    items: [
      {
        label: "Simulateur de sondes interactif",
        text: "Pratique (le meilleur point de départ). Réglez la porte ouverte ou fermée, l’ensoleillement, l’air extérieur et le seuil de gel. Provoquez une vague de froid et regardez les barres de chaque zone et le JSON push/pull se mettre à jour.",
      },
      {
        label: "Flux de démo en direct",
        text: "Pour observer. De vraies sondes de démo se mettent à jour ici via le circuit d’ingestion de production. Idéal pour répondre à « c’est truqué ? » avec des chiffres en direct.",
      },
      {
        label: "Mise en service du kit par QR",
        text: "Le circuit matériel. Après avoir créé un appareil push, scannez le QR d’ingestion (ou imprimez-le sur une étiquette du kit) pour que le firmware envoie par POST température, inondation et autres types de capteurs sans saisir la clé.",
      },
    ],
  },
  sim: {
    title: "Provoquez le changement : simulateur interactif",
    lede: "Les préréglages vague de froid, courant d’air de porte et ensoleillement réutilisent le même calcul d’état des espaces d’Overview qu’en production. Ouvrez la porte du garage et regardez la zone de la porte s’écarter de l’établi : c’est pour cela que placer plusieurs sondes compte.",
    doorDraft: "Essayer le courant d’air",
    coldSnap: "Essayer la vague de froid",
    openFull: "Ouvrir le simulateur complet",
  },
  live: {
    title: "Flux de démo en direct",
    ledeHtml:
      'De vrais relevés de sondes de démo et la météo extérieure, pas une maquette. Vous préférez manipuler les variables vous-même ? <a class="text-link" href="/about/probe-demo">Ouvrez le simulateur interactif</a>.',
    readingsLabel: "Relevés de démo en direct",
    historyNote:
      "Les courbes des sondes sont le modèle de l’atelier de démo appliqué à la météo horaire réelle de la semaine écoulée ; la ligne pointillée est la température extérieure.",
  },
  screenshotCaption:
    "La même interface une fois votre matériel connecté. Insights avec courbes sur 30 jours, seuil de gel et nuits à risque.",
  freeze: {
    title: "Les mêmes données qui déclenchent les alertes gel et inondation",
    lede: "Quand une sonde franchit votre seuil, ProbeHarbor peut vous prévenir par e-mail, notification push du navigateur, Discord, Telegram, Slack et, avec Pro, par SMS. Les contacts d’inondation ou de fuite alertent automatiquement au contact de l’eau, sur la même infrastructure. Fixez le seuil une fois, testez-le avant la prochaine nuit froide.",
    channelsLabel: "Canaux d’alerte",
    channels: [
      "E-mail · Discord · Telegram · Slack",
      "Push sur toutes les offres",
      "SMS · webhooks avec Pro",
      "Les capteurs de fuite ou d’inondation alertent automatiquement au contact de l’eau",
    ],
    startFree: "Commencer gratuitement : ouvrir Devices",
    story: "Histoire d’une fuite",
    cookbook: "Guide des canaux",
    imageAlt:
      "Tendance de température ProbeHarbor avec humidité, point de rosée et seuil de gel à 1 °C (34 °F)",
  },
  steps: {
    title: "À votre kit maintenant",
    ledeHtml:
      'Compte gratuit, sans carte bancaire : d’un tableau de bord vide à une courbe en direct en une seule séance. Les kits physiques peuvent utiliser la <a class="text-link" href="/about/kit-qr-onboarding">mise en service par QR</a> : l’URL d’ingestion est à un scan.',
    items: [
      {
        title: "Créez un appareil push",
        copyHtml:
          "Inscrivez-vous et choisissez un parcours dans Devices : Home Assistant, ESPHome ou MQTT reçoivent un extrait à copier-coller ; une carte reçoit un sketch pré-rempli ; sans matériel, un flux de démo en un clic.",
      },
      {
        title: "Envoyez du JSON en POST",
        copyHtml:
          "Faites un POST vers <code>/api/ingest/&lt;key&gt;</code>. Les capteurs sont importés automatiquement au premier POST : renommez-les ensuite dans Devices.",
      },
      {
        title: "Suivez Home et réglez les alertes",
        copyHtml:
          "Vérifiez les valeurs en direct, fixez un seuil de gel et sachez que les contacts d’inondation ou de fuite alertent automatiquement au contact de l’eau, sur le même compte.",
      },
    ],
    startFree: "Commencer gratuitement : ouvrir Devices",
    guide: "Guide d’ajout d’appareils",
    walkthrough: "Pas-à-pas QR du kit",
  },
  compat: {
    label: "Compatible avec",
    push: "Push HTTPS JSON",
    pull: "Pull HTTPS JSON",
    mqtt: "Passerelle MQTT",
    homeAssistant: "Home Assistant (HACS)",
    noteHtml:
      'Gardez MQTT sur votre réseau local ; répliquez vers ProbeHarbor en HTTPS pour les alertes gel/inondation du foyer et l’historique. <a class="text-link" href="/about/mqtt-bridge">Recette de la passerelle MQTT</a>',
  },
  explore: {
    title: "Continuer l’exploration",
    lede: "Vous avez déjà provoqué une vague de froid simulée ? Vérifiez avec le flux en direct, puis lisez une histoire de fuite, cherchez une ville sur la carte ou configurez le QR du kit.",
    items: [
      { label: "Simulateur de sondes interactif", hint: "La démo pratique principale : porte, soleil, extérieur, seuil de gel" },
      { label: "Carte communautaire du gel", hint: "Agrégats par ville sur participation volontaire, sans compte" },
      { label: "Mise en service du kit par QR", hint: "Créer l’appareil → scanner le QR d’ingestion → premier POST" },
      { label: "Scénario de gel", hint: "Une panne de chauffage à 2 h du matin, alerte par alerte" },
    ],
  },
  faqLede:
    "Réponses propres à la démo ; pour les offres et les bases du produit, consultez Tarifs ou la FAQ de la page d’accueil.",
};

const de: DemoMessages = {
  title: "Live-Fühler-Demo",
  description:
    "Teste ProbeHarbor ohne Konto: interaktiver Fühlersimulator, echte Live-Demofühler und derselbe Frost- und Wasseralarm-Pfad, den deine Hardware nutzt.",
  ogImageAlt: "Live-Temperaturkurven von ProbeHarbor-Fühlern, ohne Konto",
  breadcrumbHome: "Startseite",
  breadcrumbDemo: "Live-Demo",
  schemaName: "ProbeHarbor Live-Fühler-Demo",
  schemaDescription:
    "ProbeHarbor-Demos ohne Konto: interaktiver Mehrzonen-Fühlersimulator plus Live-Demofühler auf dem Ingest-Pfad der Produktion.",
  header: {
    kicker: "Ausprobieren (ohne Konto)",
    title: "Demos: Simulator + Live-Feed",
    lede: "Löse im interaktiven Fühlersimulator einen Frost aus oder beobachte echte Demofühler neben dem Außenwetter: derselbe Ingest-Pfad, über den dein ESP oder Arduino Frost- und Wasseralarme auslöst.",
    simulator: "Interaktiver Simulator",
    liveReadings: "Live-Messwerte",
    connect: "Meine Fühler verbinden",
  },
  paths: {
    title: "Drei Wege, ProbeHarbor auszuprobieren",
    lede: "Fang mit dem Simulator an, wenn du spüren willst, wie das Frostrisiko auf dich reagiert, und prüf es dann mit dem Live-Feed und dem automatischen Nässe-Alarmpfad.",
    items: [
      {
        label: "Interaktiver Fühlersimulator",
        text: "Zum Selbermachen (der beste Einstieg). Stell Tor offen/zu, Sonneneinstrahlung, Außenluft und Frostschwelle ein. Lös eine Kältewelle aus und sieh zu, wie sich die Balken der Zonen und das Push-/Pull-JSON aktualisieren.",
      },
      {
        label: "Live-Demo-Feed",
        text: "Zum Beobachten. Echte Demofühler aktualisieren sich hier über den Ingest-Pfad der Produktion. Ideal, wenn du die Frage „Ist das echt?“ mit Live-Zahlen beantworten willst.",
      },
      {
        label: "Kit-Einrichtung per QR",
        text: "Der Hardware-Weg. Wenn du ein Push-Gerät angelegt hast, scanne den Ingest-QR-Code (oder druck ihn auf ein Kit-Etikett), damit die Firmware Temperatur, Wasser und andere Sensorarten per POST sendet, ohne dass du den Schlüssel eintippst.",
      },
    ],
  },
  sim: {
    title: "Lös die Änderung selbst aus: interaktiver Simulator",
    lede: "Die Voreinstellungen Kältewelle, Zugluft am Tor und Sonneneinstrahlung nutzen dieselbe Raumstatus-Logik von Overview wie die Produktion. Öffne das Garagentor und sieh zu, wie sich die Torzone von der Werkbank entfernt: Deshalb lohnt es sich, mehrere Fühler zu verteilen.",
    doorDraft: "Zugluft am Tor testen",
    coldSnap: "Kältewelle testen",
    openFull: "Vollen Simulator öffnen",
  },
  live: {
    title: "Live-Demo-Feed",
    ledeHtml:
      'Echte Messwerte der Demofühler und Außenwetter, kein Mock-up. Lieber selbst an den Variablen drehen? <a class="text-link" href="/about/probe-demo">Öffne den interaktiven Simulator</a>.',
    readingsLabel: "Live-Messwerte der Demo",
    historyNote:
      "Die Fühlerkurven stammen aus dem Modell der Demowerkstatt, gerechnet mit dem echten stündlichen Wetter der letzten Woche; die gestrichelte Linie ist die Außentemperatur.",
  },
  screenshotCaption:
    "Dieselbe Oberfläche, sobald deine Hardware verbunden ist. Insights mit 30-Tage-Kurven, Frostschwelle und Risikonächten.",
  freeze: {
    title: "Dieselben Daten, die Frost- und Wasseralarme auslösen",
    lede: "Wenn ein Fühler deine Schwelle überschreitet, erreicht dich ProbeHarbor per E-Mail, Browser-Push, Discord, Telegram, Slack und mit Pro per SMS. Wasser- und Leckkontakte schlagen bei Nässe automatisch über dieselbe Infrastruktur Alarm. Leg die Grenze einmal fest und test sie vor der nächsten kalten Nacht.",
    channelsLabel: "Alarmkanäle",
    channels: [
      "E-Mail · Discord · Telegram · Slack",
      "Push in jedem Tarif",
      "SMS · Webhooks mit Pro",
      "Leck- und Wassersensoren melden sich bei Nässe automatisch",
    ],
    startFree: "Kostenlos starten: Devices öffnen",
    story: "Geschichte eines Wasserschadens",
    cookbook: "Kanal-Kochbuch",
    imageAlt:
      "ProbeHarbor-Temperaturverlauf mit Luftfeuchte, Taupunkt und Frostschwelle bei 1 °C (34 °F)",
  },
  steps: {
    title: "Als Nächstes: dein Kit",
    ledeHtml:
      'Kostenloses Konto, keine Kreditkarte: vom leeren Dashboard zur Live-Kurve in einer Sitzung. Physische Kits können die <a class="text-link" href="/about/kit-qr-onboarding">Kit-Einrichtung per QR</a> nutzen, dann ist die Ingest-URL nur einen Scan entfernt.',
    items: [
      {
        title: "Push-Gerät anlegen",
        copyHtml:
          "Registrier dich und wähl unter Devices einen Weg: Home Assistant, ESPHome oder MQTT bekommen ein Snippet zum Kopieren; ein Board bekommt einen vorausgefüllten Sketch; ohne Hardware gibt es einen Demo-Feed per Klick.",
      },
      {
        title: "JSON per POST senden",
        copyHtml:
          "Sende einen POST an <code>/api/ingest/&lt;key&gt;</code>. Sensoren werden beim ersten POST automatisch angelegt: Umbenennen kannst du sie danach unter Devices.",
      },
      {
        title: "Home beobachten und Alarme einrichten",
        copyHtml:
          "Prüf die Live-Werte, leg eine Frostschwelle fest und verlass dich darauf, dass Wasser- und Leckkontakte im selben Konto bei Nässe automatisch Alarm schlagen.",
      },
    ],
    startFree: "Kostenlos starten: Devices öffnen",
    guide: "Anleitung: Geräte hinzufügen",
    walkthrough: "Schritt für Schritt: Kit-QR",
  },
  compat: {
    label: "Funktioniert mit",
    push: "HTTPS-JSON-Push",
    pull: "HTTPS-JSON-Pull",
    mqtt: "MQTT-Bridge",
    homeAssistant: "Home Assistant (HACS)",
    noteHtml:
      'Lass MQTT in deinem LAN und spiegle die Daten per HTTPS zu ProbeHarbor, für Frost- und Wasseralarme im Haushalt und den Verlauf. <a class="text-link" href="/about/mqtt-bridge">Rezept für die MQTT-Bridge</a>',
  },
  explore: {
    title: "Weiter entdecken",
    lede: "Schon eine simulierte Kältewelle ausgelöst? Prüf es mit dem Live-Feed, dann lies eine Wasserschaden-Geschichte, schau dir eine Stadt auf der Karte an oder richte den Kit-QR ein.",
    items: [
      { label: "Interaktiver Fühlersimulator", hint: "Die wichtigste Demo zum Selbermachen: Tor, Sonne, außen, Frostschwelle" },
      { label: "Frostkarte der Community", hint: "Freiwillig geteilte Werte pro Stadt, ohne Konto" },
      { label: "Kit-Einrichtung per QR", hint: "Gerät anlegen → Ingest-QR scannen → erster POST" },
      { label: "Frost-Szenario", hint: "Wie ein Heizungsausfall um 2 Uhr nachts aussieht, Alarm für Alarm" },
    ],
  },
  faqLede:
    "Antworten rund um die Demo; Tarife und Grundlagen findest du unter Preise oder in den FAQ der Startseite.",
};

const ptBr: DemoMessages = {
  title: "Demo de sondas ao vivo",
  description:
    "Experimente o ProbeHarbor sem conta: simulador interativo de sondas, sondas de demo reais ao vivo e o mesmo caminho de alertas de congelamento e alagamento do seu hardware.",
  ogImageAlt: "Curvas de temperatura ao vivo das sondas do ProbeHarbor, sem precisar de conta",
  breadcrumbHome: "Início",
  breadcrumbDemo: "Demo ao vivo",
  schemaName: "Demo de sondas ao vivo do ProbeHarbor",
  schemaDescription:
    "Demos do ProbeHarbor sem conta: simulador interativo de sondas com várias zonas e sondas de demo ao vivo no caminho de ingestão de produção.",
  header: {
    kicker: "Experimente (sem conta)",
    title: "Demos: simulador + feed ao vivo",
    lede: "Provoque um congelamento no simulador interativo de sondas ou acompanhe sondas de demo reais ao lado do clima externo: o mesmo caminho de ingestão que seu ESP ou Arduino vai usar para alertas de congelamento e alagamento.",
    simulator: "Simulador interativo",
    liveReadings: "Leituras ao vivo",
    connect: "Conectar minhas sondas",
  },
  paths: {
    title: "Três jeitos de experimentar o ProbeHarbor",
    lede: "Comece pelo simulador se quiser sentir o risco de congelamento reagir ao que você faz e depois confirme com o feed ao vivo e o caminho de alagamento acionado automaticamente quando molha.",
    items: [
      {
        label: "Simulador interativo de sondas",
        text: "Mão na massa (a melhor primeira parada). Ajuste porta aberta ou fechada, sol, ar externo e limite de congelamento. Provoque uma onda de frio e veja as barras de cada zona e o JSON push/pull se atualizarem.",
      },
      {
        label: "Feed de demo ao vivo",
        text: "Para observar. Sondas de demo reais se atualizam aqui pelo caminho de ingestão de produção. Ideal para responder “isso é de mentira?” com números ao vivo.",
      },
      {
        label: "Configuração do kit por QR",
        text: "O caminho do hardware. Depois de criar um dispositivo push, escaneie o QR de ingestão (ou imprima numa etiqueta do kit) para que o firmware envie por POST temperatura, alagamento e outros tipos de sensor sem digitar a chave.",
      },
    ],
  },
  sim: {
    title: "Provoque a mudança: simulador interativo",
    lede: "As predefinições de onda de frio, corrente de ar pela porta e carga solar usam o mesmo cálculo de status dos espaços do Overview que a produção. Abra o portão e veja a zona da porta se afastar da bancada: é por isso que vale espalhar várias sondas.",
    doorDraft: "Testar corrente de ar",
    coldSnap: "Testar onda de frio",
    openFull: "Abrir o simulador completo",
  },
  live: {
    title: "Feed de demo ao vivo",
    ledeHtml:
      'Leituras reais das sondas de demo e clima externo, não uma maquete. Prefere mexer nas variáveis você mesmo? <a class="text-link" href="/about/probe-demo">Abra o simulador interativo</a>.',
    readingsLabel: "Leituras da demo ao vivo",
    historyNote:
      "As curvas das sondas são o modelo da oficina de demo rodado sobre o clima real, hora a hora, da última semana; a linha tracejada é a temperatura externa.",
  },
  screenshotCaption:
    "A mesma interface do produto depois que você conecta o hardware. Insights com curvas de 30 dias, limite de congelamento e noites de risco.",
  freeze: {
    title: "Os mesmos dados que disparam alertas de congelamento e alagamento",
    lede: "Quando uma sonda cruza o seu limite, o ProbeHarbor pode avisar você por e-mail, push do navegador, Discord, Telegram, Slack e, no Pro, SMS. Contatos de alagamento ou vazamento alertam automaticamente quando molham, na mesma infraestrutura. Defina o limite uma vez e teste antes da próxima noite fria.",
    channelsLabel: "Canais de alerta",
    channels: [
      "E-mail · Discord · Telegram · Slack",
      "Push em todos os planos",
      "SMS · webhooks no Pro",
      "Sensores de vazamento ou alagamento alertam automaticamente quando molham",
    ],
    startFree: "Comece grátis: abra Devices",
    story: "História de um vazamento",
    cookbook: "Guia de canais",
    imageAlt:
      "Tendência de temperatura do ProbeHarbor com umidade, ponto de orvalho e limite de congelamento em 1 °C (34 °F)",
  },
  steps: {
    title: "Agora, o seu kit",
    ledeHtml:
      'Conta grátis, sem cartão de crédito: do dashboard vazio a uma curva ao vivo numa sentada só. Kits físicos podem usar a <a class="text-link" href="/about/kit-qr-onboarding">configuração do kit por QR</a>, e a URL de ingestão fica a um escaneamento de distância.',
    items: [
      {
        title: "Crie um dispositivo push",
        copyHtml:
          "Cadastre-se e escolha um caminho em Devices: Home Assistant, ESPHome ou MQTT recebem um trecho para copiar e colar; uma placa recebe um sketch já preenchido; sem hardware, um feed de demo com um clique.",
      },
      {
        title: "Envie JSON por POST",
        copyHtml:
          "Faça POST para <code>/api/ingest/&lt;key&gt;</code>. Os sensores são importados automaticamente no primeiro POST: depois é só renomear em Devices.",
      },
      {
        title: "Acompanhe a Home e configure alertas",
        copyHtml:
          "Confirme os valores ao vivo, defina um limite de congelamento e saiba que contatos de alagamento ou vazamento alertam automaticamente quando molham, na mesma conta.",
      },
    ],
    startFree: "Comece grátis: abra Devices",
    guide: "Guia para adicionar dispositivos",
    walkthrough: "Passo a passo do QR do kit",
  },
  compat: {
    label: "Funciona com",
    push: "Push HTTPS JSON",
    pull: "Pull HTTPS JSON",
    mqtt: "Ponte MQTT",
    homeAssistant: "Home Assistant (HACS)",
    noteHtml:
      'Mantenha o MQTT na sua rede local e espelhe para o ProbeHarbor por HTTPS para ter alertas de congelamento e alagamento em casa e histórico. <a class="text-link" href="/about/mqtt-bridge">Receita da ponte MQTT</a>',
  },
  explore: {
    title: "Continue explorando",
    lede: "Já provocou uma onda de frio simulada? Confirme com o feed ao vivo e depois leia uma história de vazamento, veja uma cidade no mapa ou configure o QR do kit.",
    items: [
      { label: "Simulador interativo de sondas", hint: "A principal demo mão na massa: porta, sol, ar externo, limite de congelamento" },
      { label: "Mapa comunitário de congelamento", hint: "Dados agregados por cidade, com participação opcional, sem conta" },
      { label: "Configuração do kit por QR", hint: "Criar dispositivo → escanear QR de ingestão → primeiro POST" },
      { label: "Cenário de congelamento", hint: "Como é uma falha do aquecedor às 2 da manhã, alerta por alerta" },
    ],
  },
  faqLede:
    "Respostas sobre a demo; para planos e o básico do produto, veja Preços ou as perguntas frequentes da página inicial.",
};

export const demoMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

import type { AboutPhotoId } from "../../lib/aboutPhotos";
import { defineMessages } from "../translate";

/**
 * /compare hub copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <strong>); keep hrefs English, middleware localizes them.
 */
type Row = { capabilityHtml: string; probeharborHtml: string; diyHtml: string; consumerHtml: string };

const en = {
  title: "Compare monitoring options",
  description:
    "ProbeHarbor vs Temp Stick, YoLink, SensorPush, Shelly, Govee, DIY MQTT, Tempest, Nest, and Ecobee for freeze and leak alerts in unheated spaces.",
  breadcrumbHome: "Home",
  breadcrumbCompare: "Compare",
  kicker: "Compare",
  headerTitle: "Built for homeowners, not home servers",
  headerLede:
    "ProbeHarbor is for live probe sensors, freeze and flood/leak alerts, and optional SMS, without running your own infrastructure. Plan limits and the Free/Member/Pro/Portfolio matrix live on Pricing; this page compares ProbeHarbor to other approaches.",
  seePlansPricing: "See plans & pricing",
  startFree: "Start free",
  /** Photo strip labels keyed by `compareHubPhotos` id. */
  photoLabels: {
    "network-switch": "vs DIY MQTT",
    "home-workshop": "vs Govee / SmartThings",
    "frozen-thermometer": "vs Tempest",
    "utility-pipes": "vs TempStick",
    crawlspace: "vs Nest / Ecobee",
  } as Partial<Record<AboutPhotoId, string>>,
  guides: {
    title: "Detailed comparisons",
    subtitle: "Side-by-side guides for common alternatives: ops burden, alerts, and when each option fits.",
    smartThingsHtml:
      '<strong class="text-[var(--color-text)]">SmartThings</strong> can add ProbeHarbor sensors via the\n        <a class="text-link" href="/integrations/smartthings">Matter bridge path</a>\n        (no Cloud-to-Cloud app). Consumer pods still sit with Govee below:\n        <a class="text-link" href="/compare/govee">Govee guide</a>.',
    haTitle: "Home Assistant (HACS)",
    haCopyHtml:
      'Complementary, not a rival: keep HA on the LAN and use ProbeHarbor for household freeze and leak SMS, history, and off-site alerts. Official HACS integration + MQTT dual-run notes on the\n          <a class="text-link" href="/integrations/home-assistant">Home Assistant page</a>\n, and see\n          <a class="text-link" href="/compare/diy-mqtt">vs DIY MQTT</a>\n          if you’re weighing a full self-hosted stack.',
  },
  table: {
    title: "ProbeHarbor vs alternatives",
    caption: "ProbeHarbor compared to DIY scripts and Govee or SmartThings",
    capability: "Capability",
    probeharbor: "ProbeHarbor",
    diy: "DIY script + cron",
    consumer: "Govee / SmartThings",
    rows: [
      { capabilityHtml: "Time to freeze (this space)", probeharborHtml: "Forecast-backed clock + remaining-hours alert", diyHtml: "You write the model", consumerHtml: "Threshold only" },
      { capabilityHtml: "Freeze alerts (email/SMS/push)", probeharborHtml: "Built-in, per-household", diyHtml: "You wire Twilio + cron", consumerHtml: "App push; SMS extra or absent" },
      { capabilityHtml: "ESP/Arduino push ingest", probeharborHtml: "One-time device key", diyHtml: "Custom endpoint", consumerHtml: "Govee pods / SmartThings devices" },
      { capabilityHtml: "History &amp; CSV export", probeharborHtml: "On paid plans", diyHtml: "Self-hosted DB", consumerHtml: "Subscription tiers" },
      { capabilityHtml: "Share links &amp; Grafana", probeharborHtml: "1 family live link; Pro adds history/metrics", diyHtml: "Manual setup", consumerHtml: "Rare on consumer apps" },
      { capabilityHtml: "Home Assistant (HACS)", probeharborHtml: '<a class="text-link" href="/integrations/home-assistant">Official integration</a> (share link)', diyHtml: "REST sensors + webhooks", consumerHtml: "Varies by vendor" },
      { capabilityHtml: "Household multi-user", probeharborHtml: "Free", diyHtml: "N/A", consumerHtml: "Family sharing is awkward" },
      { capabilityHtml: "Hosting &amp; uptime ops", probeharborHtml: 'Cloudflare edge; <a class="text-link" href="/system-status">public status</a>', diyHtml: "You own the VPS / cron", consumerHtml: "Vendor cloud (opaque)" },
    ] as Row[],
  },
  screenshotCaption: "What you get without running your own stack: probe curves against your freeze threshold.",
  audience: {
    title: "Who it's for",
    itemsHtml: [
      "<strong>Free</strong>, one property, live charts, email/chat alerts, and one family live share link while you evaluate.",
      "<strong>Member</strong>. CSV history and more devices through a cold season.",
      '<strong>Pro</strong>. SMS, Nest/Ecobee house context, unlimited share scopes, <a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a>, <a class="text-link" href="/claims-pack">claims pack</a>, and webhooks when someone needs to wake up at 2 a.m. Free already includes one family live link. See the <a class="text-link" href="/docs/api">HTTP API</a> for ingest and metrics.',
      '<strong>Portfolio</strong>, for larger multi-property ops past Pro’s property ceiling, with property-manager logins. Details on <a class="text-link" href="/pricing#portfolio">Pricing</a> and <a class="text-link" href="/property-management">property management</a>.',
    ],
    startFree: "Start free, no card required",
    seePrices: "See plan prices",
    readScenario: "Read a freeze scenario",
  },
  limits: {
    title: "Plan limits live on pricing",
    subtitle:
      "Device counts, retention, Nest/Ecobee, property-manager logins, and Free vs Member vs Pro vs Portfolio are compared on the pricing page so this page can stay focused on alternatives, not a second plan matrix.",
    openComparison: "Open the plan comparison",
    createAccount: "Create free account",
  },
};

type CompareMessages = typeof en;

const es: CompareMessages = {
  title: "Compara opciones de monitoreo",
  description:
    "ProbeHarbor vs Temp Stick, YoLink, SensorPush, Shelly, Govee, MQTT casero, Tempest, Nest y Ecobee: alertas de helada y fugas en espacios sin calefacción.",
  breadcrumbHome: "Inicio",
  breadcrumbCompare: "Comparar",
  kicker: "Comparar",
  headerTitle: "Hecho para dueños de casa, no para servidores caseros",
  headerLede:
    "ProbeHarbor te da sondas en vivo, alertas de helada e inundación/fugas y SMS opcional, sin que tengas que mantener tu propia infraestructura. Los límites de cada plan y la matriz Free/Member/Pro/Portfolio están en Precios; esta página compara ProbeHarbor con otras alternativas.",
  seePlansPricing: "Ver planes y precios",
  startFree: "Empieza gratis",
  photoLabels: {
    "network-switch": "vs MQTT casero",
    "home-workshop": "vs Govee / SmartThings",
    "frozen-thermometer": "vs Tempest",
    "utility-pipes": "vs TempStick",
    crawlspace: "vs Nest / Ecobee",
  },
  guides: {
    title: "Comparativas detalladas",
    subtitle: "Guías lado a lado de las alternativas más comunes: carga de mantenimiento, alertas y cuándo conviene cada opción.",
    smartThingsHtml:
      '<strong class="text-[var(--color-text)]">SmartThings</strong> puede añadir sensores de ProbeHarbor mediante la <a class="text-link" href="/integrations/smartthings">ruta del puente Matter</a> (sin app Cloud-to-Cloud). Los sensores de consumo siguen agrupados con Govee más abajo: <a class="text-link" href="/compare/govee">guía de Govee</a>.',
    haTitle: "Home Assistant (HACS)",
    haCopyHtml:
      'Complementario, no rival: mantén HA en tu red local y usa ProbeHarbor para los SMS de helada y fugas del hogar, el historial y las alertas fuera de casa. La integración oficial de HACS y notas para usarla junto con MQTT están en la <a class="text-link" href="/integrations/home-assistant">página de Home Assistant</a>; y consulta <a class="text-link" href="/compare/diy-mqtt">vs MQTT casero</a> si estás evaluando montar todo tú mismo.',
  },
  table: {
    title: "ProbeHarbor frente a las alternativas",
    caption: "ProbeHarbor comparado con scripts caseros y con Govee o SmartThings",
    capability: "Función",
    probeharbor: "ProbeHarbor",
    diy: "Script casero + cron",
    consumer: "Govee / SmartThings",
    rows: [
      { capabilityHtml: "Tiempo hasta la helada (en este espacio)", probeharborHtml: "Reloj basado en el pronóstico + alerta de horas restantes", diyHtml: "Tú escribes el modelo", consumerHtml: "Solo umbral" },
      { capabilityHtml: "Alertas de helada (correo/SMS/push)", probeharborHtml: "Integradas, por hogar", diyHtml: "Tú conectas Twilio + cron", consumerHtml: "Push de la app; SMS aparte o inexistente" },
      { capabilityHtml: "Envío de datos desde ESP/Arduino", probeharborHtml: "Clave de dispositivo única", diyHtml: "Endpoint propio", consumerHtml: "Sensores Govee / dispositivos SmartThings" },
      { capabilityHtml: "Historial y exportación CSV", probeharborHtml: "En planes de pago", diyHtml: "Base de datos autoalojada", consumerHtml: "Niveles de suscripción" },
      { capabilityHtml: "Enlaces compartidos y Grafana", probeharborHtml: "1 enlace en vivo para la familia; Pro añade historial y métricas", diyHtml: "Configuración manual", consumerHtml: "Poco común en apps de consumo" },
      { capabilityHtml: "Home Assistant (HACS)", probeharborHtml: '<a class="text-link" href="/integrations/home-assistant">Integración oficial</a> (enlace compartido)', diyHtml: "Sensores REST + webhooks", consumerHtml: "Depende del fabricante" },
      { capabilityHtml: "Varios usuarios por hogar", probeharborHtml: "Gratis", diyHtml: "No aplica", consumerHtml: "Compartir en familia es incómodo" },
      { capabilityHtml: "Alojamiento y disponibilidad", probeharborHtml: 'Red de Cloudflare; <a class="text-link" href="/system-status">estado público</a>', diyHtml: "Tú mantienes el VPS / cron", consumerHtml: "Nube del fabricante (opaca)" },
    ],
  },
  screenshotCaption: "Lo que obtienes sin mantener tu propia infraestructura: curvas de las sondas frente a tu umbral de helada.",
  audience: {
    title: "Para quién es",
    itemsHtml: [
      "<strong>Free</strong>: una propiedad, gráficas en vivo, alertas por correo y chat, y un enlace en vivo para la familia mientras lo pruebas.",
      "<strong>Member</strong>: historial en CSV y más dispositivos durante toda una temporada de frío.",
      '<strong>Pro</strong>: SMS, contexto de la casa desde Nest/Ecobee, alcances de enlace compartido ilimitados, <a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a>, <a class="text-link" href="/claims-pack">paquete para reclamaciones</a> y webhooks para cuando alguien tiene que despertarse a las 2 de la mañana. Free ya incluye un enlace en vivo para la familia. Consulta la <a class="text-link" href="/docs/api">API HTTP</a> para el envío de datos y las métricas.',
      '<strong>Portfolio</strong>: para operaciones con muchas propiedades que superan el límite de Pro, con accesos para administradores de propiedades. Detalles en <a class="text-link" href="/pricing#portfolio">Precios</a> y <a class="text-link" href="/property-management">administración de propiedades</a>.',
    ],
    startFree: "Empieza gratis, sin tarjeta",
    seePrices: "Ver precios de los planes",
    readScenario: "Lee un caso de helada",
  },
  limits: {
    title: "Los límites de cada plan están en Precios",
    subtitle:
      "La cantidad de dispositivos, la retención, Nest/Ecobee, los accesos para administradores y la comparación Free vs Member vs Pro vs Portfolio están en la página de precios, para que esta página se centre en las alternativas y no repita la matriz de planes.",
    openComparison: "Abrir la comparación de planes",
    createAccount: "Crear cuenta gratis",
  },
};

const fr: CompareMessages = {
  title: "Comparer les solutions de surveillance",
  description:
    "ProbeHarbor face à Temp Stick, YoLink, SensorPush, Shelly, Govee, MQTT maison, Tempest, Nest et Ecobee : alertes gel et fuite en local non chauffé.",
  breadcrumbHome: "Accueil",
  breadcrumbCompare: "Comparer",
  kicker: "Comparer",
  headerTitle: "Conçu pour les particuliers, pas pour les serveurs maison",
  headerLede:
    "ProbeHarbor vous offre des sondes en direct, des alertes gel et inondation/fuite, et des SMS en option, sans infrastructure à gérer vous-même. Les limites des forfaits et la grille Free/Member/Pro/Portfolio se trouvent sur la page Tarifs ; cette page compare ProbeHarbor aux autres approches.",
  seePlansPricing: "Voir les forfaits et tarifs",
  startFree: "Commencer gratuitement",
  photoLabels: {
    "network-switch": "vs MQTT maison",
    "home-workshop": "vs Govee / SmartThings",
    "frozen-thermometer": "vs Tempest",
    "utility-pipes": "vs TempStick",
    crawlspace: "vs Nest / Ecobee",
  },
  guides: {
    title: "Comparatifs détaillés",
    subtitle: "Des guides côte à côte pour les alternatives courantes : charge d’exploitation, alertes, et quand chaque option convient.",
    smartThingsHtml:
      '<strong class="text-[var(--color-text)]">SmartThings</strong> peut ajouter des capteurs ProbeHarbor via la <a class="text-link" href="/integrations/smartthings">passerelle Matter</a> (sans application Cloud-to-Cloud). Les capteurs grand public restent regroupés avec Govee ci-dessous : <a class="text-link" href="/compare/govee">guide Govee</a>.',
    haTitle: "Home Assistant (HACS)",
    haCopyHtml:
      'Complémentaire, pas concurrent : gardez HA sur votre réseau local et utilisez ProbeHarbor pour les SMS gel et fuite du foyer, l’historique et les alertes à distance. Intégration HACS officielle et notes pour la faire cohabiter avec MQTT sur la <a class="text-link" href="/integrations/home-assistant">page Home Assistant</a> ; voir aussi <a class="text-link" href="/compare/diy-mqtt">vs MQTT maison</a> si vous envisagez une pile entièrement auto-hébergée.',
  },
  table: {
    title: "ProbeHarbor face aux alternatives",
    caption: "ProbeHarbor comparé aux scripts maison et à Govee ou SmartThings",
    capability: "Fonction",
    probeharbor: "ProbeHarbor",
    diy: "Script maison + cron",
    consumer: "Govee / SmartThings",
    rows: [
      { capabilityHtml: "Délai avant le gel (dans ce local)", probeharborHtml: "Compte à rebours fondé sur la prévision + alerte d’heures restantes", diyHtml: "Vous écrivez le modèle", consumerHtml: "Seuil uniquement" },
      { capabilityHtml: "Alertes gel (e-mail/SMS/push)", probeharborHtml: "Intégrées, par foyer", diyHtml: "Vous branchez Twilio + cron", consumerHtml: "Push de l’app ; SMS en option ou absent" },
      { capabilityHtml: "Envoi depuis ESP/Arduino", probeharborHtml: "Clé d’appareil unique", diyHtml: "Point d’accès sur mesure", consumerHtml: "Capteurs Govee / appareils SmartThings" },
      { capabilityHtml: "Historique et export CSV", probeharborHtml: "Sur les forfaits payants", diyHtml: "Base de données auto-hébergée", consumerHtml: "Niveaux d’abonnement" },
      { capabilityHtml: "Liens de partage et Grafana", probeharborHtml: "1 lien en direct pour la famille ; Pro ajoute historique et métriques", diyHtml: "Configuration manuelle", consumerHtml: "Rare dans les apps grand public" },
      { capabilityHtml: "Home Assistant (HACS)", probeharborHtml: '<a class="text-link" href="/integrations/home-assistant">Intégration officielle</a> (lien de partage)', diyHtml: "Capteurs REST + webhooks", consumerHtml: "Selon le fabricant" },
      { capabilityHtml: "Plusieurs utilisateurs par foyer", probeharborHtml: "Gratuit", diyHtml: "Sans objet", consumerHtml: "Partage familial peu pratique" },
      { capabilityHtml: "Hébergement et disponibilité", probeharborHtml: 'Réseau Cloudflare ; <a class="text-link" href="/system-status">statut public</a>', diyHtml: "Vous gérez le VPS / cron", consumerHtml: "Cloud du fabricant (opaque)" },
    ],
  },
  screenshotCaption: "Ce que vous obtenez sans gérer votre propre infrastructure : les courbes des sondes face à votre seuil de gel.",
  audience: {
    title: "Pour qui ?",
    itemsHtml: [
      "<strong>Free</strong> : un logement, graphiques en direct, alertes par e-mail et messagerie, et un lien en direct pour la famille pendant votre essai.",
      "<strong>Member</strong> : historique CSV et davantage d’appareils pendant toute une saison froide.",
      '<strong>Pro</strong> : SMS, contexte de la maison via Nest/Ecobee, partages illimités, <a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a>, <a class="text-link" href="/claims-pack">dossier de sinistre</a> et webhooks quand quelqu’un doit se réveiller à 2 h du matin. Free inclut déjà un lien en direct pour la famille. Consultez l’<a class="text-link" href="/docs/api">API HTTP</a> pour l’envoi de données et les métriques.',
      '<strong>Portfolio</strong> : pour les parcs de plusieurs biens qui dépassent le plafond de Pro, avec des accès pour gestionnaires immobiliers. Détails sur <a class="text-link" href="/pricing#portfolio">Tarifs</a> et <a class="text-link" href="/property-management">gestion immobilière</a>.',
    ],
    startFree: "Commencer gratuitement, sans carte",
    seePrices: "Voir les prix des forfaits",
    readScenario: "Lire un scénario de gel",
  },
  limits: {
    title: "Les limites des forfaits sont sur la page Tarifs",
    subtitle:
      "Nombre d’appareils, conservation, Nest/Ecobee, accès gestionnaires et comparaison Free, Member, Pro et Portfolio figurent sur la page Tarifs, afin que cette page reste centrée sur les alternatives plutôt que sur une seconde grille de forfaits.",
    openComparison: "Ouvrir la comparaison des forfaits",
    createAccount: "Créer un compte gratuit",
  },
};

const de: CompareMessages = {
  title: "Überwachungslösungen im Vergleich",
  description:
    "ProbeHarbor vs. Temp Stick, YoLink, SensorPush, Shelly, Govee, Eigenbau-MQTT, Tempest, Nest und Ecobee für Frost- und Leckalarme in unbeheizten Räumen.",
  breadcrumbHome: "Startseite",
  breadcrumbCompare: "Vergleich",
  kicker: "Vergleich",
  headerTitle: "Gebaut für Hausbesitzer, nicht für Heimserver",
  headerLede:
    "ProbeHarbor bietet Live-Fühler, Frost- und Hochwasser-/Leckalarme und optional SMS, ohne dass du eigene Infrastruktur betreiben musst. Planlimits und die Free/Member/Pro/Portfolio-Übersicht findest du unter Preise; diese Seite vergleicht ProbeHarbor mit anderen Ansätzen.",
  seePlansPricing: "Pläne & Preise ansehen",
  startFree: "Kostenlos starten",
  photoLabels: {
    "network-switch": "vs. Eigenbau-MQTT",
    "home-workshop": "vs. Govee / SmartThings",
    "frozen-thermometer": "vs. Tempest",
    "utility-pipes": "vs. TempStick",
    crawlspace: "vs. Nest / Ecobee",
  },
  guides: {
    title: "Ausführliche Vergleiche",
    subtitle: "Direkte Gegenüberstellungen gängiger Alternativen: Wartungsaufwand, Alarme und wann welche Lösung passt.",
    smartThingsHtml:
      '<strong class="text-[var(--color-text)]">SmartThings</strong> kann ProbeHarbor-Sensoren über die <a class="text-link" href="/integrations/smartthings">Matter-Bridge</a> einbinden (ohne Cloud-to-Cloud-App). Fertige Consumer-Sensoren behandeln wir weiterhin zusammen mit Govee: <a class="text-link" href="/compare/govee">Govee-Vergleich</a>.',
    haTitle: "Home Assistant (HACS)",
    haCopyHtml:
      'Ergänzung, keine Konkurrenz: Lass HA im Heimnetz laufen und nutze ProbeHarbor für Frost- und Leck-SMS an den ganzen Haushalt, Verlauf und Alarme von außerhalb. Die offizielle HACS-Integration und Hinweise zum Parallelbetrieb mit MQTT stehen auf der <a class="text-link" href="/integrations/home-assistant">Home-Assistant-Seite</a>; schau dir auch <a class="text-link" href="/compare/diy-mqtt">vs. Eigenbau-MQTT</a> an, wenn du einen komplett selbst gehosteten Stack abwägst.',
  },
  table: {
    title: "ProbeHarbor vs. Alternativen",
    caption: "ProbeHarbor im Vergleich zu Eigenbau-Skripten und Govee oder SmartThings",
    capability: "Funktion",
    probeharbor: "ProbeHarbor",
    diy: "Eigenes Skript + Cron",
    consumer: "Govee / SmartThings",
    rows: [
      { capabilityHtml: "Zeit bis zum Frost (in diesem Raum)", probeharborHtml: "Prognosebasierter Countdown + Alarm mit Reststunden", diyHtml: "Modell schreibst du selbst", consumerHtml: "Nur Schwellenwert" },
      { capabilityHtml: "Frostalarme (E-Mail/SMS/Push)", probeharborHtml: "Integriert, pro Haushalt", diyHtml: "Twilio + Cron verdrahtest du selbst", consumerHtml: "App-Push; SMS extra oder gar nicht" },
      { capabilityHtml: "Datenversand von ESP/Arduino", probeharborHtml: "Einmaliger Geräteschlüssel", diyHtml: "Eigener Endpunkt", consumerHtml: "Govee-Sensoren / SmartThings-Geräte" },
      { capabilityHtml: "Verlauf &amp; CSV-Export", probeharborHtml: "In den Bezahlplänen", diyHtml: "Selbst gehostete Datenbank", consumerHtml: "Abostufen" },
      { capabilityHtml: "Freigabelinks &amp; Grafana", probeharborHtml: "1 Live-Link für die Familie; Pro ergänzt Verlauf/Metriken", diyHtml: "Manuelle Einrichtung", consumerHtml: "Selten bei Consumer-Apps" },
      { capabilityHtml: "Home Assistant (HACS)", probeharborHtml: '<a class="text-link" href="/integrations/home-assistant">Offizielle Integration</a> (Freigabelink)', diyHtml: "REST-Sensoren + Webhooks", consumerHtml: "Je nach Hersteller" },
      { capabilityHtml: "Mehrere Nutzer pro Haushalt", probeharborHtml: "Kostenlos", diyHtml: "Entfällt", consumerHtml: "Teilen in der Familie ist umständlich" },
      { capabilityHtml: "Hosting &amp; Verfügbarkeit", probeharborHtml: 'Cloudflare-Edge; <a class="text-link" href="/system-status">öffentliche Statusseite</a>', diyHtml: "VPS / Cron betreibst du selbst", consumerHtml: "Hersteller-Cloud (undurchsichtig)" },
    ],
  },
  screenshotCaption: "Das bekommst du, ohne einen eigenen Stack zu betreiben: Fühlerkurven gegen deine Frostschwelle.",
  audience: {
    title: "Für wen es gedacht ist",
    itemsHtml: [
      "<strong>Free</strong>: ein Objekt, Live-Diagramme, Alarme per E-Mail und Chat und ein Live-Link für die Familie, während du testest.",
      "<strong>Member</strong>: CSV-Verlauf und mehr Geräte für eine ganze Kältesaison.",
      '<strong>Pro</strong>: SMS, Hauskontext von Nest/Ecobee, unbegrenzte Freigaben, <a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a>, <a class="text-link" href="/claims-pack">Schadensdokumentation</a> und Webhooks, wenn jemand um 2 Uhr nachts aufwachen muss. Free enthält bereits einen Live-Link für die Familie. Für Datenversand und Metriken siehe die <a class="text-link" href="/docs/api">HTTP-API</a>.',
      '<strong>Portfolio</strong>: für größere Bestände mit mehr Objekten, als Pro erlaubt, mit Zugängen für Hausverwaltungen. Details unter <a class="text-link" href="/pricing#portfolio">Preise</a> und <a class="text-link" href="/property-management">Hausverwaltung</a>.',
    ],
    startFree: "Kostenlos starten, ohne Kreditkarte",
    seePrices: "Planpreise ansehen",
    readScenario: "Ein Frost-Szenario lesen",
  },
  limits: {
    title: "Planlimits stehen unter Preise",
    subtitle:
      "Geräteanzahl, Speicherdauer, Nest/Ecobee, Zugänge für Hausverwaltungen sowie Free vs. Member vs. Pro vs. Portfolio vergleichen wir auf der Preisseite, damit sich diese Seite auf Alternativen konzentriert und keine zweite Planübersicht braucht.",
    openComparison: "Planvergleich öffnen",
    createAccount: "Kostenloses Konto erstellen",
  },
};

const ptBr: CompareMessages = {
  title: "Compare opções de monitoramento",
  description:
    "ProbeHarbor vs Temp Stick, YoLink, SensorPush, Shelly, Govee, MQTT DIY, Tempest, Nest e Ecobee: alertas de congelamento e vazamento em locais sem aquecimento.",
  breadcrumbHome: "Início",
  breadcrumbCompare: "Comparar",
  kicker: "Comparar",
  headerTitle: "Feito para donos de casa, não para servidores caseiros",
  headerLede:
    "O ProbeHarbor oferece sondas ao vivo, alertas de congelamento e de inundação/vazamento e SMS opcional, sem você precisar manter sua própria infraestrutura. Os limites dos planos e a matriz Free/Member/Pro/Portfolio ficam em Preços; esta página compara o ProbeHarbor com outras abordagens.",
  seePlansPricing: "Ver planos e preços",
  startFree: "Comece grátis",
  photoLabels: {
    "network-switch": "vs MQTT caseiro",
    "home-workshop": "vs Govee / SmartThings",
    "frozen-thermometer": "vs Tempest",
    "utility-pipes": "vs TempStick",
    crawlspace: "vs Nest / Ecobee",
  },
  guides: {
    title: "Comparações detalhadas",
    subtitle: "Guias lado a lado das alternativas mais comuns: trabalho de manutenção, alertas e quando cada opção faz sentido.",
    smartThingsHtml:
      'O <strong class="text-[var(--color-text)]">SmartThings</strong> pode adicionar sensores do ProbeHarbor pela <a class="text-link" href="/integrations/smartthings">ponte Matter</a> (sem app Cloud-to-Cloud). Os sensores de consumo continuam junto com a Govee abaixo: <a class="text-link" href="/compare/govee">guia da Govee</a>.',
    haTitle: "Home Assistant (HACS)",
    haCopyHtml:
      'Complementar, não concorrente: mantenha o HA na rede local e use o ProbeHarbor para SMS de congelamento e vazamento para a casa toda, histórico e alertas fora de casa. A integração oficial do HACS e notas para rodar junto com MQTT estão na <a class="text-link" href="/integrations/home-assistant">página do Home Assistant</a>; veja também <a class="text-link" href="/compare/diy-mqtt">vs MQTT caseiro</a> se você está pensando em montar tudo auto-hospedado.',
  },
  table: {
    title: "ProbeHarbor vs alternativas",
    caption: "ProbeHarbor comparado a scripts caseiros e a Govee ou SmartThings",
    capability: "Recurso",
    probeharbor: "ProbeHarbor",
    diy: "Script caseiro + cron",
    consumer: "Govee / SmartThings",
    rows: [
      { capabilityHtml: "Tempo até congelar (neste espaço)", probeharborHtml: "Relógio baseado na previsão + alerta de horas restantes", diyHtml: "Você escreve o modelo", consumerHtml: "Só limite" },
      { capabilityHtml: "Alertas de congelamento (e-mail/SMS/push)", probeharborHtml: "Integrados, por casa", diyHtml: "Você conecta Twilio + cron", consumerHtml: "Push do app; SMS à parte ou inexistente" },
      { capabilityHtml: "Envio de dados de ESP/Arduino", probeharborHtml: "Chave de dispositivo única", diyHtml: "Endpoint próprio", consumerHtml: "Sensores Govee / dispositivos SmartThings" },
      { capabilityHtml: "Histórico e exportação CSV", probeharborHtml: "Nos planos pagos", diyHtml: "Banco de dados auto-hospedado", consumerHtml: "Níveis de assinatura" },
      { capabilityHtml: "Links de compartilhamento e Grafana", probeharborHtml: "1 link ao vivo para a família; o Pro adiciona histórico/métricas", diyHtml: "Configuração manual", consumerHtml: "Raro em apps de consumo" },
      { capabilityHtml: "Home Assistant (HACS)", probeharborHtml: '<a class="text-link" href="/integrations/home-assistant">Integração oficial</a> (link compartilhado)', diyHtml: "Sensores REST + webhooks", consumerHtml: "Depende do fabricante" },
      { capabilityHtml: "Vários usuários por casa", probeharborHtml: "Grátis", diyHtml: "Não se aplica", consumerHtml: "Compartilhar com a família é complicado" },
      { capabilityHtml: "Hospedagem e disponibilidade", probeharborHtml: 'Rede da Cloudflare; <a class="text-link" href="/system-status">status público</a>', diyHtml: "Você cuida do VPS / cron", consumerHtml: "Nuvem do fabricante (opaca)" },
    ],
  },
  screenshotCaption: "O que você ganha sem manter sua própria infraestrutura: curvas das sondas comparadas ao seu limite de congelamento.",
  audience: {
    title: "Para quem é",
    itemsHtml: [
      "<strong>Free</strong>: um imóvel, gráficos ao vivo, alertas por e-mail e chat e um link ao vivo para a família enquanto você testa.",
      "<strong>Member</strong>: histórico em CSV e mais dispositivos durante uma temporada de frio inteira.",
      '<strong>Pro</strong>: SMS, contexto da casa via Nest/Ecobee, escopos de compartilhamento ilimitados, <a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a>, <a class="text-link" href="/claims-pack">pacote para sinistros</a> e webhooks para quando alguém precisa acordar às 2 da manhã. O Free já inclui um link ao vivo para a família. Veja a <a class="text-link" href="/docs/api">API HTTP</a> para envio de dados e métricas.',
      '<strong>Portfolio</strong>: para operações maiores com vários imóveis além do limite do Pro, com acessos para administradores de imóveis. Detalhes em <a class="text-link" href="/pricing#portfolio">Preços</a> e <a class="text-link" href="/property-management">administração de imóveis</a>.',
    ],
    startFree: "Comece grátis, sem cartão",
    seePrices: "Ver preços dos planos",
    readScenario: "Leia um caso de congelamento",
  },
  limits: {
    title: "Os limites dos planos ficam em Preços",
    subtitle:
      "Quantidade de dispositivos, retenção, Nest/Ecobee, acessos para administradores de imóveis e a comparação Free vs Member vs Pro vs Portfolio estão na página de preços, para que esta página foque nas alternativas e não repita a matriz de planos.",
    openComparison: "Abrir a comparação de planos",
    createAccount: "Criar conta grátis",
  },
};

export const compareMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

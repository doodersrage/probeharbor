import { formatRelativeAge } from "../../lib/relativeTime";
import { LOCALE_META, type Locale } from "../locales";
import { defineMessages } from "../translate";

/**
 * /freeze-map page copy. City data is stored in °F; English shows °F as
 * before, other locales show °C first with °F in parentheses. Table cells
 * stay in °F (the column headers say so) with the locale's decimal mark.
 * `client` strings go to the inline map/search scripts via define:vars.
 */
const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

const en = {
  title: "Freeze-risk map",
  description:
    "See city-level freeze risk from ProbeHarbor probe households, then track your own unheated space for free. Opt-in, anonymized community map.",
  breadcrumbHome: "Home",
  breadcrumb: "Freeze map",
  kicker: "Community",
  lede: "See whether your metro’s indoor probes are running cold this week, then start tracking your own garage, crawlspace, or shop for free. City averages only; no addresses or device names.",
  optInHousehold: "Opt in from Household",
  optInStart: "Start free & opt in your city",
  signIn: "Sign in",
  embed: "Embed",
  freezeSeason: "Freeze season",
  shareKit: "Share kit",
  seedIntroHtml: (floor: number) =>
    `<strong>Showing sample data</strong>, live city readings appear once enough households opt in (${floor}+ probes per city).`,
  optInNone: "No households have opted in yet: be the first in your metro.",
  optInCount: (n: number) =>
    n === 1 ? "1 household has opted in so far." : `${n} households have opted in so far.`,
  linkOptIn: "Opt in",
  linkCreate: "Create an account to contribute",
  liveNotice: (n: number, floor: number) =>
    `Live opt-in aggregates · ${n} household${plural(n, "", "s")} contributing · cities need ${floor}+ samples to list by default`,
  lastSnapshot: (label: string) => ` · Last snapshot ${label}`,
  liveOptOut: ". Opt out anytime under Household.",
  momentumTitle: "Momentum",
  momentumApproaching: (floor: number) =>
    `Cities closest to going live (${floor} households each). Your opt-in moves the count.`,
  momentumWaiting: (floor: number) =>
    `Once a city reaches ${floor} opted-in households with a live probe, sample preview for that metro is replaced by real readings.`,
  householdsProgress: (count: number, floor: number) => `${count}/${floor} households`,
  moreToGo: (n: number) => ` · ${n} more to go live`,
  noSparse:
    "No sparse live cities yet: the next opted-in metros will show up here as they approach the floor.",
  coldestTitle: "Coldest cities",
  coldestMin: (f: number) => `min ${f.toFixed(1)}°F`,
  coldestAvg: (f: number) => ` · avg ${f.toFixed(1)}°F`,
  households: (n: number) => `${n} household${plural(n, "", "s")}`,
  hideSparse: (floor: number) => `Hide sparse cities (<${floor} households)`,
  showSparse: "Show sparse cities",
  hiddenCount: (n: number) => ` (${n} hidden)`,
  mapTitle: "Map",
  mapSubtitle:
    "Pin color reflects freeze-risk share (green = low, red = high). Toggle OpenWeather temperature or precipitation under the layers control.",
  loadingMap: "Loading map…",
  noSamples: "No city samples yet",
  noSamplesFloor: " that meet the sample floor",
  noSamplesUser: " Be the first to opt in from your household settings.",
  noSamplesGuest: " Create an account and opt in from Household settings to contribute.",
  thCity: "City",
  thTrend: "Trend",
  thTrendUnit: "(avg °F)",
  thHouseholds: "Households",
  thAvg: "Avg °F",
  thMin: "Min °F",
  thRisk: "Freeze-risk share",
  thRiskNote: "% of households ≤34°F",
  sparse: "Sparse",
  needsSnapshots: "Needs more snapshots",
  /** Table cell value in °F. */
  tableNumber: (f: number) => f.toFixed(1),
  riskOf: (risk: number, total: number) => `(${risk} of ${total})`,
  trendNoHistory: "No history yet",
  trendSteady: "Steady",
  /** Temperature change in °F (a difference: no 32° offset). */
  trendCooling: (deltaF: number) => `Cooling ${deltaF.toFixed(1)}°F`,
  trendWarming: (deltaF: number) => `Warming ${deltaF.toFixed(1)}°F`,
  tableNote:
    "Households = opted-in homes in that city for this snapshot. Freeze-risk share = households whose coldest probe was ≤34°F at capture. Trend is recent city average temperature across hourly snapshots.",
  findTitle: "Find your city",
  findSubtitle: "Search OpenWeather geocoding to see if your metro is on the map.",
  findUser: " Household owners opt in under Dashboard → Household.",
  findGuest: " Sign in to opt your household in.",
  searchLabel: "City search",
  searchPlaceholder: "Asheville, NC",
  embedTitle: "Embed & badge",
  embedLedeHtml:
    'Drop the map on a blog, Home Assistant dashboard, or README. Compact embed: <a class="text-link" href="/embed/freeze-map?compact=1">/embed/freeze-map?compact=1</a>.',
  embedCode: "Embed code",
  copyEmbed: "Copy embed",
  badgeLabel: "Markdown badge",
  copyBadge: "Copy badge",
  faqLede: "How the public map works and what stays private.",
  client: {
    layerMap: "Map",
    layerTemperature: "Temperature",
    layerPrecipitation: "Precipitation",
    popupAvg: "Avg",
    popupRisk: "Risk",
    popupHouseholds: "households",
    searchFailed: "Search failed.",
    copied: "Copied!",
    copyFailed: "Copy failed",
  },
};

type FreezeMapMessages = typeof en;

const fixed1 = (intl: string) => {
  const format = new Intl.NumberFormat(intl, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return (n: number) => format.format(n).replace("-", "−");
};
/** A temperature: "−2,1 °C (28,2 °F)". */
const tempC = (intl: string) => {
  const n = fixed1(intl);
  return (f: number) => `${n(((f - 32) * 5) / 9)} °C (${n(f)} °F)`;
};
/** A temperature difference: ×5/9, no offset. */
const deltaC = (intl: string) => {
  const n = fixed1(intl);
  return (f: number) => `${n((f * 5) / 9)} °C (${n(f)} °F)`;
};

const esT = tempC("es");
const esD = deltaC("es");
const es: FreezeMapMessages = {
  title: "Mapa de riesgo de helada",
  description:
    "Riesgo de helada por ciudad según hogares con sondas ProbeHarbor; vigila gratis tu espacio sin calefacción. Mapa comunitario, voluntario y anónimo.",
  breadcrumbHome: "Inicio",
  breadcrumb: "Mapa de heladas",
  kicker: "Comunidad",
  lede: "Mira si las sondas interiores de tu área metropolitana marcan frío esta semana y empieza gratis a vigilar tu garaje, sótano o taller. Solo promedios por ciudad: sin direcciones ni nombres de dispositivos.",
  optInHousehold: "Participar desde Household",
  optInStart: "Empieza gratis y suma tu ciudad",
  signIn: "Iniciar sesión",
  embed: "Insertar",
  freezeSeason: "Temporada de heladas",
  shareKit: "Kit para compartir",
  seedIntroHtml: (floor) =>
    `<strong>Mostrando datos de ejemplo</strong>: las lecturas reales de cada ciudad aparecen cuando participan suficientes hogares (${floor}+ sondas por ciudad).`,
  optInNone: "Todavía no participa ningún hogar: sé el primero en tu ciudad.",
  optInCount: (n) => (n === 1 ? "Por ahora participa 1 hogar." : `Por ahora participan ${n} hogares.`),
  linkOptIn: "Participar",
  linkCreate: "Crea una cuenta para contribuir",
  liveNotice: (n, floor) =>
    `Datos agregados en vivo · ${n} ${plural(n, "hogar contribuye", "hogares contribuyen")} · una ciudad necesita ${floor}+ muestras para aparecer por defecto`,
  lastSnapshot: (label) => ` · Última instantánea ${label}`,
  liveOptOut: ". Puedes dejar de participar cuando quieras desde Household.",
  momentumTitle: "Progreso",
  momentumApproaching: (floor) =>
    `Ciudades más cerca de mostrar datos reales (${floor} hogares cada una). Tu participación suma.`,
  momentumWaiting: (floor) =>
    `Cuando una ciudad llega a ${floor} hogares participantes con una sonda activa, la vista de ejemplo de esa ciudad se sustituye por lecturas reales.`,
  householdsProgress: (count, floor) => `${count}/${floor} hogares`,
  moreToGo: (n) => ` · ${plural(n, "falta 1", `faltan ${n}`)} para mostrar datos reales`,
  noSparse:
    "Aún no hay ciudades con pocos datos: las próximas ciudades participantes aparecerán aquí a medida que se acerquen al mínimo.",
  coldestTitle: "Ciudades más frías",
  coldestMin: (f) => `mín. ${esT(f)}`,
  coldestAvg: (f) => ` · prom. ${esT(f)}`,
  households: (n) => `${n} ${plural(n, "hogar", "hogares")}`,
  hideSparse: (floor) => `Ocultar ciudades con pocos datos (<${floor} hogares)`,
  showSparse: "Mostrar ciudades con pocos datos",
  hiddenCount: (n) => ` (${n} ${plural(n, "oculta", "ocultas")})`,
  mapTitle: "Mapa",
  mapSubtitle:
    "El color del marcador refleja la proporción con riesgo de helada (verde = baja, rojo = alta). Activa la temperatura o la precipitación de OpenWeather en el control de capas.",
  loadingMap: "Cargando el mapa…",
  noSamples: "Todavía no hay muestras de ciudades",
  noSamplesFloor: " que alcancen el mínimo de muestras",
  noSamplesUser: " Sé el primero en participar desde la configuración de tu hogar.",
  noSamplesGuest: " Crea una cuenta y participa desde la configuración de Household para contribuir.",
  thCity: "Ciudad",
  thTrend: "Tendencia",
  thTrendUnit: "(prom. °F)",
  thHouseholds: "Hogares",
  thAvg: "Prom. °F",
  thMin: "Mín. °F",
  thRisk: "Proporción con riesgo",
  thRiskNote: "% de hogares a ≤1 °C (34 °F)",
  sparse: "Pocos datos",
  needsSnapshots: "Faltan instantáneas",
  tableNumber: fixed1("es"),
  riskOf: (risk, total) => `(${risk} de ${total})`,
  trendNoHistory: "Sin historial aún",
  trendSteady: "Estable",
  trendCooling: (d) => `Enfriándose ${esD(d)}`,
  trendWarming: (d) => `Calentándose ${esD(d)}`,
  tableNote:
    "Hogares = viviendas participantes en esa ciudad en esta instantánea. Proporción con riesgo = hogares cuya sonda más fría estaba a ≤1 °C (34 °F) en el momento de la captura. La tendencia es la temperatura media reciente de la ciudad en las instantáneas horarias.",
  findTitle: "Busca tu ciudad",
  findSubtitle: "Busca con la geocodificación de OpenWeather para ver si tu ciudad está en el mapa.",
  findUser: " Los titulares del hogar participan en Dashboard → Household.",
  findGuest: " Inicia sesión para sumar tu hogar.",
  searchLabel: "Buscar ciudad",
  searchPlaceholder: "Asheville, NC",
  embedTitle: "Insertar y distintivo",
  embedLedeHtml:
    'Pon el mapa en un blog, un panel de Home Assistant o un README. Versión compacta: <a class="text-link" href="/embed/freeze-map?compact=1">/embed/freeze-map?compact=1</a>.',
  embedCode: "Código para insertar",
  copyEmbed: "Copiar código",
  badgeLabel: "Distintivo Markdown",
  copyBadge: "Copiar distintivo",
  faqLede: "Cómo funciona el mapa público y qué sigue siendo privado.",
  client: {
    layerMap: "Mapa",
    layerTemperature: "Temperatura",
    layerPrecipitation: "Precipitación",
    popupAvg: "Prom.",
    popupRisk: "Riesgo",
    popupHouseholds: "hogares",
    searchFailed: "La búsqueda falló.",
    copied: "¡Copiado!",
    copyFailed: "No se pudo copiar",
  },
};

const frT = tempC("fr-FR");
const frD = deltaC("fr-FR");
const fr: FreezeMapMessages = {
  title: "Carte du risque de gel",
  description:
    "Le risque de gel par ville d’après les foyers équipés de sondes ProbeHarbor ; suivez gratuitement votre espace non chauffé. Carte communautaire anonyme.",
  breadcrumbHome: "Accueil",
  breadcrumb: "Carte du gel",
  kicker: "Communauté",
  lede: "Voyez si les sondes intérieures de votre agglomération affichent du froid cette semaine, puis commencez gratuitement à suivre votre garage, vide sanitaire ou atelier. Moyennes par ville uniquement : ni adresse ni nom d’appareil.",
  optInHousehold: "Participer depuis Household",
  optInStart: "Commencer gratuitement et inscrire votre ville",
  signIn: "Se connecter",
  embed: "Intégrer",
  freezeSeason: "Saison du gel",
  shareKit: "Kit de partage",
  seedIntroHtml: (floor) =>
    `<strong>Données d’exemple affichées</strong> : les relevés réels d’une ville apparaissent dès que suffisamment de foyers participent (${floor}+ sondes par ville).`,
  optInNone: "Aucun foyer ne participe encore : soyez le premier de votre agglomération.",
  optInCount: (n) => (n === 1 ? "1 foyer participe pour l’instant." : `${n} foyers participent pour l’instant.`),
  linkOptIn: "Participer",
  linkCreate: "Créez un compte pour contribuer",
  liveNotice: (n, floor) =>
    `Agrégats en direct des participants · ${n} ${plural(n, "foyer contributeur", "foyers contributeurs")} · une ville doit compter ${floor}+ relevés pour figurer par défaut`,
  lastSnapshot: (label) => ` · Dernier relevé ${label}`,
  liveOptOut: ". Désinscription à tout moment dans Household.",
  momentumTitle: "Progression",
  momentumApproaching: (floor) =>
    `Villes les plus proches de l’affichage réel (${floor} foyers chacune). Votre participation fait avancer le compteur.`,
  momentumWaiting: (floor) =>
    `Dès qu’une ville atteint ${floor} foyers participants avec une sonde active, l’aperçu d’exemple de cette agglomération est remplacé par des relevés réels.`,
  householdsProgress: (count, floor) => `${count}/${floor} foyers`,
  moreToGo: (n) => ` · encore ${n} avant l’affichage réel`,
  noSparse:
    "Aucune ville peu fournie pour l’instant : les prochaines agglomérations participantes apparaîtront ici à mesure qu’elles approchent du seuil.",
  coldestTitle: "Villes les plus froides",
  coldestMin: (f) => `min. ${frT(f)}`,
  coldestAvg: (f) => ` · moy. ${frT(f)}`,
  households: (n) => `${n} ${plural(n, "foyer", "foyers")}`,
  hideSparse: (floor) => `Masquer les villes peu fournies (<${floor} foyers)`,
  showSparse: "Afficher les villes peu fournies",
  hiddenCount: (n) => ` (${n} ${plural(n, "masquée", "masquées")})`,
  mapTitle: "Carte",
  mapSubtitle:
    "La couleur du repère reflète la part à risque de gel (vert = faible, rouge = élevée). Affichez la température ou les précipitations OpenWeather via le sélecteur de calques.",
  loadingMap: "Chargement de la carte…",
  noSamples: "Pas encore de relevés par ville",
  noSamplesFloor: " atteignant le seuil minimal",
  noSamplesUser: " Soyez le premier à participer depuis les réglages de votre foyer.",
  noSamplesGuest: " Créez un compte et participez depuis les réglages Household pour contribuer.",
  thCity: "Ville",
  thTrend: "Tendance",
  thTrendUnit: "(moy. °F)",
  thHouseholds: "Foyers",
  thAvg: "Moy. °F",
  thMin: "Min. °F",
  thRisk: "Part à risque de gel",
  thRiskNote: "% des foyers à ≤1 °C (34 °F)",
  sparse: "Peu fournie",
  needsSnapshots: "Relevés insuffisants",
  tableNumber: fixed1("fr-FR"),
  riskOf: (risk, total) => `(${risk} sur ${total})`,
  trendNoHistory: "Pas encore d’historique",
  trendSteady: "Stable",
  trendCooling: (d) => `En baisse de ${frD(d)}`,
  trendWarming: (d) => `En hausse de ${frD(d)}`,
  tableNote:
    "Foyers = logements participants dans cette ville pour ce relevé. Part à risque de gel = foyers dont la sonde la plus froide était à ≤1 °C (34 °F) au moment du relevé. La tendance correspond à la température moyenne récente de la ville sur les relevés horaires.",
  findTitle: "Trouver votre ville",
  findSubtitle: "Recherchez via le géocodage OpenWeather pour voir si votre agglomération figure sur la carte.",
  findUser: " Les titulaires du foyer participent dans Dashboard → Household.",
  findGuest: " Connectez-vous pour inscrire votre foyer.",
  searchLabel: "Rechercher une ville",
  searchPlaceholder: "Asheville, NC",
  embedTitle: "Intégration et badge",
  embedLedeHtml:
    'Ajoutez la carte à un blog, un tableau de bord Home Assistant ou un README. Version compacte : <a class="text-link" href="/embed/freeze-map?compact=1">/embed/freeze-map?compact=1</a>.',
  embedCode: "Code d’intégration",
  copyEmbed: "Copier le code",
  badgeLabel: "Badge Markdown",
  copyBadge: "Copier le badge",
  faqLede: "Comment fonctionne la carte publique et ce qui reste privé.",
  client: {
    layerMap: "Carte",
    layerTemperature: "Température",
    layerPrecipitation: "Précipitations",
    popupAvg: "Moy.",
    popupRisk: "Risque",
    popupHouseholds: "foyers",
    searchFailed: "La recherche a échoué.",
    copied: "Copié !",
    copyFailed: "Échec de la copie",
  },
};

const deT = tempC("de-DE");
const deD = deltaC("de-DE");
const de: FreezeMapMessages = {
  title: "Frostrisiko-Karte",
  description:
    "Frostrisiko pro Stadt aus Haushalten mit ProbeHarbor-Sonden; überwache deinen unbeheizten Raum kostenlos. Freiwillige, anonymisierte Community-Karte.",
  breadcrumbHome: "Startseite",
  breadcrumb: "Frostkarte",
  kicker: "Community",
  lede: "Sieh, ob die Innensonden in deiner Region diese Woche kalt laufen, und überwache dann kostenlos deine eigene Garage, deinen Kriechkeller oder deine Werkstatt. Nur Stadtdurchschnitte, keine Adressen oder Gerätenamen.",
  optInHousehold: "Unter Household mitmachen",
  optInStart: "Kostenlos starten und deine Stadt anmelden",
  signIn: "Anmelden",
  embed: "Einbetten",
  freezeSeason: "Frostsaison",
  shareKit: "Share-Kit",
  seedIntroHtml: (floor) =>
    `<strong>Beispieldaten</strong>: Echte Stadtwerte erscheinen, sobald genug Haushalte mitmachen (${floor}+ Sonden pro Stadt).`,
  optInNone: "Noch macht kein Haushalt mit: Sei der Erste in deiner Region.",
  optInCount: (n) => (n === 1 ? "Bisher macht 1 Haushalt mit." : `Bisher machen ${n} Haushalte mit.`),
  linkOptIn: "Mitmachen",
  linkCreate: "Erstelle ein Konto, um beizutragen",
  liveNotice: (n, floor) =>
    `Live-Daten der Teilnehmer · ${n} ${plural(n, "Haushalt trägt", "Haushalte tragen")} bei · Städte brauchen ${floor}+ Messwerte, um standardmäßig gelistet zu werden`,
  lastSnapshot: (label) => ` · Letzter Stand ${label}`,
  liveOptOut: ". Abmelden jederzeit unter Household.",
  momentumTitle: "Fortschritt",
  momentumApproaching: (floor) =>
    `Städte, die am nächsten an echten Daten sind (je ${floor} Haushalte). Deine Teilnahme bringt den Zähler voran.`,
  momentumWaiting: (floor) =>
    `Sobald eine Stadt ${floor} teilnehmende Haushalte mit aktiver Sonde hat, ersetzen echte Messwerte die Beispielvorschau für diese Region.`,
  householdsProgress: (count, floor) => `${count}/${floor} Haushalte`,
  moreToGo: (n) => ` · noch ${n} bis zu echten Daten`,
  noSparse:
    "Noch keine Städte mit wenigen Daten: Die nächsten teilnehmenden Regionen erscheinen hier, sobald sie sich der Mindestzahl nähern.",
  coldestTitle: "Kälteste Städte",
  coldestMin: (f) => `min. ${deT(f)}`,
  coldestAvg: (f) => ` · Ø ${deT(f)}`,
  households: (n) => `${n} ${plural(n, "Haushalt", "Haushalte")}`,
  hideSparse: (floor) => `Städte mit wenigen Daten ausblenden (<${floor} Haushalte)`,
  showSparse: "Städte mit wenigen Daten anzeigen",
  hiddenCount: (n) => ` (${n} ausgeblendet)`,
  mapTitle: "Karte",
  mapSubtitle:
    "Die Farbe der Markierung zeigt den Anteil mit Frostrisiko (grün = gering, rot = hoch). Blende Temperatur oder Niederschlag von OpenWeather über die Ebenenauswahl ein.",
  loadingMap: "Karte wird geladen…",
  noSamples: "Noch keine Stadtwerte",
  noSamplesFloor: ", die die Mindestzahl erreichen",
  noSamplesUser: " Mach als Erster in deinen Haushaltseinstellungen mit.",
  noSamplesGuest: " Erstelle ein Konto und mach in den Household-Einstellungen mit, um beizutragen.",
  thCity: "Stadt",
  thTrend: "Trend",
  thTrendUnit: "(Ø °F)",
  thHouseholds: "Haushalte",
  thAvg: "Ø °F",
  thMin: "Min. °F",
  thRisk: "Anteil mit Frostrisiko",
  thRiskNote: "% der Haushalte bei ≤1 °C (34 °F)",
  sparse: "Wenige Daten",
  needsSnapshots: "Braucht mehr Datenpunkte",
  tableNumber: fixed1("de-DE"),
  riskOf: (risk, total) => `(${risk} von ${total})`,
  trendNoHistory: "Noch kein Verlauf",
  trendSteady: "Stabil",
  trendCooling: (d) => `Kühlt ab um ${deD(d)}`,
  trendWarming: (d) => `Wärmer um ${deD(d)}`,
  tableNote:
    "Haushalte = teilnehmende Haushalte in dieser Stadt zu diesem Stand. Anteil mit Frostrisiko = Haushalte, deren kälteste Sonde beim Erfassen ≤1 °C (34 °F) zeigte. Der Trend ist die jüngste Durchschnittstemperatur der Stadt über die stündlichen Stände.",
  findTitle: "Finde deine Stadt",
  findSubtitle: "Suche über das Geocoding von OpenWeather, ob deine Region auf der Karte ist.",
  findUser: " Haushaltsinhaber machen unter Dashboard → Household mit.",
  findGuest: " Melde dich an, um deinen Haushalt anzumelden.",
  searchLabel: "Stadtsuche",
  searchPlaceholder: "Asheville, NC",
  embedTitle: "Einbetten & Badge",
  embedLedeHtml:
    'Bau die Karte in einen Blog, ein Home-Assistant-Dashboard oder eine README ein. Kompakte Version: <a class="text-link" href="/embed/freeze-map?compact=1">/embed/freeze-map?compact=1</a>.',
  embedCode: "Einbettungscode",
  copyEmbed: "Code kopieren",
  badgeLabel: "Markdown-Badge",
  copyBadge: "Badge kopieren",
  faqLede: "Wie die öffentliche Karte funktioniert und was privat bleibt.",
  client: {
    layerMap: "Karte",
    layerTemperature: "Temperatur",
    layerPrecipitation: "Niederschlag",
    popupAvg: "Ø",
    popupRisk: "Risiko",
    popupHouseholds: "Haushalte",
    searchFailed: "Suche fehlgeschlagen.",
    copied: "Kopiert!",
    copyFailed: "Kopieren fehlgeschlagen",
  },
};

const ptT = tempC("pt-BR");
const ptD = deltaC("pt-BR");
const ptBr: FreezeMapMessages = {
  title: "Mapa de risco de congelamento",
  description:
    "Risco de congelamento por cidade a partir de domicílios com sondas ProbeHarbor; monitore grátis seu espaço sem aquecimento. Mapa comunitário e anônimo.",
  breadcrumbHome: "Início",
  breadcrumb: "Mapa de congelamento",
  kicker: "Comunidade",
  lede: "Veja se as sondas internas da sua região estão marcando frio esta semana e comece a monitorar grátis sua garagem, porão ou oficina. Só médias por cidade, sem endereços nem nomes de dispositivos.",
  optInHousehold: "Participar pelo Household",
  optInStart: "Comece grátis e inclua sua cidade",
  signIn: "Entrar",
  embed: "Incorporar",
  freezeSeason: "Temporada de congelamento",
  shareKit: "Kit de divulgação",
  seedIntroHtml: (floor) =>
    `<strong>Mostrando dados de exemplo</strong>: as leituras reais de cada cidade aparecem quando domicílios suficientes participam (${floor}+ sondas por cidade).`,
  optInNone: "Nenhum domicílio participa ainda: seja o primeiro da sua região.",
  optInCount: (n) => (n === 1 ? "Até agora, 1 domicílio participa." : `Até agora, ${n} domicílios participam.`),
  linkOptIn: "Participar",
  linkCreate: "Crie uma conta para contribuir",
  liveNotice: (n, floor) =>
    `Dados agregados ao vivo · ${n} ${plural(n, "domicílio contribuindo", "domicílios contribuindo")} · cidades precisam de ${floor}+ amostras para aparecer por padrão`,
  lastSnapshot: (label) => ` · Último retrato ${label}`,
  liveOptOut: ". Saia quando quiser pelo Household.",
  momentumTitle: "Progresso",
  momentumApproaching: (floor) =>
    `Cidades mais perto de mostrar dados reais (${floor} domicílios cada). Sua participação aumenta a contagem.`,
  momentumWaiting: (floor) =>
    `Quando uma cidade chega a ${floor} domicílios participantes com uma sonda ativa, a prévia de exemplo dessa região é substituída por leituras reais.`,
  householdsProgress: (count, floor) => `${count}/${floor} domicílios`,
  moreToGo: (n) => ` · ${plural(n, "falta 1", `faltam ${n}`)} para mostrar dados reais`,
  noSparse:
    "Ainda não há cidades com poucos dados: as próximas regiões participantes vão aparecer aqui à medida que se aproximarem do mínimo.",
  coldestTitle: "Cidades mais frias",
  coldestMin: (f) => `mín. ${ptT(f)}`,
  coldestAvg: (f) => ` · média ${ptT(f)}`,
  households: (n) => `${n} ${plural(n, "domicílio", "domicílios")}`,
  hideSparse: (floor) => `Ocultar cidades com poucos dados (<${floor} domicílios)`,
  showSparse: "Mostrar cidades com poucos dados",
  hiddenCount: (n) => ` (${n} ${plural(n, "oculta", "ocultas")})`,
  mapTitle: "Mapa",
  mapSubtitle:
    "A cor do marcador indica a parcela com risco de congelamento (verde = baixa, vermelho = alta). Ative a temperatura ou a precipitação do OpenWeather no controle de camadas.",
  loadingMap: "Carregando o mapa…",
  noSamples: "Ainda não há amostras de cidades",
  noSamplesFloor: " que atinjam o mínimo de amostras",
  noSamplesUser: " Seja o primeiro a participar pelas configurações do seu domicílio.",
  noSamplesGuest: " Crie uma conta e participe pelas configurações do Household para contribuir.",
  thCity: "Cidade",
  thTrend: "Tendência",
  thTrendUnit: "(média °F)",
  thHouseholds: "Domicílios",
  thAvg: "Média °F",
  thMin: "Mín. °F",
  thRisk: "Parcela em risco",
  thRiskNote: "% dos domicílios a ≤1 °C (34 °F)",
  sparse: "Poucos dados",
  needsSnapshots: "Faltam retratos",
  tableNumber: fixed1("pt-BR"),
  riskOf: (risk, total) => `(${risk} de ${total})`,
  trendNoHistory: "Ainda sem histórico",
  trendSteady: "Estável",
  trendCooling: (d) => `Esfriando ${ptD(d)}`,
  trendWarming: (d) => `Esquentando ${ptD(d)}`,
  tableNote:
    "Domicílios = residências participantes nessa cidade neste retrato. Parcela em risco = domicílios cuja sonda mais fria estava a ≤1 °C (34 °F) no momento da captura. A tendência é a temperatura média recente da cidade nos retratos de hora em hora.",
  findTitle: "Encontre sua cidade",
  findSubtitle: "Pesquise com a geocodificação do OpenWeather para ver se sua região está no mapa.",
  findUser: " Os responsáveis pelo domicílio participam em Dashboard → Household.",
  findGuest: " Entre para incluir seu domicílio.",
  searchLabel: "Buscar cidade",
  searchPlaceholder: "Asheville, NC",
  embedTitle: "Incorporar e selo",
  embedLedeHtml:
    'Coloque o mapa num blog, num painel do Home Assistant ou num README. Versão compacta: <a class="text-link" href="/embed/freeze-map?compact=1">/embed/freeze-map?compact=1</a>.',
  embedCode: "Código de incorporação",
  copyEmbed: "Copiar código",
  badgeLabel: "Selo Markdown",
  copyBadge: "Copiar selo",
  faqLede: "Como funciona o mapa público e o que continua privado.",
  client: {
    layerMap: "Mapa",
    layerTemperature: "Temperatura",
    layerPrecipitation: "Precipitação",
    popupAvg: "Média",
    popupRisk: "Risco",
    popupHouseholds: "domicílios",
    searchFailed: "A busca falhou.",
    copied: "Copiado!",
    copyFailed: "Falha ao copiar",
  },
};

export const freezeMapMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

/**
 * Snapshot age for the freeze map. English is `formatRelativeAge` unchanged;
 * other locales use Intl.RelativeTimeFormat with the same thresholds
 * (minutes under an hour, hours under 48, then days).
 */
export function formatFreezeMapAge(
  iso: string | null,
  locale: Locale,
): { label: string; absolute: string | null } {
  const english = formatRelativeAge(iso, "not yet");
  if (locale === "en" || !iso) return english;
  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) return english;
  const intl = LOCALE_META[locale].intl;
  const rtf = new Intl.RelativeTimeFormat(intl, { numeric: "auto" });
  const minutes = Math.floor((Date.now() - parsed) / 60000);
  let label: string;
  if (minutes < 1) label = rtf.format(0, "second");
  else if (minutes < 60) label = rtf.format(-minutes, "minute");
  else {
    const hours = Math.floor(minutes / 60);
    label = hours < 48 ? rtf.format(-hours, "hour") : rtf.format(-Math.floor(hours / 24), "day");
  }
  return { label, absolute: new Date(parsed).toLocaleString(intl) };
}

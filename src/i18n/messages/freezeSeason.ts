import type { AboutFaqItem } from "../../lib/aboutFaqs";
import { COLD_SNAP_CHECKLIST } from "../../lib/coldSnapChecklist";
import { defineMessages } from "../translate";

/**
 * /freeze-season page copy. `checklist` is a localized copy of
 * COLD_SNAP_CHECKLIST (src/lib/coldSnapChecklist.ts), same order and length;
 * English reuses the lib array so the two never drift.
 */
const en = {
  title: "Freeze season probe watch",
  description:
    "Set freeze alerts before the cold snap. Live community freeze map, ESP probe ingest, and email (SMS on Pro) when indoor temps drop toward 32°F.",
  breadcrumbHome: "Home",
  breadcrumb: "Freeze season",
  kicker: "Seasonal",
  seasonHere: "Freeze season is here",
  seasonAhead: "Get ready before freeze season",
  lede: "Pipe freezes happen in spaces you do not walk through every hour. Put a probe where the water is, set a threshold a few degrees above 32°F, and get a clock for when this space hits freeze, plus an alert while you still have hours to act.",
  openAlerts: "Open alert essentials",
  startFree: "Start free: connect a probe",
  communityMap: "Community freeze map",
  checklistTitle: "Tonight’s checklist",
  checklist: COLD_SNAP_CHECKLIST as string[],
  checklistOptionalHtml:
    'Optional: opt your city into the <a class="text-link" href="/freeze-map">public freeze map</a>.',
  sampleColdest: "Sample coldest cities",
  liveColdest: "Coldest opt-in cities",
  sampleNote: "Illustrative preview until enough households opt into the freeze map.",
  liveNote: "From the latest ProbeHarbor freeze-map snapshot.",
  /** "min 12.3°F" after a city name. */
  minTemp: (f: number) => `min ${f.toFixed(1)}°F`,
  viewMap: "View full map",
  indoorTitle: "Why indoor probes beat outdoor weather alone",
  indoorBody:
    "A Tempest or airport reading says how cold the yard is. Your pipes care about the unheated bay, the leaky door, and the failed space heater. ProbeHarbor watches that space, and can sit next to outdoor weather on your dashboard for context.",
  vsWeather: "vs outdoor weather stations",
  partsList: "ESP32 + DS18B20 parts list",
  stories: "Read freeze stories",
  demo: "Try the live demo",
  faqLede: "Seasonal freeze prep for homeowners with probes in cold spaces.",
  howToName: "Prepare ProbeHarbor for a freeze night",
  howToStep: (n: number) => `Checklist step ${n}`,
  howToMapName: "Opt into the freeze map (optional)",
  howToMapText:
    "Share anonymized city-level probe samples on the public freeze map so neighbors see regional risk.",
  faqs: [
    {
      question: "When is freeze season for ProbeHarbor?",
      answer:
        "Treat November through March as primary freeze season in most of the contiguous US. Coastal and mountain climates vary; use your coldest nights and NWS freeze warnings as the real signal.",
    },
    {
      question: "Why not rely on outdoor weather alone?",
      answer:
        "Outdoor stations measure the yard. Pipes freeze in unheated bays, crawlspaces, and shops that lag outdoor air. Put a probe where the water is, then use outdoor weather for context.",
    },
    {
      question: "What should I do tonight before a cold snap?",
      answer:
        "Drip exterior-wall faucets if lines run cold, close propped doors, insulate spigots, confirm freeze alerts with a test, and verify a probe sits in the coldest corner near pipes. Checklist on this page.",
    },
    {
      question: "Where is the ESP32 parts list?",
      answer:
        "probeharbor.dev/about/esp32-freeze-kit — ESP32 + waterproof DS18B20 BOM, wiring, and flash steps.",
    },
  ] as AboutFaqItem[],
};

type FreezeSeasonMessages = typeof en;

const decimal = (intl: string) => (f: number) =>
  new Intl.NumberFormat(intl, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(f);
/** °C first with °F in parentheses, e.g. "−2,1 °C (28,2 °F)". */
const celsiusFirst = (intl: string) => {
  const fmt = decimal(intl);
  return (f: number) => `${fmt(((f - 32) * 5) / 9).replace("-", "−")} °C (${fmt(f).replace("-", "−")} °F)`;
};

const es: FreezeSeasonMessages = {
  title: "Vigilancia de heladas con sondas",
  description:
    "Activa alertas de helada antes de la ola de frío: mapa comunitario, sondas ESP y correo (SMS en Pro) cuando el interior baja hacia 0 °C (32 °F).",
  breadcrumbHome: "Inicio",
  breadcrumb: "Temporada de heladas",
  kicker: "Temporada",
  seasonHere: "Llegó la temporada de heladas",
  seasonAhead: "Prepárate antes de la temporada de heladas",
  lede: "Las tuberías se congelan en espacios por los que no pasas cada hora. Pon una sonda donde está el agua, fija un umbral unos grados por encima de 0 °C (32 °F) y obtén un reloj que te dice cuándo este espacio llegará a la helada, además de una alerta cuando aún te quedan horas para actuar.",
  openAlerts: "Abrir lo esencial de alertas",
  startFree: "Empieza gratis: conecta una sonda",
  communityMap: "Mapa comunitario de heladas",
  checklistTitle: "La lista de esta noche",
  checklist: [
    "Deja gotear los grifos de las paredes exteriores si las tuberías pasan por espacios fríos.",
    "Revisa los burletes de las puertas (garaje, taller, acceso al sótano) y cierra las que estén abiertas.",
    "Aísla los grifos exteriores y desconecta las mangueras del jardín.",
    "Confirma que las alertas de helada están activadas y envía una prueba si hace tiempo que no lo haces.",
    "Comprueba que haya una sonda en el rincón más frío, cerca de las tuberías o de lo que tengas guardado.",
  ],
  checklistOptionalHtml:
    'Opcional: suma tu ciudad al <a class="text-link" href="/freeze-map">mapa público de heladas</a>.',
  sampleColdest: "Ciudades más frías (ejemplo)",
  liveColdest: "Ciudades participantes más frías",
  sampleNote: "Vista previa ilustrativa hasta que suficientes hogares se sumen al mapa de heladas.",
  liveNote: "De la última instantánea del mapa de heladas de ProbeHarbor.",
  minTemp: (f) => `mín. ${celsiusFirst("es")(f)}`,
  viewMap: "Ver el mapa completo",
  indoorTitle: "Por qué las sondas interiores superan al tiempo exterior por sí solo",
  indoorBody:
    "Una lectura de Tempest o del aeropuerto dice cuánto frío hace en el jardín. A tus tuberías les importan el espacio sin calefacción, la puerta que no cierra bien y el calefactor que se averió. ProbeHarbor vigila ese espacio y puede mostrarse junto al tiempo exterior en tu panel para darte contexto.",
  vsWeather: "Frente a estaciones meteorológicas",
  partsList: "Lista de piezas ESP32 + DS18B20",
  stories: "Lee historias de heladas",
  demo: "Prueba la demo en vivo",
  faqLede: "Preparación para la temporada de heladas para propietarios con sondas en espacios fríos.",
  howToName: "Prepara ProbeHarbor para una noche de helada",
  howToStep: (n) => `Paso ${n} de la lista`,
  howToMapName: "Súmate al mapa de heladas (opcional)",
  howToMapText:
    "Comparte muestras anónimas de tus sondas a nivel de ciudad en el mapa público de heladas para que tus vecinos vean el riesgo en la región.",
  faqs: [
    {
      question: "¿Cuándo es la temporada de heladas para ProbeHarbor?",
      answer:
        "Considera de noviembre a marzo como la temporada principal de heladas en la mayor parte de los EE. UU. continentales. Los climas costeros y de montaña varían; usa tus noches más frías y los avisos de helada del NWS (servicio meteorológico de EE. UU.) como la señal real.",
    },
    {
      question: "¿Por qué no basta con el tiempo exterior?",
      answer:
        "Las estaciones exteriores miden el jardín. Las tuberías se congelan en espacios sin calefacción, sótanos y talleres que van por detrás del aire exterior. Pon una sonda donde está el agua y usa el tiempo exterior como contexto.",
    },
    {
      question: "¿Qué debo hacer esta noche antes de una ola de frío?",
      answer:
        "Deja gotear los grifos de paredes exteriores si las tuberías están frías, cierra las puertas abiertas, aísla los grifos exteriores, confirma las alertas de helada con una prueba y comprueba que haya una sonda en el rincón más frío cerca de las tuberías. La lista está en esta página.",
    },
    {
      question: "¿Dónde está la lista de piezas del ESP32?",
      answer:
        "probeharbor.dev/about/esp32-freeze-kit: lista de materiales con ESP32 + DS18B20 impermeable, cableado y pasos para instalar el firmware.",
    },
  ],
};

const fr: FreezeSeasonMessages = {
  title: "Surveillance du gel par sonde",
  description:
    "Activez les alertes de gel avant la vague de froid : carte communautaire, sondes ESP et e-mail (SMS avec Pro) quand l’intérieur approche 0 °C (32 °F).",
  breadcrumbHome: "Accueil",
  breadcrumb: "Saison du gel",
  kicker: "Saisonnier",
  seasonHere: "La saison du gel est là",
  seasonAhead: "Préparez-vous avant la saison du gel",
  lede: "Les canalisations gèlent dans des espaces où vous ne passez pas toutes les heures. Placez une sonde là où se trouve l’eau, fixez un seuil quelques degrés au-dessus de 0 °C (32 °F) et obtenez un compte à rebours jusqu’au gel de cet espace, ainsi qu’une alerte tant qu’il vous reste des heures pour agir.",
  openAlerts: "Ouvrir les réglages d’alerte essentiels",
  startFree: "Commencer gratuitement : connecter une sonde",
  communityMap: "Carte communautaire du gel",
  checklistTitle: "La check-list de ce soir",
  checklist: [
    "Laissez goutter les robinets des murs extérieurs si des conduites passent par des espaces froids.",
    "Vérifiez les joints des portes (garage, atelier, accès au vide sanitaire) et fermez les portes restées ouvertes.",
    "Isolez les robinets extérieurs et débranchez les tuyaux d’arrosage.",
    "Vérifiez que les alertes de gel sont activées et envoyez un test si vous ne l’avez pas fait récemment.",
    "Assurez-vous qu’une sonde se trouve dans le coin le plus froid, près des canalisations ou des affaires stockées.",
  ],
  checklistOptionalHtml:
    'Facultatif : inscrivez votre ville sur la <a class="text-link" href="/freeze-map">carte publique du gel</a>.',
  sampleColdest: "Villes les plus froides (exemple)",
  liveColdest: "Villes participantes les plus froides",
  sampleNote: "Aperçu illustratif en attendant que suffisamment de foyers rejoignent la carte du gel.",
  liveNote: "D’après le dernier relevé de la carte du gel ProbeHarbor.",
  minTemp: (f) => `min. ${celsiusFirst("fr-FR")(f)}`,
  viewMap: "Voir la carte complète",
  indoorTitle: "Pourquoi les sondes intérieures valent mieux que la météo extérieure seule",
  indoorBody:
    "Un relevé Tempest ou d’aéroport indique le froid qu’il fait dans le jardin. Vos canalisations, elles, dépendent de l’espace non chauffé, de la porte qui ferme mal et du radiateur d’appoint tombé en panne. ProbeHarbor surveille cet espace et peut s’afficher à côté de la météo extérieure dans votre tableau de bord pour le contexte.",
  vsWeather: "Face aux stations météo extérieures",
  partsList: "Liste des pièces ESP32 + DS18B20",
  stories: "Lire des histoires de gel",
  demo: "Essayer la démo en direct",
  faqLede: "Préparer la saison du gel quand on a des sondes dans des espaces froids.",
  howToName: "Préparer ProbeHarbor pour une nuit de gel",
  howToStep: (n) => `Étape ${n} de la check-list`,
  howToMapName: "Rejoindre la carte du gel (facultatif)",
  howToMapText:
    "Partagez des relevés de sonde anonymisés à l’échelle de la ville sur la carte publique du gel pour que vos voisins voient le risque régional.",
  faqs: [
    {
      question: "Quand commence la saison du gel pour ProbeHarbor ?",
      answer:
        "Considérez novembre à mars comme la principale saison du gel dans la majeure partie des États-Unis continentaux. Les climats côtiers et montagnards varient ; fiez-vous à vos nuits les plus froides et aux avis de gel du NWS (le service météo américain).",
    },
    {
      question: "Pourquoi ne pas se fier à la seule météo extérieure ?",
      answer:
        "Les stations extérieures mesurent le jardin. Les canalisations gèlent dans des espaces non chauffés, des vides sanitaires et des ateliers qui réagissent avec retard à l’air extérieur. Placez une sonde là où se trouve l’eau, puis servez-vous de la météo extérieure comme contexte.",
    },
    {
      question: "Que faire ce soir avant une vague de froid ?",
      answer:
        "Laissez goutter les robinets des murs extérieurs si les conduites sont froides, fermez les portes restées ouvertes, isolez les robinets extérieurs, vérifiez les alertes de gel avec un test et assurez-vous qu’une sonde se trouve dans le coin le plus froid près des canalisations. La check-list est sur cette page.",
    },
    {
      question: "Où trouver la liste des pièces ESP32 ?",
      answer:
        "probeharbor.dev/about/esp32-freeze-kit : nomenclature ESP32 + DS18B20 étanche, câblage et étapes de flashage.",
    },
  ],
};

const de: FreezeSeasonMessages = {
  title: "Frostsaison: Sondenwache",
  description:
    "Richte Frostalarme vor der Kältewelle ein. Live-Frostkarte der Community, ESP-Sonden und E-Mail (SMS bei Pro), wenn es drinnen Richtung 0 °C (32 °F) geht.",
  breadcrumbHome: "Startseite",
  breadcrumb: "Frostsaison",
  kicker: "Saisonal",
  seasonHere: "Die Frostsaison ist da",
  seasonAhead: "Mach dich bereit, bevor die Frostsaison kommt",
  lede: "Rohre frieren in Räumen ein, durch die du nicht jede Stunde gehst. Setz eine Sonde dorthin, wo das Wasser ist, stell eine Schwelle ein paar Grad über 0 °C (32 °F) ein und bekomm eine Uhr, die zeigt, wann dieser Raum den Gefrierpunkt erreicht, dazu einen Alarm, solange du noch Stunden zum Handeln hast.",
  openAlerts: "Wichtigste Alarmeinstellungen öffnen",
  startFree: "Kostenlos starten: Sonde verbinden",
  communityMap: "Frostkarte der Community",
  checklistTitle: "Die Checkliste für heute Nacht",
  checklist: [
    "Lass Wasserhähne an Außenwänden tropfen, wenn Zuleitungen durch kalte Räume laufen.",
    "Prüfe die Türdichtungen (Garage, Werkstatt, Kriechkellerzugang) und schließ offen stehende Türen.",
    "Dämme Außenwasserhähne und nimm Gartenschläuche ab.",
    "Prüfe, ob Frostalarme aktiv sind, und schick einen Testalarm, wenn das schon länger her ist.",
    "Stell sicher, dass eine Sonde in der kältesten Ecke nahe an Rohren oder Lagergut sitzt.",
  ],
  checklistOptionalHtml:
    'Optional: Melde deine Stadt für die <a class="text-link" href="/freeze-map">öffentliche Frostkarte</a> an.',
  sampleColdest: "Kälteste Städte (Beispiel)",
  liveColdest: "Kälteste teilnehmende Städte",
  sampleNote: "Beispielvorschau, bis genug Haushalte bei der Frostkarte mitmachen.",
  liveNote: "Aus dem neuesten Stand der ProbeHarbor-Frostkarte.",
  minTemp: (f) => `min. ${celsiusFirst("de-DE")(f)}`,
  viewMap: "Ganze Karte ansehen",
  indoorTitle: "Warum Innensonden mehr bringen als das Außenwetter allein",
  indoorBody:
    "Ein Tempest- oder Flughafen-Messwert sagt, wie kalt es im Garten ist. Für deine Rohre zählen der unbeheizte Raum, die undichte Tür und der ausgefallene Heizlüfter. ProbeHarbor überwacht genau diesen Raum und kann zur Einordnung neben dem Außenwetter in deinem Dashboard stehen.",
  vsWeather: "Im Vergleich zu Wetterstationen",
  partsList: "Teileliste ESP32 + DS18B20",
  stories: "Frostgeschichten lesen",
  demo: "Live-Demo ausprobieren",
  faqLede: "Frostvorsorge für Hausbesitzer mit Sonden in kalten Räumen.",
  howToName: "ProbeHarbor auf eine Frostnacht vorbereiten",
  howToStep: (n) => `Checkliste, Schritt ${n}`,
  howToMapName: "Bei der Frostkarte mitmachen (optional)",
  howToMapText:
    "Teile anonymisierte Sondenwerte auf Stadtebene auf der öffentlichen Frostkarte, damit Nachbarn das regionale Risiko sehen.",
  faqs: [
    {
      question: "Wann ist für ProbeHarbor Frostsaison?",
      answer:
        "Betrachte November bis März als Hauptfrostsaison in den meisten Teilen der kontinentalen USA. An der Küste und in den Bergen ist das Klima anders; das eigentliche Signal sind deine kältesten Nächte und die Frostwarnungen des NWS (US-Wetterdienst).",
    },
    {
      question: "Warum nicht einfach auf das Außenwetter verlassen?",
      answer:
        "Außenstationen messen den Garten. Rohre frieren in unbeheizten Räumen, Kriechkellern und Werkstätten ein, die der Außenluft hinterherhinken. Setz eine Sonde dorthin, wo das Wasser ist, und nutze das Außenwetter zur Einordnung.",
    },
    {
      question: "Was sollte ich heute Nacht vor einer Kältewelle tun?",
      answer:
        "Lass Wasserhähne an Außenwänden tropfen, wenn die Leitungen kalt sind, schließ offen stehende Türen, dämme Außenwasserhähne, prüfe die Frostalarme mit einem Test und stell sicher, dass eine Sonde in der kältesten Ecke nahe an den Rohren sitzt. Die Checkliste steht auf dieser Seite.",
    },
    {
      question: "Wo finde ich die ESP32-Teileliste?",
      answer:
        "probeharbor.dev/about/esp32-freeze-kit: Stückliste mit ESP32 + wasserdichtem DS18B20, Verkabelung und Flash-Anleitung.",
    },
  ],
};

const ptBr: FreezeSeasonMessages = {
  title: "Vigilância de congelamento com sondas",
  description:
    "Ative alertas de congelamento antes da onda de frio: mapa comunitário, sondas ESP e e-mail (SMS no Pro) quando o interior cai rumo a 0 °C (32 °F).",
  breadcrumbHome: "Início",
  breadcrumb: "Temporada de congelamento",
  kicker: "Sazonal",
  seasonHere: "A temporada de congelamento chegou",
  seasonAhead: "Prepare-se antes da temporada de congelamento",
  lede: "Canos congelam em espaços por onde você não passa toda hora. Coloque uma sonda onde a água está, defina um limite alguns graus acima de 0 °C (32 °F) e tenha um relógio que mostra quando esse espaço vai chegar ao congelamento, além de um alerta enquanto você ainda tem horas para agir.",
  openAlerts: "Abrir o essencial dos alertas",
  startFree: "Comece grátis: conecte uma sonda",
  communityMap: "Mapa comunitário de congelamento",
  checklistTitle: "O checklist de hoje à noite",
  checklist: [
    "Deixe pingar as torneiras das paredes externas se os canos passam por espaços frios.",
    "Confira as vedações das portas (garagem, oficina, acesso ao porão) e feche as que estiverem abertas.",
    "Isole as torneiras externas e desconecte as mangueiras do jardim.",
    "Confirme que os alertas de congelamento estão ativados e envie um teste se faz tempo que você não envia.",
    "Verifique se há uma sonda no canto mais frio, perto dos canos ou do que estiver guardado.",
  ],
  checklistOptionalHtml:
    'Opcional: inclua sua cidade no <a class="text-link" href="/freeze-map">mapa público de congelamento</a>.',
  sampleColdest: "Cidades mais frias (exemplo)",
  liveColdest: "Cidades participantes mais frias",
  sampleNote: "Prévia ilustrativa até que domicílios suficientes participem do mapa de congelamento.",
  liveNote: "Do retrato mais recente do mapa de congelamento do ProbeHarbor.",
  minTemp: (f) => `mín. ${celsiusFirst("pt-BR")(f)}`,
  viewMap: "Ver o mapa completo",
  indoorTitle: "Por que sondas internas valem mais que só o clima lá fora",
  indoorBody:
    "Uma leitura do Tempest ou do aeroporto diz o quanto o quintal está frio. Seus canos dependem do espaço sem aquecimento, da porta com fresta e do aquecedor que pifou. O ProbeHarbor monitora esse espaço e pode aparecer ao lado do clima externo no seu painel para dar contexto.",
  vsWeather: "Comparado a estações meteorológicas",
  partsList: "Lista de peças ESP32 + DS18B20",
  stories: "Leia histórias de congelamento",
  demo: "Experimente a demo ao vivo",
  faqLede: "Preparação para a temporada de congelamento para quem tem sondas em espaços frios.",
  howToName: "Prepare o ProbeHarbor para uma noite de congelamento",
  howToStep: (n) => `Passo ${n} do checklist`,
  howToMapName: "Participe do mapa de congelamento (opcional)",
  howToMapText:
    "Compartilhe amostras anônimas das sondas por cidade no mapa público de congelamento para que os vizinhos vejam o risco na região.",
  faqs: [
    {
      question: "Quando é a temporada de congelamento para o ProbeHarbor?",
      answer:
        "Considere de novembro a março como a principal temporada de congelamento na maior parte dos EUA continentais. Climas litorâneos e de montanha variam; use suas noites mais frias e os avisos de geada do NWS (serviço meteorológico dos EUA) como o sinal real.",
    },
    {
      question: "Por que não confiar só no clima lá fora?",
      answer:
        "Estações externas medem o quintal. Canos congelam em espaços sem aquecimento, porões e oficinas que demoram a acompanhar o ar externo. Coloque uma sonda onde a água está e use o clima externo como contexto.",
    },
    {
      question: "O que devo fazer hoje à noite antes de uma onda de frio?",
      answer:
        "Deixe pingar as torneiras das paredes externas se os canos estiverem frios, feche as portas abertas, isole as torneiras externas, confirme os alertas de congelamento com um teste e verifique se há uma sonda no canto mais frio perto dos canos. O checklist está nesta página.",
    },
    {
      question: "Onde está a lista de peças do ESP32?",
      answer:
        "probeharbor.dev/about/esp32-freeze-kit: lista de materiais com ESP32 + DS18B20 à prova d’água, ligações e passos para gravar o firmware.",
    },
  ],
};

export const freezeSeasonMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

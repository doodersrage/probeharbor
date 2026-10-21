import { defineMessages } from "../../translate";

/** Body copy for /about/temperature-probe-case-study. Hrefs stay English; middleware localizes them. */
const FIRMWARE_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/arduino-network-json-temperature-sever">arduino-network-json-temperature-sever</a>';

const en = {
  heroAlt:
    "Second revision garage temperature probe controller with Ethernet connectivity and multiple sensor inputs",
  heroCaption: "Revision two of the ProbeHarbor probe board. Ethernet, LCD, and dual DHT22 inputs.",
  intro:
    "This case study follows the temperature probe build that powers ProbeHarbor: why a single outdoor thermometer was not enough, how two DHT22 zones plus an averaged summary were chosen, and what changed between the first breadboard deployment and the network-connected revision now serving live JSON to this website.",
  challengeTitle: "The challenge",
  challenge: [
    "The goal was practical, not academic: know whether an attached garage was approaching freeze risk, whether humidity was creeping high enough to rust tools, and whether conditions differed near the door versus the back wall. Consumer weather apps only report outside air at the nearest station, which can differ by ten degrees or more from an insulated garage interior on a sunny winter afternoon.",
    "A single sensor would have hidden the gradients that matter. Opening the overhead door, parking a warm vehicle, or afternoon sun on a west-facing wall all move different parts of the space at different speeds. The case for multiple probes was clear before the first wire was soldered.",
  ],
  environmentTitle: "The environment",
  environment:
    "The monitored space is a typical attached garage: one large overhead door, concrete slab floor, limited insulation compared to living space, and seasonal swings driven as much by sun load and infiltration as by outdoor temperature. In summer, the door-facing zone runs hotter; in winter, the slab and north wall lag outdoor lows by hours.",
  zonesHtml: [
    "<strong>North wall zone:</strong> Slower to change; useful for overnight low trends.",
    "<strong>Door zone:</strong> Spikes when the door opens; flags rapid infiltration.",
    "<strong>Workbench area:</strong> Represents where work actually happens at shoulder height.",
  ],
  demoHtml:
    'The <a class="text-link" href="/about/probe-demo">interactive probe demo</a> models these three zones so you can see how sun load and door state pull readings apart without installing hardware.',
  approachTitle: "Approach and hardware",
  approachHtml: [
    "Each probe uses a DHT22 digital humidity–temperature sensor on a short cable from an Arduino Uno. The firmware reads both sensors on a timer, retries transient bus errors, computes an <code>avg</code> across healthy probes, and serves compact JSON over the local network via an Ethernet shield. A 16×2 LCD on the board shows live values for on-site checks without a laptop.",
    'Placement followed the rules in the <a class="text-link" href="/about/temperature-probes">temperature probes guide</a>: away from direct sun patches and exhaust fans, roughly shoulder height, with ventilated mounting so air could move past the sensor head. Labels in the dashboard map JSON keys <code>0</code> and <code>1</code> to human-readable zone names.',
  ],
  rev1Alt: "First revision probe board on a breadboard with DHT22 sensors and LCD",
  rev1Caption: "Revision one validated wiring, read intervals, and JSON shape on the bench before garage mounting.",
  timelineTitle: "Build timeline",
  timelineHtml: [
    "<strong>Bench bring-up:</strong> Serial logging confirmed DHT22 reads, LCD formatting, and stable <code>temp</code> JSON keys before the board left the desk.",
    "<strong>Revision one in the garage:</strong> Proved multi-probe gradients were real: the door zone routinely diverged from the north wall on commute schedules.",
    "<strong>Network JSON feed:</strong> Ethernet removed the need to carry a laptop for every check; the site could fetch the same document the LCD already displayed.",
    "<strong>Revision two:</strong> Cleaner stacking of the Ethernet shield, refined probe headers, and watchdog-friendly reboot logic for rare network hangs.",
    "<strong>Website integration:</strong> Astro pages map feeds to cards; signed-in history stores snapshots for trend review and CSV export.",
  ],
  dataTitle: "What the data showed",
  dataLede: "After a full winter and summer cycle, the probes paid off in ways a single reading would have missed:",
  data: [
    "Door-adjacent temperature could swing 8–12 °F within minutes of opening the overhead door while the back wall moved modestly.",
    "Overnight lows near the north wall tracked freeze risk more reliably than outdoor forecasts alone.",
    "Humidity rose after sustained cold spells when the slab was slow to warm: useful for deciding when to run a dehumidifier.",
    "The computed average smoothed noise for history charts while per-probe cards on the home page preserved zone detail.",
  ],
  flowHtml:
    'Readings flow from probe to dashboard along the path documented in <a class="text-link" href="/about/data-flow">end-to-end data flow</a>. When TLS at the edge was needed, a <a class="text-link" href="/about/python-feeds">Python relay</a> cached upstream JSON without pushing that complexity onto the microcontroller.',
  lessonsTitle: "Lessons learned",
  lessonsHtml: [
    "<strong>Placement beats sensor cost:</strong> A well-mounted DHT22 outperformed a poorly placed premium sensor every time.",
    "<strong>Label zones in software:</strong> Stable JSON keys with dashboard labels kept firmware and website loosely coupled.",
    "<strong>Expect gaps:</strong> Reboots and network blips create short gaps: distinguish them from misconfiguration using the stale-reading guides.",
    "<strong>Build for iteration:</strong> Revision one on a breadboard saved a ladder trip when pin assignments changed.",
  ],
  relatedTitle: "Related reading",
  relatedHtml: `Continue with the <a class="text-link" href="/about/temperature-probes">temperature probes overview</a>, <a class="text-link" href="/about/arduino-sketches">Arduino sketches</a> guide, <a class="text-link" href="/about/temperature-changes">what causes readings to move</a>, and <a class="text-link" href="/about/historical-data">historical data usage</a> on the dashboard. Firmware source: ${FIRMWARE_LINK}.`,
};
type Messages = typeof en;

const es: Messages = {
  heroAlt:
    "Controlador de sondas de temperatura para garaje, segunda revisión, con conexión Ethernet y varias entradas de sensores",
  heroCaption: "Revisión dos de la placa de sondas ProbeHarbor. Ethernet, LCD y dos entradas DHT22.",
  intro:
    "Este caso práctico sigue la construcción de la sonda de temperatura que impulsa ProbeHarbor: por qué un solo termómetro exterior no bastaba, cómo se eligieron dos zonas DHT22 más un resumen promediado y qué cambió entre la primera instalación en protoboard y la revisión conectada a la red que hoy sirve JSON en vivo a este sitio.",
  challengeTitle: "El reto",
  challenge: [
    "El objetivo era práctico, no académico: saber si un garaje adosado se acercaba al riesgo de helada, si la humedad subía lo bastante como para oxidar las herramientas y si las condiciones eran distintas junto a la puerta que en la pared del fondo. Las apps meteorológicas solo informan del aire exterior en la estación más cercana, que puede diferir unos 5 °C (10 °F) o más del interior de un garaje aislado en una tarde soleada de invierno.",
    "Un solo sensor habría ocultado los gradientes que importan. Abrir la puerta seccional, aparcar un vehículo caliente o el sol de la tarde sobre una pared orientada al oeste cambian distintas partes del espacio a distintas velocidades. La necesidad de varias sondas estaba clara antes de soldar el primer cable.",
  ],
  environmentTitle: "El entorno",
  environment:
    "El espacio vigilado es un garaje adosado típico: una gran puerta seccional, suelo de losa de hormigón, menos aislamiento que la vivienda y variaciones estacionales que dependen tanto de la radiación solar y las infiltraciones de aire como de la temperatura exterior. En verano, la zona junto a la puerta está más caliente; en invierno, la losa y la pared norte van horas por detrás de las mínimas exteriores.",
  zonesHtml: [
    "<strong>Zona de la pared norte:</strong> cambia más despacio; útil para ver la tendencia de las mínimas nocturnas.",
    "<strong>Zona de la puerta:</strong> se dispara al abrir la puerta; delata las entradas rápidas de aire.",
    "<strong>Zona del banco de trabajo:</strong> representa el lugar donde realmente se trabaja, a la altura de los hombros.",
  ],
  demoHtml:
    'La <a class="text-link" href="/about/probe-demo">demo interactiva de sondas</a> simula estas tres zonas para que veas cómo el sol y el estado de la puerta separan las lecturas sin instalar hardware.',
  approachTitle: "Enfoque y hardware",
  approachHtml: [
    "Cada sonda usa un sensor digital de humedad y temperatura DHT22 con un cable corto hasta un Arduino Uno. El firmware lee ambos sensores a intervalos fijos, reintenta ante errores transitorios del bus, calcula un <code>avg</code> de las sondas en buen estado y sirve JSON compacto por la red local mediante un shield Ethernet. Una pantalla LCD de 16×2 en la placa muestra los valores en vivo para comprobarlos in situ sin portátil.",
    'La colocación siguió las reglas de la <a class="text-link" href="/about/temperature-probes">guía de sondas de temperatura</a>: lejos de zonas con sol directo y de extractores, más o menos a la altura de los hombros y con un montaje ventilado para que el aire circule por la cabeza del sensor. Las etiquetas del dashboard asignan las claves JSON <code>0</code> y <code>1</code> a nombres de zona legibles.',
  ],
  rev1Alt: "Placa de sonda de primera revisión en una protoboard con sensores DHT22 y LCD",
  rev1Caption: "La revisión uno validó en el banco el cableado, los intervalos de lectura y la estructura del JSON antes de montarla en el garaje.",
  timelineTitle: "Cronología del montaje",
  timelineHtml: [
    "<strong>Puesta en marcha en el banco:</strong> los registros por serie confirmaron las lecturas del DHT22, el formato de la LCD y unas claves JSON <code>temp</code> estables antes de que la placa saliera del escritorio.",
    "<strong>Revisión uno en el garaje:</strong> demostró que los gradientes entre sondas eran reales: la zona de la puerta se separaba habitualmente de la pared norte a las horas de ir y volver del trabajo.",
    "<strong>Feed JSON por red:</strong> Ethernet eliminó la necesidad de llevar un portátil para cada comprobación; el sitio podía obtener el mismo documento que ya mostraba la LCD.",
    "<strong>Revisión dos:</strong> montaje más limpio del shield Ethernet, conectores de sonda mejorados y lógica de reinicio compatible con watchdog para los raros bloqueos de red.",
    "<strong>Integración con el sitio web:</strong> las páginas de Astro asignan los feeds a tarjetas; el historial de los usuarios con sesión guarda instantáneas para revisar tendencias y exportar a CSV.",
  ],
  dataTitle: "Qué mostraron los datos",
  dataLede: "Tras un ciclo completo de invierno y verano, las sondas compensaron con creces de formas que una sola lectura no habría captado:",
  data: [
    "La temperatura junto a la puerta podía variar entre 4 y 7 °C (8–12 °F) a los pocos minutos de abrir la puerta seccional, mientras la pared del fondo apenas se movía.",
    "Las mínimas nocturnas junto a la pared norte seguían el riesgo de helada con más fiabilidad que las previsiones exteriores por sí solas.",
    "La humedad subía tras olas de frío prolongadas, cuando la losa tardaba en calentarse: útil para decidir cuándo encender un deshumidificador.",
    "El promedio calculado suavizaba el ruido en los gráficos históricos, mientras que las tarjetas por sonda de la página de inicio conservaban el detalle de cada zona.",
  ],
  flowHtml:
    'Las lecturas viajan de la sonda al dashboard por el camino documentado en <a class="text-link" href="/about/data-flow">flujo de datos de extremo a extremo</a>. Cuando hizo falta TLS en el borde, un <a class="text-link" href="/about/python-feeds">relay en Python</a> almacenó en caché el JSON de origen sin cargar esa complejidad en el microcontrolador.',
  lessonsTitle: "Lecciones aprendidas",
  lessonsHtml: [
    "<strong>La ubicación importa más que el precio del sensor:</strong> un DHT22 bien montado superó siempre a un sensor premium mal colocado.",
    "<strong>Etiqueta las zonas en el software:</strong> unas claves JSON estables con etiquetas en el dashboard mantuvieron el firmware y el sitio web poco acoplados.",
    "<strong>Cuenta con huecos:</strong> los reinicios y los cortes de red crean huecos breves; distínguelos de una mala configuración con las guías de lecturas desactualizadas.",
    "<strong>Construye para iterar:</strong> la revisión uno en protoboard ahorró subir a la escalera cuando cambiaron las asignaciones de pines.",
  ],
  relatedTitle: "Lecturas relacionadas",
  relatedHtml: `Sigue con la <a class="text-link" href="/about/temperature-probes">introducción a las sondas de temperatura</a>, la guía de <a class="text-link" href="/about/arduino-sketches">sketches de Arduino</a>, <a class="text-link" href="/about/temperature-changes">qué hace que cambien las lecturas</a> y el <a class="text-link" href="/about/historical-data">uso de los datos históricos</a> en el dashboard. Código del firmware: ${FIRMWARE_LINK}.`,
};

const fr: Messages = {
  heroAlt:
    "Contrôleur de sondes de température pour garage, deuxième révision, avec connexion Ethernet et plusieurs entrées capteurs",
  heroCaption: "Révision deux de la carte de sondes ProbeHarbor. Ethernet, écran LCD et deux entrées DHT22.",
  intro:
    "Cette étude de cas retrace la construction de la sonde de température qui alimente ProbeHarbor : pourquoi un simple thermomètre extérieur ne suffisait pas, comment deux zones DHT22 et une moyenne de synthèse ont été retenues, et ce qui a changé entre la première installation sur platine d’essai et la révision connectée au réseau qui sert aujourd’hui du JSON en direct à ce site.",
  challengeTitle: "Le défi",
  challenge: [
    "L’objectif était concret, pas théorique : savoir si un garage attenant approchait du risque de gel, si l’humidité montait assez pour faire rouiller les outils, et si les conditions différaient près de la porte et au fond du garage. Les applis météo grand public ne donnent que l’air extérieur à la station la plus proche, qui peut s’écarter d’environ 5 °C (10 °F) ou plus de l’intérieur d’un garage isolé par un après-midi d’hiver ensoleillé.",
    "Un seul capteur aurait masqué les écarts qui comptent. Ouvrir la porte de garage, garer un véhicule encore chaud ou le soleil de l’après-midi sur un mur exposé à l’ouest font évoluer différentes parties de l’espace à des vitesses différentes. L’intérêt de plusieurs sondes était évident avant même la première soudure.",
  ],
  environmentTitle: "L’environnement",
  environment:
    "L’espace surveillé est un garage attenant typique : une grande porte basculante, une dalle en béton, une isolation limitée par rapport aux pièces à vivre, et des variations saisonnières dues autant à l’ensoleillement et aux infiltrations d’air qu’à la température extérieure. En été, la zone côté porte est plus chaude ; en hiver, la dalle et le mur nord suivent les minimales extérieures avec plusieurs heures de retard.",
  zonesHtml: [
    "<strong>Zone du mur nord :</strong> évolue plus lentement ; utile pour suivre la tendance des minimales nocturnes.",
    "<strong>Zone de la porte :</strong> grimpe dès que la porte s’ouvre ; révèle les infiltrations rapides.",
    "<strong>Zone de l’établi :</strong> représente l’endroit où l’on travaille vraiment, à hauteur d’épaule.",
  ],
  demoHtml:
    'La <a class="text-link" href="/about/probe-demo">démo interactive des sondes</a> modélise ces trois zones pour vous montrer comment le soleil et l’état de la porte font diverger les relevés, sans installer de matériel.',
  approachTitle: "Démarche et matériel",
  approachHtml: [
    "Chaque sonde utilise un capteur numérique d’humidité et de température DHT22 relié par un câble court à un Arduino Uno. Le firmware lit les deux capteurs à intervalle régulier, refait une tentative en cas d’erreur passagère du bus, calcule un <code>avg</code> des sondes en bon état et sert un JSON compact sur le réseau local via un shield Ethernet. Un écran LCD 16×2 sur la carte affiche les valeurs en direct pour vérifier sur place sans ordinateur portable.",
    'L’emplacement suit les règles du <a class="text-link" href="/about/temperature-probes">guide des sondes de température</a> : à l’écart des taches de soleil direct et des extracteurs, à peu près à hauteur d’épaule, avec un montage ventilé pour que l’air circule autour de la tête du capteur. Dans le dashboard, des libellés associent les clés JSON <code>0</code> et <code>1</code> à des noms de zone lisibles.',
  ],
  rev1Alt: "Carte de sonde première révision sur platine d’essai avec capteurs DHT22 et écran LCD",
  rev1Caption: "La révision un a validé sur l’établi le câblage, les intervalles de lecture et la structure du JSON avant la pose dans le garage.",
  timelineTitle: "Étapes de la construction",
  timelineHtml: [
    "<strong>Mise en route sur l’établi :</strong> les journaux série ont confirmé les lectures du DHT22, l’affichage LCD et des clés JSON <code>temp</code> stables avant que la carte ne quitte le bureau.",
    "<strong>Révision un dans le garage :</strong> a prouvé que les écarts entre sondes étaient réels : la zone de la porte s’écartait régulièrement du mur nord aux heures des trajets domicile-travail.",
    "<strong>Flux JSON réseau :</strong> l’Ethernet a évité d’apporter un portable à chaque vérification ; le site pouvait récupérer le même document que celui déjà affiché par l’écran LCD.",
    "<strong>Révision deux :</strong> empilement plus propre du shield Ethernet, connecteurs de sonde améliorés et logique de redémarrage compatible watchdog pour les rares blocages réseau.",
    "<strong>Intégration au site :</strong> les pages Astro associent les flux à des cartes ; l’historique des utilisateurs connectés enregistre des instantanés pour analyser les tendances et exporter en CSV.",
  ],
  dataTitle: "Ce que les données ont montré",
  dataLede: "Après un cycle complet hiver-été, les sondes se sont révélées utiles là où un relevé unique serait passé à côté :",
  data: [
    "Près de la porte, la température pouvait varier de 4 à 7 °C (8–12 °F) quelques minutes après l’ouverture de la porte de garage, alors que le mur du fond bougeait à peine.",
    "Les minimales nocturnes près du mur nord suivaient le risque de gel de façon plus fiable que les seules prévisions extérieures.",
    "L’humidité augmentait après de longues vagues de froid, quand la dalle tardait à se réchauffer : utile pour savoir quand faire tourner un déshumidificateur.",
    "La moyenne calculée lissait le bruit des graphiques d’historique, tandis que les cartes par sonde de la page d’accueil gardaient le détail de chaque zone.",
  ],
  flowHtml:
    'Les relevés passent de la sonde au dashboard selon le chemin décrit dans <a class="text-link" href="/about/data-flow">flux de données de bout en bout</a>. Quand il a fallu du TLS en bordure, un <a class="text-link" href="/about/python-feeds">relais Python</a> a mis en cache le JSON amont sans reporter cette complexité sur le microcontrôleur.',
  lessonsTitle: "Leçons retenues",
  lessonsHtml: [
    "<strong>L’emplacement compte plus que le prix du capteur :</strong> un DHT22 bien monté a toujours fait mieux qu’un capteur haut de gamme mal placé.",
    "<strong>Nommez les zones dans le logiciel :</strong> des clés JSON stables et des libellés dans le dashboard ont permis de garder firmware et site faiblement couplés.",
    "<strong>Attendez-vous à des trous :</strong> redémarrages et micro-coupures réseau créent de courtes lacunes ; distinguez-les d’une mauvaise configuration grâce aux guides sur les relevés obsolètes.",
    "<strong>Prévoyez d’itérer :</strong> la révision un sur platine d’essai a évité de remonter à l’échelle quand le brochage a changé.",
  ],
  relatedTitle: "Pour aller plus loin",
  relatedHtml: `Poursuivez avec la <a class="text-link" href="/about/temperature-probes">présentation des sondes de température</a>, le guide des <a class="text-link" href="/about/arduino-sketches">sketches Arduino</a>, <a class="text-link" href="/about/temperature-changes">ce qui fait varier les relevés</a> et l’<a class="text-link" href="/about/historical-data">utilisation des données historiques</a> dans le dashboard. Code source du firmware : ${FIRMWARE_LINK}.`,
};

const de: Messages = {
  heroAlt:
    "Garagen-Temperatursonden-Controller, zweite Revision, mit Ethernet-Anbindung und mehreren Sensoreingängen",
  heroCaption: "Zweite Revision der ProbeHarbor-Sondenplatine. Ethernet, LCD und zwei DHT22-Eingänge.",
  intro:
    "Diese Fallstudie zeichnet den Bau der Temperatursonde nach, auf der ProbeHarbor beruht: warum ein einzelnes Außenthermometer nicht reichte, wie die Wahl auf zwei DHT22-Zonen plus einen gemittelten Übersichtswert fiel und was sich zwischen dem ersten Steckbrett-Einsatz und der vernetzten Revision geändert hat, die heute Live-JSON an diese Website liefert.",
  challengeTitle: "Die Herausforderung",
  challenge: [
    "Das Ziel war praktisch, nicht akademisch: wissen, ob einer angebauten Garage Frost droht, ob die Luftfeuchtigkeit so weit steigt, dass Werkzeug rostet, und ob sich die Bedingungen an der Tor- und an der Rückwand unterscheiden. Wetter-Apps melden nur die Außenluft an der nächsten Station, und die kann an einem sonnigen Winternachmittag um etwa 5 °C (10 °F) oder mehr vom Inneren einer gedämmten Garage abweichen.",
    "Ein einzelner Sensor hätte genau die Unterschiede verdeckt, auf die es ankommt. Ein geöffnetes Garagentor, ein warm abgestelltes Auto oder Nachmittagssonne auf einer Westwand verändern verschiedene Bereiche unterschiedlich schnell. Dass mehrere Sonden nötig waren, stand fest, bevor der erste Draht gelötet war.",
  ],
  environmentTitle: "Die Umgebung",
  environment:
    "Der überwachte Raum ist eine typische angebaute Garage: ein großes Sektionaltor, eine Betonbodenplatte, weniger Dämmung als der Wohnbereich und jahreszeitliche Schwankungen, die genauso von Sonneneinstrahlung und eindringender Luft abhängen wie von der Außentemperatur. Im Sommer ist die Zone am Tor wärmer; im Winter hinken Bodenplatte und Nordwand den Tiefstwerten draußen um Stunden hinterher.",
  zonesHtml: [
    "<strong>Zone Nordwand:</strong> ändert sich langsamer; nützlich für den Verlauf der nächtlichen Tiefstwerte.",
    "<strong>Zone Tor:</strong> schnellt hoch, sobald das Tor aufgeht; zeigt schnell eindringende Luft an.",
    "<strong>Werkbank:</strong> steht für den Bereich, in dem tatsächlich gearbeitet wird, auf Schulterhöhe.",
  ],
  demoHtml:
    'Die <a class="text-link" href="/about/probe-demo">interaktive Sonden-Demo</a> bildet diese drei Zonen nach, damit du ohne eigene Hardware siehst, wie Sonne und Torstellung die Messwerte auseinanderziehen.',
  approachTitle: "Vorgehen und Hardware",
  approachHtml: [
    "Jede Sonde nutzt einen digitalen DHT22-Feuchte- und Temperatursensor an einem kurzen Kabel zu einem Arduino Uno. Die Firmware liest beide Sensoren in festen Abständen aus, wiederholt bei vorübergehenden Busfehlern, berechnet ein <code>avg</code> über die funktionierenden Sonden und liefert kompaktes JSON über ein Ethernet-Shield ins lokale Netz. Ein 16×2-LCD auf der Platine zeigt die Live-Werte, sodass du vor Ort ohne Laptop nachsehen kannst.",
    'Die Platzierung folgte den Regeln der <a class="text-link" href="/about/temperature-probes">Anleitung zu Temperatursonden</a>: weg von direkter Sonne und Abluftventilatoren, etwa auf Schulterhöhe, belüftet montiert, damit Luft am Sensorkopf vorbeistreichen kann. Beschriftungen im Dashboard ordnen die JSON-Schlüssel <code>0</code> und <code>1</code> lesbaren Zonennamen zu.',
  ],
  rev1Alt: "Sondenplatine der ersten Revision auf einem Steckbrett mit DHT22-Sensoren und LCD",
  rev1Caption: "Die erste Revision hat Verdrahtung, Leseintervalle und JSON-Aufbau auf der Werkbank geprüft, bevor sie in die Garage kam.",
  timelineTitle: "Ablauf des Baus",
  timelineHtml: [
    "<strong>Inbetriebnahme auf der Werkbank:</strong> Die serielle Ausgabe bestätigte DHT22-Messwerte, LCD-Formatierung und stabile <code>temp</code>-JSON-Schlüssel, bevor die Platine den Schreibtisch verließ.",
    "<strong>Erste Revision in der Garage:</strong> bewies, dass die Unterschiede zwischen den Sonden real waren: Die Torzone wich zu den Pendelzeiten regelmäßig von der Nordwand ab.",
    "<strong>JSON-Feed übers Netzwerk:</strong> Dank Ethernet musste nicht mehr für jede Kontrolle ein Laptop mit; die Website konnte dasselbe Dokument abrufen, das das LCD bereits zeigte.",
    "<strong>Zweite Revision:</strong> sauberer gestapeltes Ethernet-Shield, verbesserte Sondenstecker und Watchdog-freundliche Neustartlogik für seltene Netzwerkhänger.",
    "<strong>Website-Integration:</strong> Astro-Seiten ordnen Feeds Karten zu; der Verlauf für angemeldete Nutzer speichert Momentaufnahmen für Trendanalysen und CSV-Export.",
  ],
  dataTitle: "Was die Daten zeigten",
  dataLede: "Nach einem vollen Winter- und Sommerzyklus haben sich die Sonden auf eine Weise ausgezahlt, die ein einzelner Messwert verpasst hätte:",
  data: [
    "Die Temperatur am Tor konnte innerhalb weniger Minuten nach dem Öffnen um 4–7 °C (8–12 °F) schwanken, während sich die Rückwand kaum bewegte.",
    "Die nächtlichen Tiefstwerte an der Nordwand zeigten das Frostrisiko zuverlässiger an als Außenvorhersagen allein.",
    "Nach längeren Kälteperioden stieg die Luftfeuchtigkeit, weil sich die Bodenplatte nur langsam erwärmte: hilfreich, um zu entscheiden, wann ein Luftentfeuchter laufen sollte.",
    "Der berechnete Mittelwert glättete das Rauschen in den Verlaufsdiagrammen, während die Karten pro Sonde auf der Startseite die Details jeder Zone erhielten.",
  ],
  flowHtml:
    'Die Messwerte gelangen auf dem Weg, der unter <a class="text-link" href="/about/data-flow">Datenfluss von Ende zu Ende</a> beschrieben ist, von der Sonde ins Dashboard. Als TLS am Rand nötig wurde, hat ein <a class="text-link" href="/about/python-feeds">Python-Relay</a> das Upstream-JSON zwischengespeichert, ohne diese Komplexität dem Mikrocontroller aufzubürden.',
  lessonsTitle: "Erkenntnisse",
  lessonsHtml: [
    "<strong>Platzierung schlägt Sensorpreis:</strong> Ein gut montierter DHT22 war einem schlecht platzierten Premium-Sensor jedes Mal überlegen.",
    "<strong>Zonen in der Software benennen:</strong> Stabile JSON-Schlüssel mit Beschriftungen im Dashboard hielten Firmware und Website lose gekoppelt.",
    "<strong>Mit Lücken rechnen:</strong> Neustarts und kurze Netzaussetzer erzeugen kleine Lücken; unterscheide sie mithilfe der Anleitungen zu veralteten Messwerten von Fehlkonfigurationen.",
    "<strong>Auf Weiterentwicklung auslegen:</strong> Die erste Revision auf dem Steckbrett hat einen Gang auf die Leiter erspart, als sich die Pinbelegung änderte.",
  ],
  relatedTitle: "Weiterlesen",
  relatedHtml: `Lies weiter mit dem <a class="text-link" href="/about/temperature-probes">Überblick über Temperatursonden</a>, der Anleitung zu <a class="text-link" href="/about/arduino-sketches">Arduino-Sketches</a>, <a class="text-link" href="/about/temperature-changes">was Messwerte verändert</a> und der <a class="text-link" href="/about/historical-data">Nutzung historischer Daten</a> im Dashboard. Quellcode der Firmware: ${FIRMWARE_LINK}.`,
};

const ptBr: Messages = {
  heroAlt:
    "Controlador de sondas de temperatura para garagem, segunda revisão, com conexão Ethernet e várias entradas de sensores",
  heroCaption: "Revisão dois da placa de sondas ProbeHarbor. Ethernet, LCD e duas entradas DHT22.",
  intro:
    "Este estudo de caso acompanha a construção da sonda de temperatura por trás do ProbeHarbor: por que um único termômetro externo não bastava, como foram escolhidas duas zonas DHT22 mais um resumo com a média e o que mudou entre a primeira instalação em protoboard e a revisão conectada à rede que hoje envia JSON ao vivo para este site.",
  challengeTitle: "O desafio",
  challenge: [
    "O objetivo era prático, não acadêmico: saber se uma garagem anexa à casa estava chegando perto do risco de congelamento, se a umidade estava subindo a ponto de enferrujar as ferramentas e se as condições eram diferentes perto do portão e na parede do fundo. Os apps de previsão do tempo só informam o ar externo na estação mais próxima, que pode diferir uns 5 °C (10 °F) ou mais do interior de uma garagem isolada numa tarde ensolarada de inverno.",
    "Um único sensor esconderia as diferenças que importam. Abrir o portão basculante, estacionar um carro ainda quente ou o sol da tarde numa parede voltada para o oeste mexem com partes diferentes do espaço em velocidades diferentes. A necessidade de várias sondas ficou clara antes de soldar o primeiro fio.",
  ],
  environmentTitle: "O ambiente",
  environment:
    "O espaço monitorado é uma garagem anexa típica: um grande portão basculante, piso de laje de concreto, menos isolamento que a área da casa e variações sazonais causadas tanto pela insolação e pelas infiltrações de ar quanto pela temperatura externa. No verão, a zona do portão fica mais quente; no inverno, a laje e a parede norte acompanham as mínimas externas com horas de atraso.",
  zonesHtml: [
    "<strong>Zona da parede norte:</strong> muda mais devagar; útil para acompanhar a tendência das mínimas da madrugada.",
    "<strong>Zona do portão:</strong> dá picos quando o portão abre; denuncia entradas rápidas de ar.",
    "<strong>Área da bancada:</strong> representa onde o trabalho realmente acontece, na altura dos ombros.",
  ],
  demoHtml:
    'A <a class="text-link" href="/about/probe-demo">demo interativa de sondas</a> simula essas três zonas para você ver como o sol e o estado do portão afastam as leituras, sem instalar hardware.',
  approachTitle: "Abordagem e hardware",
  approachHtml: [
    "Cada sonda usa um sensor digital de umidade e temperatura DHT22 com um cabo curto até um Arduino Uno. O firmware lê os dois sensores em intervalos fixos, tenta de novo em caso de erros temporários no barramento, calcula um <code>avg</code> das sondas em bom estado e envia JSON compacto pela rede local por meio de um shield Ethernet. Um LCD de 16×2 na placa mostra os valores ao vivo para conferir no local sem notebook.",
    'O posicionamento seguiu as regras do <a class="text-link" href="/about/temperature-probes">guia de sondas de temperatura</a>: longe de pontos de sol direto e exaustores, mais ou menos na altura dos ombros e com montagem ventilada para o ar passar pela cabeça do sensor. Rótulos no dashboard associam as chaves JSON <code>0</code> e <code>1</code> a nomes de zona legíveis.',
  ],
  rev1Alt: "Placa de sonda da primeira revisão em uma protoboard com sensores DHT22 e LCD",
  rev1Caption: "A revisão um validou na bancada a ligação, os intervalos de leitura e o formato do JSON antes da instalação na garagem.",
  timelineTitle: "Linha do tempo da montagem",
  timelineHtml: [
    "<strong>Primeiros testes na bancada:</strong> os logs na serial confirmaram as leituras do DHT22, a formatação do LCD e chaves JSON <code>temp</code> estáveis antes de a placa sair da mesa.",
    "<strong>Revisão um na garagem:</strong> provou que as diferenças entre as sondas eram reais: a zona do portão se afastava com frequência da parede norte nos horários de ida e volta do trabalho.",
    "<strong>Feed JSON pela rede:</strong> a Ethernet acabou com a necessidade de levar um notebook a cada conferência; o site podia buscar o mesmo documento que o LCD já mostrava.",
    "<strong>Revisão dois:</strong> encaixe mais limpo do shield Ethernet, conectores de sonda aprimorados e lógica de reinicialização compatível com watchdog para os raros travamentos de rede.",
    "<strong>Integração com o site:</strong> as páginas em Astro associam os feeds a cards; o histórico de quem está logado guarda snapshots para análise de tendências e exportação em CSV.",
  ],
  dataTitle: "O que os dados mostraram",
  dataLede: "Depois de um ciclo completo de inverno e verão, as sondas valeram a pena de formas que uma única leitura teria deixado passar:",
  data: [
    "A temperatura perto do portão podia variar de 4 a 7 °C (8–12 °F) poucos minutos depois de abrir o portão basculante, enquanto a parede do fundo mudava pouco.",
    "As mínimas da madrugada perto da parede norte acompanhavam o risco de congelamento com mais confiabilidade do que apenas as previsões externas.",
    "A umidade subia depois de períodos longos de frio, quando a laje demorava a esquentar: útil para decidir quando ligar um desumidificador.",
    "A média calculada suavizava o ruído nos gráficos de histórico, enquanto os cards por sonda na página inicial preservavam o detalhe de cada zona.",
  ],
  flowHtml:
    'As leituras vão da sonda ao dashboard pelo caminho documentado em <a class="text-link" href="/about/data-flow">fluxo de dados de ponta a ponta</a>. Quando foi preciso TLS na borda, um <a class="text-link" href="/about/python-feeds">relay em Python</a> fez cache do JSON de origem sem jogar essa complexidade para o microcontrolador.',
  lessonsTitle: "Lições aprendidas",
  lessonsHtml: [
    "<strong>Posição vale mais que o preço do sensor:</strong> um DHT22 bem instalado superou sempre um sensor premium mal posicionado.",
    "<strong>Nomeie as zonas no software:</strong> chaves JSON estáveis com rótulos no dashboard mantiveram firmware e site pouco acoplados.",
    "<strong>Conte com lacunas:</strong> reinicializações e quedas rápidas de rede criam lacunas curtas; diferencie-as de erros de configuração usando os guias de leituras desatualizadas.",
    "<strong>Construa pensando em iterar:</strong> a revisão um em protoboard poupou uma subida na escada quando a atribuição dos pinos mudou.",
  ],
  relatedTitle: "Leitura relacionada",
  relatedHtml: `Continue com a <a class="text-link" href="/about/temperature-probes">visão geral das sondas de temperatura</a>, o guia de <a class="text-link" href="/about/arduino-sketches">sketches de Arduino</a>, <a class="text-link" href="/about/temperature-changes">o que faz as leituras mudarem</a> e o <a class="text-link" href="/about/historical-data">uso dos dados históricos</a> no dashboard. Código-fonte do firmware: ${FIRMWARE_LINK}.`,
};

export const temperatureProbeCaseStudyMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

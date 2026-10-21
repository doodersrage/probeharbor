import { defineMessages } from "../../translate";

/** /about/temperature-probes body copy. `*Html` keys are trusted inline HTML (English hrefs). */
const en = {
  introHtml:
    'Temperature probes are the sensing layer of any environmental monitor. In a garage, workshop, attic, crawlspace, or shop, they translate physical heat and moisture into numbers the rest of the system can store, graph, and alert on. This project uses digital humidity–temperature sensors wired to an Arduino, with multiple probe channels so you can compare zones instead of trusting a single reading. For the full build story, read the <a class="text-link" href="/about/temperature-probe-case-study">temperature probe case study</a>.',
  measureTitle: "What probes measure in practice",
  measureHtml:
    "Each probe reports two values that matter for day-to-day decisions: air temperature and relative humidity. Temperature tells you whether pipes, paint, or stored goods are approaching risky limits. Humidity helps explain condensation on cold surfaces, rust on tools, and whether dehumidification is worth running overnight.",
  jsonHtml:
    "Probes in this build expose their readings through a JSON object keyed by probe index. <code>0</code>, <code>1</code>, and an computed <code>avg</code> across active sensors. That structure maps cleanly to dashboard labels such as “North wall” or “Workbench area.”",
  usesTitle: "Common probe uses in unheated spaces",
  uses: [
    "<strong>Freeze protection:</strong> Track overnight lows near exterior walls before plumbing is at risk.",
    "<strong>Seasonal comparison:</strong> Compare attic-adjacent zones with the floor level during summer heat.",
    "<strong>Equipment health:</strong> Watch humidity around metal tools, batteries, or paper storage.",
    "<strong>Work comfort:</strong> Validate whether insulation or ventilation changes actually help.",
    "<strong>Remote checks:</strong> Glance at live readings while away instead of guessing from outdoor weather alone.",
  ],
  placementTitle: "Placement matters more than sensor cost",
  placementHtml:
    "A probe near an uninsulated bay door will swing wildly every time the door opens. One on a north-facing wall may lag outdoor temperature by hours. For stable trends, mount probes away from direct sun patches, moving air from fans, and heat sources such as freezers or water heaters. Shoulder height (4–5 feet) usually represents the air volume people and stored items experience.",
  multipleTitle: "Why multiple probes beat one",
  multipleHtml:
    "Garages, workshops, and attics are not uniform boxes. A single sensor might read 45 °F near the floor while the ceiling bay is 58 °F on a sunny winter afternoon. Multiple probes reveal gradients, bad insulation spots, and which area represents the risk you care about. The firmware averages active probes so the history page still has one summary snapshot per load while preserving per-probe detail on the home page.",
  boardAlt: "ProbeHarbor probe controller board with Ethernet connectivity and DHT22 sensors",
  boardCaption: "Revision two of the ProbeHarbor probe board. Ethernet, LCD, and dual DHT22 inputs.",
  webTitle: "From probe wire to web page",
  webHtml:
    'Probes do not talk to the website directly. The Arduino sketch reads each sensor on a schedule, validates ranges, and publishes JSON over HTTPS. The site fetches that feed, maps keys to human labels you configure in the dashboard, and optionally saves readings when you are signed in. Try the <a class="text-link" href="/about/probe-demo">interactive probe demo</a> to see how multiple zones and averages behave, or read the <a class="text-link" href="/about/data-flow">end-to-end data flow</a> guide.',
};

type Messages = typeof en;

const es: Messages = {
  introHtml:
    'Las sondas de temperatura son la capa de medición de cualquier monitor ambiental. En un garaje, taller, ático, sótano ventilado o nave, convierten el calor y la humedad en números que el resto del sistema puede guardar, graficar y usar para alertar. Este proyecto usa sensores digitales de humedad y temperatura conectados a un Arduino, con varios canales de sonda para que puedas comparar zonas en lugar de fiarte de una sola lectura. Para la historia completa del montaje, lee el <a class="text-link" href="/about/temperature-probe-case-study">caso práctico de la sonda de temperatura</a>.',
  measureTitle: "Qué miden las sondas en la práctica",
  measureHtml:
    "Cada sonda informa de dos valores que importan para las decisiones del día a día: la temperatura del aire y la humedad relativa. La temperatura te dice si las tuberías, la pintura o lo que tienes guardado se acercan a límites de riesgo. La humedad ayuda a explicar la condensación en superficies frías, el óxido en las herramientas y si merece la pena deshumidificar por la noche.",
  jsonHtml:
    "En este montaje, las sondas publican sus lecturas en un objeto JSON indexado por número de sonda: <code>0</code>, <code>1</code> y un <code>avg</code> calculado con los sensores activos. Esa estructura encaja sin problemas con etiquetas del panel como «Pared norte» o «Zona del banco de trabajo».",
  usesTitle: "Usos habituales de las sondas en espacios sin calefacción",
  uses: [
    "<strong>Protección contra heladas:</strong> sigue las mínimas nocturnas junto a las paredes exteriores antes de que las tuberías corran peligro.",
    "<strong>Comparación estacional:</strong> compara las zonas junto al ático con el nivel del suelo durante el calor del verano.",
    "<strong>Estado del equipo:</strong> vigila la humedad alrededor de herramientas metálicas, baterías o papeles almacenados.",
    "<strong>Comodidad para trabajar:</strong> comprueba si los cambios de aislamiento o ventilación sirven de verdad.",
    "<strong>Consultas a distancia:</strong> echa un vistazo a las lecturas en vivo cuando no estás, en vez de adivinar solo por el tiempo exterior.",
  ],
  placementTitle: "La ubicación importa más que el precio del sensor",
  placementHtml:
    "Una sonda junto a un portón sin aislar oscilará mucho cada vez que se abra. Una en una pared orientada al norte puede ir horas por detrás de la temperatura exterior. Para obtener tendencias estables, monta las sondas lejos de zonas de sol directo, de corrientes de ventiladores y de fuentes de calor como congeladores o calentadores de agua. A la altura de los hombros (1,2–1,5 m) suele representarse bien el aire que notan las personas y los objetos guardados.",
  multipleTitle: "Por qué varias sondas son mejores que una",
  multipleHtml:
    "Garajes, talleres y áticos no son cajas uniformes. Un solo sensor puede marcar 7 °C (45 °F) cerca del suelo mientras la zona del techo está a 14 °C (58 °F) en una tarde soleada de invierno. Con varias sondas ves los gradientes, los puntos con mal aislamiento y qué zona representa el riesgo que te importa. El firmware promedia las sondas activas, así que la página de historial sigue teniendo una instantánea resumen por carga y la página principal conserva el detalle de cada sonda.",
  boardAlt: "Placa controladora de sondas de ProbeHarbor con conexión Ethernet y sensores DHT22",
  boardCaption: "Segunda revisión de la placa de sondas de ProbeHarbor: Ethernet, LCD y dos entradas DHT22.",
  webTitle: "Del cable de la sonda a la página web",
  webHtml:
    'Las sondas no hablan directamente con el sitio web. El sketch de Arduino lee cada sensor según un horario, valida los rangos y publica JSON por HTTPS. El sitio obtiene ese feed, asigna las claves a las etiquetas legibles que configuras en el panel y, si has iniciado sesión, puede guardar las lecturas. Prueba la <a class="text-link" href="/about/probe-demo">demo interactiva de sondas</a> para ver cómo se comportan varias zonas y los promedios, o lee la guía del <a class="text-link" href="/about/data-flow">flujo de datos de principio a fin</a>.',
};

const fr: Messages = {
  introHtml:
    'Les sondes de température constituent la couche de mesure de tout système de surveillance ambiante. Dans un garage, un atelier, des combles, un vide sanitaire ou un local professionnel, elles traduisent la chaleur et l’humidité en chiffres que le reste du système peut stocker, tracer et utiliser pour alerter. Ce projet utilise des capteurs numériques d’humidité et de température reliés à un Arduino, avec plusieurs canaux de sonde pour comparer les zones plutôt que de se fier à une seule mesure. Pour l’histoire complète du montage, lisez l’<a class="text-link" href="/about/temperature-probe-case-study">étude de cas sur la sonde de température</a>.',
  measureTitle: "Ce que mesurent concrètement les sondes",
  measureHtml:
    "Chaque sonde remonte deux valeurs utiles pour les décisions du quotidien : la température de l’air et l’humidité relative. La température vous indique si les canalisations, la peinture ou les objets stockés approchent de limites risquées. L’humidité aide à expliquer la condensation sur les surfaces froides, la rouille sur les outils, et à savoir s’il vaut la peine de déshumidifier la nuit.",
  jsonHtml:
    "Dans ce montage, les sondes exposent leurs mesures dans un objet JSON indexé par numéro de sonde : <code>0</code>, <code>1</code> et une moyenne <code>avg</code> calculée sur les capteurs actifs. Cette structure se transpose facilement en libellés du tableau de bord comme « Mur nord » ou « Zone de l’établi ».",
  usesTitle: "Usages courants des sondes dans les espaces non chauffés",
  uses: [
    "<strong>Protection contre le gel :</strong> suivez les minimales nocturnes près des murs extérieurs avant que la plomberie ne soit menacée.",
    "<strong>Comparaison saisonnière :</strong> comparez les zones proches des combles avec le niveau du sol pendant les chaleurs estivales.",
    "<strong>État du matériel :</strong> surveillez l’humidité autour des outils métalliques, des batteries ou des archives papier.",
    "<strong>Confort de travail :</strong> vérifiez si les changements d’isolation ou de ventilation sont vraiment efficaces.",
    "<strong>Contrôle à distance :</strong> consultez les mesures en direct quand vous êtes absent, au lieu de vous fier seulement à la météo extérieure.",
  ],
  placementTitle: "L’emplacement compte plus que le prix du capteur",
  placementHtml:
    "Une sonde près d’une porte de garage non isolée variera fortement à chaque ouverture. Une autre sur un mur exposé au nord peut suivre la température extérieure avec plusieurs heures de retard. Pour des tendances stables, installez les sondes à l’écart du soleil direct, des courants d’air des ventilateurs et des sources de chaleur comme les congélateurs ou les chauffe-eau. La hauteur d’épaule (1,2 à 1,5 m) représente généralement l’air que ressentent les personnes et les objets stockés.",
  multipleTitle: "Pourquoi plusieurs sondes valent mieux qu’une",
  multipleHtml:
    "Garages, ateliers et combles ne sont pas des boîtes homogènes. Un seul capteur peut indiquer 7 °C (45 °F) près du sol alors que le haut du local est à 14 °C (58 °F) par un après-midi d’hiver ensoleillé. Plusieurs sondes révèlent les gradients, les défauts d’isolation et la zone qui représente vraiment le risque qui vous préoccupe. Le firmware fait la moyenne des sondes actives : la page d’historique conserve ainsi un instantané de synthèse par chargement, tandis que la page d’accueil garde le détail par sonde.",
  boardAlt: "Carte contrôleur de sondes ProbeHarbor avec connexion Ethernet et capteurs DHT22",
  boardCaption: "Deuxième révision de la carte de sondes ProbeHarbor : Ethernet, écran LCD et deux entrées DHT22.",
  webTitle: "Du fil de la sonde à la page web",
  webHtml:
    'Les sondes ne communiquent pas directement avec le site. Le sketch Arduino lit chaque capteur à intervalles réguliers, valide les plages de valeurs et publie du JSON en HTTPS. Le site récupère ce flux, associe les clés aux libellés lisibles que vous configurez dans le tableau de bord et, si vous êtes connecté, peut enregistrer les mesures. Essayez la <a class="text-link" href="/about/probe-demo">démo interactive des sondes</a> pour voir comment se comportent plusieurs zones et les moyennes, ou lisez le guide du <a class="text-link" href="/about/data-flow">flux de données de bout en bout</a>.',
};

const de: Messages = {
  introHtml:
    'Temperaturfühler sind die Messebene jeder Umgebungsüberwachung. In Garage, Werkstatt, Dachboden, Kriechkeller oder Betriebshalle übersetzen sie Wärme und Feuchtigkeit in Zahlen, die der Rest des Systems speichern, als Diagramm darstellen und für Alarme nutzen kann. Dieses Projekt verwendet digitale Feuchte- und Temperatursensoren an einem Arduino, mit mehreren Fühlerkanälen, damit du Bereiche vergleichen kannst, statt dich auf einen einzelnen Messwert zu verlassen. Die ganze Geschichte des Aufbaus findest du in der <a class="text-link" href="/about/temperature-probe-case-study">Fallstudie zum Temperaturfühler</a>.',
  measureTitle: "Was Fühler in der Praxis messen",
  measureHtml:
    "Jeder Fühler liefert zwei Werte, die für alltägliche Entscheidungen zählen: Lufttemperatur und relative Luftfeuchtigkeit. Die Temperatur zeigt dir, ob Leitungen, Farbe oder eingelagerte Sachen sich kritischen Grenzen nähern. Die Luftfeuchtigkeit erklärt Kondenswasser an kalten Flächen und Rost an Werkzeugen und hilft bei der Frage, ob sich ein Luftentfeuchter über Nacht lohnt.",
  jsonHtml:
    "In diesem Aufbau stellen die Fühler ihre Messwerte als JSON-Objekt bereit, nach Fühlernummer geordnet: <code>0</code>, <code>1</code> und ein berechneter Mittelwert <code>avg</code> über alle aktiven Sensoren. Diese Struktur lässt sich sauber auf Dashboard-Bezeichnungen wie „Nordwand“ oder „Werkbank“ abbilden.",
  usesTitle: "Typische Einsätze von Fühlern in unbeheizten Räumen",
  uses: [
    "<strong>Frostschutz:</strong> Verfolge die nächtlichen Tiefstwerte an Außenwänden, bevor die Leitungen in Gefahr geraten.",
    "<strong>Jahreszeitenvergleich:</strong> Vergleiche Bereiche unter dem Dachboden mit der Bodenebene während der Sommerhitze.",
    "<strong>Zustand der Ausrüstung:</strong> Behalte die Luftfeuchtigkeit rund um Metallwerkzeuge, Akkus oder Papierablagen im Blick.",
    "<strong>Arbeitskomfort:</strong> Prüfe, ob Änderungen an Dämmung oder Lüftung wirklich etwas bringen.",
    "<strong>Fernkontrolle:</strong> Wirf unterwegs einen Blick auf die Live-Werte, statt nur anhand des Außenwetters zu raten.",
  ],
  placementTitle: "Der Montageort zählt mehr als der Sensorpreis",
  placementHtml:
    "Ein Fühler neben einem ungedämmten Garagentor schwankt bei jedem Öffnen stark. Einer an einer Nordwand kann der Außentemperatur um Stunden hinterherhinken. Für stabile Verläufe montierst du Fühler fern von direkter Sonne, Luftzug von Ventilatoren und Wärmequellen wie Gefriertruhen oder Warmwasserbereitern. Schulterhöhe (1,2–1,5 m) entspricht meist der Luft, die Menschen und eingelagerte Dinge tatsächlich umgibt.",
  multipleTitle: "Warum mehrere Fühler besser sind als einer",
  multipleHtml:
    "Garagen, Werkstätten und Dachböden sind keine gleichmäßigen Kisten. Ein einzelner Sensor zeigt vielleicht 7 °C (45 °F) in Bodennähe, während es unter der Decke an einem sonnigen Winternachmittag 14 °C (58 °F) sind. Mehrere Fühler machen Temperaturgefälle, schlecht gedämmte Stellen und den Bereich sichtbar, der das für dich relevante Risiko darstellt. Die Firmware mittelt die aktiven Fühler, sodass die Verlaufsseite weiterhin einen zusammenfassenden Wert pro Abruf hat, während die Startseite die Details je Fühler behält.",
  boardAlt: "ProbeHarbor-Fühlerplatine mit Ethernet-Anschluss und DHT22-Sensoren",
  boardCaption: "Zweite Revision der ProbeHarbor-Fühlerplatine: Ethernet, LCD und zwei DHT22-Eingänge.",
  webTitle: "Vom Fühlerkabel zur Webseite",
  webHtml:
    'Die Fühler sprechen nicht direkt mit der Website. Der Arduino-Sketch liest jeden Sensor in festen Abständen, prüft die Wertebereiche und veröffentlicht JSON über HTTPS. Die Website ruft diesen Feed ab, ordnet die Schlüssel den lesbaren Bezeichnungen zu, die du im Dashboard festlegst, und speichert die Messwerte auf Wunsch, wenn du angemeldet bist. Probier die <a class="text-link" href="/about/probe-demo">interaktive Fühler-Demo</a> aus, um zu sehen, wie sich mehrere Bereiche und Mittelwerte verhalten, oder lies den Leitfaden zum <a class="text-link" href="/about/data-flow">Datenfluss von Anfang bis Ende</a>.',
};

const ptBr: Messages = {
  introHtml:
    'As sondas de temperatura são a camada de medição de qualquer monitor ambiental. Em uma garagem, oficina, sótão, porão ou galpão, elas transformam calor e umidade em números que o resto do sistema pode armazenar, colocar em gráficos e usar para alertas. Este projeto usa sensores digitais de umidade e temperatura ligados a um Arduino, com vários canais de sonda para você comparar áreas em vez de confiar em uma única leitura. Para a história completa da montagem, leia o <a class="text-link" href="/about/temperature-probe-case-study">estudo de caso da sonda de temperatura</a>.',
  measureTitle: "O que as sondas medem na prática",
  measureHtml:
    "Cada sonda informa dois valores que importam nas decisões do dia a dia: a temperatura do ar e a umidade relativa. A temperatura mostra se canos, tinta ou itens guardados estão chegando perto de limites arriscados. A umidade ajuda a explicar a condensação em superfícies frias, a ferrugem nas ferramentas e se vale a pena ligar o desumidificador à noite.",
  jsonHtml:
    "Nesta montagem, as sondas expõem suas leituras em um objeto JSON indexado pelo número da sonda: <code>0</code>, <code>1</code> e um <code>avg</code> calculado a partir dos sensores ativos. Essa estrutura se encaixa facilmente em rótulos do painel como “Parede norte” ou “Área da bancada”.",
  usesTitle: "Usos comuns das sondas em espaços sem aquecimento",
  uses: [
    "<strong>Proteção contra congelamento:</strong> acompanhe as mínimas da madrugada perto das paredes externas antes que o encanamento corra risco.",
    "<strong>Comparação sazonal:</strong> compare as áreas perto do sótão com o nível do piso durante o calor do verão.",
    "<strong>Saúde dos equipamentos:</strong> fique de olho na umidade perto de ferramentas de metal, baterias ou papéis guardados.",
    "<strong>Conforto para trabalhar:</strong> confirme se mudanças no isolamento ou na ventilação realmente ajudam.",
    "<strong>Verificação remota:</strong> consulte as leituras ao vivo quando estiver fora, em vez de adivinhar só pelo clima lá fora.",
  ],
  placementTitle: "A posição importa mais que o preço do sensor",
  placementHtml:
    "Uma sonda perto de um portão sem isolamento vai oscilar muito toda vez que ele abrir. Uma em uma parede voltada para o norte pode ficar horas atrás da temperatura externa. Para ter tendências estáveis, instale as sondas longe de sol direto, do vento de ventiladores e de fontes de calor como freezers ou aquecedores de água. A altura dos ombros (1,2–1,5 m) costuma representar o ar que as pessoas e os itens guardados sentem.",
  multipleTitle: "Por que várias sondas são melhores que uma",
  multipleHtml:
    "Garagens, oficinas e sótãos não são caixas uniformes. Um único sensor pode marcar 7 °C (45 °F) perto do piso enquanto a parte de cima está a 14 °C (58 °F) em uma tarde ensolarada de inverno. Várias sondas revelam gradientes, pontos com isolamento ruim e qual área representa o risco que importa para você. O firmware tira a média das sondas ativas, então a página de histórico continua com um resumo por carregamento, enquanto a página inicial mantém o detalhe de cada sonda.",
  boardAlt: "Placa controladora de sondas do ProbeHarbor com conexão Ethernet e sensores DHT22",
  boardCaption: "Segunda revisão da placa de sondas do ProbeHarbor: Ethernet, LCD e duas entradas DHT22.",
  webTitle: "Do fio da sonda à página web",
  webHtml:
    'As sondas não falam diretamente com o site. O sketch do Arduino lê cada sensor em intervalos programados, valida as faixas e publica JSON via HTTPS. O site busca esse feed, associa as chaves aos rótulos que você configura no painel e, se você estiver conectado, pode salvar as leituras. Experimente a <a class="text-link" href="/about/probe-demo">demonstração interativa de sondas</a> para ver como várias áreas e as médias se comportam, ou leia o guia do <a class="text-link" href="/about/data-flow">fluxo de dados de ponta a ponta</a>.',
};

export const temperatureProbesMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

import { defineMessages } from "../../translate";

/** /about/historical-data body copy. `*Html` keys are trusted inline HTML (English hrefs). */
const en = {
  introHtml:
    "Live readings answer “what is happening now?” Historical data answers “what usually happens here?” ProbeHarbor stores sensor readings from push ingest and pull feeds, collected on a <strong>15-minute</strong> schedule (and whenever you refresh Live).",
  whyTitle: "Why keep history at all",
  whyHtml:
    "Spot checks are easy to forget. A timestamped record reveals overnight minimums during a cold week, slow humidity creep after a roof leak, or the first day spring warmth stays above freezing inside. That context supports insurance documentation, HVAC tuning, and deciding whether insulation upgrades paid off.",
  storedTitle: "What gets stored",
  storedHtml:
    "Each saved row includes Fahrenheit and Celsius temperatures, humidity percentage, timestamp, feed name, probe label, and probe key. Multiple probes from one load create multiple rows, while the configured average still captures a quick summary. Data is associated with your account so guests do not write to the shared history table.",
  browseTitle: "Browsing paginated history",
  browseHtml:
    "The dashboard history view lists recent snapshots with feed and probe columns so you can filter mentally by zone. Pagination keeps large datasets responsive. When you need the full record outside the website, CSV export downloads every stored reading for your account: available to admins and active subscribers.",
  csvTitle: "CSV export workflows",
  csvItems: [
    "Import into spreadsheets for pivot tables and custom charts.",
    "Join with utility bills or weather archives for correlation studies.",
    "Share anonymized excerpts with contractors when diagnosing insulation issues.",
    "Archive yearly files for long-term property records.",
  ],
  analysisTitle: "Analysis ideas",
  analysisHtml:
    "Plot daily minimum temperature through December to find how often you approach pipe-freeze risk. Compare average humidity before and after installing a dehumidifier. Overlay probe <code>0</code> versus <code>1</code> to quantify wall-to-wall differences. Because keys are stable in JSON feeds, scripts you write today still work after you rename display labels in the dashboard.",
  yoyTitle: "Year-over-year comparisons",
  yoyHtml:
    "<strong>Overview</strong> shows <em>This week vs last year</em> when you have probe data from the same window one year ago. On <strong>History</strong> (Pro, 365+ days retention), enable <strong>Compare to last year</strong> for a gray overlay on the chart. When you do not yet have local probe data from last year, ProbeHarbor can show an <strong>outdoor estimate</strong> from Open-Meteo at your weather or freeze-map location: clearly labeled, not a substitute for your probe history.",
  limitsTitle: "Limits and good practices",
  limitsHtml:
    "History depth depends on your plan (Free vs Member vs Pro). For minute-by-minute forensic work, add a dedicated logger locally. Treat this store as a convenient, account-backed journal rather than a laboratory instrument.",
  outroHtml:
    'Subscription details for CSV export are covered in <a class="text-link" href="/about/accounts-and-dashboard">accounts and dashboard tools</a>.',
};

type Messages = typeof en;

const es: Messages = {
  introHtml:
    "Las lecturas en vivo responden a «¿qué está pasando ahora?». Los datos históricos responden a «¿qué suele pasar aquí?». ProbeHarbor guarda las lecturas de los sensores procedentes de ingesta push y de feeds pull, recogidas <strong>cada 15 minutos</strong> (y cada vez que actualizas Live).",
  whyTitle: "Para qué guardar historial",
  whyHtml:
    "Las comprobaciones puntuales se olvidan fácilmente. Un registro con fecha y hora revela las mínimas nocturnas de una semana fría, el lento aumento de la humedad tras una gotera en el tejado o el primer día de primavera en que el interior se mantiene por encima de 0 °C (32 °F). Ese contexto sirve para documentar ante el seguro, ajustar la climatización y decidir si las mejoras de aislamiento valieron la pena.",
  storedTitle: "Qué se guarda",
  storedHtml:
    "Cada fila guardada incluye la temperatura en Fahrenheit y Celsius, el porcentaje de humedad, la marca de tiempo, el nombre del feed, la etiqueta de la sonda y su clave. Varias sondas en una misma carga generan varias filas, y el promedio configurado sigue ofreciendo un resumen rápido. Los datos están asociados a tu cuenta, así que los visitantes no escriben en la tabla de historial compartida.",
  browseTitle: "Navegar por el historial paginado",
  browseHtml:
    "La vista de historial del panel muestra las instantáneas recientes con columnas de feed y sonda para que puedas filtrar mentalmente por zona. La paginación mantiene ágiles los conjuntos de datos grandes. Cuando necesitas el registro completo fuera del sitio, la exportación CSV descarga todas las lecturas guardadas de tu cuenta: disponible para administradores y suscriptores activos.",
  csvTitle: "Usos de la exportación CSV",
  csvItems: [
    "Impórtala en hojas de cálculo para tablas dinámicas y gráficos a medida.",
    "Crúzala con facturas de suministros o archivos meteorológicos para estudios de correlación.",
    "Comparte extractos anonimizados con profesionales al diagnosticar problemas de aislamiento.",
    "Archiva un fichero por año como registro a largo plazo de la propiedad.",
  ],
  analysisTitle: "Ideas de análisis",
  analysisHtml:
    "Grafica la temperatura mínima diaria durante diciembre para ver con qué frecuencia te acercas al riesgo de congelación de tuberías. Compara la humedad media antes y después de instalar un deshumidificador. Superpón la sonda <code>0</code> con la <code>1</code> para cuantificar las diferencias entre paredes. Como las claves de los feeds JSON son estables, los scripts que escribas hoy seguirán funcionando aunque cambies las etiquetas en el panel.",
  yoyTitle: "Comparaciones interanuales",
  yoyHtml:
    "<strong>Overview</strong> muestra <em>This week vs last year</em> (esta semana frente al año pasado) cuando tienes datos de sondas del mismo periodo de hace un año. En <strong>History</strong> (Pro, más de 365 días de conservación), activa <strong>Compare to last year</strong> para ver una superposición gris en el gráfico. Si todavía no tienes datos locales del año pasado, ProbeHarbor puede mostrar una <strong>estimación exterior</strong> de Open-Meteo para la ubicación de tu tiempo o de tu mapa de heladas: claramente etiquetada y sin sustituir el historial de tus sondas.",
  limitsTitle: "Límites y buenas prácticas",
  limitsHtml:
    "La profundidad del historial depende de tu plan (Free, Member o Pro). Para análisis forenses minuto a minuto, añade un registrador dedicado en local. Trata este almacén como un diario práctico vinculado a tu cuenta, no como un instrumento de laboratorio.",
  outroHtml:
    'Los detalles de la suscripción para la exportación CSV se explican en <a class="text-link" href="/about/accounts-and-dashboard">herramientas de cuenta y panel</a>.',
};

const fr: Messages = {
  introHtml:
    "Les mesures en direct répondent à « que se passe-t-il maintenant ? ». Les données historiques répondent à « que se passe-t-il d’habitude ici ? ». ProbeHarbor stocke les mesures des capteurs issues de l’ingestion push et des flux pull, collectées <strong>toutes les 15 minutes</strong> (et à chaque actualisation de Live).",
  whyTitle: "Pourquoi conserver un historique",
  whyHtml:
    "Les contrôles ponctuels s’oublient vite. Un relevé horodaté révèle les minimales nocturnes d’une semaine froide, la lente montée de l’humidité après une fuite de toiture, ou le premier jour de printemps où l’intérieur reste au-dessus de 0 °C (32 °F). Ce contexte appuie les dossiers d’assurance, le réglage du chauffage et de la climatisation, et permet de juger si des travaux d’isolation ont porté leurs fruits.",
  storedTitle: "Ce qui est enregistré",
  storedHtml:
    "Chaque ligne enregistrée comprend les températures en Fahrenheit et en Celsius, le pourcentage d’humidité, l’horodatage, le nom du flux, le libellé et la clé de la sonde. Plusieurs sondes lues en un chargement créent plusieurs lignes, tandis que la moyenne configurée offre toujours un résumé rapide. Les données sont associées à votre compte : les visiteurs n’écrivent pas dans la table d’historique partagée.",
  browseTitle: "Parcourir l’historique paginé",
  browseHtml:
    "La vue historique du tableau de bord liste les instantanés récents avec des colonnes flux et sonde, pour filtrer mentalement par zone. La pagination garde les gros volumes de données réactifs. Quand vous avez besoin de l’intégralité des relevés hors du site, l’export CSV télécharge toutes les mesures enregistrées de votre compte : réservé aux administrateurs et aux abonnés actifs.",
  csvTitle: "Utiliser l’export CSV",
  csvItems: [
    "Importez-le dans un tableur pour des tableaux croisés dynamiques et des graphiques personnalisés.",
    "Croisez-le avec vos factures d’énergie ou des archives météo pour étudier les corrélations.",
    "Partagez des extraits anonymisés avec des artisans pour diagnostiquer des problèmes d’isolation.",
    "Archivez un fichier par an pour garder une trace durable du logement.",
  ],
  analysisTitle: "Idées d’analyse",
  analysisHtml:
    "Tracez la température minimale quotidienne sur décembre pour voir à quelle fréquence vous approchez du risque de gel des canalisations. Comparez l’humidité moyenne avant et après l’installation d’un déshumidificateur. Superposez la sonde <code>0</code> et la sonde <code>1</code> pour chiffrer l’écart d’un mur à l’autre. Comme les clés des flux JSON sont stables, les scripts écrits aujourd’hui fonctionneront encore après un changement de libellés dans le tableau de bord.",
  yoyTitle: "Comparaisons d’une année sur l’autre",
  yoyHtml:
    "<strong>Overview</strong> affiche <em>This week vs last year</em> (cette semaine par rapport à l’an dernier) lorsque vous avez des données de sonde sur la même période un an plus tôt. Dans <strong>History</strong> (Pro, conservation de 365 jours ou plus), activez <strong>Compare to last year</strong> pour superposer une courbe grise au graphique. Si vous n’avez pas encore de données locales de l’an dernier, ProbeHarbor peut afficher une <strong>estimation extérieure</strong> Open-Meteo pour l’emplacement de votre météo ou de votre carte de gel : clairement indiquée, elle ne remplace pas l’historique de vos sondes.",
  limitsTitle: "Limites et bonnes pratiques",
  limitsHtml:
    "La profondeur de l’historique dépend de votre formule (Free, Member ou Pro). Pour une analyse minute par minute, ajoutez un enregistreur dédié sur place. Considérez ce stockage comme un journal pratique lié à votre compte, pas comme un instrument de laboratoire.",
  outroHtml:
    'Les conditions d’abonnement pour l’export CSV sont détaillées dans <a class="text-link" href="/about/accounts-and-dashboard">outils du compte et du tableau de bord</a>.',
};

const de: Messages = {
  introHtml:
    "Live-Werte beantworten die Frage „Was passiert gerade?“. Verlaufsdaten beantworten „Was passiert hier normalerweise?“. ProbeHarbor speichert Sensorwerte aus Push-Ingest und Pull-Feeds, erfasst <strong>alle 15 Minuten</strong> (und jedes Mal, wenn du Live aktualisierst).",
  whyTitle: "Warum überhaupt einen Verlauf speichern",
  whyHtml:
    "Stichproben vergisst man leicht. Eine Aufzeichnung mit Zeitstempel zeigt die nächtlichen Tiefstwerte einer kalten Woche, den schleichenden Anstieg der Luftfeuchtigkeit nach einem undichten Dach oder den ersten Frühlingstag, an dem es drinnen über 0 °C (32 °F) bleibt. Dieser Zusammenhang hilft bei der Dokumentation für die Versicherung, beim Einstellen von Heizung und Lüftung und bei der Frage, ob sich eine bessere Dämmung gelohnt hat.",
  storedTitle: "Was gespeichert wird",
  storedHtml:
    "Jede gespeicherte Zeile enthält die Temperatur in Fahrenheit und Celsius, die Luftfeuchtigkeit in Prozent, den Zeitstempel, den Feed-Namen, die Fühlerbezeichnung und den Fühlerschlüssel. Mehrere Fühler in einem Abruf erzeugen mehrere Zeilen, während der konfigurierte Mittelwert weiterhin eine schnelle Zusammenfassung liefert. Die Daten sind deinem Konto zugeordnet, Gäste schreiben also nicht in die gemeinsame Verlaufstabelle.",
  browseTitle: "Den Verlauf seitenweise durchsuchen",
  browseHtml:
    "Die Verlaufsansicht im Dashboard listet die letzten Messwerte mit Spalten für Feed und Fühler auf, sodass du gedanklich nach Bereich filtern kannst. Die Seitenaufteilung hält auch große Datenmengen flüssig. Wenn du die vollständigen Daten außerhalb der Website brauchst, lädt der CSV-Export alle gespeicherten Messwerte deines Kontos herunter: verfügbar für Admins und aktive Abonnenten.",
  csvTitle: "Was du mit dem CSV-Export machen kannst",
  csvItems: [
    "In eine Tabellenkalkulation importieren, für Pivot-Tabellen und eigene Diagramme.",
    "Mit Nebenkostenabrechnungen oder Wetterarchiven verknüpfen, um Zusammenhänge zu untersuchen.",
    "Anonymisierte Auszüge mit Handwerkern teilen, wenn Dämmprobleme gesucht werden.",
    "Jahresdateien als langfristige Aufzeichnung für das Gebäude archivieren.",
  ],
  analysisTitle: "Ideen für Auswertungen",
  analysisHtml:
    "Trage die tägliche Tiefsttemperatur im Dezember auf, um zu sehen, wie oft du dem Risiko eingefrorener Leitungen nahekommst. Vergleiche die mittlere Luftfeuchtigkeit vor und nach dem Aufstellen eines Luftentfeuchters. Lege Fühler <code>0</code> und <code>1</code> übereinander, um Unterschiede zwischen den Wänden zu beziffern. Da die Schlüssel in JSON-Feeds stabil bleiben, funktionieren Skripte von heute auch dann noch, wenn du die Anzeigenamen im Dashboard änderst.",
  yoyTitle: "Vergleich mit dem Vorjahr",
  yoyHtml:
    "<strong>Overview</strong> zeigt <em>This week vs last year</em> (diese Woche im Vergleich zum Vorjahr), sobald du Fühlerdaten aus demselben Zeitraum vor einem Jahr hast. Unter <strong>History</strong> (Pro, mindestens 365 Tage Aufbewahrung) aktivierst du <strong>Compare to last year</strong> für eine graue Vergleichskurve im Diagramm. Hast du noch keine eigenen Fühlerdaten aus dem Vorjahr, kann ProbeHarbor eine <strong>Außenschätzung</strong> von Open-Meteo für deinen Wetter- oder Frostkarten-Standort anzeigen: klar gekennzeichnet und kein Ersatz für deinen Fühlerverlauf.",
  limitsTitle: "Grenzen und gute Praxis",
  limitsHtml:
    "Wie weit der Verlauf zurückreicht, hängt von deinem Tarif ab (Free, Member oder Pro). Für minutengenaue Ursachenforschung ergänzt du vor Ort einen eigenen Datenlogger. Betrachte diesen Speicher als praktisches, kontogebundenes Tagebuch und nicht als Laborinstrument.",
  outroHtml:
    'Die Abo-Details zum CSV-Export findest du unter <a class="text-link" href="/about/accounts-and-dashboard">Konto- und Dashboard-Werkzeuge</a>.',
};

const ptBr: Messages = {
  introHtml:
    "Leituras ao vivo respondem “o que está acontecendo agora?”. Dados históricos respondem “o que costuma acontecer aqui?”. O ProbeHarbor armazena as leituras dos sensores vindas de ingestão push e de feeds pull, coletadas <strong>a cada 15 minutos</strong> (e sempre que você atualiza o Live).",
  whyTitle: "Por que guardar histórico",
  whyHtml:
    "Verificações pontuais são fáceis de esquecer. Um registro com data e hora mostra as mínimas da madrugada em uma semana fria, o aumento lento da umidade depois de uma goteira no telhado ou o primeiro dia de primavera em que o interior fica acima de 0 °C (32 °F). Esse contexto ajuda na documentação para o seguro, no ajuste da climatização e na decisão de se as melhorias de isolamento valeram a pena.",
  storedTitle: "O que é armazenado",
  storedHtml:
    "Cada linha salva inclui temperaturas em Fahrenheit e Celsius, porcentagem de umidade, data e hora, nome do feed, rótulo e chave da sonda. Várias sondas em um mesmo carregamento geram várias linhas, e a média configurada continua oferecendo um resumo rápido. Os dados ficam associados à sua conta, então visitantes não gravam na tabela de histórico compartilhada.",
  browseTitle: "Navegando pelo histórico paginado",
  browseHtml:
    "A visão de histórico do painel lista as leituras recentes com colunas de feed e sonda, para você filtrar mentalmente por área. A paginação mantém grandes volumes de dados rápidos. Quando você precisa do registro completo fora do site, a exportação em CSV baixa todas as leituras salvas da sua conta: disponível para administradores e assinantes ativos.",
  csvTitle: "Usos da exportação em CSV",
  csvItems: [
    "Importe em planilhas para tabelas dinâmicas e gráficos personalizados.",
    "Cruze com contas de luz e gás ou arquivos de clima para estudos de correlação.",
    "Compartilhe trechos anonimizados com prestadores de serviço ao diagnosticar problemas de isolamento.",
    "Arquive um arquivo por ano como registro de longo prazo do imóvel.",
  ],
  analysisTitle: "Ideias de análise",
  analysisHtml:
    "Monte um gráfico da temperatura mínima diária ao longo de dezembro para ver com que frequência você chega perto do risco de congelamento dos canos. Compare a umidade média antes e depois de instalar um desumidificador. Sobreponha a sonda <code>0</code> à sonda <code>1</code> para medir a diferença entre paredes. Como as chaves dos feeds JSON são estáveis, os scripts que você escrever hoje continuam funcionando mesmo depois de renomear os rótulos no painel.",
  yoyTitle: "Comparações com o ano anterior",
  yoyHtml:
    "<strong>Overview</strong> mostra <em>This week vs last year</em> (esta semana comparada ao ano passado) quando você tem dados de sondas do mesmo período de um ano atrás. Em <strong>History</strong> (Pro, 365 dias ou mais de retenção), ative <strong>Compare to last year</strong> para ver uma sobreposição cinza no gráfico. Se você ainda não tem dados locais do ano passado, o ProbeHarbor pode mostrar uma <strong>estimativa externa</strong> do Open-Meteo para o local do seu clima ou do seu mapa de congelamento: claramente identificada e sem substituir o histórico das suas sondas.",
  limitsTitle: "Limites e boas práticas",
  limitsHtml:
    "A profundidade do histórico depende do seu plano (Free, Member ou Pro). Para uma análise detalhada minuto a minuto, adicione um registrador dedicado no local. Trate este armazenamento como um diário prático ligado à sua conta, não como um instrumento de laboratório.",
  outroHtml:
    'Os detalhes da assinatura para exportação em CSV estão em <a class="text-link" href="/about/accounts-and-dashboard">ferramentas de conta e painel</a>.',
};

export const historicalDataMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

import { defineMessages } from "../../translate";

/** /about/data-flow body copy. `*Html` keys are trusted inline HTML (English hrefs). */
const en = {
  introHtml:
    "Every number on the home page travels through several layers. Understanding that pipeline helps when debugging stale readings, missing probes, or history gaps.",
  step1Title: "Step 1. Sensing in the space",
  step1Html:
    'Probes measure temperature and humidity. The Arduino sketch polls them every few seconds, discards obvious outliers, and prepares an in-memory JSON structure. Details: <a class="text-link" href="/about/arduino-sketches">Arduino sketches</a> and <a class="text-link" href="/about/temperature-probes">temperature probes</a>.',
  step2Title: "Step 2. Publishing JSON",
  step2Html:
    'The board or a nearby relay exposes HTTPS JSON. A Python FastAPI service may cache responses in Redis so the wider internet never hits the residential uplink directly: see <a class="text-link" href="/about/python-feeds">Python scripts and feeds</a>.',
  jsonAlt: "Browser JSON viewer showing temp probe keys 0, 1, and avg with Fahrenheit Celsius and humidity",
  jsonCaption: "Live feed payload shape consumed by the website after leaving the local network.",
  step3Title: "Step 3. Website fetch and display",
  step3Html:
    "When you load the home page, server code retrieves each configured feed URL, parses probe keys, and renders stat cards. Signed-in users load feed and probe mappings from Supabase instead of defaults. Weather data follows a parallel path via OpenWeather using your optional city override.",
  step4Title: "Step 4. Persisting history",
  step4Html:
    'If you are authenticated, successful probe reads insert rows into Supabase with feed name, probe label, key, temperatures, humidity, and timestamp. Guests still see live data but do not append history. Learn more in <a class="text-link" href="/about/historical-data">historical data usage</a>.',
  step5Title: "Step 5. Dashboard and export",
  step5Html:
    'The history table paginates those rows. CSV export streams the full set for admins and subscribers. Stripe webhooks maintain membership in the export-capable group. Account tools are described in <a class="text-link" href="/about/accounts-and-dashboard">accounts and dashboard</a>.',
  failuresTitle: "Failure points to check",
  failures: [
    "Probe wiring or power: serial logs on the Arduino.",
    "Home network or certificate: curl the feed URL from a laptop on LTE.",
    "Relay cache stale: restart upstream pull in fast-api-relay.",
    "Dashboard mapping: probe key typos hide readings even when JSON is valid.",
    "Auth cookies: history saves only for signed-in sessions.",
  ],
};

type Messages = typeof en;

const es: Messages = {
  introHtml:
    "Cada número de la página principal pasa por varias capas. Entender ese recorrido ayuda a depurar lecturas desactualizadas, sondas que faltan o huecos en el historial.",
  step1Title: "Paso 1. Medición en el espacio",
  step1Html:
    'Las sondas miden temperatura y humedad. El sketch de Arduino las consulta cada pocos segundos, descarta valores claramente anómalos y prepara una estructura JSON en memoria. Más detalles: <a class="text-link" href="/about/arduino-sketches">sketches de Arduino</a> y <a class="text-link" href="/about/temperature-probes">sondas de temperatura</a>.',
  step2Title: "Paso 2. Publicación del JSON",
  step2Html:
    'La placa o un relé cercano expone JSON por HTTPS. Un servicio FastAPI en Python puede almacenar las respuestas en caché en Redis para que el resto de internet nunca acceda directamente a la conexión de casa: consulta <a class="text-link" href="/about/python-feeds">scripts y feeds en Python</a>.',
  jsonAlt: "Visor JSON del navegador con las claves de sonda 0, 1 y avg, con Fahrenheit, Celsius y humedad",
  jsonCaption: "Estructura del feed en vivo que consume el sitio web una vez que sale de la red local.",
  step3Title: "Paso 3. Obtención y visualización en el sitio",
  step3Html:
    "Al cargar la página principal, el servidor obtiene cada URL de feed configurada, interpreta las claves de las sondas y genera las tarjetas de datos. Los usuarios con sesión iniciada cargan desde Supabase sus propias asignaciones de feeds y sondas en lugar de las predeterminadas. Los datos meteorológicos siguen un camino paralelo a través de OpenWeather, con la ciudad que hayas elegido si la indicas.",
  step4Title: "Paso 4. Guardado del historial",
  step4Html:
    'Si has iniciado sesión, cada lectura correcta de sonda inserta filas en Supabase con el nombre del feed, la etiqueta y la clave de la sonda, las temperaturas, la humedad y la marca de tiempo. Los visitantes siguen viendo datos en vivo, pero no añaden historial. Más información en <a class="text-link" href="/about/historical-data">uso de los datos históricos</a>.',
  step5Title: "Paso 5. Panel y exportación",
  step5Html:
    'La tabla de historial pagina esas filas. La exportación CSV envía el conjunto completo a administradores y suscriptores. Los webhooks de Stripe mantienen la pertenencia al grupo con permiso de exportación. Las herramientas de la cuenta se describen en <a class="text-link" href="/about/accounts-and-dashboard">cuentas y panel</a>.',
  failuresTitle: "Puntos de fallo que revisar",
  failures: [
    "Cableado o alimentación de la sonda: registros serie del Arduino.",
    "Red doméstica o certificado: haz curl a la URL del feed desde un portátil conectado por LTE.",
    "Caché del relé desactualizada: reinicia la descarga desde el origen en fast-api-relay.",
    "Asignación en el panel: una errata en la clave de la sonda oculta lecturas aunque el JSON sea válido.",
    "Cookies de sesión: el historial solo se guarda con la sesión iniciada.",
  ],
};

const fr: Messages = {
  introHtml:
    "Chaque chiffre de la page d’accueil traverse plusieurs couches. Comprendre ce parcours aide à diagnostiquer des mesures figées, des sondes manquantes ou des trous dans l’historique.",
  step1Title: "Étape 1. Mesure sur place",
  step1Html:
    'Les sondes mesurent la température et l’humidité. Le sketch Arduino les interroge toutes les quelques secondes, écarte les valeurs manifestement aberrantes et prépare une structure JSON en mémoire. En détail : <a class="text-link" href="/about/arduino-sketches">sketches Arduino</a> et <a class="text-link" href="/about/temperature-probes">sondes de température</a>.',
  step2Title: "Étape 2. Publication du JSON",
  step2Html:
    'La carte ou un relais à proximité expose du JSON en HTTPS. Un service Python FastAPI peut mettre les réponses en cache dans Redis pour que l’internet public n’atteigne jamais directement la connexion du domicile : voir <a class="text-link" href="/about/python-feeds">scripts et flux Python</a>.',
  jsonAlt: "Visionneuse JSON du navigateur affichant les clés de sonde 0, 1 et avg avec Fahrenheit, Celsius et humidité",
  jsonCaption: "Structure du flux en direct consommée par le site une fois sortie du réseau local.",
  step3Title: "Étape 3. Récupération et affichage sur le site",
  step3Html:
    "Quand vous chargez la page d’accueil, le serveur récupère chaque URL de flux configurée, analyse les clés de sonde et affiche les cartes de mesures. Les utilisateurs connectés chargent leurs propres associations de flux et de sondes depuis Supabase plutôt que les valeurs par défaut. Les données météo suivent un chemin parallèle via OpenWeather, avec la ville de votre choix si vous en indiquez une.",
  step4Title: "Étape 4. Enregistrement de l’historique",
  step4Html:
    'Si vous êtes connecté, chaque lecture de sonde réussie insère des lignes dans Supabase avec le nom du flux, le libellé et la clé de la sonde, les températures, l’humidité et l’horodatage. Les visiteurs voient toujours les données en direct, mais n’alimentent pas l’historique. Pour en savoir plus : <a class="text-link" href="/about/historical-data">utilisation des données historiques</a>.',
  step5Title: "Étape 5. Tableau de bord et export",
  step5Html:
    'La table d’historique pagine ces lignes. L’export CSV transmet l’ensemble complet aux administrateurs et aux abonnés. Les webhooks Stripe tiennent à jour l’appartenance au groupe autorisé à exporter. Les outils du compte sont décrits dans <a class="text-link" href="/about/accounts-and-dashboard">comptes et tableau de bord</a>.',
  failuresTitle: "Points de défaillance à vérifier",
  failures: [
    "Câblage ou alimentation de la sonde : journaux série de l’Arduino.",
    "Réseau domestique ou certificat : lancez curl sur l’URL du flux depuis un portable connecté en 4G (LTE).",
    "Cache du relais périmé : relancez la récupération en amont dans fast-api-relay.",
    "Association dans le tableau de bord : une faute de frappe dans la clé de sonde masque les mesures même si le JSON est valide.",
    "Cookies d’authentification : l’historique n’est enregistré que pour les sessions connectées.",
  ],
};

const de: Messages = {
  introHtml:
    "Jede Zahl auf der Startseite durchläuft mehrere Ebenen. Wer diese Kette versteht, findet veraltete Messwerte, fehlende Fühler oder Lücken im Verlauf schneller.",
  step1Title: "Schritt 1. Messen vor Ort",
  step1Html:
    'Die Fühler messen Temperatur und Luftfeuchtigkeit. Der Arduino-Sketch fragt sie alle paar Sekunden ab, verwirft offensichtliche Ausreißer und baut im Speicher eine JSON-Struktur auf. Details: <a class="text-link" href="/about/arduino-sketches">Arduino-Sketches</a> und <a class="text-link" href="/about/temperature-probes">Temperaturfühler</a>.',
  step2Title: "Schritt 2. JSON veröffentlichen",
  step2Html:
    'Die Platine oder ein Relay in der Nähe stellt JSON über HTTPS bereit. Ein Python-FastAPI-Dienst kann die Antworten in Redis zwischenspeichern, damit das offene Internet nie direkt auf den Hausanschluss zugreift: siehe <a class="text-link" href="/about/python-feeds">Python-Skripte und Feeds</a>.',
  jsonAlt: "JSON-Ansicht im Browser mit den Fühlerschlüsseln 0, 1 und avg mit Fahrenheit, Celsius und Luftfeuchtigkeit",
  jsonCaption: "Aufbau des Live-Feeds, den die Website verarbeitet, nachdem er das lokale Netz verlassen hat.",
  step3Title: "Schritt 3. Abruf und Anzeige auf der Website",
  step3Html:
    "Wenn du die Startseite lädst, ruft der Server jede konfigurierte Feed-URL ab, liest die Fühlerschlüssel aus und zeigt die Messwertkarten an. Angemeldete Nutzer laden ihre Feed- und Fühlerzuordnungen aus Supabase statt der Standardwerte. Wetterdaten nehmen parallel den Weg über OpenWeather, auf Wunsch mit deiner eigenen Stadt.",
  step4Title: "Schritt 4. Verlauf speichern",
  step4Html:
    'Wenn du angemeldet bist, schreibt jeder erfolgreiche Fühlerabruf Zeilen in Supabase: Feed-Name, Fühlerbezeichnung, Schlüssel, Temperaturen, Luftfeuchtigkeit und Zeitstempel. Gäste sehen weiterhin Live-Daten, ergänzen aber keinen Verlauf. Mehr dazu unter <a class="text-link" href="/about/historical-data">Nutzung der Verlaufsdaten</a>.',
  step5Title: "Schritt 5. Dashboard und Export",
  step5Html:
    'Die Verlaufstabelle zeigt diese Zeilen seitenweise an. Der CSV-Export liefert Admins und Abonnenten den vollständigen Datensatz. Stripe-Webhooks halten die Mitgliedschaft in der exportberechtigten Gruppe aktuell. Die Kontowerkzeuge sind unter <a class="text-link" href="/about/accounts-and-dashboard">Konten und Dashboard</a> beschrieben.',
  failuresTitle: "Mögliche Fehlerquellen",
  failures: [
    "Verkabelung oder Stromversorgung des Fühlers: serielle Logs am Arduino.",
    "Heimnetz oder Zertifikat: die Feed-URL per curl von einem Laptop im Mobilfunknetz (LTE) abrufen.",
    "Veralteter Relay-Cache: den Upstream-Abruf in fast-api-relay neu starten.",
    "Zuordnung im Dashboard: Tippfehler im Fühlerschlüssel verbergen Messwerte, selbst wenn das JSON gültig ist.",
    "Anmelde-Cookies: Der Verlauf wird nur bei angemeldeten Sitzungen gespeichert.",
  ],
};

const ptBr: Messages = {
  introHtml:
    "Cada número da página inicial passa por várias camadas. Entender esse caminho ajuda a investigar leituras desatualizadas, sondas faltando ou buracos no histórico.",
  step1Title: "Passo 1. Medição no ambiente",
  step1Html:
    'As sondas medem temperatura e umidade. O sketch do Arduino consulta as sondas a cada poucos segundos, descarta valores claramente fora da curva e monta uma estrutura JSON na memória. Detalhes: <a class="text-link" href="/about/arduino-sketches">sketches do Arduino</a> e <a class="text-link" href="/about/temperature-probes">sondas de temperatura</a>.',
  step2Title: "Passo 2. Publicação do JSON",
  step2Html:
    'A placa ou um relay próximo expõe JSON via HTTPS. Um serviço FastAPI em Python pode guardar as respostas em cache no Redis para que a internet nunca acesse diretamente a conexão da sua casa: veja <a class="text-link" href="/about/python-feeds">scripts e feeds em Python</a>.',
  jsonAlt: "Visualizador de JSON do navegador mostrando as chaves de sonda 0, 1 e avg com Fahrenheit, Celsius e umidade",
  jsonCaption: "Formato do feed ao vivo consumido pelo site depois de sair da rede local.",
  step3Title: "Passo 3. Busca e exibição no site",
  step3Html:
    "Quando você carrega a página inicial, o servidor busca cada URL de feed configurada, interpreta as chaves das sondas e monta os cartões de leitura. Usuários conectados carregam do Supabase os próprios mapeamentos de feeds e sondas em vez dos padrões. Os dados de clima seguem um caminho paralelo pelo OpenWeather, usando a cidade que você escolher, se quiser.",
  step4Title: "Passo 4. Gravação do histórico",
  step4Html:
    'Se você estiver conectado, cada leitura bem-sucedida insere linhas no Supabase com nome do feed, rótulo e chave da sonda, temperaturas, umidade e data e hora. Visitantes continuam vendo os dados ao vivo, mas não adicionam histórico. Saiba mais em <a class="text-link" href="/about/historical-data">uso dos dados históricos</a>.',
  step5Title: "Passo 5. Painel e exportação",
  step5Html:
    'A tabela de histórico mostra essas linhas em páginas. A exportação em CSV entrega o conjunto completo para administradores e assinantes. Webhooks do Stripe mantêm a participação no grupo com permissão de exportar. As ferramentas da conta estão descritas em <a class="text-link" href="/about/accounts-and-dashboard">contas e painel</a>.',
  failuresTitle: "Pontos de falha para verificar",
  failures: [
    "Fiação ou alimentação da sonda: logs seriais no Arduino.",
    "Rede de casa ou certificado: rode curl na URL do feed a partir de um notebook conectado no 4G (LTE).",
    "Cache do relay desatualizado: reinicie a busca na origem no fast-api-relay.",
    "Mapeamento no painel: um erro de digitação na chave da sonda esconde leituras mesmo com o JSON válido.",
    "Cookies de login: o histórico só é salvo em sessões conectadas.",
  ],
};

export const dataFlowMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

import { defineMessages } from "../../translate";

/** /about/python-feeds body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
const en = {
  intro:
    "Microcontrollers excel at reading probes; Python excels at caching, authentication, and serving stable HTTPS endpoints. The fast-api-relay project sits between Arduino JSON and the Astro site, normalizing responses and reducing load on fragile embedded stacks.",
  relayTitle: "Why a relay layer helps",
  relayBody:
    "Direct browser fetches to a LAN IP address break when DNS changes, certificates expire, or the home uplink drops. A relay on a VPS or cloud worker presents one consistent URL, adds Redis caching so dashboards do not hammer the probe, and can aggregate multiple sites if you expand beyond a single property.",
  fastapiTitle: "FastAPI responsibilities",
  fastapiItemsHtml: [
    "Accept upstream fetches from the Arduino or local network agent on a schedule.",
    "Store the latest payload in Redis with a short TTL.",
    "Serve <code>GET /...</code> responses instantly from cache for the website.",
    "Log stale data when upstream stops updating: useful for alerting.",
  ],
  consumerTitle: "Example consumer fetch",
  consumerBodyHtml:
    "The Astro site’s fetch layer requests your configured HTTPS URL, parses the <code>temp</code> object (or auto-detects SenML / Home Assistant REST JSON when that root is missing), and maps keys to dashboard probes. The same URL can power Node scripts, Grafana JSON plugins, or Home Assistant REST sensors.",
  figureAlt: "Browser JSON viewer showing temp probe keys 0, 1, and avg with Fahrenheit Celsius and humidity",
  figureCaption: "Example relay payload shape the website expects after caching upstream Arduino JSON.",
  scriptsTitle: "Operational scripts",
  scriptsBody:
    "Beyond the API, small Python utilities validate JSON schema, backfill CSV archives, or compare probe averages against OpenWeather forecasts. Because probes expose plain JSON, you can prototype analytics in a notebook before promoting logic into production services.",
  repoTitle: "Repository reference",
  repoBodyHtml:
    'Implementation details, Redis configuration, and deployment notes for the relay are maintained in <a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/fast-api-relay">fast-api-relay</a>. Configure the public relay URL in your <a class="text-link" href="/dashboard/devices">temperature feed settings</a> after signing in.',
  unoTitle: "Uno Ethernet: HTTP→HTTPS for push ingest",
  unoBodyHtml:
    'A W5100 shield cannot POST to <code>https://probeharbor.dev</code>. The stdlib relay <a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/probeharbor/blob/main/sketches/relay/push_https_forward.py"><code>sketches/relay/push_https_forward.py</code></a> listens for HTTP from the Arduino and forwards the same path and body over HTTPS. Pair it with <a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest"><code>ethernet_dht22_ingest</code></a> (DHT22 on A4/A5, classic <code>temp</code> JSON).',
};

type PythonFeedsMessages = typeof en;

const REPO_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/fast-api-relay">fast-api-relay</a>';
const RELAY_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/probeharbor/blob/main/sketches/relay/push_https_forward.py"><code>sketches/relay/push_https_forward.py</code></a>';
const ETH_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest"><code>ethernet_dht22_ingest</code></a>';

const es: PythonFeedsMessages = {
  intro:
    "Los microcontroladores son excelentes leyendo sondas; Python destaca en caché, autenticación y en servir endpoints HTTPS estables. El proyecto fast-api-relay se sitúa entre el JSON del Arduino y el sitio Astro, normaliza las respuestas y reduce la carga sobre pilas embebidas frágiles.",
  relayTitle: "Por qué ayuda una capa de relay",
  relayBody:
    "Las peticiones directas del navegador a una IP de la red local fallan cuando cambia el DNS, caducan los certificados o se cae la conexión de casa. Un relay en un VPS o en un worker en la nube ofrece una única URL estable, añade caché con Redis para que los dashboards no saturen la sonda y puede agrupar varios sitios si te amplías más allá de una sola propiedad.",
  fastapiTitle: "Responsabilidades de FastAPI",
  fastapiItemsHtml: [
    "Recibir de forma programada los datos del Arduino o del agente de la red local.",
    "Guardar la carga más reciente en Redis con un TTL corto.",
    "Servir al instante desde la caché las respuestas <code>GET /...</code> para el sitio web.",
    "Registrar los datos obsoletos cuando el origen deja de actualizarse: útil para las alertas.",
  ],
  consumerTitle: "Ejemplo de consulta de un consumidor",
  consumerBodyHtml:
    "La capa de consultas del sitio Astro solicita la URL HTTPS que hayas configurado, analiza el objeto <code>temp</code> (o detecta automáticamente JSON de SenML / Home Assistant REST si falta esa raíz) y asigna las claves a las sondas del dashboard. La misma URL puede alimentar scripts de Node, plugins JSON de Grafana o sensores REST de Home Assistant.",
  figureAlt:
    "Visor JSON del navegador con las claves de sonda temp 0, 1 y avg, con Fahrenheit, Celsius y humedad",
  figureCaption: "Ejemplo de la estructura de carga del relay que espera el sitio web tras almacenar en caché el JSON del Arduino.",
  scriptsTitle: "Scripts operativos",
  scriptsBody:
    "Más allá de la API, pequeñas utilidades en Python validan el esquema JSON, rellenan archivos CSV históricos o comparan los promedios de las sondas con las previsiones de OpenWeather. Como las sondas exponen JSON plano, puedes prototipar análisis en un notebook antes de llevar la lógica a servicios en producción.",
  repoTitle: "Referencia del repositorio",
  repoBodyHtml: `Los detalles de implementación, la configuración de Redis y las notas de despliegue del relay se mantienen en ${REPO_LINK}. Configura la URL pública del relay en los <a class="text-link" href="/dashboard/devices">ajustes del feed de temperatura</a> después de iniciar sesión.`,
  unoTitle: "Uno Ethernet: HTTP→HTTPS para la ingesta push",
  unoBodyHtml: `Un shield W5100 no puede hacer POST a <code>https://probeharbor.dev</code>. El relay con la biblioteca estándar ${RELAY_LINK} escucha HTTP desde el Arduino y reenvía la misma ruta y el mismo cuerpo por HTTPS. Combínalo con ${ETH_LINK} (DHT22 en A4/A5, JSON <code>temp</code> clásico).`,
};

const fr: PythonFeedsMessages = {
  intro:
    "Les microcontrôleurs excellent dans la lecture des sondes ; Python excelle dans la mise en cache, l’authentification et la diffusion de points d’accès HTTPS stables. Le projet fast-api-relay se place entre le JSON de l’Arduino et le site Astro : il normalise les réponses et allège la charge des piles embarquées fragiles.",
  relayTitle: "Pourquoi une couche relais aide",
  relayBody:
    "Les requêtes directes du navigateur vers une adresse IP du réseau local échouent dès que le DNS change, qu’un certificat expire ou que la connexion de la maison tombe. Un relais sur un VPS ou un worker cloud expose une URL unique et stable, ajoute un cache Redis pour que les tableaux de bord ne sollicitent pas la sonde en permanence, et peut agréger plusieurs sites si vous dépassez un seul logement.",
  fastapiTitle: "Rôle de FastAPI",
  fastapiItemsHtml: [
    "Recevoir à intervalles réguliers les données de l’Arduino ou de l’agent du réseau local.",
    "Stocker la dernière charge utile dans Redis avec un TTL court.",
    "Servir instantanément depuis le cache les réponses <code>GET /...</code> pour le site web.",
    "Journaliser les données périmées quand la source ne se met plus à jour : utile pour les alertes.",
  ],
  consumerTitle: "Exemple de requête côté client",
  consumerBodyHtml:
    "La couche de requêtes du site Astro interroge l’URL HTTPS que vous avez configurée, analyse l’objet <code>temp</code> (ou détecte automatiquement du JSON SenML / Home Assistant REST si cette racine est absente) et associe les clés aux sondes du tableau de bord. La même URL peut alimenter des scripts Node, des plugins JSON Grafana ou des capteurs REST Home Assistant.",
  figureAlt:
    "Visionneuse JSON du navigateur affichant les clés de sonde temp 0, 1 et avg avec Fahrenheit, Celsius et humidité",
  figureCaption: "Exemple de structure de charge utile du relais attendue par le site après la mise en cache du JSON de l’Arduino.",
  scriptsTitle: "Scripts d’exploitation",
  scriptsBody:
    "Au-delà de l’API, de petits utilitaires Python valident le schéma JSON, complètent des archives CSV ou comparent les moyennes des sondes aux prévisions OpenWeather. Comme les sondes exposent du JSON brut, vous pouvez prototyper des analyses dans un notebook avant de passer la logique en production.",
  repoTitle: "Référence du dépôt",
  repoBodyHtml: `Les détails d’implémentation, la configuration Redis et les notes de déploiement du relais sont tenus à jour dans ${REPO_LINK}. Renseignez l’URL publique du relais dans les <a class="text-link" href="/dashboard/devices">réglages du flux de température</a> une fois connecté.`,
  unoTitle: "Uno Ethernet : HTTP→HTTPS pour l’ingestion push",
  unoBodyHtml: `Un shield W5100 ne peut pas faire de POST vers <code>https://probeharbor.dev</code>. Le relais en bibliothèque standard ${RELAY_LINK} écoute le HTTP de l’Arduino et retransmet le même chemin et le même corps en HTTPS. Associez-le à ${ETH_LINK} (DHT22 sur A4/A5, JSON <code>temp</code> classique).`,
};

const de: PythonFeedsMessages = {
  intro:
    "Mikrocontroller sind stark im Auslesen von Fühlern, Python im Caching, in der Authentifizierung und im Bereitstellen stabiler HTTPS-Endpunkte. Das Projekt fast-api-relay sitzt zwischen dem Arduino-JSON und der Astro-Website, vereinheitlicht die Antworten und entlastet empfindliche Embedded-Stacks.",
  relayTitle: "Warum eine Relay-Schicht hilft",
  relayBody:
    "Direkte Browser-Abrufe an eine IP-Adresse im lokalen Netz scheitern, sobald sich das DNS ändert, Zertifikate ablaufen oder der Internetanschluss zu Hause ausfällt. Ein Relay auf einem VPS oder Cloud-Worker bietet eine gleichbleibende URL, ergänzt Redis-Caching, damit Dashboards den Fühler nicht ständig abfragen, und kann mehrere Standorte bündeln, wenn du über ein einzelnes Objekt hinauswächst.",
  fastapiTitle: "Aufgaben von FastAPI",
  fastapiItemsHtml: [
    "Nach Zeitplan Daten vom Arduino oder vom Agenten im lokalen Netz entgegennehmen.",
    "Die neueste Payload mit kurzer TTL in Redis speichern.",
    "<code>GET /...</code>-Antworten für die Website sofort aus dem Cache ausliefern.",
    "Veraltete Daten protokollieren, wenn die Quelle nicht mehr aktualisiert: nützlich für Warnungen.",
  ],
  consumerTitle: "Beispiel für einen Abruf",
  consumerBodyHtml:
    "Die Abrufschicht der Astro-Website fragt deine konfigurierte HTTPS-URL ab, liest das Objekt <code>temp</code> aus (oder erkennt automatisch SenML- / Home-Assistant-REST-JSON, wenn diese Wurzel fehlt) und ordnet die Schlüssel den Fühlern im Dashboard zu. Dieselbe URL kann Node-Skripte, Grafana-JSON-Plugins oder REST-Sensoren in Home Assistant versorgen.",
  figureAlt:
    "JSON-Ansicht im Browser mit den Fühlerschlüsseln temp 0, 1 und avg samt Fahrenheit, Celsius und Luftfeuchtigkeit",
  figureCaption: "Beispiel für die Payload-Struktur des Relays, die die Website nach dem Cachen des Arduino-JSON erwartet.",
  scriptsTitle: "Betriebsskripte",
  scriptsBody:
    "Neben der API prüfen kleine Python-Werkzeuge das JSON-Schema, füllen CSV-Archive nach oder vergleichen Fühler-Mittelwerte mit OpenWeather-Vorhersagen. Weil die Fühler einfaches JSON liefern, kannst du Auswertungen erst in einem Notebook ausprobieren und die Logik dann in produktive Dienste übernehmen.",
  repoTitle: "Repository",
  repoBodyHtml: `Implementierungsdetails, Redis-Konfiguration und Hinweise zum Deployment des Relays findest du in ${REPO_LINK}. Trage die öffentliche Relay-URL nach der Anmeldung in deinen <a class="text-link" href="/dashboard/devices">Einstellungen für Temperatur-Feeds</a> ein.`,
  unoTitle: "Uno Ethernet: HTTP→HTTPS für Push-Ingest",
  unoBodyHtml: `Ein W5100-Shield kann keinen POST an <code>https://probeharbor.dev</code> senden. Das Relay ${RELAY_LINK} (nur Standardbibliothek) nimmt HTTP vom Arduino entgegen und leitet denselben Pfad und Body per HTTPS weiter. Kombiniere es mit ${ETH_LINK} (DHT22 an A4/A5, klassisches <code>temp</code>-JSON).`,
};

const ptBr: PythonFeedsMessages = {
  intro:
    "Microcontroladores são ótimos para ler sondas; o Python se destaca em cache, autenticação e em servir endpoints HTTPS estáveis. O projeto fast-api-relay fica entre o JSON do Arduino e o site em Astro, padronizando as respostas e reduzindo a carga sobre pilhas embarcadas frágeis.",
  relayTitle: "Por que uma camada de relay ajuda",
  relayBody:
    "Requisições diretas do navegador para um IP da rede local falham quando o DNS muda, os certificados expiram ou a internet de casa cai. Um relay em uma VPS ou em um worker na nuvem oferece uma única URL estável, adiciona cache com Redis para que os dashboards não sobrecarreguem a sonda e pode reunir vários locais se você expandir para além de um único imóvel.",
  fastapiTitle: "Responsabilidades do FastAPI",
  fastapiItemsHtml: [
    "Receber, em intervalos programados, os dados do Arduino ou do agente da rede local.",
    "Guardar o payload mais recente no Redis com um TTL curto.",
    "Servir na hora, a partir do cache, as respostas <code>GET /...</code> para o site.",
    "Registrar dados desatualizados quando a origem para de atualizar: útil para alertas.",
  ],
  consumerTitle: "Exemplo de consulta de um consumidor",
  consumerBodyHtml:
    "A camada de consultas do site em Astro acessa a URL HTTPS que você configurou, lê o objeto <code>temp</code> (ou detecta automaticamente JSON SenML / Home Assistant REST quando essa raiz não existe) e associa as chaves às sondas do dashboard. A mesma URL pode alimentar scripts Node, plugins JSON do Grafana ou sensores REST do Home Assistant.",
  figureAlt:
    "Visualizador de JSON do navegador mostrando as chaves de sonda temp 0, 1 e avg com Fahrenheit, Celsius e umidade",
  figureCaption: "Exemplo do formato de payload do relay que o site espera depois de armazenar em cache o JSON do Arduino.",
  scriptsTitle: "Scripts operacionais",
  scriptsBody:
    "Além da API, pequenos utilitários em Python validam o schema JSON, completam arquivos CSV históricos ou comparam as médias das sondas com as previsões do OpenWeather. Como as sondas expõem JSON simples, você pode prototipar análises em um notebook antes de levar a lógica para serviços em produção.",
  repoTitle: "Referência do repositório",
  repoBodyHtml: `Detalhes de implementação, configuração do Redis e notas de deploy do relay são mantidos em ${REPO_LINK}. Configure a URL pública do relay nas <a class="text-link" href="/dashboard/devices">configurações do feed de temperatura</a> depois de entrar.`,
  unoTitle: "Uno Ethernet: HTTP→HTTPS para ingestão push",
  unoBodyHtml: `Um shield W5100 não consegue fazer POST para <code>https://probeharbor.dev</code>. O relay feito só com a biblioteca padrão ${RELAY_LINK} escuta HTTP vindo do Arduino e repassa o mesmo caminho e corpo via HTTPS. Use-o junto com ${ETH_LINK} (DHT22 em A4/A5, JSON <code>temp</code> clássico).`,
};

export const pythonFeedsMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

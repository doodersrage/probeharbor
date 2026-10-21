
/** /about/python-feeds body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
import type { PythonFeedsMessages } from "./en";

const REPO_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/fast-api-relay">fast-api-relay</a>';
const RELAY_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/probeharbor/blob/main/sketches/relay/push_https_forward.py"><code>sketches/relay/push_https_forward.py</code></a>';
const ETH_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest"><code>ethernet_dht22_ingest</code></a>';

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

export default fr;

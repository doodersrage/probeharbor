
/** /about/data-flow body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

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

export default fr;

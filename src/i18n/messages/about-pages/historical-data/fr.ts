
/** /about/historical-data body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

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

export default fr;

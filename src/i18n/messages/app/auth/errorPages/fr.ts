import type { AuthErrorPagesMessages } from "./en";

const fr: AuthErrorPagesMessages = {
  notFound: {
    title: "Page introuvable",
    description: "Cette page n’existe pas sur {brand}.",
    heading: "Page introuvable",
    lede: "Cette URL n’existe pas sur ProbeHarbor : la page a peut-être été déplacée, ou le lien est obsolète.",
    home: "Accueil",
    guides: "Guides",
    dashboard: "Tableau de bord",
    lookingFor: "Vous cherchez les alertes gel/inondation ou la documentation d’ingestion ?",
    ingest: "Ingestion et webhooks",
    contact: "Contact",
  },
  serverError: {
    title: "Une erreur s’est produite",
    description: "Une erreur inattendue s’est produite.",
    heading: "Une erreur s’est produite",
    lede: "Une erreur inattendue est survenue lors du chargement de cette page. L’incident a été enregistré automatiquement.",
    home: "Retour à l’accueil",
    status: "État du système",
  },
};

export default fr;

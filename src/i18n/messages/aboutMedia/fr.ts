/** ProductScreenshot alt/captions, EditorialPhotoStrip label, affiliate disclosure. */
import type { AboutMediaMessages } from "./en";

const fr: AboutMediaMessages = {
  photoStripLabel: "Photos éditoriales",
  affiliateDisclosure:
    "Les liens d’achat Amazon peuvent contenir un identifiant Partenaires (Associates). Les liens Adafruit et des autres vendeurs sont directs (Adafruit n’a pas de programme d’affiliation). ProbeHarbor peut toucher une commission sur les achats Amazon éligibles, sans surcoût pour vous.",
  shots: {
    insights: {
      alt: "Insights de ProbeHarbor avec les courbes des sondes sur 30 jours, l’humidité et le point de rosée, la ligne du seuil de gel, la comparaison d’une année sur l’autre par semaine et la carte de prévision des nuits à risque",
      caption: "Insights : courbes des sondes avec votre seuil de gel.",
    },
    history: {
      alt: "Graphique Reading History de ProbeHarbor avec les tracés des sondes et la ligne de gel à 1 °C (34 °F)",
      caption: "Historique : une semaine de tracés des sondes face à la ligne de gel.",
    },
    "history-chart": {
      alt: "Tendance de température sur sept jours dans ProbeHarbor avec deux sondes, la moyenne, le pourcentage d’humidité, le point de rosée en surimpression, des marqueurs d’alerte et la ligne de gel à 1 °C (34 °F)",
      caption: "Tendance de température avec humidité, point de rosée et repère de gel.",
    },
    devices: {
      alt: "Page Devices de ProbeHarbor affichant le score de santé de l’appareil, la dernière connexion, le nombre de capteurs et l’état du flux",
      caption: "Appareils : score de santé, dernière connexion et état du flux.",
    },
    "overview-cards": {
      alt: "Overview de ProbeHarbor avec un état d’espace « Looking good », des actions rapides et une carte de temps avant le gel fondée sur la prévision",
      caption: "Vue d’ensemble : état de l’espace, actions rapides et temps avant le gel.",
    },
    "overview-status": {
      alt: "Bandeau d’état de l’Overview de ProbeHarbor avec le dernier relevé, les capteurs à jour, les flux en ligne, les alertes et la marge la plus froide au-dessus de l’alerte de gel",
      caption: "État de la vue d’ensemble : dernier relevé, capteurs, flux, alertes et marge avant le gel.",
    },
    portfolio: {
      alt: "Tableau de bord Portfolio illustratif de ProbeHarbor listant plusieurs biens d’exemple avec bannière de risque de gel, températures minimales, nombre d’appareils et rôles de gestionnaire",
      caption: "Exemple illustratif : le risque de gel de chaque bien dans un seul tableau.",
    },
    "claims-pack": {
      alt: "PDF du dossier de sinistre ProbeHarbor avec les statistiques d’exposition au gel, le seuil de gel, les alertes critiques et les appareils concernés",
      caption: "Dossier de sinistre : statistiques d’exposition au gel et appareils pour l’expert.",
    },
    "claims-verification": {
      alt: "Section de vérification du dossier de sinistre ProbeHarbor avec code SHA-256, lien de vérification permanent et mention légale",
      caption: "Vérification : code SHA-256 et lien permanent pour le consulter à nouveau.",
    },
    "monitoring-certificate": {
      alt: "Certificat de surveillance ProbeHarbor indiquant les alertes activées, le seuil de gel, la durée de conservation et les appareils couverts",
      caption: "Certificat de surveillance : preuve de configuration pour les assureurs et les bailleurs.",
    },
  },
};

export default fr;

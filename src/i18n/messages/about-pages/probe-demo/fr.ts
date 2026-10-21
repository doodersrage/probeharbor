
/** /about/probe-demo page copy (the simulator island's strings live in messages/probeDemo.ts). */
import type { ProbeDemoPageMessages } from "./en";

const fr: ProbeDemoPageMessages = {
  title: "Démo interactive des sondes",
  description:
    "Simulez les températures d’un garage sur plusieurs zones. Réglez l’air extérieur, le soleil, la porte et le seuil de gel avec la même logique qu’en production.",
  breadcrumbHome: "Accueil",
  breadcrumbAbout: "À propos",
  kicker: "À propos · Simulateur",
  ctaTryReal: "Je veux ça pour mon garage",
  ctaColdSnap: "Passer à la vague de froid",
  ctaKit: "Kit antigel ESP32",
  heroNoteHtml:
    'Provoquez le changement : cliquez sur <strong>Courant d’air</strong> et regardez la zone porte/entrée baisser par rapport à l’établi, ou sur <strong>Vague de froid</strong> pour un risque de gel façon Overview. Les relevés s’actualisent toutes les deux secondes avec un bruit proche de celui d’un vrai capteur. Copiez le JSON <strong>Push ingest</strong> pour obtenir les mêmes clés à plat qu’un ESP enverrait en POST. Théorie du placement : <a class="text-link" href="/about/temperature-probes">sondes de température</a> et <a class="text-link" href="/about/temperature-changes">ce qui provoque les variations</a>.',
  figureCaption:
    "Un vrai établi : dans le simulateur ci-dessus, la zone la plus chaude est le coin de l’établi. Une sonde placée uniquement là peut sembler rassurante alors que la zone de la porte est déjà proche du gel.",
  faqTitle: "FAQ de la démo des sondes",
  paginationAria: "Pages de la section À propos",
  prev: "Guide des sondes de température",
  next: "Ajouter des appareils",
};

export default fr;

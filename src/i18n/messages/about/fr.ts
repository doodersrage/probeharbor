/**
 * About hub (/about) copy. Keys ending in `Html` hold trusted inline HTML and
 * are rendered with `set:html`; keep hrefs English, middleware localizes them.
 */
import type { AboutMessages } from "./en";

const fr: AboutMessages = {
  layoutTitle: "À propos",
  title: "À propos de ProbeHarbor",
  description:
    "Guides sur les sondes de température, les alertes gel et inondation, le firmware Arduino, l’ingestion ESP, le partage au foyer et la pile technique de ProbeHarbor.",
  breadcrumbHome: "Accueil",
  breadcrumbAbout: "À propos",
  kicker: "À propos",
  lede: "Des guides open source sur les sondes, les alertes gel et inondation, le firmware et la pile technique de ProbeHarbor. Vous préférez une liste plus courte ? Commencez par le hub des guides.",
  startFree: "Commencer gratuitement",
  guidesHub: "Hub des guides",
  findTitle: "Trouver un guide",
  findSubtitle: `Recherchez parmi {count} articles ou parcourez les parcours d’apprentissage ci-dessous.`,
  probe: {
    eyebrow: "Simulation en direct",
    title: "Trois sondes, un espace",
    lede: "Observez la température et l’humidité évoluer zone par zone selon l’ensoleillement, l’air extérieur et la circulation d’air, comme dans le flux JSON en direct.",
  },
  repos: {
    title: "Dépôts open source",
    subtitleHtml:
      'Des projets à examiner, forker ou adapter à votre propre montage. Pour les intégrations programmatiques, commencez par l’<a class="text-link" href="/docs/api">API HTTP</a> et <a class="text-link" href="/openapi.yaml">openapi.yaml</a>.',
    firmware: "Sketch Arduino et firmware des capteurs",
    website: "Ce site web (Astro sur Cloudflare) : comprend des sketches de capteurs d’exemple",
    relay: "Relais du flux JSON (FastAPI avec cache Redis)",
  },
  faqLede: "Des réponses rapides avant de plonger dans un guide.",
  faqs: [
    {
      question: "Que couvrent les guides À propos ?",
      answer:
        "L’emplacement des sondes, le câblage du DHT22 et de l’Arduino, les seuils de gel, les contacts d’inondation et de fuite, les API d’ingestion, le partage au foyer, l’installation de la PWA et la façon dont ProbeHarbor stocke et trace les relevés.",
    },
    {
      question: "Par où commencer ?",
      answer:
        "Choisissez sur cette page un parcours selon votre besoin (protection contre le gel, détection d’inondation et de fuite, câblage, ingestion, dépannage ou configuration du foyer), ou cherchez dans l’index complet des guides.",
    },
    {
      question: "ProbeHarbor est-il open source ?",
      answer:
        "Oui : les dépôts de l’application et du firmware sont liés depuis ce hub, pour que vous puissiez examiner, forker ou adapter la pile.",
    },
    {
      question: "Où ProbeHarbor est-il hébergé ?",
      answer:
        "Le site web et les API d’ingestion tournent sur l’edge de Cloudflare (Workers). L’état en direct des tâches et de l’ingestion est sur /system-status : nous publions l’état mesuré, pas un pourcentage de disponibilité marketing. Détails de la pile : /about/astro-applications.",
    },
  ],
};

export default fr;

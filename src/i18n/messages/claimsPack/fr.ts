/**
 * /claims-pack copy. Keys ending in `Html` hold trusted inline HTML rendered
 * with `set:html`; hrefs stay English (middleware localizes internal ones).
 * `disclaimer` is the legal wording of `CLAIMS_DISCLAIMER`: translate it
 * faithfully, without softening or strengthening it.
 * `{free}` / `{member}` / `{pro}` are already-localized retention strings ("7 days", "90 días").
 */

import type { ClaimsPackMessages } from "./en";

const fr: ClaimsPackMessages = {
  title: "Dossier de preuves sinistre et assurance",
  description:
    "Transformez l’historique de gel et de fuites en dossier de sinistre vérifiable : exposition au gel, tableaux d’appareils et chronologie des alertes pour l’assureur.",
  breadcrumbHome: "Accueil",
  breadcrumbPage: "Dossier de sinistre",
  disclaimer:
    "Ce dossier est un relevé de surveillance exporté par ProbeHarbor pour l’usage propre du foyer. Il ne constitue ni une décision juridique, ni une expertise d’assurance, ni une preuve de couverture. Les experts doivent vérifier les horodatages auprès du matériel de capteur d’origine et des canaux de transmission lorsque cela est requis.",
  kicker: "Documentation",
  headerTitle: "La preuve que votre surveillance l’a détecté",
  lede: "Un tuyau gelé ou une fuite n’attend pas le bon moment. Le dossier de sinistre transforme votre historique ProbeHarbor en un rapport unique : statistiques d’exposition au gel, tableaux des appareils et des sondes, et chronologie de chaque alerte. Conçu pour un sinistre, un litige, ou simplement pour avoir une trace écrite avant d’en avoir besoin.",
  generate: "Générer un dossier de sinistre",
  startFree: "Commencez gratuitement : créez votre dossier",
  downloadSample: "Télécharger un exemple PDF",
  seeProPricing: "Voir les tarifs Pro",
  shotPackCaption:
    "Export réel d’un dossier de sinistre : statistiques d’exposition au gel, seuil et appareils concernés.",
  shotVerifyCaption:
    "Pied de page de vérification du même export : code SHA-256 et lien permanent pour le consulter à nouveau.",
  shotCertCaption:
    "Certificat de surveillance : alertes activées, seuil de gel, durée de conservation et couverture en un coup d’œil.",
  contents: {
    title: "Contenu du dossier",
    subtitle:
      "Un seul rapport HTML/PDF imprimable, généré à la demande à partir de l’historique de vos propres capteurs, pour n’importe quelle période.",
    itemsHtml: [
      "<strong>Statistiques d’exposition au gel</strong> : heures passées au niveau ou en dessous de votre seuil d’alerte, et relevé le plus froid de la période.",
      "<strong>Tableaux des appareils et des sondes</strong> : chaque capteur ayant transmis pendant la période, avec le local auquel il est affecté.",
      "<strong>Chronologie des alertes critiques</strong> : chaque alerte de franchissement de seuil déclenchée, horodatée.",
      "<strong>CSV associés</strong> : les exports des relevés et des événements d’alerte sous-jacents, pour l’expert qui veut les données brutes.",
      "<strong>Certificat de surveillance</strong> : un résumé plus court de la configuration (seuil, canaux, durée de conservation), utile aux bailleurs et aux assureurs qui veulent la preuve d’une surveillance active.",
    ],
    whoFor:
      "Pour qui : documenter un sinistre de gel ou de fuite en cours, étayer un litige sur le début d’une panne, ou simplement garder une trace sous la main, même si vous n’en avez jamais besoin.",
  },
  adjuster: {
    title: "Ce qu’il faut dire à l’expert",
    subtitle: "Restez bref. Remettez-lui le dossier (ou le lien envoyé par e-mail) et abordez ces points :",
    items: [
      {
        lead: "Nous surveillons ce local en continu.",
        body: "Les sondes transmettent à ProbeHarbor ; les alertes de gel et de fuite étaient activées pour le foyer avant la période du sinistre.",
      },
      {
        lead: "Voici quand nous l’avons su.",
        body: "La chronologie des alertes indique l’horodatage des franchissements de seuil et des contacts humides ; le pied de page SHA-256 atteste que cet export n’a pas été modifié.",
      },
      {
        lead: "Voici les données brutes.",
        body: "Les CSV associés contiennent les mêmes relevés et événements d’alerte que les tableaux récapitulatifs, pour qui veut retracer la période de froid.",
      },
      {
        lead: "Posez la question des réductions pour surveillance à part.",
        body: "Le dossier documente ce qui était surveillé ; toute réduction accordée par l’assureur relève du contrat, pas d’une garantie de ProbeHarbor.",
      },
    ],
  },
  nearMiss: {
    title: "Utile avant le dégât, pas seulement après",
    bodyHtml:
      'C’est l’historique qui rend une alerte exploitable, et c’est ce que vous montreriez plus tard à un expert. Dans le <a class="text-link" href="/stories/pipe-near-miss">scénario du coin froid du garage attenant</a>, l’alerte n’est que la partie visible ; l’historique CSV montre ce même coin plonger chaque nuit claire jusqu’à ce que le joint de porte soit réparé. Un dossier de sinistre, c’est la même idée présentée pour un tiers : horodatages, sondes et alertes dans un export vérifiable.',
    cta: "Lire le scénario",
  },
  durable: {
    title: "Conçu pour faire foi, pas seulement pour être imprimé",
    body: "Un téléchargement ponctuel peut se perdre dans un dossier de téléchargements ou être modifié avant que quiconque ne le voie. Chaque dossier de sinistre que vous générez est aussi enregistré comme export durable à jeton : il reçoit un lien permanent et un code de vérification SHA-256 calculé sur son contenu.",
    items: [
      "Rouvrez le lien à tout moment pour voir le rapport exact qui a été généré, et non une vue en direct susceptible d’avoir changé.",
      "Le code de vérification permet à vous ou à un expert de confirmer que le rapport correspond à ce qui a été envoyé à l’origine.",
      "Envoyez-le directement dans la boîte de réception d’un expert depuis votre tableau de bord, lien inclus.",
    ],
  },
  insurer: {
    title: "Parlez-en à votre assureur",
    bodyHtml:
      'Certains assureurs accordent déjà des réductions aux logements équipés de dispositifs de protection ou de surveillance. Par exemple, la <a class="text-link" href="https://www.statefarm.com/insurance/homeowners/discounts" rel="noopener noreferrer" target="_blank">page des réductions habitation de State Farm</a> mentionne des remises pour les systèmes de protection ou de surveillance domestique éligibles (selon l’État), et le <a class="text-link" href="https://www.lemonade.com/homeowners/explained/homeowners-insurance-new-york/" rel="noopener noreferrer" target="_blank">guide de l’assurance habitation de Lemonade pour New York</a> indique qu’un détecteur de fuite d’eau peut aider à faire baisser un tarif. ProbeHarbor n’a aujourd’hui aucun partenariat officiel avec un assureur : voyez cela comme un point de départ pour la discussion plutôt que comme une réduction promise. Apportez votre dossier de sinistre ou votre certificat de surveillance, demandez si ce type de surveillance est pris en compte dans votre contrat, et laissez votre assureur vous dire ce qu’il propose réellement.',
  },
  howTo: {
    title: "Comment en générer un",
    step1:
      "Connectez au moins une sonde et laissez ProbeHarbor accumuler un peu d’historique (les alertes de gel fonctionnent dès le premier jour ; le dossier de sinistre couvre toute la période que vous avez surveillée).",
    step2: "Passez à Pro si ce n’est pas déjà fait : le dossier de sinistre est une fonction Pro. Déjà sur Free ou Member avec un épisode de gel récent ? Les relevés encore dans votre fenêtre de {free} / {member} restent stockés ; Pro débloque le dossier sur cet historique conservé (et allonge la période accessible à l’avenir).",
    step3Html:
      'Depuis <a class="text-link" href="/dashboard/history?tab=exports#claims-pack">History → claims pack</a>, choisissez une période et téléchargez le dossier, ou envoyez-le directement à l’adresse e-mail d’un expert.',
    samplePdf: "Exemple PDF",
  },
  faqLede: "Des réponses claires sur ce qu’est le dossier, et ce qu’il n’est pas.",
  faqs: [
    { question: "Le dossier de sinistre est-il un document juridique ?", answer: "{disclaimer}" },
    {
      question: "Dans quel forfait le dossier de sinistre est-il inclus ?",
      answer:
        "Le dossier de sinistre est une fonction Pro (et Portfolio). Les forfaits Free et Member permettent de voir les relevés en direct et l’historique, mais générer et envoyer un dossier de sinistre par e-mail nécessite Pro.",
    },
    {
      question: "Si je suis sur Free ou Member et que quelque chose vient de geler, puis-je passer à Pro et quand même créer un dossier ?",
      answer: "Oui, tant que les relevés sont encore dans la fenêtre d’historique de votre forfait. Free conserve environ {free} ; Member environ {member} ; Pro environ {pro} ou plus. Changer de forfait n’efface pas les relevés stockés : tout ce qui se trouve encore dans la fenêtre plus longue de Pro devient disponible pour les graphiques, le CSV et le dossier de sinistre. Changez de forfait rapidement si vous avez besoin d’un dossier qui remonte plus loin que ce qu’affiche votre forfait actuel.",
    },
    {
      question: "Puis-je l’envoyer directement à l’expert de mon assurance ?",
      answer:
        "Oui. Depuis votre page d’historique, vous pouvez télécharger le rapport pour le joindre à votre propre e-mail, ou l’envoyer directement depuis ProbeHarbor à l’adresse e-mail d’un expert. Dans les deux cas, le destinataire reçoit un lien durable qu’il peut rouvrir et revérifier plus tard.",
    },
    {
      question: "Qu’est-ce qui rend un export « vérifiable » ?",
      answer:
        "Chaque dossier généré est enregistré avec une empreinte SHA-256 de son contenu et un lien permanent. Rouvrir ce lien réaffiche exactement les données exportées et le même code de vérification : toute personne disposant du lien peut ainsi confirmer que le rapport n’a pas été modifié depuis sa génération.",
    },
    {
      question: "Est-ce que cela me donnera droit à une réduction chez mon assureur ?",
      answer:
        "Peut-être : cela dépend de l’assureur et de l’État. Par exemple, State Farm mentionne sur sa page publique de réductions des remises habitation pour les dispositifs de protection ou de surveillance domestique éligibles, et certains assureurs (dont Lemonade sur certains marchés) citent les détecteurs de fuite d’eau ou d’alerte de température parmi les mesures de sécurité qui peuvent faire baisser une prime. ProbeHarbor n’a aujourd’hui aucun partenariat officiel avec un assureur. Apportez votre dossier de sinistre ou votre certificat de surveillance, demandez si ce type de surveillance est pris en compte dans votre contrat, et laissez votre assureur vous dire ce qu’il propose réellement.",
    },
  ],
};

export default fr;

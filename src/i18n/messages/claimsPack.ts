import type { AboutFaqItem } from "../../lib/aboutFaqs";
import { CLAIMS_DISCLAIMER } from "../../lib/claimsPack";
import { defineMessages } from "../translate";

/**
 * /claims-pack copy. Keys ending in `Html` hold trusted inline HTML rendered
 * with `set:html`; hrefs stay English (middleware localizes internal ones).
 * `disclaimer` is the legal wording of `CLAIMS_DISCLAIMER`: translate it
 * faithfully, without softening or strengthening it.
 * Retention arguments are already-localized strings ("7 days", "90 días").
 */

type Retention = { free: string; member: string; pro: string };

const en = {
  title: "Claims & insurance evidence pack",
  description:
    "Turn freeze and leak history into a verifiable claims pack: freeze-exposure stats, device tables, and an alert timeline for your insurer.",
  breadcrumbHome: "Home",
  breadcrumbPage: "Claims pack",
  disclaimer: CLAIMS_DISCLAIMER,
  kicker: "Documentation",
  headerTitle: "Proof your monitoring caught it",
  lede: "A pipe freeze or a leak doesn't wait for a good time. The claims pack turns your ProbeHarbor history into a single report: freeze-exposure stats, device and probe tables, and a timeline of every alert: built for a claim, a dispute, or just having the paper trail before you need it.",
  generate: "Generate a claims pack",
  startFree: "Start free: build your pack",
  downloadSample: "Download sample PDF",
  seeProPricing: "See Pro pricing",
  shotPackCaption: "Real claims pack export: freeze-exposure stats, threshold, and devices in scope.",
  shotVerifyCaption: "Same export’s verification footer. SHA-256 code plus a permanent re-view link.",
  shotCertCaption:
    "Monitoring certificate: alerts enabled, freeze threshold, retention, and coverage at a glance.",
  contents: {
    title: "What's in the pack",
    subtitle:
      "One printable HTML/PDF report, generated on demand from your own sensor history for any date range.",
    itemsHtml: [
      "<strong>Freeze-exposure stats</strong>: hours spent at or below your alert threshold, and the coldest reading in the window.",
      "<strong>Device and probe tables</strong>, every sensor that reported in the range, with the space it's assigned to.",
      "<strong>Critical-alert timeline</strong>, every threshold-crossing alert that fired, with timestamps.",
      "<strong>Linked CSVs</strong>: the underlying readings and alert-event exports, for an adjuster who wants the raw data.",
      "<strong>Monitoring certificate</strong>: a shorter configuration summary (threshold, channels, retention) useful for landlords and carriers who want proof you’re actively monitoring.",
    ],
    whoFor:
      "Who it's for: documenting an active freeze or leak claim, backing up a dispute over when a failure started, or just having a record on hand, even if you never end up needing it.",
  },
  adjuster: {
    title: "What to tell an adjuster",
    subtitle: "Keep it short. Hand them the pack (or the email link) and cover these points:",
    items: [
      {
        lead: "We monitor this space continuously.",
        body: "Probes report into ProbeHarbor; freeze and leak alerts were enabled for the household before the loss window.",
      },
      {
        lead: "Here is when we knew.",
        body: "The alert timeline shows timestamps for threshold crossings and wet contacts; the SHA-256 footer verifies this export has not been edited.",
      },
      {
        lead: "Here is the raw trail.",
        body: "Linked CSVs are the same readings and alert events behind the summary tables, for anyone who wants to re-plot the cold stretch.",
      },
      {
        lead: "Ask about monitoring credits separately.",
        body: "The pack documents what was watched; any carrier discount is a policy question, not a ProbeHarbor guarantee.",
      },
    ],
  },
  nearMiss: {
    title: "Near-miss, not just after-the-fact",
    bodyHtml:
      'History is what makes an alert actionable, and what you’d show an adjuster later. In the <a class="text-link" href="/stories/pipe-near-miss">attached-garage cold corner scenario</a>, the alert is the tip; CSV history shows the same corner dipping every clear night until the door seal is fixed. A claims pack is the same idea packaged for a third party: timestamps, probes, and alerts in one verifiable export.',
    cta: "Read the scenario",
  },
  durable: {
    title: "Built to hold up, not just print out",
    body: "A one-time download can get lost in a downloads folder or edited before anyone sees it. Every claims pack you generate is also saved as a durable, tokenized export: it gets a permanent link and a SHA-256 verification code computed over its contents.",
    items: [
      "Reopen the link any time to see the exact report that was generated, not a live, possibly-changed view.",
      "The verification code lets you or an adjuster confirm the report matches what was originally sent.",
      "Email it directly to an adjuster's inbox from your dashboard, with the link built in.",
    ],
  },
  insurer: {
    title: "Ask your insurer about it",
    bodyHtml:
      'Some carriers already discount homes with protective or monitoring devices, for example, <a class="text-link" href="https://www.statefarm.com/insurance/homeowners/discounts" rel="noopener noreferrer" target="_blank">State Farm’s homeowners discounts page</a> lists credits for eligible protective / home monitoring systems (availability varies by state), and <a class="text-link" href="https://www.lemonade.com/homeowners/explained/homeowners-insurance-new-york/" rel="noopener noreferrer" target="_blank">Lemonade’s New York homeowners guide</a> notes that a water leak sensor can help lower a rate. ProbeHarbor doesn\'t have a formal partnership with any insurer today, so treat this as a conversation starter rather than a promised discount: bring your claims pack or monitoring certificate, ask whether monitoring like this qualifies on your policy, and let your carrier tell you what they actually offer.',
  },
  howTo: {
    title: "How to generate one",
    step1:
      "Connect at least one probe and let ProbeHarbor collect a bit of history (freeze alerts work from day one; the claims pack covers whatever range you've been monitoring).",
    step2: (free: string, member: string) =>
      `Upgrade to Pro if you haven't already: the claims pack is a Pro feature. Already on Free or Member with a recent freeze? Readings still inside your ${free} / ${member} window stay stored; Pro unlocks the pack over that retained history (and extends how far back you can reach going forward).`,
    step3Html:
      'From <a class="text-link" href="/dashboard/history?tab=exports#claims-pack">History → claims pack</a>, pick a date range and download the pack, or send it straight to an adjuster\'s email.',
    samplePdf: "Sample PDF",
  },
  faqLede: "Straight answers on what the pack is, and isn't.",
  faqs: (r: Retention, disclaimer: string): AboutFaqItem[] => [
    { question: "Is the claims pack a legal document?", answer: disclaimer },
    {
      question: "What plan is the claims pack on?",
      answer:
        "The claims pack is a Pro (and Portfolio) feature. Free and Member plans can still see live readings and history, but generating and emailing a claims pack requires Pro.",
    },
    {
      question: "If I’m on Free or Member and something just froze, can I upgrade and still build a pack?",
      answer: `Yes, as long as the readings are still inside your plan’s history window. Free keeps about ${r.free}; Member about ${r.member}; Pro about ${r.pro}+. Upgrading does not wipe stored readings: anything still within the longer Pro window becomes available for charts, CSV, and the claims pack. Upgrade promptly if you need a pack that reaches further back than your current plan shows.`,
    },
    {
      question: "Can I send this directly to my insurance adjuster?",
      answer:
        "Yes. From your history page you can either download the report to attach to your own email, or send it directly to an adjuster's email address from ProbeHarbor. Either way, the recipient gets a durable link they can reopen and re-verify later.",
    },
    {
      question: 'What makes an export "verifiable"?',
      answer:
        "Every generated pack is saved with a SHA-256 hash of its contents and a permanent link. Reopening that link re-renders the exact data that was exported and shows the same verification code, so anyone holding the link can confirm the report hasn't been altered since it was generated.",
    },
    {
      question: "Will using this get me a discount from my insurer?",
      answer:
        "Maybe: it depends on the carrier and state. For example, State Farm lists homeowners discounts for eligible protective / home monitoring devices on its public discounts page, and some carriers (including Lemonade in certain markets) list water-leak or temperature-alert devices among safety measures that can lower a premium. ProbeHarbor doesn't have a formal partnership with any insurer today. Bring your claims pack or monitoring certificate, ask whether monitoring like this qualifies on your policy, and let your carrier tell you what they actually offer.",
    },
  ],
};

type ClaimsPackMessages = typeof en;

const es: ClaimsPackMessages = {
  title: "Paquete de pruebas para reclamaciones y seguros",
  description:
    "Convierte el historial de heladas y fugas en un paquete para reclamaciones verificable: exposición a la congelación, tablas de dispositivos y cronología de alertas.",
  breadcrumbHome: "Inicio",
  breadcrumbPage: "Paquete para reclamaciones",
  disclaimer:
    "Este paquete es un registro de monitoreo exportado por ProbeHarbor para uso propio del hogar. No es una determinación legal, una tasación de seguros ni una prueba de cobertura. Cuando se requiera, los peritos deben verificar las marcas de tiempo con el hardware de los sensores originales y los canales de envío.",
  kicker: "Documentación",
  headerTitle: "La prueba de que tu monitoreo lo detectó",
  lede: "Una tubería congelada o una fuga no esperan al mejor momento. El paquete para reclamaciones convierte tu historial de ProbeHarbor en un único informe: estadísticas de exposición a la congelación, tablas de dispositivos y sondas, y una cronología de cada alerta. Pensado para una reclamación, una disputa o simplemente para tener la documentación antes de necesitarla.",
  generate: "Generar un paquete para reclamaciones",
  startFree: "Empieza gratis: crea tu paquete",
  downloadSample: "Descargar PDF de ejemplo",
  seeProPricing: "Ver precios de Pro",
  shotPackCaption:
    "Exportación real de un paquete para reclamaciones: estadísticas de exposición a la congelación, umbral y dispositivos incluidos.",
  shotVerifyCaption:
    "Pie de verificación de la misma exportación: código SHA-256 y un enlace permanente para volver a consultarla.",
  shotCertCaption:
    "Certificado de monitoreo: alertas activadas, umbral de congelación, retención y cobertura de un vistazo.",
  contents: {
    title: "Qué incluye el paquete",
    subtitle:
      "Un único informe HTML/PDF imprimible, generado a demanda a partir del historial de tus propios sensores para cualquier rango de fechas.",
    itemsHtml: [
      "<strong>Estadísticas de exposición a la congelación</strong>: horas pasadas en tu umbral de alerta o por debajo, y la lectura más fría del periodo.",
      "<strong>Tablas de dispositivos y sondas</strong>: cada sensor que informó durante el periodo, con el espacio al que está asignado.",
      "<strong>Cronología de alertas críticas</strong>: cada alerta por cruce de umbral que se disparó, con su marca de tiempo.",
      "<strong>CSV vinculados</strong>: las exportaciones de lecturas y eventos de alerta subyacentes, para el perito que quiera los datos en bruto.",
      "<strong>Certificado de monitoreo</strong>: un resumen más breve de la configuración (umbral, canales, retención), útil para arrendadores y aseguradoras que quieren una prueba de que monitoreas activamente.",
    ],
    whoFor:
      "Para quién es: documentar una reclamación activa por congelación o fuga, respaldar una disputa sobre cuándo empezó una falla o simplemente tener un registro a mano, aunque nunca llegues a necesitarlo.",
  },
  adjuster: {
    title: "Qué decirle a un perito",
    subtitle: "Sé breve. Entrégale el paquete (o el enlace del correo) y cubre estos puntos:",
    items: [
      {
        lead: "Monitoreamos este espacio de forma continua.",
        body: "Las sondas envían datos a ProbeHarbor; las alertas de congelación y fugas estaban activadas en el hogar antes del periodo del siniestro.",
      },
      {
        lead: "Aquí está cuándo lo supimos.",
        body: "La cronología de alertas muestra las marcas de tiempo de los cruces de umbral y de los contactos mojados; el pie SHA-256 verifica que esta exportación no se ha modificado.",
      },
      {
        lead: "Aquí están los datos en bruto.",
        body: "Los CSV vinculados son las mismas lecturas y eventos de alerta que hay detrás de las tablas de resumen, para quien quiera volver a graficar el periodo de frío.",
      },
      {
        lead: "Pregunta por los descuentos por monitoreo aparte.",
        body: "El paquete documenta lo que se vigiló; cualquier descuento de la aseguradora es una cuestión de la póliza, no una garantía de ProbeHarbor.",
      },
    ],
  },
  nearMiss: {
    title: "Para los sustos, no solo para después del daño",
    bodyHtml:
      'El historial es lo que hace que una alerta sirva para actuar, y lo que le mostrarías a un perito más adelante. En el <a class="text-link" href="/stories/pipe-near-miss">escenario del rincón frío del garaje adosado</a>, la alerta es solo la punta; el historial en CSV muestra ese mismo rincón bajando cada noche despejada hasta que se arregla el burlete de la puerta. Un paquete para reclamaciones es la misma idea preparada para un tercero: marcas de tiempo, sondas y alertas en una exportación verificable.',
    cta: "Leer el escenario",
  },
  durable: {
    title: "Hecho para resistir, no solo para imprimir",
    body: "Una descarga puntual puede perderse en la carpeta de descargas o editarse antes de que alguien la vea. Cada paquete para reclamaciones que generas también se guarda como una exportación duradera con token: recibe un enlace permanente y un código de verificación SHA-256 calculado sobre su contenido.",
    items: [
      "Vuelve a abrir el enlace cuando quieras para ver el informe exacto que se generó, no una vista en vivo que podría haber cambiado.",
      "El código de verificación te permite a ti o a un perito confirmar que el informe coincide con lo que se envió originalmente.",
      "Envíalo directamente al correo de un perito desde tu panel, con el enlace incluido.",
    ],
  },
  insurer: {
    title: "Pregúntale a tu aseguradora",
    bodyHtml:
      'Algunas aseguradoras ya ofrecen descuentos a viviendas con dispositivos de protección o monitoreo. Por ejemplo, la <a class="text-link" href="https://www.statefarm.com/insurance/homeowners/discounts" rel="noopener noreferrer" target="_blank">página de descuentos para propietarios de State Farm</a> menciona bonificaciones por sistemas de protección o monitoreo del hogar que cumplan los requisitos (la disponibilidad varía según el estado), y la <a class="text-link" href="https://www.lemonade.com/homeowners/explained/homeowners-insurance-new-york/" rel="noopener noreferrer" target="_blank">guía de seguros de hogar de Lemonade para Nueva York</a> señala que un sensor de fugas de agua puede ayudar a bajar la tarifa. Hoy ProbeHarbor no tiene ninguna alianza formal con aseguradoras, así que tómalo como un punto de partida para la conversación y no como un descuento prometido: lleva tu paquete para reclamaciones o tu certificado de monitoreo, pregunta si un monitoreo así cuenta en tu póliza y deja que tu aseguradora te diga qué ofrece realmente.',
  },
  howTo: {
    title: "Cómo generar uno",
    step1:
      "Conecta al menos una sonda y deja que ProbeHarbor reúna algo de historial (las alertas de congelación funcionan desde el primer día; el paquete para reclamaciones cubre el periodo que hayas estado monitoreando).",
    step2: (free: string, member: string) =>
      `Pásate a Pro si aún no lo has hecho: el paquete para reclamaciones es una función de Pro. ¿Ya estás en Free o Member y acabas de tener una helada? Las lecturas que siguen dentro de tu ventana de ${free} / ${member} se conservan; Pro habilita el paquete sobre ese historial guardado (y amplía cuánto puedes retroceder de ahora en adelante).`,
    step3Html:
      'Desde <a class="text-link" href="/dashboard/history?tab=exports#claims-pack">History → claims pack</a>, elige un rango de fechas y descarga el paquete, o envíalo directamente al correo de un perito.',
    samplePdf: "PDF de ejemplo",
  },
  faqLede: "Respuestas claras sobre lo que es el paquete y lo que no es.",
  faqs: (r: Retention, disclaimer: string): AboutFaqItem[] => [
    { question: "¿El paquete para reclamaciones es un documento legal?", answer: disclaimer },
    {
      question: "¿En qué plan está el paquete para reclamaciones?",
      answer:
        "El paquete para reclamaciones es una función de Pro (y de Portfolio). Los planes Free y Member pueden ver lecturas en vivo e historial, pero para generar y enviar por correo un paquete para reclamaciones necesitas Pro.",
    },
    {
      question: "Si estoy en Free o Member y algo se acaba de congelar, ¿puedo pasarme a Pro y aun así crear un paquete?",
      answer: `Sí, siempre que las lecturas sigan dentro de la ventana de historial de tu plan. Free conserva unos ${r.free}; Member, unos ${r.member}; Pro, unos ${r.pro} o más. Cambiar de plan no borra las lecturas guardadas: todo lo que siga dentro de la ventana más larga de Pro queda disponible para gráficos, CSV y el paquete para reclamaciones. Cambia de plan cuanto antes si necesitas un paquete que llegue más atrás de lo que muestra tu plan actual.`,
    },
    {
      question: "¿Puedo enviarlo directamente al perito de mi seguro?",
      answer:
        "Sí. Desde tu página de historial puedes descargar el informe para adjuntarlo a tu propio correo o enviarlo directamente a la dirección de correo de un perito desde ProbeHarbor. En ambos casos, el destinatario recibe un enlace duradero que puede volver a abrir y verificar más adelante.",
    },
    {
      question: "¿Qué hace que una exportación sea «verificable»?",
      answer:
        "Cada paquete generado se guarda con un hash SHA-256 de su contenido y un enlace permanente. Al volver a abrir ese enlace se muestran exactamente los datos exportados y el mismo código de verificación, así que cualquiera que tenga el enlace puede confirmar que el informe no se ha alterado desde que se generó.",
    },
    {
      question: "¿Usarlo me dará un descuento en mi seguro?",
      answer:
        "Quizá: depende de la aseguradora y del estado. Por ejemplo, State Farm menciona en su página pública de descuentos rebajas para propietarios con dispositivos de protección o monitoreo del hogar que cumplan los requisitos, y algunas aseguradoras (entre ellas Lemonade en ciertos mercados) incluyen los dispositivos de fugas de agua o de alerta de temperatura entre las medidas de seguridad que pueden bajar la prima. Hoy ProbeHarbor no tiene ninguna alianza formal con aseguradoras. Lleva tu paquete para reclamaciones o tu certificado de monitoreo, pregunta si un monitoreo así cuenta en tu póliza y deja que tu aseguradora te diga qué ofrece realmente.",
    },
  ],
};

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
    step2: (free: string, member: string) =>
      `Passez à Pro si ce n’est pas déjà fait : le dossier de sinistre est une fonction Pro. Déjà sur Free ou Member avec un épisode de gel récent ? Les relevés encore dans votre fenêtre de ${free} / ${member} restent stockés ; Pro débloque le dossier sur cet historique conservé (et allonge la période accessible à l’avenir).`,
    step3Html:
      'Depuis <a class="text-link" href="/dashboard/history?tab=exports#claims-pack">History → claims pack</a>, choisissez une période et téléchargez le dossier, ou envoyez-le directement à l’adresse e-mail d’un expert.',
    samplePdf: "Exemple PDF",
  },
  faqLede: "Des réponses claires sur ce qu’est le dossier, et ce qu’il n’est pas.",
  faqs: (r: Retention, disclaimer: string): AboutFaqItem[] => [
    { question: "Le dossier de sinistre est-il un document juridique ?", answer: disclaimer },
    {
      question: "Dans quel forfait le dossier de sinistre est-il inclus ?",
      answer:
        "Le dossier de sinistre est une fonction Pro (et Portfolio). Les forfaits Free et Member permettent de voir les relevés en direct et l’historique, mais générer et envoyer un dossier de sinistre par e-mail nécessite Pro.",
    },
    {
      question: "Si je suis sur Free ou Member et que quelque chose vient de geler, puis-je passer à Pro et quand même créer un dossier ?",
      answer: `Oui, tant que les relevés sont encore dans la fenêtre d’historique de votre forfait. Free conserve environ ${r.free} ; Member environ ${r.member} ; Pro environ ${r.pro} ou plus. Changer de forfait n’efface pas les relevés stockés : tout ce qui se trouve encore dans la fenêtre plus longue de Pro devient disponible pour les graphiques, le CSV et le dossier de sinistre. Changez de forfait rapidement si vous avez besoin d’un dossier qui remonte plus loin que ce qu’affiche votre forfait actuel.`,
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

const de: ClaimsPackMessages = {
  title: "Nachweispaket für Schaden und Versicherung",
  description:
    "Mach aus Frost- und Leckverläufen ein überprüfbares Nachweispaket: Frostexposition, Gerätetabellen und eine Alarmchronik für deine Versicherung.",
  breadcrumbHome: "Startseite",
  breadcrumbPage: "Nachweispaket",
  disclaimer:
    "Dieses Paket ist eine von ProbeHarbor exportierte Überwachungsaufzeichnung zur eigenen Verwendung durch den Haushalt. Es ist keine rechtliche Feststellung, kein Versicherungsgutachten und kein Deckungsnachweis. Gutachter sollten Zeitstempel, wo erforderlich, anhand der ursprünglichen Sensorhardware und der Übermittlungskanäle überprüfen.",
  kicker: "Dokumentation",
  headerTitle: "Der Beweis, dass deine Überwachung es bemerkt hat",
  lede: "Ein eingefrorenes Rohr oder ein Leck wartet nicht auf einen günstigen Moment. Das Nachweispaket macht aus deinem ProbeHarbor-Verlauf einen einzigen Bericht: Frostexpositionswerte, Geräte- und Sondentabellen und eine Chronik jedes Alarms. Gemacht für einen Schadensfall, einen Streit oder einfach, um die Dokumentation zu haben, bevor du sie brauchst.",
  generate: "Nachweispaket erstellen",
  startFree: "Kostenlos starten: Paket erstellen",
  downloadSample: "Beispiel-PDF herunterladen",
  seeProPricing: "Pro-Preise ansehen",
  shotPackCaption:
    "Echter Export eines Nachweispakets: Frostexpositionswerte, Schwellenwert und erfasste Geräte.",
  shotVerifyCaption:
    "Prüffußzeile desselben Exports: SHA-256-Code plus dauerhafter Link zum erneuten Aufrufen.",
  shotCertCaption:
    "Überwachungszertifikat: aktivierte Alarme, Frostschwellenwert, Aufbewahrung und Abdeckung auf einen Blick.",
  contents: {
    title: "Was im Paket steckt",
    subtitle:
      "Ein druckbarer HTML/PDF-Bericht, auf Abruf aus deinem eigenen Sensorverlauf für einen beliebigen Zeitraum erstellt.",
    itemsHtml: [
      "<strong>Frostexpositionswerte</strong>: Stunden auf oder unter deinem Alarmschwellenwert und der kälteste Messwert im Zeitraum.",
      "<strong>Geräte- und Sondentabellen</strong>: jeder Sensor, der im Zeitraum gemeldet hat, mit dem Raum, dem er zugeordnet ist.",
      "<strong>Chronik kritischer Alarme</strong>: jeder ausgelöste Schwellenwertalarm mit Zeitstempel.",
      "<strong>Verknüpfte CSV-Dateien</strong>: die zugrunde liegenden Exporte der Messwerte und Alarmereignisse, für Gutachter, die die Rohdaten sehen wollen.",
      "<strong>Überwachungszertifikat</strong>: eine kürzere Zusammenfassung der Konfiguration (Schwellenwert, Kanäle, Aufbewahrung), nützlich für Vermieter und Versicherer, die einen Nachweis aktiver Überwachung wollen.",
    ],
    whoFor:
      "Für wen: einen laufenden Frost- oder Wasserschaden dokumentieren, einen Streit darüber untermauern, wann ein Ausfall begann, oder einfach eine Aufzeichnung parat haben, auch wenn du sie am Ende nie brauchst.",
  },
  adjuster: {
    title: "Was du dem Gutachter sagst",
    subtitle: "Fasse dich kurz. Gib ihm das Paket (oder den E-Mail-Link) und sprich diese Punkte an:",
    items: [
      {
        lead: "Wir überwachen diesen Raum durchgehend.",
        body: "Sonden melden an ProbeHarbor; Frost- und Leckalarme waren für den Haushalt schon vor dem Schadenszeitraum aktiviert.",
      },
      {
        lead: "Hier steht, wann wir es wussten.",
        body: "Die Alarmchronik zeigt Zeitstempel für Schwellenwertüberschreitungen und nasse Kontakte; die SHA-256-Fußzeile belegt, dass dieser Export nicht verändert wurde.",
      },
      {
        lead: "Hier sind die Rohdaten.",
        body: "Die verknüpften CSV-Dateien enthalten dieselben Messwerte und Alarmereignisse wie die Übersichtstabellen, für alle, die die Kälteperiode selbst nachzeichnen wollen.",
      },
      {
        lead: "Frag separat nach Rabatten für Überwachung.",
        body: "Das Paket dokumentiert, was überwacht wurde; ein Rabatt des Versicherers ist eine Frage deiner Police, keine Garantie von ProbeHarbor.",
      },
    ],
  },
  nearMiss: {
    title: "Für den Beinahe-Schaden, nicht erst hinterher",
    bodyHtml:
      'Erst der Verlauf macht einen Alarm handlungsrelevant, und genau ihn würdest du später einem Gutachter zeigen. Im <a class="text-link" href="/stories/pipe-near-miss">Szenario mit der kalten Ecke in der angebauten Garage</a> ist der Alarm nur die Spitze; der CSV-Verlauf zeigt, wie dieselbe Ecke in jeder klaren Nacht absackt, bis die Torabdichtung repariert ist. Ein Nachweispaket ist dieselbe Idee, aufbereitet für Dritte: Zeitstempel, Sonden und Alarme in einem überprüfbaren Export.',
    cta: "Szenario lesen",
  },
  durable: {
    title: "Gemacht, um standzuhalten, nicht nur zum Ausdrucken",
    body: "Ein einmaliger Download kann im Download-Ordner verloren gehen oder verändert werden, bevor ihn jemand sieht. Jedes Nachweispaket, das du erstellst, wird außerdem als dauerhafter, tokenisierter Export gespeichert: Es bekommt einen dauerhaften Link und einen SHA-256-Prüfcode, der über seinen Inhalt berechnet wird.",
    items: [
      "Öffne den Link jederzeit erneut, um genau den Bericht zu sehen, der erstellt wurde, keine Live-Ansicht, die sich inzwischen geändert haben könnte.",
      "Mit dem Prüfcode können du oder ein Gutachter bestätigen, dass der Bericht dem ursprünglich gesendeten entspricht.",
      "Schick ihn direkt aus deinem Dashboard an das Postfach eines Gutachters, mit eingebautem Link.",
    ],
  },
  insurer: {
    title: "Frag deine Versicherung danach",
    bodyHtml:
      'Manche Versicherer gewähren schon heute Rabatte für Häuser mit Schutz- oder Überwachungsgeräten. Die <a class="text-link" href="https://www.statefarm.com/insurance/homeowners/discounts" rel="noopener noreferrer" target="_blank">Rabattseite von State Farm für Hausbesitzer</a> nennt zum Beispiel Nachlässe für geeignete Schutz- und Heimüberwachungssysteme (Verfügbarkeit je nach Bundesstaat), und der <a class="text-link" href="https://www.lemonade.com/homeowners/explained/homeowners-insurance-new-york/" rel="noopener noreferrer" target="_blank">Ratgeber von Lemonade zur Hausversicherung in New York</a> erwähnt, dass ein Wasserlecksensor helfen kann, den Tarif zu senken. ProbeHarbor hat derzeit keine formelle Partnerschaft mit einem Versicherer. Sieh das also als Gesprächseinstieg, nicht als versprochenen Rabatt: Bring dein Nachweispaket oder Überwachungszertifikat mit, frag, ob eine solche Überwachung bei deiner Police anerkannt wird, und lass dir von deinem Versicherer sagen, was er tatsächlich anbietet.',
  },
  howTo: {
    title: "So erstellst du eins",
    step1:
      "Verbinde mindestens eine Sonde und lass ProbeHarbor etwas Verlauf sammeln (Frostalarme funktionieren ab dem ersten Tag; das Nachweispaket deckt den Zeitraum ab, den du überwacht hast).",
    step2: (free: string, member: string) =>
      `Wechsle zu Pro, falls noch nicht geschehen: Das Nachweispaket ist eine Pro-Funktion. Du bist schon bei Free oder Member und hattest gerade Frost? Messwerte, die noch in deinem Zeitfenster von ${free} / ${member} liegen, bleiben gespeichert; Pro schaltet das Paket für diesen aufbewahrten Verlauf frei (und verlängert künftig, wie weit du zurückblicken kannst).`,
    step3Html:
      'Wähle unter <a class="text-link" href="/dashboard/history?tab=exports#claims-pack">History → claims pack</a> einen Zeitraum und lade das Paket herunter oder schick es direkt an die E-Mail-Adresse eines Gutachters.',
    samplePdf: "Beispiel-PDF",
  },
  faqLede: "Klare Antworten darauf, was das Paket ist und was nicht.",
  faqs: (r: Retention, disclaimer: string): AboutFaqItem[] => [
    { question: "Ist das Nachweispaket ein rechtliches Dokument?", answer: disclaimer },
    {
      question: "In welchem Tarif ist das Nachweispaket enthalten?",
      answer:
        "Das Nachweispaket ist eine Pro-Funktion (auch in Portfolio). Mit Free und Member siehst du weiterhin Live-Messwerte und Verlauf, aber zum Erstellen und Versenden eines Nachweispakets brauchst du Pro.",
    },
    {
      question: "Ich bin bei Free oder Member und gerade ist etwas eingefroren. Kann ich upgraden und trotzdem ein Paket erstellen?",
      answer: `Ja, solange die Messwerte noch im Verlaufszeitfenster deines Tarifs liegen. Free speichert etwa ${r.free}, Member etwa ${r.member}, Pro etwa ${r.pro} oder länger. Ein Upgrade löscht keine gespeicherten Messwerte: Alles, was noch im längeren Pro-Zeitfenster liegt, steht dann für Diagramme, CSV und das Nachweispaket zur Verfügung. Upgrade zügig, wenn du ein Paket brauchst, das weiter zurückreicht, als dein aktueller Tarif anzeigt.`,
    },
    {
      question: "Kann ich das direkt an den Gutachter meiner Versicherung schicken?",
      answer:
        "Ja. Auf deiner Verlaufsseite kannst du den Bericht herunterladen und an deine eigene E-Mail anhängen oder ihn direkt aus ProbeHarbor an die E-Mail-Adresse eines Gutachters senden. In beiden Fällen bekommt der Empfänger einen dauerhaften Link, den er später erneut öffnen und prüfen kann.",
    },
    {
      question: "Was macht einen Export „überprüfbar“?",
      answer:
        "Jedes erstellte Paket wird mit einem SHA-256-Hash seines Inhalts und einem dauerhaften Link gespeichert. Beim erneuten Öffnen des Links werden genau die exportierten Daten mit demselben Prüfcode angezeigt, sodass jeder mit dem Link bestätigen kann, dass der Bericht seit seiner Erstellung nicht verändert wurde.",
    },
    {
      question: "Bekomme ich dadurch einen Rabatt bei meiner Versicherung?",
      answer:
        "Vielleicht: Das hängt vom Versicherer und vom Bundesstaat ab. State Farm nennt zum Beispiel auf seiner öffentlichen Rabattseite Nachlässe für Hausbesitzer mit geeigneten Schutz- oder Heimüberwachungsgeräten, und manche Versicherer (darunter Lemonade in bestimmten Märkten) führen Wasserleck- oder Temperaturalarmgeräte unter den Sicherheitsmaßnahmen, die eine Prämie senken können. ProbeHarbor hat derzeit keine formelle Partnerschaft mit einem Versicherer. Bring dein Nachweispaket oder Überwachungszertifikat mit, frag, ob eine solche Überwachung bei deiner Police anerkannt wird, und lass dir von deinem Versicherer sagen, was er tatsächlich anbietet.",
    },
  ],
};

const ptBr: ClaimsPackMessages = {
  title: "Pacote de provas para sinistros e seguros",
  description:
    "Transforme o histórico de congelamento e vazamentos em um pacote verificável para sinistros: exposição ao frio, tabelas de dispositivos e linha do tempo de alertas.",
  breadcrumbHome: "Início",
  breadcrumbPage: "Pacote para sinistros",
  disclaimer:
    "Este pacote é um registro de monitoramento exportado pelo ProbeHarbor para uso próprio da residência. Ele não é uma determinação legal, uma avaliação de seguro nem uma prova de cobertura. Os peritos devem verificar os registros de data e hora em relação ao hardware original dos sensores e aos canais de envio, quando necessário.",
  kicker: "Documentação",
  headerTitle: "A prova de que seu monitoramento detectou",
  lede: "Um cano congelado ou um vazamento não espera a melhor hora. O pacote para sinistros transforma seu histórico do ProbeHarbor em um único relatório: estatísticas de exposição ao congelamento, tabelas de dispositivos e sondas e uma linha do tempo de cada alerta. Feito para um sinistro, uma disputa ou simplesmente para ter a documentação antes de precisar dela.",
  generate: "Gerar um pacote para sinistros",
  startFree: "Comece grátis: monte seu pacote",
  downloadSample: "Baixar PDF de exemplo",
  seeProPricing: "Ver preços do Pro",
  shotPackCaption:
    "Exportação real de um pacote para sinistros: estatísticas de exposição ao congelamento, limite e dispositivos incluídos.",
  shotVerifyCaption:
    "Rodapé de verificação da mesma exportação: código SHA-256 e um link permanente para abrir de novo.",
  shotCertCaption:
    "Certificado de monitoramento: alertas ativados, limite de congelamento, retenção e cobertura em um relance.",
  contents: {
    title: "O que vem no pacote",
    subtitle:
      "Um único relatório HTML/PDF para imprimir, gerado sob demanda a partir do histórico dos seus próprios sensores, para qualquer período.",
    itemsHtml: [
      "<strong>Estatísticas de exposição ao congelamento</strong>: horas no seu limite de alerta ou abaixo dele e a leitura mais fria do período.",
      "<strong>Tabelas de dispositivos e sondas</strong>: cada sensor que enviou dados no período, com o espaço ao qual está atribuído.",
      "<strong>Linha do tempo de alertas críticos</strong>: cada alerta de cruzamento de limite disparado, com data e hora.",
      "<strong>CSVs vinculados</strong>: as exportações das leituras e dos eventos de alerta por trás do relatório, para o perito que quiser os dados brutos.",
      "<strong>Certificado de monitoramento</strong>: um resumo mais curto da configuração (limite, canais, retenção), útil para locadores e seguradoras que querem uma prova de que você monitora ativamente.",
    ],
    whoFor:
      "Para quem é: documentar um sinistro de congelamento ou vazamento em andamento, embasar uma disputa sobre quando uma falha começou ou simplesmente ter um registro à mão, mesmo que você nunca precise dele.",
  },
  adjuster: {
    title: "O que dizer ao perito",
    subtitle: "Seja breve. Entregue o pacote (ou o link do e-mail) e aborde estes pontos:",
    items: [
      {
        lead: "Monitoramos este espaço continuamente.",
        body: "As sondas enviam dados ao ProbeHarbor; os alertas de congelamento e vazamento estavam ativados na residência antes do período do dano.",
      },
      {
        lead: "Aqui está quando ficamos sabendo.",
        body: "A linha do tempo de alertas mostra data e hora dos cruzamentos de limite e dos contatos molhados; o rodapé SHA-256 comprova que esta exportação não foi editada.",
      },
      {
        lead: "Aqui estão os dados brutos.",
        body: "Os CSVs vinculados são as mesmas leituras e eventos de alerta por trás das tabelas de resumo, para quem quiser refazer o gráfico do período de frio.",
      },
      {
        lead: "Pergunte sobre descontos por monitoramento separadamente.",
        body: "O pacote documenta o que foi monitorado; qualquer desconto da seguradora é uma questão da apólice, não uma garantia do ProbeHarbor.",
      },
    ],
  },
  nearMiss: {
    title: "Para o quase acidente, não só para depois do dano",
    bodyHtml:
      'É o histórico que torna um alerta útil para agir, e é o que você mostraria a um perito mais tarde. No <a class="text-link" href="/stories/pipe-near-miss">cenário do canto frio da garagem anexa</a>, o alerta é só a ponta; o histórico em CSV mostra o mesmo canto esfriando toda noite de céu limpo até a vedação da porta ser consertada. Um pacote para sinistros é a mesma ideia preparada para terceiros: data e hora, sondas e alertas em uma exportação verificável.',
    cta: "Ler o cenário",
  },
  durable: {
    title: "Feito para valer como prova, não só para imprimir",
    body: "Um download avulso pode se perder na pasta de downloads ou ser editado antes que alguém o veja. Cada pacote para sinistros que você gera também é salvo como uma exportação durável com token: ele recebe um link permanente e um código de verificação SHA-256 calculado sobre o conteúdo.",
    items: [
      "Abra o link de novo quando quiser para ver exatamente o relatório que foi gerado, não uma visualização ao vivo que pode ter mudado.",
      "O código de verificação permite que você ou um perito confirme que o relatório é o mesmo que foi enviado originalmente.",
      "Envie direto para o e-mail de um perito a partir do seu painel, com o link incluído.",
    ],
  },
  insurer: {
    title: "Pergunte à sua seguradora",
    bodyHtml:
      'Algumas seguradoras já dão desconto para residências com dispositivos de proteção ou monitoramento. Por exemplo, a <a class="text-link" href="https://www.statefarm.com/insurance/homeowners/discounts" rel="noopener noreferrer" target="_blank">página de descontos para proprietários da State Farm</a> lista abatimentos para sistemas de proteção ou monitoramento residencial elegíveis (a disponibilidade varia conforme o estado), e o <a class="text-link" href="https://www.lemonade.com/homeowners/explained/homeowners-insurance-new-york/" rel="noopener noreferrer" target="_blank">guia de seguro residencial da Lemonade para Nova York</a> observa que um sensor de vazamento de água pode ajudar a reduzir a tarifa. Hoje o ProbeHarbor não tem nenhuma parceria formal com seguradoras, então trate isso como um ponto de partida para a conversa, e não como um desconto prometido: leve seu pacote para sinistros ou seu certificado de monitoramento, pergunte se esse tipo de monitoramento vale na sua apólice e deixe a seguradora dizer o que ela realmente oferece.',
  },
  howTo: {
    title: "Como gerar um",
    step1:
      "Conecte pelo menos uma sonda e deixe o ProbeHarbor juntar um pouco de histórico (os alertas de congelamento funcionam desde o primeiro dia; o pacote para sinistros cobre o período que você monitorou).",
    step2: (free: string, member: string) =>
      `Mude para o Pro se ainda não mudou: o pacote para sinistros é um recurso do Pro. Já está no Free ou no Member e teve um congelamento recente? As leituras que ainda estão dentro da sua janela de ${free} / ${member} continuam armazenadas; o Pro libera o pacote sobre esse histórico guardado (e amplia até onde você pode voltar daqui para a frente).`,
    step3Html:
      'Em <a class="text-link" href="/dashboard/history?tab=exports#claims-pack">History → claims pack</a>, escolha um período e baixe o pacote, ou envie direto para o e-mail de um perito.',
    samplePdf: "PDF de exemplo",
  },
  faqLede: "Respostas diretas sobre o que o pacote é, e o que não é.",
  faqs: (r: Retention, disclaimer: string): AboutFaqItem[] => [
    { question: "O pacote para sinistros é um documento legal?", answer: disclaimer },
    {
      question: "Em qual plano está o pacote para sinistros?",
      answer:
        "O pacote para sinistros é um recurso do Pro (e do Portfolio). Nos planos Free e Member você ainda vê leituras ao vivo e o histórico, mas gerar e enviar por e-mail um pacote para sinistros exige o Pro.",
    },
    {
      question: "Se estou no Free ou no Member e algo acabou de congelar, posso fazer upgrade e ainda montar um pacote?",
      answer: `Sim, desde que as leituras ainda estejam dentro da janela de histórico do seu plano. O Free guarda cerca de ${r.free}; o Member, cerca de ${r.member}; o Pro, cerca de ${r.pro} ou mais. O upgrade não apaga as leituras armazenadas: tudo o que ainda estiver dentro da janela mais longa do Pro fica disponível para gráficos, CSV e o pacote para sinistros. Faça o upgrade logo se precisar de um pacote que vá mais para trás do que o seu plano atual mostra.`,
    },
    {
      question: "Posso enviar isso direto ao perito do meu seguro?",
      answer:
        "Sim. Na sua página de histórico, você pode baixar o relatório para anexar ao seu próprio e-mail ou enviá-lo direto do ProbeHarbor para o endereço de e-mail de um perito. Em qualquer caso, o destinatário recebe um link durável que pode abrir e verificar de novo depois.",
    },
    {
      question: "O que torna uma exportação “verificável”?",
      answer:
        "Cada pacote gerado é salvo com um hash SHA-256 do conteúdo e um link permanente. Ao abrir esse link de novo, os dados exportados aparecem exatamente iguais, com o mesmo código de verificação, então qualquer pessoa com o link pode confirmar que o relatório não foi alterado desde que foi gerado.",
    },
    {
      question: "Usar isso vai me dar desconto no seguro?",
      answer:
        "Talvez: depende da seguradora e do estado. Por exemplo, a State Farm lista em sua página pública de descontos abatimentos para proprietários com dispositivos de proteção ou monitoramento residencial elegíveis, e algumas seguradoras (incluindo a Lemonade em certos mercados) citam dispositivos de vazamento de água ou de alerta de temperatura entre as medidas de segurança que podem reduzir o prêmio. Hoje o ProbeHarbor não tem nenhuma parceria formal com seguradoras. Leve seu pacote para sinistros ou seu certificado de monitoramento, pergunte se esse tipo de monitoramento vale na sua apólice e deixe a seguradora dizer o que ela realmente oferece.",
    },
  ],
};

export const claimsPackMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

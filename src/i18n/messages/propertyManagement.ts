import type { AboutFaqItem } from "../../lib/aboutFaqs";
import type { Locale } from "../locales";
import { LOCALE_META } from "../locales";
import { defineMessages } from "../translate";

/**
 * /property-management copy. Keys ending in `Html` hold trusted inline HTML
 * rendered with `set:html`; hrefs stay English (middleware localizes them).
 * `pro` / `portfolio` are the owned-household ceilings from entitlements.
 */

/** "$290" (en-US display string from stripePricing) → locale USD format. */
export function localizeUsd(display: string, locale: Locale): string {
  if (locale === "en") return display;
  const amount = Number(display.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(amount)) return display;
  const num = new Intl.NumberFormat(LOCALE_META[locale].intl, {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
  switch (locale) {
    case "fr":
      return `${num} $ US`;
    case "pt-br":
      return `US$ ${num}`;
    default:
      return `${num} US$`;
  }
}

const en = {
  title: "Property portfolio monitoring",
  description:
    "Cross-property freeze-risk dashboard, claims packs, and property-manager logins for landlords, vacation rentals, and managers.",
  breadcrumbHome: "Home",
  breadcrumbPage: "Property management",
  kicker: "For portfolios",
  headerTitle: "One dashboard for every property you're responsible for",
  lede: "A vacant rental and a ten-unit portfolio don't share the same monitoring problem. ProbeHarbor rolls every property you own into one freeze-risk view, keeps insurance-ready history when something fails, lets on-site managers handle devices without seeing billing, and prices Portfolio for that scale.",
  openPortfolio: "Open portfolio dashboard",
  startFree: "Start free, add your first property",
  portfolioPrice: (price: string) => `Portfolio: ${price}`,
  seePortfolioPricing: "See Portfolio pricing",
  priceAnnual: (annual: string, max: number, monthly: string | null) =>
    `${annual}/yr for up to ${max} properties${monthly ? ` (${monthly}/mo billed monthly)` : ""}`,
  priceMonthly: (monthly: string, max: number) => `${monthly}/mo for up to ${max} properties`,
  priceCustom: (max: number) => `Custom pricing for up to ${max} properties`,
  screenshotCaption:
    "Illustrative example of the Portfolio dashboard: at-risk properties, min temps, device counts, and property-manager roles in one table.",
  proof: {
    title: "Documented proof when a vacant unit fails",
    subtitle:
      "A burst pipe in an empty rental can sit unnoticed for days. Landlords and managers need alerts when it starts.        and a paper trail afterward for insurance, tenants, and liability questions.",
    itemsHtml: [
      "<strong>Claims / insurance evidence pack</strong>: freeze-exposure hours, probe tables, and alert timelines you can download or email to an adjuster. Built for rental claims and disputes, not just a homeowner near-miss.",
      "<strong>Per-property history</strong>, each unit keeps its own thresholds and readings so you can show what that space was doing before the loss.",
      "<strong>Portfolio alert digest</strong>, one rollup when any property needs attention, instead of checking units one by one.",
    ],
    cta: "See the claims pack",
  },
  built: {
    title: "What's already built",
    subtitle:
      "This isn't a roadmap item -- it's live functionality every Pro and Portfolio account can use today.",
    itemsHtml: [
      "<strong>Cross-property risk dashboard</strong>, every property you own in one table: current risk, minimum recent temperature vs. your freeze threshold, device count, last reading.",
      "<strong>Portfolio-wide alert digest</strong>: a rollup notification when any property in your portfolio needs attention, instead of watching each one separately.",
      "<strong>Property-manager logins</strong>: invite on-site staff or contractors to manage devices and alert settings for one property, with no access to your billing or the rest of your portfolio.",
      "<strong>Claims / insurance evidence pack</strong>: verifiable monitoring history for adjusters, carriers, and liability conversations after freeze or leak damage.",
      "<strong>Per-property everything else</strong>, each property gets its own device limit, alert thresholds, and history, exactly like a standalone ProbeHarbor account would.",
    ],
  },
  audience: {
    title: "Built for the people who actually run these",
    itemsHtml: [
      "<strong>Small landlords &amp; property managers</strong>: units you don't live in, staff turnover, and ROI that has to beat one unnoticed freeze claim. Manager logins keep on-site access scoped; remove someone and their access ends immediately.",
      "<strong>Vacation-rental owners</strong>: cabins and short-term stays sit empty between guests. Watch pipes and spaces during vacancy gaps without giving cleaners or co-hosts billing access. Start on Pro for a handful of places; move to Portfolio when the property count outgrows a personal plan.",
    ],
  },
  plans: {
    title: "Pro vs. Portfolio",
    body: (pro: number, portfolio: number) =>
      `Pro already includes the portfolio dashboard and up to ${pro} owned properties.        plenty for a couple of rentals or a vacation home alongside your main house. Portfolio is for real scale: up to ${portfolio} properties, property-manager logins, and pricing that reflects a business running many units rather than one person with one house.`,
    portfolioLabel: "Portfolio:",
    fullComparison: "Full plan comparison",
    proPricing: "Pro pricing",
    cta: "Compare Pro and Portfolio on pricing",
  },
  faqLede: "What Portfolio is, who it's for, and how it differs from Pro.",
  faqs: (pro: number, portfolio: number): AboutFaqItem[] => [
    {
      question: "How is Portfolio different from Pro?",
      answer: `Portfolio includes everything on the Pro plan -- SMS alerts, official NWS freeze and cold alerts, the claims evidence pack, webhooks, share links -- plus a much higher ceiling on how many properties you can own (Pro already allows up to ${pro}; Portfolio raises that to ${portfolio}) and it's priced for that scale rather than for a single property.`,
    },
    {
      question: "Do I need Portfolio if I only have 2-3 properties?",
      answer: `Probably not -- Pro already covers a handful of properties (up to ${pro} owned households) with the same cross-property dashboard and alert digest. Portfolio is built for larger operations: a property-management company or a landlord running many units where a single flat individual price doesn't reflect the scale.`,
    },
    {
      question: "Can my property managers or on-site staff get their own login?",
      answer:
        "Yes. Invite them with the property-manager role and they can manage devices and alert settings for the property they're assigned to, without seeing your billing, other properties, or account settings.",
    },
    {
      question: "What happens when a tenant or manager leaves?",
      answer:
        "Remove them from the household under Dashboard → Household. Their membership is deleted immediately: they lose access to that property's devices, alerts, and history, and they never had billing access to begin with. Pending invites can be revoked the same way before they're accepted.",
    },
    {
      question: "Do I need a separate ProbeHarbor account per property?",
      answer:
        "No -- one account owns all your properties as separate households, switches between them from the dashboard, and rolls them all up into a single portfolio risk view.",
    },
    {
      question: "What does the portfolio dashboard actually show?",
      answer:
        "One table across every property you own: current risk status, minimum recent temperature against your freeze threshold, device count, and last reading time -- so you can see which properties need attention without opening each one individually.",
    },
    {
      question: "Why does the claims pack matter for rentals?",
      answer:
        "After freeze or leak damage in a vacant or tenant-occupied unit, insurers and liability questions often turn on when you knew and what you were monitoring. The Pro/Portfolio claims pack turns probe history and alert timelines into a verifiable report you can download or email to an adjuster: documentation for claims, disputes, and carrier conversations.",
    },
  ],
};

type PropertyManagementMessages = typeof en;

const es: PropertyManagementMessages = {
  title: "Monitoreo de carteras de propiedades",
  description:
    "Panel de riesgo de congelación para todas tus propiedades, paquetes de reclamación y accesos para administradores, pensado para arrendadores y alquileres vacacionales.",
  breadcrumbHome: "Inicio",
  breadcrumbPage: "Administración de propiedades",
  kicker: "Para carteras",
  headerTitle: "Un solo panel para todas las propiedades a tu cargo",
  lede: "Un alquiler vacío y una cartera de diez unidades no tienen el mismo problema de monitoreo. ProbeHarbor reúne todas tus propiedades en una sola vista de riesgo de congelación, conserva un historial listo para el seguro cuando algo falla, permite que los administradores en sitio gestionen los dispositivos sin ver la facturación y ofrece Portfolio con un precio pensado para esa escala.",
  openPortfolio: "Abrir el panel de cartera",
  startFree: "Empieza gratis y añade tu primera propiedad",
  portfolioPrice: (price: string) => `Portfolio: ${price}`,
  seePortfolioPricing: "Ver precios de Portfolio",
  priceAnnual: (annual: string, max: number, monthly: string | null) =>
    `${annual}/año para hasta ${max} propiedades${monthly ? ` (${monthly}/mes con facturación mensual)` : ""}`,
  priceMonthly: (monthly: string, max: number) => `${monthly}/mes para hasta ${max} propiedades`,
  priceCustom: (max: number) => `Precio personalizado para hasta ${max} propiedades`,
  screenshotCaption:
    "Ejemplo ilustrativo del panel Portfolio: propiedades en riesgo, temperaturas mínimas, número de dispositivos y roles de administrador en una sola tabla.",
  proof: {
    title: "Pruebas documentadas cuando falla una unidad vacía",
    subtitle:
      "Una tubería reventada en un alquiler vacío puede pasar días sin que nadie lo note. Arrendadores y administradores necesitan alertas en cuanto empieza y, después, un registro documental para el seguro, los inquilinos y las cuestiones de responsabilidad.",
    itemsHtml: [
      "<strong>Paquete de pruebas para reclamaciones y seguros</strong>: horas de exposición a la congelación, tablas de sondas y cronologías de alertas que puedes descargar o enviar por correo a un perito. Pensado para reclamaciones y disputas de alquileres, no solo para el susto de un propietario.",
      "<strong>Historial por propiedad</strong>: cada unidad conserva sus propios umbrales y lecturas, así puedes mostrar qué pasaba en ese espacio antes del siniestro.",
      "<strong>Resumen de alertas de la cartera</strong>: un solo aviso consolidado cuando alguna propiedad necesita atención, en lugar de revisar las unidades una por una.",
    ],
    cta: "Ver el paquete para reclamaciones",
  },
  built: {
    title: "Lo que ya está disponible",
    subtitle:
      "No es algo de la hoja de ruta: es una función activa que cualquier cuenta Pro o Portfolio puede usar hoy.",
    itemsHtml: [
      "<strong>Panel de riesgo multipropiedad</strong>: todas tus propiedades en una tabla, con el riesgo actual, la temperatura mínima reciente frente a tu umbral de congelación, el número de dispositivos y la última lectura.",
      "<strong>Resumen de alertas de toda la cartera</strong>: una notificación consolidada cuando cualquier propiedad de tu cartera necesita atención, en lugar de vigilar cada una por separado.",
      "<strong>Accesos para administradores</strong>: invita al personal en sitio o a contratistas a gestionar los dispositivos y la configuración de alertas de una propiedad, sin acceso a tu facturación ni al resto de tu cartera.",
      "<strong>Paquete de pruebas para reclamaciones y seguros</strong>: un historial de monitoreo verificable para peritos, aseguradoras y conversaciones sobre responsabilidad tras daños por congelación o fugas.",
      "<strong>Todo lo demás, por propiedad</strong>: cada propiedad tiene su propio límite de dispositivos, umbrales de alerta e historial, igual que una cuenta independiente de ProbeHarbor.",
    ],
  },
  audience: {
    title: "Hecho para quienes realmente las gestionan",
    itemsHtml: [
      "<strong>Pequeños arrendadores y administradores de propiedades</strong>: unidades en las que no vives, rotación de personal y un retorno de la inversión que tiene que superar el costo de una sola reclamación por congelación que nadie vio venir. Los accesos de administrador limitan el acceso en sitio; si quitas a alguien, su acceso termina de inmediato.",
      "<strong>Propietarios de alquileres vacacionales</strong>: cabañas y estancias cortas quedan vacías entre huéspedes. Vigila tuberías y espacios en esos periodos sin dar acceso a la facturación al personal de limpieza ni a los coanfitriones. Empieza con Pro para unos pocos lugares y pasa a Portfolio cuando el número de propiedades supere un plan personal.",
    ],
  },
  plans: {
    title: "Pro frente a Portfolio",
    body: (pro: number, portfolio: number) =>
      `Pro ya incluye el panel de cartera y hasta ${pro} propiedades propias, más que suficiente para un par de alquileres o una casa de vacaciones además de tu vivienda principal. Portfolio es para una escala real: hasta ${portfolio} propiedades, accesos para administradores y un precio que refleja un negocio con muchas unidades, no una persona con una casa.`,
    portfolioLabel: "Portfolio:",
    fullComparison: "Comparación completa de planes",
    proPricing: "Precios de Pro",
    cta: "Comparar Pro y Portfolio en precios",
  },
  faqLede: "Qué es Portfolio, para quién es y en qué se diferencia de Pro.",
  faqs: (pro: number, portfolio: number): AboutFaqItem[] => [
    {
      question: "¿En qué se diferencia Portfolio de Pro?",
      answer: `Portfolio incluye todo lo del plan Pro (alertas por SMS, alertas oficiales de helada y frío del NWS (EE. UU.), el paquete de pruebas para reclamaciones, webhooks y enlaces para compartir) y además un límite mucho mayor de propiedades propias (Pro ya permite hasta ${pro}; Portfolio lo eleva a ${portfolio}), con un precio pensado para esa escala y no para una sola propiedad.`,
    },
    {
      question: "¿Necesito Portfolio si solo tengo 2 o 3 propiedades?",
      answer: `Probablemente no: Pro ya cubre un puñado de propiedades (hasta ${pro} hogares propios) con el mismo panel multipropiedad y el mismo resumen de alertas. Portfolio está pensado para operaciones más grandes: una empresa de administración de propiedades o un arrendador con muchas unidades, donde un precio individual fijo no refleja la escala.`,
    },
    {
      question: "¿Pueden mis administradores o el personal en sitio tener su propio acceso?",
      answer:
        "Sí. Invítalos con el rol de administrador de propiedad y podrán gestionar los dispositivos y la configuración de alertas de la propiedad que tengan asignada, sin ver tu facturación, otras propiedades ni la configuración de la cuenta.",
    },
    {
      question: "¿Qué pasa cuando se va un inquilino o un administrador?",
      answer:
        "Quítalo del hogar en Dashboard → Household. Su membresía se elimina de inmediato: pierde el acceso a los dispositivos, las alertas y el historial de esa propiedad, y nunca tuvo acceso a la facturación. Las invitaciones pendientes se pueden revocar de la misma forma antes de que se acepten.",
    },
    {
      question: "¿Necesito una cuenta de ProbeHarbor distinta para cada propiedad?",
      answer:
        "No: una sola cuenta es dueña de todas tus propiedades como hogares separados, cambia entre ellas desde el panel y las reúne todas en una única vista de riesgo de la cartera.",
    },
    {
      question: "¿Qué muestra exactamente el panel de cartera?",
      answer:
        "Una tabla con todas las propiedades que tienes: estado de riesgo actual, temperatura mínima reciente frente a tu umbral de congelación, número de dispositivos y hora de la última lectura, para que veas qué propiedades necesitan atención sin abrir cada una.",
    },
    {
      question: "¿Por qué importa el paquete para reclamaciones en los alquileres?",
      answer:
        "Tras daños por congelación o fugas en una unidad vacía u ocupada por inquilinos, las aseguradoras y las cuestiones de responsabilidad suelen depender de cuándo lo supiste y qué estabas monitoreando. El paquete para reclamaciones de Pro/Portfolio convierte el historial de las sondas y la cronología de alertas en un informe verificable que puedes descargar o enviar por correo a un perito: documentación para reclamaciones, disputas y conversaciones con la aseguradora.",
    },
  ],
};

const fr: PropertyManagementMessages = {
  title: "Surveillance de parc immobilier",
  description:
    "Tableau de bord du risque de gel pour tous vos biens, dossiers de sinistre et accès gestionnaires, pour bailleurs, locations saisonnières et gérants.",
  breadcrumbHome: "Accueil",
  breadcrumbPage: "Gestion locative",
  kicker: "Pour les parcs immobiliers",
  headerTitle: "Un seul tableau de bord pour tous les biens dont vous avez la charge",
  lede: "Un logement locatif vacant et un parc de dix lots n’ont pas le même problème de surveillance. ProbeHarbor regroupe tous vos biens dans une seule vue du risque de gel, conserve un historique exploitable par l’assurance en cas de problème, permet aux gestionnaires sur place de gérer les appareils sans voir la facturation, et propose Portfolio à un tarif adapté à cette échelle.",
  openPortfolio: "Ouvrir le tableau de bord du parc",
  startFree: "Commencez gratuitement, ajoutez votre premier bien",
  portfolioPrice: (price: string) => `Portfolio : ${price}`,
  seePortfolioPricing: "Voir les tarifs Portfolio",
  priceAnnual: (annual: string, max: number, monthly: string | null) =>
    `${annual}/an jusqu’à ${max} biens${monthly ? ` (${monthly}/mois en facturation mensuelle)` : ""}`,
  priceMonthly: (monthly: string, max: number) => `${monthly}/mois jusqu’à ${max} biens`,
  priceCustom: (max: number) => `Tarif sur mesure jusqu’à ${max} biens`,
  screenshotCaption:
    "Exemple illustratif du tableau de bord Portfolio : biens à risque, températures minimales, nombre d’appareils et rôles de gestionnaire dans un seul tableau.",
  proof: {
    title: "Des preuves documentées quand un logement vacant lâche",
    subtitle:
      "Une canalisation éclatée dans un logement vide peut passer inaperçue pendant des jours. Bailleurs et gestionnaires ont besoin d’alertes dès le début, puis d’une trace écrite pour l’assurance, les locataires et les questions de responsabilité.",
    itemsHtml: [
      "<strong>Dossier de preuves sinistre / assurance</strong> : heures d’exposition au gel, tableaux des sondes et chronologie des alertes, à télécharger ou à envoyer par e-mail à un expert. Conçu pour les sinistres et litiges locatifs, pas seulement pour la frayeur d’un propriétaire.",
      "<strong>Historique par bien</strong> : chaque lot conserve ses propres seuils et relevés, pour montrer ce qui se passait dans ce local avant le sinistre.",
      "<strong>Synthèse des alertes du parc</strong> : un seul récapitulatif dès qu’un bien demande votre attention, au lieu de vérifier les lots un par un.",
    ],
    cta: "Voir le dossier de sinistre",
  },
  built: {
    title: "Ce qui existe déjà",
    subtitle:
      "Ce n’est pas une promesse de feuille de route : ces fonctions sont disponibles dès aujourd’hui sur tous les comptes Pro et Portfolio.",
    itemsHtml: [
      "<strong>Tableau de bord du risque multi-biens</strong> : tous vos biens dans un seul tableau, avec le risque actuel, la température minimale récente par rapport à votre seuil de gel, le nombre d’appareils et le dernier relevé.",
      "<strong>Synthèse des alertes de tout le parc</strong> : une notification récapitulative dès qu’un bien de votre parc demande votre attention, au lieu de surveiller chacun séparément.",
      "<strong>Accès gestionnaires</strong> : invitez le personnel sur place ou des prestataires à gérer les appareils et les réglages d’alerte d’un bien, sans accès à votre facturation ni au reste de votre parc.",
      "<strong>Dossier de preuves sinistre / assurance</strong> : un historique de surveillance vérifiable pour les experts, les assureurs et les questions de responsabilité après un dégât dû au gel ou à une fuite.",
      "<strong>Tout le reste, par bien</strong> : chaque bien a sa propre limite d’appareils, ses seuils d’alerte et son historique, exactement comme un compte ProbeHarbor indépendant.",
    ],
  },
  audience: {
    title: "Conçu pour ceux qui gèrent vraiment ces biens",
    itemsHtml: [
      "<strong>Petits bailleurs et gestionnaires</strong> : des logements où vous n’habitez pas, un personnel qui change et un retour sur investissement qui doit dépasser le coût d’un seul sinistre de gel passé inaperçu. Les accès gestionnaires limitent les droits sur place ; retirez quelqu’un et son accès prend fin immédiatement.",
      "<strong>Propriétaires de locations saisonnières</strong> : chalets et locations de courte durée restent vides entre deux séjours. Surveillez canalisations et locaux pendant ces périodes sans donner accès à la facturation au personnel de ménage ni aux co-hôtes. Commencez avec Pro pour quelques biens, puis passez à Portfolio quand leur nombre dépasse un forfait personnel.",
    ],
  },
  plans: {
    title: "Pro ou Portfolio",
    body: (pro: number, portfolio: number) =>
      `Pro inclut déjà le tableau de bord du parc et jusqu’à ${pro} biens en propre, largement de quoi couvrir deux ou trois locations ou une maison de vacances en plus de votre résidence principale. Portfolio vise une vraie échelle : jusqu’à ${portfolio} biens, des accès gestionnaires et un tarif pensé pour une entreprise qui gère de nombreux lots, pas pour une personne avec une maison.`,
    portfolioLabel: "Portfolio :",
    fullComparison: "Comparatif complet des forfaits",
    proPricing: "Tarifs Pro",
    cta: "Comparer Pro et Portfolio sur la page des tarifs",
  },
  faqLede: "Ce qu’est Portfolio, à qui il s’adresse et en quoi il diffère de Pro.",
  faqs: (pro: number, portfolio: number): AboutFaqItem[] => [
    {
      question: "En quoi Portfolio diffère-t-il de Pro ?",
      answer: `Portfolio comprend tout ce qu’offre le forfait Pro (alertes SMS, alertes officielles de gel et de froid du NWS (États-Unis), dossier de preuves pour sinistre, webhooks, liens de partage), avec en plus un plafond bien plus élevé de biens en propre (Pro en autorise déjà jusqu’à ${pro} ; Portfolio monte à ${portfolio}), et un tarif pensé pour cette échelle plutôt que pour un seul bien.`,
    },
    {
      question: "Ai-je besoin de Portfolio si je n’ai que 2 ou 3 biens ?",
      answer: `Probablement pas : Pro couvre déjà quelques biens (jusqu’à ${pro} foyers en propre) avec le même tableau de bord multi-biens et la même synthèse des alertes. Portfolio s’adresse aux structures plus importantes : une société de gestion immobilière ou un bailleur avec de nombreux lots, pour qui un tarif individuel forfaitaire ne reflète pas l’échelle.`,
    },
    {
      question: "Mes gestionnaires ou le personnel sur place peuvent-ils avoir leur propre accès ?",
      answer:
        "Oui. Invitez-les avec le rôle de gestionnaire de bien : ils pourront gérer les appareils et les réglages d’alerte du bien qui leur est attribué, sans voir votre facturation, vos autres biens ni les paramètres du compte.",
    },
    {
      question: "Que se passe-t-il quand un locataire ou un gestionnaire s’en va ?",
      answer:
        "Retirez-le du foyer dans Dashboard → Household. Son adhésion est supprimée immédiatement : il perd l’accès aux appareils, aux alertes et à l’historique de ce bien, et il n’a jamais eu accès à la facturation. Les invitations en attente peuvent être révoquées de la même façon avant d’être acceptées.",
    },
    {
      question: "Faut-il un compte ProbeHarbor distinct pour chaque bien ?",
      answer:
        "Non : un seul compte détient tous vos biens sous forme de foyers distincts, passe de l’un à l’autre depuis le tableau de bord et les regroupe tous dans une seule vue du risque du parc.",
    },
    {
      question: "Que montre concrètement le tableau de bord du parc ?",
      answer:
        "Un tableau couvrant tous vos biens : état de risque actuel, température minimale récente par rapport à votre seuil de gel, nombre d’appareils et heure du dernier relevé, pour voir quels biens demandent votre attention sans les ouvrir un par un.",
    },
    {
      question: "Pourquoi le dossier de sinistre compte-t-il pour les locations ?",
      answer:
        "Après un dégât dû au gel ou à une fuite dans un logement vacant ou occupé, l’assureur et les questions de responsabilité portent souvent sur le moment où vous avez su et sur ce que vous surveilliez. Le dossier de sinistre Pro/Portfolio transforme l’historique des sondes et la chronologie des alertes en un rapport vérifiable à télécharger ou à envoyer par e-mail à un expert : une documentation pour les sinistres, les litiges et les échanges avec l’assureur.",
    },
  ],
};

const de: PropertyManagementMessages = {
  title: "Überwachung für Immobilienportfolios",
  description:
    "Frostrisiko-Dashboard über alle Objekte, Nachweispakete für Schadensfälle und Verwalter-Logins für Vermieter, Ferienwohnungen und Hausverwaltungen.",
  breadcrumbHome: "Startseite",
  breadcrumbPage: "Immobilienverwaltung",
  kicker: "Für Portfolios",
  headerTitle: "Ein Dashboard für jedes Objekt, für das du verantwortlich bist",
  lede: "Eine leerstehende Mietwohnung und ein Portfolio mit zehn Einheiten haben nicht dasselbe Überwachungsproblem. ProbeHarbor fasst alle deine Objekte in einer Frostrisiko-Ansicht zusammen, bewahrt versicherungstaugliche Verläufe auf, wenn etwas ausfällt, lässt Verwalter vor Ort Geräte betreuen, ohne die Abrechnung zu sehen, und bepreist Portfolio passend zu dieser Größenordnung.",
  openPortfolio: "Portfolio-Dashboard öffnen",
  startFree: "Kostenlos starten, erstes Objekt hinzufügen",
  portfolioPrice: (price: string) => `Portfolio: ${price}`,
  seePortfolioPricing: "Portfolio-Preise ansehen",
  priceAnnual: (annual: string, max: number, monthly: string | null) =>
    `${annual}/Jahr für bis zu ${max} Objekte${monthly ? ` (${monthly}/Monat bei monatlicher Abrechnung)` : ""}`,
  priceMonthly: (monthly: string, max: number) => `${monthly}/Monat für bis zu ${max} Objekte`,
  priceCustom: (max: number) => `Individueller Preis für bis zu ${max} Objekte`,
  screenshotCaption:
    "Beispielhafte Darstellung des Portfolio-Dashboards: gefährdete Objekte, Tiefsttemperaturen, Geräteanzahl und Verwalterrollen in einer Tabelle.",
  proof: {
    title: "Dokumentierte Nachweise, wenn eine leere Einheit ausfällt",
    subtitle:
      "Ein geplatztes Rohr in einer leeren Mietwohnung kann tagelang unbemerkt bleiben. Vermieter und Verwalter brauchen Alarme, sobald es losgeht, und danach eine lückenlose Dokumentation für Versicherung, Mieter und Haftungsfragen.",
    itemsHtml: [
      "<strong>Nachweispaket für Schadensfall und Versicherung</strong>: Frostexpositionsstunden, Sondentabellen und Alarmverläufe, die du herunterladen oder per E-Mail an einen Gutachter schicken kannst. Gemacht für Schadensfälle und Streitigkeiten bei Mietobjekten, nicht nur für den Beinahe-Schaden eines Eigenheimbesitzers.",
      "<strong>Verlauf pro Objekt</strong>: Jede Einheit behält ihre eigenen Schwellenwerte und Messwerte, damit du zeigen kannst, was in diesem Raum vor dem Schaden los war.",
      "<strong>Alarm-Zusammenfassung fürs Portfolio</strong>: eine gebündelte Meldung, sobald ein Objekt Aufmerksamkeit braucht, statt jede Einheit einzeln zu prüfen.",
    ],
    cta: "Zum Nachweispaket",
  },
  built: {
    title: "Was es schon gibt",
    subtitle:
      "Das steht nicht auf einer Roadmap: Diese Funktionen kann jedes Pro- und Portfolio-Konto schon heute nutzen.",
    itemsHtml: [
      "<strong>Objektübergreifendes Risiko-Dashboard</strong>: alle deine Objekte in einer Tabelle, mit aktuellem Risiko, jüngster Tiefsttemperatur im Vergleich zu deinem Frostschwellenwert, Geräteanzahl und letztem Messwert.",
      "<strong>Portfolioweite Alarm-Zusammenfassung</strong>: eine gebündelte Benachrichtigung, sobald irgendein Objekt in deinem Portfolio Aufmerksamkeit braucht, statt jedes einzeln im Blick zu behalten.",
      "<strong>Verwalter-Logins</strong>: Lade Personal vor Ort oder Dienstleister ein, Geräte und Alarmeinstellungen für ein Objekt zu verwalten, ohne Zugriff auf deine Abrechnung oder den Rest deines Portfolios.",
      "<strong>Nachweispaket für Schadensfall und Versicherung</strong>: ein überprüfbarer Überwachungsverlauf für Gutachter, Versicherer und Haftungsfragen nach Frost- oder Wasserschäden.",
      "<strong>Alles andere pro Objekt</strong>: Jedes Objekt hat sein eigenes Gerätelimit, eigene Alarmschwellen und einen eigenen Verlauf, genau wie ein eigenständiges ProbeHarbor-Konto.",
    ],
  },
  audience: {
    title: "Gemacht für die Leute, die diese Objekte wirklich betreuen",
    itemsHtml: [
      "<strong>Kleine Vermieter und Hausverwaltungen</strong>: Einheiten, in denen du nicht wohnst, wechselndes Personal und eine Rendite, die einen einzigen unbemerkten Frostschaden übertreffen muss. Verwalter-Logins begrenzen den Zugriff vor Ort; entfernst du jemanden, endet sein Zugriff sofort.",
      "<strong>Besitzer von Ferienunterkünften</strong>: Hütten und Kurzzeitvermietungen stehen zwischen den Gästen leer. Behalte Rohre und Räume in diesen Leerstandsphasen im Blick, ohne Reinigungskräften oder Co-Gastgebern Zugriff auf die Abrechnung zu geben. Starte mit Pro für eine Handvoll Unterkünfte und wechsle zu Portfolio, wenn die Zahl der Objekte einem privaten Tarif entwächst.",
    ],
  },
  plans: {
    title: "Pro oder Portfolio",
    body: (pro: number, portfolio: number) =>
      `Pro enthält bereits das Portfolio-Dashboard und bis zu ${pro} eigene Objekte, mehr als genug für ein paar Mietwohnungen oder ein Ferienhaus neben deinem Hauptwohnsitz. Portfolio ist für echte Größenordnungen: bis zu ${portfolio} Objekte, Verwalter-Logins und ein Preis für ein Unternehmen mit vielen Einheiten statt für eine Person mit einem Haus.`,
    portfolioLabel: "Portfolio:",
    fullComparison: "Vollständiger Tarifvergleich",
    proPricing: "Pro-Preise",
    cta: "Pro und Portfolio auf der Preisseite vergleichen",
  },
  faqLede: "Was Portfolio ist, für wen es gedacht ist und wie es sich von Pro unterscheidet.",
  faqs: (pro: number, portfolio: number): AboutFaqItem[] => [
    {
      question: "Wie unterscheidet sich Portfolio von Pro?",
      answer: `Portfolio enthält alles aus dem Pro-Tarif (SMS-Alarme, offizielle Frost- und Kältewarnungen des NWS (USA), das Nachweispaket für Schadensfälle, Webhooks und Freigabelinks) und dazu eine deutlich höhere Obergrenze für eigene Objekte (Pro erlaubt bereits bis zu ${pro}, Portfolio hebt das auf ${portfolio} an). Der Preis ist auf diese Größenordnung ausgelegt statt auf ein einzelnes Objekt.`,
    },
    {
      question: "Brauche ich Portfolio, wenn ich nur 2–3 Objekte habe?",
      answer: `Wahrscheinlich nicht: Pro deckt bereits eine Handvoll Objekte ab (bis zu ${pro} eigene Haushalte), mit demselben objektübergreifenden Dashboard und derselben Alarm-Zusammenfassung. Portfolio ist für größere Betriebe gedacht: eine Hausverwaltung oder einen Vermieter mit vielen Einheiten, bei denen ein pauschaler Einzelpreis die Größenordnung nicht abbildet.`,
    },
    {
      question: "Können meine Verwalter oder das Personal vor Ort einen eigenen Login bekommen?",
      answer:
        "Ja. Lade sie mit der Rolle „Objektverwalter“ ein; dann können sie Geräte und Alarmeinstellungen für das ihnen zugewiesene Objekt verwalten, ohne deine Abrechnung, andere Objekte oder die Kontoeinstellungen zu sehen.",
    },
    {
      question: "Was passiert, wenn ein Mieter oder Verwalter ausscheidet?",
      answer:
        "Entferne die Person unter Dashboard → Household aus dem Haushalt. Ihre Mitgliedschaft wird sofort gelöscht: Sie verliert den Zugriff auf Geräte, Alarme und Verlauf dieses Objekts und hatte ohnehin nie Zugriff auf die Abrechnung. Offene Einladungen lassen sich auf dieselbe Weise widerrufen, bevor sie angenommen werden.",
    },
    {
      question: "Brauche ich für jedes Objekt ein eigenes ProbeHarbor-Konto?",
      answer:
        "Nein: Ein Konto besitzt alle deine Objekte als getrennte Haushalte, wechselt im Dashboard zwischen ihnen und fasst sie alle in einer einzigen Portfolio-Risikoansicht zusammen.",
    },
    {
      question: "Was zeigt das Portfolio-Dashboard genau?",
      answer:
        "Eine Tabelle über alle deine Objekte: aktueller Risikostatus, jüngste Tiefsttemperatur im Vergleich zu deinem Frostschwellenwert, Geräteanzahl und Zeitpunkt des letzten Messwerts. So siehst du, welche Objekte Aufmerksamkeit brauchen, ohne jedes einzeln zu öffnen.",
    },
    {
      question: "Warum ist das Nachweispaket bei Mietobjekten wichtig?",
      answer:
        "Nach Frost- oder Wasserschäden in einer leeren oder vermieteten Einheit hängen Versicherungs- und Haftungsfragen oft davon ab, wann du davon wusstest und was du überwacht hast. Das Pro/Portfolio-Nachweispaket macht aus Sondenverläufen und Alarmchronik einen überprüfbaren Bericht, den du herunterladen oder per E-Mail an einen Gutachter schicken kannst: Dokumentation für Schadensfälle, Streitigkeiten und Gespräche mit dem Versicherer.",
    },
  ],
};

const ptBr: PropertyManagementMessages = {
  title: "Monitoramento de carteira de imóveis",
  description:
    "Painel de risco de congelamento para todos os imóveis, pacotes para sinistros e logins de administradores para locadores, aluguéis de temporada e gestores.",
  breadcrumbHome: "Início",
  breadcrumbPage: "Gestão de imóveis",
  kicker: "Para carteiras de imóveis",
  headerTitle: "Um único painel para todos os imóveis sob sua responsabilidade",
  lede: "Um imóvel vazio para alugar e uma carteira de dez unidades não têm o mesmo problema de monitoramento. O ProbeHarbor reúne todos os seus imóveis em uma única visão de risco de congelamento, guarda um histórico pronto para o seguro quando algo falha, deixa os administradores no local cuidarem dos dispositivos sem ver o faturamento e tem um preço do Portfolio pensado para essa escala.",
  openPortfolio: "Abrir o painel da carteira",
  startFree: "Comece grátis e adicione seu primeiro imóvel",
  portfolioPrice: (price: string) => `Portfolio: ${price}`,
  seePortfolioPricing: "Ver preços do Portfolio",
  priceAnnual: (annual: string, max: number, monthly: string | null) =>
    `${annual}/ano para até ${max} imóveis${monthly ? ` (${monthly}/mês no plano mensal)` : ""}`,
  priceMonthly: (monthly: string, max: number) => `${monthly}/mês para até ${max} imóveis`,
  priceCustom: (max: number) => `Preço personalizado para até ${max} imóveis`,
  screenshotCaption:
    "Exemplo ilustrativo do painel Portfolio: imóveis em risco, temperaturas mínimas, quantidade de dispositivos e funções de administrador em uma única tabela.",
  proof: {
    title: "Provas documentadas quando uma unidade vazia dá problema",
    subtitle:
      "Um cano estourado em um imóvel vazio pode passar dias sem ninguém perceber. Locadores e gestores precisam de alertas assim que começa e, depois, de um registro documentado para o seguro, os inquilinos e as questões de responsabilidade.",
    itemsHtml: [
      "<strong>Pacote de provas para sinistros e seguros</strong>: horas de exposição ao congelamento, tabelas das sondas e linhas do tempo de alertas que você pode baixar ou enviar por e-mail a um perito. Feito para sinistros e disputas de imóveis alugados, não só para o susto de um proprietário.",
      "<strong>Histórico por imóvel</strong>: cada unidade mantém seus próprios limites e leituras, para você mostrar o que estava acontecendo naquele espaço antes do dano.",
      "<strong>Resumo de alertas da carteira</strong>: um único aviso consolidado quando algum imóvel precisa de atenção, em vez de verificar as unidades uma a uma.",
    ],
    cta: "Ver o pacote para sinistros",
  },
  built: {
    title: "O que já está pronto",
    subtitle:
      "Não é item de roadmap: é uma funcionalidade ativa que qualquer conta Pro ou Portfolio pode usar hoje.",
    itemsHtml: [
      "<strong>Painel de risco de vários imóveis</strong>: todos os seus imóveis em uma tabela, com risco atual, temperatura mínima recente em relação ao seu limite de congelamento, quantidade de dispositivos e última leitura.",
      "<strong>Resumo de alertas de toda a carteira</strong>: uma notificação consolidada quando qualquer imóvel da sua carteira precisa de atenção, em vez de acompanhar cada um separadamente.",
      "<strong>Logins de administradores</strong>: convide a equipe no local ou prestadores de serviço para gerenciar dispositivos e configurações de alerta de um imóvel, sem acesso ao seu faturamento nem ao resto da carteira.",
      "<strong>Pacote de provas para sinistros e seguros</strong>: um histórico de monitoramento verificável para peritos, seguradoras e questões de responsabilidade após danos por congelamento ou vazamento.",
      "<strong>Todo o resto, por imóvel</strong>: cada imóvel tem seu próprio limite de dispositivos, limites de alerta e histórico, exatamente como uma conta independente do ProbeHarbor.",
    ],
  },
  audience: {
    title: "Feito para quem realmente cuida desses imóveis",
    itemsHtml: [
      "<strong>Pequenos locadores e administradores de imóveis</strong>: unidades onde você não mora, rotatividade da equipe e um retorno que precisa superar o custo de um único sinistro de congelamento que passou despercebido. Os logins de administrador restringem o acesso no local; remova alguém e o acesso termina na hora.",
      "<strong>Proprietários de imóveis de temporada</strong>: chalés e estadias curtas ficam vazios entre um hóspede e outro. Acompanhe canos e ambientes nesses intervalos sem dar acesso ao faturamento para a equipe de limpeza ou coanfitriões. Comece no Pro com alguns imóveis e passe para o Portfolio quando a quantidade de imóveis ultrapassar um plano pessoal.",
    ],
  },
  plans: {
    title: "Pro x Portfolio",
    body: (pro: number, portfolio: number) =>
      `O Pro já inclui o painel da carteira e até ${pro} imóveis próprios, o suficiente para alguns imóveis alugados ou uma casa de veraneio além da sua casa principal. O Portfolio é para escala de verdade: até ${portfolio} imóveis, logins de administradores e um preço que reflete uma empresa com muitas unidades, não uma pessoa com uma casa.`,
    portfolioLabel: "Portfolio:",
    fullComparison: "Comparação completa de planos",
    proPricing: "Preços do Pro",
    cta: "Comparar Pro e Portfolio na página de preços",
  },
  faqLede: "O que é o Portfolio, para quem ele é e como se diferencia do Pro.",
  faqs: (pro: number, portfolio: number): AboutFaqItem[] => [
    {
      question: "Qual a diferença entre o Portfolio e o Pro?",
      answer: `O Portfolio inclui tudo do plano Pro (alertas por SMS, alertas oficiais de geada e frio do NWS (EUA), o pacote de provas para sinistros, webhooks e links de compartilhamento) e ainda um limite muito maior de imóveis próprios (o Pro já permite até ${pro}; o Portfolio aumenta para ${portfolio}), com preço pensado para essa escala e não para um único imóvel.`,
    },
    {
      question: "Preciso do Portfolio se tenho só 2 ou 3 imóveis?",
      answer: `Provavelmente não: o Pro já cobre alguns imóveis (até ${pro} residências próprias) com o mesmo painel de vários imóveis e o mesmo resumo de alertas. O Portfolio foi feito para operações maiores: uma administradora de imóveis ou um locador com muitas unidades, para quem um preço individual fixo não reflete a escala.`,
    },
    {
      question: "Meus administradores ou a equipe no local podem ter login próprio?",
      answer:
        "Sim. Convide-os com a função de administrador do imóvel e eles poderão gerenciar dispositivos e configurações de alerta do imóvel atribuído, sem ver seu faturamento, outros imóveis ou as configurações da conta.",
    },
    {
      question: "O que acontece quando um inquilino ou administrador sai?",
      answer:
        "Remova a pessoa da residência em Dashboard → Household. A participação dela é excluída na hora: ela perde o acesso aos dispositivos, alertas e histórico daquele imóvel, e nunca teve acesso ao faturamento. Convites pendentes podem ser revogados da mesma forma antes de serem aceitos.",
    },
    {
      question: "Preciso de uma conta ProbeHarbor separada para cada imóvel?",
      answer:
        "Não: uma única conta é dona de todos os seus imóveis como residências separadas, alterna entre eles pelo painel e reúne todos em uma única visão de risco da carteira.",
    },
    {
      question: "O que o painel da carteira mostra de fato?",
      answer:
        "Uma tabela com todos os seus imóveis: status de risco atual, temperatura mínima recente em relação ao seu limite de congelamento, quantidade de dispositivos e horário da última leitura, para você ver quais imóveis precisam de atenção sem abrir um por um.",
    },
    {
      question: "Por que o pacote para sinistros importa em imóveis alugados?",
      answer:
        "Depois de danos por congelamento ou vazamento em uma unidade vazia ou ocupada por inquilinos, a seguradora e as questões de responsabilidade costumam girar em torno de quando você ficou sabendo e do que estava monitorando. O pacote para sinistros do Pro/Portfolio transforma o histórico das sondas e a linha do tempo dos alertas em um relatório verificável que você pode baixar ou enviar por e-mail a um perito: documentação para sinistros, disputas e conversas com a seguradora.",
    },
  ],
};

export const propertyManagementMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

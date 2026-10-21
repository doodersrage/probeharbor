/**
 * /property-management copy. Keys ending in `Html` hold trusted inline HTML
 * rendered with `set:html`; hrefs stay English (middleware localizes them).
 * `pro` / `portfolio` are the owned-household ceilings from entitlements.
 */

import type { PropertyManagementMessages } from "./en";

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
  portfolioPrice: "Portfolio: {price}",
  seePortfolioPricing: "Ver precios de Portfolio",
  priceAnnual: "{annual}/año para hasta {max} propiedades",
  priceAnnualWithMonthly: "{annual}/año para hasta {max} propiedades ({monthly}/mes con facturación mensual)",
  priceMonthly: "{monthly}/mes para hasta {max} propiedades",
  priceCustom: "Precio personalizado para hasta {max} propiedades",
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
    body: "Pro ya incluye el panel de cartera y hasta {pro} propiedades propias, más que suficiente para un par de alquileres o una casa de vacaciones además de tu vivienda principal. Portfolio es para una escala real: hasta {portfolio} propiedades, accesos para administradores y un precio que refleja un negocio con muchas unidades, no una persona con una casa.",
    portfolioLabel: "Portfolio:",
    fullComparison: "Comparación completa de planes",
    proPricing: "Precios de Pro",
    cta: "Comparar Pro y Portfolio en precios",
  },
  faqLede: "Qué es Portfolio, para quién es y en qué se diferencia de Pro.",
  faqs: [
    {
      question: "¿En qué se diferencia Portfolio de Pro?",
      answer: "Portfolio incluye todo lo del plan Pro (alertas por SMS, alertas oficiales de helada y frío del NWS (EE. UU.), el paquete de pruebas para reclamaciones, webhooks y enlaces para compartir) y además un límite mucho mayor de propiedades propias (Pro ya permite hasta {pro}; Portfolio lo eleva a {portfolio}), con un precio pensado para esa escala y no para una sola propiedad.",
    },
    {
      question: "¿Necesito Portfolio si solo tengo 2 o 3 propiedades?",
      answer: "Probablemente no: Pro ya cubre un puñado de propiedades (hasta {pro} hogares propios) con el mismo panel multipropiedad y el mismo resumen de alertas. Portfolio está pensado para operaciones más grandes: una empresa de administración de propiedades o un arrendador con muchas unidades, donde un precio individual fijo no refleja la escala.",
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

export default es;

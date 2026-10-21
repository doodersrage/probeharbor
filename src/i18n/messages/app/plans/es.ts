import type { PlansMessages } from "./en";

const es: PlansMessages = {
  title: "Planes",
  subtitle: "Compara los planes y mejora el tuyo cuando necesites más historial, SMS o más propiedades.",
  comparisonTitle: "Comparación de funciones",
  comparisonHint: "Tu columna está resaltada.",
  card: {
    title: "Planes",
    titleWithCsv: "Planes y exportación CSV",
    introHtml:
      'Member desbloquea la exportación CSV, 90 días de historial y avisos de congelación según el pronóstico. Todos los planes incluyen un reloj de tiempo hasta la congelación para este espacio sin calefacción. Pro añade alertas oficiales de congelación y frío del NWS (EE. UU.), SMS, notificaciones push en el navegador, enlaces para invitados, un <a class="text-link" href="/claims-pack">paquete de pruebas para reclamaciones</a>, webhooks entrantes y salientes, widgets incrustables y 14 días de prueba gratis. Portfolio sube el límite de propiedades propias para arrendadores y administradores de propiedades, con accesos de administrador para el personal en el lugar. La facturación anual tiene descuento frente a la mensual cuando esos precios están configurados en Stripe.',
    subscriptionActivated: "Suscripción activada.",
    checkoutCancelled: "Se canceló el pago. Puedes suscribirte cuando quieras.",
    currentPlan: "Plan actual:",
    maxDevices: "hasta {count} dispositivos push por propiedad",
    history: "{retention} de historial",
    ownedProperties: { one: "{count} propiedad propia", other: "{count} propiedades propias" },
    fullComparison: "Comparación completa",
    subscriptionActive: "Tu suscripción {plan} está activa.",
    csvAccess: "Tu cuenta incluye acceso a la exportación CSV.",
    manageBilling: "Gestionar facturación",
    upgradeProMonthly: "Pasar a Pro (mensual)",
    proAnnual: "Pro anual",
    upgradePortfolioMonthly: "Pasar a Portfolio (mensual)",
    portfolioAnnual: "Portfolio anual",
    seePortfolioPricingHtml:
      '<a class="text-link" href="/pricing#portfolio">Ver precios de Portfolio</a> para gestionar muchas propiedades.',
    memberMonthly: "Member mensual",
    memberAnnual: "Member anual",
    proMonthly: "Pro mensual",
  },
};

export default es;

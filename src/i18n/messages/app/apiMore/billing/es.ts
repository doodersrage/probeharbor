import type { ApiMoreBillingMessages } from "./en";

const es: ApiMoreBillingMessages = {
  stripe: {
    unknownPlan: "Plan desconocido",
    noItems: "La suscripción no tiene elementos que cambiar",
    sessionFailed: "No se pudo crear la sesión de pago",
    checkoutFailed: "No se pudo iniciar el pago",
    portalFailed: "No se pudo abrir el portal de facturación",
  },
  claims: {
    requiresPro: "El paquete para reclamaciones requiere Pro",
    pdfUnavailable: "La generación de PDF no está disponible temporalmente. Prueba ?format=html o vuelve a intentarlo en un momento.",
  },
  certificate: {
    failed: "No se pudo generar el certificado",
    pdfUnavailable: "La generación de PDF no está disponible",
  },
  claimsEmail: {
    eyebrow: "Paquete para reclamaciones",
    range: "{from} al {to}",
    preheader: "Un informe de exposición a heladas de ProbeHarbor para {household} está listo para consultar.",
    title: "Paquete para reclamaciones: {household}",
    intro: "Un miembro de un hogar de ProbeHarbor ha compartido un informe de exposición a heladas e historial de alertas que abarca del {range}.",
    body: "El informe incluye estadísticas de exposición a heladas, tablas de dispositivos y sondas, y una cronología de las alertas críticas del periodo seleccionado, con un código de verificación para poder volver a confirmar esta exportación concreta más adelante.",
    verificationCode: "Código de verificación: {code}",
    cta: "Ver paquete para reclamaciones",
    historyCta: "Abrir este periodo en Historial",
    footerNote:
      "Este informe lo envió un miembro de un hogar de ProbeHarbor. Es un resumen de monitorización, no una inspección certificada: consulta el propio informe para ver el contexto completo.",
    subject: "Paquete para reclamaciones: {household}",
  },
};

export default es;

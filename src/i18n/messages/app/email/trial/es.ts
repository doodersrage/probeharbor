import type { TrialEmailMessages } from "./en";

const es: TrialEmailMessages = {
  subjectTomorrow: "Tu prueba de ProbeHarbor {plan} termina mañana",
  subjectDays: "Tu prueba de ProbeHarbor {plan} termina en {days} días",
  eyebrow: "Recordatorio de prueba",
  preheaderTomorrow:
    "Tu prueba de {plan} termina mañana. Mantén SMS, webhooks y enlaces compartidos sin interrupciones.",
  preheaderDays:
    "Tu prueba de {plan} termina en {days} días. Mantén SMS, webhooks y enlaces compartidos sin interrupciones.",
  titleTomorrow: "La prueba termina mañana",
  titleDays: "La prueba termina en {days} días",
  introTomorrow:
    "Tu prueba de {plan} termina mañana. Sigue en Pro para mantener activos los SMS, los enlaces compartidos y los webhooks.",
  introDays:
    "Tu prueba de {plan} termina en {days} días. Sigue en Pro para mantener activos los SMS, los enlaces compartidos y los webhooks.",
  billing:
    "La facturación se gestiona en el portal de cliente de Stripe desde tu panel: sin bloqueos inesperados si renuevas antes de que termine la prueba.",
  bullets: [
    "Alertas de congelación y fuga por SMS",
    "Enlaces públicos para compartir e insertar",
    "Webhooks salientes y más dispositivos permitidos",
  ],
  ctaPlans: "Revisar planes y facturación",
  ctaCompare: "Comparar funciones",
};

export default es;

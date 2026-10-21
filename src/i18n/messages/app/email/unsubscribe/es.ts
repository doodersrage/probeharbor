import type { UnsubscribeMessages } from "./en";

const es: UnsubscribeMessages = {
  labels: {
    digest: "los correos de resumen semanal",
    monthly_report: "los correos de informe mensual",
    quarterly_report: "los correos de informe trimestral",
    drip: "los correos de consejos y bienvenida",
    freeze_drill: "los correos de simulacro de preparación ante heladas",
  },
  emailSettings: "Ajustes de correo",
  invalidTitle: "Enlace no válido",
  invalidBody: "Este enlace para darse de baja no es válido. Puedes cambiar tus preferencias de correo desde el panel.",
  confirmTitle: "¿Darse de baja?",
  confirmBody: "¿Dejar de enviar {emails}? Las alertas de congelación e inundación no se ven afectadas.",
  confirmButton: "Darse de baja",
  errorTitle: "Algo salió mal",
  errorBody: "No pudimos actualizar tus preferencias. Inténtalo de nuevo o cámbialas desde el panel.",
  doneTitle: "Te has dado de baja",
  doneBody: "Ya no recibirás {emails}. Las alertas de congelación e inundación no se ven afectadas.",
};

export default es;

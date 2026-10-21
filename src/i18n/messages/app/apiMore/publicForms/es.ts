import type { ApiMorePublicFormsMessages } from "./en";

const es: ApiMorePublicFormsMessages = {
  contact: {
    success: "Gracias, hemos recibido tu mensaje. Solemos responder en 1–2 días hábiles.",
    verificationFailed: "La verificación ha fallado.",
    missingFields: "Faltan campos obligatorios.",
    tooLong: "El mensaje es demasiado largo.",
    recipientMissing: "El destinatario del correo no está configurado.",
    sendFailed: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
  },
  freezeAlerts: {
    success: "Revisa tu correo para confirmar. Las alertas empiezan la siguiente noche de heladas después de confirmar.",
    tooMany: "Demasiados intentos. Vuelve a intentarlo en unos minutos.",
    verificationFailed: "La verificación ha fallado. Inténtalo de nuevo.",
    genericError: "Algo salió mal. Inténtalo de nuevo.",
    unsubscribe: {
      forecastLink: "Pronóstico de congelación de tuberías",
      invalidTitle: "Enlace no válido",
      invalidBodyHtml: "<p>A este enlace para darte de baja le falta su token.</p>",
      confirmTitle: "¿Dejar de recibir alertas de congelación?",
      confirmBodyHtml: "<p>Dejarás de recibir correos de alertas de congelación en esta dirección.</p>",
      button: "Darme de baja",
      doneTitle: "Te has dado de baja",
      doneBodyHtml: "<p>No se enviarán más correos de alertas de congelación a esta dirección.</p>",
      usedTitle: "Ya te habías dado de baja",
      usedBodyHtml: "<p>Este enlace ya se usó o no es válido.</p>",
    },
  },
  shareReadings: {
    missingToken: "Falta el token",
    tooManyRequests: "Demasiadas solicitudes",
    invalidLink: "Enlace no válido o caducado",
  },
};

export default es;

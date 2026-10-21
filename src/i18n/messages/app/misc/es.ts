import type { MiscMessages } from "./en";

const es: MiscMessages = {
  feeds: {
    requestFailed: "La solicitud al feed de temperatura falló ({status})",
    invalidPayload: "Los datos del feed de temperatura no son válidos",
    missingRoot: 'Al feed de temperatura le falta un objeto "{root}"',
    timedOut: "El feed no respondió a tiempo.",
    invalidJson: "El feed no devolvió un JSON válido.",
    unreachableDetail: "No se pudo conectar con el feed ({detail})",
    unknown: "Error desconocido del feed",
    unreachable: "Feed inaccesible",
    responding: { one: "{count} sonda responde", other: "{count} sondas responden" },
  },
  forms: {
    turnstileMissing: "Falta la verificación de Turnstile.",
    turnstileFailed: "La verificación de Turnstile falló.",
    tooManyAttempts: "Demasiados intentos. Vuelve a intentarlo en unos minutos.",
    tooManyMessages: "Demasiados mensajes. Vuelve a intentarlo en unos minutos.",
  },
  share: {
    metricsNotAllowed: "Este enlace compartido no permite formatos de métricas",
  },
};

export default es;

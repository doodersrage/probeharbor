import type { ApiDevicesMessages } from "./en";

const es: ApiDevicesMessages = {
  nameRequired: "El nombre es obligatorio",
  deviceNotFound: "Dispositivo no encontrado",
  sameHousehold: "Es el mismo hogar",
  renameFailed: "No se pudo cambiar el nombre del dispositivo",
  updateSpaceFailed: "No se pudo actualizar el espacio",
  replaceErrors: {
    same_sensor: "Elige dos sensores distintos.",
    kind_mismatch: "Los dos sensores deben ser del mismo tipo (temperatura con temperatura).",
    sensor_not_found: "Uno de esos sensores ya no está en esta propiedad.",
    failed: "No se pudo reemplazar el sensor. No se cambió nada.",
  },
  reveal: {
    tooManyAttempts: "Demasiados intentos de mostrar la clave. Vuelve a intentarlo en {seconds} segundos.",
    notConfigured: "La recuperación de claves no está configurada en este servidor.",
    verifyMfa: "Vuelve a verificar la MFA antes de mostrar las claves de ingesta.",
    deviceNotFound: "Dispositivo no encontrado.",
    noRecoverableKey: "Este dispositivo no tiene una clave recuperable. Rótala para generar una nueva.",
    decryptFailed: "No se pudo descifrar la clave guardada.",
  },
  noSensorsProvided: "No se indicó ningún sensor.",
  pullFetchProbes: { one: "{count} sonda", other: "{count} sondas" },
  feedTest: {
    tooMany: "Demasiadas pruebas de feed. Vuelve a intentarlo en un momento.",
    invalidUrl: "Introduce una URL de feed HTTPS válida.",
    requestFailed: "La solicitud al feed falló ({status}).",
    found: { one: "Se encontró {count} sonda (JSON {format}).", other: "Se encontraron {count} sondas (JSON {format})." },
    foundWithAverage: {
      one: "Se encontró {count} sonda (JSON {format}), promedio {average} °F.",
      other: "Se encontraron {count} sondas (JSON {format}), promedio {average} °F.",
    },
    failed: "La prueba del feed falló",
  },
};

export default es;

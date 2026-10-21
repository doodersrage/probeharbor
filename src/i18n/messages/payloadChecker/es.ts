/**
 * /payload-checker copy. `script` strings are read by the client script from a
 * data attribute: `{n}` is a count, `{value}` a device field value.
 * Warnings in the result come from the API and stay English.
 */
import type { PayloadCheckerMessages } from "./en";

const es: PayloadCheckerMessages = {
  title: "Comprobador de payloads de sensores",
  description:
    "Pega el JSON que envía tu ESP32, Arduino, flujo de Node-RED o script y mira qué lecturas guardaría ProbeHarbor antes de conectar un dispositivo real.",
  breadcrumbHome: "Inicio",
  kicker: "Herramienta",
  heading: "¿Entenderá ProbeHarbor mi sensor?",
  lede: "Pega el JSON que envía tu dispositivo. Verás cada lectura en la que se convierte, el tipo de sensor en el que se clasifica y todo lo que se omitiría o se leería mal. No se guarda nada y no necesitas cuenta.",
  apiDocs: "Documentación de la API de ingesta",
  whichHardware: "¿Qué hardware funciona?",
  inputTitle: "Tu payload",
  tryExample: "Prueba un ejemplo:",
  examples: { flat: "Claves planas", classic: "Arduino clásico", typed: "Sensores tipados" },
  jsonBody: "Cuerpo JSON",
  check: "Comprobar payload",
  resultTitle: "Resultado",
  tableCaption: "Lecturas que guardaría este payload",
  colKey: "Clave",
  colStoredAs: "Se guarda como",
  colType: "Tipo",
  colValue: "Valor",
  nextTitle: "Cuando todo esté bien",
  nextHtml:
    'Crea un dispositivo en el panel para obtener una clave de ingesta y envía por POST el mismo cuerpo a <code>/api/ingest/_</code> con una cabecera <code>X-Ingest-Key</code>. Las lecturas aparecen en la pestaña Devices en segundos. ¿Nada de código? El <a class="text-link" href="/flash">instalador web</a> pone un firmware funcional en un ESP32 desde tu navegador.',
  script: {
    invalidJson: "Eso todavía no es JSON válido.",
    invalidJsonHint: "Revisa las comillas, las comas y los corchetes.",
    checkFailed: "No se pudo comprobar ese payload.",
    acceptedOne: "Aceptado: se guardaría 1 lectura.",
    acceptedMany: "Aceptado: se guardarían {n} lecturas.",
    acceptedOneNotes: "Aceptado: se guardaría 1 lectura, con notas abajo.",
    acceptedManyNotes: "Aceptado: se guardarían {n} lecturas, con notas abajo.",
    rejected: "Rechazado: el endpoint respondería 400.",
    unreachable: "No se pudo contactar con el comprobador. Vuelve a intentarlo en un momento.",
    battery: "batería {value} %",
    signal: "señal {value} dBm",
    firmware: "firmware {value}",
    ignored: "ignorados: {value}",
    deviceFields: "Campos del dispositivo: {value}",
  },
};

export default es;

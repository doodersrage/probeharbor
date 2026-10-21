
/** /about/data-flow body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

const es: Messages = {
  introHtml:
    "Cada número de la página principal pasa por varias capas. Entender ese recorrido ayuda a depurar lecturas desactualizadas, sondas que faltan o huecos en el historial.",
  step1Title: "Paso 1. Medición en el espacio",
  step1Html:
    'Las sondas miden temperatura y humedad. El sketch de Arduino las consulta cada pocos segundos, descarta valores claramente anómalos y prepara una estructura JSON en memoria. Más detalles: <a class="text-link" href="/about/arduino-sketches">sketches de Arduino</a> y <a class="text-link" href="/about/temperature-probes">sondas de temperatura</a>.',
  step2Title: "Paso 2. Publicación del JSON",
  step2Html:
    'La placa o un relé cercano expone JSON por HTTPS. Un servicio FastAPI en Python puede almacenar las respuestas en caché en Redis para que el resto de internet nunca acceda directamente a la conexión de casa: consulta <a class="text-link" href="/about/python-feeds">scripts y feeds en Python</a>.',
  jsonAlt: "Visor JSON del navegador con las claves de sonda 0, 1 y avg, con Fahrenheit, Celsius y humedad",
  jsonCaption: "Estructura del feed en vivo que consume el sitio web una vez que sale de la red local.",
  step3Title: "Paso 3. Obtención y visualización en el sitio",
  step3Html:
    "Al cargar la página principal, el servidor obtiene cada URL de feed configurada, interpreta las claves de las sondas y genera las tarjetas de datos. Los usuarios con sesión iniciada cargan desde Supabase sus propias asignaciones de feeds y sondas en lugar de las predeterminadas. Los datos meteorológicos siguen un camino paralelo a través de OpenWeather, con la ciudad que hayas elegido si la indicas.",
  step4Title: "Paso 4. Guardado del historial",
  step4Html:
    'Si has iniciado sesión, cada lectura correcta de sonda inserta filas en Supabase con el nombre del feed, la etiqueta y la clave de la sonda, las temperaturas, la humedad y la marca de tiempo. Los visitantes siguen viendo datos en vivo, pero no añaden historial. Más información en <a class="text-link" href="/about/historical-data">uso de los datos históricos</a>.',
  step5Title: "Paso 5. Panel y exportación",
  step5Html:
    'La tabla de historial pagina esas filas. La exportación CSV envía el conjunto completo a administradores y suscriptores. Los webhooks de Stripe mantienen la pertenencia al grupo con permiso de exportación. Las herramientas de la cuenta se describen en <a class="text-link" href="/about/accounts-and-dashboard">cuentas y panel</a>.',
  failuresTitle: "Puntos de fallo que revisar",
  failures: [
    "Cableado o alimentación de la sonda: registros serie del Arduino.",
    "Red doméstica o certificado: haz curl a la URL del feed desde un portátil conectado por LTE.",
    "Caché del relé desactualizada: reinicia la descarga desde el origen en fast-api-relay.",
    "Asignación en el panel: una errata en la clave de la sonda oculta lecturas aunque el JSON sea válido.",
    "Cookies de sesión: el historial solo se guarda con la sesión iniciada.",
  ],
};

export default es;

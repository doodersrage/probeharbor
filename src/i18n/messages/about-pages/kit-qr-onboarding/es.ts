
/**
 * /about/kit-qr-onboarding body copy. Dashboard screen names stay English
 * (the dashboard is English). `*Html` keys are trusted inline HTML.
 */
import type { Messages } from "./en";

const es: Messages = {
  pathTitle: "Ruta guiada del kit",
  pathSteps: [
    'Compra un ESP32 y una DS18B20 impermeable: <a class="text-link" href="/about/esp32-freeze-kit">lista de piezas</a> (Adafruit / Amazon; ProbeHarbor no vende hardware).',
    'Crea un dispositivo push en <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> (con un clic; se llama «Workshop probe» por defecto).',
    "Copia o escanea el QR de ingesta (visible durante 30 minutos tras crear o rotar la clave).",
    "Flashea el firmware o apunta Home Assistant a esa URL: los sensores se importan solos con el primer POST.",
    'Define el umbral de congelación (°F) y un correo en la tarjeta de primera alerta de Devices, o abre <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a>, y envía una prueba.',
    'Opcional: <a class="text-link" href="/dashboard/share/links">comparte un enlace en vivo con la familia</a> (incluido en Free).',
  ],
  encodeTitle: "Qué codificar",
  encodeHtml:
    'Después de crear o rotar una clave push en <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>, el recuadro de la clave muestra un QR con la URL de ingesta completa (visible durante 30 minutos, aunque recargues la página):',
  encodeWarningHtml:
    "Cualquiera que escanee el QR con el móvil verá la URL, así que guarda los dispositivos en un lugar seguro y rota las claves si se pierde una etiqueta.",
  nfcTitle: "Etiquetas NFC (opcional)",
  nfcHtml:
    'Graba la misma URL de ingesta HTTPS como registro NDEF URI en una pegatina NTAG213/215. Durante la configuración, basta con acercar el móvil para abrir la URL. Guarda las etiquetas con el kit: son tan sensibles como un QR impreso. Piezas y consejos de impresión: <a class="text-link" href="/kit-labels">etiquetas QR y NFC del kit</a>.',
  devicesQrTitle: "El QR en la página Devices",
  devicesQrHtml:
    'El QR se genera dentro de la app al crear o rotar una clave push, sin generadores de QR externos. Desde ese recuadro puedes descargar el SVG o imprimir una etiqueta sencilla (nombre del dispositivo + QR + URL). Consulta también el payload de prueba con curl en <a class="text-link" href="/about/ingest-and-webhooks">ingesta y webhooks</a>.',
  checklistTitle: "Lista de puesta en marcha",
  checklistHtml:
    '¿Prefieres ver lecturas antes de flashear el firmware? Usa <strong>Try without hardware</strong> en Overview para el feed pull de demostración, explora la <a class="text-link" href="/demo">demo en vivo</a> pública y luego crea un dispositivo push y escanea el QR.',
  gettingStartedHtml:
    "La tarjeta de primeros pasos del panel sigue la creación del dispositivo, el primer POST y las alertas. Las claves de los sensores se importan solas cuando el firmware envía JSON por POST: combina el QR con claves de payload como <code>temp1</code> o <code>door1</code> y, si hace falta, cambia las etiquetas en Devices.",
};

export default es;

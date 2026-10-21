/**
 * BrowserFlasher component (/flash and the English-only dashboard).
 * `status` strings are read by the inline script from a data attribute;
 * `{sensor}` and `{error}` are filled in on the client.
 */
import type { BrowserFlasherMessages } from "./en";

const es: BrowserFlasherMessages = {
  installTitle: "1. Instala el firmware",
  installCopy:
    "Conecta el ESP32 a este ordenador con un cable USB de datos, haz clic en Instalar y elige el puerto serie de la placa. Tarda alrededor de un minuto. Funciona con placas ESP32, ESP32-S3 y ESP32-C3.",
  installButton: "Instalar firmware",
  unsupportedHtml:
    'Este navegador no puede comunicarse con dispositivos serie USB. Abre esta página en Chrome o Edge en un ordenador de sobremesa o portátil, o usa las <a class="text-link" href="/about/esp32-web-flash">otras opciones de flasheo</a>.',
  notAllowed: "El instalador necesita una página segura (https).",
  noPort:
    "¿No aparece ningún puerto? Prueba otro cable (muchos solo cargan) e instala el controlador CP210x o CH340 de tu placa.",
  connectTitle: "2. Conéctalo al Wi‑Fi y a tu cuenta",
  connectCopy:
    "Cierra el instalador y envía estos ajustes por el mismo cable. Van directamente a la placa y no se guardan en esta página.",
  ssidLabel: "Nombre de la red Wi‑Fi",
  ssidHint: "Red de 2,4 GHz; las placas ESP32 no pueden conectarse a 5 GHz.",
  passwordLabel: "Contraseña del Wi‑Fi",
  keyLabel: "Clave del dispositivo",
  keyHintPrefilled: "Rellenada para el dispositivo que acabas de crear.",
  keyHint:
    "En Dashboard → Devices, después de añadir un dispositivo push. También puedes pegar la URL de ingesta completa.",
  extrasLegend: "También conectado a esta placa (opcional)",
  extraLeak: "Contacto de fuga / agua",
  extraDoor: "Interruptor reed de puerta",
  extraBattery: "Batería (divisor 1:1)",
  extrasHint:
    "Marca solo lo que hayas conectado: un pin sin cablear se leería como «seco» o «abierto». Los pines están en la tabla de arriba. Los sensores DS18B20, DHT22 e I²C (BME280, SHT31, AHT20) se detectan automáticamente.",
  sendButton: "Enviar ajustes por USB",
  phoneSetupHtml:
    "¿Tu navegador no tiene serie USB o la placa ya está montada en otro sitio? Enciéndela y conéctate desde un móvil a la red Wi‑Fi <strong>ProbeHarbor-Setup</strong> para introducir los mismos ajustes. Mantener pulsado el botón BOOT cinco segundos los borra.",
  status: {
    noSerial:
      "Este navegador no admite serie USB. Usa Chrome o Edge en un ordenador, o la configuración desde el móvil que se explica abajo.",
    pickPort: "Elige el puerto serie de la placa…",
    waiting: "Esperando a que arranque la placa…",
    sending: "Enviando ajustes…",
    received: "Ajustes recibidos. Conectando al Wi‑Fi…",
    wifiOk: "Conectada al Wi‑Fi. Enviando la primera lectura…",
    liveWithSensor:
      "Primera lectura recibida de tu {sensor}, con humedad. Ya está funcionando: puedes desconectarlo y montarlo.",
    live: "Primera lectura recibida. La sonda ya está funcionando: puedes desconectarla y montarla.",
    noReading:
      "La placa tiene los ajustes, pero aún no ha llegado ninguna lectura. Revisa el cableado del sensor (datos a GPIO 4, 4,7 kΩ a 3,3 V) y vuelve a intentarlo.",
    noAnswer: "La placa no responde. Asegúrate de que la instalación del firmware terminó y vuelve a intentarlo.",
    noPortSelected: "No se ha seleccionado ningún puerto.",
    couldNotTalk: "No se pudo comunicar con la placa: {error}",
  },
};

export default es;

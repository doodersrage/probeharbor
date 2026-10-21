import type { FreezeTimeCalculatorMessages } from "./en";

const es: FreezeTimeCalculatorMessages = {
  title: "Calculadora de tiempo de congelación de tuberías",
  description:
    "Con dos lecturas de temperatura y un umbral de helada, estima cuántas horas faltan para que un garaje, sótano o cabaña congele las tuberías.",
  breadcrumbHome: "Inicio",
  kicker: "Herramienta",
  heading: "¿Cuánto falta para que este espacio llegue a la helada?",
  lede: "Lee ahora un termómetro en el espacio, compáralo con una lectura anterior y calcula aproximadamente cuántas horas quedan hasta que llegue a tu umbral de helada al ritmo de enfriamiento actual.",
  startFree: "Empieza gratis",
  howLongLink: "Cuánto tardan en congelarse las tuberías",
  readingTitle: "Cómo interpretar el resultado",
  readingIntro:
    "La estimación supone que el espacio sigue enfriándose al ritmo que mediste. Úsala para decidir cuán urgente es esta noche: una o dos horas significa actuar ya; un día o más, volver a comprobar más tarde.",
  readingLinksHtml:
    'Las tuberías en paredes exteriores y cerca de puertas están más frías que la habitación, así que mide lo más cerca posible de la tubería. Consulta <a class="text-link" href="/answers/garage-pipe-freeze-temperature">cuándo se congelan las tuberías del garaje</a>, <a class="text-link" href="/answers/freeze-alarm-temperature-setting">a qué temperatura configurar una alarma de helada</a> y <a class="text-link" href="/about/time-to-freeze">cómo funciona el reloj de tiempo hasta la helada</a> del panel.',
  sensorTitle: "Deja que un sensor haga las cuentas",
  sensorBody:
    "Una sonda en la tubería informa cada pocos minutos, así que la estimación se actualiza sola y te llega una alerta antes del umbral. El plan gratuito incluye alertas por correo; usa una sonda ESP32 o conecta Home Assistant.",
  seeDemo: "Ver la demo en vivo",
  faqs: [
    {
      question: "¿Cómo funciona la calculadora?",
      answer:
        "Toma el ritmo de enfriamiento entre tus dos lecturas y lo prolonga en línea recta hasta tu umbral. Si el espacio bajó 1 °C (2 °F) en la última hora y está 5,5 °C (10 °F) por encima del umbral, la estimación es de cinco horas.",
    },
    {
      question: "¿Qué tan precisa es la estimación?",
      answer:
        "Es un margen, no un cronómetro. Un espacio se enfría más despacio a medida que se acerca a la temperatura exterior y más rápido si sube el viento o se abre una puerta, así que repite el cálculo con lecturas nuevas más o menos cada hora.",
    },
    {
      question: "¿Qué umbral debo usar?",
      answer:
        "Entre 1 y 3 °C (34–38 °F) medidos en la tubería. Llegar al umbral no significa que la tubería se haya congelado: significa que aún hay tiempo para recuperar la calefacción, cerrar una puerta o abrir un grifo.",
    },
    {
      question: "¿Puede hacerse automáticamente?",
      answer:
        "Sí. ProbeHarbor hace el mismo cálculo de forma continua con las lecturas de tu sensor en todos los planes y lo muestra como un reloj de tiempo hasta la helada, con una alerta cuando el espacio llega a tu umbral.",
    },
  ],
  calculator: {
    heading: "Calculadora",
    unitLegend: "Unidad de temperatura",
    nowLabel: "Temperatura ahora (°{unit})",
    nowHint: "En la tubería si puedes; si no, el aire cercano.",
    earlierLabel: "Temperatura anterior (°{unit})",
    earlierHint: "Mismo sensor, mismo lugar.",
    minutesLabel: "Minutos entre lecturas",
    minutesHint: "15 o más; una hora da una tendencia más estable.",
    thresholdLabel: "Umbral de helada (°{unit})",
    thresholdHint: "{low}–{high} deja tiempo para actuar antes de {freezing}.",
    resultLabel: "Tiempo hasta el umbral",
    headlineEmpty: "Introduce cuatro números",
    headlineAtThreshold: "Ya en el umbral",
    headlineNotCooling: "No se está enfriando hacia la helada",
    headlineNeedGap: "Hace falta más tiempo entre lecturas",
    detailEmpty: "Rellena todos los campos con un número para ver una estimación.",
    detailCooling: "Enfriamiento de ~{rate}: unas {duration} hasta {threshold} a este ritmo.",
    ratePerHour: "{value}°{unit}/h",
    minutes: "{n} minutos",
    hours: "{n} horas",
    days: "{n} días",
    msgAtThreshold: "Ya está en tu umbral de helada o por debajo.",
    msgNeedReadings: "Hacen falta lecturas más recientes para estimar una tendencia.",
    msgTooClose: "Las lecturas están demasiado juntas para calcular una tendencia.",
    msgRising: "La temperatura está subiendo: la tendencia actual no indica riesgo de helada.",
    msgStable: "La temperatura está estable: la tendencia no indica una helada inminente.",
    reset: "Restablecer ejemplo",
  },
};

export default es;

import type { FreezeSeasonMessages } from "./en";

const es: FreezeSeasonMessages = {
  title: "Vigilancia de heladas con sondas",
  description:
    "Activa alertas de helada antes de la ola de frío: mapa comunitario, sondas ESP y correo (SMS en Pro) cuando el interior baja hacia 0 °C (32 °F).",
  breadcrumbHome: "Inicio",
  breadcrumb: "Temporada de heladas",
  kicker: "Temporada",
  seasonHere: "Llegó la temporada de heladas",
  seasonAhead: "Prepárate antes de la temporada de heladas",
  lede: "Las tuberías se congelan en espacios por los que no pasas cada hora. Pon una sonda donde está el agua, fija un umbral unos grados por encima de 0 °C (32 °F) y obtén un reloj que te dice cuándo este espacio llegará a la helada, además de una alerta cuando aún te quedan horas para actuar.",
  openAlerts: "Abrir lo esencial de alertas",
  startFree: "Empieza gratis: conecta una sonda",
  communityMap: "Mapa comunitario de heladas",
  checklistTitle: "La lista de esta noche",
  checklist: [
    "Deja gotear los grifos de las paredes exteriores si las tuberías pasan por espacios fríos.",
    "Revisa los burletes de las puertas (garaje, taller, acceso al sótano) y cierra las que estén abiertas.",
    "Aísla los grifos exteriores y desconecta las mangueras del jardín.",
    "Confirma que las alertas de helada están activadas y envía una prueba si hace tiempo que no lo haces.",
    "Comprueba que haya una sonda en el rincón más frío, cerca de las tuberías o de lo que tengas guardado.",
  ],
  checklistOptionalHtml:
    'Opcional: suma tu ciudad al <a class="text-link" href="/freeze-map">mapa público de heladas</a>.',
  sampleColdest: "Ciudades más frías (ejemplo)",
  liveColdest: "Ciudades participantes más frías",
  sampleNote: "Vista previa ilustrativa hasta que suficientes hogares se sumen al mapa de heladas.",
  liveNote: "De la última instantánea del mapa de heladas de ProbeHarbor.",
  minTemp: "mín. {temp}",
  viewMap: "Ver el mapa completo",
  indoorTitle: "Por qué las sondas interiores superan al tiempo exterior por sí solo",
  indoorBody:
    "Una lectura de Tempest o del aeropuerto dice cuánto frío hace en el jardín. A tus tuberías les importan el espacio sin calefacción, la puerta que no cierra bien y el calefactor que se averió. ProbeHarbor vigila ese espacio y puede mostrarse junto al tiempo exterior en tu panel para darte contexto.",
  vsWeather: "Frente a estaciones meteorológicas",
  partsList: "Lista de piezas ESP32 + DS18B20",
  stories: "Lee historias de heladas",
  demo: "Prueba la demo en vivo",
  faqLede: "Preparación para la temporada de heladas para propietarios con sondas en espacios fríos.",
  howToName: "Prepara ProbeHarbor para una noche de helada",
  howToStep: "Paso {step} de la lista",
  howToMapName: "Súmate al mapa de heladas (opcional)",
  howToMapText:
    "Comparte muestras anónimas de tus sondas a nivel de ciudad en el mapa público de heladas para que tus vecinos vean el riesgo en la región.",
  faqs: [
    {
      question: "¿Cuándo es la temporada de heladas para ProbeHarbor?",
      answer:
        "Considera de noviembre a marzo como la temporada principal de heladas en la mayor parte de los EE. UU. continentales. Los climas costeros y de montaña varían; usa tus noches más frías y los avisos de helada del NWS (servicio meteorológico de EE. UU.) como la señal real.",
    },
    {
      question: "¿Por qué no basta con el tiempo exterior?",
      answer:
        "Las estaciones exteriores miden el jardín. Las tuberías se congelan en espacios sin calefacción, sótanos y talleres que van por detrás del aire exterior. Pon una sonda donde está el agua y usa el tiempo exterior como contexto.",
    },
    {
      question: "¿Qué debo hacer esta noche antes de una ola de frío?",
      answer:
        "Deja gotear los grifos de paredes exteriores si las tuberías están frías, cierra las puertas abiertas, aísla los grifos exteriores, confirma las alertas de helada con una prueba y comprueba que haya una sonda en el rincón más frío cerca de las tuberías. La lista está en esta página.",
    },
    {
      question: "¿Dónde está la lista de piezas del ESP32?",
      answer:
        "probeharbor.dev/about/esp32-freeze-kit: lista de materiales con ESP32 + DS18B20 impermeable, cableado y pasos para instalar el firmware.",
    },
  ],
};

export default es;

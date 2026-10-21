import type { ProbeDemoMessages } from "./en";

const es: ProbeDemoMessages = {
  conditionsTitle: "Condiciones de las sondas",
  conditionsSubtitleHtml:
    "Elige un espacio, ajusta el clima y observa cómo responden las zonas, igual que Overview y Devices con la ingesta en vivo. Prueba primero <strong>Corriente en la puerta</strong> o <strong>Ola de frío</strong>: provoca el cambio y luego lee las barras.",
  presetsAria: "Escenarios predefinidos",
  spaceLabel: "Espacio monitorizado",
  outdoorLabel: "Temperatura exterior: {temp}",
  sunLabel: "Sol / carga térmica ({pct} %)",
  freezeLabel: "Umbral de helada: {temp}",
  draftCalloutHtml:
    "La zona de la puerta/entrada está unos <strong>{spread}</strong> más fría que la sonda más cálida: por eso un solo sensor en el banco de trabajo puede pasar por alto el riesgo de helada junto a la puerta.",
  reset: "Reiniciar demo",
  updated: "Actualización simulada cada 2 segundos · Última actualización {time}",
  statusEyebrow: "Estado del espacio (simulado)",
  coldestLine:
    "Sonda más fría {coldest} · umbral {threshold} · exterior {outdoor}",
  riskNote:
    "En la app real, esto activaría tus alertas esenciales de helada (por correo electrónico por defecto), con la misma lógica que la tarjeta de estado del espacio de Overview.",
  readingsTitle: "Lecturas de las sondas en vivo",
  readingsSubtitle:
    "Cada tarjeta representa la etiqueta de un sensor que renombrarías en Devices tras el primer POST.",
  draftBadge: " corriente",
  statValue: "{primary}",
  statDetail: "{secondary} · {h} % de humedad",
  belowFreeze: " · bajo el umbral de helada",
  nearFreeze: " · cerca del umbral de helada",
  averageLabel: "Promedio · avg",
  comparisonTitle: "Comparación de sondas",
  comparisonOpen:
    "Con la puerta abierta, la barra de la puerta/entrada debería bajar frente a las demás. La línea discontinua es tu umbral de helada.",
  comparisonClosed:
    "Temperatura relativa por zona. La línea discontinua es tu umbral de helada. Abre la puerta para ampliar la diferencia.",
  barsAria: "Gráfico de barras que compara las temperaturas de las sondas",
  barThresholdTitle: "Helada {threshold}",
  barValue: "{primary}",
  thresholdNote: "Las marcas verticales indican el umbral de helada de {threshold} en cada barra.",
  jsonTitle: "Vista previa del feed JSON",
  jsonSubtitleHtml:
    "Push ingest es lo que los ESP/Arduino envían por POST a Devices. Pull agrupa las mismas sondas con nombre bajo <code>temp</code> para el JSON HTTPS programado.",
  jsonTabsAria: "Formato JSON",
  tabPush: "Push ingest",
  tabPull: "Pull feed",
  copy: "Copiar JSON",
  copied: "Copiado",
  copyFailed: "No se pudo copiar",
  convertTitle: "¿Lo quieres para tu garaje?",
  convertSubtitle:
    "Las mismas estructuras JSON y alertas esenciales de helada: unos 25 US$ en piezas (ESP32 + sonda impermeable), luego una cuenta gratuita, un POST y un umbral de helada antes de la próxima noche fría.",
  kitCta: "Kit antiheladas ESP32 (~25 US$)",
  createAccount: "Crear cuenta gratuita",
  allOptions: "Todas las opciones de dispositivos",
  signedIn: "¿Ya has iniciado sesión?",
  addPush: "Añadir un dispositivo push",
  essentials: "Alertas esenciales de helada + correo",
  presets: {
    mild: { label: "Día templado", hint: "Lecturas típicas con el espacio cerrado" },
    coldSnap: { label: "Ola de frío", hint: "Por debajo del umbral de helada en la sonda más fría" },
    doorDraft: {
      label: "Corriente en la puerta",
      hint: "La puerta abierta mete aire exterior en una zona: mira cómo baja la barra de la puerta/entrada frente a las demás",
    },
    sunny: { label: "Carga solar", hint: "La exposición del tejado / al oeste calienta la zona más cálida" },
  },
  spaces: {
    garage: {
      label: "Garaje",
      doorLabel: "Puerta del garaje abierta (mezcla aire exterior en la zona de la puerta)",
      modelHint:
        "Modelo equilibrado: el sol calienta el lado del banco de trabajo; una puerta de garaje abierta acerca la zona de la puerta a la temperatura exterior, mientras la pared del fondo queda protegida.",
      probeLabels: ["Pared norte", "Zona de la puerta", "Banco de trabajo"],
    },
    workshop: {
      label: "Taller",
      doorLabel: "Puerta del taller abierta (mezcla aire exterior en la zona de entrada)",
      modelHint:
        "Base algo más cálida que un garaje cerrado (calor de herramientas y personas). La zona de entrada recibe la corriente; el banco de herramientas sigue siendo el rincón cálido.",
      probeLabels: ["Pared exterior", "Zona de entrada", "Banco de herramientas"],
    },
    attic: {
      label: "Ático",
      doorLabel: "Trampilla abierta (mezcla aire climatizado en la zona de la trampilla)",
      modelHint:
        "Sensible al sol: la cumbrera y las vigas varían mucho con la carga térmica. Con la trampilla abierta, el aire más fresco de la casa solo entra en la zona de la trampilla.",
      probeLabels: ["Viga norte", "Zona de la trampilla", "Cumbrera"],
    },
    crawlspace: {
      label: "Cámara sanitaria",
      doorLabel: "Puerta de acceso abierta (mezcla aire exterior cerca de la entrada)",
      modelHint:
        "Poco afectada por el sol y con una base más fresca. Con el acceso abierto, el aire exterior llega a la sonda de entrada; las tuberías se mantienen más cerca de la temperatura del suelo.",
      probeLabels: ["Muro de cimentación", "Zona de acceso", "Tramo de tubería"],
    },
  },
  status: {
    freezeRiskTitle: "Riesgo de helada ahora mismo",
    freezeRiskDetail: "La sonda más fría marca {coldest}; umbral: {threshold}.",
    coldSnapTitle: "Se acerca una ola de frío",
    nightsTitleOne: "{n} noche con riesgo de helada",
    nightsTitleOther: "{n} noches con riesgo de helada",
    coldSnapDetail:
      "Las condiciones exteriores son frías: sigue la lista de comprobación y confirma que las alertas de previsión están activadas.",
    nightsDetail:
      "Las condiciones exteriores son frías: comprueba las sondas en Live y confirma que las alertas de previsión están activadas.",
    nearTitle: "Cerca del umbral de helada",
    nearDetail:
      "Sonda más fría {coldest}, a menos de 2,8 °C (5 °F) de {threshold}.",
    okTitle: "Todo en orden",
    okDetail: "Las sondas están enviando datos: nada en el umbral de helada y ningún contacto de inundación mojado.",
  },
};

export default es;

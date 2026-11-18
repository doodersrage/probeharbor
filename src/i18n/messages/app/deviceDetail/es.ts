import type { DeviceDetailMessages } from "./en";

const es: DeviceDetailMessages = {
  pushDevice: "Dispositivo push",
  pullFeed: "Feed de consulta",
  subtitleWithSpace: "{space} · {source}",
  allDevices: "← Todos los dispositivos",
  notices: {
    deviceSaved: "Dispositivo guardado.",
    sensorsSaved: "Sensores guardados.",
    sensorDeleted: "Sensor eliminado.",
    sensorAdded: "Sensor añadido.",
    sensorReplaced: {
      one: "Sensor reemplazado: se movió {count} lectura.",
      other: "Sensor reemplazado: se movieron {count} lecturas.",
    },
    saveError: "No se pudo guardar. Revisa el formulario e inténtalo de nuevo.",
  },
  replaceErrors: {
    same_sensor: "Elige dos sensores distintos.",
    kind_mismatch: "Los dos sensores deben ser del mismo tipo (temperatura con temperatura).",
    sensor_not_found: "Uno de esos sensores ya no está en esta propiedad.",
    failed: "No se pudo reemplazar el sensor. No se cambió nada.",
  },
  status: {
    title: "Estado",
    health: "Salud",
    healthHowSummary: "Cómo se calcula la puntuación",
    healthHow:
      "La puntuación muestra el problema más grave encontrado, revisado en este orden: desactivado (25) o nunca visto (30); un sensor de fuga mojado (10–20); sin envíos durante un día (20) o 2 horas (45); lecturas atascadas (40); batería al 15 % o menos (55) o con 14 días o menos previstos (60); Wi‑Fi en tu umbral de señal o por debajo (65). Sin nada de eso, está bien (95).",
    batteryHow:
      "Los días restantes suponen que la batería sigue bajando al ritmo de los últimos 7 días. Solo aparecen si bajó más de un 0,5 % al día durante al menos medio día.",
    lastSeen: "Última conexión",
    never: "Nunca",
    battery: "Batería",
    wifiSignal: "Señal Wi-Fi",
    firmware: "Firmware",
    updateTo: "Actualizar a {version}",
    tlsUnverified:
      "Esta sonda no puede verificar el certificado de ProbeHarbor, así que su conexión no está protegida contra manipulaciones. Las lecturas siguen llegando. Suele deberse a un cambio de la autoridad de certificación del sitio; una actualización de firmware lo soluciona.",
    lastCrash: "Último fallo",
    crashWhen: "Notificado {age}",
    crashIn: "Se detuvo en {fn}",
    crashAt: "Se detuvo en {addr}",
    crashCause: "Causa",
    crashTask: "Tarea",
    crashHelp:
      "La sonda se reinició después y siguió funcionando. Si vuelve a pasar, notifícalo con los detalles de abajo.",
    crashDetails: "Detalles para un informe de error",
    crashBuild: "Compilación que falló: {version} ({elf})",
    crashBuildUnknown: "Compilación que falló {elf}: sin nombres de funciones",
    crashStackNote:
      "En el ESP32-C3 son probables funciones llamantes encontradas en la pila, no una cadena de llamadas exacta.",
    crashWatchdog: "Reiniciada por el watchdog: la sonda dejó de responder",
    crashWatchdogNote:
      "El watchdog reinicia la sonda cuando su bucle principal se detiene durante un minuto. Las direcciones de abajo muestran dónde estaba el chip cuando saltó el watchdog (normalmente la tarea inactiva), no el código que se detuvo.",
    crashReport: "Notificarlo en GitHub",
    state: "Estado",
    disabled: "Desactivado: se ignoran las lecturas",
    noReadingsYet:
      "Aún no hay lecturas. Configura el dispositivo con su URL de ingesta (consulta Conexión más abajo); los sensores aparecen con la primera subida.",
  },
  chart: {
    title: "Últimas 24 horas",
    fullHistory: "Historial completo",
    empty: "No hay lecturas de temperatura ni humedad en las últimas 24 horas.",
    error: "No se pudo cargar el gráfico. Puede que el historial completo sí funcione.",
  },
  phoneSetup: {
    title: "Configurar desde el teléfono",
    intro:
      "Para una sonda que muestra su red ProbeHarbor-Setup (nueva, o tras mantener BOOT 5 segundos). Escanea con la cámara del teléfono.",
    copyKey: "Abre esta página en el teléfono, muestra la clave del dispositivo y toca Copiar.",
    joinNetworkCode:
      "Conéctate a la red {network} de la sonda. Se abre su página de configuración: elige tu Wi-Fi, escribe el código de emparejamiento donde pide la clave del dispositivo y Guarda.",
    joinNetwork:
      "Conéctate a la red {network} de la sonda. Se abre su página de configuración: elige tu Wi-Fi, pega la clave y Guarda.",
    hint: "Si no se abre la página, visita 192.168.4.1. La sonda cierra su red tras 3 minutos sin uso; reiníciala para volver a intentarlo.",
  },
  pairing: {
    button: "Emparejar una sonda",
    newCode: "Código nuevo",
    making: "Creando un código…",
    hint: "Escribe este código donde la sonda pide su clave de dispositivo: en su página de configuración (teléfono) o en /flash. Sirve una sola vez.",
    validUntil: "Válido hasta las {time}",
    expired: "Este código ha caducado. Crea uno nuevo.",
    error: "No se pudo crear un código. Inténtalo de nuevo.",
    phoneStep: "Toca Emparejar una sonda arriba y ten el código a la vista.",
    waiting: "Esperando a que la sonda lo use…",
    paired: "Emparejada ✓ con {chip} a las {time}",
    pairedHint:
      "La sonda ya usa su nueva clave; su próxima lectura aparecerá aquí en menos de un minuto.",
    replaced: "Un código más nuevo sustituyó a este.",
  },
  healthLabels: {
    healthy: "Bien",
    watch: "Vigilar",
    at_risk: "En riesgo",
    offline: "Sin conexión",
  },
  healthDetails: {
    disabled: "Dispositivo desactivado",
    waiting: "Esperando la primera lectura",
    floodWet: "Contacto de inundación / fuga mojado",
    noData: {
      one: "Sin datos desde hace {count} día, revisa la alimentación/Wi‑Fi",
      other: "Sin datos desde hace {count} días, revisa la alimentación/Wi‑Fi",
    },
    stale: "Datos de la sonda desactualizados, revisa la alimentación/Wi‑Fi",
    batteryLow: "Batería al {pct} %: cámbiala pronto",
    batteryDays: "Batería: quedan ~{days} días",
    weakRssi: "RSSI débil ({rssi} dBm)",
    healthy: "Informando, contactos de inundación secos",
  },
  batteryEta: {
    replaceSoon: "Cámbiala pronto",
    days: "~{count} días",
    weeks: "~{count} sem.",
  },
  sensors: {
    title: "Sensores ({count})",
    noneYetPush:
      "Aún ninguno: se añaden automáticamente a partir de las claves JSON de la primera subida.",
    noneYetPull: "Aún ninguno: aparecen tras la próxima consulta del feed.",
    intro: "Ponles el nombre de lo que miden. Un solo Guardar sirve para todos los sensores.",
    name: "Nombre",
    latest: "Última",
    type: "Tipo",
    showOnHome: "Mostrar en Inicio",
    moreJsonKey: "Más: clave JSON",
    offsetSummary: " · ajuste {offset}",
    jsonKey: "Clave JSON",
    unit: "Unidad",
    unitPlaceholder: "Predeterminada del tipo",
    offset: "Ajuste de calibración",
    offsetHint: "Se suma a cada lectura. Las lecturas originales no cambian.",
    offsetHintFahrenheit: "Los ajustes de temperatura van en °F: 1 °C equivale a 1,8 °F.",
    deleteConfirm: "¿Eliminar el sensor «{name}» y su historial?",
    deleteSensor: "Eliminar sensor",
    saveSensors: "Guardar sensores",
    addByHand: "Añadir un sensor manualmente",
    addHint:
      "Solo hace falta para ponerle nombre antes de la primera subida; si no, las claves se añaden automáticamente.",
    addLabelPlaceholder: "Tubería del garaje",
    addSensor: "Añadir sensor",
  },
  kinds: {
    temperature: "Temperatura",
    humidity: "Humedad",
    co2: "CO₂",
    pressure: "Presión barométrica",
    pm25: "PM2.5",
    voc: "COV",
    level: "Nivel de agua / sumidero",
    energy: "Energía",
    door: "Puerta",
    power: "Alimentación",
    flood: "Inundación / fuga",
    motion: "Movimiento",
    generic: "Genérico",
  },
  boolValues: {
    open: "Abierta",
    closed: "Cerrada",
    on: "Encendido",
    off: "Apagado",
    wet: "Mojado",
    dry: "Seco",
    detected: "Detectado",
    clear: "Sin movimiento",
  },
  settings: {
    title: "Ajustes",
    name: "Nombre",
    pullFeedHtml:
      'El nombre y el encendido/apagado de este feed están en <a class="text-link" href="/dashboard/devices?view=setup&amp;tab=pull">Feeds de consulta</a>.',
    space: "Espacio",
    spacePlaceholder: "Garaje, ático, sótano…",
    spaceHint: "Dónde está. Se usa para la cobertura de protección y el texto de las alertas.",
    enabled: "Activado (sin marcar: se ignoran las subidas y no generará alertas)",
    save: "Guardar",
  },
  connection: {
    title: "Conexión",
    sendsJsonHtml:
      "El dispositivo envía JSON a <code>{url}</code>. Su clave empieza por <code>{prefix}</code>.",
    checkPayload: "Comprobar un payload",
    browserFlasher: "Flasheador en el navegador",
    ingestDocs: "Documentación de ingesta",
    accepted: {
      one: "Últimos 7 días: {count} subida aceptada",
      other: "Últimos 7 días: {count} subidas aceptadas",
    },
    rejected: ", {count} rechazadas",
    end: ".",
  },
  maintenance: {
    title: "Mantenimiento",
    downloadDiagnostics: "Descargar diagnóstico",
    historyChart: "Gráfico del historial",
    diagnosticsHint:
      "El diagnóstico es un archivo JSON anonimizado que puedes adjuntar a un informe de error o a un correo de soporte.",
    moveTo: "Mover a otra propiedad",
    moveDevice: "Mover dispositivo",
  },
  danger: {
    title: "Clave y eliminación",
    rotateTitle: "Renovar la clave de ingesta",
    rotateBody:
      "Genera una clave nueva. La anterior deja de funcionar al instante; vuelve a flashear o actualiza el dispositivo.",
    rotateConfirm:
      "¿Renovar esta clave de ingesta? La clave anterior deja de funcionar de inmediato.",
    rotateButton: "Renovar clave",
    deleteTitle: "Eliminar dispositivo",
    deleteBody: "Lo elimina junto con sus sensores y su historial. No se puede deshacer.",
    deleteConfirm: "¿Eliminar «{name}», sus sensores y su historial?",
    deleteButton: "Eliminar dispositivo",
  },
  replace: {
    summary: "Reemplazar un sensor…",
    title: "Reemplazar un sensor",
    intro:
      "¿Cambiaste una sonda averiada o una placa entera? Cuando el sensor nuevo haya enviado una lectura, pásale el historial del antiguo para que los gráficos, informes y alertas continúen como un solo sensor.",
    confirm:
      "¿Mover todo el historial del sensor antiguo al nuevo y eliminar el antiguo? No se puede deshacer.",
    oldSensor: "Sensor antiguo (retirado)",
    newSensor: "Sensor nuevo",
    choose: "Elige…",
    bullets: [
      "El sensor nuevo toma el nombre del antiguo, así que las reglas que buscan por nombre siguen funcionando.",
      "Los umbrales por sensor, la referencia interior y el historial de la puerta pasan al nuevo.",
      "Cada sonda conserva su propio ajuste de calibración; las lecturas antiguas se corrigen para que los gráficos pasados se vean exactamente igual.",
      "El sensor antiguo se elimina. Si vuelve a enviar datos, reaparece como un sensor nuevo y vacío.",
    ],
    button: "Reemplazar sensor",
  },
};

export default es;

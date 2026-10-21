import type { DeviceSetupPushMessages } from "./en";

const es: DeviceSetupPushMessages = {
  title: "Añadir un dispositivo push",
  subtitleHtml:
    'ESP32, Pico W, ESPHome, Home Assistant o cualquier cosa que pueda enviar JSON por POST. Recibes una URL de ingesta; los sensores se añaden automáticamente con el primer envío. Límite: {max} dispositivos por propiedad ({tier}). Consulta la <a class="text-link" href="/about/ingest-and-webhooks">documentación de ingesta</a> · <a class="text-link" href="/docs/api">referencia rápida de la API</a>.',
  vaultOffHtml:
    "La recuperación de la clave de ingesta (Mostrar) no está activada en esta instalación. Copia la clave del aviso de 30 minutos al crear un dispositivo o al pulsar <strong>Rotar clave</strong> en su tarjeta: después no habrá nada que descifrar.",
  atLimitHtml:
    'Has alcanzado tu límite de dispositivos push. <a class="text-link" href="/dashboard/plans">Mejora tu plan</a> para añadir más o elimina un dispositivo de abajo.',
  name: "Nombre",
  namePlaceholder: "Sonda de tubería del garaje",
  space: "Espacio",
  spacePlaceholder: "Garaje",
  createDevice: "Crear dispositivo",
  commonSpacesLabel: "Espacios habituales",
  commonSpaces: [
    "Garaje",
    "Ático",
    "Sótano técnico",
    "Sótano",
    "Taller",
    "Cuarto de servicio",
    "Cobertizo",
  ],
  firstRunHtml:
    'Usa <a class="text-link" href="#devices-first-run">Conecta tu primer sensor</a> arriba para elegir un camino.',
  viewOnly:
    "Acceso de solo lectura: la creación de dispositivos está desactivada.",
  otherDevicesHtml: {
    one: 'Tienes {count} dispositivo más en la pestaña <a class="text-link" href="/dashboard/devices?view=ops">Dispositivos</a>.',
    other:
      'Tienes {count} dispositivos más en la pestaña <a class="text-link" href="/dashboard/devices?view=ops">Dispositivos</a>.',
  },
  keyPrefix: "prefijo de clave {prefix}…",
  neverSeen: "nunca visto",
  freshness: {
    offline: "Sin conexión · visto por última vez {age}",
    lagging: "Puede estar sin conexión · visto por última vez {age}",
    updated: "Actualizado {age}",
  },
  firmware: "firmware {version}",
  updateTo: "Actualizar a {version}",
  labelsFine: "Las etiquetas están bien así.",
  renameLater: "Renombrar más tarde",
  noPostsYet:
    "Aún no hay envíos: el primer POST de JSON importa automáticamente las claves de los sensores.",
  waitingKeys: "Esperando el primer POST con las claves",
  seeChecklist: "Ver lista de comprobación",
  manage: "Gestionar",
  openDevice: "Abrir página del dispositivo →",
  rename: "Renombrar",
  spaceExamplePlaceholder: "garaje, ático, sótano…",
  saveSpace: "Guardar espacio",
  rotateConfirm:
    "¿Rotar esta clave de ingesta? La clave anterior deja de funcionar de inmediato.",
  rotateKey: "Rotar clave",
  moveTo: "Mover a",
  transferDevice: "Transferir dispositivo",
  deleteConfirm: "¿Eliminar este dispositivo push y sus sensores?",
  delete: "Eliminar",
  noSensorsYet:
    "Aún no hay sensores: aparecerán automáticamente tras tu primer POST. Usa Avanzado solo si necesitas asignar claves de antemano.",
  sensorsList: "Sensores: {list}.",
  editSensors: "Editar sensores, tipos y calibración →",
  advancedSummary: "Avanzado: asignar claves JSON a mano",
  advancedHint:
    "Opcional: omítelo si ya envías JSON por POST y dejas que la importación automática gestione las claves.",
  quickPairTitle: "Añadido rápido: par de temperatura + humedad",
  quickPairHintHtml:
    "La misma clave JSON para ambos (p. ej. <code>0</code> o <code>temp1</code>): la sonda típica tipo DHT.",
  device: "Dispositivo",
  jsonKey: "Clave JSON",
  nameOnHome: "Nombre en Inicio",
  pairLabelDefault: "Taller",
  addPair: "Añadir par",
  orAddOne: "O añade un sensor",
  sensorLabelPlaceholder: "Puerta del taller",
  type: "Tipo",
  addSensor: "Añadir sensor",
  kindLabels: {
    temperature: "Temperatura",
    humidity: "Humedad",
    co2: "CO₂",
    pressure: "Presión barométrica",
    pm25: "PM2.5",
    voc: "COV",
    level: "Nivel de agua / sumidero",
    energy: "Energía",
    door: "Puerta",
    power: "Corriente",
    flood: "Inundación / fuga",
    motion: "Movimiento",
    generic: "Genérico",
  },
  client: {
    suggestedName: "Sonda de {space}",
  },
  inlineRename: {
    renameImported: "Renombrar sensores importados",
    quickRename: "Renombrado rápido",
    acceptSuggested: "Aceptar sugerencias",
    saving: "Guardando…",
    saveNames: "Guardar nombres",
    couldNotSave: "No se pudo guardar.",
    saved: "Guardado.",
  },
  revealKey: {
    loading: "Cargando…",
    keyShown: "Clave mostrada abajo",
    reveal: "Mostrar clave de ingesta",
    srKeyFor: "Clave de ingesta de {name}: ",
    copied: "Copiada",
    copyKey: "Copiar clave",
    errorDisabled:
      "No se pudo mostrar la clave. Si la recuperación está desactivada en este servidor, usa Rotar clave en la tarjeta del dispositivo.",
    errorNetwork:
      "No se pudo mostrar la clave. Si la recuperación está desactivada, usa Rotar clave en la tarjeta del dispositivo para obtener una nueva URL de ingesta.",
    errorCopy: "No se pudo copiar al portapapeles.",
  },
};

export default es;

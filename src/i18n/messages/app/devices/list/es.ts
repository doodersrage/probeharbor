import type { DevicesListMessages } from "./en";

const es: DevicesListMessages = {
  list: {
    title: "Dispositivos ({count})",
    subtitle: "Del peor al mejor. Abre un dispositivo para cambiarle el nombre, asignarle un espacio o arreglar sus sensores.",
    addDevice: "Añadir dispositivo",
    warmHint:
      "marca {gap}°F más que tus otras sondas. Si ese sensor está pegado a su placa, aléjalo unos centímetros con sus cables: las placas ESP32 se calientan y falsean la lectura.",
    unplaced: {
      one: "{count} dispositivo no tiene espacio asignado, así que la cobertura y las alertas no pueden decir dónde está.",
      other: "{count} dispositivos no tienen espacio asignado, así que la cobertura y las alertas no pueden decir dónde están.",
    },
    unplacedBulk: "Usa Seleccionar varios abajo para asignar un lote de una vez.",
    unplacedSingle: "Ábrelo para asignarle uno.",
    empty: "Aún no hay dispositivos.",
    emptyLink: "Conecta tu primer sensor",
    noSpace: "Sin espacio",
    push: "Push",
    pullFeed: "Feed de consulta",
    disabled: "Desactivado",
    health: {
      healthy: "Bien",
      watch: "Vigilar",
      at_risk: "En riesgo",
      offline: "Sin conexión",
    },
    noReading: "Sin lectura",
    firmwareUpdate: "Actualización de firmware disponible",
    never: "Nunca",
    battery: "{pct} % de batería",
  },
  bulk: {
    summary: "Seleccionar varios…",
    doThis: "Acción",
    ops: {
      set_space: "Asignar espacio",
      enable: "Activar",
      disable: "Desactivar",
      delete: "Eliminar",
    },
    space: "Espacio",
    spacePlaceholder: "Garaje",
    apply: "Aplicar a los seleccionados",
    selectAll: "Seleccionar todos",
    selectUnplaced: "Seleccionar los que no tienen espacio",
    selectSilent: "Seleccionar {count} sin datos desde hace 30+ días",
    noSpace: "sin espacio",
    disabled: "desactivado",
    confirmDelete: {
      one: "¿Eliminar {count} dispositivo? Esta acción no se puede deshacer.",
      other: "¿Eliminar {count} dispositivos? Esta acción no se puede deshacer.",
    },
  },
  coverage: {
    title: "Cobertura de protección",
    subtitle: "Qué se vigila en cada espacio, según los sensores de sus dispositivos.",
    noGaps: "No se encontraron huecos.",
    gapCount: "{gaps} de {total} espacios tienen un hueco.",
    caption: "Cobertura de monitorización por espacio",
    spaceColumn: "Espacio",
    risks: {
      freeze: "Temperatura",
      leak: "Fuga",
      door: "Puerta",
      power: "Corriente",
    },
    states: {
      live: "reportando",
      stale: "sin reportar",
      none: "sin monitorizar",
    },
    devices: { one: "{count} dispositivo", other: "{count} dispositivos" },
    legend:
      "✓ reportando · ! el sensor existe pero no ha reportado recientemente · — sin monitorizar. Los espacios salen del ajuste de espacio de cada dispositivo.",
    unassigned: "Sin espacio asignado",
    gaps: {
      unassigned: "Asigna un espacio a estos dispositivos para seguir la cobertura por habitación.",
      noTemperature: "No hay sonda de temperatura: las alertas de congelación no pueden cubrir este espacio.",
      staleTemperature: "La sonda de temperatura no ha reportado recientemente, así que las alertas de congelación no pueden saltar aquí.",
      staleLeak: "El sensor de fugas no ha reportado recientemente.",
      noLeakWetSpace: "No hay sensor de fugas aquí, y este tipo de espacio suele tener tuberías.",
      staleDoor: "El sensor de puerta no ha reportado recientemente.",
      stalePower: "El sensor de corriente no ha reportado recientemente.",
    },
  },
};

export default es;

import type { DeviceSetupPullMessages } from "./en";

const es: DeviceSetupPullMessages = {
  title: "Feeds JSON de consulta",
  subtitle:
    "JSON por HTTPS que consultamos de forma periódica. Las claves de las sondas se importan solas al guardar: cámbiales el nombre abajo si hace falta.",
  exampleSummary: "¿Aún no tienes un feed propio? Prueba el feed de ejemplo",
  viewOnly:
    "Acceso de solo lectura: los ajustes de feeds y sondas están ocultos.",
  feeds: {
    heading: "URL de los feeds",
    introHtml:
      'Endpoints JSON por HTTPS que consultamos de forma periódica. Los objetos de sonda están bajo una clave raíz (por defecto <code>temp</code>). <a class="text-link" href="/about/json-probe-output-schema">documentación del esquema</a>.',
    selectAll: "Seleccionar todo",
    enable: "Activar",
    disable: "Desactivar",
    deleteSelected: "Eliminar seleccionados",
    selectFeed: "Seleccionar {name}",
    name: "Nombre",
    namePlaceholder: "Taller",
    url: "URL HTTPS",
    jsonRoot: "Clave raíz JSON",
    jsonRootTitle:
      "Una letra o guion bajo, seguido de letras, números o guiones bajos",
    jsonRootHintHtml:
      "Objeto que contiene las claves de las sondas (normalmente <code>temp</code>).",
    enabled: "Activado",
    delete: "Eliminar",
    deleteConfirm: "¿Eliminar este feed?",
    addFeed: "Añadir un feed de consulta",
  },
  client: {
    bulkDeleteConfirm: {
      one: "¿Eliminar {count} feed? No se puede deshacer.",
      other: "¿Eliminar {count} feeds? No se puede deshacer.",
    },
  },
  feedTest: {
    enterUrl: "Primero introduce la URL de un feed.",
    ok: "Feed correcto",
    failed: "La prueba del feed falló",
    unable: "No se pudo probar el feed.",
    testing: "Probando…",
    test: "Probar URL del feed",
  },
  probeMapper: {
    importedAuto:
      "Claves de sonda importadas desde tu feed: cámbiales el nombre abajo y guarda.",
    enterUrl: "Primero introduce la URL de un feed.",
    noProbes: "No se encontraron sondas en el feed.",
    imported: {
      one: "{count} sonda importada. Cámbiale el nombre abajo y guarda.",
      other: "{count} sondas importadas. Cámbiales el nombre abajo y guarda.",
    },
    unableRead: "No se pudo leer el feed.",
    appliedSuggested: "Nombres sugeridos aplicados: edítalos abajo y guarda.",
    hiddenAvg:
      'Sondas "avg" ocultas en Inicio: guarda la configuración para conservarlo.',
    saveFailed: "No se pudo guardar la configuración de consulta.",
    unableSave: "No se pudo guardar la configuración de consulta.",
    saveFeedFirst:
      "Guarda primero la URL de un feed y luego detecta aquí las claves de las sondas.",
    heading: "Nombres de las sondas",
    intro:
      "Detecta las sondas en el JSON de tu feed y luego ponles nombre para Inicio. Las claves siguen ligadas al feed; solo editas los nombres visibles.",
    readingFeed: "Leyendo el feed…",
    discover: "Detectar en el feed",
    feed: "Feed",
    jsonKey: "Clave JSON",
    nameOnHome: "Nombre en Inicio",
    showOnHome: "Mostrar en Inicio",
    remove: "Quitar",
    importing: "Leyendo el feed e importando las claves de las sondas…",
    emptyHint:
      "Guarda la URL de un feed para importar las claves automáticamente, o pulsa Detectar en el feed.",
    savePullSetup: "Guardar configuración",
    acceptSuggested: "Aceptar nombres sugeridos",
    hideAvg: "Ocultar avg en Inicio",
  },
  saveBar: {
    saveFailed: "No se pudo guardar.",
    enterUrl: "Primero introduce la URL de un feed.",
    saving: "Guardando…",
    save: "Guardar configuración",
    hintWithFeeds:
      "Los cambios en URL o nombres de sondas no se guardan hasta que pulses Guardar configuración.",
    hintNoFeeds:
      "Añade la URL de un feed y guarda para importar automáticamente las claves de las sondas.",
  },
  fetch: {
    fetching: "Consultando…",
    fetchFailed: "La consulta falló.",
    errorPrefix: "Error: {message}",
    notFetched: "Sin consultar",
    complete:
      "Consulta completada: actualiza Inicio para ver las nuevas lecturas.",
    couldNotFetch: "No se pudieron consultar los feeds.",
    rowFailed: "La consulta falló",
    fetchNow: "Consultar ahora",
    hint: "Obtén las lecturas ya, sin esperar a la próxima consulta programada.",
  },
  demo: {
    button: "Probar feed de demostración",
    buttonFirstRun: "Pruébalo con un feed de demostración",
    settingUp: "Configurando…",
    hint: "JSON meteorológico en directo, sin hardware.",
    couldNotSave: "No se pudo guardar el feed de ejemplo.",
  },
};

export default es;

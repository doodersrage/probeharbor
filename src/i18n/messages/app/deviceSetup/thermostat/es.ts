import type { DeviceSetupThermostatMessages } from "./en";

const es: DeviceSetupThermostatMessages = {
  indoor: {
    title: "Referencia interior",
    introHtml:
      "Elige una sonda de temperatura que represente el aire interior de la <strong>casa</strong> cuando no tengas Nest conectado, por ejemplo un ESP32 en el pasillo o una lectura enviada desde Home Assistant (Ecobee, Honeywell, etc.). Los gráficos de Resumen e Historial la usan como contexto casa–sonda.",
    saved: "Referencia interior guardada.",
    sensorLabel: "Sensor de referencia",
    noneOption: "Ninguno, usar solo el termostato",
    optionLabel: "{label} ({device})",
    save: "Guardar",
    configured:
      "Este hogar tiene configurada una sonda de referencia interior.",
    notSelected: "No hay ninguna referencia interior seleccionada.",
    noOptionsHtml:
      'Primero añade un sensor de temperatura, por ejemplo enviando desde Home Assistant con <code class="text-xs">thermaltrace.push</code> o un ESP en el pasillo. Consulta la <a class="text-link" href="/integrations/home-assistant#indoor-temperature">guía de temperatura interior de HA</a>.',
  },
  thermostat: {
    title: "Termostato",
    intro:
      "Conecta el termostato de tu casa para ver su lectura y su consigna junto a esta sonda, y añadir ese contexto a las alertas de congelación.",
    connected: "{provider} conectado.",
    disconnected: "{provider} desconectado.",
    errors: {
      state_mismatch: "Ese intento de conexión caducó: inténtalo de nuevo.",
      denied: "Se canceló la conexión.",
      not_configured:
        "Este proveedor aún no está configurado en esta instalación.",
      exchange_failed: "No se pudo completar la conexión: inténtalo de nuevo.",
      save_failed:
        "Conectado, pero no se pudo guardar la conexión: inténtalo de nuevo.",
      generic: "Algo salió mal al conectar tu termostato.",
    },
    sdmDisabledHtml:
      "Nest está conectado, pero la <strong>Smart Device Management API</strong> no está habilitada en tu proyecto de Google Cloud. Habilítala en APIs y servicios, espera un minuto y vuelve a cargar esta página.",
    enableSdm: "Habilitar la SDM API",
    readingUnavailable: "Lectura no disponible",
    setTo: ", consigna {temp}",
    modes: {
      heat: "Calefacción",
      cool: "Refrigeración",
      heatcool: "Calefacción/refrigeración",
      off: "Apagado",
      auto: "Automático",
      auxheatonly: "Solo calefacción auxiliar",
    },
    noLiveReading:
      "Conectado, pero ahora mismo no se pudo obtener una lectura en directo.",
    notConnected: "No conectado",
    ecobeeClosedHtml:
      'El registro de desarrolladores de Ecobee está cerrado: usa <a class="text-link" href="/integrations/home-assistant#indoor-temperature">Home Assistant</a> para enviar la temperatura interior y luego elígela en <a class="text-link" href="#indoor-reference">Referencia interior</a> arriba.',
    disconnect: "Desconectar",
    connect: "Conectar",
    unavailable: "No disponible",
    ownerOnly: "Solo propietario/miembro",
  },
};

export default es;

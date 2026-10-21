
/** /about/temperature-changes body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

const es: Messages = {
  introHtml:
    "La temperatura en los espacios sin calefacción casi nunca está quieta. Sube cuando el sol da en el tejado, baja cuando pasa un frente frío y se dispara en cuanto se abre un portón. Entender qué provoca esos cambios te ayuda a interpretar las lecturas de las sondas en lugar de tomar cada oscilación por una avería.",
  dailyTitle: "Patrones diarios",
  dailyHtml:
    "Incluso sin climatización, la mayoría de estos espacios siguen un ritmo diario. Por la noche, la estructura irradia calor hacia el cielo y el aire interior se enfría. El sol de la mañana calienta primero la cubierta, y ese calor se transmite hacia abajo durante las horas siguientes. Una sonda en una pared este puede alcanzar su máximo antes del mediodía, mientras que un sensor en una pared oeste lo hace cerca del atardecer. La humedad suele subir cuando el aire cálido se enfría sobre una losa de hormigón fría.",
  seasonalTitle: "Cambios estacionales",
  seasonalHtml:
    "El invierno trae periodos más largos de frío acumulado: la losa, la estructura y lo que hay dentro actúan como masa térmica que se resiste a recuperarse rápido. El verano invierte el problema: el calor del ático y la radiación del tejado pueden subir el aire interior por encima de la temperatura exterior si la ventilación o el aislamiento no lo impiden. Con datos históricos, la comparación estacional salta a la vista: la misma sonda cuenta dos historias distintas en enero y en julio.",
  suddenTitle: "Qué provoca los cambios bruscos",
  sudden: [
    "<strong>Uso de las puertas:</strong> un solo portón abierto puede renovar gran parte del aire en minutos.",
    "<strong>Entrada de vehículos:</strong> motores calientes, neumáticos mojados y nieve derretida aportan picos de calor y humedad.",
    "<strong>Frentes meteorológicos:</strong> las caídas rápidas en el exterior arrastran hacia abajo el aire de espacios anexos o semiclimatizados con un retraso de una a tres horas.",
    "<strong>Claros tras las nubes:</strong> la superficie del tejado puede subir muchos grados en menos de una hora.",
    "<strong>Equipos en marcha:</strong> compresores, secadoras y estufas crean puntos calientes localizados.",
  ],
  massTitle: "Masa térmica y retraso",
  massHtml:
    "Los suelos de hormigón y los muros de obra almacenan energía. Por eso la temperatura de la sonda suele alcanzar su máximo horas después del máximo exterior. También explica la lenta recuperación tras una ola de frío: el interior puede seguir bajo cero aunque por la tarde el aire exterior esté por encima de 0 °C (32 °F). Al revisar los gráficos, compara las tendencias de las sondas con el bloque del tiempo exterior de la página principal para separar los efectos del edificio de la meteorología.",
  humidityTitle: "La humedad no se mueve igual que la temperatura",
  humidityHtml:
    "La humedad relativa sube cuando el aire se enfría sin perder humedad: algo habitual cuando un día templado da paso a una noche despejada sobre una losa fría. Las fuentes de humedad absoluta (lluvia en los coches, nieve derretida, fugas) pueden disparar la humedad sin apenas cambio de temperatura. Observar ambos valores juntos evita conclusiones erróneas: un día de «frío seco» en el exterior puede notarse húmedo dentro.",
  decisionsTitle: "Usar los cambios para decidir",
  decisionsHtml:
    'Las oscilaciones a corto plazo apuntan a la ventilación o a cómo usas las puertas. Las tendencias de varios días apuntan a trabajos de aislamiento o deshumidificación. El historial guardado en la página de <a class="text-link" href="/dashboard/history">historial de lecturas</a> convierte esos patrones en pruebas para el presupuesto de mantenimiento. Para saber cómo se guardan y exportan las instantáneas, consulta <a class="text-link" href="/about/historical-data">uso de los datos históricos de temperatura</a>.',
};

export default es;

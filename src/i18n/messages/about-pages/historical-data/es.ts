
/** /about/historical-data body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

const es: Messages = {
  introHtml:
    "Las lecturas en vivo responden a «¿qué está pasando ahora?». Los datos históricos responden a «¿qué suele pasar aquí?». ProbeHarbor guarda las lecturas de los sensores procedentes de ingesta push y de feeds pull, recogidas <strong>cada 15 minutos</strong> (y cada vez que actualizas Live).",
  whyTitle: "Para qué guardar historial",
  whyHtml:
    "Las comprobaciones puntuales se olvidan fácilmente. Un registro con fecha y hora revela las mínimas nocturnas de una semana fría, el lento aumento de la humedad tras una gotera en el tejado o el primer día de primavera en que el interior se mantiene por encima de 0 °C (32 °F). Ese contexto sirve para documentar ante el seguro, ajustar la climatización y decidir si las mejoras de aislamiento valieron la pena.",
  storedTitle: "Qué se guarda",
  storedHtml:
    "Cada fila guardada incluye la temperatura en Fahrenheit y Celsius, el porcentaje de humedad, la marca de tiempo, el nombre del feed, la etiqueta de la sonda y su clave. Varias sondas en una misma carga generan varias filas, y el promedio configurado sigue ofreciendo un resumen rápido. Los datos están asociados a tu cuenta, así que los visitantes no escriben en la tabla de historial compartida.",
  browseTitle: "Navegar por el historial paginado",
  browseHtml:
    "La vista de historial del panel muestra las instantáneas recientes con columnas de feed y sonda para que puedas filtrar mentalmente por zona. La paginación mantiene ágiles los conjuntos de datos grandes. Cuando necesitas el registro completo fuera del sitio, la exportación CSV descarga todas las lecturas guardadas de tu cuenta: disponible para administradores y suscriptores activos.",
  csvTitle: "Usos de la exportación CSV",
  csvItems: [
    "Impórtala en hojas de cálculo para tablas dinámicas y gráficos a medida.",
    "Crúzala con facturas de suministros o archivos meteorológicos para estudios de correlación.",
    "Comparte extractos anonimizados con profesionales al diagnosticar problemas de aislamiento.",
    "Archiva un fichero por año como registro a largo plazo de la propiedad.",
  ],
  analysisTitle: "Ideas de análisis",
  analysisHtml:
    "Grafica la temperatura mínima diaria durante diciembre para ver con qué frecuencia te acercas al riesgo de congelación de tuberías. Compara la humedad media antes y después de instalar un deshumidificador. Superpón la sonda <code>0</code> con la <code>1</code> para cuantificar las diferencias entre paredes. Como las claves de los feeds JSON son estables, los scripts que escribas hoy seguirán funcionando aunque cambies las etiquetas en el panel.",
  yoyTitle: "Comparaciones interanuales",
  yoyHtml:
    "<strong>Overview</strong> muestra <em>This week vs last year</em> (esta semana frente al año pasado) cuando tienes datos de sondas del mismo periodo de hace un año. En <strong>History</strong> (Pro, más de 365 días de conservación), activa <strong>Compare to last year</strong> para ver una superposición gris en el gráfico. Si todavía no tienes datos locales del año pasado, ProbeHarbor puede mostrar una <strong>estimación exterior</strong> de Open-Meteo para la ubicación de tu tiempo o de tu mapa de heladas: claramente etiquetada y sin sustituir el historial de tus sondas.",
  limitsTitle: "Límites y buenas prácticas",
  limitsHtml:
    "La profundidad del historial depende de tu plan (Free, Member o Pro). Para análisis forenses minuto a minuto, añade un registrador dedicado en local. Trata este almacén como un diario práctico vinculado a tu cuenta, no como un instrumento de laboratorio.",
  outroHtml:
    'Los detalles de la suscripción para la exportación CSV se explican en <a class="text-link" href="/about/accounts-and-dashboard">herramientas de cuenta y panel</a>.',
};

export default es;

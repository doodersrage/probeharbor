import type { RuleCheckMessages } from "./en";

const es: RuleCheckMessages = {
  run: "Comprobar ahora las reglas guardadas",
  hint: "Usa las lecturas más recientes y tus reglas guardadas (guarda primero). No envía nada.",
  client: {
    disabled: "Desactivada: esta regla está desactivada.",
    noConditions: "No tiene condiciones, así que nunca se activa.",
    noneTrue: "No se activaría: ninguna de sus condiciones se cumple.",
    notAllTrue: "No se activaría: al menos una condición no se cumple.",
    alertsOff: "Se cumple, pero las alertas están desactivadas, así que no se enviaría nada.",
    cooldown: "Se cumple, pero hace poco salió una alerta de regla; la siguiente podrá enviarse después de las {time}.",
    fires: "Se cumple: la próxima comprobación de alertas (cada pocos minutos) la enviaría, salvo que las alertas estén pospuestas o sean horas de silencio.",
    checking: "Comprobando…",
    noRules: "Aún no hay reglas guardadas. Añade una arriba y guarda.",
    checkedAt: "Comprobado a las {time}.",
    untitled: "Regla sin nombre",
    or: "O ",
    and: "Y ",
    failed: "No se pudieron comprobar las reglas ahora. Inténtalo de nuevo en un minuto.",
    conditions: {},
  },
};

export default es;

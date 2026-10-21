import type { StatusEmailMessages } from "./en";

const es: StatusEmailMessages = {
  confirm: {
    subject: "Confirma tu suscripción al estado de ProbeHarbor",
    eyebrow: "Actualizaciones de estado",
    title: "Confirma tu suscripción",
    intro: "Haz clic abajo para recibir un correo cada vez que cambie el estado del sistema de ProbeHarbor.",
    body: "Si no lo solicitaste, puedes ignorar este mensaje: no quedarás suscrito a menos que confirmes.",
    cta: "Confirmar suscripción",
    footerNote:
      "Recibes este correo porque alguien introdujo esta dirección en la página de estado de ProbeHarbor. Al confirmar, solo te suscribes a los correos sobre cambios de estado.",
  },
  change: {
    eyebrow: "Actualización de estado",
    subjectHealthy: "ProbeHarbor: todo vuelve a la normalidad",
    subjectDegraded: "ProbeHarbor: servicio degradado",
    titleHealthy: "ProbeHarbor vuelve a funcionar con normalidad",
    titleDegraded: "ProbeHarbor funciona de forma degradada",
    introHealthy: "Las tareas programadas y la supervisión de la ingesta vuelven a estar en buen estado.",
    introDegraded: "Estamos viendo fallos en tareas o ejecuciones programadas que no se realizaron. Lo estamos investigando.",
    cta: "Ver el estado del sistema",
    unsubscribe: "Darse de baja de las actualizaciones de estado",
    footerNote: "Recibes este correo porque te suscribiste a las actualizaciones de estado de ProbeHarbor.",
  },
};

export default es;

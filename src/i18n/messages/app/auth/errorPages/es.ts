import type { AuthErrorPagesMessages } from "./en";

const es: AuthErrorPagesMessages = {
  notFound: {
    title: "Página no encontrada",
    description: "Esa página no está en {brand}.",
    heading: "Página no encontrada",
    lede: "Esa URL no está en ProbeHarbor: puede que se haya movido o que el enlace esté desactualizado.",
    home: "Inicio",
    guides: "Guías",
    dashboard: "Panel",
    lookingFor: "¿Buscas alertas de congelación o inundación, o la documentación de ingesta?",
    ingest: "Ingesta y webhooks",
    contact: "Contacto",
  },
  serverError: {
    title: "Algo salió mal",
    description: "Se produjo un error inesperado.",
    heading: "Algo salió mal",
    lede: "Se produjo un error inesperado al cargar esta página. El incidente se registró automáticamente.",
    home: "Volver al inicio",
    status: "Estado del sistema",
  },
};

export default es;

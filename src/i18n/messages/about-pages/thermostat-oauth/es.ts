
/**
 * /about/thermostat-oauth body copy. Secret names, URIs and commands stay in English.
 * `*Html` keys are trusted inline HTML.
 */
import type { Messages } from "./en";

const es: Messages = {
  introHtml:
    "Los hogares Pro pueden conectar un termostato <strong>Nest</strong> o <strong>Ecobee</strong> para que la temperatura interior y la consigna aparezcan en el panel junto a las sondas del ático, el sótano ventilado y el taller, y para que las alertas de congelación incluyan ese contexto. Los usuarios se conectan desde <strong>Dashboard → Temperature</strong>; esta página es para quien administra el sitio y activa OAuth en una instalación propia o de producción.",
  connectTitle: "Cuándo aparece el botón de conexión",
  connectHtml:
    "La tarjeta del termostato permanece oculta hasta que la instalación tiene las credenciales de cliente del proveedor en los secretos del Worker. Una vez subidos los secretos, los administradores Pro ven <strong>Connect</strong> para cada proveedor configurado.",
  nestTitle: "Nest (Google Device Access)",
  nestRedirectHtml:
    "URI de redirección de producción (<strong>probeharbor.dev</strong>): cópiala tal cual en Google Cloud Console:",
  nestSteps: [
    'Crea un proyecto en la <a class="text-link" href="https://console.nest.google.com/device-access" target="_blank" rel="noreferrer">Device Access Console</a> (pago único).',
    "Crea un cliente OAuth de Google Cloud (aplicación web) en el <strong>mismo</strong> proyecto de GCP vinculado a Device Access.",
    'Activa la <a class="text-link" href="https://console.cloud.google.com/apis/library/smartdevicemanagement.googleapis.com" target="_blank" rel="noreferrer">Smart Device Management API</a> en ese proyecto de GCP (OAuth puede funcionar sin ella, pero las lecturas en vivo devolverán 403 hasta que esté activada).',
    "Añade la URI de redirección anterior (instalación propia: <code>https://YOUR_SITE/api/integrations/nest/callback</code>).",
    "Define los secretos del Worker: <code>NEST_CLIENT_ID</code>, <code>NEST_CLIENT_SECRET</code>, <code>NEST_PROJECT_ID</code> (el UUID que aparece arriba en tu proyecto de Device Access, no el número de proyecto de Google Cloud).",
    "Añade las claves a <code>.env</code> y súbelas: <code>pnpm secrets:push</code>",
  ],
  ecobeeTitle: "Ecobee",
  ecobeeRedirectHtml: "URI de redirección de producción:",
  ecobeeSteps: [
    'Regístrate en el <a class="text-link" href="https://www.ecobee.com/en-us/developer/" target="_blank" rel="noreferrer">portal para desarrolladores de Ecobee</a>.',
    "Crea una app con la URI de redirección anterior (instalación propia: <code>https://YOUR_SITE/api/integrations/ecobee/callback</code>).",
    "Define el secreto del Worker: <code>ECOBEE_CLIENT_ID</code> (Ecobee no usa secreto de cliente).",
    "Añádelo a <code>.env</code> y ejecuta <code>pnpm secrets:push</code>.",
  ],
  uxTitle: "Experiencia del usuario",
  uxHtml:
    "Cada hogar guarda su propio token de actualización tras OAuth; no hay un token de termostato global compartido. Los administradores pueden desconectarlo desde el panel, y al hacerlo los tokens se revocan en la base de datos.",
  seeAlsoHtml:
    'Consulta también: <a class="text-link" href="/integrations">centro de integraciones</a>, <a class="text-link" href="/compare/nest">ProbeHarbor frente a Nest</a>, <a class="text-link" href="/compare/ecobee">frente a Ecobee</a>.',
};

export default es;

import type { AuthPasswordMessages } from "./en";

const es: AuthPasswordMessages = {
  backToSignIn: "Volver a iniciar sesión",
  email: "Correo electrónico",
  errors: {
    missing_email: "Introduce el correo electrónico de tu cuenta.",
    verification: "La verificación falló. Inténtalo de nuevo.",
  },
  forgot: {
    title: "Olvidé mi contraseña",
    description: "Solicita un enlace para restablecer la contraseña de tu cuenta de ProbeHarbor.",
    heading: "Olvidé mi contraseña",
    lede: "Introduce el correo de tu cuenta y te enviaremos un enlace para elegir una contraseña nueva.",
    sent: "Si existe una cuenta con ese correo, el enlace para restablecerla va en camino. Revisa tu bandeja de entrada y la carpeta de spam.",
    submit: "Enviar enlace",
  },
  reset: {
    title: "Restablecer contraseña",
    description: "Elige una contraseña nueva para tu cuenta de ProbeHarbor.",
    heading: "Elige una contraseña nueva",
    withSession: "Introduce y confirma tu nueva contraseña a continuación.",
    withoutSession: "Abre el enlace de restablecimiento de tu correo para continuar.",
    needsLinkHtml:
      'Esta página necesita un enlace de restablecimiento válido. <a class="text-link" href="/forgot-password">Solicita uno nuevo</a>.',
    newPassword: "Nueva contraseña",
    confirmPassword: "Confirmar contraseña",
    submit: "Actualizar contraseña",
    errors: {
      weak: "La contraseña debe tener al menos 8 caracteres.",
      mismatch: "Las contraseñas no coinciden.",
      session: "Tu sesión de restablecimiento caducó. Solicita un enlace nuevo.",
      update: "No se pudo actualizar la contraseña. Inténtalo de nuevo.",
    },
  },
  resend: {
    title: "Reenviar confirmación",
    description: "Solicita un nuevo enlace de confirmación de correo para tu cuenta de ProbeHarbor.",
    heading: "Reenviar el correo de confirmación",
    lede: "Los enlaces de confirmación caducan. Introduce el correo con el que te registraste y te enviaremos uno nuevo.",
    sentHtml:
      'Si esa dirección tiene una cuenta sin confirmar, un nuevo enlace de confirmación va en camino. Revisa tu bandeja de entrada y la carpeta de spam. ¿Ya la confirmaste? <a class="text-link" href="/signin">Inicia sesión</a>.',
    submit: "Enviar enlace de confirmación",
  },
};

export default es;

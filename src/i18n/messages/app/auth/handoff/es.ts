import type { AuthHandoffMessages } from "./en";

const es: AuthHandoffMessages = {
  invite: {
    title: "Invitación al hogar",
    description: "Acepta una invitación para compartir un hogar.",
    heading: "Invitación al hogar",
    aHousehold: "un hogar",
    invalid: "Este enlace de invitación no es válido.",
    expired: "Esta invitación caducó. Pide a la persona propietaria del hogar que te envíe una nueva.",
    alreadyAccepted: "Esta invitación ya fue aceptada.",
    openHousehold: "Abrir hogar",
    invited: "Te invitaron a compartir sensores en {household}.",
    invitedAs: "Te invitaron a compartir sensores en {household} como {email}.",
    signOutButton: "Cerrar sesión",
    signOut: "Cierra sesión",
    useInvitedEmail: "y usa el correo invitado.",
    signInOrRegisterAs: "Inicia sesión o regístrate con {email} para aceptar.",
    signInOrRegister: "Inicia sesión o regístrate con el correo invitado para aceptar.",
    signIn: "Iniciar sesión",
    createAccount: "Crear cuenta",
    signedInMismatch: "Sesión iniciada como {email}. Cierra sesión y usa la dirección invitada para unirte.",
    signInAs: "Iniciar sesión como {email}",
    signInAsInvited: "Iniciar sesión con el correo invitado",
    signedInAs: "Sesión iniciada como {email}",
    join: "Unirse al hogar",
  },
  appOAuth: {
    signInFinished: "El inicio de sesión terminó en el navegador.",
    missingTitle: "Falta el token de inicio de sesión",
    baybuddy: {
      title: "Volver a Bay Buddy",
      description: "Termina el inicio de sesión en ProbeHarbor volviendo a Bay Buddy.",
      open: "Abrir Bay Buddy",
      handoff: "Si Bay Buddy está esperando, debería continuar automáticamente. Si no, toca el botón de abajo.",
      close: "Puedes cerrar esta pestaña cuando Bay Buddy muestre el estado en vivo de tu garaje.",
      missing: "Esta página te devuelve a Bay Buddy después de iniciar sesión. Abre Bay Buddy y elige Connect de nuevo.",
    },
    desktop: {
      title: "Volver a ProbeHarbor Desktop",
      description: "Termina el inicio de sesión en ProbeHarbor volviendo a ProbeHarbor Desktop.",
      open: "Abrir ProbeHarbor Desktop",
      handoff:
        "Si ProbeHarbor Desktop está esperando el traspaso por loopback, debería terminar automáticamente. Si no, esta página es una alternativa: vuelve a abrir la app y elige Connect de nuevo.",
      close: "Puedes cerrar esta pestaña cuando ProbeHarbor Desktop muestre tu panel.",
      missing:
        "Esta página te devuelve a ProbeHarbor Desktop después de iniciar sesión. Abre la app de escritorio y elige Connect de nuevo.",
    },
    android: {
      title: "Volver a la app de Android",
      description: "Termina el inicio de sesión en ProbeHarbor volviendo a la app de Android.",
      open: "Abrir ProbeHarbor",
      handoff:
        "Chrome suele quedarse aquí después de un paso de seguridad de Google o YubiKey: toca el botón para volver a la app y terminar allí la MFA si hace falta.",
      close:
        "Si no pasa nada, usa el botón Atrás del teléfono para volver a la app o abre ProbeHarbor desde el cajón de aplicaciones.",
      missing:
        "Esta página solo se usa para volver a la app de Android después de iniciar sesión con Google. Abre ProbeHarbor en tu teléfono y vuelve a intentarlo con Google.",
    },
  },
};

export default es;

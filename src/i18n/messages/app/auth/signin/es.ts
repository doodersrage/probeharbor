import type { AuthSigninMessages } from "./en";

const es: AuthSigninMessages = {
  signin: {
    title: "Iniciar sesión",
    description:
      "Inicia sesión en tu panel para gestionar las preferencias de visualización, los feeds de sondas, el historial de lecturas y la exportación CSV.",
    heading: "Iniciar sesión",
    lede: "Continúa donde lo dejaste: tus preferencias, feeds y lecturas guardadas están en tu panel.",
    registeredHtml:
      "Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión. Siguiente paso después de iniciar sesión: <strong>Dispositivos</strong>: crea una clave de envío y haz POST de tu primera lectura.",
    confirmedHtml:
      "Correo confirmado. Inicia sesión para terminar la configuración: la siguiente parada es <strong>Dispositivos</strong>, donde conectas tu primer sensor.",
    signedOutAll: "Sesión cerrada en todos los dispositivos. Vuelve a iniciar sesión aquí cuando quieras.",
    resendConfirmation: "Reenviar el correo de confirmación",
    email: "Correo electrónico",
    password: "Contraseña",
    submit: "Iniciar sesión con correo",
    forgotPassword: "¿Olvidaste tu contraseña?",
    newHere: "¿Eres nuevo?",
    createAccount: "Crea una cuenta gratis",
    privacy: "Privacidad",
    terms: "Términos",
  },
  register: {
    title: "Registro",
    description:
      "Crea una cuenta gratuita de ProbeHarbor, sin tarjeta. Conecta sondas ESP/Arduino, alertas de congelación e inundación/fuga, e historial para tu hogar.",
    heading: "Crea tu cuenta",
    lede: "Gratis para siempre, sin tarjeta de crédito. Después del registro llegarás a Dispositivos para conectar tu primera sonda o tu ruta de alerta por contacto de humedad.",
    preferLook: "¿Prefieres echar un vistazo antes?",
    liveDemo: "Demo en vivo (sin cuenta)",
    referral:
      "Código de referido {code} aplicado. La prueba de Pro incluye 7 días extra.",
    email: "Correo electrónico",
    password: "Contraseña",
    passwordHint: "Usa al menos 8 caracteres.",
    submit: "Crear cuenta con correo",
    agreeHtml:
      'Al crear una cuenta aceptas nuestros <a class="text-link" href="/terms">Términos</a> y nuestra <a class="text-link" href="/privacy">Política de privacidad</a>.',
    haveAccount: "¿Ya tienes una cuenta?",
    signIn: "Iniciar sesión",
    errors: {
      missing_fields: "Introduce tu correo electrónico y tu contraseña.",
      verification: "La verificación falló. Inténtalo de nuevo.",
      weak_password: "La contraseña debe tener al menos 8 caracteres.",
      generic: "Algo salió mal al crear tu cuenta. Inténtalo de nuevo.",
      signup_failed: "Algo salió mal al crear tu cuenta. Inténtalo de nuevo.",
    },
  },
  oauth: {
    google: "Continuar con Google",
    github: "Continuar con GitHub",
    discord: "Continuar con Discord",
    orContinueWith: "o continúa con",
    orUseEmail: "o usa tu correo",
  },
  errors: {
    missing_fields: "Introduce tu correo electrónico y tu contraseña.",
    invalid_credentials: "No pudimos iniciar tu sesión. Revisa tu correo y contraseña e inténtalo de nuevo.",
    email_not_confirmed:
      "Confirma tu dirección de correo antes de iniciar sesión. Busca el enlace de confirmación en tu bandeja de entrada.",
    oauth_failed:
      "No pudimos iniciar el acceso con redes sociales. Inténtalo de nuevo o inicia sesión con tu correo.",
    oauth_denied: "Se canceló el acceso con redes sociales. Inténtalo de nuevo cuando quieras.",
    oauth_provider_failed:
      "El acceso con redes sociales falló en el proveedor. Inténtalo de nuevo o inicia sesión con tu correo.",
    oauth_secret_mismatch:
      "Las credenciales del acceso con redes sociales están desactualizadas. Genera un nuevo client secret en la app del proveedor (Discord, GitHub o Google) y pega el nuevo valor en Supabase → Authentication → Providers.",
    oauth_github_profile:
      "El acceso con GitHub no pudo leer tu perfil ni tu correo. Revoca ProbeHarbor en GitHub → Settings → Authorized OAuth Apps y vuelve a intentarlo: la pantalla de autorización debe mostrar ProbeHarbor y pedir acceso a tu correo.",
    oauth_exchange_failed:
      "Algo salió mal al completar el acceso con redes sociales. Inténtalo de nuevo.",
    confirm_link:
      "Ese enlace de confirmación caducó o ya se usó. Si ya confirmaste tu correo, simplemente inicia sesión.",
    turnstile_failed: "Marca la casilla de verificación humana e inténtalo de nuevo.",
    rate_limited:
      "Demasiados intentos de inicio de sesión para esta cuenta. Espera unos minutos e inténtalo de nuevo.",
    generic: "Algo salió mal al iniciar sesión. Inténtalo de nuevo.",
  },
  mfa: {
    title: "Autenticación en dos pasos",
    description: "Completa el inicio de sesión con un código de autenticador o un OTP de YubiKey.",
    yourAccount: "tu cuenta",
    errors: {
      invalid_code:
        "Ese código era incorrecto o caducó. Introduce un código nuevo de tu app de autenticación.",
      invalid_yubikey:
        "No se aceptó ese OTP de YubiKey. Haz clic en el campo YubiKey OTP, toca tu llave (pulsación larga) y espera a que se escriba el código completo antes de enviarlo.",
      replayed_otp: "Ese OTP de YubiKey ya se usó. Toca tu llave de nuevo para generar un código nuevo.",
      yubikey_not_enrolled:
        "Esa YubiKey no está registrada en esta cuenta. Añádela en Ajustes → Seguridad o usa tu código de autenticador.",
      no_factor:
        "Esta cuenta no tiene ningún factor de MFA registrado. Vuelve a iniciar sesión y añade uno en Ajustes.",
      rate_limited: "Demasiados intentos incorrectos. Espera unos minutos e inténtalo de nuevo.",
      generic: "Algo salió mal al verificar tu código. Inténtalo de nuevo.",
    },
    challenge: {
      heading: "Autenticación en dos pasos",
      lede: "Completa el inicio de sesión de {email} con un código de autenticador o un OTP de YubiKey.",
      codeLabel: "Código del autenticador",
      verifyCode: "Verificar código",
      totpHint: "¿Usas Yubico Authenticator en tu YubiKey? Introduce arriba el código de 6 dígitos.",
      yubikeyLabel: "YubiKey OTP",
      verifyYubikey: "Verificar con YubiKey",
      otpHint:
        "O toca tu YubiKey en el campo OTP de abajo (pulsación larga, no códigos de Yubico Authenticator).",
      differentAccount: "Usar otra cuenta",
    },
  },
};

export default es;

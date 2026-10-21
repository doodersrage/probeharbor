import type { AuthApiMessages } from "./en";

const es: AuthApiMessages = {
  mfa: {
    verifyBeforeAdding: "Verifica la MFA antes de añadir otro autenticador",
    invalidCode: "Introduce un código válido de 6 dígitos",
    verificationFailed: "La verificación falló",
    challengeFailed: "No se pudo iniciar la verificación",
    yubikeyNotConfigured: "YubiKey OTP no está configurado en este sitio",
    tapYubikey: "Toca tu YubiKey en el campo OTP",
    yubikeyAlreadyEnrolled: "Esta YubiKey ya está registrada",
    yubikeyLimit: "Máximo de 5 YubiKeys por cuenta",
    yubikeyNotFound: "No se encontró esa YubiKey en esta cuenta",
    verifyBeforeRemovingYubikeys: "Vuelve a verificar la MFA antes de quitar YubiKeys",
    tapYubikeyToRemove: "Toca la YubiKey que vas a quitar para confirmar",
    yubikeyConfirmFailed: "No se pudo confirmar la YubiKey",
    verifyBeforeRemoving: "Vuelve a verificar la MFA antes de quitar autenticadores",
  },
};

export default es;

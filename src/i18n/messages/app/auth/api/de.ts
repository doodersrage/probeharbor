import type { AuthApiMessages } from "./en";

const de: AuthApiMessages = {
  mfa: {
    verifyBeforeAdding: "Bestätige zuerst die MFA, bevor du einen weiteren Authenticator hinzufügst",
    invalidCode: "Gib einen gültigen 6-stelligen Code ein",
    verificationFailed: "Überprüfung fehlgeschlagen",
    passwordIncorrect: "Das Passwort ist nicht korrekt.",
    totpAlreadyEnabled: "Es ist bereits eine Authenticator-App eingerichtet. Entferne sie zuerst, um eine neue einzurichten.",
    securityKeysMoved: "Sicherheitsschlüssel werden zu Passkeys. Füge deinen Schlüssel erneut als Passkey hinzu, sobald die Option hier erscheint.",
    challengeFailed: "Die Überprüfung konnte nicht gestartet werden",
    yubikeyNotConfigured: "YubiKey OTP ist auf dieser Website nicht eingerichtet",
    tapYubikey: "Berühre deinen YubiKey im OTP-Feld",
    yubikeyAlreadyEnrolled: "Dieser YubiKey ist bereits registriert",
    yubikeyLimit: "Höchstens 5 YubiKeys pro Konto",
    yubikeyNotFound: "Dieser YubiKey ist für dieses Konto nicht registriert",
    verifyBeforeRemovingYubikeys: "Bestätige die MFA erneut, bevor du YubiKeys entfernst",
    tapYubikeyToRemove: "Berühre zur Bestätigung den YubiKey, den du entfernen möchtest",
    yubikeyConfirmFailed: "YubiKey-Bestätigung fehlgeschlagen",
    verifyBeforeRemoving: "Bestätige die MFA erneut, bevor du Authenticatoren entfernst",
  },
};

export default de;

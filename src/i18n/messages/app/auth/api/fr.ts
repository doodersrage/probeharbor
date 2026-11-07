import type { AuthApiMessages } from "./en";

const fr: AuthApiMessages = {
  mfa: {
    verifyBeforeAdding: "Validez la MFA avant d’ajouter un autre authentificateur",
    invalidCode: "Saisissez un code valide à 6 chiffres",
    verificationFailed: "La vérification a échoué",
    passwordIncorrect: "Ce mot de passe est incorrect.",
    totpAlreadyEnabled: "Une application d’authentification est déjà configurée. Supprimez-la d’abord pour en configurer une nouvelle.",
    securityKeysMoved: "Les clés de sécurité deviennent des clés d’accès (passkeys). Ajoutez à nouveau votre clé comme passkey quand l’option apparaîtra ici.",
    challengeFailed: "Impossible de lancer la vérification",
    yubikeyNotConfigured: "YubiKey OTP n’est pas configuré sur ce site",
    tapYubikey: "Touchez votre YubiKey dans le champ OTP",
    yubikeyAlreadyEnrolled: "Cette YubiKey est déjà enregistrée",
    yubikeyLimit: "5 YubiKey maximum par compte",
    yubikeyNotFound: "YubiKey introuvable sur ce compte",
    verifyBeforeRemovingYubikeys: "Validez à nouveau la MFA avant de retirer des YubiKey",
    tapYubikeyToRemove: "Touchez la YubiKey à retirer pour confirmer",
    yubikeyConfirmFailed: "Échec de la confirmation de la YubiKey",
    verifyBeforeRemoving: "Validez à nouveau la MFA avant de retirer des authentificateurs",
  },
};

export default fr;

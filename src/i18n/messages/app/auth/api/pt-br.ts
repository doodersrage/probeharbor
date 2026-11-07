import type { AuthApiMessages } from "./en";

const ptBr: AuthApiMessages = {
  mfa: {
    verifyBeforeAdding: "Verifique a MFA antes de adicionar outro autenticador",
    invalidCode: "Digite um código válido de 6 dígitos",
    verificationFailed: "A verificação falhou",
    passwordIncorrect: "Essa senha não está correta.",
    totpAlreadyEnabled: "Já existe um app autenticador configurado. Remova-o primeiro para configurar um novo.",
    securityKeysMoved: "As chaves de segurança passam a ser chaves de acesso (passkeys). Adicione sua chave novamente como passkey quando essa opção aparecer aqui.",
    challengeFailed: "Não foi possível iniciar a verificação",
    yubikeyNotConfigured: "O YubiKey OTP não está configurado neste site",
    tapYubikey: "Toque na sua YubiKey no campo OTP",
    yubikeyAlreadyEnrolled: "Esta YubiKey já está cadastrada",
    yubikeyLimit: "Máximo de 5 YubiKeys por conta",
    yubikeyNotFound: "YubiKey não encontrada nesta conta",
    verifyBeforeRemovingYubikeys: "Verifique a MFA novamente antes de remover YubiKeys",
    tapYubikeyToRemove: "Toque na YubiKey que você está removendo para confirmar",
    yubikeyConfirmFailed: "A confirmação da YubiKey falhou",
    verifyBeforeRemoving: "Verifique a MFA novamente antes de remover autenticadores",
  },
};

export default ptBr;

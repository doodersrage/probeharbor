import type { AuthSigninMessages } from "./en";

const ptBr: AuthSigninMessages = {
  signin: {
    title: "Entrar",
    description:
      "Entre no seu painel para gerenciar preferências de exibição, feeds das sondas, histórico de leituras e exportação em CSV.",
    heading: "Entrar",
    lede: "Continue de onde parou: suas preferências, feeds e leituras salvas estão no seu painel.",
    registeredHtml:
      "Conta criada. Confira seu e-mail para confirmar e depois entre. Próximo passo depois de entrar: <strong>Dispositivos</strong>: crie uma chave de envio e faça o POST da sua primeira leitura.",
    confirmedHtml:
      "E-mail confirmado. Entre para concluir a configuração: a próxima parada é <strong>Dispositivos</strong>, onde você conecta seu primeiro sensor.",
    signedOutAll: "Você saiu em todos os dispositivos. Entre novamente aqui quando quiser.",
    resendConfirmation: "Reenviar o e-mail de confirmação",
    email: "E-mail",
    password: "Senha",
    submit: "Entrar com e-mail",
    forgotPassword: "Esqueceu a senha?",
    newHere: "Novo por aqui?",
    createAccount: "Crie uma conta grátis",
    privacy: "Privacidade",
    terms: "Termos",
  },
  register: {
    title: "Cadastro",
    description:
      "Crie uma conta grátis no ProbeHarbor, sem cartão. Conecte sondas ESP/Arduino, alertas de congelamento e alagamento/vazamento e histórico para sua casa.",
    heading: "Crie sua conta",
    lede: "Grátis para sempre, sem cartão de crédito. Depois do cadastro você vai para Dispositivos para conectar sua primeira sonda ou seu alerta por contato de umidade.",
    preferLook: "Prefere dar uma olhada antes?",
    liveDemo: "Demo ao vivo (sem conta)",
    referral:
      "Código de indicação {code} aplicado. O teste do Pro inclui 7 dias extras.",
    email: "E-mail",
    password: "Senha",
    passwordHint: "Use pelo menos 8 caracteres.",
    submit: "Criar conta com e-mail",
    agreeHtml:
      'Ao criar uma conta, você concorda com nossos <a class="text-link" href="/terms">Termos</a> e com a <a class="text-link" href="/privacy">Política de privacidade</a>.',
    haveAccount: "Já tem uma conta?",
    signIn: "Entrar",
    errors: {
      missing_fields: "Informe seu e-mail e sua senha.",
      verification: "A verificação falhou. Tente novamente.",
      weak_password: "A senha deve ter pelo menos 8 caracteres.",
      generic: "Algo deu errado ao criar sua conta. Tente novamente.",
      signup_failed: "Algo deu errado ao criar sua conta. Tente novamente.",
    },
  },
  oauth: {
    google: "Continuar com Google",
    github: "Continuar com GitHub",
    discord: "Continuar com Discord",
    orContinueWith: "ou continue com",
    orUseEmail: "ou use seu e-mail",
  },
  errors: {
    missing_fields: "Informe seu e-mail e sua senha.",
    invalid_credentials: "Não conseguimos fazer seu login. Confira seu e-mail e senha e tente novamente.",
    email_not_confirmed:
      "Confirme seu endereço de e-mail antes de entrar. Procure o link de confirmação na sua caixa de entrada.",
    oauth_failed: "Não conseguimos iniciar o login social. Tente novamente ou entre com seu e-mail.",
    oauth_denied: "O login social foi cancelado. Tente novamente quando quiser.",
    oauth_provider_failed:
      "O login social falhou no provedor. Tente novamente ou entre com seu e-mail.",
    oauth_secret_mismatch:
      "As credenciais do login social estão desatualizadas. Gere um novo client secret no app do provedor (Discord, GitHub ou Google) e cole o novo valor em Supabase → Authentication → Providers.",
    oauth_github_profile:
      "O login com GitHub não conseguiu ler seu perfil ou e-mail. Revogue o ProbeHarbor em GitHub → Settings → Authorized OAuth Apps e tente novamente: a tela de autorização deve mostrar o ProbeHarbor e pedir acesso ao e-mail.",
    oauth_exchange_failed: "Algo deu errado ao concluir o login social. Tente novamente.",
    confirm_link:
      "Esse link de confirmação expirou ou já foi usado. Se você já confirmou, é só entrar.",
    turnstile_failed: "Marque a caixa de verificação humana e tente novamente.",
    rate_limited:
      "Muitas tentativas de login nesta conta. Aguarde alguns minutos e tente novamente.",
    generic: "Algo deu errado ao entrar. Tente novamente.",
  },
  mfa: {
    title: "Autenticação em dois fatores",
    description: "Conclua o login com um código do autenticador ou um OTP da YubiKey.",
    yourAccount: "sua conta",
    errors: {
      invalid_code:
        "Esse código estava incorreto ou expirou. Digite um código novo do seu app autenticador.",
      invalid_yubikey:
        "Esse OTP da YubiKey não foi aceito. Clique no campo YubiKey OTP, toque na sua chave (toque longo) e espere o código completo antes de enviar.",
      replayed_otp: "Esse OTP da YubiKey já foi usado. Toque na sua chave de novo para gerar um código novo.",
      yubikey_not_enrolled:
        "Essa YubiKey não está cadastrada nesta conta. Adicione-a em Configurações → Segurança ou use o código do autenticador.",
      no_factor:
        "Nenhum fator de MFA está cadastrado nesta conta. Entre novamente e adicione um em Configurações.",
      rate_limited: "Muitas tentativas incorretas. Aguarde alguns minutos e tente novamente.",
      generic: "Algo deu errado ao verificar seu código. Tente novamente.",
    },
    challenge: {
      heading: "Autenticação em dois fatores",
      lede: "Conclua o login de {email} com um código do autenticador ou um OTP da YubiKey.",
      codeLabel: "Código do autenticador",
      verifyCode: "Verificar código",
      totpHint: "Usa o Yubico Authenticator na sua YubiKey? Digite o código de 6 dígitos acima.",
      yubikeyLabel: "YubiKey OTP",
      verifyYubikey: "Verificar com YubiKey",
      otpHint:
        "Ou toque na sua YubiKey no campo OTP abaixo (toque longo, não códigos do Yubico Authenticator).",
      differentAccount: "Usar outra conta",
    },
  },
};

export default ptBr;

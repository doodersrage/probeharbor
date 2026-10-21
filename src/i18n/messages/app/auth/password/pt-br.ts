import type { AuthPasswordMessages } from "./en";

const ptBr: AuthPasswordMessages = {
  backToSignIn: "Voltar para o login",
  email: "E-mail",
  errors: {
    missing_email: "Informe o e-mail da sua conta.",
    verification: "A verificação falhou. Tente novamente.",
  },
  forgot: {
    title: "Esqueci a senha",
    description: "Peça um link para redefinir a senha da sua conta ProbeHarbor.",
    heading: "Esqueci a senha",
    lede: "Informe o e-mail da sua conta e enviaremos um link para você escolher uma nova senha.",
    sent: "Se existir uma conta com esse e-mail, um link de redefinição está a caminho. Confira sua caixa de entrada e a pasta de spam.",
    submit: "Enviar link de redefinição",
  },
  reset: {
    title: "Redefinir senha",
    description: "Escolha uma nova senha para sua conta ProbeHarbor.",
    heading: "Escolha uma nova senha",
    withSession: "Digite e confirme sua nova senha abaixo.",
    withoutSession: "Abra o link de redefinição do seu e-mail para continuar.",
    needsLinkHtml:
      'Esta página precisa de um link de redefinição válido. <a class="text-link" href="/forgot-password">Peça um novo</a>.',
    newPassword: "Nova senha",
    confirmPassword: "Confirmar senha",
    submit: "Atualizar senha",
    errors: {
      weak: "A senha deve ter pelo menos 8 caracteres.",
      mismatch: "As senhas não coincidem.",
      session: "Sua sessão de redefinição expirou. Peça um novo link.",
      update: "Não foi possível atualizar a senha. Tente novamente.",
    },
  },
  resend: {
    title: "Reenviar confirmação",
    description: "Peça um novo link de confirmação de e-mail para sua conta ProbeHarbor.",
    heading: "Reenviar e-mail de confirmação",
    lede: "Links de confirmação expiram. Informe o e-mail usado no cadastro e enviaremos um novo.",
    sentHtml:
      'Se esse endereço tiver uma conta não confirmada, um novo link de confirmação está a caminho. Confira sua caixa de entrada e a pasta de spam. Já confirmou? <a class="text-link" href="/signin">Entre</a>.',
    submit: "Enviar link de confirmação",
  },
};

export default ptBr;

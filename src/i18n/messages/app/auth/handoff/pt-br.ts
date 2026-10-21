import type { AuthHandoffMessages } from "./en";

const ptBr: AuthHandoffMessages = {
  invite: {
    title: "Convite para a casa",
    description: "Aceite um convite para compartilhar uma casa.",
    heading: "Convite para a casa",
    aHousehold: "uma casa",
    invalid: "Este link de convite é inválido.",
    expired: "Este convite expirou. Peça ao dono da casa para enviar um novo.",
    alreadyAccepted: "Este convite já foi aceito.",
    openHousehold: "Abrir casa",
    invited: "Você foi convidado para compartilhar os sensores de {household}.",
    invitedAs: "Você foi convidado para compartilhar os sensores de {household} como {email}.",
    signOutButton: "Sair",
    signOut: "Saia",
    useInvitedEmail: "e use o e-mail convidado.",
    signInOrRegisterAs: "Entre ou cadastre-se com {email} para aceitar.",
    signInOrRegister: "Entre ou cadastre-se com o e-mail convidado para aceitar.",
    signIn: "Entrar",
    createAccount: "Criar conta",
    signedInMismatch: "Conectado como {email}. Saia e use o endereço convidado para participar.",
    signInAs: "Entrar como {email}",
    signInAsInvited: "Entrar com o e-mail convidado",
    signedInAs: "Conectado como {email}",
    join: "Entrar na casa",
  },
  appOAuth: {
    signInFinished: "O login foi concluído no navegador.",
    missingTitle: "Token de login ausente",
    baybuddy: {
      title: "Voltar para o Bay Buddy",
      description: "Conclua o login no ProbeHarbor voltando para o Bay Buddy.",
      open: "Abrir Bay Buddy",
      handoff: "Se o Bay Buddy estiver aguardando, ele deve continuar automaticamente. Se não, toque no botão abaixo.",
      close: "Você pode fechar esta aba quando o Bay Buddy mostrar o clima ao vivo da sua garagem.",
      missing: "Esta página leva você de volta ao Bay Buddy depois do login. Abra o Bay Buddy e escolha Connect novamente.",
    },
    desktop: {
      title: "Voltar para o ProbeHarbor Desktop",
      description: "Conclua o login no ProbeHarbor voltando para o ProbeHarbor Desktop.",
      open: "Abrir ProbeHarbor Desktop",
      handoff:
        "Se o ProbeHarbor Desktop estiver aguardando a transferência por loopback, o login deve terminar automaticamente. Se não, esta página é uma alternativa: abra o app de novo e escolha Connect novamente.",
      close: "Você pode fechar esta aba quando o ProbeHarbor Desktop mostrar seu painel.",
      missing:
        "Esta página leva você de volta ao ProbeHarbor Desktop depois do login. Abra o app para computador e escolha Connect novamente.",
    },
    android: {
      title: "Voltar para o app Android",
      description: "Conclua o login no ProbeHarbor voltando para o app Android.",
      open: "Abrir ProbeHarbor",
      handoff:
        "O Chrome costuma ficar nesta página depois de uma etapa de segurança do Google ou da YubiKey: toque no botão para voltar ao app e concluir a MFA por lá, se necessário.",
      close:
        "Se nada acontecer, use o botão Voltar do celular para retornar ao app ou abra o ProbeHarbor pela gaveta de apps.",
      missing:
        "Esta página só é usada para voltar ao app Android depois do login com Google. Abra o ProbeHarbor no seu celular e tente o Google novamente.",
    },
  },
};

export default ptBr;

import type { PlansMessages } from "./en";

const ptBr: PlansMessages = {
  title: "Planos",
  subtitle: "Compare os planos e faça upgrade quando precisar de histórico mais longo, SMS ou mais imóveis.",
  comparisonTitle: "Comparação de recursos",
  comparisonHint: "Sua coluna está destacada.",
  card: {
    title: "Planos",
    titleWithCsv: "Planos e exportação CSV",
    introHtml:
      'O Member libera a exportação CSV, 90 dias de histórico e avisos de congelamento pela previsão do tempo. Todos os planos incluem um relógio de tempo até o congelamento para este espaço sem aquecimento. O Pro adiciona alertas oficiais de congelamento e frio do NWS (EUA), SMS, push no navegador, links de compartilhamento para convidados, um <a class="text-link" href="/claims-pack">pacote de evidências para sinistros</a>, webhooks de entrada e saída, widgets incorporáveis e 14 dias de teste grátis. O Portfolio aumenta o limite de imóveis próprios para locadores e administradores de imóveis, com acessos de administrador para a equipe no local. O plano anual tem desconto em relação ao mensal quando esses preços estão configurados no Stripe.',
    subscriptionActivated: "Assinatura ativada.",
    checkoutCancelled: "O pagamento foi cancelado. Você pode assinar quando quiser.",
    currentPlan: "Plano atual:",
    maxDevices: "até {count} dispositivos push por imóvel",
    history: "{retention} de histórico",
    ownedProperties: { one: "{count} imóvel próprio", other: "{count} imóveis próprios" },
    fullComparison: "Comparação completa",
    subscriptionActive: "Sua assinatura {plan} está ativa.",
    csvAccess: "Sua conta inclui acesso à exportação CSV.",
    manageBilling: "Gerenciar cobrança",
    upgradeProMonthly: "Mudar para o Pro (mensal)",
    proAnnual: "Pro anual",
    upgradePortfolioMonthly: "Mudar para o Portfolio (mensal)",
    portfolioAnnual: "Portfolio anual",
    seePortfolioPricingHtml:
      '<a class="text-link" href="/pricing#portfolio">Ver preços do Portfolio</a> para gerenciar muitos imóveis.',
    memberMonthly: "Member mensal",
    memberAnnual: "Member anual",
    proMonthly: "Pro mensal",
  },
};

export default ptBr;

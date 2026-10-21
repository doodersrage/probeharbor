
/**
 * /about/accounts-and-dashboard body copy. `*Html` keys are trusted inline
 * HTML; hrefs stay English (middleware localizes them). Quoted dashboard
 * button labels stay English because the dashboard is English-only.
 */
import type { AccountsAndDashboardMessages } from "./en";

const ptBr: AccountsAndDashboardMessages = {
  introHtml:
    'Criar uma conta libera personalização, dispositivos, histórico, alertas e recursos pagos opcionais. Com a conta conectada, a interface mantém os elementos do imóvel (seletor de espaço, plano, links rápidos) e cada página fica focada no seu papel: <a class="text-link" href="/dashboard">Overview</a> para riscos e tendências, <a class="text-link" href="/dashboard/live">Live</a> para as leituras atuais, Devices / Alerts / History / Share para configuração e operação.',
  screenshots: [
    "O Overview começa com o status do espaço, ações rápidas e um tempo até o congelamento baseado na previsão.",
    "Faixa de Status: última leitura, sensores, feeds, alertas e margem até o congelamento. Fixe mais itens, como ΔT, dispersão entre sondas e condensação.",
    "Devices: pontuação de saúde, última conexão, últimos valores dos sensores e saúde dos feeds. Em Setup ficam push, pull, Home Assistant e MQTT.",
    "Curvas do History com a linha de congelamento: umidade e ponto de orvalho sobrepostos quando há UR.",
  ],
  account: {
    title: "Criação da conta",
    bodyHtml:
      "O cadastro usa e-mail e senha via Supabase Auth. A redefinição de senha e (quando ativados no Supabase) provedores OAuth como Google, GitHub ou Discord ficam disponíveis na página de login. Novos usuários começam no plano Free com uma casa padrão.",
  },
  checklist: {
    title: "Checklist para começar",
    bodyHtml:
      "Até você concluir o essencial (um dispositivo ou feed, o e-mail de congelamento e um alerta de teste) — ou dispensar o aviso —, o Overview fica num modo tranquilo de <strong>primeiro uso</strong>: status do espaço e chamadas para configurar, sem a faixa de Status completa nem os cartões de Insights. Um checklist curto cobre a conexão do dispositivo, a confirmação das leituras no Live e, depois, alertas opcionais e convites para a casa. Quando as etapas principais e opcionais estiverem concluídas, ou se você dispensá-lo, o checklist some; use <strong>Show checklist</strong> para trazê-lo de volta.",
  },
  overview: {
    title: "Overview (Simple vs. Insights)",
    bodyHtml:
      'Depois do primeiro uso, o <a class="text-link" href="/dashboard">Overview</a> abre com o status de risco da garagem ou do espaço e uma faixa de Status: última leitura, sensores, feeds, alertas, horas abaixo de zero (com graus-hora), margem mais fria acima do seu limite de congelamento, ΔT interno−externo, dispersão entre sondas, horas de condensação e saúde dos feeds quando há feeds pull. Um <strong>relógio de tempo até o congelamento</strong> fica abaixo do status do espaço tanto no Simple quanto no Insights: mostra quando esta garagem, oficina ou porão deve chegar ao seu limite de congelamento, considerando o atraso do espaço em relação à previsão externa. Ative o <strong>Insights</strong> para ver noites de risco, comparação semanal, análise do aquecimento, correlação entre porta e energia, movimento, tendências de bateria/RSSI, qualidade do ar, energia e alagamento/nível. O gráfico de sondas de 7 dias (Simple e Insights) pode mostrar umidade em % e ponto de orvalho (°F) quando as leituras incluem UR; os mesmos controles aparecem no History. Os cartões ao vivo ficam no <a class="text-link" href="/dashboard/live">Live</a>, não no Overview.',
  },
  live: {
    title: "Leituras ao vivo",
    bodyHtml:
      'O <a class="text-link" href="/dashboard/live">Live</a> é a página, com a conta conectada, dos cartões atuais das sondas, do clima externo (quando ativado) e dos avisos de off-line. Prefira o Live depois de uma ingestão ou de uma busca pull; use o Overview para o risco de congelamento e as tendências.',
  },
  devices: {
    title: "Dispositivos e sensores",
    introHtml:
      'Em <a class="text-link" href="/dashboard/devices">Devices</a>, <strong>Setup</strong> serve para conectar o hardware e <strong>Status</strong> para acompanhar a saúde (última conexão, bateria, RSSI). Você pode:',
    itemsHtml: [
      "<strong>Dispositivos push</strong>. O ESP/Arduino envia JSON via POST para uma URL de ingestão exclusiva. Copie a chave do aviso de 30 minutos; depois use <strong>Reveal ingest key</strong> ou <strong>Rotate key</strong>. Os sensores são importados automaticamente no primeiro POST; depois, renomeie os rótulos em Devices.",
      "<strong>Feeds pull</strong>: aba <strong>Pull feeds</strong>, com URLs de JSON via HTTPS que buscamos a cada 15 minutos. <strong>Save pull setup</strong> importa automaticamente as chaves das sondas; JSON SenML e Home Assistant REST são detectados sozinhos quando a raiz não existe.",
    ],
    stepsHtml:
      'Passo a passo: <a class="text-link" href="/about/adding-devices">Adicionar dispositivos push e pull</a>. Depois de mapear os sensores, verifique a ingestão (ou espere a próxima busca) e abra o <a class="text-link" href="/dashboard/live">Live</a> para confirmar os valores ao vivo. Exemplos de payload: <a class="text-link" href="/about/ingest-and-webhooks">ingestão e webhooks</a>.',
  },
  display: {
    title: "Preferências de exibição",
    bodyHtml:
      'Escolha se o Live mostra os sensores das sondas, o clima externo ou os dois. As preferências ficam nos metadados do seu perfil e valem assim que você salva em <a class="text-link" href="/dashboard/settings">Settings</a>.',
  },
  history: {
    title: "Histórico",
    bodyHtml:
      "O histórico paginado lista registros de temperatura e umidade da sua casa. Filtre por feed, sonda e período; limpe os filtros se uma consulta não retornar linhas. A consulta está incluída para todos os usuários conectados; o download em CSV exige Member/Pro (ou admin). A coleta em segundo plano roda a cada <strong>15 minutos</strong> via cron (além de cada ingestão push bem-sucedida). Atualizar o Live também pode atualizar os cartões ao vivo.",
  },
  activity: {
    title: "Atividade da casa",
    bodyHtml:
      'Proprietários e gestores veem um registro de <strong>Recent activity</strong> em <a class="text-link" href="/dashboard/household">Household</a> e <a class="text-link" href="/dashboard/share/integrations">Share → Integrations</a>: links de compartilhamento, alertas salvos, transferências de dispositivos e <strong>exibições de chaves de ingestão</strong> (auditadas quando alguém usa Reveal ingest key).',
  },
  alerts: {
    title: "Alertas",
    bodyHtml:
      'Comece por <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> (limite de congelamento em °F + e-mail). Depois do seu primeiro POST de ingestão, o Devices também pode salvar o essencial ali mesmo, sem sair do fluxo de configuração. Os planos gratuitos incluem e-mail, push e Discord; o Pro libera SMS e webhooks de saída. Ative um canal só quando o destino estiver preenchido: canais incompletos são ignorados. Use <strong>Send test now</strong> para ver quais canais realmente dispararam.',
  },
  households: {
    title: "Casas e links de compartilhamento",
    bodyHtml:
      'Convide a família por e-mail em <a class="text-link" href="/dashboard/household">Household</a>. Os membros compartilham os dispositivos e o histórico daquela casa. Todo plano inclui um <a class="text-link" href="/dashboard/share/links">link familiar ao vivo</a> para pessoas sem conta. O Pro adiciona escopos de compartilhamento mais amplos (histórico/métricas), prazos de expiração para convidados e revogação a qualquer momento.',
  },
  plans: {
    title: "Planos",
    itemsHtml: [
      "<strong>Free</strong>: sensores ao vivo, dispositivos (limitados), consulta ao histórico, alertas por e-mail/Discord, um link familiar ao vivo.",
      "<strong>Member</strong>: exportação em CSV.",
      "<strong>Pro</strong>: limites maiores de dispositivos, SMS, webhooks de saída, escopos de compartilhamento ampliados, pacote de evidências para sinistros.",
    ],
    upgradeHtml: "Mude de plano pelo cartão Plans no painel ou na página Alerts.",
  },
  admin: {
    title: "Ferramentas só para admins",
    itemsHtml: [
      "<strong>User manager</strong>: revisar contas e conceder ou revogar a função de admin.",
      "<strong>Contact submissions</strong>: ler as mensagens do formulário de contato público.",
      "<strong>Jobs</strong>: visibilidade das tarefas operacionais, quando ativado.",
    ],
  },
  firstPath: {
    title: "Primeiro caminho sugerido",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Crie uma conta</a>.',
      'Com um clique em <strong>Create push device</strong> em <a class="text-link" href="/dashboard/devices?view=setup">Devices → Setup</a> (o nome padrão é Workshop probe).',
      "Envie uma leitura via POST: os sensores são importados automaticamente; depois, defina o limite de congelamento em °F + e-mail em Devices ou em Alerts → When to alert e envie um teste.",
      'Confira os cartões no <a class="text-link" href="/dashboard/live">Live</a> e depois o status do espaço no Overview (a faixa de Status e o Insights são liberados depois do essencial).',
      "Se quiser, convide os membros da casa e compartilhe um link familiar ao vivo.",
    ],
  },
};

export default ptBr;

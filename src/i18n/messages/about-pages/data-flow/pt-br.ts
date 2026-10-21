
/** /about/data-flow body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

const ptBr: Messages = {
  introHtml:
    "Cada número da página inicial passa por várias camadas. Entender esse caminho ajuda a investigar leituras desatualizadas, sondas faltando ou buracos no histórico.",
  step1Title: "Passo 1. Medição no ambiente",
  step1Html:
    'As sondas medem temperatura e umidade. O sketch do Arduino consulta as sondas a cada poucos segundos, descarta valores claramente fora da curva e monta uma estrutura JSON na memória. Detalhes: <a class="text-link" href="/about/arduino-sketches">sketches do Arduino</a> e <a class="text-link" href="/about/temperature-probes">sondas de temperatura</a>.',
  step2Title: "Passo 2. Publicação do JSON",
  step2Html:
    'A placa ou um relay próximo expõe JSON via HTTPS. Um serviço FastAPI em Python pode guardar as respostas em cache no Redis para que a internet nunca acesse diretamente a conexão da sua casa: veja <a class="text-link" href="/about/python-feeds">scripts e feeds em Python</a>.',
  jsonAlt: "Visualizador de JSON do navegador mostrando as chaves de sonda 0, 1 e avg com Fahrenheit, Celsius e umidade",
  jsonCaption: "Formato do feed ao vivo consumido pelo site depois de sair da rede local.",
  step3Title: "Passo 3. Busca e exibição no site",
  step3Html:
    "Quando você carrega a página inicial, o servidor busca cada URL de feed configurada, interpreta as chaves das sondas e monta os cartões de leitura. Usuários conectados carregam do Supabase os próprios mapeamentos de feeds e sondas em vez dos padrões. Os dados de clima seguem um caminho paralelo pelo OpenWeather, usando a cidade que você escolher, se quiser.",
  step4Title: "Passo 4. Gravação do histórico",
  step4Html:
    'Se você estiver conectado, cada leitura bem-sucedida insere linhas no Supabase com nome do feed, rótulo e chave da sonda, temperaturas, umidade e data e hora. Visitantes continuam vendo os dados ao vivo, mas não adicionam histórico. Saiba mais em <a class="text-link" href="/about/historical-data">uso dos dados históricos</a>.',
  step5Title: "Passo 5. Painel e exportação",
  step5Html:
    'A tabela de histórico mostra essas linhas em páginas. A exportação em CSV entrega o conjunto completo para administradores e assinantes. Webhooks do Stripe mantêm a participação no grupo com permissão de exportar. As ferramentas da conta estão descritas em <a class="text-link" href="/about/accounts-and-dashboard">contas e painel</a>.',
  failuresTitle: "Pontos de falha para verificar",
  failures: [
    "Fiação ou alimentação da sonda: logs seriais no Arduino.",
    "Rede de casa ou certificado: rode curl na URL do feed a partir de um notebook conectado no 4G (LTE).",
    "Cache do relay desatualizado: reinicie a busca na origem no fast-api-relay.",
    "Mapeamento no painel: um erro de digitação na chave da sonda esconde leituras mesmo com o JSON válido.",
    "Cookies de login: o histórico só é salvo em sessões conectadas.",
  ],
};

export default ptBr;

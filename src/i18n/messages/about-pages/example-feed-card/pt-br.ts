
/** ExampleFeedCard copy (also rendered on the English-only dashboard). */
import type { ExampleFeedCardMessages } from "./en";

const ptBr: ExampleFeedCardMessages = {
  title: "Feed de exemplo baseado no clima",
  introHtml:
    "JSON público via HTTPS alimentado pelo clima externo ao vivo: três sondas de oficina simuladas mais <code>avg</code>. Use-o para testar feeds pull antes de o seu hardware ficar on-line, ou copie o payload push para testes rápidos com curl.",
  pullUrl: "URL do feed pull",
  openPull: "Abrir JSON pull",
  pushSample: "JSON de exemplo push",
  senml: "JSON SenML",
  setupDoc: "Documento de configuração",
  mappingHtml:
    "Mapeie as chaves de sonda <code>0</code>, <code>1</code>, <code>2</code> e <code>avg</code> sob a raiz JSON <code>temp</code>, ou use <code>?format=senml</code> / <code>?format=homeassistant</code> para JSON em formatos padrão do setor. Parâmetros de consulta opcionais: <code>cityId</code>, <code>door=1</code>, <code>sun=80</code>.",
};

export default ptBr;

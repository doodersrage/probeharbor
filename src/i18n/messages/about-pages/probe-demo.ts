import { defineMessages } from "../../translate";

/** /about/probe-demo page copy (the simulator island's strings live in messages/probeDemo.ts). */
const en = {
  title: "Interactive probe demo",
  description:
    "Simulate multi-zone garage temperatures. Adjust outdoor air, sun, door state, and freeze threshold using the same logic as production.",
  breadcrumbHome: "Home",
  breadcrumbAbout: "About",
  kicker: "About · Simulator",
  ctaTryReal: "Want this for my garage?",
  ctaColdSnap: "Jump to cold snap",
  ctaKit: "ESP32 freeze kit",
  heroNoteHtml:
    'Cause the change: hit <strong>Door draft</strong> and watch the door/entry zone drop vs the workbench, or <strong>Cold snap</strong> for Overview-style freeze risk. Readings refresh every two seconds with sensor-like noise. Copy <strong>Push ingest</strong> JSON for the same flat keys an ESP would POST. Placement theory: <a class="text-link" href="/about/temperature-probes">temperature probes</a> and <a class="text-link" href="/about/temperature-changes">what drives swings</a>.',
  figureCaption:
    "Real workbench context, in the simulator above, the warmest zone is the workbench/tool-bench pocket. A probe only there can look fine while the door zone is already near freeze.",
  faqTitle: "Probe demo FAQ",
  paginationAria: "About section pages",
  prev: "Temperature probes guide",
  next: "Adding devices",
};

type ProbeDemoPageMessages = typeof en;

const es: ProbeDemoPageMessages = {
  title: "Demo interactiva de sondas",
  description:
    "Simula temperaturas de garaje en varias zonas. Ajusta el aire exterior, el sol, la puerta y el umbral de helada con la misma lógica que en producción.",
  breadcrumbHome: "Inicio",
  breadcrumbAbout: "Acerca de",
  kicker: "Acerca de · Simulador",
  ctaTryReal: "¿Lo quiero para mi garaje?",
  ctaColdSnap: "Ir a la ola de frío",
  ctaKit: "Kit antiheladas ESP32",
  heroNoteHtml:
    'Provoca el cambio: pulsa <strong>Corriente en la puerta</strong> y mira cómo baja la zona de la puerta/entrada frente al banco de trabajo, o <strong>Ola de frío</strong> para ver el riesgo de helada como en Overview. Las lecturas se actualizan cada dos segundos con un ruido similar al de un sensor real. Copia el JSON de <strong>Push ingest</strong> para obtener las mismas claves planas que enviaría un ESP por POST. Teoría de colocación: <a class="text-link" href="/about/temperature-probes">sondas de temperatura</a> y <a class="text-link" href="/about/temperature-changes">qué provoca las oscilaciones</a>.',
  figureCaption:
    "Un banco de trabajo real: en el simulador de arriba, la zona más cálida es el rincón del banco de trabajo / de herramientas. Una sonda colocada solo ahí puede parecer correcta mientras la zona de la puerta ya está cerca de la helada.",
  faqTitle: "Preguntas frecuentes sobre la demo",
  paginationAria: "Páginas de la sección Acerca de",
  prev: "Guía de sondas de temperatura",
  next: "Añadir dispositivos",
};

const fr: ProbeDemoPageMessages = {
  title: "Démo interactive des sondes",
  description:
    "Simulez les températures d’un garage sur plusieurs zones. Réglez l’air extérieur, le soleil, la porte et le seuil de gel avec la même logique qu’en production.",
  breadcrumbHome: "Accueil",
  breadcrumbAbout: "À propos",
  kicker: "À propos · Simulateur",
  ctaTryReal: "Je veux ça pour mon garage",
  ctaColdSnap: "Passer à la vague de froid",
  ctaKit: "Kit antigel ESP32",
  heroNoteHtml:
    'Provoquez le changement : cliquez sur <strong>Courant d’air</strong> et regardez la zone porte/entrée baisser par rapport à l’établi, ou sur <strong>Vague de froid</strong> pour un risque de gel façon Overview. Les relevés s’actualisent toutes les deux secondes avec un bruit proche de celui d’un vrai capteur. Copiez le JSON <strong>Push ingest</strong> pour obtenir les mêmes clés à plat qu’un ESP enverrait en POST. Théorie du placement : <a class="text-link" href="/about/temperature-probes">sondes de température</a> et <a class="text-link" href="/about/temperature-changes">ce qui provoque les variations</a>.',
  figureCaption:
    "Un vrai établi : dans le simulateur ci-dessus, la zone la plus chaude est le coin de l’établi. Une sonde placée uniquement là peut sembler rassurante alors que la zone de la porte est déjà proche du gel.",
  faqTitle: "FAQ de la démo des sondes",
  paginationAria: "Pages de la section À propos",
  prev: "Guide des sondes de température",
  next: "Ajouter des appareils",
};

const de: ProbeDemoPageMessages = {
  title: "Interaktive Fühler-Demo",
  description:
    "Simuliere Temperaturen in mehreren Garagenzonen. Stell Außenluft, Sonne, Torstatus und Frostschwelle mit derselben Logik wie im echten Betrieb ein.",
  breadcrumbHome: "Startseite",
  breadcrumbAbout: "Über",
  kicker: "Über · Simulator",
  ctaTryReal: "Will ich für meine Garage",
  ctaColdSnap: "Zum Kälteeinbruch",
  ctaKit: "ESP32-Frostkit",
  heroNoteHtml:
    'Lös die Änderung selbst aus: Klick auf <strong>Zugluft am Tor</strong> und sieh zu, wie der Tor-/Eingangsbereich gegenüber der Werkbank abfällt, oder auf <strong>Kälteeinbruch</strong> für Frostgefahr wie in Overview. Die Messwerte aktualisieren sich alle zwei Sekunden mit sensortypischem Rauschen. Kopiere das <strong>Push ingest</strong>-JSON für dieselben flachen Schlüssel, die ein ESP per POST senden würde. Theorie zur Platzierung: <a class="text-link" href="/about/temperature-probes">Temperaturfühler</a> und <a class="text-link" href="/about/temperature-changes">was Schwankungen verursacht</a>.',
  figureCaption:
    "Eine echte Werkbank: Im Simulator oben ist die Werkbank-/Werkzeugbank-Ecke die wärmste Zone. Ein Fühler nur dort kann unauffällig wirken, während der Torbereich schon nahe am Frost ist.",
  faqTitle: "FAQ zur Fühler-Demo",
  paginationAria: "Seiten im Bereich Über",
  prev: "Leitfaden Temperaturfühler",
  next: "Geräte hinzufügen",
};

const ptBr: ProbeDemoPageMessages = {
  title: "Demo interativa de sondas",
  description:
    "Simule temperaturas em várias zonas da garagem. Ajuste o ar externo, o sol, a porta e o limite de congelamento com a mesma lógica da produção.",
  breadcrumbHome: "Início",
  breadcrumbAbout: "Sobre",
  kicker: "Sobre · Simulador",
  ctaTryReal: "Quero isso na minha garagem",
  ctaColdSnap: "Ir para a onda de frio",
  ctaKit: "Kit antecongelamento ESP32",
  heroNoteHtml:
    'Provoque a mudança: clique em <strong>Corrente de ar na porta</strong> e veja a zona da porta/entrada cair em relação à bancada, ou em <strong>Onda de frio</strong> para ver o risco de congelamento como no Overview. As leituras se atualizam a cada dois segundos com um ruído parecido com o de um sensor real. Copie o JSON de <strong>Push ingest</strong> para ter as mesmas chaves planas que um ESP enviaria por POST. Teoria de posicionamento: <a class="text-link" href="/about/temperature-probes">sondas de temperatura</a> e <a class="text-link" href="/about/temperature-changes">o que causa as variações</a>.',
  figureCaption:
    "Uma bancada de verdade: no simulador acima, a zona mais quente é o canto da bancada de trabalho / de ferramentas. Uma sonda só ali pode parecer tranquila enquanto a zona da porta já está perto do congelamento.",
  faqTitle: "Perguntas frequentes sobre a demo",
  paginationAria: "Páginas da seção Sobre",
  prev: "Guia de sondas de temperatura",
  next: "Adicionar dispositivos",
};

export const probeDemoPageMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

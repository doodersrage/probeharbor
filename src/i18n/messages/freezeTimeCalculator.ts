import type { AboutFaqItem } from "../../lib/aboutFaqs";
import {
  FREEZE_TIME_CALCULATOR_TEXT,
  type FreezeTimeCalculatorText,
} from "../../components/FreezeTimeCalculator";
import { defineMessages } from "../translate";

/**
 * /freeze-time-calculator page copy plus the calculator island's strings
 * (`calculator`, passed as its `text` prop). Island templates use `{name}`
 * placeholders, filled in the browser.
 */
const en = {
  title: "Pipe freeze time calculator",
  description:
    "Enter two temperature readings and a freeze threshold to estimate how many hours a garage, crawlspace, or cabin has before it gets cold enough to freeze pipes.",
  breadcrumbHome: "Home",
  kicker: "Tool",
  heading: "How long until this space reaches freezing?",
  lede: "Read a thermometer in the space now, compare it with a reading from earlier, and see roughly how many hours are left before it reaches your freeze threshold at the current cooling rate.",
  startFree: "Start free",
  howLongLink: "How long pipes take to freeze",
  readingTitle: "Reading the result",
  readingIntro:
    "The estimate assumes the space keeps cooling at the rate you measured. Use it to decide how urgent tonight is: an hour or two means act now, a day or more means check again later.",
  readingLinksHtml:
    'Pipes on exterior walls and near doors run colder than the room, so measure as close to the pipe as you can. See <a class="text-link" href="/answers/garage-pipe-freeze-temperature">when garage pipes freeze</a>, <a class="text-link" href="/answers/freeze-alarm-temperature-setting">where to set a freeze alarm</a>, and <a class="text-link" href="/about/time-to-freeze">how the time-to-freeze clock works</a> in the dashboard.',
  sensorTitle: "Let a sensor do the arithmetic",
  sensorBody:
    "A probe on the pipe reports every few minutes, so the estimate updates on its own and an alert reaches you before the threshold. The free plan includes email alerts; bring an ESP32 probe or connect Home Assistant.",
  seeDemo: "See the live demo",
  faqs: [
    {
      question: "How does the calculator work?",
      answer:
        "It takes the cooling rate between your two readings and extends it in a straight line to your threshold. If the space fell 2°F in the last hour and is 10°F above the threshold, the estimate is five hours.",
    },
    {
      question: "How accurate is the estimate?",
      answer:
        "It is a runway, not a stopwatch. A space cools more slowly as it nears the outdoor temperature and faster if the wind picks up or a door opens, so redo it with fresh readings every hour or so.",
    },
    {
      question: "What threshold should I use?",
      answer:
        "34–38°F measured at the pipe. Reaching the threshold does not mean the pipe has frozen; it means there is still time to restore heat, close a door, or open a faucet.",
    },
    {
      question: "Can this run automatically?",
      answer:
        "Yes. ProbeHarbor does the same calculation continuously from your sensor's readings on every plan and shows it as a time-to-freeze clock, with an alert when the space reaches your threshold.",
    },
  ] as AboutFaqItem[],
  calculator: FREEZE_TIME_CALCULATOR_TEXT as FreezeTimeCalculatorText,
};

type FreezeTimeCalculatorMessages = typeof en;

const es: FreezeTimeCalculatorMessages = {
  title: "Calculadora de tiempo de congelación de tuberías",
  description:
    "Con dos lecturas de temperatura y un umbral de helada, estima cuántas horas faltan para que un garaje, sótano o cabaña congele las tuberías.",
  breadcrumbHome: "Inicio",
  kicker: "Herramienta",
  heading: "¿Cuánto falta para que este espacio llegue a la helada?",
  lede: "Lee ahora un termómetro en el espacio, compáralo con una lectura anterior y calcula aproximadamente cuántas horas quedan hasta que llegue a tu umbral de helada al ritmo de enfriamiento actual.",
  startFree: "Empieza gratis",
  howLongLink: "Cuánto tardan en congelarse las tuberías",
  readingTitle: "Cómo interpretar el resultado",
  readingIntro:
    "La estimación supone que el espacio sigue enfriándose al ritmo que mediste. Úsala para decidir cuán urgente es esta noche: una o dos horas significa actuar ya; un día o más, volver a comprobar más tarde.",
  readingLinksHtml:
    'Las tuberías en paredes exteriores y cerca de puertas están más frías que la habitación, así que mide lo más cerca posible de la tubería. Consulta <a class="text-link" href="/answers/garage-pipe-freeze-temperature">cuándo se congelan las tuberías del garaje</a>, <a class="text-link" href="/answers/freeze-alarm-temperature-setting">a qué temperatura configurar una alarma de helada</a> y <a class="text-link" href="/about/time-to-freeze">cómo funciona el reloj de tiempo hasta la helada</a> del panel.',
  sensorTitle: "Deja que un sensor haga las cuentas",
  sensorBody:
    "Una sonda en la tubería informa cada pocos minutos, así que la estimación se actualiza sola y te llega una alerta antes del umbral. El plan gratuito incluye alertas por correo; usa una sonda ESP32 o conecta Home Assistant.",
  seeDemo: "Ver la demo en vivo",
  faqs: [
    {
      question: "¿Cómo funciona la calculadora?",
      answer:
        "Toma el ritmo de enfriamiento entre tus dos lecturas y lo prolonga en línea recta hasta tu umbral. Si el espacio bajó 1 °C (2 °F) en la última hora y está 5,5 °C (10 °F) por encima del umbral, la estimación es de cinco horas.",
    },
    {
      question: "¿Qué tan precisa es la estimación?",
      answer:
        "Es un margen, no un cronómetro. Un espacio se enfría más despacio a medida que se acerca a la temperatura exterior y más rápido si sube el viento o se abre una puerta, así que repite el cálculo con lecturas nuevas más o menos cada hora.",
    },
    {
      question: "¿Qué umbral debo usar?",
      answer:
        "Entre 1 y 3 °C (34–38 °F) medidos en la tubería. Llegar al umbral no significa que la tubería se haya congelado: significa que aún hay tiempo para recuperar la calefacción, cerrar una puerta o abrir un grifo.",
    },
    {
      question: "¿Puede hacerse automáticamente?",
      answer:
        "Sí. ProbeHarbor hace el mismo cálculo de forma continua con las lecturas de tu sensor en todos los planes y lo muestra como un reloj de tiempo hasta la helada, con una alerta cuando el espacio llega a tu umbral.",
    },
  ],
  calculator: {
    heading: "Calculadora",
    unitLegend: "Unidad de temperatura",
    nowLabel: "Temperatura ahora (°{unit})",
    nowHint: "En la tubería si puedes; si no, el aire cercano.",
    earlierLabel: "Temperatura anterior (°{unit})",
    earlierHint: "Mismo sensor, mismo lugar.",
    minutesLabel: "Minutos entre lecturas",
    minutesHint: "15 o más; una hora da una tendencia más estable.",
    thresholdLabel: "Umbral de helada (°{unit})",
    thresholdHint: "{low}–{high} deja tiempo para actuar antes de {freezing}.",
    resultLabel: "Tiempo hasta el umbral",
    headlineEmpty: "Introduce cuatro números",
    headlineAtThreshold: "Ya en el umbral",
    headlineNotCooling: "No se está enfriando hacia la helada",
    headlineNeedGap: "Hace falta más tiempo entre lecturas",
    detailEmpty: "Rellena todos los campos con un número para ver una estimación.",
    detailCooling: "Enfriamiento de ~{rate}: unas {duration} hasta {threshold} a este ritmo.",
    ratePerHour: "{value}°{unit}/h",
    minutes: "{n} minutos",
    hours: "{n} horas",
    days: "{n} días",
    msgAtThreshold: "Ya está en tu umbral de helada o por debajo.",
    msgNeedReadings: "Hacen falta lecturas más recientes para estimar una tendencia.",
    msgTooClose: "Las lecturas están demasiado juntas para calcular una tendencia.",
    msgRising: "La temperatura está subiendo: la tendencia actual no indica riesgo de helada.",
    msgStable: "La temperatura está estable: la tendencia no indica una helada inminente.",
    reset: "Restablecer ejemplo",
  },
};

const fr: FreezeTimeCalculatorMessages = {
  title: "Calculateur de délai de gel des canalisations",
  description:
    "Deux relevés de température et un seuil de gel suffisent pour estimer combien d’heures il reste avant le gel des canalisations d’un garage ou d’un chalet.",
  breadcrumbHome: "Accueil",
  kicker: "Outil",
  heading: "Dans combien de temps cet espace atteindra-t-il le gel ?",
  lede: "Relevez un thermomètre dans l’espace maintenant, comparez avec un relevé précédent et voyez à peu près combien d’heures il reste avant d’atteindre votre seuil de gel au rythme de refroidissement actuel.",
  startFree: "Commencer gratuitement",
  howLongLink: "Combien de temps les canalisations mettent à geler",
  readingTitle: "Interpréter le résultat",
  readingIntro:
    "L’estimation suppose que l’espace continue de se refroidir au rythme mesuré. Servez-vous-en pour juger de l’urgence de la nuit : une heure ou deux, il faut agir maintenant ; un jour ou plus, revérifiez plus tard.",
  readingLinksHtml:
    'Les canalisations sur les murs extérieurs et près des portes sont plus froides que la pièce : mesurez donc au plus près du tuyau. Voir <a class="text-link" href="/answers/garage-pipe-freeze-temperature">quand les canalisations du garage gèlent</a>, <a class="text-link" href="/answers/freeze-alarm-temperature-setting">à quelle température régler une alarme de gel</a> et <a class="text-link" href="/about/time-to-freeze">comment fonctionne le compte à rebours avant le gel</a> du tableau de bord.',
  sensorTitle: "Laissez un capteur faire le calcul",
  sensorBody:
    "Une sonde sur la canalisation envoie un relevé toutes les quelques minutes : l’estimation se met à jour toute seule et une alerte vous parvient avant le seuil. L’offre gratuite inclut les alertes par e-mail ; utilisez une sonde ESP32 ou connectez Home Assistant.",
  seeDemo: "Voir la démo en direct",
  faqs: [
    {
      question: "Comment fonctionne le calculateur ?",
      answer:
        "Il prend le rythme de refroidissement entre vos deux relevés et le prolonge en ligne droite jusqu’à votre seuil. Si l’espace a perdu 1 °C (2 °F) au cours de la dernière heure et se trouve 5,5 °C (10 °F) au-dessus du seuil, l’estimation est de cinq heures.",
    },
    {
      question: "L’estimation est-elle précise ?",
      answer:
        "C’est une marge, pas un chronomètre. Un espace se refroidit plus lentement à mesure qu’il approche de la température extérieure, et plus vite si le vent se lève ou si une porte s’ouvre : refaites le calcul avec des relevés récents environ toutes les heures.",
    },
    {
      question: "Quel seuil choisir ?",
      answer:
        "Entre 1 et 3 °C (34–38 °F), mesurés au niveau de la canalisation. Atteindre le seuil ne signifie pas que le tuyau a gelé : cela signifie qu’il reste du temps pour rétablir le chauffage, fermer une porte ou ouvrir un robinet.",
    },
    {
      question: "Ce calcul peut-il se faire automatiquement ?",
      answer:
        "Oui. ProbeHarbor effectue le même calcul en continu à partir des relevés de votre capteur, quelle que soit l’offre, et l’affiche sous forme de compte à rebours avant le gel, avec une alerte quand l’espace atteint votre seuil.",
    },
  ],
  calculator: {
    heading: "Calculateur",
    unitLegend: "Unité de température",
    nowLabel: "Température actuelle (°{unit})",
    nowHint: "Au niveau du tuyau si possible, sinon l’air à proximité.",
    earlierLabel: "Température précédente (°{unit})",
    earlierHint: "Même capteur, même endroit.",
    minutesLabel: "Minutes entre les relevés",
    minutesHint: "15 ou plus ; une heure donne une tendance plus fiable.",
    thresholdLabel: "Seuil de gel (°{unit})",
    thresholdHint: "{low}–{high} laisse le temps d’agir avant {freezing}.",
    resultLabel: "Temps avant le seuil",
    headlineEmpty: "Saisissez quatre nombres",
    headlineAtThreshold: "Seuil déjà atteint",
    headlineNotCooling: "Pas de refroidissement vers le gel",
    headlineNeedGap: "Écart trop court entre les relevés",
    detailEmpty: "Remplissez chaque champ avec un nombre pour obtenir une estimation.",
    detailCooling: "Refroidissement d’environ {rate} : à peu près {duration} avant {threshold} à ce rythme.",
    ratePerHour: "{value}°{unit}/h",
    minutes: "{n} minutes",
    hours: "{n} heures",
    days: "{n} jours",
    msgAtThreshold: "Déjà au niveau de votre seuil de gel ou en dessous.",
    msgNeedReadings: "Il faut des relevés plus récents pour estimer une tendance.",
    msgTooClose: "Les relevés sont trop rapprochés pour dégager une tendance.",
    msgRising: "La température monte : aucun risque de gel selon la tendance actuelle.",
    msgStable: "La température est stable : la tendance n’annonce pas de gel imminent.",
    reset: "Rétablir l’exemple",
  },
};

const de: FreezeTimeCalculatorMessages = {
  title: "Rechner: Zeit bis zum Rohrfrost",
  description:
    "Schätze mit zwei Temperaturwerten und einer Frostschwelle, wie viele Stunden Garage, Kriechkeller oder Hütte bis zum Rohrfrost bleiben.",
  breadcrumbHome: "Startseite",
  kicker: "Tool",
  heading: "Wie lange, bis dieser Raum den Gefrierpunkt erreicht?",
  lede: "Lies jetzt ein Thermometer im Raum ab, vergleiche es mit einem früheren Messwert und sieh, wie viele Stunden ungefähr bleiben, bis der Raum bei der aktuellen Abkühlrate deine Frostschwelle erreicht.",
  startFree: "Kostenlos starten",
  howLongLink: "Wie lange Rohre zum Einfrieren brauchen",
  readingTitle: "Das Ergebnis lesen",
  readingIntro:
    "Die Schätzung geht davon aus, dass der Raum mit der gemessenen Rate weiter abkühlt. Nutze sie, um einzuschätzen, wie dringend es heute Nacht ist: Ein bis zwei Stunden heißt jetzt handeln, ein Tag oder mehr heißt später noch einmal nachsehen.",
  readingLinksHtml:
    'Rohre an Außenwänden und in der Nähe von Türen sind kälter als der Raum, also miss so nah am Rohr wie möglich. Siehe <a class="text-link" href="/answers/garage-pipe-freeze-temperature">wann Rohre in der Garage einfrieren</a>, <a class="text-link" href="/answers/freeze-alarm-temperature-setting">wo du einen Frostalarm einstellen solltest</a> und <a class="text-link" href="/about/time-to-freeze">wie die Frost-Countdown-Uhr</a> im Dashboard funktioniert.',
  sensorTitle: "Lass einen Sensor rechnen",
  sensorBody:
    "Eine Sonde am Rohr meldet sich alle paar Minuten, so aktualisiert sich die Schätzung von selbst und ein Alarm erreicht dich vor der Schwelle. Der Free-Tarif enthält E-Mail-Alarme; nimm eine ESP32-Sonde oder verbinde Home Assistant.",
  seeDemo: "Live-Demo ansehen",
  faqs: [
    {
      question: "Wie funktioniert der Rechner?",
      answer:
        "Er nimmt die Abkühlrate zwischen deinen beiden Messwerten und verlängert sie geradlinig bis zu deiner Schwelle. Ist der Raum in der letzten Stunde um 1 °C (2 °F) gefallen und liegt 5,5 °C (10 °F) über der Schwelle, beträgt die Schätzung fünf Stunden.",
    },
    {
      question: "Wie genau ist die Schätzung?",
      answer:
        "Sie ist ein Puffer, keine Stoppuhr. Ein Raum kühlt langsamer ab, je näher er der Außentemperatur kommt, und schneller, wenn Wind aufkommt oder eine Tür aufgeht. Rechne deshalb etwa jede Stunde mit frischen Messwerten neu.",
    },
    {
      question: "Welche Schwelle sollte ich wählen?",
      answer:
        "1–3 °C (34–38 °F), am Rohr gemessen. Das Erreichen der Schwelle heißt nicht, dass das Rohr gefroren ist, sondern dass noch Zeit bleibt, die Heizung wieder in Gang zu bringen, eine Tür zu schließen oder einen Wasserhahn aufzudrehen.",
    },
    {
      question: "Geht das auch automatisch?",
      answer:
        "Ja. ProbeHarbor macht dieselbe Rechnung in jedem Tarif laufend aus den Messwerten deines Sensors und zeigt sie als Frost-Countdown-Uhr an, mit einem Alarm, sobald der Raum deine Schwelle erreicht.",
    },
  ],
  calculator: {
    heading: "Rechner",
    unitLegend: "Temperatureinheit",
    nowLabel: "Temperatur jetzt (°{unit})",
    nowHint: "Am Rohr, wenn möglich, sonst die Luft daneben.",
    earlierLabel: "Temperatur vorher (°{unit})",
    earlierHint: "Gleicher Sensor, gleiche Stelle.",
    minutesLabel: "Minuten zwischen den Messungen",
    minutesHint: "15 oder mehr; eine Stunde ergibt einen stabileren Trend.",
    thresholdLabel: "Frostschwelle (°{unit})",
    thresholdHint: "{low}–{high} lässt Zeit zum Handeln vor {freezing}.",
    resultLabel: "Zeit bis zur Schwelle",
    headlineEmpty: "Gib vier Zahlen ein",
    headlineAtThreshold: "Schwelle schon erreicht",
    headlineNotCooling: "Kühlt nicht Richtung Frost ab",
    headlineNeedGap: "Größerer Abstand nötig",
    detailEmpty: "Fülle jedes Feld mit einer Zahl aus, um eine Schätzung zu sehen.",
    detailCooling: "Abkühlung um ~{rate}: bei dieser Rate etwa {duration} bis {threshold}.",
    ratePerHour: "{value}°{unit}/h",
    minutes: "{n} Minuten",
    hours: "{n} Stunden",
    days: "{n} Tage",
    msgAtThreshold: "Bereits auf oder unter deiner Frostschwelle.",
    msgNeedReadings: "Für einen Trend werden neuere Messwerte gebraucht.",
    msgTooClose: "Die Messwerte liegen für einen Trend zu dicht beieinander.",
    msgRising: "Die Temperatur steigt, nach aktuellem Trend keine Frostgefahr.",
    msgStable: "Die Temperatur ist stabil: Der Trend deutet nicht auf baldigen Frost hin.",
    reset: "Beispiel wiederherstellen",
  },
};

const ptBr: FreezeTimeCalculatorMessages = {
  title: "Calculadora de tempo até o congelamento",
  description:
    "Com duas leituras de temperatura e um limite, estime quantas horas faltam até uma garagem, porão ou cabana ficar fria o bastante para congelar os canos.",
  breadcrumbHome: "Início",
  kicker: "Ferramenta",
  heading: "Quanto tempo até este espaço chegar ao congelamento?",
  lede: "Leia agora um termômetro no espaço, compare com uma leitura anterior e veja aproximadamente quantas horas faltam até ele chegar ao seu limite de congelamento no ritmo atual de resfriamento.",
  startFree: "Comece grátis",
  howLongLink: "Quanto tempo os canos levam para congelar",
  readingTitle: "Como ler o resultado",
  readingIntro:
    "A estimativa supõe que o espaço continua esfriando no ritmo que você mediu. Use-a para decidir o quanto esta noite é urgente: uma ou duas horas significa agir agora; um dia ou mais significa conferir de novo mais tarde.",
  readingLinksHtml:
    'Canos em paredes externas e perto de portas ficam mais frios que o ambiente, então meça o mais perto possível do cano. Veja <a class="text-link" href="/answers/garage-pipe-freeze-temperature">quando os canos da garagem congelam</a>, <a class="text-link" href="/answers/freeze-alarm-temperature-setting">em que temperatura configurar um alarme de congelamento</a> e <a class="text-link" href="/about/time-to-freeze">como funciona o relógio de tempo até o congelamento</a> no painel.',
  sensorTitle: "Deixe um sensor fazer a conta",
  sensorBody:
    "Uma sonda no cano envia leituras a cada poucos minutos, então a estimativa se atualiza sozinha e um alerta chega até você antes do limite. O plano gratuito inclui alertas por e-mail; use uma sonda ESP32 ou conecte o Home Assistant.",
  seeDemo: "Veja a demo ao vivo",
  faqs: [
    {
      question: "Como a calculadora funciona?",
      answer:
        "Ela pega o ritmo de resfriamento entre suas duas leituras e o prolonga em linha reta até o seu limite. Se o espaço caiu 1 °C (2 °F) na última hora e está 5,5 °C (10 °F) acima do limite, a estimativa é de cinco horas.",
    },
    {
      question: "Qual a precisão da estimativa?",
      answer:
        "É uma margem, não um cronômetro. Um espaço esfria mais devagar à medida que se aproxima da temperatura externa e mais rápido se o vento aumentar ou uma porta abrir, então refaça a conta com leituras novas mais ou menos a cada hora.",
    },
    {
      question: "Que limite devo usar?",
      answer:
        "De 1 a 3 °C (34–38 °F), medidos no cano. Chegar ao limite não significa que o cano congelou; significa que ainda há tempo para restabelecer o aquecimento, fechar uma porta ou abrir uma torneira.",
    },
    {
      question: "Dá para fazer isso automaticamente?",
      answer:
        "Sim. O ProbeHarbor faz o mesmo cálculo continuamente com as leituras do seu sensor em todos os planos e mostra o resultado como um relógio de tempo até o congelamento, com um alerta quando o espaço chega ao seu limite.",
    },
  ],
  calculator: {
    heading: "Calculadora",
    unitLegend: "Unidade de temperatura",
    nowLabel: "Temperatura agora (°{unit})",
    nowHint: "No cano, se der; senão, o ar perto dele.",
    earlierLabel: "Temperatura anterior (°{unit})",
    earlierHint: "Mesmo sensor, mesmo lugar.",
    minutesLabel: "Minutos entre as leituras",
    minutesHint: "15 ou mais; uma hora dá uma tendência mais estável.",
    thresholdLabel: "Limite de congelamento (°{unit})",
    thresholdHint: "{low}–{high} deixa tempo para agir antes de {freezing}.",
    resultLabel: "Tempo até o limite",
    headlineEmpty: "Informe quatro números",
    headlineAtThreshold: "Já no limite",
    headlineNotCooling: "Não está esfriando rumo ao congelamento",
    headlineNeedGap: "Precisa de um intervalo maior",
    detailEmpty: "Preencha todos os campos com um número para ver uma estimativa.",
    detailCooling: "Esfriando ~{rate}: cerca de {duration} até {threshold} neste ritmo.",
    ratePerHour: "{value}°{unit}/h",
    minutes: "{n} minutos",
    hours: "{n} horas",
    days: "{n} dias",
    msgAtThreshold: "Já está no seu limite de congelamento ou abaixo dele.",
    msgNeedReadings: "São necessárias leituras mais recentes para estimar uma tendência.",
    msgTooClose: "As leituras estão próximas demais para indicar uma tendência.",
    msgRising: "A temperatura está subindo: a tendência atual não indica risco de congelamento.",
    msgStable: "A temperatura está estável: a tendência não indica congelamento iminente.",
    reset: "Restaurar exemplo",
  },
};

export const freezeTimeCalculatorMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

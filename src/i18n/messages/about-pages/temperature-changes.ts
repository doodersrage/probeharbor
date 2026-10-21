import { defineMessages } from "../../translate";

/** /about/temperature-changes body copy. `*Html` keys are trusted inline HTML (English hrefs). */
const en = {
  introHtml:
    "Temperature in unheated spaces rarely sits still. It climbs when the sun hits the roof, drops after a cold front passes, and spikes the moment a bay door opens. Understanding what drives those changes helps you interpret probe readings instead of treating every swing as an equipment fault.",
  dailyTitle: "Daily patterns",
  dailyHtml:
    "Even without HVAC, most of these spaces follow a diurnal rhythm. Overnight, the structure radiates heat to the sky and interior air cools. Morning sun warms the roof deck first; that heat conducts downward over the next several hours. A probe on an east wall may peak before noon while a west wall sensor peaks near sunset. Humidity often rises when warm air cools against a cold concrete slab.",
  seasonalTitle: "Seasonal shifts",
  seasonalHtml:
    "Winter brings longer cold-soak periods: the slab, framing, and contents all act as thermal mass that resists quick recovery. Summer inverts the problem: attic heat and radiant roof load can push indoor air above outdoor temperature unless ventilation or insulation intervenes. Historical data makes seasonal comparison obvious: the same probe in January and July tells two different stories.",
  suddenTitle: "What causes sudden changes",
  sudden: [
    "<strong>Door operation:</strong> A single open bay can exchange a large fraction of air in minutes.",
    "<strong>Vehicle entry:</strong> Warm engines, wet tires, and snow melt add heat and moisture pulses.",
    "<strong>Weather fronts:</strong> Rapid outdoor drops pull air in attached or semi-conditioned spaces down with a delay of one to three hours.",
    "<strong>Sun breaks after cloud cover:</strong> Roof surfaces can jump tens of degrees in under an hour.",
    "<strong>Running equipment:</strong> Compressors, dryers, and space heaters create localized hot spots.",
  ],
  massTitle: "Thermal mass and lag",
  massHtml:
    "Concrete floors and masonry walls store energy. That is why probe temperature often peaks hours after maximum outdoor temperature. It also explains slow recovery after a cold snap: the space may stay below freezing inside even when the afternoon air outside is above 32 °F. When you review charts, compare probe trends with outdoor weather on the home page block to separate building effects from ambient weather.",
  humidityTitle: "Humidity moves differently than temperature",
  humidityHtml:
    "Relative humidity rises when air cools without removing moisture: common when a warm day gives way to a clear night against a cold slab. Absolute moisture sources (rain on cars, snow melt, leaks) can spike humidity without much temperature change. Watching both values together prevents false conclusions: a “dry cold” day outdoors can still feel damp inside the space.",
  decisionsTitle: "Using changes for decisions",
  decisionsHtml:
    'Short-term swings suggest ventilation or door habits. Multi-day trends suggest insulation or dehumidification work. Saved history on the <a class="text-link" href="/dashboard/history">reading history</a> page turns those patterns into evidence for maintenance budgets. For how snapshots are stored and exported, see <a class="text-link" href="/about/historical-data">historical temperature data usage</a>.',
};

type Messages = typeof en;

const es: Messages = {
  introHtml:
    "La temperatura en los espacios sin calefacción casi nunca está quieta. Sube cuando el sol da en el tejado, baja cuando pasa un frente frío y se dispara en cuanto se abre un portón. Entender qué provoca esos cambios te ayuda a interpretar las lecturas de las sondas en lugar de tomar cada oscilación por una avería.",
  dailyTitle: "Patrones diarios",
  dailyHtml:
    "Incluso sin climatización, la mayoría de estos espacios siguen un ritmo diario. Por la noche, la estructura irradia calor hacia el cielo y el aire interior se enfría. El sol de la mañana calienta primero la cubierta, y ese calor se transmite hacia abajo durante las horas siguientes. Una sonda en una pared este puede alcanzar su máximo antes del mediodía, mientras que un sensor en una pared oeste lo hace cerca del atardecer. La humedad suele subir cuando el aire cálido se enfría sobre una losa de hormigón fría.",
  seasonalTitle: "Cambios estacionales",
  seasonalHtml:
    "El invierno trae periodos más largos de frío acumulado: la losa, la estructura y lo que hay dentro actúan como masa térmica que se resiste a recuperarse rápido. El verano invierte el problema: el calor del ático y la radiación del tejado pueden subir el aire interior por encima de la temperatura exterior si la ventilación o el aislamiento no lo impiden. Con datos históricos, la comparación estacional salta a la vista: la misma sonda cuenta dos historias distintas en enero y en julio.",
  suddenTitle: "Qué provoca los cambios bruscos",
  sudden: [
    "<strong>Uso de las puertas:</strong> un solo portón abierto puede renovar gran parte del aire en minutos.",
    "<strong>Entrada de vehículos:</strong> motores calientes, neumáticos mojados y nieve derretida aportan picos de calor y humedad.",
    "<strong>Frentes meteorológicos:</strong> las caídas rápidas en el exterior arrastran hacia abajo el aire de espacios anexos o semiclimatizados con un retraso de una a tres horas.",
    "<strong>Claros tras las nubes:</strong> la superficie del tejado puede subir muchos grados en menos de una hora.",
    "<strong>Equipos en marcha:</strong> compresores, secadoras y estufas crean puntos calientes localizados.",
  ],
  massTitle: "Masa térmica y retraso",
  massHtml:
    "Los suelos de hormigón y los muros de obra almacenan energía. Por eso la temperatura de la sonda suele alcanzar su máximo horas después del máximo exterior. También explica la lenta recuperación tras una ola de frío: el interior puede seguir bajo cero aunque por la tarde el aire exterior esté por encima de 0 °C (32 °F). Al revisar los gráficos, compara las tendencias de las sondas con el bloque del tiempo exterior de la página principal para separar los efectos del edificio de la meteorología.",
  humidityTitle: "La humedad no se mueve igual que la temperatura",
  humidityHtml:
    "La humedad relativa sube cuando el aire se enfría sin perder humedad: algo habitual cuando un día templado da paso a una noche despejada sobre una losa fría. Las fuentes de humedad absoluta (lluvia en los coches, nieve derretida, fugas) pueden disparar la humedad sin apenas cambio de temperatura. Observar ambos valores juntos evita conclusiones erróneas: un día de «frío seco» en el exterior puede notarse húmedo dentro.",
  decisionsTitle: "Usar los cambios para decidir",
  decisionsHtml:
    'Las oscilaciones a corto plazo apuntan a la ventilación o a cómo usas las puertas. Las tendencias de varios días apuntan a trabajos de aislamiento o deshumidificación. El historial guardado en la página de <a class="text-link" href="/dashboard/history">historial de lecturas</a> convierte esos patrones en pruebas para el presupuesto de mantenimiento. Para saber cómo se guardan y exportan las instantáneas, consulta <a class="text-link" href="/about/historical-data">uso de los datos históricos de temperatura</a>.',
};

const fr: Messages = {
  introHtml:
    "Dans les espaces non chauffés, la température reste rarement stable. Elle grimpe quand le soleil frappe le toit, chute après le passage d’un front froid et bondit dès qu’une porte de garage s’ouvre. Comprendre l’origine de ces variations aide à interpréter les mesures des sondes au lieu de prendre chaque écart pour une panne.",
  dailyTitle: "Cycles quotidiens",
  dailyHtml:
    "Même sans chauffage ni climatisation, la plupart de ces espaces suivent un rythme jour-nuit. La nuit, le bâtiment rayonne sa chaleur vers le ciel et l’air intérieur se refroidit. Le soleil du matin réchauffe d’abord la toiture, puis cette chaleur descend par conduction au fil des heures suivantes. Une sonde sur un mur est peut atteindre son maximum avant midi, tandis qu’un capteur sur un mur ouest culmine vers le coucher du soleil. L’humidité augmente souvent quand l’air chaud se refroidit au contact d’une dalle de béton froide.",
  seasonalTitle: "Variations saisonnières",
  seasonalHtml:
    "L’hiver apporte de longues périodes de froid accumulé : la dalle, la charpente et le contenu forment une masse thermique qui freine la remontée des températures. L’été inverse le problème : la chaleur des combles et le rayonnement du toit peuvent porter l’air intérieur au-dessus de la température extérieure, sauf si la ventilation ou l’isolation s’en mêlent. Les données historiques rendent la comparaison saisonnière évidente : la même sonde raconte deux histoires différentes en janvier et en juillet.",
  suddenTitle: "Ce qui provoque des variations brusques",
  sudden: [
    "<strong>Ouverture des portes :</strong> une seule porte de garage ouverte peut renouveler une grande partie de l’air en quelques minutes.",
    "<strong>Entrée d’un véhicule :</strong> moteur chaud, pneus mouillés et neige fondue apportent des pics de chaleur et d’humidité.",
    "<strong>Fronts météo :</strong> une chute rapide à l’extérieur entraîne l’air des espaces attenants ou partiellement chauffés vers le bas avec un décalage d’une à trois heures.",
    "<strong>Éclaircies après un ciel couvert :</strong> la surface du toit peut gagner de nombreux degrés en moins d’une heure.",
    "<strong>Appareils en marche :</strong> compresseurs, sèche-linge et chauffages d’appoint créent des points chauds localisés.",
  ],
  massTitle: "Inertie thermique et décalage",
  massHtml:
    "Les sols en béton et les murs maçonnés stockent l’énergie. C’est pourquoi la température d’une sonde culmine souvent plusieurs heures après le maximum extérieur. Cela explique aussi la lente remontée après une vague de froid : l’intérieur peut rester sous zéro même quand l’air extérieur dépasse 0 °C (32 °F) l’après-midi. En consultant les graphiques, comparez les tendances des sondes avec le bloc météo extérieure de la page d’accueil pour distinguer les effets du bâtiment de ceux de la météo.",
  humidityTitle: "L’humidité n’évolue pas comme la température",
  humidityHtml:
    "L’humidité relative augmente quand l’air se refroidit sans perdre d’eau : c’est courant quand une journée douce laisse place à une nuit claire au-dessus d’une dalle froide. Les sources d’humidité absolue (pluie sur les voitures, neige fondue, fuites) peuvent faire bondir l’humidité sans grand changement de température. Suivre les deux valeurs ensemble évite les conclusions hâtives : une journée de « froid sec » dehors peut rester humide à l’intérieur.",
  decisionsTitle: "S’appuyer sur les variations pour décider",
  decisionsHtml:
    'Des écarts de courte durée renvoient à la ventilation ou à l’usage des portes. Des tendances sur plusieurs jours appellent des travaux d’isolation ou de déshumidification. L’historique enregistré sur la page <a class="text-link" href="/dashboard/history">historique des mesures</a> transforme ces tendances en éléments concrets pour votre budget d’entretien. Pour savoir comment les instantanés sont stockés et exportés, voir <a class="text-link" href="/about/historical-data">utilisation des données historiques de température</a>.',
};

const de: Messages = {
  introHtml:
    "In unbeheizten Räumen bleibt die Temperatur selten konstant. Sie steigt, wenn die Sonne aufs Dach scheint, fällt nach einer Kaltfront und schnellt hoch, sobald ein Garagentor aufgeht. Wer versteht, was diese Schwankungen auslöst, kann Fühlerwerte richtig deuten, statt jede Änderung für einen Gerätefehler zu halten.",
  dailyTitle: "Tagesverläufe",
  dailyHtml:
    "Auch ohne Heizung oder Klimaanlage folgen die meisten dieser Räume einem Tag-Nacht-Rhythmus. Nachts strahlt das Gebäude Wärme in den Himmel ab und die Innenluft kühlt aus. Die Morgensonne erwärmt zuerst die Dachfläche, und diese Wärme wandert in den folgenden Stunden nach unten. Ein Fühler an der Ostwand erreicht seinen Höchstwert vielleicht vor Mittag, während ein Sensor an der Westwand erst gegen Sonnenuntergang am wärmsten ist. Die Luftfeuchtigkeit steigt oft, wenn warme Luft an einer kalten Betonbodenplatte abkühlt.",
  seasonalTitle: "Jahreszeitliche Veränderungen",
  seasonalHtml:
    "Im Winter halten Kälteperioden länger an: Bodenplatte, Tragwerk und Inhalt wirken als Speichermasse, die sich nur langsam wieder erwärmt. Im Sommer dreht sich das Problem um: Hitze im Dachboden und die Strahlungslast des Dachs können die Innenluft über die Außentemperatur treiben, wenn Lüftung oder Dämmung nicht gegensteuern. Mit Verlaufsdaten wird der Jahreszeitenvergleich offensichtlich: Derselbe Fühler erzählt im Januar und im Juli zwei völlig verschiedene Geschichten.",
  suddenTitle: "Was plötzliche Änderungen verursacht",
  sudden: [
    "<strong>Tore und Türen:</strong> Ein einziges offenes Tor kann in wenigen Minuten einen großen Teil der Luft austauschen.",
    "<strong>Einfahrende Fahrzeuge:</strong> Warme Motoren, nasse Reifen und schmelzender Schnee bringen Wärme- und Feuchteschübe.",
    "<strong>Wetterfronten:</strong> Ein schneller Temperatursturz draußen zieht die Luft in angebauten oder teilweise temperierten Räumen mit ein bis drei Stunden Verzögerung nach unten.",
    "<strong>Sonne nach Bewölkung:</strong> Dachflächen können in weniger als einer Stunde um viele Grad wärmer werden.",
    "<strong>Laufende Geräte:</strong> Kompressoren, Trockner und Heizlüfter erzeugen örtliche Wärmeinseln.",
  ],
  massTitle: "Speichermasse und Verzögerung",
  massHtml:
    "Betonböden und gemauerte Wände speichern Energie. Deshalb erreicht die Fühlertemperatur ihren Höchstwert oft erst Stunden nach dem Maximum draußen. Das erklärt auch, warum sich der Raum nach einem Kälteeinbruch nur langsam erholt: Drinnen kann es noch frieren, obwohl die Luft draußen am Nachmittag über 0 °C (32 °F) liegt. Vergleiche beim Auswerten der Diagramme die Fühlerverläufe mit dem Außenwetter-Block auf der Startseite, um Gebäudeeffekte vom Wetter zu trennen.",
  humidityTitle: "Luftfeuchtigkeit verhält sich anders als Temperatur",
  humidityHtml:
    "Die relative Luftfeuchtigkeit steigt, wenn Luft abkühlt, ohne dass Feuchtigkeit entzogen wird: typisch, wenn auf einen warmen Tag eine klare Nacht über einer kalten Bodenplatte folgt. Quellen absoluter Feuchte (Regen an Autos, Schneeschmelze, Lecks) können die Luftfeuchtigkeit hochtreiben, ohne dass sich die Temperatur stark ändert. Wer beide Werte zusammen betrachtet, zieht keine falschen Schlüsse: Ein „trocken-kalter“ Tag draußen kann sich drinnen trotzdem klamm anfühlen.",
  decisionsTitle: "Schwankungen für Entscheidungen nutzen",
  decisionsHtml:
    'Kurzfristige Schwankungen deuten auf Lüftung oder den Umgang mit Toren hin. Mehrtägige Trends sprechen eher für Arbeiten an Dämmung oder Entfeuchtung. Der gespeicherte Verlauf auf der Seite <a class="text-link" href="/dashboard/history">Messwertverlauf</a> macht aus diesen Mustern belastbare Argumente für das Instandhaltungsbudget. Wie Messwerte gespeichert und exportiert werden, erklärt <a class="text-link" href="/about/historical-data">Nutzung historischer Temperaturdaten</a>.',
};

const ptBr: Messages = {
  introHtml:
    "A temperatura em espaços sem aquecimento quase nunca fica parada. Ela sobe quando o sol bate no telhado, cai depois que passa uma frente fria e dá um salto assim que um portão se abre. Entender o que provoca essas mudanças ajuda você a interpretar as leituras das sondas em vez de tratar cada oscilação como defeito no equipamento.",
  dailyTitle: "Padrões diários",
  dailyHtml:
    "Mesmo sem climatização, a maioria desses espaços segue um ritmo diário. À noite, a estrutura irradia calor para o céu e o ar interno esfria. O sol da manhã aquece primeiro o telhado, e esse calor desce por condução ao longo das horas seguintes. Uma sonda em uma parede leste pode atingir o pico antes do meio-dia, enquanto um sensor na parede oeste chega ao máximo perto do pôr do sol. A umidade costuma subir quando o ar quente esfria sobre um piso de concreto frio.",
  seasonalTitle: "Mudanças sazonais",
  seasonalHtml:
    "O inverno traz períodos mais longos de frio acumulado: o piso, a estrutura e o que está guardado funcionam como massa térmica que resiste a uma recuperação rápida. O verão inverte o problema: o calor do sótão e a radiação do telhado podem deixar o ar interno mais quente que o externo, a menos que a ventilação ou o isolamento ajudem. Os dados históricos deixam a comparação sazonal evidente: a mesma sonda conta duas histórias diferentes em janeiro e em julho.",
  suddenTitle: "O que causa mudanças bruscas",
  sudden: [
    "<strong>Uso das portas:</strong> um único portão aberto pode trocar boa parte do ar em minutos.",
    "<strong>Entrada de veículos:</strong> motores quentes, pneus molhados e neve derretendo trazem picos de calor e umidade.",
    "<strong>Frentes frias:</strong> quedas rápidas lá fora puxam para baixo o ar de espaços anexos ou parcialmente climatizados, com atraso de uma a três horas.",
    "<strong>Sol depois de tempo nublado:</strong> a superfície do telhado pode esquentar muitos graus em menos de uma hora.",
    "<strong>Equipamentos ligados:</strong> compressores, secadoras e aquecedores criam pontos quentes localizados.",
  ],
  massTitle: "Massa térmica e atraso",
  massHtml:
    "Pisos de concreto e paredes de alvenaria armazenam energia. É por isso que a temperatura da sonda muitas vezes atinge o pico horas depois da máxima externa. Isso também explica a recuperação lenta depois de uma onda de frio: o interior pode continuar abaixo de zero mesmo quando o ar lá fora passa de 0 °C (32 °F) à tarde. Ao analisar os gráficos, compare as tendências das sondas com o bloco de clima externo da página inicial para separar os efeitos da construção do clima ao redor.",
  humidityTitle: "A umidade se comporta diferente da temperatura",
  humidityHtml:
    "A umidade relativa sobe quando o ar esfria sem perder umidade: algo comum quando um dia ameno dá lugar a uma noite limpa sobre um piso frio. Fontes de umidade absoluta (chuva nos carros, neve derretida, vazamentos) podem fazer a umidade disparar sem grande mudança de temperatura. Acompanhar os dois valores juntos evita conclusões erradas: um dia de “frio seco” lá fora ainda pode parecer úmido dentro do espaço.",
  decisionsTitle: "Usando as mudanças para decidir",
  decisionsHtml:
    'Oscilações de curto prazo indicam questões de ventilação ou de uso das portas. Tendências de vários dias indicam trabalho de isolamento ou desumidificação. O histórico salvo na página de <a class="text-link" href="/dashboard/history">histórico de leituras</a> transforma esses padrões em evidências para o orçamento de manutenção. Para saber como as leituras são armazenadas e exportadas, veja <a class="text-link" href="/about/historical-data">uso dos dados históricos de temperatura</a>.',
};

export const temperatureChangesMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

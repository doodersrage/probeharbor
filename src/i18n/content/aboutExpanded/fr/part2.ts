import type { AboutExpandedOverlay } from "../index";

export default {
  "firmware-watchdog-recovery": [
    { html: `Le matériel du garage tourne sans surveillance pendant des mois. Les blocages rares (pilote Ethernet figé, fragmentation de la mémoire ou bus de capteurs bloqué) se règlent plus facilement par une réinitialisation du watchdog que par un passage sur l’échelle. Une réinitialisation temporisée redémarre le microcontrôleur et réinitialise les shields et les capteurs.` },
    { text: `Quand le watchdog est utile` },
    { items: [
      `**Pile réseau figée** après une micro-coupure de courant du routeur.`,
      `**Boucle de nouvelles tentatives infinie** sur une ligne de données DHT22 débranchée.`,
      `**File de clients HTTP saturée** sur le W5100 après une interrogation soutenue depuis le cloud.`,
    ] },
    { text: `Notes de mise en œuvre` },
    { html: `Ne réarmez le watchdog que lorsque la boucle principale termine un cycle complet : lecture des capteurs, mise à jour du LCD et tâches HTTP. Un réarmement trop zélé masque les vrais interblocages. Associez-le au renouvellement DHCP et à la logique de service JSON décrits dans <a class="text-link" href="/about/sketch-polling-main-loop">la boucle principale d’interrogation du sketch</a>.` },
    { text: `À quoi s’attendre en exploitation` },
    { html: `Prévoyez une brève interruption du JSON pendant le redémarrage : quelques secondes, pas des minutes. Le <a class="text-link" href="/about/debugging-stale-readings">diagnostic des relevés figés</a> distingue les trous dus aux redémarrages d’une mauvaise configuration de flux. Notes sur l’empilement Ethernet : <a class="text-link" href="/about/ethernet-shield-stacking">empilement du shield Ethernet</a>.` },
  ],

  "breadboard-power-rails": [
    { html: `La platine d’essai sans soudure distribue le 5 V et la masse de l’Arduino vers le LCD, les résistances de tirage des DHT22, le potentiomètre de contraste et les composants annexes du shield Ethernet. Des rails d’alimentation propres réduisent les caractères parasites sur le LCD et les délais d’attente mystérieux des capteurs.` },
    { text: `Disposition des rails` },
    { items: [
      `**Rail rouge :** 5 V depuis la broche 5V de l’Arduino (alimentation USB ou jack une fois installé).`,
      `**Rail bleu :** masse commune reliée au GND de l’Arduino.`,
      `**Cavaliers :** fils courts et de même longueur si possible ; un seul point de masse en étoile sur la carte.`,
    ] },
    { text: `Alimentation du LCD et des capteurs` },
    { html: `Le LCD 16×2 consomme un courant modeste ; le DHT22 a des pointes pendant la conversion. Si les câbles vers des sondes éloignées sont longs, envisagez une alimentation 5 V dédiée avec masse commune plutôt que de surcharger le régulateur de l’Uno. Le câblage du potentiomètre de contraste partage la masse : voir <a class="text-link" href="/about/liquid-crystal-gpio-map">plan des GPIO du LCD</a>.` },
    { text: `Vérification sur l’établi` },
    { html: `Mesurez la tension des rails en charge avant de refermer un boîtier. Les étapes de dépannage se trouvent dans <a class="text-link" href="/about/circuit-wiring-troubleshooting">dépannage du câblage du circuit</a>. Vue d’ensemble complète : <a class="text-link" href="/about/arduino-circuit-wiring">câblage du circuit Arduino</a>.` },
  ],

  "ethernet-shield-stacking": [
    { html: `Le shield Ethernet à base de W5100 s’empile sur l’Uno et occupe les broches SPI ainsi qu’une ligne de sélection de puce. L’empilement mécanique est simple ; électriquement, vous devez réserver ces broches et faire passer les fils des DHT22 et du LCD autour de cet assemblage haut.` },
    { text: `Ordre d’empilement et connecteurs` },
    { items: [
      `Enfoncez complètement le **shield Ethernet** sur les connecteurs de l’Uno, sans broche tordue derrière la prise RJ45.`,
      `Faites partir les cavaliers du haut de la pile ou utilisez une **carte de prototypage** pour les broches du LCD.`,
      `Prévoyez un serre-câble pour le câble Ethernet afin que la flexion du RJ45 ne soulève pas le shield de ses connecteurs.`,
    ] },
    { text: `Partage du bus SPI` },
    { html: `Un seul périphérique SPI doit piloter le bus à la fois ; le W5100 occupe le SPI pendant les entrées/sorties réseau. Les GPIO du DHT22 et du LCD parallèle sont distinctes : détails dans <a class="text-link" href="/about/spi-pins-ethernet-reserved">broches SPI et lignes réservées</a>.` },
    { text: `Chemin réseau` },
    { html: `Le DHCP du routeur du garage attribue une IP à la carte ; le JSON est servi en HTTP sur le réseau local. Pour le HTTPS en bordure, terminez le TLS sur un <a class="text-link" href="/about/fastapi-relay-setup">relais FastAPI</a> plutôt que sur le microcontrôleur. Pour une <strong>ingestion par push</strong> depuis le même shield, utilisez <code>ethernet_dht22_ingest</code> avec le relais HTTP→HTTPS local de <code>sketches/relay/</code> : voir <a class="text-link" href="/about/arduino-sketches">sketches Arduino</a>.` },
  ],

  "circuit-wiring-troubleshooting": [
    { html: `Les relevés intermittents viennent généralement de l’alimentation, de la masse ou de cavaliers mal enfoncés, pas de la malchance. Procédez méthodiquement, des rails vers les capteurs, avant de remplacer l’Arduino.` },
    { text: `Symptôme → cause probable` },
    { items: [
      `**LCD vide :** potentiomètre de contraste, Vo non raccordée ou mauvaises broches RS/E/D.`,
      `**Délai dépassé sur le DHT22 :** résistance de tirage absente, données et masse inversées, ou intervalle de lecture trop court.`,
      `**Ethernet muet :** shield mal enfoncé, câble défectueux ou conflit de broches SPI avec le câblage du LCD.`,
      `**LCD illisible :** ligne de données flottante, ou LCD 3,3 V sur une logique 5 V sans adaptation de niveau.`,
    ] },
    { text: `Outils` },
    { html: `Les journaux série de la <a class="text-link" href="/about/arduino-ide-setup">configuration de l’IDE Arduino</a> confirment que le firmware tourne. Des mesures au multimètre sur les <a class="text-link" href="/about/breadboard-power-rails">rails d’alimentation</a> confirment le 5 V en charge. Revue broche par broche : <a class="text-link" href="/about/arduino-pin-wiring">câblage des broches</a>.` },
    { text: `Aide spécifique aux capteurs` },
    { html: `Défaillances persistantes du DHT22 après vérification du câblage : <a class="text-link" href="/about/dht22-read-errors-retries">erreurs de lecture DHT22 et nouvelles tentatives</a> et <a class="text-link" href="/about/dht22-data-line-wiring">câblage de la ligne de données</a>.` },
  ],

  "liquid-crystal-gpio-map": [
    { html: `Le LCD 16×2 fonctionne en mode parallèle avec un câblage 4 bits : RS, E et quatre lignes de données correspondent à des GPIO précises de l’Uno, conformes au constructeur LiquidCrystal du firmware. Le rétroéclairage peut passer par un transistor de commutation pour la variation ou l’économie d’énergie.` },
    { text: `Affectations typiques` },
    { html: `Les broches exactes suivent le sketch du dépôt : notez votre montage sur papier. RS et E sélectionnent le mode commande ou données ; D4–D7 transportent les quartets. Le contraste sur Vo utilise un potentiomètre de 10 k entre le 5 V et la masse.` },
    { items: [
      `**RS :** sélection de registre : commandes ou données de caractères.`,
      `**E :** impulsion de validation pour chaque transfert de quartet.`,
      `**D4–D7 :** les quatre bits de poids fort de l’interface 8 bits en mode 4 bits.`,
      `**Rétroéclairage :** souvent la broche LED+ commutée par transistor, pas une ligne de données GPIO.`,
    ] },
    { text: `Éviter les conflits` },
    { html: `N’affectez pas les lignes du LCD aux <a class="text-link" href="/about/spi-pins-ethernet-reserved">broches SPI réservées</a> au shield Ethernet. Les broches de données des DHT22 doivent elles aussi rester libres : voir <a class="text-link" href="/about/dht22-data-line-wiring">câblage des données DHT22</a>.` },
    { text: `Contenu affiché` },
    { html: `Ce qui apparaît sur chaque ligne est défini par le firmware dans <a class="text-link" href="/about/lcd-local-display-format">format d’affichage local du LCD</a>.` },
  ],

  "dht22-data-line-wiring": [
    { html: `Chaque DHT22 utilise une GPIO numérique pour son protocole à un fil. L’alimentation et la masse viennent des rails de la platine d’essai ; une résistance de tirage de 4,7 k à 10 k entre la ligne de données et le 5 V maintient la ligne à l’état haut entre deux lectures.` },
    { text: `Connexions par capteur` },
    { items: [
      `**VCC** vers le rail 5 V (certains modules intègrent un régulateur pour composants 3,3 V : vérifiez le vôtre).`,
      `**DATA** vers une GPIO dédiée avec résistance de tirage.`,
      `**GND** vers la masse commune de l’Arduino.`,
    ] },
    { text: `Câbles vers des sondes éloignées` },
    { html: `Des fils courts, torsadés ou appairés, réduisent le bruit. Évitez de faire courir la ligne de données parallèlement au secteur. Si les lectures se dégradent avec la distance, la logique de nouvelle tentative décrite dans <a class="text-link" href="/about/dht22-read-errors-retries">erreurs de lecture DHT22</a> aide, mais la physique a toujours le dernier mot : déplacez ou raccourcissez les câbles.` },
    { text: `Correspondance dans le firmware` },
    { html: `L’ordre des GPIO définit les clés JSON <code>0</code> et <code>1</code>. Documentez la correspondance pour les <a class="text-link" href="/about/probe-mapping-labels">libellés du tableau de bord</a>. Les bases du capteur : <a class="text-link" href="/about/dht22-sensor-overview">présentation du DHT22</a>.` },
  ],

  "spi-pins-ethernet-reserved": [
    { html: `Le shield Ethernet W5100 utilise le SPI matériel de l’Uno : MOSI, MISO, SCK, plus la sélection de puce sur la broche 10. Dans les montages standard, les broches 10 à 13 et les lignes SPI ne doivent pas être réutilisées pour le LCD ou les capteurs.` },
    { text: `Lignes réservées` },
    { items: [
      `**D10 :** sélection de puce du W5100 (SS).`,
      `**D11–D13 :** SPI MOSI, MISO, SCK sur l’Uno.`,
      `**Broche d’interruption :** propre à chaque shield ; suivez la sérigraphie du fabricant.`,
    ] },
    { text: `Planifier le budget de GPIO` },
    { html: `Le mode 4 bits du LCD occupe six GPIO ; deux lignes DHT22 en prennent deux de plus : planifiez avant d’ajouter des fonctions. Détails d’empilement : <a class="text-link" href="/about/ethernet-shield-stacking">empilement du shield Ethernet</a>.` },
    { text: `Autres configurations` },
    { html: `Si vous manquez de broches, envisagez un module LCD I²C ou déléguez le HTTPS à des <a class="text-link" href="/about/python-feeds">flux Python</a> tout en gardant le JSON en HTTP en local.` },
  ],

  "dht22-read-errors-retries": [
    { html: `Les lectures DHT22 échouent de temps en temps : non-respect du timing, bruit électrique ou conflit momentané sur le bus. Le firmware doit réessayer quelques fois avec un délai croissant avant de déclarer une sonde défaillante, plutôt que de publier des valeurs absurdes dans le JSON.` },
    { text: `Stratégie de nouvelles tentatives` },
    { items: [
      `En cas d’**erreur de somme de contrôle ou de délai dépassé**, attendez au moins deux secondes et réessayez.`,
      `Limitez-vous à **trois à cinq** tentatives par cycle d’interrogation.`,
      `Si toutes échouent, **omettez la valeur ou conservez la dernière valeur valide** : documentez votre choix dans les notes du schéma.`,
    ] },
    { text: `Corriger d’abord le matériel` },
    { html: `Vérifiez les résistances de tirage et la masse dans <a class="text-link" href="/about/dht22-data-line-wiring">câblage de la ligne de données</a>. Les câbles longs et le bruit des moteurs d’ouvre-porte de garage aggravent les erreurs. Le <a class="text-link" href="/about/circuit-wiring-troubleshooting">dépannage du circuit</a> couvre les vérifications sur l’établi.` },
    { text: `Conséquences en aval` },
    { html: `Les lectures erronées faussent la <a class="text-link" href="/about/dual-probe-averaging">moyenne</a> et l’historique du tableau de bord. Le <a class="text-link" href="/about/debugging-stale-readings">diagnostic des relevés figés</a> côté site aide à distinguer une panne de capteur d’un problème réseau.` },
  ],

  "lcd-local-display-format": [
    { html: `Le LCD 16×2 donne un retour immédiat à l’installateur, sans Wi-Fi ni ordinateur portable. Deux lignes, c’est peu : le firmware alterne ou répartit généralement la sonde 0, la sonde 1 et la moyenne entre les lignes ou sur des pages temporisées.` },
    { text: `Disposition typique` },
    { items: [
      `**Ligne 0 :** température et humidité de la sonde 0 en abrégé (par ex. <code>P0 38F 41%</code>).`,
      `**Ligne 1 :** sonde 1 ou moyenne glissante selon la version du sketch.`,
      `**Rétroéclairage :** allumé pendant les lectures ; extinction temporisée facultative pour limiter l’éblouissement la nuit.`,
    ] },
    { text: `Unités et rafraîchissement` },
    { html: `Alignez les unités sur celles du site, ou indiquez-les sur le LCD. Ne rafraîchissez l’écran qu’à l’arrivée de nouvelles lectures valides, pour éviter le scintillement des mises à jour partielles. Câblage des GPIO : <a class="text-link" href="/about/liquid-crystal-gpio-map">plan des GPIO du LCD</a>.` },
    { text: `Quand le LCD ne concorde pas avec le site` },
    { html: `Comparez avec le JSON en direct via curl : <a class="text-link" href="/about/json-probe-output-schema">schéma JSON</a>. Un cache périmé sur le <a class="text-link" href="/about/redis-cache-for-feeds">relais Redis</a> peut être en retard sur le LCD ; l’affichage local est souvent plus frais.` },
  ],

  "dual-probe-averaging": [
    { html: `La clé <code>avg</code> résume les sondes en bon état pour un coup d’œil rapide et des lignes d’historique compactes. La moyenne doit ignorer les lectures échouées et, éventuellement, ne prendre en compte que les sondes marquées actives dans le firmware.` },
    { text: `Esquisse de l’algorithme` },
    { items: [
      `Rassemblez les paires température/humidité **valides** pour chaque indice de sonde.`,
      `Calculez la **moyenne arithmétique** séparément pour les °F, les °C et l’humidité.`,
      `Si une seule sonde est en bon état, **avg peut valoir cette sonde** ou être omise : choisissez une règle.`,
    ] },
    { text: `Quand ne pas se fier à avg` },
    { html: `Les zones près de la porte et à l’intérieur peuvent différer d’environ 5,5 °C (10 °F) : une moyenne aveugle masque le risque de gel dans le coin froid. Utilisez avg pour les courbes de tendance et les clés par zone pour les décisions. Disposition : <a class="text-link" href="/about/multi-zone-garage-layout">disposition multizone</a>.` },
    { text: `Sujets associés` },
    { html: `Cadence d’interrogation : <a class="text-link" href="/about/sketch-polling-main-loop">boucle principale du sketch</a>. Format de sortie : <a class="text-link" href="/about/json-probe-output-schema">schéma JSON</a>.` },
  ],

  "fastapi-relay-setup": [
    { html: `Un petit service FastAPI sur un serveur domestique ou un VPS peut interroger l’Arduino en HTTP sur le réseau local, puis exposer une URL HTTPS stable sur Internet. Le TLS et l’authentification restent ainsi hors du microcontrôleur, tout en conservant le JSON que votre tableau de bord comprend déjà. Si l’Uno doit <strong>pousser</strong> ses données au lieu d’attendre qu’on vienne les chercher, lancez <code>sketches/relay/push_https_forward.py</code> et l’exemple <code>ethernet_dht22_ingest</code> : voir <a class="text-link" href="/about/python-feeds">flux Python</a>.` },
    { text: `Architecture minimale` },
    { items: [
      `**Un planificateur ou une récupération à la demande** interroge <code>http://arduino.local/...</code> sur le réseau local.`,
      `**Une route FastAPI** renvoie le dernier corps mis en cache avec le bon <code>Content-Type</code>.`,
      `**Un proxy inverse** (Caddy, nginx) termine le TLS sur un nom d’hôte public.`,
    ] },
    { text: `Conseils de configuration` },
    { items: [
      `Fixez des **délais d’attente raisonnables** : la liaison montante du garage est plus lente qu’un aller-retour en datacenter.`,
      `Journalisez les **erreurs en amont** séparément des 404 côté client.`,
      `Versionnez le relais quand le <a class="text-link" href="/about/json-probe-output-schema">schéma JSON</a> change.`,
    ] },
    { text: `Couche de cache` },
    { html: `Ajoutez un <a class="text-link" href="/about/redis-cache-for-feeds">cache Redis</a> pour que Cloudflare Workers et le site Astro ne martèlent pas votre IP domestique à chaque visite. Sécurité : <a class="text-link" href="/about/relay-security-and-access">sécurité du relais</a>.` },
  ],

  "debugging-stale-readings": [
    { html: `Des relevés figés signifient que le site affiche une ancienne température alors que les conditions ont changé, ou n’affiche rien alors que le LCD se met encore à jour. Remontez à partir du capteur : matériel, JSON, cache, récupération SSR, puis historique.` },
    { text: `Liste de contrôle` },
    { items: [
      `**Interrogez l’URL du flux avec curl** depuis l’extérieur de votre réseau local : le JSON est-il à jour ?`,
      `Comparez **LCD et JSON** ; si le LCD est plus récent, corrigez le relais ou le <a class="text-link" href="/about/redis-cache-for-feeds">TTL Redis</a>.`,
      `Vérifiez que les **clés de sonde** du tableau de bord correspondent au schéma : <a class="text-link" href="/about/probe-mapping-labels">correspondance des sondes</a>.`,
      `Examinez les **journaux Cloudflare / SSR** à la recherche de délais dépassés récurrents.`,
    ] },
    { text: `Causes côté matériel` },
    { html: `Les <a class="text-link" href="/about/firmware-watchdog-recovery">redémarrages par watchdog</a> provoquent de courts trous. Les <a class="text-link" href="/about/dht22-read-errors-retries">erreurs DHT22</a> font disparaître des clés du JSON. Ethernet : <a class="text-link" href="/about/circuit-wiring-troubleshooting">dépannage du câblage</a>.` },
    { text: `Historique ou direct` },
    { html: `Les graphiques peuvent prendre du retard si les insertions s’arrêtent alors que la page d’accueil semble encore en direct : vérifiez les <a class="text-link" href="/about/supabase-history-inserts">insertions d’historique</a> indépendamment de la <a class="text-link" href="/about/home-page-probe-fetch">récupération de la page d’accueil</a>.` },
  ],

  "configuring-temperature-feeds": [
    { html: `Les flux en pull permettent à ProbeHarbor de récupérer un JSON en HTTPS selon un calendrier lorsque votre sonde dispose déjà d’une URL publique (ou d’un relais TLS). Pour le guide complet push <em>et</em> pull correspondant à l’interface Devices actuelle, commencez par <a class="text-link" href="/about/adding-devices">ajouter des appareils en push et en pull</a>.` },
    { text: `Étapes de configuration` },
    { items: [
      `Vérifiez le flux avec **curl** : sondes imbriquées sous un objet racine (par défaut <code>temp</code>).`,
      `Ouvrez l’onglet <strong>Dashboard → Devices → Pull feeds</strong>.`,
      `Ajoutez l’URL HTTPS et renseignez <strong>JSON root key</strong> si votre objet ne s’appelle pas <code>temp</code> (par ex. <code>readings</code>).`,
      `Utilisez <strong>Test feed URL</strong>, puis <strong>Save pull setup</strong> : les clés de sonde sont importées automatiquement.`,
      `Renommez les libellés sur la même page ou cliquez sur <strong>Accept suggested names</strong>.`,
    ] },
    { text: `Clé racine JSON` },
    { html: `L’analyse des flux en pull recherche <code>{ "&lt;root&gt;": { "0": { "f": …, "h": … }, … } }</code>. La racine est <code>temp</code> par défaut. Les clés à plat de style push et les <code>sensors[]</code> typés relèvent de l’<a class="text-link" href="/about/ingest-and-webhooks">ingestion par push</a>, pas du chemin pull par défaut.` },
    { text: `SenML et Home Assistant REST` },
    { html: `Lorsque la racine configurée est absente, ProbeHarbor détecte automatiquement le <strong>SenML JSON</strong> (tableau RFC 8428) et le JSON d’un <strong>capteur HA REST</strong> (<code>state</code> + <code>attributes</code>). Collez l’URL HTTPS telle quelle, sans remplacer la racine JSON. Associez les clés de sonde aux noms SenML (par ex. <code>0</code>) ou à <code>state</code> pour les flux REST à entité unique. Essayez l’<a class="text-link" href="/api/feeds/example?format=senml">exemple SenML</a> public ou l’<a class="text-link" href="/api/feeds/example?format=homeassistant">exemple HA REST</a>.` },
    { text: `Plusieurs flux` },
    { html: `Vous pouvez ajouter plusieurs URL en pull (dans les limites de votre formule). Notez quelle URL est la production et laquelle sert de démo. Sécurité : <a class="text-link" href="/about/relay-security-and-access">sécurité du relais</a>. Comportement de récupération : <a class="text-link" href="/about/home-page-probe-fetch">récupération des sondes sur la page d’accueil</a>.` },
    { text: `Dépannage` },
    { html: `Une mauvaise clé racine ou une faute de frappe dans une clé de sonde masque les cartes même quand l’URL renvoie 200. Voir <a class="text-link" href="/about/debugging-stale-readings">diagnostiquer des relevés figés</a>.` },
  ],

  "humidity-condensation-basics": [
    { html: `La surveillance d’un garage associe la température et l’humidité relative, car toutes deux influent sur le confort, la corrosion et le risque de moisissures. La condensation apparaît quand de l’air humide touche une surface plus froide que le point de rosée, et non quand un pourcentage d’humidité franchit à lui seul un seuil arbitraire. Les sondes mesurent la poche d’air autour du capteur ; elles ne détectent pas directement l’eau sur un sol en béton, sauf si cette surface réchauffe ou refroidit l’air voisin de façon mesurable.` },
    { alt: `Schéma montrant de l’air chaud et humide rencontrant le sol froid d’un garage et formant de la condensation`, caption: `La condensation se forme quand l’air se refroidit jusqu’à son point de rosée au contact d’une surface plus froide, comme une dalle non isolée.` },
    { text: `Humidité relative et point de rosée` },
    { html: `Un DHT22 indique l’**humidité relative (%HR)** à la température actuelle de l’air. Une même quantité d’eau paraît « plus humide » quand l’air est froid, car le %HR augmente lorsque la température baisse. Pour le stockage en saison de gel, suivez ensemble la température et l’humidité : la <a class="text-link" href="/about/dht22-sensor-overview">présentation du DHT22</a> explique les limites de précision.` },
    { html: `Après des <a class="text-link" href="/about/garage-door-temperature-swings">ouvertures de porte</a> par jours d’été humides, attendez-vous à un pic d’humidité à mesure que l’air extérieur se mélange. Si la dalle reste froide à cause de son <a class="text-link" href="/about/thermal-mass-concrete-slab">inertie thermique</a>, de la condensation peut se former même quand la sonde indique un %HR modéré à hauteur de poitrine.` },
    { text: `Ce que les sondes ne voient pas` },
    { items: [
      `**La température de surface** des outils, des voitures et des tuyaux, souvent plus froide que l’air la nuit.`,
      `**Les microclimats** derrière les étagères où l’air stagne : utilisez une <a class="text-link" href="/about/multi-zone-garage-layout">disposition multizone</a>.`,
      `**Les pics brefs** lors des ouvertures de porte, que les moyennes lissent dans l’historique.`,
    ] },
    { text: `Bonnes habitudes de surveillance` },
    { html: `Comparez les zones près de la porte et à l’intérieur grâce aux <a class="text-link" href="/about/probe-mapping-labels">libellés des sondes</a>. Examinez les minimales nocturnes dans les <a class="text-link" href="/about/history-dashboard-browsing">graphiques d’historique</a> pendant les intersaisons, quand les températures de la dalle et de l’air divergent le plus.` },
  ],
} satisfies AboutExpandedOverlay;

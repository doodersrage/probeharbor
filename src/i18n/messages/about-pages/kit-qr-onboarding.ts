import { defineMessages } from "../../translate";

/**
 * /about/kit-qr-onboarding body copy. Dashboard screen names stay English
 * (the dashboard is English). `*Html` keys are trusted inline HTML.
 */
const en = {
  pathTitle: "Guided kit path",
  pathSteps: [
    'Buy an ESP32 + waterproof DS18B20. <a class="text-link" href="/about/esp32-freeze-kit">parts list</a> (Adafruit / Amazon; ProbeHarbor does not sell hardware).',
    'Create a push device on <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> (one click: named Workshop probe by default).',
    "Copy or scan the ingest QR (visible for 30 minutes after create/rotate).",
    "Flash firmware or point Home Assistant at that URL: sensors auto-import on first POST.",
    'Set freeze °F + email on the inline first-alert card on Devices, or open <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a>, then send a test.',
    'Optional: <a class="text-link" href="/dashboard/share/links">Share a family live link</a> (included on Free).',
  ],
  encodeTitle: "What to encode",
  encodeHtml:
    'After creating or rotating a push key on <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>, the key callout shows a QR for the full ingest URL (visible for 30 minutes, survives refresh):',
  encodeWarningHtml:
    "Anyone scanning the QR on a phone sees the URL, keep devices physically secure; rotate keys if a sticker is lost.",
  nfcTitle: "NFC tags (optional)",
  nfcHtml:
    'Write the same HTTPS ingest URL as an NDEF URI record on an NTAG213/215 sticker. Phones can tap to open the URL during setup. Keep tags with the kit — they are as sensitive as a printed QR. Parts and print tips: <a class="text-link" href="/kit-labels">Kit QR &amp; NFC labels</a>.',
  devicesQrTitle: "QR on the Devices page",
  devicesQrHtml:
    'The QR is generated in-app when you create or rotate a push key, no external QR generators required. You can download the SVG or print a simple label (device name + QR + URL) from that callout. See also the curl test payload in <a class="text-link" href="/about/ingest-and-webhooks">Ingest &amp; webhooks</a>.',
  checklistTitle: "Onboarding checklist",
  checklistHtml:
    'Prefer to see readings before flashing firmware? Use <strong>Try without hardware</strong> on Overview for the demo pull feed, browse the public <a class="text-link" href="/demo">live demo</a>, then create a push device and scan the QR.',
  gettingStartedHtml:
    "The dashboard getting-started card tracks device creation, first POST, and alerts. Sensor keys auto-import when firmware POSTs JSON: pair the QR with payload keys like <code>temp1</code>, <code>door1</code>, then rename labels on Devices if needed.",
};

type Messages = typeof en;

const es: Messages = {
  pathTitle: "Ruta guiada del kit",
  pathSteps: [
    'Compra un ESP32 y una DS18B20 impermeable: <a class="text-link" href="/about/esp32-freeze-kit">lista de piezas</a> (Adafruit / Amazon; ProbeHarbor no vende hardware).',
    'Crea un dispositivo push en <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> (con un clic; se llama «Workshop probe» por defecto).',
    "Copia o escanea el QR de ingesta (visible durante 30 minutos tras crear o rotar la clave).",
    "Flashea el firmware o apunta Home Assistant a esa URL: los sensores se importan solos con el primer POST.",
    'Define el umbral de congelación (°F) y un correo en la tarjeta de primera alerta de Devices, o abre <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a>, y envía una prueba.',
    'Opcional: <a class="text-link" href="/dashboard/share/links">comparte un enlace en vivo con la familia</a> (incluido en Free).',
  ],
  encodeTitle: "Qué codificar",
  encodeHtml:
    'Después de crear o rotar una clave push en <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>, el recuadro de la clave muestra un QR con la URL de ingesta completa (visible durante 30 minutos, aunque recargues la página):',
  encodeWarningHtml:
    "Cualquiera que escanee el QR con el móvil verá la URL, así que guarda los dispositivos en un lugar seguro y rota las claves si se pierde una etiqueta.",
  nfcTitle: "Etiquetas NFC (opcional)",
  nfcHtml:
    'Graba la misma URL de ingesta HTTPS como registro NDEF URI en una pegatina NTAG213/215. Durante la configuración, basta con acercar el móvil para abrir la URL. Guarda las etiquetas con el kit: son tan sensibles como un QR impreso. Piezas y consejos de impresión: <a class="text-link" href="/kit-labels">etiquetas QR y NFC del kit</a>.',
  devicesQrTitle: "El QR en la página Devices",
  devicesQrHtml:
    'El QR se genera dentro de la app al crear o rotar una clave push, sin generadores de QR externos. Desde ese recuadro puedes descargar el SVG o imprimir una etiqueta sencilla (nombre del dispositivo + QR + URL). Consulta también el payload de prueba con curl en <a class="text-link" href="/about/ingest-and-webhooks">ingesta y webhooks</a>.',
  checklistTitle: "Lista de puesta en marcha",
  checklistHtml:
    '¿Prefieres ver lecturas antes de flashear el firmware? Usa <strong>Try without hardware</strong> en Overview para el feed pull de demostración, explora la <a class="text-link" href="/demo">demo en vivo</a> pública y luego crea un dispositivo push y escanea el QR.',
  gettingStartedHtml:
    "La tarjeta de primeros pasos del panel sigue la creación del dispositivo, el primer POST y las alertas. Las claves de los sensores se importan solas cuando el firmware envía JSON por POST: combina el QR con claves de payload como <code>temp1</code> o <code>door1</code> y, si hace falta, cambia las etiquetas en Devices.",
};

const fr: Messages = {
  pathTitle: "Parcours guidé du kit",
  pathSteps: [
    'Achetez un ESP32 et une DS18B20 étanche : <a class="text-link" href="/about/esp32-freeze-kit">liste des pièces</a> (Adafruit / Amazon ; ProbeHarbor ne vend pas de matériel).',
    'Créez un appareil push dans <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> (en un clic ; nommé « Workshop probe » par défaut).',
    "Copiez ou scannez le QR d’ingestion (visible 30 minutes après création ou rotation).",
    "Flashez le firmware ou pointez Home Assistant vers cette URL : les capteurs s’importent automatiquement au premier POST.",
    'Définissez le seuil de gel (°F) et un e-mail dans la carte de première alerte de Devices, ou ouvrez <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a>, puis envoyez un test.',
    'Facultatif : <a class="text-link" href="/dashboard/share/links">partagez un lien en direct avec la famille</a> (inclus dans Free).',
  ],
  encodeTitle: "Ce qu’il faut encoder",
  encodeHtml:
    'Après avoir créé ou renouvelé une clé push dans <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>, l’encadré de la clé affiche un QR contenant l’URL d’ingestion complète (visible 30 minutes, même après actualisation) :',
  encodeWarningHtml:
    "Toute personne qui scanne le QR avec un téléphone voit l’URL : gardez les appareils en lieu sûr et renouvelez les clés si une étiquette est perdue.",
  nfcTitle: "Étiquettes NFC (facultatif)",
  nfcHtml:
    'Écrivez la même URL d’ingestion HTTPS sous forme d’enregistrement NDEF URI sur un autocollant NTAG213/215. Pendant l’installation, il suffit d’approcher le téléphone pour ouvrir l’URL. Gardez les étiquettes avec le kit : elles sont aussi sensibles qu’un QR imprimé. Pièces et conseils d’impression : <a class="text-link" href="/kit-labels">étiquettes QR et NFC du kit</a>.',
  devicesQrTitle: "Le QR dans la page Devices",
  devicesQrHtml:
    'Le QR est généré dans l’application quand vous créez ou renouvelez une clé push, sans générateur de QR externe. Depuis cet encadré, vous pouvez télécharger le SVG ou imprimer une étiquette simple (nom de l’appareil + QR + URL). Voir aussi le payload de test curl dans <a class="text-link" href="/about/ingest-and-webhooks">ingestion et webhooks</a>.',
  checklistTitle: "Check-list de démarrage",
  checklistHtml:
    'Vous préférez voir des mesures avant de flasher le firmware ? Utilisez <strong>Try without hardware</strong> dans Overview pour le flux pull de démonstration, parcourez la <a class="text-link" href="/demo">démo en direct</a> publique, puis créez un appareil push et scannez le QR.',
  gettingStartedHtml:
    "La carte de démarrage du tableau de bord suit la création de l’appareil, le premier POST et les alertes. Les clés des capteurs s’importent automatiquement quand le firmware envoie du JSON en POST : associez le QR à des clés de payload comme <code>temp1</code> ou <code>door1</code>, puis renommez les libellés dans Devices si besoin.",
};

const de: Messages = {
  pathTitle: "Geführter Weg mit dem Kit",
  pathSteps: [
    'Kauf einen ESP32 und einen wasserdichten DS18B20: <a class="text-link" href="/about/esp32-freeze-kit">Teileliste</a> (Adafruit / Amazon; ProbeHarbor verkauft keine Hardware).',
    'Lege unter <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> ein Push-Gerät an (ein Klick; heißt standardmäßig „Workshop probe“).',
    "Kopiere oder scanne den Ingest-QR-Code (nach dem Anlegen oder Rotieren 30 Minuten lang sichtbar).",
    "Flashe die Firmware oder richte Home Assistant auf diese URL: Sensoren werden beim ersten POST automatisch übernommen.",
    'Leg auf der Erstalarm-Karte unter Devices die Frostschwelle (°F) und eine E-Mail-Adresse fest oder öffne <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> und sende dann einen Test.',
    'Optional: <a class="text-link" href="/dashboard/share/links">Teile einen Live-Link mit der Familie</a> (in Free enthalten).',
  ],
  encodeTitle: "Was im QR-Code steht",
  encodeHtml:
    'Nachdem du unter <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> einen Push-Schlüssel angelegt oder rotiert hast, zeigt der Schlüsselhinweis einen QR-Code mit der vollständigen Ingest-URL (30 Minuten sichtbar, auch nach dem Neuladen):',
  encodeWarningHtml:
    "Wer den QR-Code mit dem Handy scannt, sieht die URL. Bewahre die Geräte also sicher auf und rotiere die Schlüssel, falls ein Aufkleber verloren geht.",
  nfcTitle: "NFC-Tags (optional)",
  nfcHtml:
    'Schreib dieselbe HTTPS-Ingest-URL als NDEF-URI-Eintrag auf einen NTAG213/215-Aufkleber. Bei der Einrichtung genügt es dann, das Handy daranzuhalten, um die URL zu öffnen. Bewahre die Tags beim Kit auf, sie sind genauso sensibel wie ein gedruckter QR-Code. Teile und Drucktipps: <a class="text-link" href="/kit-labels">QR- und NFC-Etiketten fürs Kit</a>.',
  devicesQrTitle: "QR-Code auf der Devices-Seite",
  devicesQrHtml:
    'Der QR-Code wird direkt in der App erzeugt, wenn du einen Push-Schlüssel anlegst oder rotierst, ganz ohne externe QR-Generatoren. In diesem Hinweis kannst du das SVG herunterladen oder ein einfaches Etikett drucken (Gerätename + QR-Code + URL). Den curl-Test-Payload findest du außerdem unter <a class="text-link" href="/about/ingest-and-webhooks">Ingest und Webhooks</a>.',
  checklistTitle: "Checkliste für den Start",
  checklistHtml:
    'Willst du Messwerte sehen, bevor du Firmware flashst? Nutze <strong>Try without hardware</strong> in Overview für den Demo-Pull-Feed, sieh dir die öffentliche <a class="text-link" href="/demo">Live-Demo</a> an und lege dann ein Push-Gerät an und scanne den QR-Code.',
  gettingStartedHtml:
    "Die Erste-Schritte-Karte im Dashboard verfolgt das Anlegen des Geräts, den ersten POST und die Alarme. Sensorschlüssel werden automatisch übernommen, sobald die Firmware JSON per POST sendet: Kombiniere den QR-Code mit Payload-Schlüsseln wie <code>temp1</code> oder <code>door1</code> und benenne die Bezeichnungen bei Bedarf unter Devices um.",
};

const ptBr: Messages = {
  pathTitle: "Caminho guiado do kit",
  pathSteps: [
    'Compre um ESP32 e uma DS18B20 à prova d’água: <a class="text-link" href="/about/esp32-freeze-kit">lista de peças</a> (Adafruit / Amazon; o ProbeHarbor não vende hardware).',
    'Crie um dispositivo push em <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> (com um clique; o nome padrão é “Workshop probe”).',
    "Copie ou escaneie o QR de ingestão (visível por 30 minutos depois de criar ou trocar a chave).",
    "Grave o firmware ou aponte o Home Assistant para essa URL: os sensores são importados automaticamente no primeiro POST.",
    'Defina o limite de congelamento (°F) e um e-mail no cartão de primeiro alerta em Devices, ou abra <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a>, e depois envie um teste.',
    'Opcional: <a class="text-link" href="/dashboard/share/links">compartilhe um link ao vivo com a família</a> (incluído no Free).',
  ],
  encodeTitle: "O que codificar",
  encodeHtml:
    'Depois de criar ou trocar uma chave push em <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>, o quadro da chave mostra um QR com a URL de ingestão completa (visível por 30 minutos, mesmo se você recarregar a página):',
  encodeWarningHtml:
    "Qualquer pessoa que escanear o QR com o celular vê a URL, então mantenha os dispositivos em local seguro e troque as chaves se uma etiqueta se perder.",
  nfcTitle: "Etiquetas NFC (opcional)",
  nfcHtml:
    'Grave a mesma URL de ingestão HTTPS como registro NDEF URI em um adesivo NTAG213/215. Durante a configuração, basta encostar o celular para abrir a URL. Guarde as etiquetas junto com o kit: elas são tão sensíveis quanto um QR impresso. Peças e dicas de impressão: <a class="text-link" href="/kit-labels">etiquetas QR e NFC do kit</a>.',
  devicesQrTitle: "O QR na página Devices",
  devicesQrHtml:
    'O QR é gerado dentro do app quando você cria ou troca uma chave push, sem precisar de geradores de QR externos. Nesse quadro, você pode baixar o SVG ou imprimir uma etiqueta simples (nome do dispositivo + QR + URL). Veja também o payload de teste com curl em <a class="text-link" href="/about/ingest-and-webhooks">ingestão e webhooks</a>.',
  checklistTitle: "Checklist de primeiros passos",
  checklistHtml:
    'Prefere ver leituras antes de gravar o firmware? Use <strong>Try without hardware</strong> no Overview para o feed pull de demonstração, explore a <a class="text-link" href="/demo">demonstração ao vivo</a> pública e depois crie um dispositivo push e escaneie o QR.',
  gettingStartedHtml:
    "O cartão de primeiros passos do painel acompanha a criação do dispositivo, o primeiro POST e os alertas. As chaves dos sensores são importadas automaticamente quando o firmware envia JSON por POST: combine o QR com chaves de payload como <code>temp1</code> e <code>door1</code> e, se precisar, renomeie os rótulos em Devices.",
};

export const kitQrOnboardingMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

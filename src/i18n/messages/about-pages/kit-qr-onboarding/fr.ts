
/**
 * /about/kit-qr-onboarding body copy. Dashboard screen names stay English
 * (the dashboard is English). `*Html` keys are trusted inline HTML.
 */
import type { Messages } from "./en";

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

export default fr;

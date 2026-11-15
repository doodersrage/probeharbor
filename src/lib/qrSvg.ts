import { renderSVG } from "uqr";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Render an ingest URL as an SVG QR string (local only — never call a third-party API).
 */
export function renderIngestQrSvg(text: string, size = 200): string {
  const pixelSize = Math.max(2, Math.round(size / 33));
  const svg = renderSVG(text, {
    ecc: "M",
    border: 2,
    pixelSize,
    whiteColor: "#ffffff",
    blackColor: "#111111",
  });

  // Ensure path/attribute safety if uqr ever embeds raw text; also pin display size.
  const escaped = svg
    .replace(/d="([^"]*)"/g, (_m, d: string) => `d="${escapeXml(d)}"`)
    .replace(/<svg\b([^>]*)>/, (_m, attrs: string) => {
      const cleaned = attrs.replace(/\swidth="[^"]*"/g, "").replace(/\sheight="[^"]*"/g, "");
      return `<svg width="${size}" height="${size}"${cleaned}>`;
    });

  return escaped;
}

/** Data-URL form for use in <img src="…"> */
export function renderIngestQrDataUrl(text: string, size = 200): string {
  const svg = renderIngestQrSvg(text, size);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** The probe firmware's setup network (WiFiManager autoConnect, no password). */
export const PROBE_SETUP_SSID = "ProbeHarbor-Setup";

/**
 * Text for a Wi-Fi QR code (the WIFI: format phone cameras join directly).
 * Special characters in the name are escaped as the format requires.
 */
export function wifiQrText(ssid: string, password?: string): string {
  const esc = (v: string) => v.replace(/([\\;,:"])/g, "\\$1");
  return password
    ? `WIFI:T:WPA;S:${esc(ssid)};P:${esc(password)};;`
    : `WIFI:T:nopass;S:${esc(ssid)};;`;
}

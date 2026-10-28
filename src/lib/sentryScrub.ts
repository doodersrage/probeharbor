/**
 * Remove secrets from Sentry events and breadcrumbs before they leave the
 * Worker or the browser. Many ProbeHarbor URLs carry a credential in the path
 * (device ingest keys, share/status/invite/inbound tokens) or query (snooze
 * and ack tokens), and outbound requests can too (Telegram puts the bot token
 * in the URL; Slack/Discord webhook paths are secrets). Sentry records request
 * URLs, headers and fetch breadcrumbs, so everything is scrubbed here.
 */

export const REDACTED = "[redacted]";

/** Path prefixes whose next segment is a credential. */
const SECRET_PATH_PREFIXES = [
  "/api/ingest/",
  "/api/share/",
  "/api/inbound/",
  "/share/chart/",
  "/share/",
  "/embed/",
  "/badge/status/",
  "/status/",
  "/invite/",
];

const SECRET_QUERY_PARAMS = new Set([
  "token",
  "key",
  "ingest_key",
  "api_key",
  "secret",
  "signature",
  "sig",
  "code",
  "access_token",
  "refresh_token",
  "password",
]);

/** Long hex runs (device keys, tokens) and prefixed tokens like gtw_… / gts_…. */
const TOKEN_LIKE = /\b(?:[0-9a-f]{24,}|gt[a-z]_[0-9a-f]{16,})\b/gi;
/** Telegram: https://api.telegram.org/bot<id>:<secret>/sendMessage */
const TELEGRAM_BOT = /\/bot\d+(?::|%3A)[\w-]+/gi;
/** Slack incoming webhooks: /services/T…/B…/<secret> */
const SLACK_SERVICES = /\/services\/[\w-]+\/[\w-]+\/[\w-]+/gi;
/** Discord webhooks: /api/webhooks/<id>/<secret> */
const DISCORD_WEBHOOK = /\/api\/webhooks\/[\w-]+\/[\w-]+/gi;

function scrubPath(path: string): string {
  let out = path
    .replace(TELEGRAM_BOT, `/bot${REDACTED}`)
    .replace(SLACK_SERVICES, `/services/${REDACTED}`)
    .replace(DISCORD_WEBHOOK, `/api/webhooks/${REDACTED}`);
  for (const prefix of SECRET_PATH_PREFIXES) {
    const at = out.indexOf(prefix);
    if (at === -1) continue;
    const start = at + prefix.length;
    const end = out.indexOf("/", start);
    const segment = end === -1 ? out.slice(start) : out.slice(start, end);
    // Keep plain words (/share/manage, /status/confirm); mask anything token-shaped.
    if (segment && !/^[a-z-]{1,20}$/.test(segment)) {
      out = out.slice(0, start) + REDACTED + (end === -1 ? "" : out.slice(end));
    }
  }
  return out.replace(TOKEN_LIKE, REDACTED);
}

function scrubQuery(query: string): string {
  if (!query) return query;
  const body = query.startsWith("?") ? query.slice(1) : query;
  const scrubbed = body
    .split("&")
    .map((pair) => {
      const eq = pair.indexOf("=");
      if (eq === -1) return pair;
      const name = pair.slice(0, eq);
      const value = pair.slice(eq + 1);
      if (SECRET_QUERY_PARAMS.has(name.toLowerCase())) return `${name}=${REDACTED}`;
      return `${name}=${value.replace(TOKEN_LIKE, REDACTED)}`;
    })
    .join("&");
  return query.startsWith("?") ? `?${scrubbed}` : scrubbed;
}

/** Hosts whose paths we know and can scrub precisely. Others keep only their origin. */
const OWN_HOST = /(^|\.)probeharbor\.dev$|^localhost$|^127\.0\.0\.1$/i;

/** Scrub one URL (absolute or relative). Unparseable input is scrubbed as text. */
export function scrubUrl(url: string): string {
  const absolute = /^https?:\/\/([^/?#:]+)/i.exec(url);
  if (absolute && !OWN_HOST.test(absolute[1]!)) {
    // Third-party URLs (user webhooks, Telegram, Slack, Zapier…) can hide a
    // secret anywhere in the path or query: keep only where it went.
    const origin = /^https?:\/\/[^/?#]+/i.exec(url)![0];
    return url.length > origin.length ? `${origin}/${REDACTED}` : origin;
  }
  const q = url.indexOf("?");
  const h = url.indexOf("#");
  const pathEnd = q !== -1 ? q : h !== -1 ? h : url.length;
  const path = url.slice(0, pathEnd);
  const query = q !== -1 ? url.slice(q, h !== -1 && h > q ? h : url.length) : "";
  const hash = h !== -1 ? url.slice(h) : "";
  return scrubPath(path) + scrubQuery(query) + (hash ? "#" + REDACTED : "");
}

/** Scrub every URL inside free text (error messages, breadcrumb messages). */
export function scrubText(text: string): string {
  return text
    .replace(/(?:https?:\/\/|\/)[^\s"'<>]+/g, (match) => scrubUrl(match))
    .replace(TOKEN_LIKE, REDACTED);
}

const DROP_HEADERS = /^(cookie|set-cookie|authorization|x-ingest-key|x-api-key|proxy-authorization)$|signature/i;

type Headers = Record<string, unknown>;
type RequestData = {
  url?: string;
  query_string?: unknown;
  headers?: Headers;
  cookies?: unknown;
  data?: unknown;
};
type ExceptionValue = { value?: string };
type Breadcrumb = { message?: string; data?: Record<string, unknown> };
type ScrubbableEvent = {
  message?: string;
  request?: RequestData;
  exception?: { values?: ExceptionValue[] };
  breadcrumbs?: Breadcrumb[];
};

export function scrubBreadcrumb<T extends Breadcrumb>(breadcrumb: T): T {
  if (typeof breadcrumb.message === "string") breadcrumb.message = scrubText(breadcrumb.message);
  const data = breadcrumb.data;
  if (data) {
    for (const key of ["url", "to", "from"]) {
      if (typeof data[key] === "string") data[key] = scrubUrl(data[key] as string);
    }
  }
  return breadcrumb;
}

export function scrubEvent<T extends ScrubbableEvent>(event: T): T {
  if (typeof event.message === "string") event.message = scrubText(event.message);
  const request = event.request;
  if (request) {
    if (typeof request.url === "string") request.url = scrubUrl(request.url);
    if (typeof request.query_string === "string") request.query_string = scrubQuery(request.query_string);
    else if (request.query_string != null) request.query_string = REDACTED;
    if (request.headers) {
      for (const name of Object.keys(request.headers)) {
        if (DROP_HEADERS.test(name)) delete request.headers[name];
        else if (typeof request.headers[name] === "string") {
          request.headers[name] = scrubText(request.headers[name] as string);
        }
      }
    }
    delete request.cookies;
    // Request bodies can hold Wi-Fi settings, ingest payloads or webhook secrets.
    delete request.data;
  }
  for (const value of event.exception?.values ?? []) {
    if (typeof value.value === "string") value.value = scrubText(value.value);
  }
  for (const crumb of event.breadcrumbs ?? []) scrubBreadcrumb(crumb);
  return event;
}

/**
 * Scrub every string in a value (replay recording events nest URLs in
 * performance spans and navigation entries). Bounded depth; returns the input.
 */
export function scrubDeep<T>(value: T, depth = 0): T {
  if (depth > 8 || value == null) return value;
  if (typeof value === "string") return scrubText(value) as T;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) value[i] = scrubDeep(value[i], depth + 1);
    return value;
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of Object.keys(record)) record[key] = scrubDeep(record[key], depth + 1);
  }
  return value;
}

---
description: "ProbeHarbor HTTP API reference: device-key ingest, Bearer API keys, share-link JSON, Prometheus metrics, and the OpenAPI contract."
---

# HTTP API

Machine-readable contract:

- **This docs site:** [openapi.yaml](/openapi.yaml)
- **Production:** [probeharbor.dev/openapi.yaml](https://probeharbor.dev/openapi.yaml)
- **In-app page:** [probeharbor.dev/docs/api](https://probeharbor.dev/docs/api)

## Authentication

| Audience | Mechanism |
|----------|-----------|
| Device firmware | Device key in `/api/ingest/{deviceKey}` (or `X-Ingest-Key` for MQTT bridge) |
| Pro integrations | Bearer **API key** from Dashboard → Share |
| Browser dashboard | Supabase session cookies (not for third-party clients) |
| Share links | Opaque token in the URL path |

## Endpoint map

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `POST` | `/api/ingest/{deviceKey}` | Path key | Push sensor readings |
| `POST` | `/api/ingest/mqtt` | `X-Ingest-Key` | MQTT→HTTP bridge |
| `POST` | `/api/user/pull-setup` | Session cookie | Save pull feeds + probe labels (JSON body) |
| `GET` | `/api/user/door-events` | Session cookie | Door openings: the latest `limit` (default 12, max 50), or with `from` / `to` (`YYYY-MM-DD` in your browser's time zone, or ISO timestamps) the openings that started in that range, newest first (`limit` default 100, max 500; adds `range` and `truncated`). Also `live_sessions` for the last 24 h |
| `GET` | `/api/door-events/export.csv` | Session cookie (CSV plan) | Door openings with temperature and humidity at open and close (`from`, `to`, `days`, `door`); UTC times |
| `POST` | `/api/devices/reveal-ingest-key` | Session cookie | Recover encrypted push ingest key (rate-limited; audited) |
| `GET` | `/api/v1/metrics` | Bearer API key | Prometheus text exposition |
| `GET` | `/api/v1/devices` | Bearer API key | List household devices |
| `POST` | `/api/v1/devices` | Bearer API key | Create push device |
| `POST` | `/api/inbound/{token}` | Token + HMAC signature (timestamped V2 recommended) | Snooze / vacation / status actions |
| `GET` | `/api/share/{token}/readings` | Share token | Public JSON readings (Free family live; Pro expands scopes) |
| `POST` | `/api/pucks/register` | Companion session | Register claim-puck secret |
| `POST` | `/api/pucks/claim/start` | Companion session | Issue claim nonce |
| `POST` | `/api/pucks/claim/finish` | Companion session | Verify HMAC and bind bay |
| `GET` | `/api/bays/{bay_id}/mood` | Companion session | Derived bay mood (Bay Buddy / claim puck) |
| `PUT` | `/api/bays/{bay_id}/mood` | Companion session | Override mood (demo / test) |

Bearer API keys need the household owner's plan to include the API (Pro) **at the time of each call**. After a downgrade, `/api/v1/*` returns `403` `{"error": "API access needs a Pro plan"}`; creating a device past the plan's limit returns `403` with `"code": "device_limit"`. Device ingest keys keep working.

## Claim puck

Physical RP2040-Zero presence key. Product page: [probeharbor.dev/claim-puck](https://probeharbor.dev/claim-puck). Firmware: [probeharbor-claim-puck](https://github.com/doodersrage/probeharbor-claim-puck).

Auth matches Bay Buddy: `Authorization: Bearer <access>` + `X-SB-Refresh-Token: <refresh>`.

Flow: `register` → `claim/start` → device `CHALLENGE` + button → `claim/finish` → poll `GET /api/bays/{bay}/mood`.

## Create an API key (Pro)

1. Sign in → **Dashboard → Share**  
2. Create an API key; copy it once  
3. Call:

```bash
curl -sS "https://probeharbor.dev/api/v1/metrics" \
  -H "Authorization: Bearer YOUR_API_KEY" | head
```

## Example: list devices

```bash
curl -sS "https://probeharbor.dev/api/v1/devices" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Spec versioning

`openapi.yaml` in the repo (`public/openapi.yaml`) is the source of truth. The docs build copies it into this site on every Pages deploy.

Legacy per-feed routes (`/api/user/temp-feeds`, `/api/user/temp-probes`) are retired — use **`POST /api/user/pull-setup`** instead.

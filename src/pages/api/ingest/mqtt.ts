import type { APIContext, APIRoute } from "astro";
import { readJsonBodyWithLimit } from "../../../lib/ingestLimits";
import { POST as ingestPost } from "./[deviceKey]";

/**
 * MQTT-over-HTTP bridge: POST JSON shaped like an MQTT webhook relay.
 * Body: { "topic": "home/garage/temp", "payload": "{\"temp1\":42.5}" }
 * or:   { "topic": "...", "message": { "temp1": 42.5 } }
 *
 * Include header `X-Ingest-Key: <device-key>` to route to ingest.
 * The payload is handed to the ingest handler in-process (no HTTP hop).
 */
export const POST: APIRoute = async ({ request }) => {
  const deviceKey = request.headers.get("X-Ingest-Key")?.trim();
  if (!deviceKey) {
    return new Response(JSON.stringify({ error: "Missing X-Ingest-Key header" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await readJsonBodyWithLimit(request);
  if (!body.ok) {
    return new Response(JSON.stringify({ error: body.error }), {
      status: body.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.payload || typeof body.payload !== "object" || Array.isArray(body.payload)) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const envelope = body.payload as Record<string, unknown>;

  let payload: Record<string, unknown>;
  if (envelope.message && typeof envelope.message === "object") {
    payload = envelope.message as Record<string, unknown>;
  } else if (typeof envelope.payload === "string") {
    try {
      payload = JSON.parse(envelope.payload) as Record<string, unknown>;
    } catch {
      return new Response(JSON.stringify({ error: "Invalid payload JSON string" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } else if (envelope.payload && typeof envelope.payload === "object") {
    payload = envelope.payload as Record<string, unknown>;
  } else {
    return new Response(JSON.stringify({ error: "Missing payload or message" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const ingestRequest = new Request(new URL("/api/ingest/_", request.url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Ingest-Key": deviceKey,
    },
    body: JSON.stringify(payload),
  });
  return ingestPost({
    params: { deviceKey: "_" },
    request: ingestRequest,
  } as unknown as APIContext);
};

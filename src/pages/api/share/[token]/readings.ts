import type { APIRoute } from "astro";
import { createServerClient } from "../../../../lib/supabase";
import { LEGACY_RAW_SHARE_TOKEN, sha256Hex } from "../../../../lib/shareLinkTokens";
import { checkEdgeRateLimit } from "../../../../lib/edgeRateLimit";
import { fetchLatestSensorValues } from "../../../../lib/sensorReadings";
import { listHouseholdDevices } from "../../../../lib/devices";
import { buildPrometheusText } from "../../../../lib/prometheusMetrics";
import { fetchHouseholdChartData } from "../../../../lib/garageTempsHistory";
import { checkShareReadingsRateLimit } from "../../../../lib/shareReadingsLimits";
import {
  resolveShareReadingsFormat,
  shareScopeAllowsMetrics,
} from "../../../../lib/shareReadingsAccess";
import { apiLocale } from "../../../../i18n/messages/app/apiMore/common";
import { apiMorePublicFormsMessages } from "../../../../i18n/messages/app/apiMore/publicForms";

async function resolveShare(token: string) {
  const supabase = createServerClient();
  const columns = "id, household_id, scope, label, expires_at";
  let { data, error } = await supabase
    .from("share_links")
    .select(columns)
    .eq("token_hash", await sha256Hex(token))
    .maybeSingle();

  // Rows the previous code created after the migration but before this
  // deploy have no hash yet. Only the old 48-hex shape is tried raw.
  if (!data && LEGACY_RAW_SHARE_TOKEN.test(token)) {
    ({ data, error } = await supabase
      .from("share_links")
      .select(columns)
      .eq("token", token)
      .is("token_hash", null)
      .maybeSingle());
  }

  if (error || !data) return null;
  if (data.expires_at && Date.parse(data.expires_at) < Date.now()) return null;
  return data;
}

export const GET: APIRoute = async (context) => {
  const { params, url, clientAddress } = context;
  const locale = apiLocale(context);
  const t = apiMorePublicFormsMessages(locale).shareReadings;
  const token = params.token;
  if (!token) {
    return new Response(JSON.stringify({ error: t.missingToken }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Per visitor and link, as before; the token is hashed so it isn't a limiter key.
  const rateKey = `${clientAddress || "unknown"}:${(await sha256Hex(token)).slice(0, 16)}`;
  const edgeAllowed = await checkEdgeRateLimit("SHARE_READINGS_RATE_LIMITER", rateKey);
  const rate =
    edgeAllowed === false
      ? { ok: false, retryAfterSec: 60 }
      : checkShareReadingsRateLimit(`${clientAddress || "unknown"}:${token.slice(0, 12)}`);
  if (!rate.ok) {
    return new Response(JSON.stringify({ error: t.tooManyRequests }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        ...(rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : {}),
      },
    });
  }

  const share = await resolveShare(token);
  if (!share) {
    return new Response(JSON.stringify({ error: t.invalidLink }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const formatResult = resolveShareReadingsFormat(
    share.scope,
    url.searchParams.get("format"),
    locale,
  );
  if (!formatResult.ok) {
    return new Response(JSON.stringify({ error: formatResult.error }), {
      status: formatResult.status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
  const { format } = formatResult;

  const readings = await fetchLatestSensorValues(share.household_id);
  const devices = await listHouseholdDevices(share.household_id);

  if (format === "prometheus") {
    const body = await buildPrometheusText(share.household_id);
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  if (format === "grafana") {
    const series = readings
      .filter((row) => row.value_num != null)
      .map((row) => ({
        target: `${row.deviceName}/${row.sensor.label}`,
        datapoints: [
          [row.value_num as number, Date.parse(row.recorded_at) || Date.now()],
        ],
      }));
    return new Response(JSON.stringify(series), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  let historyPoints: Array<{
    timestamp: string;
    tempf: number;
    humidity: number | null;
    probeLabel: string;
  }> = [];
  if (share.scope === "history") {
    const chart = await fetchHouseholdChartData(share.household_id, 7);
    historyPoints = chart.points;
  }

  return new Response(
    JSON.stringify({
      scope: share.scope,
      label: share.label,
      expires_at: share.expires_at,
      readings: readings.map((row) => ({
        device: row.deviceName,
        key: row.sensor.key,
        label: row.sensor.label,
        kind: row.sensor.kind,
        unit: row.sensor.unit,
        value_num: row.value_num,
        value_bool: row.value_bool,
        value_text: row.value_text,
        recorded_at: row.recorded_at,
      })),
      devices: devices.devices.map((d) => ({
        name: d.name,
        last_seen_at: d.last_seen_at,
        source: d.source,
        space: d.space ?? null,
      })),
      history_points: historyPoints,
      ...(shareScopeAllowsMetrics(share.scope)
        ? {
            metrics_urls: {
              prometheus: `/api/share/${token}/readings?format=prometheus`,
              grafana: `/api/share/${token}/readings?format=grafana`,
            },
          }
        : {}),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};

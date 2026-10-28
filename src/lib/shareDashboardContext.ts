import type { AstroCookies } from "astro";
import { getAuthFromCookies } from "./auth";
import { getOrCreateHouseholdForUser, getUserHouseholdRole, canManageHousehold } from "./households";
import { getUserEntitlements } from "./entitlements";
import { createServerClient } from "./supabase";
import { getSiteUrl } from "./stripe";
import { listHouseholdApiKeys } from "./apiKeys";
import { listInboundWebhooks } from "./inboundWebhooks";
import { listStatusPageTokens } from "./statusPage";
import { sha256Hex } from "./shareLinkTokens";
import { listIngestStatsForHousehold } from "./ingestStats";
import { listHouseholdActivity } from "./householdActivity";
import { listRecentWebhookDeliveries } from "./webhookDeliveries";
import {
  FLASH_API_KEY,
  FLASH_INBOUND_SIGNING,
  FLASH_INBOUND_TOKEN,
  FLASH_SHARE_TOKEN,
  FLASH_STATUS_TOKEN,
  consumeSecretFlash,
} from "./secretFlash";
import type { Locale } from "../i18n/locales";
import { shareMessages, shareNotice } from "../i18n/messages/app/share";

export async function loadShareDashboardContext(
  cookies: AstroCookies,
  request: Request,
  url: URL,
  locale: Locale = "en",
) {
  const { session, user } = await getAuthFromCookies(cookies);
  if (!session || !user) {
    return { redirect: "/signin" as const };
  }

  const inboundToken = consumeSecretFlash(cookies, FLASH_INBOUND_TOKEN);
  const inboundSigningSecret = consumeSecretFlash(cookies, FLASH_INBOUND_SIGNING);

  const entitlements = await getUserEntitlements(user.id);
  const household = await getOrCreateHouseholdForUser(user.id, user.email);
  const supabase = createServerClient();
  const { data: rawLinks } = household.householdId
    ? await supabase
        .from("share_links")
        .select("id, token, token_hash, token_preview, scope, label, expires_at, created_at")
        .eq("household_id", household.householdId)
        .order("created_at", { ascending: false })
    : { data: [] };

  const householdRole = household.householdId
    ? await getUserHouseholdRole(user.id, household.householdId)
    : null;
  const canManage = canManageHousehold(householdRole);

  // A just-created or regenerated link is in the flash cookie; match it by hash
  // so its row can show the full URL this once. Other hashed links have no
  // raw token to show; pre-hash links keep theirs (managers only).
  const newToken = canManage ? consumeSecretFlash(cookies, FLASH_SHARE_TOKEN) : null;
  const newTokenHash = newToken ? await sha256Hex(newToken) : null;
  const links = (rawLinks ?? []).map((link) => {
    const isNew = Boolean(newTokenHash && link.token_hash === newTokenHash);
    return {
      id: link.id,
      scope: link.scope,
      label: link.label,
      expires_at: link.expires_at,
      created_at: link.created_at,
      token_preview: link.token_preview ?? link.token?.slice(-4) ?? null,
      token: canManage ? (isNew ? newToken : link.token) : null,
      is_new: isNew,
    };
  });

  const apiKeys = household.householdId
    ? await listHouseholdApiKeys(household.householdId)
    : [];

  const inboundWebhooks = household.householdId
    ? (await listInboundWebhooks(household.householdId)).webhooks
    : [];

  // Managers only: legacy rows still carry a usable raw token.
  const statusPages = household.householdId && canManage
    ? await listStatusPageTokens(household.householdId)
    : [];

  const ingestStats = household.householdId
    ? await listIngestStatsForHousehold(household.householdId, 7)
    : [];

  const activity = household.householdId
    ? await listHouseholdActivity(household.householdId, 15)
    : [];

  const siteUrl = getSiteUrl(request);
  const webhookDeliveries = await listRecentWebhookDeliveries(user.id, 15);
  const statusToken = canManage ? consumeSecretFlash(cookies, FLASH_STATUS_TOKEN) : null;
  const newHref = newToken ? `${siteUrl}/share/${newToken}` : null;
  const newApiKey = consumeSecretFlash(cookies, FLASH_API_KEY);

  const notice = shareNotice(url, shareMessages(locale).notices);
  const noticeIsError = Boolean(url.searchParams.get("error"));

  return {
    redirect: null,
    user,
    entitlements,
    household,
    links,
    apiKeys,
    inboundWebhooks,
    statusPages,
    ingestStats,
    activity,
    canManage,
    siteUrl,
    webhookDeliveries,
    newToken,
    statusToken,
    newHref,
    newApiKey,
    inboundToken,
    inboundSigningSecret,
    notice,
    noticeIsError,
  };
}

export type ShareDashboardContext = Exclude<
  Awaited<ReturnType<typeof loadShareDashboardContext>>,
  { redirect: string }
>;

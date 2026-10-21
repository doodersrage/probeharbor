import type { APIRoute } from "astro";
import { createServerClient } from "../../../lib/supabase";
import {
  getAlertSettingsForUser,
  saveAlertSettingsForUser,
} from "../../../lib/notify";
import {
  snoozeUntilFromHours,
  vacationUntilFromDays,
} from "../../../lib/alertSnooze";
import { getUserHouseholdId } from "../../../lib/households";
import { fetchLatestSensorValues } from "../../../lib/sensorReadings";
import {
  filterRowsByLabel,
  parseTelegramSnoozeHours,
  parseTelegramVacationDays,
  telegramStatusQuery,
  TELEGRAM_HELP,
} from "../../../lib/telegramCommands";
import { checkTelegramWebhookRateLimit } from "../../../lib/telegramWebhookLimits";
import { timingSafeEqual } from "../../../lib/timingSafeEqual";
import type { Locale } from "../../../i18n/locales";
import { ensureLocale } from "../../../i18n/catalog";
import { fmt, formatNumber, plural } from "../../../i18n/format";
import { localeFromMetadata } from "../../../i18n/userLocale";
import { alertJobsMessages } from "../../../i18n/messages/app/alertJobs";

/** The linked account's language for bot replies (English when it can't be read). */
async function linkedUserLocale(userId: string): Promise<Locale> {
  try {
    const { createAdminClient } = await import("../../../lib/supabase");
    const { data } = await createAdminClient().auth.admin.getUserById(userId);
    const locale = localeFromMetadata(data.user?.user_metadata as Record<string, unknown> | undefined);
    await ensureLocale(locale, ["app"]);
    return locale;
  } catch {
    return "en";
  }
}

async function resolveUserByTelegramSecret(
  secret: string,
): Promise<string | null> {
  if (!secret.trim()) return null;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("alert_settings")
    .select("user_id")
    .eq("telegram_command_secret", secret.trim())
    .maybeSingle();
  return data?.user_id ?? null;
}

async function sendTelegramReply(
  botToken: string,
  chatId: number | string,
  text: string,
): Promise<void> {
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

function resolveTelegramSecret(request: Request): string {
  // Header only — query ?secret= is rejected (Referer/log leakage).
  return request.headers.get("X-Telegram-Bot-Api-Secret-Token")?.trim() ?? "";
}

export const POST: APIRoute = async ({ request, url, clientAddress }) => {
  const rate = checkTelegramWebhookRateLimit(clientAddress ?? "unknown");
  if (!rate.ok) {
    return new Response("Rate limit exceeded", {
      status: 429,
      headers: rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : {},
    });
  }

  const secret = resolveTelegramSecret(request);
  const userId = await resolveUserByTelegramSecret(secret);
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  let update: { message?: { text?: string; chat?: { id?: number } } } | null;
  try {
    update = (await request.json()) as typeof update;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!update || typeof update !== "object") {
    return new Response("Invalid JSON", { status: 400 });
  }
  const text = update.message?.text?.trim() ?? "";
  const chatId = update.message?.chat?.id;
  if (!text || chatId == null) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const settings = await getAlertSettingsForUser(userId);
  const token = settings.telegramBotToken;
  if (!token) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const locale = await linkedUserLocale(userId);
  const t = alertJobsMessages(locale).telegram;

  // Require a bound chat id so a leaked secret cannot exfiltrate /status
  // to an attacker-controlled chat.
  const expectedChat = settings.telegramChatId?.trim();
  if (!expectedChat) {
    await sendTelegramReply(token, chatId, t.commandsDisabled);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!timingSafeEqual(String(chatId), expectedChat)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const cmd = (text.split(/\s+/)[0] ?? "").toLowerCase().replace(/@\S+$/, "");

  if (cmd === "/snooze") {
    const hours = parseTelegramSnoozeHours(text);
    await saveAlertSettingsForUser(userId, {
      ...settings,
      snoozeUntil: snoozeUntilFromHours(hours),
    });
    await sendTelegramReply(
      token,
      chatId,
      plural(t.snoozed, hours, locale),
    );
  } else if (cmd === "/vacation") {
    const days = parseTelegramVacationDays(text);
    await saveAlertSettingsForUser(userId, {
      ...settings,
      vacationUntil: vacationUntilFromDays(days),
    });
    await sendTelegramReply(
      token,
      chatId,
      plural(t.vacation, days, locale),
    );
  } else if (cmd === "/status") {
    const householdId = await getUserHouseholdId(userId);
    if (!householdId) {
      await sendTelegramReply(token, chatId, t.noHousehold);
    } else {
      const latest = await fetchLatestSensorValues(householdId);
      const query = telegramStatusQuery(text);
      const rows = filterRowsByLabel(latest, query);
      const lines = rows.slice(0, 6).map((row) => {
        const num =
          row.value_num == null
            ? ""
            : locale === "en"
              ? row.value_num.toFixed(1)
              : formatNumber(row.value_num, locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        const val =
          row.value_num != null
            ? `${num}${row.sensor.unit ?? ""}`
            : row.value_bool != null
              ? row.value_bool
                ? t.open
                : t.closed
              : "—";
        return `${row.sensor.label}: ${val}`;
      });
      await sendTelegramReply(
        token,
        chatId,
        lines.length
          ? lines.join("\n")
          : query
            ? fmt(t.noMatch, { query })
            : t.noReadings,
      );
    }
  } else if (cmd === "/help") {
    await sendTelegramReply(token, chatId, locale === "en" ? TELEGRAM_HELP : t.help);
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};

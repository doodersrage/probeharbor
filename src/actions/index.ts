import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";
import { getAuthFromCookies, setAuthCookies } from "../lib/auth";
import {
  updateUserDisplayPreferences,
  parseDisplayPreferencesInput,
  type ThemePreference,
} from "../lib/userPreferences";
import { createServerClient, createAuthClient } from "../lib/supabase";
import { updateUserAlertSettings } from "../lib/alertNotifications";
import {
  alertChannelsIncomplete,
  buildAlertSettingsFromFormData,
  findInvalidAlertWebhookUrl,
  isWeakTelegramSecret,
} from "../lib/alertSettingsForm";
import {
  getAlertSettingsForUser,
  saveAlertSettingsForUser,
} from "../lib/notify";
import {
  snoozeUntilFromHours,
  vacationUntilFromDate,
  vacationUntilFromDays,
} from "../lib/alertSnooze";
import { getUserEntitlements } from "../lib/entitlements";
import {
  householdEditorCtx,
  requireHouseholdEditor,
} from "../lib/householdAuth";
import { recordHouseholdActivity } from "../lib/householdActivity";
import { recordAlertSettingsChange } from "../lib/alertSettingsHistory";
import {
  getOwnedHouseholdId,
  getOrCreateHouseholdForUser,
  getUserHouseholdId,
  updateHouseholdName,
} from "../lib/households";
import {
  createHouseholdInvite,
  parseHouseholdInviteRole,
  sendInviteEmail,
} from "../lib/householdInvites";
import { buildSiteUrl } from "../lib/stripe";
import { updateHouseholdFreezeMapSettings } from "../lib/freezeMap";
import {
  deleteDeviceSensor,
  defaultUnitForKind,
  isSensorKind,
  listHouseholdDevices,
  renamePushDevice,
  updateDeviceSensor,
  updateDeviceSpace,
  upsertDeviceSensor,
} from "../lib/devices";
import { fmt, type Locale } from "../i18n";
import { apiLocale, apiMoreCommonMessages } from "../i18n/messages/app/apiMore/common";
import { apiMoreActionsMessages } from "../i18n/messages/app/apiMore/actions";

async function requireAuthed(cookies: Parameters<typeof getAuthFromCookies>[0], locale: Locale = "en") {
  const { session, user } = await getAuthFromCookies(cookies);
  if (!session || !user) {
    throw new ActionError({
      code: "UNAUTHORIZED",
      message: apiMoreActionsMessages(locale).signInToContinue,
    });
  }
  return { session, user };
}

async function requireEditor(userId: string, locale: Locale = "en") {
  const editor = await requireHouseholdEditor(userId);
  if (!editor.ok) {
    const t = apiMoreActionsMessages(locale);
    throw new ActionError({
      code: "FORBIDDEN",
      message:
        editor.error === "viewer"
          ? t.viewOnly
          : t.noHousehold,
    });
  }
  return householdEditorCtx(editor);
}

export const server = {
  updateDisplayPreferences: defineAction({
    accept: "form",
    input: z.object({
      show_garage_temps: z.string().optional(),
      show_weather: z.string().optional(),
      use_celsius: z.string().optional(),
      weather_city_id: z.string().optional(),
      weather_source: z.enum(["openweather", "ambient", "weatherflow"]).optional(),
      ambient_weather_mac: z.string().optional(),
      ambient_weather_api_key: z.string().optional(),
      weatherflow_station_id: z.string().optional(),
      weatherflow_token: z.string().optional(),
      theme: z.enum(["dark", "light", "system"]).optional(),
      redirect: z.string().optional(),
    }),
    handler: async (input, context) => {
      const locale = apiLocale(context);
      const t = apiMoreActionsMessages(locale);
      await requireAuthed(context.cookies, locale);

      const accessToken = context.cookies.get("sb-access-token")?.value;
      const refreshToken = context.cookies.get("sb-refresh-token")?.value;
      if (!accessToken || !refreshToken) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: t.sessionExpired,
        });
      }

      const prefs = parseDisplayPreferencesInput(input);

      const { error } = await updateUserDisplayPreferences(accessToken, refreshToken, prefs);

      if (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: error.message || t.displayPrefsSaveFailed,
        });
      }

      context.cookies.set("theme", prefs.theme, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
      });

      // Fresh client -- never the shared `supabase` singleton, whose
      // ambient session is effectively shared mutable state across
      // concurrent requests under Cloudflare Workers, and whose
      // refreshSession() result here gets turned straight into this
      // response's auth cookies.
      const { data: refreshedSession } = await createAuthClient().auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (refreshedSession.session) {
        setAuthCookies(
          context.cookies,
          refreshedSession.session.access_token,
          refreshedSession.session.refresh_token,
        );
      }

      return {
        ok: true as const,
        theme: prefs.theme,
        message: t.displayPrefsSaved,
      };
    },
  }),

  updateAlertSettings: defineAction({
    accept: "form",
    // No Zod input schema: alert forms are dynamic. z.record fails Astro form
    // parsing (FormData is passed through and fails "expected record").
    handler: async (formData, context) => {
      const locale = apiLocale(context);
      const t = apiMoreActionsMessages(locale);
      const { session, user } = await requireAuthed(context.cookies, locale);
      await requireEditor(user.id, locale);

      if (!(formData instanceof FormData)) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: t.expectedFormData,
        });
      }

      const existing = await getAlertSettingsForUser(
        user.id,
        user.user_metadata as Record<string, unknown> | undefined,
      );
      const entitlements = await getUserEntitlements(user.id);
      const settings = buildAlertSettingsFromFormData(
        formData,
        existing,
        entitlements,
      );

      const invalidWebhookField = findInvalidAlertWebhookUrl(settings);
      if (invalidWebhookField) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: t.invalidWebhookUrl,
        });
      }

      if (isWeakTelegramSecret(settings.telegramCommandSecret)) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: t.weakTelegramSecret,
        });
      }

      const { error } = await updateUserAlertSettings(
        session.access_token,
        session.refresh_token,
        user.id,
        settings,
      );

      if (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: error.message || t.alertSettingsSaveFailed,
        });
      }

      await recordAlertSettingsChange(user.id, existing, settings, locale);

      const householdId = await getUserHouseholdId(user.id);
      if (householdId) {
        await recordHouseholdActivity({
          householdId,
          userId: user.id,
          action: "alert_settings_saved",
          detail: settings.enabled ? "alerts on" : "alerts off",
        });
      }

      return {
        ok: true as const,
        channelsIncomplete: alertChannelsIncomplete(settings),
        message: alertChannelsIncomplete(settings)
          ? t.alertSettingsSavedIncomplete
          : t.alertSettingsSaved,
        snoozeUntil: settings.snoozeUntil,
        vacationUntil: settings.vacationUntil,
      };
    },
  }),

  updateAlertSnooze: defineAction({
    accept: "form",
    input: z.object({
      action: z.enum([
        "snooze_24",
        "vacation_7",
        "vacation_until",
        "clear_snooze",
        "clear_vacation",
      ]),
      until: z.string().optional(),
      redirect: z.string().optional(),
    }),
    handler: async (input, context) => {
      const locale = apiLocale(context);
      const t = apiMoreActionsMessages(locale);
      const { user } = await requireAuthed(context.cookies, locale);
      await requireEditor(user.id, locale);

      const settings = await getAlertSettingsForUser(
        user.id,
        user.user_metadata as Record<string, unknown>,
      );

      if (input.action === "snooze_24") {
        await saveAlertSettingsForUser(user.id, {
          ...settings,
          snoozeUntil: snoozeUntilFromHours(24),
        });
        return {
          ok: true as const,
          kind: "snooze" as const,
          message: t.snoozed24h,
        };
      }

      if (input.action === "vacation_7") {
        await saveAlertSettingsForUser(user.id, {
          ...settings,
          vacationUntil: vacationUntilFromDays(7),
        });
        return {
          ok: true as const,
          kind: "vacation" as const,
          message: t.vacation7d,
        };
      }

      if (input.action === "vacation_until") {
        const vacationUntil = vacationUntilFromDate(input.until ?? "");
        if (!vacationUntil) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: t.pickFutureDate,
          });
        }
        await saveAlertSettingsForUser(user.id, {
          ...settings,
          vacationUntil,
        });
        return {
          ok: true as const,
          kind: "vacation" as const,
          message: fmt(t.vacationUntil, { date: input.until ?? "" }),
        };
      }

      if (input.action === "clear_snooze") {
        await saveAlertSettingsForUser(user.id, {
          ...settings,
          snoozeUntil: null,
        });
        return {
          ok: true as const,
          kind: "snooze_cleared" as const,
          message: t.snoozeCleared,
        };
      }

      await saveAlertSettingsForUser(user.id, {
        ...settings,
        vacationUntil: null,
      });
      return {
        ok: true as const,
        kind: "vacation_cleared" as const,
        message: t.vacationEnded,
      };
    },
  }),

  inviteHouseholdMember: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email("Enter a valid email."),
      role: z
        .enum(["member", "viewer", "alert_only", "property_manager"])
        .optional(),
      redirect: z.string().optional(),
      action: z.string().optional(),
    }),
    handler: async (input, context) => {
      const locale = apiLocale(context);
      const t = apiMoreActionsMessages(locale);
      const { user } = await requireAuthed(context.cookies, locale);
      // Targets the household the user owns (checked below), so the role in
      // the active household doesn't matter here.
      const ownedId = await getOwnedHouseholdId(user.id);
      const household = await getOrCreateHouseholdForUser(user.id, user.email);
      const manageId = ownedId ?? household.householdId;
      if (!manageId || !ownedId || ownedId !== manageId) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: t.ownerOnlyInvite,
        });
      }

      const email = input.email.trim().toLowerCase();
      const role = parseHouseholdInviteRole(input.role) ?? "member";
      if (role === "property_manager") {
        const entitlements = await getUserEntitlements(user.id);
        if (entitlements.tier !== "portfolio" && entitlements.tier !== "admin") {
          throw new ActionError({
            code: "FORBIDDEN",
            message:
              t.portfolioRequired,
          });
        }
      }
      const { invite, error } = await createHouseholdInvite(
        manageId,
        email,
        user.id,
        7,
        role,
      );
      if (error || !invite) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: error || t.inviteFailed,
        });
      }

      const db = createServerClient();
      const { data: householdRow } = await db
        .from("households")
        .select("name")
        .eq("id", manageId)
        .maybeSingle();

      const acceptUrl = buildSiteUrl(context.request, `/invite/${invite.token}`);
      await sendInviteEmail(
        email,
        acceptUrl,
        householdRow?.name ?? apiMoreCommonMessages(locale).defaults.aHousehold,
        user.email ?? null,
        locale,
      );

      return {
        ok: true as const,
        message: fmt(t.inviteSent, { email }),
        email,
      };
    },
  }),

  renameHousehold: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(1, "Name is required."),
      redirect: z.string().optional(),
      action: z.string().optional(),
    }),
    handler: async (input, context) => {
      const locale = apiLocale(context);
      const t = apiMoreActionsMessages(locale);
      const { user } = await requireAuthed(context.cookies, locale);
      // Targets the household the user owns (checked below), so the role in
      // the active household doesn't matter here.
      const ownedId = await getOwnedHouseholdId(user.id);
      if (!ownedId) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: t.ownerOnlyRename,
        });
      }

      const name = input.name.trim();
      await updateHouseholdName(ownedId, name);
      return {
        ok: true as const,
        message: t.householdNameSaved,
        name,
      };
    },
  }),

  updateFreezeMapSettings: defineAction({
    accept: "form",
    input: z.object({
      freeze_map_opt_in: z.string().optional(),
      freeze_map_city_id: z.string().optional(),
      freeze_map_label: z.string().optional(),
      freeze_map_lat: z.string().optional(),
      freeze_map_lon: z.string().optional(),
      redirect: z.string().optional(),
      action: z.string().optional(),
    }),
    handler: async (input, context) => {
      const locale = apiLocale(context);
      const t = apiMoreActionsMessages(locale);
      const { user } = await requireAuthed(context.cookies, locale);
      // Targets the household the user owns (checked below), so the role in
      // the active household doesn't matter here.
      const ownedId = await getOwnedHouseholdId(user.id);
      if (!ownedId) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: t.ownerOnlyFreezeMap,
        });
      }

      const latRaw = input.freeze_map_lat?.trim();
      const lonRaw = input.freeze_map_lon?.trim();
      const lat = latRaw ? Number(latRaw) : null;
      const lon = lonRaw ? Number(lonRaw) : null;
      const result = await updateHouseholdFreezeMapSettings(ownedId, {
        optIn:
          input.freeze_map_opt_in === "true" || input.freeze_map_opt_in === "on",
        cityId: input.freeze_map_city_id?.trim() || null,
        lat: Number.isFinite(lat) ? lat : null,
        lon: Number.isFinite(lon) ? lon : null,
        label: input.freeze_map_label?.trim() || null,
      });

      if (result.error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: result.error,
        });
      }

      return {
        ok: true as const,
        message: t.freezeMapSaved,
      };
    },
  }),

  renameDevice: defineAction({
    accept: "form",
    input: z.object({
      device_id: z.string().min(1),
      name: z.string().min(1, "Name is required."),
      redirect: z.string().optional(),
      action: z.string().optional(),
    }),
    handler: async (input, context) => {
      const locale = apiLocale(context);
      const t = apiMoreActionsMessages(locale);
      const { user } = await requireAuthed(context.cookies, locale);
      const { householdId } = await requireEditor(user.id, locale);

      const result = await renamePushDevice(
        householdId,
        input.device_id,
        input.name.trim(),
        locale,
      );
      if (result.error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: result.error,
        });
      }

      return {
        ok: true as const,
        message: t.deviceRenamed,
        name: input.name.trim(),
      };
    },
  }),

  updateDeviceSpaceAction: defineAction({
    accept: "form",
    input: z.object({
      device_id: z.string().min(1),
      space: z.string().optional(),
      redirect: z.string().optional(),
      action: z.string().optional(),
    }),
    handler: async (input, context) => {
      const locale = apiLocale(context);
      const t = apiMoreActionsMessages(locale);
      const { user } = await requireAuthed(context.cookies, locale);
      const { householdId } = await requireEditor(user.id, locale);

      const result = await updateDeviceSpace(
        householdId,
        input.device_id,
        input.space?.trim() ?? "",
        locale,
      );
      if (result.error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: result.error,
        });
      }

      return {
        ok: true as const,
        message: t.deviceSpaceSaved,
        space: input.space?.trim() ?? "",
      };
    },
  }),

  updateSensor: defineAction({
    accept: "form",
    input: z.object({
      sensor_id: z.string().min(1),
      device_id: z.string().min(1),
      key: z.string().min(1),
      label: z.string().min(1),
      kind: z.string().optional(),
      unit: z.string().optional(),
      offset_num: z.string().optional(),
      visible: z.string().optional(),
    }),
    handler: async (input, context) => {
      const locale = apiLocale(context);
      const t = apiMoreActionsMessages(locale);
      const { user } = await requireAuthed(context.cookies, locale);
      const { householdId } = await requireEditor(user.id, locale);
      const owned = await listHouseholdDevices(householdId);
      if (!owned.devices.some((d) => d.id === input.device_id)) {
        throw new ActionError({ code: "FORBIDDEN", message: t.deviceNotFound });
      }
      const kindRaw = input.kind ?? "generic";
      const kind = isSensorKind(kindRaw) ? kindRaw : ("generic" as const);
      const offsetNum = Number.parseFloat(input.offset_num ?? "0");
      const result = await updateDeviceSensor(input.sensor_id, input.device_id, {
        key: input.key.trim(),
        label: input.label.trim(),
        kind,
        unit: input.unit?.trim() || defaultUnitForKind(kind),
        offsetNum: Number.isFinite(offsetNum) ? offsetNum : 0,
        visible: input.visible === "true",
      });
      if (result.error) {
        throw new ActionError({ code: "BAD_REQUEST", message: result.error });
      }
      return { ok: true as const, message: t.sensorSaved };
    },
  }),

  addSensor: defineAction({
    accept: "form",
    input: z.object({
      device_id: z.string().min(1),
      key: z.string().min(1),
      label: z.string().min(1),
      kind: z.string().optional(),
      unit: z.string().optional(),
    }),
    handler: async (input, context) => {
      const locale = apiLocale(context);
      const t = apiMoreActionsMessages(locale);
      const { user } = await requireAuthed(context.cookies, locale);
      const { householdId } = await requireEditor(user.id, locale);
      const owned = await listHouseholdDevices(householdId);
      if (!owned.devices.some((d) => d.id === input.device_id)) {
        throw new ActionError({ code: "FORBIDDEN", message: t.deviceNotFound });
      }
      const kindRaw = input.kind ?? "generic";
      const kind = isSensorKind(kindRaw) ? kindRaw : ("generic" as const);
      const result = await upsertDeviceSensor(
        input.device_id,
        input.key.trim(),
        input.label.trim(),
        kind,
        input.unit?.trim() || defaultUnitForKind(kind),
      );
      if (result.error) {
        throw new ActionError({ code: "BAD_REQUEST", message: result.error });
      }
      return { ok: true as const, message: t.sensorAdded };
    },
  }),

  addSensorPair: defineAction({
    accept: "form",
    input: z.object({
      device_id: z.string().min(1),
      key: z.string().min(1),
      label: z.string().optional(),
    }),
    handler: async (input, context) => {
      const locale = apiLocale(context);
      const t = apiMoreActionsMessages(locale);
      const { user } = await requireAuthed(context.cookies, locale);
      const { householdId } = await requireEditor(user.id, locale);
      const owned = await listHouseholdDevices(householdId);
      if (!owned.devices.some((d) => d.id === input.device_id)) {
        throw new ActionError({ code: "FORBIDDEN", message: t.deviceNotFound });
      }
      const label = input.label?.trim() || "Probe";
      const temp = await upsertDeviceSensor(
        input.device_id,
        input.key.trim(),
        label,
        "temperature",
        defaultUnitForKind("temperature"),
      );
      if (temp.error) {
        throw new ActionError({ code: "BAD_REQUEST", message: temp.error });
      }
      const humidity = await upsertDeviceSensor(
        input.device_id,
        input.key.trim(),
        `${label} humidity`,
        "humidity",
        defaultUnitForKind("humidity"),
      );
      if (humidity.error) {
        throw new ActionError({ code: "BAD_REQUEST", message: humidity.error });
      }
      return { ok: true as const, message: t.sensorPairAdded };
    },
  }),

  deleteSensor: defineAction({
    accept: "form",
    input: z.object({
      sensor_id: z.string().min(1),
      device_id: z.string().min(1),
    }),
    handler: async (input, context) => {
      const locale = apiLocale(context);
      const t = apiMoreActionsMessages(locale);
      const { user } = await requireAuthed(context.cookies, locale);
      const { householdId } = await requireEditor(user.id, locale);
      const owned = await listHouseholdDevices(householdId);
      if (!owned.devices.some((d) => d.id === input.device_id)) {
        throw new ActionError({ code: "FORBIDDEN", message: t.deviceNotFound });
      }
      const result = await deleteDeviceSensor(input.sensor_id, input.device_id);
      if (result.error) {
        throw new ActionError({ code: "BAD_REQUEST", message: result.error });
      }
      return { ok: true as const, message: t.sensorDeleted };
    },
  }),
};

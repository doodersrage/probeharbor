import { createAdminClient } from "./supabase";
import type { ChartPoint } from "./garageTempsHistory";
import { getAlertSettingsForUser, notifyUser } from "./notify";
import { listAllHouseholdOwnerUserIds } from "./households";
import { brandedEmailParts, type EmailSection } from "./emailLayout";
import { resolveSiteUrl } from "./schemaMarkup";
import { sendEmail } from "./mailer";
import { computeFreezeHours } from "./freezeHours";
import { buildHistoryChartUrl, trailingHistoryWindowDays } from "./historyUrls";
import { buildUnsubscribeUrl, unsubscribeHeaders } from "./emailUnsubscribe";
import { isActionableAlertKind } from "./alertEvents";
import { isAlertChannelName } from "./channelDelivery";
import { formatEmailCount, formatEmailDate, formatEmailNumber, formatEmailValue } from "./emailLayout";
import { fmt } from "../i18n/format";
import type { Locale } from "../i18n/locales";
import { localeFromMetadata } from "../i18n/userLocale";
import { digestEmailMessages } from "../i18n/messages/app/email/digest";
import { averageHumidity, wettestPoint } from "./humidityStats";

async function sendDigestEmail(
  to: string,
  subject: string,
  text: string,
  html: string,
  unsubscribeUrl: string | null = null,
): Promise<void> {
  try {
    await sendEmail(to, subject, text, { html, headers: unsubscribeHeaders(unsubscribeUrl) });
  } catch (error) {
    console.error("Failed to send digest email:", error);
  }
}

type DigestProbeSummary = {
  label: string;
  minF: number;
  maxF: number;
  /** null when no reading in the window had humidity. */
  avgHumidity: number | null;
  readingCount: number;
};

type DigestDaySummary = {
  dayLabel: string;
  minF: number;
  maxF: number;
  avgF: number;
  coldestProbe: string | null;
};

function summarizeProbes(points: ChartPoint[]): DigestProbeSummary[] {
  const byProbe = new Map<string, ChartPoint[]>();

  for (const point of points) {
    const group = byProbe.get(point.probeLabel) ?? [];
    group.push(point);
    byProbe.set(point.probeLabel, group);
  }

  return [...byProbe.entries()].map(([label, probePoints]) => {
    const temps = probePoints.map((point) => point.tempf);
    return {
      label,
      minF: Math.min(...temps),
      maxF: Math.max(...temps),
      avgHumidity: averageHumidity(probePoints),
      readingCount: probePoints.length,
    };
  });
}

function summarizePoints(points: ChartPoint[], locale: Locale = "en"): string[] {
  const t = digestEmailMessages(locale);
  return summarizeProbes(points).map((probe) =>
    fmt(t.probeLine, {
      probe: probe.label,
      min: formatEmailNumber(probe.minF, 1, locale),
      max: formatEmailNumber(probe.maxF, 1, locale),
      humidity: probe.avgHumidity == null ? "—" : formatEmailNumber(probe.avgHumidity, 0, locale),
      readings: formatEmailCount(t.readings, probe.readingCount, locale),
    }),
  );
}

function summarizeDays(points: ChartPoint[], locale: Locale = "en"): DigestDaySummary[] {
  if (points.length === 0) return [];

  const byDay = new Map<string, ChartPoint[]>();
  for (const point of points) {
    const key = new Date(point.timestamp).toISOString().slice(0, 10);
    const group = byDay.get(key) ?? [];
    group.push(point);
    byDay.set(key, group);
  }

  return [...byDay.keys()]
    .sort()
    .map((key) => {
      const dayPoints = byDay.get(key) ?? [];
      const temps = dayPoints.map((point) => point.tempf);
      const min = Math.min(...temps);
      const max = Math.max(...temps);
      const avg = temps.reduce((sum, value) => sum + value, 0) / temps.length;
      const coldest = dayPoints.reduce((a, b) =>
        a.tempf <= b.tempf ? a : b,
      );
      const dayLabel = formatEmailDate(
        `${key}T12:00:00.000Z`,
        {
          weekday: "short",
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        },
        locale,
      );
      const mixedProbes = dayPoints.some(
        (point) => point.probeLabel !== coldest.probeLabel,
      );
      return {
        dayLabel,
        minF: min,
        maxF: max,
        avgF: avg,
        coldestProbe: mixedProbes ? coldest.probeLabel : null,
      };
    });
}

/** One line per calendar day (UTC): min–max, avg, and coldest probe when mixed. */
export function summarizePointsByDay(points: ChartPoint[], locale: Locale = "en"): string[] {
  const t = digestEmailMessages(locale);
  return summarizeDays(points, locale).map((day) => {
    const vars = {
      day: day.dayLabel,
      min: formatEmailNumber(day.minF, 1, locale),
      max: formatEmailNumber(day.maxF, 1, locale),
      avg: formatEmailNumber(day.avgF, 1, locale),
    };
    return day.coldestProbe
      ? fmt(t.dayLineColdest, { ...vars, probe: day.coldestProbe })
      : fmt(t.dayLine, vars);
  });
}

function formatDigestWhen(iso: string, locale: Locale = "en"): string {
  return formatEmailDate(
    iso,
    {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
    },
    locale,
  );
}

function digestHighlightStats(points: ChartPoint[], locale: Locale = "en") {
  const t = digestEmailMessages(locale);
  const coldest = points.reduce((a, b) => (a.tempf <= b.tempf ? a : b));
  const hottest = points.reduce((a, b) => (a.tempf >= b.tempf ? a : b));
  const wettest = wettestPoint(points);
  const avgTemp = points.reduce((sum, p) => sum + p.tempf, 0) / points.length;

  return [
    {
      label: t.statColdest,
      value: `${formatEmailNumber(coldest.tempf, 1, locale)}°F`,
      detail: `${formatDigestWhen(coldest.timestamp, locale)} · ${coldest.probeLabel}`,
    },
    {
      label: t.statWarmest,
      value: `${formatEmailNumber(hottest.tempf, 1, locale)}°F`,
      detail: `${formatDigestWhen(hottest.timestamp, locale)} · ${hottest.probeLabel}`,
    },
    {
      label: t.statAverage,
      value: `${formatEmailNumber(avgTemp, 1, locale)}°F`,
      detail: formatEmailCount(t.readings, points.length, locale),
    },
    ...(wettest
      ? [
          {
            label: t.statHumidity,
            value: `${formatEmailNumber(wettest.humidity, 0, locale)}%`,
            detail: `${formatDigestWhen(wettest.timestamp, locale)} · ${wettest.probeLabel}`,
          },
        ]
      : []),
  ];
}

type DeliveryEvent = {
  kind: string;
  channels_sent: string[] | null;
  channels_skipped: string[] | null;
};

export type AlertDeliverySummary = {
  /** Real alerts (not tests, digests, or reports) in the window. */
  alerts: number;
  /** Alerts held back on purpose by snooze, vacation, or quiet hours. */
  heldBack: number;
  /** Alerts that reached at least one channel. */
  reached: number;
  /** Channels that delivered at least once. */
  sentChannels: string[];
  /** Channel → number of alerts it failed to deliver. */
  failedChannels: Array<{ channel: string; count: number }>;
};

const HELD_BACK_REASONS = new Set(["snooze_or_vacation", "quiet_hours"]);

/** channels_skipped mixes channel names with reasons like "sms_not_configured" or "fcm_no_token". */
function skippedChannel(entry: string): string | null {
  if (isAlertChannelName(entry)) return entry;
  if (entry.startsWith("sms")) return "sms";
  if (entry.startsWith("push") || entry.startsWith("fcm") || entry.startsWith("web_push")) return "push";
  return null;
}

/** How this week's real alerts fared per channel, for the digest's reassurance line. */
export function summarizeAlertDelivery(events: DeliveryEvent[]): AlertDeliverySummary {
  let alerts = 0;
  let heldBack = 0;
  let reached = 0;
  const sent = new Set<string>();
  const failed = new Map<string, number>();
  for (const event of events) {
    if (!isActionableAlertKind(event.kind)) continue;
    const skippedEntries = event.channels_skipped ?? [];
    if (skippedEntries.some((entry) => HELD_BACK_REASONS.has(entry))) {
      heldBack += 1;
      continue;
    }
    alerts += 1;
    const sentChannels = event.channels_sent ?? [];
    if (sentChannels.length > 0) reached += 1;
    for (const channel of sentChannels) sent.add(channel);
    const failedHere = new Set(skippedEntries.map(skippedChannel).filter((c) => c !== null));
    for (const channel of failedHere) {
      failed.set(channel, (failed.get(channel) ?? 0) + 1);
    }
  }
  return {
    alerts,
    heldBack,
    reached,
    sentChannels: [...sent].sort(),
    failedChannels: [...failed.entries()]
      .map(([channel, count]) => ({ channel, count }))
      .sort((a, b) => b.count - a.count || a.channel.localeCompare(b.channel)),
  };
}

function deliverySection(delivery: AlertDeliverySummary, locale: Locale = "en"): EmailSection {
  const t = digestEmailMessages(locale);
  const heldBackNote =
    delivery.heldBack > 0 ? formatEmailCount(t.heldBack, delivery.heldBack, locale) : null;
  if (delivery.alerts === 0) {
    return {
      type: "note",
      text: [t.noAlerts, heldBackNote, t.sendTestAnyTime].filter(Boolean).join(" "),
    };
  }
  const reachedVars = { reached: formatEmailValue(delivery.reached, locale) };
  const lines = [
    delivery.sentChannels.length > 0
      ? formatEmailCount(t.reachedVia, delivery.alerts, locale, {
          ...reachedVars,
          channels: delivery.sentChannels.join(", "),
        })
      : formatEmailCount(t.reached, delivery.alerts, locale, reachedVars),
  ];
  if (delivery.failedChannels.length > 0) {
    const failures = delivery.failedChannels
      .map(({ channel, count }) =>
        fmt(t.failedChannel, { channel, count: formatEmailValue(count, locale) }),
      )
      .join(", ");
    lines.push(fmt(t.notDelivered, { failures }));
  }
  if (heldBackNote) lines.push(heldBackNote);
  const clean = delivery.reached === delivery.alerts && delivery.failedChannels.length === 0;
  return {
    type: "callout",
    tone: clean ? "success" : "alert",
    title: t.deliveryTitle,
    body: lines.join(" "),
  };
}

export function buildWeeklyDigestParts(
  input: {
    points: ChartPoint[];
    freezeThresholdF: number;
    siteUrl: string;
    unsubscribeUrl?: string | null;
    /** The recipient's own alert delivery this week; omitted for household members. */
    delivery?: AlertDeliverySummary | null;
  },
  locale: Locale = "en",
): { subject: string; text: string; html: string; notifyBody: string } {
  const t = digestEmailMessages(locale);
  const { points, freezeThresholdF, siteUrl } = input;
  const freeze = computeFreezeHours(points, freezeThresholdF);
  const freezeBody = formatDigestFreezeBody(points, freezeThresholdF, locale);
  const freezeLine = fmt(t.freezeLine, { body: freezeBody });
  const probes = summarizeProbes(points);
  const days = summarizeDays(points, locale);
  const mixedDays = days.some((day) => day.coldestProbe);
  const summary = summarizePoints(points, locale);
  const byDay = summarizePointsByDay(points, locale);
  const num = (value: number | null, digits: number) =>
    value == null ? "—" : formatEmailNumber(value, digits, locale);

  const sections: EmailSection[] = [
    {
      type: "callout",
      tone: freeze.readingsBelow34 === 0 ? "success" : "alert",
      title: t.freezeTitle,
      body: freezeBody.charAt(0).toUpperCase() + freezeBody.slice(1),
    },
  ];
  if (input.delivery) sections.push(deliverySection(input.delivery, locale));
  sections.push(
    { type: "heading", text: t.highlights },
    { type: "stats", items: digestHighlightStats(points, locale) },
  );

  if (probes.length > 0) {
    sections.push(
      { type: "heading", text: t.byProbe },
      {
        type: "table",
        headers: [t.colProbe, t.colRange, t.colHumidity],
        rows: probes.map((probe) => [
          probe.label,
          `${num(probe.minF, 1)}–${num(probe.maxF, 1)}°F`,
          fmt(t.humidityCell, {
            humidity: num(probe.avgHumidity, 0),
            readings: formatEmailCount(t.readings, probe.readingCount, locale),
          }),
        ]),
      },
    );
  }

  if (days.length > 0) {
    sections.push(
      { type: "heading", text: t.dayByDay },
      {
        type: "table",
        headers: mixedDays
          ? [t.colDay, t.colRange, t.colAvg, t.colColdest]
          : [t.colDay, t.colRange, t.colAvg],
        rows: days.map((day) => {
          const row = [
            day.dayLabel,
            `${num(day.minF, 1)}–${num(day.maxF, 1)}°F`,
            `${num(day.avgF, 1)}°`,
          ];
          if (mixedDays) row.push(day.coldestProbe ?? "—");
          return row;
        }),
      },
    );
  }

  sections.push({
    type: "note",
    text: t.tip,
  });

  const parts = brandedEmailParts(
    {
      eyebrow: t.eyebrow,
      preheader: freezeLine,
      title: t.title,
      intro: t.intro,
      sections,
      cta: {
        label: t.ctaHistory,
        url: buildHistoryChartUrl(siteUrl, trailingHistoryWindowDays(7)),
      },
      secondaryCta: {
        label: t.ctaSettings,
        url: `${siteUrl}/dashboard/alerts?tab=settings#alert-section-essentials`,
      },
      tone: "brand",
      footerNote: t.footerNote,
      unsubscribeUrl: input.unsubscribeUrl,
    },
    locale,
  );

  return {
    subject: formatWeeklyDigestSubject(points, locale),
    text: parts.text,
    html: parts.html,
    notifyBody: [freezeLine, ...summary, ...byDay].join("\n"),
  };
}

/** Coldest reading in the window — used for subject lines and freeze callouts. */
export function coldestPoint(points: ChartPoint[]): ChartPoint | null {
  if (points.length === 0) return null;
  return points.reduce((a, b) => (a.tempf <= b.tempf ? a : b));
}

/** Freeze exposure without the "Freeze exposure:" prefix (lowercase start). */
function formatDigestFreezeBody(
  points: ChartPoint[],
  freezeThresholdF: number,
  locale: Locale = "en",
): string {
  const t = digestEmailMessages(locale);
  const freeze = computeFreezeHours(points, freezeThresholdF);
  const threshold = formatEmailValue(freezeThresholdF, locale);
  if (freeze.readingsBelow34 === 0) {
    return fmt(t.freezeNone, { threshold });
  }
  return fmt(t.freezeSome, {
    hours: formatEmailNumber(freeze.hoursBelow34, 1, locale),
    threshold,
    readings: formatEmailCount(t.readings, freeze.readingsBelow34, locale),
    coldest: freeze.coldestF != null ? formatEmailNumber(freeze.coldestF, 1, locale) : "undefined",
  });
}

export function formatDigestFreezeLine(
  points: ChartPoint[],
  freezeThresholdF: number,
  locale: Locale = "en",
): string {
  const t = digestEmailMessages(locale);
  return fmt(t.freezeLine, { body: formatDigestFreezeBody(points, freezeThresholdF, locale) });
}

export function formatWeeklyDigestSubject(points: ChartPoint[], locale: Locale = "en"): string {
  const t = digestEmailMessages(locale);
  const coldest = coldestPoint(points);
  if (!coldest) return t.subjectNoData;
  const dayLabel = formatEmailDate(
    coldest.timestamp,
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    },
    locale,
  );
  return fmt(t.subject, { day: dayLabel, temp: formatEmailNumber(coldest.tempf, 1, locale) });
}

export async function sendWeeklyDigestsForAllUsers(): Promise<{
  sent: number;
  skipped: number;
  errors: string[];
}> {
  const admin = createAdminClient();
  const errors: string[] = [];
  let sent = 0;
  let skipped = 0;
  const siteUrl = resolveSiteUrl(null);

  const userIds = await listAllHouseholdOwnerUserIds();

  for (const userId of userIds) {
    try {
      const { data: userData } = await admin.auth.admin.getUserById(userId);
      const user = userData.user;
      if (!user?.email) {
        skipped += 1;
        continue;
      }

      const settings = await getAlertSettingsForUser(
        userId,
        user.user_metadata as Record<string, unknown> | undefined,
      );

      if (!settings.digestEnabled) {
        skipped += 1;
        continue;
      }

      const digestEmail = settings.email ?? user.email;
      const ownerLocale = localeFromMetadata(user.user_metadata as Record<string, unknown> | undefined);
      const { fetchGarageTempChartData } = await import("./garageTempsHistory");
      const chart = await fetchGarageTempChartData(userId, 7);

      if (chart.error) {
        errors.push(`${user.email}: ${chart.error}`);
        continue;
      }

      const points = chart.points;
      if (!points || points.length === 0) {
        skipped += 1;
        continue;
      }

      const ownerUnsubscribeUrl = await buildUnsubscribeUrl(siteUrl, userId, "digest", ownerLocale);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: weekEvents, error: weekEventsError } = await admin
        .from("alert_events")
        .select("kind, channels_sent, channels_skipped")
        .eq("user_id", userId)
        .gte("created_at", weekAgo)
        .limit(1000);
      const digest = buildWeeklyDigestParts({
        points,
        freezeThresholdF: settings.freezeThresholdF,
        siteUrl,
        unsubscribeUrl: ownerUnsubscribeUrl,
        // Leave the section out rather than claim "no alerts" when the lookup failed.
        delivery: weekEventsError ? null : summarizeAlertDelivery(weekEvents ?? []),
      }, ownerLocale);

      await sendDigestEmail(
        digestEmail,
        digest.subject,
        digest.text,
        digest.html,
        ownerUnsubscribeUrl,
      );

      await notifyUser(userId, digestEmail, { ...settings, channelEmail: false }, {
        title: digest.subject,
        body: digest.notifyBody,
        kind: "digest",
      }, undefined, ownerLocale);

      // Fan-out to household members who opted into digests.
      try {
        const { data: ownerMemberships } = await admin
          .from("household_members")
          .select("household_id")
          .eq("user_id", userId);
        const ownerHouseholdIds = [
          ...new Set(
            (ownerMemberships ?? []).map((row) => row.household_id as string),
          ),
        ];

        if (ownerHouseholdIds.length > 0) {
          const { data: sharedMembers } = await admin
            .from("household_members")
            .select("user_id")
            .in("household_id", ownerHouseholdIds)
            .eq("digest_opt_in", true)
            .neq("user_id", userId);

          const fanOutIds = [
            ...new Set((sharedMembers ?? []).map((row) => row.user_id as string)),
          ];

          for (const memberId of fanOutIds) {
            const { data: memberData } = await admin.auth.admin.getUserById(memberId);
            const memberEmail = memberData.user?.email;
            if (!memberEmail) continue;
            // Each recipient gets a link that unsubscribes their own account.
            const memberLocale = localeFromMetadata(
              memberData.user?.user_metadata as Record<string, unknown> | undefined,
            );
            const memberUnsubscribeUrl = await buildUnsubscribeUrl(siteUrl, memberId, "digest", memberLocale);
            const memberDigest = buildWeeklyDigestParts(
              {
                points,
                freezeThresholdF: settings.freezeThresholdF,
                siteUrl,
                unsubscribeUrl: memberUnsubscribeUrl,
              },
              memberLocale,
            );
            await sendDigestEmail(
              memberEmail,
              memberDigest.subject,
              memberDigest.text,
              memberDigest.html,
              memberUnsubscribeUrl,
            );
            sent += 1;
          }
        }
      } catch (fanOutError) {
        errors.push(
          `${userId} fan-out: ${
            fanOutError instanceof Error ? fanOutError.message : "Unknown error"
          }`,
        );
      }

      sent += 1;
    } catch (e) {
      errors.push(`${userId}: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  }

  return { sent, skipped, errors };
}

export function shouldSendWeeklyDigest(now = new Date()): boolean {
  return now.getUTCDay() === 1 && now.getUTCHours() === 8;
}

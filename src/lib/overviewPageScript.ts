/**
 * Browser code for the Overview page (src/pages/dashboard.astro): soft
 * refresh, pinned metrics, chart controls, age labels. Moved out of the
 * page's <script> unchanged; the page imports it, and Astro bundles it the
 * same way.
 */
// biome-ignore-all lint/correctness/noInnerDeclarations: functions declared inside blocks, moved verbatim from the page script; in a module (strict mode) they are block-scoped as intended, and rewriting them as const would change hoisting.
import { fmt, plural, pageIntlLocale, readI18n, readI18nJson } from "../i18n/client";
import { isLocale, type Locale } from "../i18n/locales";
import overviewEn from "../i18n/messages/app/overview/en";
import {
  displayTempInputValue,
  tempUnitLabel,
  toDisplayDelta,
  toDisplayTemp,
} from "./temperatureFormat";

(() => {
  var text = readI18nJson("overview-i18n", overviewEn.client);
  var rawLocale = document.querySelector<HTMLElement>("[data-overview-locale]")?.dataset.overviewLocale;
  var pageLocale: Locale = rawLocale && isLocale(rawLocale) ? rawLocale : "en";
  var useCelsius = document.querySelector<HTMLElement>("[data-overview-celsius]") != null;
  var tempUnit = tempUnitLabel(useCelsius);
  var intl = pageIntlLocale();
  /** `toFixed` in English (unchanged output), locale digits elsewhere. */
  function num(value: number, digits: number): string {
    if (pageLocale === "en") return value.toFixed(digits);
    return new Intl.NumberFormat(intl, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
      useGrouping: false,
    }).format(value);
  }
  function plainNum(value: number): string {
    return pageLocale === "en" ? String(value) : new Intl.NumberFormat(intl).format(value);
  }
  function esc(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  var loadedAt = Date.now();
  var label = document.getElementById("overview-refresh-label");
  var refreshButtons = () => document.querySelectorAll("[data-dashboard-refresh]");
  var flashKeys = [
    "checked_saved",
    "checked_error",
    "ack_ok",
    "ack_msg",
    "ack_error",
    "password",
    "prefs_saved",
    "prefs_error",
    "snooze",
    "snooze_cleared",
    "hours",
    "vacation",
    "vacation_cleared",
    "vacation_error",
    "pinned_saved",
    "pinned_error",
  ];

  // Pin picker: at the limit, the unticked boxes are disabled instead of a sixth pick being dropped.
  document.querySelectorAll<HTMLFormElement>("[data-pin-form]").forEach((form) => {
    var max = Number(form.getAttribute("data-pin-max") || "5");
    var count = form.parentElement?.querySelector<HTMLElement>("[data-pin-count]");
    var boxes = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="metrics"]'));
    function sync() {
      var picked = boxes.filter((box) => box.checked).length;
      boxes.forEach((box) => { box.disabled = !box.checked && picked >= max; });
      if (count) {
        count.textContent =
          fmt(text.pinCount, { count: plainNum(picked), max: plainNum(max) }) +
          (picked >= max ? ` ${text.pinRoomHint}` : "");
      }
    }
    boxes.forEach((box) => { box.addEventListener("change", sync); });
    sync();
  });

  function stripFlashParams() {
    var url = new URL(window.location.href);
    var changed = false;
    flashKeys.forEach((key) => {
      if (url.searchParams.has(key)) {
        url.searchParams.delete(key);
        changed = true;
      }
    });
    if (changed) {
      window.history.replaceState({}, "", url.pathname + (url.search || "") + url.hash);
    }
  }

  function renderAge() {
    if (!label) return;
    var mins = Math.max(0, Math.round((Date.now() - loadedAt) / 60000));
    label.textContent =
      mins < 1 ? text.updatedJustNow : plural(text.updatedMinutesAgo, mins, pageLocale);
  }

  function setMetric(
    field: string,
    value: string | null,
    detail: string | null,
    tone: string | null,
  ) {
    var card = document.querySelector(`[data-snapshot-field="${field}"]`);
    if (!card) return;
    var valueEl = card.querySelector("[data-metric-value]");
    var detailEl = card.querySelector("[data-metric-detail]");
    if (valueEl && value != null) valueEl.textContent = value;
    if (detailEl && detail != null) detailEl.textContent = detail;
    if (tone) {
      card.className = card.className.replace(/metric-card--\w+/g, `metric-card--${tone}`);
    }
  }

  var liveFlashTimer: number | undefined;
  function showLiveFlash(message: string, isError: boolean) {
    const flash = document.getElementById("overview-live-flash");
    if (!flash) return;
    flash.textContent = message;
    flash.classList.remove("hidden");
    flash.classList.toggle("dashboard-flash--error", Boolean(isError));
    flash.classList.toggle("alert-warning", Boolean(isError));
    flash.classList.toggle("alert-success", !isError);
    window.clearTimeout(liveFlashTimer);
    liveFlashTimer = window.setTimeout(() => {
      flash.classList.add("hidden");
    }, 4500);
  }

  function applyUnackedChrome(count: unknown) {
    var n = typeof count === "number" ? count : 0;
    var banner = document.querySelector<HTMLElement>("[data-unacked-banner]");
    if (banner) {
      banner.setAttribute("data-unacked-count", String(n));
      var show = n > 0;
      banner.hidden = !show;
      banner.classList.toggle("hidden", !show);
      var label = banner.querySelector("[data-unacked-label]");
      if (label) {
        var bannerText = readI18n(banner, { label: text.unhandledAlerts });
        label.textContent = ` ${plural(bannerText.label, n, pageLocale)}`;
      }
      var claims = banner.querySelector("[data-unacked-claims]");
      if (claims) claims.classList.toggle("hidden", n <= 0);
    }

    var qa = document.querySelector("[data-overview-quick-actions]");
    if (qa) qa.setAttribute("data-unacked", String(n));

    var ackSlot = document.querySelector("[data-qa-ack-slot]");
    if (ackSlot) {
      ackSlot.innerHTML =
        n > 0
          ? '<button type="button" class="btn-secondary btn-sm" data-qa-action="ack_latest">' +
            esc(text.ackLatest) +
            "</button>"
          : '<a class="btn-ghost btn-sm" href="/dashboard/alerts" data-qa-alerts-clear>' +
            esc(text.alertsClear) +
            "</a>";
    }
    var ackAllSlot = document.querySelector("[data-qa-ackall-slot]");
    if (ackAllSlot) {
      ackAllSlot.innerHTML =
        n > 1
          ? '<button type="button" class="btn-ghost btn-sm" data-qa-action="ack_all" data-qa-confirm="' +
            esc(plural(text.ackAllConfirm, n, pageLocale)) +
            '">' +
            esc(text.handleAll) +
            ' <span data-overview-field="unackedCount">' +
            n +
            "</span></button>"
          : "";
    }
  }

  function applySnoozeChrome(active: boolean) {
    var qa = document.querySelector("[data-overview-quick-actions]");
    if (qa) qa.setAttribute("data-snooze-active", active ? "1" : "0");
    var slot = document.querySelector("[data-qa-snooze-slot]");
    if (!slot) return;
    if (active) {
      slot.innerHTML =
        '<button type="button" class="btn-ghost btn-sm" id="overview-snooze-action" data-qa-snooze="clear_snooze">' +
        esc(text.clearSnooze) +
        "</button>";
    } else {
      slot.innerHTML =
        '<details class="qa-menu"><summary class="btn-ghost btn-sm">' +
        esc(text.snooze) +
        ' ▾</summary><div class="qa-menu-pop">' +
        [1, 4, 24]
          .map((hours) => (
              '<button type="button" class="btn-ghost btn-sm"' +
              (hours === 24 ? ' id="overview-snooze-action"' : "") +
              ' data-qa-snooze="snooze" data-qa-hours="' +
              hours +
              '">' +
              esc(plural(text.snoozeHours, hours, pageLocale)) +
              "</button>"
            ))
          .join("") +
        "</div></details>";
    }
  }

  // Shape of /api/user/dashboard-snapshot; fields are checked before use.
  // biome-ignore lint/suspicious/noExplicitAny: loosely typed JSON payload
  function applySnapshot(data: any) {
    if (!data || typeof data !== "object") return;
    loadedAt = Date.now();
    renderAge();
    var title = document.querySelector('[data-overview-field="riskTitle"]');
    var detail = document.querySelector('[data-overview-field="riskDetail"]');
    var riskCard = document.querySelector("[data-overview-risk]");
    var riskAction = document.querySelector('[data-overview-field="riskAction"]');
    if (title && data.riskTitle) title.textContent = data.riskTitle;
    if (detail && data.riskDetail) detail.textContent = data.riskDetail;
    if (riskCard && data.risk) {
      riskCard.setAttribute("data-risk-level", data.risk);
      riskCard.className = riskCard.className.replace(
        /garage-risk-status--\w+/g,
        `garage-risk-status--${data.risk}`,
      );
    }
    // Simulated-only household: keep the card's "Demo data" badge in step.
    document.querySelectorAll<HTMLElement>("[data-risk-demo-badge]").forEach((el) => {
      if (data.risk) el.hidden = data.risk !== "demo";
    });
    if (riskAction) {
      if (data.riskActionLabel) riskAction.textContent = data.riskActionLabel;
      if (data.riskActionHref) riskAction.setAttribute("href", data.riskActionHref);
    }

    if (typeof data.unackedAlerts === "number") {
      applyUnackedChrome(data.unackedAlerts);
      var qaDetails = document.querySelector<HTMLDetailsElement>("[data-qa-details]");
      if (qaDetails && data.unackedAlerts > 0) qaDetails.open = true;
      document.querySelectorAll('[data-overview-field="unackedCount"]').forEach((el) => {
        el.textContent = String(data.unackedAlerts);
      });
    }

    if (typeof data.snoozeActive === "boolean") {
      applySnoozeChrome(data.snoozeActive);
    }

    if (data.lastReadingAt) {
      setMetric(
        "last_reading",
        data.lastReadingAge || text.justNow,
        null,
        data.lastReadingLagging ? "warning" : "success",
      );
      var lastValue = document.querySelector(
        '[data-snapshot-field="last_reading"] [data-metric-value]',
      );
      if (lastValue) {
        lastValue.setAttribute("data-live-age-iso", data.lastReadingAt);
        if (typeof data.lastReadingIntervalMs === "number") {
          lastValue.setAttribute("data-report-interval-ms", String(data.lastReadingIntervalMs));
        } else {
          lastValue.removeAttribute("data-report-interval-ms");
        }
      }
      window.dispatchEvent(
        new CustomEvent("tt:live-readings", {
          detail: {
            lastReadingAt: data.lastReadingAt,
            reportIntervalMs:
              typeof data.lastReadingIntervalMs === "number" ? data.lastReadingIntervalMs : null,
            sensorCount: typeof data.sensorCount === "number" ? data.sensorCount : undefined,
          },
        }),
      );
    } else {
      setMetric("last_reading", text.noneYet, null, "warning");
    }

    if (typeof data.sensorCount === "number") {
      var sensorsLabel =
        data.sensorCount === 0
          ? text.none
          : data.staleSensors > 0
            ? fmt(text.staleCount, { count: plainNum(data.staleSensors) })
            : fmt(text.freshCount, { count: plainNum(data.sensorCount) });
      setMetric(
        "sensors",
        sensorsLabel,
        data.sensorCount > 0 ? fmt(text.totalCount, { count: plainNum(data.sensorCount) }) : null,
        data.staleSensors > 0 ? "warning" : "neutral",
      );
    }

    if (typeof data.alertsEnabled === "boolean") {
      var pausedLabel =
        data.alertsEnabled && typeof data.alertsPausedUntilLabel === "string"
          ? data.alertsPausedUntilLabel
          : null;
      if (pausedLabel) {
        setMetric("alerts", text.paused, fmt(text.pausedUntil, { time: pausedLabel }), "warning");
      } else {
        var stack = document.querySelector<HTMLElement>("[data-alerts-detail]");
        setMetric(
          "alerts",
          data.alertsEnabled ? text.on : text.off,
          stack?.dataset.alertsDetail ?? null,
          data.alertsEnabled ? "success" : "neutral",
        );
      }
    }

    // A pause that ended (or was cleared from Quick actions) drops its line.
    document.querySelectorAll<HTMLElement>("[data-alert-pause]").forEach((box) => {
      var anyLeft = false;
      box.querySelectorAll<HTMLElement>("[data-alert-pause-kind]").forEach((line) => {
        var kind = line.getAttribute("data-alert-pause-kind");
        var active =
          kind === "snooze"
            ? data.snoozeActive
            : kind === "vacation"
              ? data.vacationActive
              : kind === "household_snooze"
                ? data.householdSnoozeActive
                : kind === "household_vacation"
                  ? data.householdVacationActive
                  : kind === "household_hint"
                    ? data.householdSnoozeActive || data.householdVacationActive
                    : true;
        var show = active !== false;
        line.hidden = !show;
        if (show) anyLeft = true;
      });
      box.hidden = !anyLeft;
    });

    if (typeof data.coldestMarginF === "number") {
      var margin = data.coldestMarginF;
      // The snapshot is °F; show it in the page's unit (a margin is a difference: ×5/9, no offset).
      var marginShown = toDisplayDelta(margin, useCelsius);
      var marginLabel = (marginShown >= 0 ? "+" : "") + num(marginShown, 1) + tempUnit;
      var marginDetail =
        data.coldestProbeTempF != null
          ? fmt(text.marginDetail, {
              temp: num(toDisplayTemp(data.coldestProbeTempF, useCelsius), 1),
              threshold: typeof data.freezeThresholdF === "number"
                ? plainNum(displayTempInputValue(data.freezeThresholdF, useCelsius))
                : String(data.freezeThresholdF),
              unit: tempUnit,
            })
          : null;
      var marginTone =
        margin <= 0 ? "danger" : margin <= 5 ? "warning" : "success";
      setMetric("coldest_margin", marginLabel, marginDetail, marginTone);
    }

    document.querySelectorAll<HTMLElement>("[data-stale-banner]").forEach((el) => {
      var show = typeof data.staleSensors === "number" && data.staleSensors > 0;
      el.hidden = !show;
      el.classList.toggle("hidden", !show);
      if (show && data.staleBannerMessage) {
        var textNode = el.firstChild;
        if (textNode && textNode.nodeType === 3) {
          textNode.textContent = `${data.staleBannerMessage}. `;
        }
      }
    });

    var banner = document.getElementById("overview-offline-banner");
    if (banner) banner.hidden = true;
  }

  function setRefreshDisabled(disabled: boolean) {
    refreshButtons().forEach((el) => {
      if (el instanceof HTMLButtonElement) el.disabled = disabled;
    });
  }

  function softRefresh() {
    setRefreshDisabled(true);
    fetch("/api/user/dashboard-snapshot", { headers: { Accept: "application/json" } })
      .then((res) => {
        var banner = document.getElementById("overview-offline-banner");
        if (res.headers.get("X-ProbeHarbor-Stale") === "1" && banner) {
          banner.hidden = false;
        }
        if (!res.ok) throw new Error("refresh failed");
        return res.json();
      })
      .then(applySnapshot)
      .catch(() => {
        var banner = document.getElementById("overview-offline-banner");
        if (banner) banner.hidden = false;
      })
      .finally(() => {
        setRefreshDisabled(false);
      });
  }

  window.addEventListener("overview:soft-refresh", softRefresh);
  stripFlashParams();
  setInterval(renderAge, 30000);
  setInterval(() => {
    if (document.visibilityState !== "visible") return;
    if (Date.now() - loadedAt < 2.5 * 60 * 1000) return;
    softRefresh();
  }, 60000);

  function setPinUi(metric: string, pinned: boolean) {
    document
      .querySelectorAll<HTMLElement>(`[data-pin-metric="${metric}"]`)
      .forEach((btnEl) => {
      btnEl.setAttribute("data-pinned", pinned ? "1" : "0");
      btnEl.textContent = pinned ? "★" : "☆";
      var cardLabel = btnEl
        .closest(".metric-card-head")
        ?.querySelector(".metric-card-label")
        ?.textContent?.trim();
      var label = btnEl.getAttribute("aria-label") || "";
      var dataLabel = pinned ? btnEl.dataset.unpinLabel : btnEl.dataset.pinLabel;
      if (dataLabel) {
        btnEl.setAttribute("aria-label", dataLabel);
      } else if (cardLabel) {
        btnEl.setAttribute(
          "aria-label",
          fmt(pinned ? text.unpinAria : text.pinAria, { label: cardLabel }),
        );
      } else if (label) {
        if (/^Unpin /.test(label)) {
          btnEl.setAttribute("aria-label", pinned ? label : label.replace(/^Unpin /, "Pin "));
        } else if (/^Pin /.test(label)) {
          btnEl.setAttribute("aria-label", pinned ? label.replace(/^Pin /, "Unpin ") : label);
        }
      }
      btnEl.title =
        (pinned ? btnEl.dataset.unpinTitle : btnEl.dataset.pinTitle) ||
        (pinned ? text.unpinTitle : text.pinTitle);
    });
    var card = document.querySelector<HTMLElement>(`#status [data-metric-id="${metric}"]`);
    if (card) {
      card.hidden = !pinned;
      card.classList.toggle("hidden", !pinned);
    }
    var checkbox = document.querySelector<HTMLInputElement>(
      `input[name="metrics"][value="${metric}"]`,
    );
    if (checkbox) checkbox.checked = pinned;
  }

  document.addEventListener("click", (event) => {
    var target = event.target;
    if (!(target instanceof Element)) return;
    const pinBtn = target.closest("[data-pin-metric]");
    if (!(pinBtn instanceof HTMLButtonElement)) return;
    event.preventDefault();
    event.stopPropagation();
    const metric = pinBtn.getAttribute("data-pin-metric");
    if (!metric) return;
    var wasPinned = pinBtn.getAttribute("data-pinned") === "1";
    pinBtn.disabled = true;
    fetch("/api/user/dashboard-pinned-metrics", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "toggle", metric: metric }),
    })
      .then((res) => res.json().then((raw: unknown) => {
          const data = raw as { error?: string; metrics?: string[] } | null;
          return { ok: res.ok, status: res.status, data: data };
        }))
      .then((result) => {
        if (!result.ok) {
          showLiveFlash(
            (result.data?.error) || text.pinFailed,
            true,
          );
          return;
        }
        var metrics = result.data?.metrics;
        var nowPinned = Array.isArray(metrics) ? metrics.indexOf(metric) !== -1 : !wasPinned;
        setPinUi(metric, nowPinned);
        if (nowPinned) {
          showLiveFlash(text.pinnedToStatus, false);
        } else {
          showLiveFlash(text.unpinnedFromStatus, false);
        }
      })
      .catch(() => {
        showLiveFlash(text.pinFailed, true);
      })
      .finally(() => {
        pinBtn.disabled = false;
      });
  });

  fetch("/api/user/dashboard-snapshot", { headers: { Accept: "application/json" } })
    .then((res) => {
      var banner = document.getElementById("overview-offline-banner");
      if (!banner) return;
      if (res.headers.get("X-ProbeHarbor-Stale") === "1") {
        banner.hidden = false;
      }
    })
    .catch(() => {
      var banner = document.getElementById("overview-offline-banner");
      if (banner) banner.hidden = false;
    });
})();

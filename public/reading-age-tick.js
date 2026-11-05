/**
 * Keep ReadingAgeBadge labels honest without a full page reload.
 * Badges expose data-iso="..." from SSR.
 * Metric values with data-live-age-iso also refresh card tone classes.
 * Late/stale mirror readingFreshness in src/lib/relativeTime.ts: with
 * data-report-interval-ms (the device's learned interval) late after
 * max(30 min, 3 x interval) and stale after max(2 h, 2 x late); otherwise
 * 30 min / 2 h.
 */
(function () {
  var LAG_MS = 30 * 60 * 1000;
  var STALE_MS = 2 * 60 * 60 * 1000;
  // Page language from <html lang/data-intl> (set by the layouts). English keeps
  // the compact "15m ago"; other locales use Intl.RelativeTimeFormat, matching
  // formatRelativeAge in src/lib/relativeTime.ts.
  var htmlEl = document.documentElement;
  var intl = htmlEl.getAttribute("data-intl") || "en-US";
  var english = !htmlEl.lang || /^en\b/i.test(htmlEl.lang);
  var rtf = null;
  var justNowText = "just now";
  if (!english && typeof Intl !== "undefined" && Intl.RelativeTimeFormat) {
    try {
      rtf = new Intl.RelativeTimeFormat(intl, { style: "short", numeric: "always" });
      justNowText = new Intl.RelativeTimeFormat(intl, { numeric: "auto" }).format(0, "second");
    } catch (e) {
      rtf = null;
    }
  }

  function ageLabel(minutes) {
    if (minutes < 1) return justNowText;
    var hours = Math.floor(minutes / 60);
    if (rtf) {
      if (minutes < 60) return rtf.format(-minutes, "minute");
      return hours < 48 ? rtf.format(-hours, "hour") : rtf.format(-Math.floor(hours / 24), "day");
    }
    if (minutes < 60) return minutes + "m ago";
    return hours < 48 ? hours + "h ago" : Math.floor(hours / 24) + "d ago";
  }

  function intervalOf(el) {
    var raw = Number(el.getAttribute("data-report-interval-ms"));
    return Number.isFinite(raw) && raw > 0 ? raw : 0;
  }

  function formatRelativeAge(iso, intervalMs) {
    if (!iso) return { label: "Never", lagging: true, stale: true };
    var parsed = Date.parse(iso);
    if (!Number.isFinite(parsed)) return { label: "Never", lagging: true, stale: true };
    var ms = Date.now() - parsed;
    if (ms < 0) return { label: justNowText, lagging: false, stale: false };
    var label = ageLabel(Math.floor(ms / 60000));
    var lagMs = Math.max(LAG_MS, 3 * (intervalMs || 0));
    var staleMs = Math.max(STALE_MS, 2 * lagMs);
    return {
      label: label,
      lagging: ms >= lagMs,
      stale: ms >= staleMs,
    };
  }

  function setMetricCardTone(el, tone) {
    var card = el.closest(".metric-card");
    if (!card) return;
    card.className = card.className.replace(/metric-card--\w+/g, "metric-card--" + tone);
    el.classList.remove(
      "text-[var(--color-success-text)]",
      "text-[var(--color-warning-text)]",
      "text-[var(--color-danger)]",
      "text-foreground",
    );
    if (tone === "success") el.classList.add("text-[var(--color-success-text)]");
    else if (tone === "warning") el.classList.add("text-[var(--color-warning-text)]");
    else if (tone === "danger") el.classList.add("text-[var(--color-danger)]");
    else el.classList.add("text-foreground");
  }

  function tick() {
    document.querySelectorAll("[data-iso]").forEach(function (el) {
      var iso = el.getAttribute("data-iso");
      if (!iso) return;
      var age = formatRelativeAge(iso, intervalOf(el));
      // Keep the worded state ("Stale · ", "Late · ") the badge rendered with.
      var stateText = age.stale
        ? el.getAttribute("data-state-stale")
        : age.lagging
          ? el.getAttribute("data-state-lagging")
          : null;
      el.textContent = "";
      if (stateText) {
        var state = document.createElement("span");
        state.className = "reading-age-badge-state";
        state.textContent = stateText + " \u00b7\u00a0";
        el.appendChild(state);
      }
      el.appendChild(document.createTextNode(age.label));
      el.classList.remove(
        "reading-age-badge--ok",
        "reading-age-badge--warning",
        "reading-age-badge--danger",
        "reading-age-badge--neutral",
      );
      var fresh = el.hasAttribute("data-quiet-fresh") ? "neutral" : "ok";
      var tone = age.stale ? "danger" : age.lagging ? "warning" : fresh;
      el.classList.add("reading-age-badge--" + tone);
    });

    document.querySelectorAll("[data-live-age-iso]").forEach(function (el) {
      var iso = el.getAttribute("data-live-age-iso");
      if (!iso) return;
      var age = formatRelativeAge(iso, intervalOf(el));
      el.textContent = age.label;
      if (el.hasAttribute("data-live-age-tone")) {
        var cardTone = age.stale || age.lagging ? "warning" : "success";
        setMetricCardTone(el, cardTone);
      }
    });
  }

  tick();
  setInterval(tick, 30000);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") tick();
  });
  window.addEventListener("tt:live-readings", function (event) {
    var detail = event && event.detail;
    var iso = detail && detail.lastReadingAt;
    var intervalMs = detail && typeof detail.reportIntervalMs === "number" ? detail.reportIntervalMs : 0;
    if (iso) {
      document.querySelectorAll(".dashboard-topbar-freshness .reading-age-badge").forEach(function (el) {
        el.setAttribute("data-iso", iso);
        if (intervalMs > 0) el.setAttribute("data-report-interval-ms", String(intervalMs));
        else el.removeAttribute("data-report-interval-ms");
        el.setAttribute("title", english ? new Date(iso).toLocaleString() : new Date(iso).toLocaleString(intl));
      });
    }
    tick();
  });
})();

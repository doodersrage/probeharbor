/**
 * Remember last History / Devices query strings and restore on bare URLs.
 */
(function () {
  var HISTORY_KEY = "tt-last-history-qs";
  var DEVICES_KEY = "tt-last-devices-qs";

  function pathOnly(pathname) {
    return pathname.replace(/\/+$/, "") || "/";
  }

  // Only view state is worth restoring. One-shot flash flags (view_saved=1,
  // key_rotated=1, error=1, ...) would otherwise replay on every bare visit.
  var VIEW_PARAMS = [
    "days",
    "feed",
    "probe",
    "from",
    "to",
    "page",
    "page_size",
    "overlay",
    "yoy",
    "compare_from",
    "compare_to",
    "compare_preset",
    "tab",
    "view",
  ];

  function viewStateQuery(search) {
    try {
      var source = new URLSearchParams(search);
      var kept = new URLSearchParams();
      source.forEach(function (value, name) {
        if (VIEW_PARAMS.indexOf(name) !== -1 && value !== "") kept.set(name, value);
      });
      var qs = kept.toString();
      return qs ? "?" + qs : "";
    } catch (_) {
      return "";
    }
  }

  function remember(key, search) {
    try {
      var qs = viewStateQuery(search || "");
      if (qs) {
        localStorage.setItem(key, qs);
      }
    } catch (_) {}
  }

  function restore(key, barePaths) {
    var path = pathOnly(location.pathname);
    if (barePaths.indexOf(path) === -1) return;
    if (location.search && location.search !== "?") {
      remember(key, location.search);
      return;
    }
    try {
      // Re-filter in case an older version stored flash flags.
      var saved = viewStateQuery(localStorage.getItem(key) || "");
      if (saved) {
        location.replace(path + saved);
      }
    } catch (_) {}
  }

  var path = pathOnly(location.pathname);
  if (path === "/dashboard/history") {
    if (location.search && location.search !== "?") {
      remember(HISTORY_KEY, location.search);
    } else {
      restore(HISTORY_KEY, ["/dashboard/history"]);
    }
  }

  if (path === "/dashboard/devices") {
    if (location.search && location.search !== "?") {
      remember(DEVICES_KEY, location.search);
    } else {
      restore(DEVICES_KEY, ["/dashboard/devices"]);
    }
  }

  document.addEventListener(
    "submit",
    function (event) {
      var form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      var action = form.getAttribute("action") || "";
      var method = (form.getAttribute("method") || "get").toLowerCase();
      if (method !== "get") return;
      if (action.indexOf("/dashboard/history") !== -1 || path === "/dashboard/history") {
        try {
          var fd = new FormData(form);
          var params = new URLSearchParams();
          fd.forEach(function (value, name) {
            if (value != null && String(value) !== "") params.set(name, String(value));
          });
          var qs = params.toString();
          if (qs) remember(HISTORY_KEY, "?" + qs);
        } catch (_) {}
      }
    },
    true,
  );
})();

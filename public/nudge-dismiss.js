/** Shared dismissible nudge cards (localStorage). Loaded once per page. */
(() => {
  function isDismissed(key) {
    try {
      return localStorage.getItem(key) === "1";
    } catch {
      return false;
    }
  }

  /**
   * The server counts tips it renders but can't see these browser-side
   * dismissals, so recount each Tips / Attention strip after removals and
   * hide a strip with nothing left instead of leaving just its buttons.
   */
  function syncAttentionStrips() {
    document.querySelectorAll("[data-attention-root][data-attention-counted]").forEach((root) => {
      const list =
        root.querySelector("[data-attention-items]") ?? root.querySelector("[data-attention-slot]");
      if (!list) return;
      const remaining = list.children.length;
      const countEl = root.querySelector("[data-attention-count]");
      if (countEl) countEl.textContent = String(remaining);
      root.hidden = remaining === 0;
    });
  }

  document.querySelectorAll("[data-nudge-key]").forEach((el) => {
    const key = el.getAttribute("data-nudge-key");
    if (key && isDismissed(key)) {
      el.remove();
    }
  });
  syncAttentionStrips();

  document.querySelectorAll("[data-dismiss]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-dismiss");
      const card = btn.closest("[data-nudge-key]");
      try {
        if (key) localStorage.setItem(key, "1");
      } catch {
        // Private mode: still hide it for this page view.
      }
      card?.remove();
      syncAttentionStrips();
    });
  });
})();

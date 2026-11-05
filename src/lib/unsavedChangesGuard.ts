/**
 * Warn before leaving a page with unsaved form edits.
 *
 * Mark a form with `data-unsaved-guard="<confirm message>"` and call
 * `installUnsavedChangesGuards()` from a page script (UnsavedChangesGuard.astro
 * does both the import and the call). Typing in the form sets
 * `data-unsaved-dirty`; submitting clears it. While any guarded form is dirty:
 * - closing the tab, reloading or typing a URL gets the browser's own prompt
 *   (`beforeunload`; browsers show their own wording), and
 * - clicking an in-app link that would leave the page asks `confirm(message)`.
 *
 * Fields with `data-unsaved-ignore` (or inside an element with it) don't count:
 * use it for controls that act immediately rather than through Save. Buttons
 * that edit the form without an input event (add/remove a rule row) take
 * `data-unsaved-edit` so a click marks the form dirty.
 * Scripts that submit with fetch and fail should call `markUnsaved(form)` so
 * the guard comes back.
 */

const DIRTY_ATTR = "data-unsaved-dirty";

export function markUnsaved(form: HTMLFormElement): void {
  form.setAttribute(DIRTY_ATTR, "1");
}

export function markSaved(form: HTMLFormElement): void {
  form.removeAttribute(DIRTY_ATTR);
}

export function isUnsaved(form: HTMLFormElement): boolean {
  return form.getAttribute(DIRTY_ATTR) === "1";
}

function firstDirtyForm(): HTMLFormElement | null {
  return document.querySelector<HTMLFormElement>(`form[data-unsaved-guard][${DIRTY_ATTR}="1"]`);
}

/**
 * Whether a click on a link navigates this tab away from the current document.
 * New tabs, downloads, modified clicks, non-http links and same-page #hash
 * jumps don't leave the page, so they never prompt.
 */
export function linkClickLeavesPage(
  link: { href: string; target?: string | null; download?: boolean },
  click: {
    button: number;
    metaKey?: boolean;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    defaultPrevented?: boolean;
  },
  currentHref: string,
): boolean {
  if (click.defaultPrevented) return false;
  if (click.button !== 0) return false;
  if (click.metaKey || click.ctrlKey || click.shiftKey || click.altKey) return false;
  const target = (link.target ?? "").trim().toLowerCase();
  if (target && target !== "_self") return false;
  if (link.download) return false;
  let next: URL;
  let current: URL;
  try {
    current = new URL(currentHref);
    next = new URL(link.href, current);
  } catch {
    return false;
  }
  if (next.protocol !== "http:" && next.protocol !== "https:") return false;
  const samePage =
    next.origin === current.origin && next.pathname === current.pathname && next.search === current.search;
  if (samePage && next.hash !== current.hash) return false;
  if (samePage && next.hash && next.hash === current.hash) return false;
  return true;
}

let installed = false;

export function installUnsavedChangesGuards(): void {
  if (installed || typeof document === "undefined") return;
  installed = true;

  const onEdit = (event: Event) => {
    const field = event.target;
    if (!(field instanceof Element)) return;
    if (field.closest("[data-unsaved-ignore]")) return;
    const form =
      (field as HTMLInputElement).form ?? field.closest<HTMLFormElement>("form[data-unsaved-guard]");
    if (form?.hasAttribute("data-unsaved-guard")) markUnsaved(form);
  };
  document.addEventListener("input", onEdit, true);
  document.addEventListener("change", onEdit, true);
  document.addEventListener(
    "click",
    (event) => {
      const origin = event.target;
      if (!(origin instanceof Element)) return;
      const editor = origin.closest("[data-unsaved-edit]");
      const form = editor?.closest<HTMLFormElement>("form[data-unsaved-guard]");
      if (form) markUnsaved(form);
    },
    true,
  );

  document.addEventListener(
    "submit",
    (event) => {
      const form = event.target;
      if (form instanceof HTMLFormElement && form.hasAttribute("data-unsaved-guard")) markSaved(form);
    },
    true,
  );

  window.addEventListener("beforeunload", (event) => {
    if (!firstDirtyForm()) return;
    event.preventDefault();
    // Older browsers need returnValue set to show the prompt.
    event.returnValue = "";
  });

  document.addEventListener("click", (event) => {
    const dirty = firstDirtyForm();
    if (!dirty) return;
    const origin = event.target;
    if (!(origin instanceof Element)) return;
    const link = origin.closest<HTMLAnchorElement>("a[href]");
    if (!link) return;
    if (
      !linkClickLeavesPage(
        { href: link.href, target: link.target, download: link.hasAttribute("download") },
        event,
        window.location.href,
      )
    ) {
      return;
    }
    const message = dirty.getAttribute("data-unsaved-guard") || "";
    if (window.confirm(message)) {
      // Leaving on purpose: don't ask again in beforeunload.
      for (const form of document.querySelectorAll<HTMLFormElement>(`form[${DIRTY_ATTR}="1"]`)) {
        markSaved(form);
      }
      return;
    }
    event.preventDefault();
  });
}

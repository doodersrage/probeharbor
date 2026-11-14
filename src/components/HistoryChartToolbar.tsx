import type { RefObject } from "preact";
import type { HistoryChartUi } from "./historyChartUi";

/** The chart's toolbar: zoom in/out/reset, PNG, link, share, claims pack and expand/close. */
export default function HistoryChartToolbar({
  t,
  zoomed,
  guest,
  canShareChart,
  shareBusy,
  shared,
  linkCopied,
  claimsHref,
  expanded,
  expandBtnRef,
  closeBtnRef,
  onZoom,
  onResetZoom,
  onExportPng,
  onCopyLink,
  onShare,
  onExpand,
  onClose,
}: {
  t: HistoryChartUi;
  zoomed: boolean;
  /** Signed-out page: no link or share controls. */
  guest: boolean;
  canShareChart: boolean;
  shareBusy: boolean;
  /** A share attempt has finished (its message is showing). */
  shared: boolean;
  linkCopied: boolean;
  /** Claims-pack link for the current view, or null when there isn't one. */
  claimsHref: string | null;
  expanded: boolean;
  /** Focus returns here when the expanded view closes. */
  expandBtnRef: RefObject<HTMLButtonElement | null>;
  /** Focused when the expanded view opens. */
  closeBtnRef: RefObject<HTMLButtonElement | null>;
  /** Multiplies the visible span (below 1 zooms in). */
  onZoom: (factor: number) => void;
  onResetZoom: () => void;
  onExportPng: () => void;
  onCopyLink: () => void;
  onShare: () => void;
  onExpand: () => void;
  onClose: () => void;
}) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: button toolbar; <fieldset> would add form semantics and default borders
    <div class="history-chart-zoom" role="group" aria-label={t.controlsAria}>
      <button
        type="button"
        class="history-chart-zoom-btn"
        aria-label={t.zoomInAria}
        onClick={() => onZoom(1 / 1.35)}
      >
        +
      </button>
      <button
        type="button"
        class="history-chart-zoom-btn"
        aria-label={t.zoomOutAria}
        onClick={() => onZoom(1.35)}
        disabled={!zoomed}
      >
        −
      </button>
      <button
        type="button"
        class="history-chart-zoom-btn"
        aria-label={t.resetZoomAria}
        onClick={onResetZoom}
        disabled={!zoomed}
      >
        {t.reset}
      </button>
      <button
        type="button"
        class="history-chart-zoom-btn history-chart-expand-btn"
        aria-label={t.downloadPngAria}
        onClick={onExportPng}
      >
        {t.png}
      </button>
      {!guest && (
        <button
          type="button"
          class="history-chart-zoom-btn history-chart-expand-btn"
          aria-label={t.copyLinkAria}
          onClick={onCopyLink}
        >
          {linkCopied ? t.copied : t.link}
        </button>
      )}
      {guest ? null : canShareChart ? (
        <button
          type="button"
          class="history-chart-zoom-btn history-chart-expand-btn"
          aria-label={t.shareAria}
          disabled={shareBusy}
          onClick={onShare}
        >
          {shareBusy ? "…" : shared ? t.shared : t.share}
        </button>
      ) : (
        <a
          class="history-chart-zoom-btn history-chart-expand-btn"
          href="/dashboard/plans"
          aria-label={t.upgradeShareAria}
          title={t.upgradeShareTitle}
        >
          {t.share}
        </a>
      )}
      {claimsHref && (
        <a
          class="history-chart-zoom-btn history-chart-expand-btn"
          href={claimsHref}
          aria-label={t.claimsAria}
        >
          {t.claims}
        </a>
      )}
      {expanded ? (
        <button
          ref={closeBtnRef}
          type="button"
          class="history-chart-zoom-btn history-chart-expand-btn"
          aria-label={t.closeExpandedAria}
          onClick={onClose}
        >
          {t.close}
        </button>
      ) : (
        <button
          ref={expandBtnRef}
          type="button"
          class="history-chart-zoom-btn history-chart-expand-btn"
          aria-label={t.expandAria}
          aria-haspopup="dialog"
          onClick={onExpand}
        >
          {t.expand}
        </button>
      )}
    </div>
  );
}

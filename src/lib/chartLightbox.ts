/**
 * ARIA attributes for a chart wrapper that becomes a modal dialog when
 * expanded. Spread onto the wrapper; empty when collapsed.
 */
export function expandedChartDialogAttrs(
  expanded: boolean,
  title: string,
): { role?: "dialog"; "aria-modal"?: "true"; "aria-label"?: string } {
  return expanded ? { role: "dialog", "aria-modal": "true", "aria-label": title } : {};
}

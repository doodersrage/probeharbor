/**
 * Small strings shared across the dashboard, emails and alerts. Owned by the
 * i18n maintainer: add area-specific strings to your own namespace instead.
 */
const en = {
  save: "Save",
  saving: "Saving…",
  saved: "Saved",
  cancel: "Cancel",
  close: "Close",
  delete: "Delete",
  edit: "Edit",
  remove: "Remove",
  retry: "Try again",
  loading: "Loading…",
  copy: "Copy",
  copied: "Copied",
  learnMore: "Learn more",
  upgrade: "Upgrade",
  none: "None",
  unknown: "Unknown",
  never: "Never",
  yes: "Yes",
  no: "No",
  on: "On",
  off: "Off",
  genericError: "Something went wrong. Please try again.",
  networkError: "Network error. Check your connection and try again.",
  justNow: "just now",
};

export type AppCommonMessages = typeof en;
export default en;

import type { ProductShotId } from "../../../lib/productScreenshots";
import { AFFILIATE_DISCLOSURE } from "../../../lib/affiliateLinks";

type Shot = { alt: string; caption: string };

/** ProductScreenshot alt/captions, EditorialPhotoStrip label, affiliate disclosure. */

const en = {
  photoStripLabel: "Editorial photos",
  affiliateDisclosure: AFFILIATE_DISCLOSURE,
  shots: {
    insights: {
      alt: "ProbeHarbor Insights with 30-day probe curves, humidity and dew point, freeze threshold line, week-over-year comparison, and nights-at-risk forecast map",
      caption: "Insights: probe curves with your freeze threshold.",
    },
    history: {
      alt: "ProbeHarbor Reading History chart with probe traces and 34°F freeze line",
      caption: "History: week of probe traces against the freeze line.",
    },
    "history-chart": {
      alt: "ProbeHarbor seven-day temperature trend with two probes, average, humidity percent, dew point overlay, alert markers, and 34°F freeze line",
      caption: "Temperature trend with humidity, dew point, and freeze guide.",
    },
    devices: {
      alt: "ProbeHarbor Devices page showing device health score, last seen, sensor count, and feed health",
      caption: "Devices: health score, last seen, and feed status.",
    },
    "overview-cards": {
      alt: "ProbeHarbor Overview with a Looking good space status, quick actions, and a forecast-backed time-to-freeze card",
      caption: "Overview: space status, quick actions, and time to freeze.",
    },
    "overview-status": {
      alt: "ProbeHarbor Overview Status strip with last reading, fresh sensors, feeds online, alerts, and coldest margin above the freeze alert",
      caption: "Overview Status: last reading, sensors, feeds, alerts, and freeze margin.",
    },
    portfolio: {
      alt: "Illustrative ProbeHarbor Portfolio dashboard listing multiple example properties with freeze-risk banner, min temperatures, device counts, and property-manager roles",
      caption: "Illustrative example: every property’s freeze risk in one table.",
    },
    "claims-pack": {
      alt: "ProbeHarbor claims pack PDF showing freeze-exposure stats, freeze threshold, critical alerts, and devices in scope",
      caption: "Claims pack: freeze-exposure stats and devices for an adjuster.",
    },
    "claims-verification": {
      alt: "ProbeHarbor claims pack verification section with SHA-256 code, permanent verify link, and legal disclaimer",
      caption: "Verification. SHA-256 code and permanent re-view link.",
    },
    "monitoring-certificate": {
      alt: "ProbeHarbor monitoring certificate showing alerts enabled, freeze threshold, retention, and device coverage",
      caption: "Monitoring certificate: configuration proof for insurers and landlords.",
    },
  } as Record<ProductShotId, Shot>,
};

export type AboutMediaMessages = typeof en;
export default en;

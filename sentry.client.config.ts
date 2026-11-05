import * as Sentry from "@sentry/astro";
import { appVersion } from "./src/lib/appVersion";
import { SENTRY_DATA_COLLECTION, scrubBreadcrumb, scrubDeep, scrubEvent, scrubSpan } from "./src/lib/sentryScrub";

const dsn =
  import.meta.env.PUBLIC_SENTRY_DSN?.trim() ||
  import.meta.env.SENTRY_DSN?.trim() ||
  "";

// Production builds only: `astro dev` errors (Vite reloads, HMR) aren't user-facing.
const release = appVersion();

if (dsn && dsn !== "off" && import.meta.env.PROD) {
  Sentry.init({
    dsn,
    environment: "production",
    // Same date release as the Worker. Only set when known: an explicit
    // `release: undefined` would override the build plugin's default.
    ...(release ? { release } : {}),
    ignoreErrors: [
      // esp-web-tools (the /flash Install button) opens and closes the serial port
      // in un-awaited promises. These fire when the board resets or is unplugged
      // mid-dialog and don't affect the install. Our own serial code catches its errors.
      /Failed to execute 'open' on 'SerialPort': The port is already open/,
      /Failed to execute 'close' on 'SerialPort': The port is already closed/,
    ],
    tracesSampleRate: 0.1,
    // Page URLs carry share/status/invite/snooze tokens; scrub before sending.
    // v10 `sendDefaultPii: false` baseline (v11's default collects more).
    dataCollection: SENTRY_DATA_COLLECTION,
    // v10 default; v11 defaults to true (adds synthetic stacks, regroups issues).
    attachStacktrace: false,
    beforeSend: scrubEvent,
    // SDK v11 streams spans by default; beforeSendTransaction no longer runs.
    beforeSendSpan: scrubSpan,
    beforeBreadcrumb: scrubBreadcrumb,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.5,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
        // Recordings include page and request URLs, which can carry tokens.
        beforeAddRecordingEvent: (event) => scrubDeep(event),
      }),
    ],
  });
}

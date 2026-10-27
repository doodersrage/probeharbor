import * as Sentry from "@sentry/astro";

const dsn =
  import.meta.env.PUBLIC_SENTRY_DSN?.trim() ||
  import.meta.env.SENTRY_DSN?.trim() ||
  "";

// Production builds only: `astro dev` errors (Vite reloads, HMR) aren't user-facing.
if (dsn && dsn !== "off" && import.meta.env.PROD) {
  Sentry.init({
    dsn,
    environment: "production",
    ignoreErrors: [
      // esp-web-tools (the /flash Install button) opens and closes the serial port
      // in un-awaited promises. These fire when the board resets or is unplugged
      // mid-dialog and don't affect the install. Our own serial code catches its errors.
      /Failed to execute 'open' on 'SerialPort': The port is already open/,
      /Failed to execute 'close' on 'SerialPort': The port is already closed/,
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.5,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
    ],
  });
}

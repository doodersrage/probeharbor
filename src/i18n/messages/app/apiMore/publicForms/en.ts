/** Signed-out forms and links: contact form, freeze-alert sign-up/unsubscribe, public share readings. */
const en = {
  contact: {
    success: "Thanks, we got your message. We usually reply within 1–2 business days.",
    verificationFailed: "Verification failed.",
    missingFields: "Missing required fields.",
    tooLong: "Message is too long.",
    recipientMissing: "Mail recipient is not configured.",
    sendFailed: "Failed to send message. Please try again.",
  },
  freezeAlerts: {
    success: "Check your email to confirm. Alerts start the next freezing night after you do.",
    tooMany: "Too many attempts. Try again in a few minutes.",
    verificationFailed: "Verification failed. Please try again.",
    genericError: "Something went wrong. Please try again.",
    move: {
      confirmTitle: "Switch freeze alerts?",
      confirmBody: "Freeze alert emails for this address will be sent for {place} instead of the place they cover now.",
      button: "Switch alerts",
      invalidTitle: "Link not valid",
      invalidBodyHtml: "<p>This link has expired, was changed, or the alerts were unsubscribed. Your current freeze alerts are unchanged.</p>",
    },
    unsubscribe: {
      forecastLink: "Pipe freeze forecast",
      invalidTitle: "Link not valid",
      invalidBodyHtml: "<p>This unsubscribe link is missing its token.</p>",
      confirmTitle: "Stop freeze alerts?",
      confirmBodyHtml: "<p>You'll stop getting freeze alert emails for this address.</p>",
      button: "Unsubscribe",
      doneTitle: "You're unsubscribed",
      doneBodyHtml: "<p>No more freeze alert emails will be sent to this address.</p>",
      usedTitle: "Already unsubscribed",
      usedBodyHtml: "<p>This link was already used or isn't valid.</p>",
    },
  },
  shareReadings: {
    missingToken: "Missing token",
    tooManyRequests: "Too many requests",
    invalidLink: "Invalid or expired link",
  },
};

export type ApiMorePublicFormsMessages = typeof en;
export default en;

import { beforeEach, describe, expect, it, vi } from "vitest";

const { runtimeEnvStore } = vi.hoisted(() => ({
  runtimeEnvStore: new Map<string, string>(),
}));

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => runtimeEnvStore.get(key),
}));

const mockReleaseFcmTokenFromOtherUsers = vi.hoisted(() => vi.fn());
vi.mock("./db/pushTokens", () => ({
  releaseFcmTokenFromOtherUsers: (...a: unknown[]) => mockReleaseFcmTokenFromOtherUsers(...a),
}));

import {
  getFcmConfigStatus,
  isFcmConfigured,
  isStaleFcmError,
  releaseFcmTokenFromOtherUsers,
} from "./fcm";

describe("isStaleFcmError", () => {
  it("treats NOT_FOUND and UNREGISTERED as stale", () => {
    expect(isStaleFcmError(404)).toBe(true);
    expect(isStaleFcmError(400, "UNREGISTERED")).toBe(true);
    expect(isStaleFcmError(400, "NOT_FOUND")).toBe(true);
  });

  it("keeps other errors", () => {
    expect(isStaleFcmError(500)).toBe(false);
    expect(isStaleFcmError(403, "PERMISSION_DENIED")).toBe(false);
  });
});

describe("releaseFcmTokenFromOtherUsers", () => {
  it("drops the token from any other account, keeping the caller's", async () => {
    mockReleaseFcmTokenFromOtherUsers.mockResolvedValueOnce(undefined);
    await releaseFcmTokenFromOtherUsers(null, "user-a", "tok-123");
    expect(mockReleaseFcmTokenFromOtherUsers).toHaveBeenCalledWith("user-a", "tok-123");
  });
});

describe("FCM_SERVICE_ACCOUNT_JSON parsing", () => {
  beforeEach(() => {
    runtimeEnvStore.clear();
  });

  it("accepts normal service-account JSON", () => {
    runtimeEnvStore.set(
      "FCM_SERVICE_ACCOUNT_JSON",
      JSON.stringify({
        project_id: "demo",
        client_email: "svc@demo.iam.gserviceaccount.com",
        private_key: "-----BEGIN PRIVATE KEY-----\\nABC\\n-----END PRIVATE KEY-----\\n",
      }),
    );
    expect(isFcmConfigured()).toBe(true);
    expect(getFcmConfigStatus()).toBe("configured");
  });

  it("accepts over-escaped JSON left by a bad secrets push", () => {
    const good = JSON.stringify({
      project_id: "demo",
      client_email: "svc@demo.iam.gserviceaccount.com",
      private_key: "-----BEGIN PRIVATE KEY-----\\nABC\\n-----END PRIVATE KEY-----\\n",
    });
    runtimeEnvStore.set("FCM_SERVICE_ACCOUNT_JSON", good.replace(/"/g, '\\"'));
    expect(isFcmConfigured()).toBe(true);
    expect(getFcmConfigStatus()).toBe("configured");
  });

  it("reports invalid when JSON cannot be parsed into required fields", () => {
    runtimeEnvStore.set("FCM_SERVICE_ACCOUNT_JSON", "{not-json");
    expect(isFcmConfigured()).toBe(false);
    expect(getFcmConfigStatus()).toBe("invalid");
  });

  it("reports missing when unset", () => {
    expect(getFcmConfigStatus()).toBe("missing");
  });
});

describe("buildFcmMessage", () => {
  it("targets the Android app's channel and adds the iOS alert category", async () => {
    const { buildFcmMessage } = await import("./fcm");
    const { message } = buildFcmMessage("tok-1", { title: "Freeze", body: "Garage 31°F", eventId: 42 });

    expect(message.token).toBe("tok-1");
    expect(message.data).toMatchObject({ event_id: "42", deep_link: "alerts" });
    expect(message.android.notification.channel_id).toBe("thermaltrace_alerts");
    expect(message.apns.payload.aps).toEqual({ sound: "default", category: "PROBE_ALERT" });
  });

  it("omits event_id when the alert has no event", async () => {
    const { buildFcmMessage } = await import("./fcm");
    const { message } = buildFcmMessage("tok-1", { title: "Test", body: "Hello" });

    expect(message.data).not.toHaveProperty("event_id");
  });
});

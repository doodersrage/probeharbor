import { describe, expect, it } from "vitest";
import {
  buildHomeAssistantPushYaml,
  buildMqttBridgeCurl,
  parseSetupVia,
} from "./firstDevicePaths";

describe("parseSetupVia", () => {
  it("accepts known paths and rejects anything else", () => {
    expect(parseSetupVia("ha")).toBe("ha");
    expect(parseSetupVia("mqtt")).toBe("mqtt");
    expect(parseSetupVia("HA")).toBeNull();
    expect(parseSetupVia("<script>")).toBeNull();
    expect(parseSetupVia(null)).toBeNull();
  });
});

describe("buildHomeAssistantPushYaml", () => {
  const yaml = buildHomeAssistantPushYaml("https://thermaltrace.dev/api/ingest/abc123");

  it("posts to the ingest URL with a rest_command", () => {
    expect(yaml).toContain("rest_command:");
    expect(yaml).toContain('url: "https://thermaltrace.dev/api/ingest/abc123"');
    expect(yaml).toContain("action: rest_command.thermaltrace_push");
  });

  it("converts °C sensors because flat keys are read as °F", () => {
    expect(yaml).toContain("== '°C'");
    expect(yaml).toContain("t * 9 / 5 + 32");
  });
});

describe("buildMqttBridgeCurl", () => {
  it("sends the key in X-Ingest-Key, which the bridge requires", () => {
    const curl = buildMqttBridgeCurl("https://thermaltrace.dev", "abc123");
    expect(curl).toContain('"https://thermaltrace.dev/api/ingest/mqtt"');
    expect(curl).toContain('-H "X-Ingest-Key: abc123"');
    expect(curl).not.toContain("Bearer");
  });

  it("embeds a payload the bridge can parse", () => {
    const curl = buildMqttBridgeCurl("https://thermaltrace.dev", "k");
    const body = curl.slice(curl.indexOf("-d '") + 4, curl.lastIndexOf("'"));
    const envelope = JSON.parse(body) as { payload: string };
    expect(JSON.parse(envelope.payload)).toEqual({ temp1: 42.5, humidity1: 55 });
  });
});

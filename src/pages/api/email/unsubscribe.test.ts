import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockVerify = vi.fn();
const mockApply = vi.fn();
vi.mock("../../../lib/emailUnsubscribe", () => ({
  applyUnsubscribe: (...a: unknown[]) => mockApply(...a),
  verifyUnsubscribeToken: (...a: unknown[]) => mockVerify(...a),
  isUnsubscribeKind: (value: string) => value === "digest" || value === "drip",
  UNSUBSCRIBE_LABELS: { digest: "weekly digest emails", drip: "tips emails" },
}));

function ctx(query: string): APIContext {
  return { url: new URL(`https://thermaltrace.test/api/email/unsubscribe${query}`) } as APIContext;
}

beforeEach(() => {
  mockVerify.mockReset().mockResolvedValue(true);
  mockApply.mockReset().mockResolvedValue({ error: null });
});

describe("/api/email/unsubscribe", () => {
  it("rejects an invalid signature", async () => {
    mockVerify.mockResolvedValue(false);
    const { GET, POST } = await import("./unsubscribe");

    expect((await GET(ctx("?uid=u1&kind=digest&sig=bad"))).status).toBe(400);
    expect((await POST(ctx("?uid=u1&kind=digest&sig=bad"))).status).toBe(400);
    expect(mockApply).not.toHaveBeenCalled();
  });

  it("rejects an unknown kind without checking the signature", async () => {
    const { POST } = await import("./unsubscribe");

    expect((await POST(ctx("?uid=u1&kind=alerts&sig=abc"))).status).toBe(400);
    expect(mockVerify).not.toHaveBeenCalled();
  });

  it("only shows a confirmation on GET so link scanners can't unsubscribe", async () => {
    const { GET } = await import("./unsubscribe");

    const response = await GET(ctx("?uid=u1&kind=digest&sig=abc"));

    expect(response.status).toBe(200);
    expect(await response.text()).toContain('method="post"');
    expect(mockApply).not.toHaveBeenCalled();
  });

  it("applies the unsubscribe on POST (one-click)", async () => {
    const { POST } = await import("./unsubscribe");

    const response = await POST(ctx("?uid=u1&kind=digest&sig=abc"));

    expect(response.status).toBe(200);
    expect(mockApply).toHaveBeenCalledWith("u1", "digest");
  });
});

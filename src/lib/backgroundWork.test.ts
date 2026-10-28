import { describe, expect, it, vi } from "vitest";
import { runAfterResponse } from "./backgroundWork";

describe("runAfterResponse", () => {
  it("hands the work to waitUntil and returns without waiting for it", async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => { release = resolve; });
    const done = vi.fn();
    const waitUntil = vi.fn();

    await runAfterResponse({ cfContext: { waitUntil } }, "test", async () => {
      await gate;
      done();
    });

    expect(waitUntil).toHaveBeenCalledTimes(1);
    expect(done).not.toHaveBeenCalled(); // the caller already moved on
    release();
    await waitUntil.mock.calls[0]![0];
    expect(done).toHaveBeenCalled();
  });

  it("runs inline when there's no Worker context", async () => {
    const done = vi.fn();
    await runAfterResponse(undefined, "test", async () => { done(); });
    expect(done).toHaveBeenCalled();
  });

  it("logs a failure instead of throwing", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(runAfterResponse({}, "alerts", async () => { throw new Error("smtp down"); })).resolves.toBeUndefined();
    expect(log).toHaveBeenCalledWith("alerts failed:", expect.any(Error));
  });

  it("falls back to inline if reading cfContext throws", async () => {
    const locals = Object.defineProperty({}, "cfContext", { get() { throw new Error("not in a Worker"); } });
    const done = vi.fn();
    await runAfterResponse(locals, "test", async () => { done(); });
    expect(done).toHaveBeenCalled();
  });
});

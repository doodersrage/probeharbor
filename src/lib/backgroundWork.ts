/**
 * Run work after the HTTP response when the Cloudflare Worker context is
 * available (`locals.cfContext.waitUntil`), so a slow email or SMS provider
 * can't hold up the caller. Outside the Worker (tests, `astro dev` without
 * the platform proxy) the work runs before returning, as it always did.
 *
 * Errors are logged, never thrown: the caller's response is already decided.
 */
type WaitUntilLocals = { cfContext?: { waitUntil(promise: Promise<unknown>): void } };

export async function runAfterResponse(
  locals: unknown,
  label: string,
  work: () => Promise<void>,
): Promise<void> {
  const task = work().catch((error) => {
    console.error(`${label} failed:`, error);
  });
  let waitUntil: ((promise: Promise<unknown>) => void) | undefined;
  try {
    const ctx = (locals as WaitUntilLocals | undefined)?.cfContext;
    waitUntil = ctx?.waitUntil ? ctx.waitUntil.bind(ctx) : undefined;
  } catch {
    waitUntil = undefined; // the adapter's getter can throw outside the Worker
  }
  if (waitUntil) {
    waitUntil(task);
    return;
  }
  await task;
}

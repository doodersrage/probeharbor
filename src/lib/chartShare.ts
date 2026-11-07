import { env as cloudflareEnv } from "cloudflare:workers";
import { chartShareKey, isChartShareKey } from "./chartShareKeys";
import { findChartShare, insertChartShare } from "./db/shareLinks";

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getHistoryArchiveBucket(): R2Bucket | null {
  try {
    const bucket = (cloudflareEnv as unknown as { HISTORY_ARCHIVE?: R2Bucket })
      .HISTORY_ARCHIVE;
    return bucket ?? null;
  } catch {
    return null;
  }
}

export async function createChartShare(input: {
  userId: string;
  pngBytes: ArrayBuffer;
  title?: string;
  expiresDays?: number;
}): Promise<{ token: string | null; error: string | null }> {
  const bucket = getHistoryArchiveBucket();
  if (!bucket) {
    return { token: null, error: "Chart share storage is not configured." };
  }

  const token = randomToken();
  const key = chartShareKey(token);
  const expiresDays = Math.min(30, Math.max(1, input.expiresDays ?? 14));
  const expiresAt = new Date(
    Date.now() + expiresDays * 24 * 60 * 60 * 1000,
  ).toISOString();

  await bucket.put(key, input.pngBytes, {
    httpMetadata: { contentType: "image/png" },
  });

  const row = {
    token,
    user_id: input.userId,
    r2_key: key,
    title: input.title?.slice(0, 120) ?? null,
    expires_at: expiresAt,
  };
  const { error } = await insertChartShare(row);

  if (error) {
    try {
      await bucket.delete(key);
    } catch {
      /* ignore */
    }
    return { token: null, error };
  }

  return { token, error: null };
}

export async function getChartShareByToken(token: string): Promise<{
  title: string | null;
  png: ArrayBuffer | null;
  expiresAt: string;
} | null> {
  const data = await findChartShare(token);

  if (!data) return null;
  if (Date.parse(data.expires_at) < Date.now()) return null;
  // Never serve anything but a chart image from the shared bucket.
  if (!isChartShareKey(data.r2_key)) return null;

  const bucket = getHistoryArchiveBucket();
  if (!bucket) return null;
  const object = await bucket.get(data.r2_key);
  if (!object) return null;
  const png = await object.arrayBuffer();
  return {
    title: data.title ?? null,
    png,
    expiresAt: data.expires_at,
  };
}

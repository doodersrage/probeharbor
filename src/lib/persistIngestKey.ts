import { encryptIngestKeyForStorage } from "./ingestKeyVault";
import { updateDeviceMeta } from "./devices";

export async function persistEncryptedIngestKey(
  deviceId: string,
  rawKey: string,
): Promise<void> {
  const ingest_key_enc = await encryptIngestKeyForStorage(rawKey);
  if (ingest_key_enc) {
    // Not a reading: keep last_seen_at empty so setup still waits for the first upload.
    await updateDeviceMeta(deviceId, { ingest_key_enc }, { touchLastSeen: false });
  }
}

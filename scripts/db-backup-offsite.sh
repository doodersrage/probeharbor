#!/usr/bin/env bash
# Off-site database backup: pg_dump → check → encrypt → R2 → verify.
# Run by .github/workflows/db-backup.yml; see docs/guide/deploy.md
# ("Automatic off-site backups") for setup and restore.
#
# Env (all required):
#   BACKUP_DATABASE_URL     direct (unpooled) connection string, read-only role
#   BACKUP_AGE_RECIPIENT    age public key (age1…); the private key stays offline
#   R2_ACCOUNT_ID           Cloudflare account id (for the R2 S3 endpoint)
#   R2_BACKUP_BUCKET        private bucket for the dumps
#   AWS_ACCESS_KEY_ID       R2 API token's access key (that bucket, read+write)
#   AWS_SECRET_ACCESS_KEY   its secret
# Optional: S3_ENDPOINT_URL overrides the R2 endpoint (tests).
#
# Nothing unencrypted leaves the machine, the plaintext dump is deleted as
# soon as it's encrypted, and no secret or hostname is printed by this script.
set -euo pipefail

missing=()
for name in BACKUP_DATABASE_URL BACKUP_AGE_RECIPIENT R2_ACCOUNT_ID R2_BACKUP_BUCKET AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY; do
  [[ -n "${!name:-}" ]] || missing+=("$name")
done
if (( ${#missing[@]} > 0 )); then
  echo "::error::Backup not configured; missing: ${missing[*]}. See docs/guide/deploy.md (Automatic off-site backups)."
  exit 1
fi
if [[ "$BACKUP_AGE_RECIPIENT" != age1* ]]; then
  echo "::error::BACKUP_AGE_RECIPIENT must be an age public key (age1…), not a private key."
  exit 1
fi

endpoint="${S3_ENDPOINT_URL:-https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com}"
# R2 rejects the default checksum headers of newer AWS CLI versions.
export AWS_REQUEST_CHECKSUM_CALCULATION=WHEN_REQUIRED AWS_RESPONSE_CHECKSUM_VALIDATION=WHEN_REQUIRED
export AWS_DEFAULT_REGION=auto

work=$(mktemp -d)
chmod 700 "$work"
trap 'rm -rf "$work"' EXIT

here=$(cd "$(dirname "$0")" && pwd)
node "$here/db-backup.mjs" --env-file /dev/null --url-env BACKUP_DATABASE_URL --out-dir "$work" >/dev/null
dump=$(find "$work" -maxdepth 1 -name 'probeharbor-*.dump' -print -quit)
[[ -n "$dump" ]] || { echo "::error::pg_dump produced no file."; exit 1; }

# A dump that pg_restore can't list, or that lacks the readings table, is
# not a backup.
listing=$(pg_restore --list "$dump")
tables=$(grep -c ' TABLE DATA ' <<<"$listing" || true)
if ! grep -q ' TABLE DATA public sensor_readings ' <<<"$listing"; then
  echo "::error::The dump has no sensor_readings data ($tables tables); not uploading it."
  exit 1
fi

age -r "$BACKUP_AGE_RECIPIENT" -o "$dump.age" "$dump"
rm -f "$dump"

key="db/$(basename "$dump").age"
aws s3 cp "$dump.age" "s3://$R2_BACKUP_BUCKET/$key" --endpoint-url "$endpoint" --only-show-errors
aws s3 cp "s3://$R2_BACKUP_BUCKET/$key" "$work/check.age" --endpoint-url "$endpoint" --only-show-errors
want=$(sha256sum "$dump.age" | cut -d' ' -f1)
got=$(sha256sum "$work/check.age" | cut -d' ' -f1)
if [[ "$want" != "$got" ]]; then
  echo "::error::The uploaded copy doesn't match ($key)."
  exit 1
fi

mb=$(awk -v b="$(stat -c %s "$dump.age")" 'BEGIN { printf "%.1f", b / 1048576 }')
summary="Backed up $tables tables, $mb MB encrypted, to $key (checksum verified after upload)."
echo "$summary"
if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then echo "$summary" >>"$GITHUB_STEP_SUMMARY"; fi

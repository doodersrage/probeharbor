import { useState } from "preact/hooks";
import { trackProductEvent } from "../lib/productAnalytics";
import en, { type PushInlineRenameText } from "../i18n/messages/app/deviceSetup/push/en";

export type InlineSensorRow = {
  id: string;
  key: string;
  label: string;
  kind: string;
};

interface Props {
  deviceId: string;
  deviceName: string;
  sensors: InlineSensorRow[];
  highlight?: boolean;
  /** Translated strings from the server; English when missing. */
  text?: PushInlineRenameText;
}

export default function PushInlineRename({
  deviceName,
  sensors: initial,
  highlight = false,
  text = en.inlineRename,
}: Props) {
  const [sensors, setSensors] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  if (initial.length === 0) return null;

  function acceptSuggested() {
    setSensors((rows) =>
      rows.map((row) => ({
        ...row,
        label:
          /^Probe \d+$/.test(row.label) || row.label === humanize(row.key)
            ? humanize(row.key)
            : row.label,
      })),
    );
  }

  async function saveAll() {
    setSaving(true);
    setStatus(null);
    try {
      const response = await fetch("/api/devices/sensors-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sensors: sensors.map((row) => ({ id: row.id, label: row.label })),
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setStatus(data.error ?? text.couldNotSave);
        return;
      }
      trackProductEvent("sensors_renamed", { count: sensors.length });
      setStatus(text.saved);
    } catch {
      setStatus(text.couldNotSave);
    } finally {
      setSaving(false);
    }
  }

  const wrapperClass = [
    "rounded-lg border p-3 mb-4",
    highlight
      ? "border-[var(--color-accent)] bg-[var(--color-bg-muted)]"
      : "border-[var(--color-border)]",
  ].join(" ");

  return (
    <div class={wrapperClass}>
      <p class="m-0 mb-2 text-sm font-medium">
        {highlight ? text.renameImported : text.quickRename} · {deviceName}
      </p>
      <div class="flex flex-col gap-2">
        {sensors.map((row, index) => (
          <div class="flex flex-wrap items-end gap-2" key={row.id}>
            <code class="text-xs">{row.key}</code>
            <input
              class="form-input flex-1 min-w-[10rem]"
              type="text"
              value={row.label}
              onInput={(event) =>
                setSensors((current) =>
                  current.map((item, itemIndex) =>
                    itemIndex === index
                      ? { ...item, label: (event.currentTarget as HTMLInputElement).value }
                      : item,
                  ),
                )
              }
            />
          </div>
        ))}
      </div>
      <div class="flex flex-wrap gap-2 mt-3">
        <button type="button" class="btn-secondary" onClick={acceptSuggested}>
          {text.acceptSuggested}
        </button>
        <button type="button" class="btn-primary" disabled={saving} onClick={() => void saveAll()}>
          {saving ? text.saving : text.saveNames}
        </button>
        {status ? <span class="text-sm text-[var(--color-text-muted)]">{status}</span> : null}
      </div>
    </div>
  );
}

function humanize(key: string): string {
  if (/^\d+$/.test(key)) return `Probe ${key}`;
  return key.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

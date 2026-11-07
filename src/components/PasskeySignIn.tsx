import { useState } from "preact/hooks";
import { browserSupportsWebAuthn, performWebAuthnGet } from "../lib/webauthnMfaBrowser";

/** "Sign in with a passkey" on /signin (shown only when sign-in runs on Better Auth). */
interface Props {
  next?: string | null;
  text: { passkeySignIn: string; passkeyFailed: string };
}

async function api(body: unknown): Promise<{ ok: boolean; data: Record<string, unknown> }> {
  const res = await fetch("/api/auth/passkey", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, data: (await res.json().catch(() => ({}))) as Record<string, unknown> };
}

export default function PasskeySignIn({ next, text: t }: Props) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  if (typeof window !== "undefined" && !browserSupportsWebAuthn()) return null;

  async function signIn() {
    setBusy(true);
    setFailed(false);
    try {
      const started = await api({ action: "signin_options" });
      if (!started.ok) throw new Error("options");
      const response = await performWebAuthnGet(started.data.options as Record<string, unknown>);
      const verified = await api({ action: "signin_verify", response, next: next ?? undefined });
      const redirectTo = verified.data.redirectTo;
      if (!verified.ok || typeof redirectTo !== "string") throw new Error("verify");
      window.location.assign(redirectTo);
    } catch {
      setFailed(true);
      setBusy(false);
    }
  }

  return (
    <div class="mt-3">
      <button type="button" class="btn-secondary w-full" disabled={busy} onClick={() => void signIn()}>
        {t.passkeySignIn}
      </button>
      {failed && (
        <p class="text-sm mt-2 mb-0" role="alert">
          {t.passkeyFailed}
        </p>
      )}
    </div>
  );
}

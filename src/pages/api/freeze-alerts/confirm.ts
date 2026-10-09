import type { APIRoute } from "astro";
import { confirmFreezeAlerts } from "../../../lib/freezeAlerts";

export const prerender = false;

export const GET: APIRoute = async ({ url, redirect }) => {
  const token = url.searchParams.get("token")?.trim();
  const result = token ? await confirmFreezeAlerts(token) : { ok: false };
  return redirect(`/pipe-freeze-forecast?alerts=${result.ok ? "confirmed" : "invalid"}`);
};

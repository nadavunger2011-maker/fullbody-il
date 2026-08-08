import { createClient } from "npm:@supabase/supabase-js@2";
import { renderPlanEmail, type PlanEmailData, type PlanEmailTemplate } from "../_shared/plan-email-templates.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const FROM = "FullBody <info@fullbody.co.il>";
const ALLOWED: PlanEmailTemplate[] = ["plan-summary", "plan-reminder"];
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) return json({ error: "RESEND_API_KEY is not configured" }, 500);

    const payload = await req.json().catch(() => null);
    if (!payload || typeof payload !== "object") return json({ error: "Invalid JSON body" }, 400);

    const template = payload.template as PlanEmailTemplate;
    const recipient = String(payload.recipient || "").trim().toLowerCase();
    const leadId = payload.leadId ? String(payload.leadId) : null;
    const data = (payload.data || {}) as PlanEmailData;

    if (!ALLOWED.includes(template)) return json({ error: "Unknown template" }, 400);
    if (!emailRe.test(recipient) || recipient.length > 320) return json({ error: "Invalid recipient email" }, 400);

    const { subject, html } = renderPlanEmail(template, data);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ from: FROM, to: [recipient], subject, html }),
    });

    const bodyText = await res.text();
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(bodyText);
    } catch {
      /* keep raw text */
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await supabase.from("email_sends").insert({
      lead_id: leadId,
      template,
      recipient,
      provider_message_id: res.ok ? ((parsed.id as string) ?? null) : null,
      status: res.ok ? "sent" : "failed",
      error: res.ok ? null : bodyText.slice(0, 1000),
    });

    if (!res.ok) {
      console.error(`Resend request failed [${res.status}]: ${bodyText}`);
      return json({ error: "Email provider request failed", status: res.status, details: bodyText }, res.status);
    }

    return json({ success: true, id: parsed.id ?? null });
  } catch (e) {
    console.error("send-plan-email error:", e);
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
});

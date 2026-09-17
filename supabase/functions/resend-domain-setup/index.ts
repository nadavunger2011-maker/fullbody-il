import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API = "https://api.resend.com";
const DOMAIN = "fullbody.co.il";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Admin-only: requires the cleanup token
  const token = req.headers.get("x-admin-token");
  const expected = Deno.env.get("BLOG_CLEANUP_TOKEN");
  if (!expected || token !== expected) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY missing" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const headers = {
    Authorization: `Bearer ${RESEND_API_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const action = body.action || "create-or-get";

    if (action === "create-or-get") {
      // Try to create the domain; if it already exists, fetch it instead
      const createRes = await fetch(`${RESEND_API}/domains`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name: DOMAIN }),
      });
      const createData = await createRes.json();

      if (createRes.ok) {
        return new Response(JSON.stringify({ created: true, domain: createData }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Already exists or other error -> list domains and find ours
      const listRes = await fetch(`${RESEND_API}/domains`, { headers });
      const listData = await listRes.json();
      const found = (listData.data || []).find((d: { name: string }) => d.name === DOMAIN);
      if (found) {
        const getRes = await fetch(`${RESEND_API}/domains/${found.id}`, { headers });
        const getData = await getRes.json();
        return new Response(
          JSON.stringify({ created: false, domain: getData, createError: createData }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: "Domain not found after create failed", createData, listData }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (action === "verify") {
      const listRes = await fetch(`${RESEND_API}/domains`, { headers });
      const listData = await listRes.json();
      const found = (listData.data || []).find((d: { name: string }) => d.name === DOMAIN);
      if (!found) {
        return new Response(JSON.stringify({ error: "Domain not registered yet" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const verifyRes = await fetch(`${RESEND_API}/domains/${found.id}/verify`, {
        method: "POST",
        headers,
      });
      const verifyData = await verifyRes.json().catch(() => ({}));
      const getRes = await fetch(`${RESEND_API}/domains/${found.id}`, { headers });
      const getData = await getRes.json();
      return new Response(JSON.stringify({ verifyResult: verifyData, domain: getData }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

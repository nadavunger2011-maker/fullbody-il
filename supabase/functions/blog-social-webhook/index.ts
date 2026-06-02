import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PUBLIC_BASE_URL = "https://fullbody.co.il";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let body: { post_id?: string } = {};
    try {
      body = await req.json();
    } catch {
      // no body
    }

    const postId = body.post_id;
    if (!postId) {
      return new Response(JSON.stringify({ error: "post_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Read the configured webhook target URL from app_settings
    const { data: setting, error: settingError } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "blog_webhook_url")
      .maybeSingle();

    if (settingError) throw settingError;

    const webhookUrl = setting?.value?.trim();
    if (!webhookUrl) {
      return new Response(
        JSON.stringify({ error: "כתובת Webhook לא הוגדרה. הגדר אותה במסך הניהול." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Fetch the post
    const { data: post, error: postError } = await supabase
      .from("blog_posts")
      .select("id, slug, title, content, image, published")
      .eq("id", postId)
      .maybeSingle();

    if (postError) throw postError;
    if (!post) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = {
      post_title: post.title,
      post_content: post.content,
      post_url: `${PUBLIC_BASE_URL}/blog/${post.slug}`,
      featured_image: post.image || null,
    };

    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseText = await webhookResponse.text();

    if (!webhookResponse.ok) {
      console.error("Webhook target returned error:", webhookResponse.status, responseText);
      return new Response(
        JSON.stringify({
          error: `Webhook target responded with ${webhookResponse.status}`,
          details: responseText.slice(0, 500),
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, post_id: post.id, target: webhookUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("blog-social-webhook error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

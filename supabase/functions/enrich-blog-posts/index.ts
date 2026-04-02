import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all published posts
    const { data: posts, error: fetchError } = await supabase
      .from("blog_posts")
      .select("id, title, content, category, category_id")
      .eq("published", true)
      .order("created_at", { ascending: true });

    if (fetchError) throw fetchError;
    if (!posts || posts.length === 0) {
      return new Response(JSON.stringify({ success: true, message: "No posts to enrich", updated: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Process ALL posts - remove existing infographics and re-insert in middle
    const postsToEnrich = posts;
    console.log(`Processing ${postsToEnrich.length} posts`);

    let updated = 0;
    const results: { id: string; title: string }[] = [];

    for (const post of postsToEnrich) {
      const prompt = `אתה מומחה עיצוב תוכן. קיבלת מאמר בנושא "${post.category}" עם הכותרת "${post.title}".

צור 1-2 אינפוגרפיקות HTML מעוצבות שרלוונטיות לתוכן המאמר.

## סוגי אינפוגרפיקות (בחר את המתאימים ביותר):
a) טבלת השוואה: <figure class="infographic" role="img" aria-label="תיאור"><table class="info-table"><thead>...</thead><tbody>...</tbody></table><figcaption>תיאור alt</figcaption></figure>
b) שלבים: <figure class="infographic" role="img" aria-label="תיאור"><div class="info-steps"><div class="step"><div class="step-num">1</div><h4>כותרת</h4><p>תיאור</p></div>...</div><figcaption>תיאור alt</figcaption></figure>
c) סטטיסטיקות: <figure class="infographic" role="img" aria-label="תיאור"><div class="info-stats"><div class="stat"><div class="stat-number">85%</div><div class="stat-label">תיאור</div></div>...</div><figcaption>תיאור alt</figcaption></figure>
d) יתרונות/חסרונות: <figure class="infographic" role="img" aria-label="תיאור"><div class="info-pros-cons"><div class="pros"><h4>✅ יתרונות</h4><ul><li>...</li></ul></div><div class="cons"><h4>❌ חסרונות</h4><ul><li>...</li></ul></div></div><figcaption>תיאור alt</figcaption></figure>

## דרישות:
- כל aria-label ו-figcaption חייבים להיות בעברית ולתאר את התוכן הויזואלי
- השתמש בנתונים אמיתיים ומדויקים
- השתמש בסימנים כמו ✅ ❌ ⭐ 💪 🔥
- התוכן חייב להיות רלוונטי לנושא המאמר

החזר JSON בלבד בפורמט:
{"infographics": "<figure class='infographic'...>...</figure>"}`;

      try {
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: "אתה מעצב תוכן. תחזיר JSON תקין בלבד עם אינפוגרפיקות HTML." },
              { role: "user", content: prompt },
            ],
          }),
        });

        if (!aiResponse.ok) {
          const errText = await aiResponse.text();
          console.error(`AI error for post ${post.id}:`, aiResponse.status, errText);
          if (aiResponse.status === 429) {
            await new Promise(r => setTimeout(r, 15000));
          }
          continue;
        }

        const aiData = await aiResponse.json();
        let rawContent = aiData.choices?.[0]?.message?.content || "";
        rawContent = rawContent.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();

        let parsed;
        try {
          parsed = JSON.parse(rawContent);
        } catch {
          console.error(`Failed to parse infographic JSON for post ${post.id}:`, rawContent.slice(0, 200));
          continue;
        }

        if (!parsed.infographics) continue;

        // Strip any existing infographics first
        let newContent = post.content.replace(/<figure class=["']infographic["'][\s\S]*?<\/figure>/gi, "");
        
        // Find the middle of the content by counting all H2 tags and inserting before the middle one
        const h2Matches = [...newContent.matchAll(/<h2/gi)];
        if (h2Matches.length >= 3) {
          const midIndex = Math.floor(h2Matches.length / 2);
          const insertPos = h2Matches[midIndex].index!;
          newContent = newContent.slice(0, insertPos) + parsed.infographics + newContent.slice(insertPos);
        } else if (h2Matches.length >= 2) {
          const insertPos = h2Matches[1].index!;
          newContent = newContent.slice(0, insertPos) + parsed.infographics + newContent.slice(insertPos);
        } else {
          // Fallback: insert roughly in the middle of the content
          const midPoint = Math.floor(newContent.length / 2);
          const nearestP = newContent.indexOf("</p>", midPoint);
          if (nearestP > 0) {
            const insertPos = nearestP + 4;
            newContent = newContent.slice(0, insertPos) + parsed.infographics + newContent.slice(insertPos);
          } else {
            newContent = newContent + parsed.infographics;
          }
        }

        const { error: updateError } = await supabase
          .from("blog_posts")
          .update({ content: newContent, updated_at: new Date().toISOString() })
          .eq("id", post.id);

        if (updateError) {
          console.error(`DB update error for post ${post.id}:`, updateError);
          continue;
        }

        updated++;
        results.push({ id: post.id, title: post.title });
        console.log(`Enriched post: ${post.title}`);

        // Delay between AI calls
        if (postsToEnrich.indexOf(post) < postsToEnrich.length - 1) {
          await new Promise(r => setTimeout(r, 3000));
        }
      } catch (e) {
        console.error(`Error enriching post ${post.id}:`, e);
        continue;
      }
    }

    return new Response(JSON.stringify({ success: true, updated, total: postsToEnrich.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("enrich-blog-posts error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface LatestReview {
  id: string;
  reviewer_name: string;
  rating: number;
  title: string | null;
  content: string;
  product_handle: string;
  created_at: string;
}

export default function HomepageReviews() {
  const [reviews, setReviews] = useState<LatestReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const { data } = await supabase
        .from("product_reviews")
        .select("id, reviewer_name, rating, title, content, product_handle, created_at")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (cancel) return;
      if (data) setReviews(data as LatestReview[]);
      setLoading(false);
    })();
    return () => { cancel = true; };
  }, []);

  if (loading) return null;
  if (reviews.length === 0) return null;

  return (
    <section className="py-14 bg-card border-t border-border" aria-labelledby="latest-reviews-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 id="latest-reviews-heading" className="text-2xl md:text-3xl font-black text-foreground">
            מה לקוחות אומרים עלינו
          </h2>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">ביקורות אחרונות מלקוחות מאומתים</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <Link
              key={r.id}
              to={`/product/${r.product_handle}`}
              className="bg-background border border-border rounded-xl p-5 hover:shadow-hover transition-all flex flex-col gap-2"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-border"}`}
                  />
                ))}
              </div>
              {r.title && <p className="font-bold text-foreground line-clamp-1">{r.title}</p>}
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{r.content}</p>
              <p className="text-xs text-muted-foreground mt-auto pt-2 border-t border-border/50">
                — {r.reviewer_name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

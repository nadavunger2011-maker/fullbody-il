import { useEffect, useState } from "react";
import { Star, MessageSquarePlus, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  title: string | null;
  content: string;
  is_verified_purchase: boolean;
  created_at: string;
}

interface ProductReviewsProps {
  productHandle: string;
  productTitle: string;
}

const reviewSchema = z.object({
  reviewer_name: z.string().trim().min(2, "שם קצר מדי").max(50, "שם ארוך מדי"),
  reviewer_email: z.string().trim().email("מייל לא תקין").max(255),
  rating: z.number().int().min(1, "יש לבחור דירוג").max(5),
  title: z.string().trim().max(100).optional(),
  content: z.string().trim().min(10, "ביקורת קצרה מדי - לפחות 10 תווים").max(1000, "ארוך מדי"),
});

export default function ProductReviews({ productHandle, productTitle }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    reviewer_name: "",
    reviewer_email: "",
    rating: 0,
    title: "",
    content: "",
  });

  useEffect(() => {
    let cancel = false;
    (async () => {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("id, reviewer_name, rating, title, content, is_verified_purchase, created_at")
        .eq("product_handle", productHandle)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      if (cancel) return;
      if (!error && data) setReviews(data as Review[]);
      setLoading(false);
    })();
    return () => {
      cancel = true;
    };
  }, [productHandle]);

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = reviewSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("product_reviews").insert({
        product_handle: productHandle,
        reviewer_name: result.data.reviewer_name,
        reviewer_email: result.data.reviewer_email,
        rating: result.data.rating,
        title: result.data.title || null,
        content: result.data.content,
        is_approved: false,
      });
      if (error) throw error;
      toast.success("תודה! הביקורת התקבלה ותפורסם לאחר אישור.");
      setForm({ reviewer_name: "", reviewer_email: "", rating: 0, title: "", content: "" });
      setShowForm(false);
    } catch (err) {
      toast.error("שגיאה בשליחת הביקורת. נסו שוב.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="border-t border-border pt-8 mt-8" aria-labelledby="reviews-heading">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 id="reviews-heading" className="text-2xl font-black text-foreground">ביקורות לקוחות</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {avgRating.toFixed(1)} מתוך 5 ({reviews.length} ביקורות)
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-[hsl(142,70%,35%)] text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-[hsl(142,70%,30%)] transition-all"
        >
          <MessageSquarePlus className="w-4 h-4" />
          כתבו ביקורת
        </button>
      </div>

      {/* Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-secondary/30 rounded-xl p-5 mb-6 space-y-3 border border-border">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              required
              type="text"
              placeholder="שמכם המלא"
              value={form.reviewer_name}
              onChange={(e) => setForm({ ...form, reviewer_name: e.target.value })}
              maxLength={50}
              className="px-3 py-2 rounded-lg border border-border bg-card focus:outline-none focus:border-[hsl(142,70%,35%)]"
            />
            <input
              required
              type="email"
              placeholder="מייל (לא יוצג)"
              value={form.reviewer_email}
              onChange={(e) => setForm({ ...form, reviewer_email: e.target.value })}
              maxLength={255}
              className="px-3 py-2 rounded-lg border border-border bg-card focus:outline-none focus:border-[hsl(142,70%,35%)]"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">דירוג:</span>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm({ ...form, rating: s })}
                aria-label={`${s} כוכבים`}
              >
                <Star
                  className={`w-6 h-6 transition-all ${s <= form.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40 hover:text-yellow-400"}`}
                />
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="כותרת קצרה (אופציונלי)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            maxLength={100}
            className="w-full px-3 py-2 rounded-lg border border-border bg-card focus:outline-none focus:border-[hsl(142,70%,35%)]"
          />
          <textarea
            required
            placeholder={`ספרו על החוויה שלכם עם ${productTitle}...`}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            maxLength={1000}
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-border bg-card focus:outline-none focus:border-[hsl(142,70%,35%)] resize-none"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              הביקורת תפורסם לאחר אישור (1-2 ימי עסקים)
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[hsl(142,70%,35%)] text-white font-bold px-5 py-2 rounded-lg hover:bg-[hsl(142,70%,30%)] disabled:opacity-60"
            >
              {submitting ? "שולח..." : "שלחו ביקורת"}
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground text-sm">טוען ביקורות...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 bg-secondary/20 rounded-xl border border-dashed border-border">
          <Star className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="font-bold text-foreground mb-1">עדיין אין ביקורות למוצר זה</p>
          <p className="text-sm text-muted-foreground">היו הראשונים לשתף את החוויה שלכם!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <article key={r.id} className="bg-card rounded-xl p-4 border border-border">
              <header className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-foreground">{r.reviewer_name}</span>
                    {r.is_verified_purchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[hsl(142,70%,35%)] bg-[hsl(142,70%,35%)]/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        רכישה מאומתת
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                    <time className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("he-IL")}
                    </time>
                  </div>
                </div>
              </header>
              {r.title && <h3 className="font-bold text-sm text-foreground mb-1">{r.title}</h3>}
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{r.content}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

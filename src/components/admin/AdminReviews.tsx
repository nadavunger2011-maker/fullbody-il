import { useEffect, useState } from "react";
import { Star, Check, Trash2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PendingReview {
  id: string;
  product_handle: string;
  reviewer_name: string;
  reviewer_email: string | null;
  rating: number;
  title: string | null;
  content: string;
  is_approved: boolean;
  is_verified_purchase: boolean;
  created_at: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");

  const fetchReviews = async () => {
    setLoading(true);
    let query = supabase
      .from("product_reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (filter === "pending") query = query.eq("is_approved", false);
    if (filter === "approved") query = query.eq("is_approved", true);
    const { data, error } = await query;
    if (!error && data) setReviews(data as PendingReview[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const approve = async (id: string, mark_verified = false) => {
    const { error } = await supabase
      .from("product_reviews")
      .update({ is_approved: true, is_verified_purchase: mark_verified })
      .eq("id", id);
    if (error) {
      toast.error("שגיאה באישור");
      return;
    }
    toast.success("הביקורת אושרה");
    fetchReviews();
  };

  const remove = async (id: string) => {
    if (!confirm("למחוק את הביקורת לצמיתות?")) return;
    const { error } = await supabase.from("product_reviews").delete().eq("id", id);
    if (error) {
      toast.error("שגיאה במחיקה");
      return;
    }
    toast.success("נמחק");
    fetchReviews();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {(["pending", "approved", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filter === f ? "bg-blue-500 text-white" : "bg-white/[0.05] text-gray-400 hover:text-white"
              }`}
            >
              {f === "pending" ? "ממתינות" : f === "approved" ? "מאושרות" : "הכל"}
            </button>
          ))}
        </div>
        <button onClick={fetchReviews} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
          <RefreshCw className="w-3 h-3" /> רענן
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm py-8 text-center">טוען...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 text-sm py-12 text-center bg-white/[0.03] rounded-xl">
          אין ביקורות {filter === "pending" ? "ממתינות לאישור" : filter === "approved" ? "מאושרות" : ""}.
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-white text-sm">{r.reviewer_name}</span>
                    <span className="text-xs text-gray-500">{r.reviewer_email}</span>
                    {r.is_approved && (
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">מאושר</span>
                    )}
                    {!r.is_approved && (
                      <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">ממתין</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(r.created_at).toLocaleDateString("he-IL")} • מוצר: {r.product_handle}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!r.is_approved && (
                    <>
                      <button
                        onClick={() => approve(r.id, false)}
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> אשר
                      </button>
                      <button
                        onClick={() => approve(r.id, true)}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-lg"
                      >
                        אשר + מאומת
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => remove(r.id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium px-3 py-1.5 rounded-lg"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              {r.title && <p className="font-bold text-white text-sm mb-1">{r.title}</p>}
              <p className="text-sm text-gray-300 whitespace-pre-line">{r.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

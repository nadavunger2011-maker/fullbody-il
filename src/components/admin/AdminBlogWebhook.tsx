import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Save, Send, Webhook, CheckCircle2, ExternalLink } from 'lucide-react';

interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  published: boolean;
  date: string;
}

const PUBLIC_BASE_URL = 'https://fullbody.co.il';

export default function AdminBlogWebhook() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [initialUrl, setInitialUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [sendingId, setSendingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    const [{ data: setting }, { data: postsData }] = await Promise.all([
      (supabase as any)
        .from('app_settings')
        .select('value')
        .eq('key', 'blog_webhook_url')
        .maybeSingle(),
      (supabase as any)
        .from('blog_posts')
        .select('id, slug, title, image, published, date')
        .eq('published', true)
        .order('date', { ascending: false })
        .limit(200),
    ]);

    const url = setting?.value || '';
    setWebhookUrl(url);
    setInitialUrl(url);
    setPosts(postsData || []);
    setIsLoading(false);
  }

  async function saveWebhookUrl() {
    setIsSaving(true);
    const { error } = await (supabase as any)
      .from('app_settings')
      .upsert(
        { key: 'blog_webhook_url', value: webhookUrl.trim(), updated_at: new Date().toISOString() },
        { onConflict: 'key' },
      );
    setIsSaving(false);

    if (error) {
      toast.error('שמירת כתובת ה-Webhook נכשלה');
      return;
    }
    setInitialUrl(webhookUrl.trim());
    toast.success('כתובת ה-Webhook נשמרה בהצלחה');
  }

  async function sendToSocial(postId: string, title: string) {
    if (!initialUrl.trim()) {
      toast.error('יש להגדיר ולשמור כתובת Webhook לפני שליחה');
      return;
    }
    setSendingId(postId);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/blog-social-webhook`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ post_id: postId }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(`שליחה נכשלה: ${data.error || response.status}`);
      } else {
        toast.success(`"${title}" נשלח לרשתות החברתיות בהצלחה`);
      }
    } catch (e) {
      toast.error('שגיאה בחיבור לשרת');
    } finally {
      setSendingId(null);
    }
  }

  const isDirty = webhookUrl.trim() !== initialUrl.trim();

  return (
    <div className="space-y-6" dir="rtl">
      {/* Webhook Settings */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Webhook className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold">הגדרות Webhook לאוטומציה ברשתות חברתיות</h3>
            <p className="text-xs text-gray-500">
              כתובת היעד אליה יישלח בקשת POST בכל פרסום מאמר חדש
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            dir="ltr"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://hooks.zapier.com/..."
            className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-400/50"
          />
          <button
            onClick={saveWebhookUrl}
            disabled={isSaving || !isDirty}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-2.5 px-5 rounded-lg text-sm transition flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            שמור כתובת
          </button>
        </div>
        {initialUrl && !isDirty && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-green-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> כתובת פעילה ושמורה
          </div>
        )}
      </div>

      {/* Published posts list */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-bold mb-1">מאמרים מפורסמים</h3>
        <p className="text-xs text-gray-500 mb-4">
          שלח ידנית מאמר קיים לרשתות החברתיות דרך ה-Webhook
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">אין מאמרים מפורסמים</p>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-3 bg-white/[0.02] rounded-lg p-3 border border-white/5"
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt=""
                    loading="lazy"
                    className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-white/[0.04] flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{post.title}</p>
                  <a
                    href={`${PUBLIC_BASE_URL}/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-indigo-400 inline-flex items-center gap-1 truncate"
                  >
                    /blog/{post.slug} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <button
                  onClick={() => sendToSocial(post.id, post.title)}
                  disabled={sendingId === post.id}
                  className="bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg text-xs transition flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                >
                  {sendingId === post.id ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> שולח...</>
                  ) : (
                    <><Send className="w-3.5 h-3.5" /> שלח לרשתות</>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

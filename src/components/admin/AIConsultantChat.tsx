import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Send, Sparkles, Loader2, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type Msg = { role: 'user' | 'assistant'; content: string };

const SUGGESTIONS = [
  'מה הדבר הכי דחוף לשפר באתר עכשיו?',
  'איך אני משפר את שיעור ההמרה?',
  'איזה מוצר הכי לא מתפקד טוב ולמה?',
  'איך אני מוריד את עלות הרכישה (CAC)?',
  'איפה אנשים נוטשים הכי הרבה ומה אפשר לעשות?',
];

interface Props {
  dateRange: string;
}

export default function AIConsultantChat({ dateRange }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const newMessages: Msg[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMessages([...newMessages, { role: 'assistant', content: '❌ צריך להיות מחובר.' }]);
        return;
      }
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-consultant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ messages: newMessages, dateRange }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setMessages([...newMessages, { role: 'assistant', content: `❌ ${data.error || 'שגיאה'}` }]);
        return;
      }
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: '❌ שגיאת רשת' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl flex flex-col h-[70vh] min-h-[500px]">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">יועץ AI אישי</h3>
            <p className="text-[11px] text-gray-500">מתייעץ איתך לפי הנתונים שלך ({dateRange})</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> שיחה חדשה
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-3">
              <MessageSquare className="w-6 h-6 text-pink-400" />
            </div>
            <h4 className="text-sm font-semibold mb-1">שלום 👋 אני היועץ שלך</h4>
            <p className="text-xs text-gray-500 mb-5">שאל אותי כל שאלה על האתר, השיווק, המוצרים או הביצועים</p>
            <div className="flex flex-col gap-2 max-w-md mx-auto">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="text-right text-xs bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 rounded-lg px-3 py-2 transition">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              m.role === 'user'
                ? 'bg-blue-500 text-white rounded-tr-sm'
                : 'bg-white/[0.06] text-gray-100 rounded-tl-sm'
            }`}>
              {m.role === 'assistant' ? (
                <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{m.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-pink-400" />
              <span className="text-xs text-gray-400">חושב...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/5">
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="שאל את היועץ..."
            disabled={loading}
            className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pink-500/50 disabled:opacity-50"
          />
          <button type="submit" disabled={loading || !input.trim()}
            className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2.5 flex items-center gap-1.5 text-sm font-medium transition">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

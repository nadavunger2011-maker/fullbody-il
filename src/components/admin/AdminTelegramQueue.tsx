import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Row = { id: string; title: string; scheduled_for: string; status: string; error: string | null; telegram_message_id: number | null };
const CHANNEL = import.meta.env.VITE_TELEGRAM_CHANNEL_USERNAME as string | undefined;

export default function AdminTelegramQueue() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    supabase.from('telegram_posts').select('id,title,scheduled_for,status,error,telegram_message_id')
      .order('scheduled_for', { ascending: false }).limit(200)
      .then(({ data, error }) => { if (error) setErr(error.message); else setRows(data as Row[]); });
  }, []);
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
      <h3 className="text-sm font-semibold mb-1">תור טלגרם</h3>
      <p className="text-[11px] text-gray-500 mb-4">פוסט אחד לכל היותר בכל הרצה, ולפחות 3 שעות בין פרסומים</p>
      {err ? <p className="text-xs text-red-400">{err}</p> : !rows ? <p className="text-xs text-gray-500">טוען…</p> : rows.length === 0 ? <p className="text-xs text-gray-500">אין פוסטים בתור.</p> : (
        <table className="w-full text-xs">
          <thead><tr className="text-gray-500 text-right"><th className="pb-2 font-medium">כותרת</th><th className="pb-2 font-medium">מתוזמן</th><th className="pb-2 font-medium">סטטוס</th><th className="pb-2 font-medium">שגיאה</th><th className="pb-2 font-medium">הודעה</th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t border-white/5">
                <td className="py-2 pl-2">{r.title}</td>
                <td className="py-2" dir="ltr">{new Date(r.scheduled_for).toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })}</td>
                <td className="py-2">{r.status}</td>
                <td className="py-2 text-red-400 max-w-[240px] truncate" title={r.error ?? ''}>{r.error ?? '—'}</td>
                <td className="py-2">{r.telegram_message_id ? (CHANNEL ? <a className="text-blue-400 underline" href={`https://t.me/${CHANNEL.replace(/^@/, '')}/${r.telegram_message_id}`} target="_blank" rel="noopener noreferrer">#{r.telegram_message_id}</a> : `#${r.telegram_message_id}`) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

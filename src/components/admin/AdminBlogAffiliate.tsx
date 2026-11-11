import { summarizeBlog } from '@/lib/outboundClicks';

type Summary = ReturnType<typeof summarizeBlog>;

export default function AdminBlogAffiliate({ summary }: { summary: Summary }) {
  const articles = summary.pages.filter(p => p.path.startsWith('/blog/')).slice(0, 25);
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-1">מאמרים: צפיות ולחיצות iHerb</h3>
        <p className="text-[11px] text-gray-500 mb-4">לחיצות על קישורי iHerb לפי המאמר שממנו יצאו</p>
        {articles.length === 0 ? <p className="text-xs text-gray-500">אין עדיין נתונים בטווח הזה.</p> : (
          <table className="w-full text-xs">
            <thead><tr className="text-gray-500 text-right"><th className="pb-2 font-medium">מאמר</th><th className="pb-2 font-medium">צפיות</th><th className="pb-2 font-medium">לחיצות</th><th className="pb-2 font-medium">יחס</th></tr></thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.path} className="border-t border-white/5">
                  <td className="py-2 pl-2 max-w-[220px] truncate" dir="ltr" title={a.path}>{decodeURIComponent(a.path.replace('/blog/', ''))}</td>
                  <td className="py-2">{a.views.toLocaleString()}</td>
                  <td className="py-2 font-semibold text-emerald-400">{a.clicks.toLocaleString()}</td>
                  <td className="py-2 text-gray-400">{a.views ? `${((a.clicks / a.views) * 100).toFixed(1)}%` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-1">הקישורים הכי נלחצים</h3>
        <p className="text-[11px] text-gray-500 mb-4">מוצרי iHerb שהמבקרים לחצו עליהם</p>
        {summary.links.length === 0 ? <p className="text-xs text-gray-500">המעקב אחרי לחיצות התחיל עכשיו – נתונים יופיעו אחרי הפרסום.</p> : (
          <ul className="space-y-2 text-xs">
            {summary.links.slice(0, 20).map(l => (
              <li key={l.href} className="flex items-center justify-between gap-3 border-t border-white/5 pt-2">
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="truncate text-blue-300 hover:underline" title={l.href}>{l.text || l.href}</a>
                <span className="font-semibold text-emerald-400 shrink-0">{l.clicks}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

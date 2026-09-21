import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, Download, MessageCircle, Mail, Calendar, ShoppingBag, Eye, UserCheck, RefreshCw, Layers } from 'lucide-react';
import { toast } from 'sonner';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  created_at: string;
}

interface AnalyticsEvent {
  id: string;
  event_type: string;
  user_email?: string;
  user_phone?: string;
  user_name?: string;
  product_title?: string;
  product_handle?: string;
  price?: number;
  created_at: string;
  page_path?: string;
}

export default function AdminLeadsTimeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'abandoned' | 'viewers' | 'purchased'>('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Leads
      const { data: leadsData } = await supabase
        .from('leads' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(300);

      // Fetch only meaningful, identity-bearing events (skip the huge anonymous page_view noise)
      const { data: identifiedEvents } = await supabase
        .from('analytics_events' as any)
        .select('*')
        .not('user_email', 'is', null)
        .in('event_type', ['view_item', 'add_to_cart', 'checkout_started', 'purchase', 'lead_conversion'])
        .order('created_at', { ascending: false })
        .limit(5000);

      // Fetch all purchases (including Shopify webhook orders without a site lead)
      const { data: purchaseEvents } = await supabase
        .from('analytics_events' as any)
        .select('*')
        .eq('event_type', 'purchase')
        .order('created_at', { ascending: false })
        .limit(2000);

      const merged = [...((identifiedEvents as any[]) || []), ...((purchaseEvents as any[]) || [])];
      const dedup = Array.from(new Map(merged.map((e: any) => [e.id, e])).values());

      setLeads((leadsData as any) || []);
      setEvents(dedup as any);
    } catch (e) {
      console.error('Error fetching admin leads timeline:', e);
      toast.error('שגיאה שטעינת הנתונים');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Map events per user email
  const eventsByEmail = React.useMemo(() => {
    const map: Record<string, AnalyticsEvent[]> = {};
    events.forEach((ev) => {
      const email = (ev.user_email || '').toLowerCase().trim();
      if (!email) return;
      if (!map[email]) map[email] = [];
      map[email].push(ev);
    });
    return map;
  }, [events]);

  // Buyers that came straight from Shopify without ever filling a form on the site
  const allLeads = React.useMemo(() => {
    const known = new Set(leads.map((l) => (l.email || '').toLowerCase().trim()).filter(Boolean));
    const extra: Lead[] = [];
    const seen = new Set<string>();
    events.forEach((ev) => {
      if (ev.event_type !== 'purchase') return;
      const email = (ev.user_email || '').toLowerCase().trim();
      if (!email || known.has(email) || seen.has(email)) return;
      seen.add(email);
      extra.push({
        id: `shopify_${email}`,
        name: ev.user_name || 'רוכש שופיפיי',
        email,
        phone: ev.user_phone || '',
        created_at: ev.created_at,
      });
    });
    return [...leads, ...extra];
  }, [leads, events]);


  // Filter leads
  const filteredLeads = React.useMemo(() => {
    return leads.filter((lead) => {
      const email = (lead.email || '').toLowerCase().trim();
      const userEvents = eventsByEmail[email] || [];

      // Search match
      const searchMatch =
        !search.trim() ||
        lead.name?.includes(search) ||
        lead.email?.includes(search) ||
        lead.phone?.includes(search);

      if (!searchMatch) return false;

      // Filter segmentation
      if (filter === 'abandoned') {
        const hasAddToCart = userEvents.some((e) => e.event_type === 'add_to_cart');
        const hasPurchase = userEvents.some((e) => e.event_type === 'purchase');
        return hasAddToCart && !hasPurchase;
      }

      if (filter === 'viewers') {
        return userEvents.some((e) => e.event_type === 'view_item');
      }

      if (filter === 'purchased') {
        return userEvents.some((e) => e.event_type === 'purchase');
      }

      return true;
    });
  }, [leads, eventsByEmail, search, filter]);

  // Export CSV for Google Ads Customer Match / Meta Custom Audience
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      toast.error('אין לידים לייצוא');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'CreatedAt', 'Segment', 'EventsCount'];
    const rows = filteredLeads.map((l) => {
      const email = (l.email || '').toLowerCase().trim();
      const evs = eventsByEmail[email] || [];
      return [
        `"${l.name || ''}"`,
        `"${l.email || ''}"`,
        `"${l.phone || ''}"`,
        `"${l.created_at || ''}"`,
        `"${filter}"`,
        evs.length,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fullbody_leads_segment_${filter}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('קובץ CSV יוצא בהצלחה לקמפיינים!');
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-[hsl(142,70%,35%)]" />
            <h2 className="text-2xl font-black text-foreground">In-House Flashy: דאשבורד לידים וציר זמן</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            מעקב מלא אחר התנהגות משתמשים: צפיות במוצרים, נטישת עגלה ורכישות עם לייצוא לקמפיינים
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl border border-border text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>רענן</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-[hsl(142,70%,35%)] hover:opacity-90 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>ייצא קובץ CSV ל-Google/Meta</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3.5 top-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="חפש לפי שם, אימייל או טלפון..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(142,70%,35%)]"
          />
        </div>

        {/* Segmentation Tabs */}
        <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border w-full sm:w-auto overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'all' ? 'bg-[hsl(142,70%,35%)] text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            כל הלידים ({leads.length})
          </button>
          <button
            onClick={() => setFilter('abandoned')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'abandoned' ? 'bg-amber-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            🛒 נטשו עגלה
          </button>
          <button
            onClick={() => setFilter('viewers')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'viewers' ? 'bg-blue-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            👀 צפו במוצרים
          </button>
          <button
            onClick={() => setFilter('purchased')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'purchased' ? 'bg-emerald-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            ✅ רוכשים
          </button>
        </div>
      </div>

      {/* Timeline Lead Cards List */}
      <div className="space-y-3">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm font-bold border border-dashed border-border rounded-xl">
            לא נמצאו לידים בסגמנט זה
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const email = (lead.email || '').toLowerCase().trim();
            const userEvents = eventsByEmail[email] || [];
            const whatsappClean = (lead.phone || '').replace(/\D/g, '');
            const whatsappLink = `https://wa.me/972${whatsappClean.replace(/^0/, '')}?text=${encodeURIComponent(
              `היי ${lead.name || ''}, ראיתי שהתעניינת במוצרי הרבלייף באתר FullBody! אשמח לעזור לך להתאים את הערכה המדויקת עבורך.`
            )}`;

            return (
              <div key={lead.id} className="bg-background border border-border rounded-xl p-4 hover:border-[hsl(142,70%,35%)]/50 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/50 pb-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base text-foreground">{lead.name || 'אורח'}</span>
                      <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                        {userEvents.length} אירועים במערכת
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{lead.email}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(lead.created_at).toLocaleDateString('he-IL')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {lead.phone && (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>שלח WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Behavioral Timeline Events */}
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground block mb-1.5">היסטוריית פעילות באתר:</span>
                  {userEvents.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic">הרשם לטופס/קופון (אין פעילות צפייה נוספת מתועדת)</span>
                  ) : (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {userEvents.map((ev, idx) => {
                        if (ev.event_type === 'add_to_cart') {
                          return (
                            <span key={idx} className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                              <ShoppingBag className="w-3.5 h-3.5" />
                              הוסיף לעגלה: {ev.product_title || 'מוצר'} (₪{ev.price || 0})
                            </span>
                          );
                        }

                        if (ev.event_type === 'view_item') {
                          return (
                            <span key={idx} className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              צפה במוצר: {ev.product_title || 'מוצר'}
                            </span>
                          );
                        }

                        if (ev.event_type === 'purchase') {
                          return (
                            <span key={idx} className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-lg font-black flex items-center gap-1">
                              <UserCheck className="w-3.5 h-3.5" />
                              רכש מוצר: {ev.product_title || 'הזמנה'} (₪{ev.price || 0})
                            </span>
                          );
                        }

                        return (
                          <span key={idx} className="bg-secondary text-muted-foreground px-2 py-1 rounded-lg text-[11px]">
                            {ev.event_type} ({ev.page_path || ''})
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

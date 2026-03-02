import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart3, Eye, ShoppingCart, CreditCard, TrendingUp, Users, 
  LogOut, Loader2, Calendar, Plus, Trash2, DollarSign, MousePointer,
  Globe, ArrowUpRight, ArrowDownRight, Package, Brain, Sparkles, Clock
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import ReactMarkdown from 'react-markdown';

type DateRange = '7d' | '30d' | '90d' | 'all';

interface EventRow {
  event_type: string;
  product_handle: string | null;
  product_title: string | null;
  product_id: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  created_at: string;
  price: number | null;
  quantity: number | null;
  order_total: number | null;
  order_id: string | null;
  session_id: string | null;
  page_path: string | null;
}

interface AdSpendRow {
  id: string;
  date: string;
  source: string;
  campaign: string | null;
  spend: number;
  impressions: number;
  clicks: number;
  currency: string;
  notes: string | null;
}

const COLORS = ['hsl(0,72%,51%)', 'hsl(210,60%,50%)', 'hsl(45,90%,50%)', 'hsl(140,50%,45%)', 'hsl(280,50%,55%)', 'hsl(20,80%,55%)'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [adSpend, setAdSpend] = useState<AdSpendRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'traffic' | 'adspend'>('overview');

  // Ad spend form
  const [newSpend, setNewSpend] = useState({ date: new Date().toISOString().split('T')[0], source: 'google_ads', campaign: '', spend: '', impressions: '', clicks: '', notes: '' });

  useEffect(() => {
    checkAuth();
    fetchData();
  }, [dateRange]);

  async function checkAuth() {
    const { data } = await supabase.auth.getSession();
    if (!data.session) navigate('/admin');
  }

  async function fetchData() {
    setIsLoading(true);
    const since = getDateSince(dateRange);
    
    let eventsQuery = (supabase as any).from('analytics_events').select('*').order('created_at', { ascending: false });
    if (since) eventsQuery = eventsQuery.gte('created_at', since);
    const { data: eventsData } = await eventsQuery.limit(10000);
    
    let spendQuery = (supabase as any).from('ad_spend').select('*').order('date', { ascending: false });
    if (since) spendQuery = spendQuery.gte('date', since.split('T')[0]);
    const { data: spendData } = await spendQuery;

    setEvents(eventsData || []);
    setAdSpend(spendData || []);
    setIsLoading(false);
  }

  function getDateSince(range: DateRange): string | null {
    if (range === 'all') return null;
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString();
  }

  const stats = useMemo(() => {
    const pageViews = events.filter(e => e.event_type === 'page_view').length;
    const productViews = events.filter(e => e.event_type === 'view_item').length;
    const addToCarts = events.filter(e => e.event_type === 'add_to_cart').length;
    const purchases = events.filter(e => e.event_type === 'purchase');
    const uniqueOrders = new Set(purchases.map(p => p.order_id).filter(Boolean));
    const totalRevenue = purchases.reduce((sum, p) => sum + (p.order_total || 0), 0) / Math.max(uniqueOrders.size, 1) * uniqueOrders.size;
    const uniqueRevenue = [...uniqueOrders].reduce((sum, orderId) => {
      const orderEvent = purchases.find(p => p.order_id === orderId);
      return sum + (orderEvent?.order_total || 0);
    }, 0);
    const totalSpend = adSpend.reduce((sum, s) => sum + s.spend, 0);
    const sessions = new Set(events.map(e => e.session_id).filter(Boolean)).size;
    const cac = uniqueOrders.size > 0 ? totalSpend / uniqueOrders.size : 0;
    const conversionRate = sessions > 0 ? (uniqueOrders.size / sessions) * 100 : 0;
    const cartRate = productViews > 0 ? (addToCarts / productViews) * 100 : 0;

    return { pageViews, productViews, addToCarts, purchases: uniqueOrders.size, totalRevenue: uniqueRevenue, totalSpend, sessions, cac, conversionRate, cartRate };
  }, [events, adSpend]);

  const productStats = useMemo(() => {
    const map = new Map<string, { handle: string; title: string; views: number; carts: number; purchases: number; revenue: number }>();
    events.forEach(e => {
      if (!e.product_handle) return;
      if (!map.has(e.product_handle)) {
        map.set(e.product_handle, { handle: e.product_handle, title: e.product_title || e.product_handle, views: 0, carts: 0, purchases: 0, revenue: 0 });
      }
      const p = map.get(e.product_handle)!;
      if (e.event_type === 'view_item') p.views++;
      if (e.event_type === 'add_to_cart') p.carts++;
      if (e.event_type === 'purchase') { p.purchases++; p.revenue += (e.price || 0) * (e.quantity || 1); }
    });
    return [...map.values()].sort((a, b) => b.views - a.views);
  }, [events]);

  const trafficSources = useMemo(() => {
    const map = new Map<string, { source: string; sessions: number; conversions: number }>();
    const sessionSources = new Map<string, string>();
    
    events.forEach(e => {
      if (!e.session_id) return;
      if (!sessionSources.has(e.session_id)) {
        let source = 'ישיר';
        if (e.utm_source) source = e.utm_source;
        else if (e.referrer) {
          try { source = new URL(e.referrer).hostname; } catch { source = e.referrer; }
        }
        sessionSources.set(e.session_id, source);
      }
    });

    sessionSources.forEach((source, sessionId) => {
      if (!map.has(source)) map.set(source, { source, sessions: 0, conversions: 0 });
      map.get(source)!.sessions++;
    });

    const purchaseSessions = new Set(events.filter(e => e.event_type === 'purchase').map(e => e.session_id));
    purchaseSessions.forEach(sid => {
      if (!sid) return;
      const source = sessionSources.get(sid);
      if (source && map.has(source)) map.get(source)!.conversions++;
    });

    return [...map.values()].sort((a, b) => b.sessions - a.sessions);
  }, [events]);

  const dailyData = useMemo(() => {
    const map = new Map<string, { date: string; views: number; carts: number; purchases: number; revenue: number }>();
    events.forEach(e => {
      const d = e.created_at.split('T')[0];
      if (!map.has(d)) map.set(d, { date: d, views: 0, carts: 0, purchases: 0, revenue: 0 });
      const day = map.get(d)!;
      if (e.event_type === 'page_view') day.views++;
      if (e.event_type === 'add_to_cart') day.carts++;
      if (e.event_type === 'purchase') { day.purchases++; day.revenue += e.order_total || 0; }
    });
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  }, [events]);

  async function handleAddSpend(e: React.FormEvent) {
    e.preventDefault();
    await (supabase as any).from('ad_spend').insert({
      date: newSpend.date,
      source: newSpend.source,
      campaign: newSpend.campaign || null,
      spend: parseFloat(newSpend.spend) || 0,
      impressions: parseInt(newSpend.impressions) || 0,
      clicks: parseInt(newSpend.clicks) || 0,
      notes: newSpend.notes || null,
    });
    setNewSpend({ date: new Date().toISOString().split('T')[0], source: 'google_ads', campaign: '', spend: '', impressions: '', clicks: '', notes: '' });
    fetchData();
  }

  async function deleteSpend(id: string) {
    await (supabase as any).from('ad_spend').delete().eq('id', id);
    fetchData();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/admin');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const statCards = [
    { label: 'סשנים', value: stats.sessions.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'צפיות במוצרים', value: stats.productViews.toLocaleString(), icon: Eye, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'הוספות לסל', value: stats.addToCarts.toLocaleString(), icon: ShoppingCart, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'הזמנות', value: stats.purchases.toLocaleString(), icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'הכנסות', value: `₪${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'הוצאות פרסום', value: `₪${stats.totalSpend.toLocaleString()}`, icon: DollarSign, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'עלות פר לקוח (CAC)', value: stats.cac > 0 ? `₪${stats.cac.toFixed(0)}` : '—', icon: MousePointer, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'שיעור המרה', value: `${stats.conversionRate.toFixed(1)}%`, icon: ArrowUpRight, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'סקירה כללית', icon: BarChart3 },
    { id: 'products' as const, label: 'מוצרים', icon: Package },
    { id: 'traffic' as const, label: 'מקורות תנועה', icon: Globe },
    { id: 'adspend' as const, label: 'הוצאות פרסום', icon: DollarSign },
  ];

  return (
    <>
      <Helmet><meta name="robots" content="noindex, nofollow" /><title>Dashboard | FullBody</title></Helmet>
      <div dir="rtl" className="min-h-screen bg-[#0f1117] text-gray-100 font-sans">
        {/* Top bar */}
        <header className="sticky top-0 z-50 bg-[#0f1117]/90 backdrop-blur-lg border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-sm">FullBody Analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-white/5 rounded-lg p-0.5 text-xs">
                {(['7d', '30d', '90d', 'all'] as DateRange[]).map(r => (
                  <button key={r} onClick={() => setDateRange(r)}
                    className={`px-3 py-1.5 rounded-md transition ${dateRange === r ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                    {r === 'all' ? 'הכל' : r === '7d' ? '7 ימים' : r === '30d' ? '30 ימים' : '90 ימים'}
                  </button>
                ))}
              </div>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-white transition"><LogOut className="w-4 h-4" /></button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {statCards.map(s => (
              <div key={s.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:bg-white/[0.05] transition">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <span className="text-xs text-gray-500">{s.label}</span>
                </div>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-white/[0.03] rounded-xl p-1 w-fit">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition ${activeTab === t.id ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                <t.icon className="w-3.5 h-3.5" />{t.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {dailyData.length > 0 && (
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                  <h3 className="text-sm font-semibold mb-4">מגמות יומיות</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dailyData}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCarts" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                      <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={d => d.slice(5)} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #ffffff10', borderRadius: 8, fontSize: 12 }} />
                      <Area type="monotone" dataKey="views" stroke="#3b82f6" fillOpacity={1} fill="url(#colorViews)" name="צפיות" />
                      <Area type="monotone" dataKey="carts" stroke="#f59e0b" fillOpacity={1} fill="url(#colorCarts)" name="הוספות לסל" />
                      <Line type="monotone" dataKey="purchases" stroke="#10b981" strokeWidth={2} dot={false} name="רכישות" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Funnel */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-4">משפך המרה</h3>
                <div className="flex items-end gap-2 justify-center h-48">
                  {[
                    { label: 'סשנים', value: stats.sessions, color: 'bg-blue-500' },
                    { label: 'צפיות', value: stats.productViews, color: 'bg-purple-500' },
                    { label: 'סל', value: stats.addToCarts, color: 'bg-amber-500' },
                    { label: 'רכישות', value: stats.purchases, color: 'bg-emerald-500' },
                  ].map((step, i) => {
                    const maxVal = Math.max(stats.sessions, 1);
                    const h = Math.max((step.value / maxVal) * 160, 8);
                    return (
                      <div key={i} className="flex flex-col items-center gap-2 flex-1">
                        <span className="text-xs font-bold">{step.value.toLocaleString()}</span>
                        <div className={`${step.color} rounded-t-lg w-full max-w-[60px]`} style={{ height: h }} />
                        <span className="text-[10px] text-gray-500">{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium">מוצר</th>
                      <th className="text-center px-4 py-3 text-xs text-gray-500 font-medium">צפיות</th>
                      <th className="text-center px-4 py-3 text-xs text-gray-500 font-medium">הוספות לסל</th>
                      <th className="text-center px-4 py-3 text-xs text-gray-500 font-medium">שיעור סל</th>
                      <th className="text-center px-4 py-3 text-xs text-gray-500 font-medium">רכישות</th>
                      <th className="text-center px-4 py-3 text-xs text-gray-500 font-medium">הכנסה</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productStats.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-gray-500">אין נתונים עדיין</td></tr>
                    ) : productStats.map(p => (
                      <tr key={p.handle} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-medium">{p.title}</td>
                        <td className="text-center px-4 py-3">{p.views}</td>
                        <td className="text-center px-4 py-3">{p.carts}</td>
                        <td className="text-center px-4 py-3">{p.views > 0 ? `${((p.carts / p.views) * 100).toFixed(1)}%` : '—'}</td>
                        <td className="text-center px-4 py-3">{p.purchases}</td>
                        <td className="text-center px-4 py-3">₪{p.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Traffic Tab */}
          {activeTab === 'traffic' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-right px-4 py-3 text-xs text-gray-500">מקור</th>
                      <th className="text-center px-4 py-3 text-xs text-gray-500">סשנים</th>
                      <th className="text-center px-4 py-3 text-xs text-gray-500">המרות</th>
                      <th className="text-center px-4 py-3 text-xs text-gray-500">שיעור</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trafficSources.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-12 text-gray-500">אין נתונים עדיין</td></tr>
                    ) : trafficSources.map(s => (
                      <tr key={s.source} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-medium">{s.source}</td>
                        <td className="text-center px-4 py-3">{s.sessions}</td>
                        <td className="text-center px-4 py-3">{s.conversions}</td>
                        <td className="text-center px-4 py-3">{s.sessions > 0 ? `${((s.conversions / s.sessions) * 100).toFixed(1)}%` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {trafficSources.length > 0 && (
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                  <h3 className="text-sm font-semibold mb-4">התפלגות תנועה</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={trafficSources.slice(0, 6)} dataKey="sessions" nameKey="source" cx="50%" cy="50%" outerRadius={90} innerRadius={50} label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {trafficSources.slice(0, 6).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #ffffff10', borderRadius: 8, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* Ad Spend Tab */}
          {activeTab === 'adspend' && (
            <div className="space-y-6">
              <form onSubmit={handleAddSpend} className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> הוסף הוצאה</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <input type="date" value={newSpend.date} onChange={e => setNewSpend({ ...newSpend, date: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" required />
                  <select value={newSpend.source} onChange={e => setNewSpend({ ...newSpend, source: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                    <option value="google_ads">Google Ads</option>
                    <option value="facebook_ads">Facebook Ads</option>
                    <option value="instagram_ads">Instagram Ads</option>
                    <option value="tiktok_ads">TikTok Ads</option>
                    <option value="other">אחר</option>
                  </select>
                  <input type="text" placeholder="קמפיין" value={newSpend.campaign} onChange={e => setNewSpend({ ...newSpend, campaign: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                  <input type="number" placeholder="הוצאה (₪)" value={newSpend.spend} onChange={e => setNewSpend({ ...newSpend, spend: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" required />
                  <input type="number" placeholder="חשיפות" value={newSpend.impressions} onChange={e => setNewSpend({ ...newSpend, impressions: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                  <input type="number" placeholder="קליקים" value={newSpend.clicks} onChange={e => setNewSpend({ ...newSpend, clicks: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                  <input type="text" placeholder="הערות" value={newSpend.notes} onChange={e => setNewSpend({ ...newSpend, notes: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm col-span-2 md:col-span-1" />
                  <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition">הוסף</button>
                </div>
              </form>

              <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-right px-4 py-3 text-xs text-gray-500">תאריך</th>
                      <th className="text-right px-4 py-3 text-xs text-gray-500">מקור</th>
                      <th className="text-right px-4 py-3 text-xs text-gray-500">קמפיין</th>
                      <th className="text-center px-4 py-3 text-xs text-gray-500">הוצאה</th>
                      <th className="text-center px-4 py-3 text-xs text-gray-500">חשיפות</th>
                      <th className="text-center px-4 py-3 text-xs text-gray-500">קליקים</th>
                      <th className="text-center px-4 py-3 text-xs text-gray-500">CPC</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {adSpend.length === 0 ? (
                      <tr><td colSpan={8} className="text-center py-12 text-gray-500">אין נתונים עדיין</td></tr>
                    ) : adSpend.map(s => (
                      <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="px-4 py-3">{s.date}</td>
                        <td className="px-4 py-3">{s.source}</td>
                        <td className="px-4 py-3">{s.campaign || '—'}</td>
                        <td className="text-center px-4 py-3">₪{s.spend.toLocaleString()}</td>
                        <td className="text-center px-4 py-3">{s.impressions.toLocaleString()}</td>
                        <td className="text-center px-4 py-3">{s.clicks.toLocaleString()}</td>
                        <td className="text-center px-4 py-3">{s.clicks > 0 ? `₪${(s.spend / s.clicks).toFixed(2)}` : '—'}</td>
                        <td className="px-2 py-3">
                          <button onClick={() => deleteSpend(s.id)} className="text-gray-500 hover:text-red-400 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

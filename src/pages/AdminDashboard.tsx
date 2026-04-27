import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart3, Eye, ShoppingCart, CreditCard, TrendingUp, Users, 
  LogOut, Loader2, Calendar, Plus, Trash2, DollarSign, MousePointer,
  Globe, ArrowUpRight, ArrowDownRight, Package, Brain, Sparkles, Clock, Key, Copy, Check, Star
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import AdminReviews from '@/components/admin/AdminReviews';

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
  exit_destination: string | null;
  is_returning_visitor: boolean | null;
  duration_seconds: number | null;
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
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'traffic' | 'funnel' | 'adspend' | 'ai' | 'api' | 'reviews'>('overview');
  const [apiCredentials, setApiCredentials] = useState<{ supabase_url: string; service_role_key: string; anon_key: string } | null>(null);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [socialCaptionStatus, setSocialCaptionStatus] = useState<string>('');
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [faqGenStatus, setFaqGenStatus] = useState<string>('');
  const [isFaqGenLoading, setIsFaqGenLoading] = useState(false);

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

  // Funnel analysis data
  const funnelData = useMemo(() => {
    // Session-level funnel: track highest stage reached per session
    const sessionStages = new Map<string, { maxStage: number; isReturning: boolean }>();
    events.forEach(e => {
      if (!e.session_id) return;
      const current = sessionStages.get(e.session_id) || { maxStage: 0, isReturning: e.is_returning_visitor || false };
      if (e.event_type === 'page_view' && current.maxStage < 1) current.maxStage = 1;
      if (e.event_type === 'view_item' && current.maxStage < 2) current.maxStage = 2;
      if (e.event_type === 'add_to_cart' && current.maxStage < 3) current.maxStage = 3;
      if (e.event_type === 'checkout_started' && current.maxStage < 4) current.maxStage = 4;
      if (e.event_type === 'purchase' && current.maxStage < 5) current.maxStage = 5;
      if (e.is_returning_visitor) current.isReturning = true;
      sessionStages.set(e.session_id, current);
    });

    const stages = [
      { label: 'סשנים', stage: 1 },
      { label: 'צפייה במוצר', stage: 2 },
      { label: 'הוספה לסל', stage: 3 },
      { label: 'התחלת צ׳קאאוט', stage: 4 },
      { label: 'רכישה', stage: 5 },
    ];

    const funnelSteps = stages.map(s => {
      const total = [...sessionStages.values()].filter(v => v.maxStage >= s.stage).length;
      const returning = [...sessionStages.values()].filter(v => v.maxStage >= s.stage && v.isReturning).length;
      const newVisitors = total - returning;
      return { ...s, total, returning, new: newVisitors };
    });

    // Exit analysis: where do product page visitors go?
    const exitCounts = new Map<string, number>();
    events.filter(e => (e.event_type === 'product_duration' || e.event_type === 'product_exit') && e.exit_destination)
      .forEach(e => {
        const dest = e.exit_destination!;
        exitCounts.set(dest, (exitCounts.get(dest) || 0) + 1);
      });
    const exitLabels: Record<string, string> = {
      'site_exit': 'עזיבת האתר',
      'another_product': 'מוצר אחר',
      'other_page': 'עמוד אחר',
      'cart': 'עגלה',
      'checkout': 'צ׳קאאוט',
    };
    const exitData = [...exitCounts.entries()]
      .map(([dest, count]) => ({ destination: exitLabels[dest] || dest, count }))
      .sort((a, b) => b.count - a.count);

    // Average time on product pages
    const durationEvents = events.filter(e => e.event_type === 'product_duration' && e.duration_seconds != null && e.duration_seconds > 0);
    const avgDuration = durationEvents.length > 0
      ? durationEvents.reduce((sum, e) => sum + (e.duration_seconds || 0), 0) / durationEvents.length
      : 0;

    // Per-product duration
    const productDurations = new Map<string, { handle: string; title: string; totalDuration: number; count: number }>();
    durationEvents.forEach(e => {
      if (!e.product_handle) return;
      const p = productDurations.get(e.product_handle) || { handle: e.product_handle, title: e.product_title || e.product_handle, totalDuration: 0, count: 0 };
      p.totalDuration += e.duration_seconds || 0;
      p.count++;
      productDurations.set(e.product_handle, p);
    });
    const productDurationList = [...productDurations.values()]
      .map(p => ({ ...p, avgDuration: p.totalDuration / p.count }))
      .sort((a, b) => b.avgDuration - a.avgDuration);

    // New vs returning overall
    const totalSessions = sessionStages.size;
    const returningSessions = [...sessionStages.values()].filter(v => v.isReturning).length;
    const newSessions = totalSessions - returningSessions;

    // Drop-off between stages
    const dropoffs = funnelSteps.slice(0, -1).map((step, i) => {
      const next = funnelSteps[i + 1];
      const dropped = step.total - next.total;
      const rate = step.total > 0 ? (dropped / step.total) * 100 : 0;
      return { from: step.label, to: next.label, dropped, rate };
    });

    return { funnelSteps, exitData, avgDuration, productDurationList, totalSessions, returningSessions, newSessions, dropoffs };
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


  async function generateSocialCaptions() {
    setIsSocialLoading(true);
    setSocialCaptionStatus('מתחיל לייצר כיתובים לרשתות חברתיות...');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-social-captions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });
      const data = await response.json();
      if (data.error) {
        setSocialCaptionStatus(`❌ שגיאה: ${data.error}`);
      } else {
        setSocialCaptionStatus(`✅ עודכנו ${data.updated} מתוך ${data.total} מאמרים`);
      }
    } catch (e) {
      setSocialCaptionStatus('❌ שגיאה בחיבור');
    } finally {
      setIsSocialLoading(false);
    }
  }

  async function generateFaqPosts() {
    setIsFaqGenLoading(true);
    setFaqGenStatus('מייצר פוסטים קצרים מבוססי שאלות...');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-blog-posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ count: 5, mode: 'faq' }),
      });
      const data = await response.json();
      if (data.error) {
        setFaqGenStatus(`❌ שגיאה: ${data.error}`);
      } else {
        setFaqGenStatus(`✅ נוצרו ${data.generated} פוסטים קצרים מבוססי שאלות`);
      }
    } catch (e) {
      setFaqGenStatus('❌ שגיאה בחיבור');
    } finally {
      setIsFaqGenLoading(false);
    }
  }

  const tabs = [
    { id: 'overview' as const, label: 'סקירה כללית', icon: BarChart3 },
    { id: 'funnel' as const, label: 'משפך ונטישה', icon: Users },
    { id: 'products' as const, label: 'מוצרים', icon: Package },
    { id: 'reviews' as const, label: 'ביקורות', icon: Star },
    { id: 'traffic' as const, label: 'מקורות תנועה', icon: Globe },
    { id: 'adspend' as const, label: 'הוצאות פרסום', icon: DollarSign },
    { id: 'ai' as const, label: 'ניתוח AI', icon: Brain },
    { id: 'api' as const, label: 'API Keys', icon: Key },
  ];

  async function fetchAiAnalysis() {
    setIsAiLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analytics-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ dateRange }),
      });
      
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        setAiAnalysis(`❌ שגיאה: ${err.error || 'לא הצלחתי לנתח'}`);
        return;
      }
      
      const data = await response.json();
      setAiAnalysis(data.analysis);
    } catch (e) {
      setAiAnalysis('❌ שגיאה בחיבור ל-AI');
    } finally {
      setIsAiLoading(false);
    }
  }

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

          {/* Funnel & Abandonment Tab */}
          {activeTab === 'funnel' && (
            <div className="space-y-6">
              {/* Full Funnel */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" /> משפך המרה מלא — מהצפייה ועד הרכישה
                </h3>
                <div className="flex items-end gap-2 justify-center h-56">
                  {funnelData.funnelSteps.map((step, i) => {
                    const maxVal = Math.max(funnelData.funnelSteps[0]?.total || 1, 1);
                    const h = Math.max((step.total / maxVal) * 200, 12);
                    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-orange-500', 'bg-emerald-500'];
                    const prevTotal = i > 0 ? funnelData.funnelSteps[i - 1].total : step.total;
                    const dropRate = prevTotal > 0 ? ((prevTotal - step.total) / prevTotal * 100).toFixed(0) : '0';
                    return (
                      <div key={i} className="flex flex-col items-center gap-1 flex-1">
                        <span className="text-xs font-bold">{step.total.toLocaleString()}</span>
                        {i > 0 && <span className="text-[9px] text-red-400">-{dropRate}%</span>}
                        <div className={`${colors[i]} rounded-t-lg w-full max-w-[60px] relative`} style={{ height: h }}>
                          {step.returning > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-white/20 rounded-t-sm" style={{ height: Math.max((step.returning / step.total) * h, 2) }} />
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500 text-center">{step.label}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-500 justify-center">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> צבע מלא = חדשים</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500/40 inline-block" /> בהיר = חוזרים</span>
                </div>
              </div>

              {/* Drop-off table */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/5">
                  <h3 className="text-sm font-semibold flex items-center gap-2"><ArrowDownRight className="w-4 h-4 text-red-400" /> נקודות נטישה</h3>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-right px-4 py-3 text-xs text-gray-500">מ-</th>
                      <th className="text-right px-4 py-3 text-xs text-gray-500">אל</th>
                      <th className="text-center px-4 py-3 text-xs text-gray-500">נטשו</th>
                      <th className="text-center px-4 py-3 text-xs text-gray-500">שיעור נטישה</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funnelData.dropoffs.map((d, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="px-4 py-3">{d.from}</td>
                        <td className="px-4 py-3">{d.to}</td>
                        <td className="text-center px-4 py-3 text-red-400">{d.dropped.toLocaleString()}</td>
                        <td className="text-center px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${d.rate > 70 ? 'bg-red-500/20 text-red-400' : d.rate > 40 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {d.rate.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Exit destinations */}
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-orange-400" /> לאן נטשו מדף מוצר?
                  </h3>
                  {funnelData.exitData.length === 0 ? (
                    <p className="text-center py-8 text-gray-500 text-xs">אין נתוני נטישה עדיין — ייאספו בקרוב</p>
                  ) : (
                    <div className="space-y-2">
                      {funnelData.exitData.map((ex, i) => {
                        const maxCount = funnelData.exitData[0]?.count || 1;
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-xs text-gray-400 w-24 text-right">{ex.destination}</span>
                            <div className="flex-1 bg-white/5 rounded-full h-5 overflow-hidden">
                              <div className="h-full bg-orange-500/60 rounded-full flex items-center justify-end px-2" style={{ width: `${(ex.count / maxCount) * 100}%` }}>
                                <span className="text-[10px] font-bold">{ex.count}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* New vs Returning */}
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" /> לקוחות חדשים מול חוזרים
                  </h3>
                  <div className="flex items-center gap-6 justify-center mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-400">{funnelData.newSessions}</p>
                      <p className="text-xs text-gray-500">חדשים</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-400">{funnelData.returningSessions}</p>
                      <p className="text-xs text-gray-500">חוזרים</p>
                    </div>
                  </div>
                  {funnelData.totalSessions > 0 && (
                    <div className="flex h-4 rounded-full overflow-hidden bg-white/5">
                      <div className="bg-cyan-500 h-full" style={{ width: `${(funnelData.newSessions / funnelData.totalSessions) * 100}%` }} />
                      <div className="bg-purple-500 h-full" style={{ width: `${(funnelData.returningSessions / funnelData.totalSessions) * 100}%` }} />
                    </div>
                  )}
                  <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                    <span>{funnelData.totalSessions > 0 ? ((funnelData.newSessions / funnelData.totalSessions) * 100).toFixed(0) : 0}% חדשים</span>
                    <span>{funnelData.totalSessions > 0 ? ((funnelData.returningSessions / funnelData.totalSessions) * 100).toFixed(0) : 0}% חוזרים</span>
                  </div>
                </div>
              </div>

              {/* Average dwell time per product */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-sm font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-blue-400" /> זמן שהייה ממוצע בדף מוצר</h3>
                  <span className="text-xs text-gray-500">ממוצע כללי: {funnelData.avgDuration > 0 ? `${funnelData.avgDuration.toFixed(0)} שניות` : '—'}</span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-right px-4 py-3 text-xs text-gray-500">מוצר</th>
                      <th className="text-center px-4 py-3 text-xs text-gray-500">ממוצע שהייה</th>
                      <th className="text-center px-4 py-3 text-xs text-gray-500">מספר צפיות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funnelData.productDurationList.length === 0 ? (
                      <tr><td colSpan={3} className="text-center py-8 text-gray-500 text-xs">אין נתוני זמן שהייה עדיין</td></tr>
                    ) : funnelData.productDurationList.map(p => (
                      <tr key={p.handle} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-medium">{p.title}</td>
                        <td className="text-center px-4 py-3">{p.avgDuration.toFixed(0)} שניות</td>
                        <td className="text-center px-4 py-3">{p.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

          {/* AI Analysis Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              {/* Social Captions Tool */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">כיתובים לרשתות חברתיות</h3>
                      <p className="text-xs text-gray-500">יצירת כיתובי IG / FB / LinkedIn לכל המאמרים החסרים</p>
                    </div>
                  </div>
                  <button
                    onClick={generateSocialCaptions}
                    disabled={isSocialLoading}
                    className="bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-medium py-2.5 px-5 rounded-lg text-sm transition flex items-center gap-2"
                  >
                    {isSocialLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> מעבד...</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> ייצר כיתובים</>
                    )}
                  </button>
                </div>
                {socialCaptionStatus && (
                  <div className="bg-white/[0.02] rounded-lg p-3 border border-white/5 text-sm">{socialCaptionStatus}</div>
                )}
              </div>

              {/* FAQ Short Posts Generator */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">פוסטים קצרים מבוססי שאלות</h3>
                      <p className="text-xs text-gray-500">יצירת 5 מאמרים קצרים מבוססים על שאלות שאנשים שואלים באינטרנט</p>
                    </div>
                  </div>
                  <button
                    onClick={generateFaqPosts}
                    disabled={isFaqGenLoading}
                    className="bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-medium py-2.5 px-5 rounded-lg text-sm transition flex items-center gap-2"
                  >
                    {isFaqGenLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> מייצר...</>
                    ) : (
                      <><Plus className="w-4 h-4" /> ייצר פוסטים</>
                    )}
                  </button>
                </div>
                {faqGenStatus && (
                  <div className="bg-white/[0.02] rounded-lg p-3 border border-white/5 text-sm">{faqGenStatus}</div>
                )}
              </div>

              {/* AI Analysis */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">ניתוח AI חכם</h3>
                      <p className="text-xs text-gray-500">תובנות והמלצות מבוססות נתונים</p>
                    </div>
                  </div>
                  <button
                    onClick={fetchAiAnalysis}
                    disabled={isAiLoading}
                    className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-medium py-2.5 px-5 rounded-lg text-sm transition flex items-center gap-2"
                  >
                    {isAiLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> מנתח...</>
                    ) : (
                      <><Brain className="w-4 h-4" /> נתח עכשיו</>
                    )}
                  </button>
                </div>

                {aiAnalysis ? (
                  <div className="prose prose-sm prose-invert max-w-none bg-white/[0.02] rounded-xl p-5 border border-white/5">
                    <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="text-sm">לחץ על "נתח עכשיו" כדי לקבל תובנות AI על הביצועים שלך</p>
                    <p className="text-xs mt-1 text-gray-600">הניתוח מבוסס על כל הנתונים בטווח התאריכים הנבחר</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="bg-white/[0.03] rounded-2xl border border-white/5 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-yellow-400" /> פרטי חיבור API (n8n / אינטגרציות)
                </h3>
                <p className="text-gray-400 text-sm mb-6">המפתחות הללו נדרשים לחיבור מערכות חיצוניות כמו n8n. שמור אותם במקום בטוח.</p>
                
                {!apiCredentials ? (
                  <button
                    onClick={async () => {
                      setIsApiLoading(true);
                      try {
                        const { data: { session } } = await supabase.auth.getSession();
                        if (!session) return;
                        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-credentials`, {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${session.access_token}`,
                            'Content-Type': 'application/json',
                          },
                        });
                        const data = await res.json();
                        if (data.error) throw new Error(data.error);
                        setApiCredentials(data);
                      } catch (err: any) {
                        alert('שגיאה: ' + err.message);
                      } finally {
                        setIsApiLoading(false);
                      }
                    }}
                    disabled={isApiLoading}
                    className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black font-medium py-2.5 px-5 rounded-lg text-sm transition flex items-center gap-2"
                  >
                    {isApiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                    הצג מפתחות API
                  </button>
                ) : (
                  <div className="space-y-4">
                    {[
                      { label: 'Supabase URL', value: apiCredentials.supabase_url },
                      { label: 'Service Role Key', value: apiCredentials.service_role_key },
                      { label: 'Anon Key', value: apiCredentials.anon_key },
                    ].map((item) => (
                      <div key={item.label} className="bg-black/30 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400 font-medium">{item.label}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(item.value);
                              alert(`${item.label} הועתק!`);
                            }}
                            className="text-gray-400 hover:text-white transition flex items-center gap-1 text-xs"
                          >
                            <Copy className="w-3.5 h-3.5" /> העתק
                          </button>
                        </div>
                        <code className="text-green-400 text-xs break-all block">{item.value}</code>
                      </div>
                    ))}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mt-4">
                      <p className="text-red-400 text-xs">⚠️ <strong>אזהרה:</strong> אל תשתף את ה-Service Role Key עם אף אחד. מפתח זה מעניק גישה מלאה לבסיס הנתונים.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

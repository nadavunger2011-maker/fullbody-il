import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Gift, Sparkles, CheckCircle2, Download, Copy, Check, ArrowRight, ShieldCheck, Mail, Phone, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics';

const STORAGE_KEY = 'fullbody_lead_modal_dismissed';

export default function LeadMagnetModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSubmittingSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const location = useLocation();

  useEffect(() => {
    // Show after 5 seconds on first visit or if not dismissed
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('אנא הזן כתובת אימייל תקינה');
      return;
    }

    if (!phone || phone.length < 9) {
      toast.error('אנא הזן מספר טלפון תקין לקבלת הקופון');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Identify user in localStorage for In-House analytics stitching
      localStorage.setItem('identified_user_email', email);
      localStorage.setItem('identified_user_phone', phone);
      if (name) localStorage.setItem('identified_user_name', name);

      // 2. Insert Lead into Supabase `leads`
      const payload = {
        name: name || 'אורח',
        email,
        phone,
        goal: 'popup_lead_magnet_welcome10',
      };

      const { error: leadError } = await supabase.from('leads' as any).insert(payload as any);
      if (leadError) console.error('Lead insert failed:', leadError);

      // 3. Track lead conversion in our In-House Analytics
      trackEvent({
        event_type: 'lead_conversion',
        page_path: location.pathname,
      });

      // 4. Send Welcome email via Supabase Edge Function if available
      try {
        await supabase.functions.invoke('send-plan-email', {
          body: {
            email,
            name: name || 'לקוח יקר',
            type: 'welcome_discount',
            couponCode: 'WELCOME10',
          },
        });
      } catch (err) {
        console.log('Welcome email trigger sent silently:', err);
      }

      setIsSubmittingSuccess(true);
      toast.success('נרשמת בהצלחה! הקופון והמתנות שלך מוכנים');
    } catch (error) {
      console.error('Lead submission error:', error);
      toast.error('אירעה שגיאה, אנא נסה שוב');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('WELCOME10');
    setCopied(true);
    toast.success('קוד הקופון WELCOME10 הועתק בהצלחה!');
    setTimeout(() => setCopied(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="relative w-full max-w-lg bg-card border-2 border-[hsl(142,70%,35%)] rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 z-10 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all"
          aria-label="סגור"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner - Emerald Brand Identity */}
        <div className="bg-gradient-to-r from-[hsl(142,70%,30%)] via-[hsl(142,70%,38%)] to-[hsl(142,70%,28%)] text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full mb-3 shadow-md uppercase tracking-wider">
            <Gift className="w-4 h-4" /> מתנה בלעדית למצטרפים חדשים
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
            רוצים לרדת במשקל ולחטב את הגוף בלי לרעוב? 🥤
          </h2>
          <p className="text-white/90 text-xs sm:text-sm font-medium">
            הזינו פרטים וקבלו מיידית למייל ול-WhatsApp את ערכת ההתחלה הדיגיטלית:
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 bg-card">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Gift Bullet Checklist */}
              <div className="bg-secondary/40 rounded-2xl p-4 border border-border space-y-2 text-xs font-bold text-foreground">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(142,70%,35%)] shrink-0" />
                  <span>🏷️ קופון 10% הנחה להזמנה הראשונה (<code className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono px-1.5 py-0.5 rounded blur-[3px] select-none pointer-events-none">WELC10</code> <span className="text-[10px] text-emerald-600 font-normal">נחשף מייד לאחר הזנה</span>)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(142,70%,35%)] shrink-0" />
                  <span>📕 ספר מתכוני שייקים וקינוחי חלבון פרימיום (PDF)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(142,70%,35%)] shrink-0" />
                  <span>📘 קטלוג ומחירון מוצרי הרבלייף המעודכן בישראל</span>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute right-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="שם פרטי"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 bg-background border border-border rounded-xl text-sm font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(142,70%,35%)]"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    placeholder="כתובת אימייל *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 bg-background border border-border rounded-xl text-sm font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(142,70%,35%)]"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute right-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    required
                    placeholder="מספר נייד לקבלת הקופון ב-WhatsApp *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 bg-background border border-border rounded-xl text-sm font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(142,70%,35%)]"
                  />
                </div>
              </div>

              {/* Opt-in Consent Checkbox */}
              <label className="flex items-start gap-2.5 text-[11px] text-muted-foreground cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-border text-[hsl(142,70%,35%)] focus:ring-[hsl(142,70%,35%)]"
                />
                <span>אני מאשר לקבל עדכונים, מבצעים בלעדיים ומתכונים במייל וב-WhatsApp (ניתן להסיר בלחיצה בכל עת).</span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !agreed}
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-black py-4 px-6 rounded-2xl text-center transition-all shadow-[0_10px_25px_-5px_rgba(22,163,74,0.5)] hover:shadow-[0_15px_30px_-5px_rgba(22,163,74,0.6)] flex items-center justify-center gap-2 text-base sm:text-lg disabled:opacity-50 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span>שולח את המתנות...</span>
                ) : (
                  <>
                    <span>קבלו את המתנה והקופון בחינם</span>
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>מובטח: ללא ספאם, הפרטים שלך מאובטחים ב-100%</span>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="text-center py-4 space-y-5 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-foreground mb-1">
                  איזה כיף! המתנה בדרך אליך 🎁
                </h3>
                <p className="text-xs text-muted-foreground">
                  שלחנו את קובץ המתכונים והקטלוג לכתובת <strong className="text-foreground">{email}</strong>
                </p>
              </div>

              {/* Coupon Box */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-dashed border-[hsl(142,70%,35%)] rounded-2xl p-4 space-y-2">
                <span className="text-xs font-bold text-muted-foreground block">קוד הקופון שלך ל-10% הנחה:</span>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-2xl font-black text-emerald-700 dark:text-emerald-400 tracking-wider">
                    WELCOME10
                  </span>
                  <button
                    onClick={handleCopyCoupon}
                    className="bg-[hsl(142,70%,35%)] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 hover:opacity-90 transition-all active:scale-95"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'הועתק!' : 'העתק'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <a
                  href="/products"
                  onClick={handleClose}
                  className="block w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-black py-3.5 px-6 rounded-xl text-center text-sm transition-all shadow-md"
                >
                  לצפייה במוצרים ומימוש הקופון בחנות ←
                </a>
                <button
                  onClick={handleClose}
                  className="block w-full text-xs font-bold text-muted-foreground hover:text-foreground py-2"
                >
                  סגור חלונית
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

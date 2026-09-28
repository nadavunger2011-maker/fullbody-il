import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProFooter from '@/components/ProFooter';
import { BUSINESS, STORE_POLICIES } from '@/lib/business';

export default function ProPrivacyPolicy() {
 return <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
  <Helmet><title>מדיניות פרטיות | FullBody</title><meta name="description" content="כיצד FullBody אוספת ומשתמשת במידע שנמסר באתר." /><link rel="canonical" href="https://fullbody.co.il/privacy-policy" /></Helmet>
  <header className="border-b border-border bg-card"><div className="container mx-auto flex h-20 items-center justify-between px-4"><Link to="/" className="text-2xl font-black text-primary">FullBody</Link><Link to="/" className="font-bold text-accent">חזרה לאתר</Link></div></header>
  <main className="container mx-auto max-w-3xl px-4 py-14"><h1 className="mb-8 text-4xl font-black text-primary">מדיניות פרטיות</h1><div className="space-y-6 leading-relaxed text-muted-foreground"><h2 className="text-2xl font-bold text-foreground">המידע שנאסף</h2><p>אנו אוספים מידע שנמסר ביוזמתכם בטפסים, לרבות שם, טלפון ודוא״ל, וכן נתוני שימוש בסיסיים לצורכי תפעול, אבטחה ומדידה.</p><h2 className="text-2xl font-bold text-foreground">שימוש במידע</h2><p>המידע משמש למענה לפניות, אספקת תוכן שביקשתם, שירות לקוחות ושיפור האתר. לא נמכור מידע אישי לצדדים שלישיים.</p><h2 className="text-2xl font-bold text-foreground">רכישה ותשלום</h2><p>רכישת מוצרים והתשלום מתבצעים בחנות Shopify בכתובת shop.fullbody.co.il וכפופים גם למדיניות החנות.</p><h2 className="text-2xl font-bold text-foreground">זכויות ופניות</h2><p>ניתן לפנות אלינו כדי לבקש עיון, תיקון או מחיקה של מידע, בכפוף לדין.</p>
  <section className="rounded-lg border border-border bg-card p-6"><h2 className="mb-3 text-2xl font-bold text-foreground">פרטי העסק</h2><p>{BUSINESS.name}, עוסק מורשה {BUSINESS.taxId}</p><p>{BUSINESS.address} ({BUSINESS.addressNote})</p><p><a className="text-accent underline" href={BUSINESS.phoneHref}>{BUSINESS.phone}</a> · <a className="text-accent underline" href={BUSINESS.emailHref}>{BUSINESS.email}</a></p><p>{BUSINESS.hours}</p></section>
  <section className="rounded-lg border border-border bg-secondary/40 p-6"><h2 className="mb-3 text-2xl font-bold text-foreground">מדיניות החנות</h2><p><a className="text-accent underline" href={STORE_POLICIES.shipping}>מדיניות משלוחים בחנות</a> · <a className="text-accent underline" href={STORE_POLICIES.refund}>מדיניות החזרים בחנות</a></p></section></div></main><ProFooter /></div>;
}

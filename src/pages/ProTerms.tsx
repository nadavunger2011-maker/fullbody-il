import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProFooter from '@/components/ProFooter';
import { BUSINESS, STORE_POLICIES } from '@/lib/business';

export default function ProTerms() {
 return <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
  <Helmet><title>תנאי שימוש | FullBody</title><meta name="description" content="תנאי השימוש באתר התוכן FullBody והמעבר לחנות המקוונת." /><link rel="canonical" href="https://fullbody.co.il/terms-of-use" /></Helmet>
  <header className="border-b border-border bg-card"><div className="container mx-auto flex h-20 items-center justify-between px-4"><Link to="/" className="text-2xl font-black text-primary">FullBody</Link><Link to="/" className="font-bold text-accent">חזרה לאתר</Link></div></header>
  <main className="container mx-auto max-w-3xl px-4 py-14"><h1 className="mb-8 text-4xl font-black text-primary">תנאי שימוש</h1><div className="space-y-6 leading-relaxed text-muted-foreground"><h2 className="text-2xl font-bold text-foreground">השימוש באתר</h2><p>האתר מספק מידע כללי על תזונה, אורח חיים ומוצרי Herbalife. המידע אינו תחליף לייעוץ רפואי או מקצועי אישי.</p><h2 className="text-2xl font-bold text-foreground">רכישות</h2><p>הצגת מוצרים באתר היא לצורכי מידע והפניה. הרכישה, המחיר, המלאי והתשלום מתבצעים בחנות בכתובת shop.fullbody.co.il ובהתאם לתנאי החנות במועד הרכישה.</p><h2 className="text-2xl font-bold text-foreground">אחריות</h2><p>יש לקרוא את תווית המוצר והוראות השימוש. תוצאות השימוש עשויות להשתנות מאדם לאדם.</p>
  <section className="rounded-lg border border-border bg-card p-6"><h2 className="mb-3 text-2xl font-bold text-foreground">פרטי העסק</h2><p>{BUSINESS.name}, עוסק מורשה {BUSINESS.taxId}</p><p>{BUSINESS.address} ({BUSINESS.addressNote})</p><p><a className="text-accent underline" href={BUSINESS.phoneHref}>{BUSINESS.phone}</a> · <a className="text-accent underline" href={BUSINESS.emailHref}>{BUSINESS.email}</a></p><p>{BUSINESS.hours}</p></section>
  <section className="rounded-lg border border-border bg-secondary/40 p-6"><h2 className="mb-3 text-2xl font-bold text-foreground">מדיניות החנות</h2><p><a className="text-accent underline" href={STORE_POLICIES.shipping}>מדיניות משלוחים בחנות</a> · <a className="text-accent underline" href={STORE_POLICIES.refund}>מדיניות החזרים בחנות</a></p></section></div></main><ProFooter /></div>;
}

import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProFooter from '@/components/ProFooter';
import { BUSINESS, STORE_POLICIES } from '@/lib/business';

export default function ProReturnPolicy() {
 return <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
  <Helmet><title>מדיניות החזרות וביטולים | FullBody</title><meta name="description" content="תנאי ביטול עסקה, החזרת מוצרים וטיפול במוצר פגום בהתאם לחוק הגנת הצרכן." /><link rel="canonical" href="https://fullbody.co.il/return-policy" /></Helmet>
  <header className="border-b border-border bg-card"><div className="container mx-auto flex h-20 items-center justify-between px-4"><Link to="/" className="text-2xl font-black text-primary">FullBody</Link><Link to="/" className="font-bold text-accent">חזרה לאתר</Link></div></header>
  <main className="container mx-auto max-w-3xl px-4 py-14"><h1 className="mb-8 text-4xl font-black text-primary">מדיניות החזרות וביטולים</h1><div className="space-y-6 leading-relaxed text-muted-foreground"><h2 className="text-2xl font-bold text-foreground">ביטול והחזרה</h2><p>ניתן לבטל עסקה בתוך 14 יום מקבלת המוצר, בהתאם לחוק הגנת הצרכן. ניתן להחזיר רק מוצרים סגורים ובאריזתם המקורית.</p><h2 className="text-2xl font-bold text-foreground">דמי ביטול</h2><p>בביטול שאינו נובע מפגם, ייגבו דמי ביטול בשיעור 5% ממחיר העסקה או 100 ₪, לפי הנמוך מביניהם.</p><h2 className="text-2xl font-bold text-foreground">מוצר פגום</h2><p>במקרה של מוצר פגום תוצע החלפה או יינתן החזר כספי מלא, כולל עלות המשלוח.</p><p>לפני החזרת מוצר יש לפנות אלינו לקבלת הנחיות. אין להגיע לכתובת המשרד ואין בה קבלת קהל או איסוף עצמי.</p>
  <section className="rounded-lg border border-border bg-card p-6"><h2 className="mb-3 text-2xl font-bold text-foreground">פרטי העסק</h2><p>{BUSINESS.name}, עוסק מורשה {BUSINESS.taxId}</p><p>{BUSINESS.address} ({BUSINESS.addressNote})</p><p><a className="text-accent underline" href={BUSINESS.phoneHref}>{BUSINESS.phone}</a> · <a className="text-accent underline" href={BUSINESS.emailHref}>{BUSINESS.email}</a></p><p>{BUSINESS.hours}</p></section>
  <section className="rounded-lg border border-border bg-secondary/40 p-6"><h2 className="mb-3 text-2xl font-bold text-foreground">מדיניות החנות</h2><p><a className="text-accent underline" href={STORE_POLICIES.shipping}>מדיניות משלוחים בחנות</a> · <a className="text-accent underline" href={STORE_POLICIES.refund}>מדיניות החזרים בחנות</a></p></section></div></main><ProFooter /></div>;
}

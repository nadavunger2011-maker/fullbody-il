import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Truck, Clock, Package } from 'lucide-react';
import ProFooter from '@/components/ProFooter';

export default function ProShippingPolicy() {
  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>משלוחים ואספקה | FullBody - הרבלייף</title>
        <meta name="description" content="מדיניות משלוחים של FullBody. אספקה 2-5 ימי עסקים עם שליח עד הבית, משלוח חינם בהזמנות מעל ₪299, ומספר מעקב למייל ולטלפון." />
        <link rel="canonical" href="https://fullbody.co.il/shipping-policy" />
      </Helmet>

      <header className="sticky top-0 z-40 bg-card shadow-card border-b border-border">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-black text-primary">FullBody</span>
          </Link>
          <Link to="/" className="text-accent font-bold flex items-center gap-2 hover:underline">
            חזרה לחנות
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-black text-primary mb-4">משלוחים ואספקה</h1>
            <p className="text-muted-foreground mb-10">מידע מלא על אפשרויות המשלוח, העלויות וזמני האספקה שלנו.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { icon: Truck, title: "שליח עד הבית", text: "לכל חלקי הארץ" },
                { icon: Clock, title: "זמן אספקה", text: "2-5 ימי עסקים" },
                { icon: Package, title: "משלוח חינם", text: "בהזמנות מעל ₪299" },
              ].map((item, i) => (
                <div key={i} className="bg-card p-6 rounded-xl border border-border text-center">
                  <item.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                  <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">זמני אספקה</h2>
                <div className="text-muted-foreground leading-relaxed space-y-3">
                  <p>אספקה תוך 2 עד 5 ימי עסקים עם שליח עד הבית, לכל חלקי הארץ.</p>
                  <p>באזורים מרוחקים זמן האספקה עשוי להתארך עד 7 ימי עסקים.</p>
                  <p>ימי עסקים אינם כוללים שישי, שבת וחגים.</p>
                  <p>תקבלו מספר מעקב למייל/SMS מיד עם יציאת המשלוח.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">עלויות משלוח</h2>
                <div className="text-muted-foreground leading-relaxed space-y-3">
                  <p><strong className="text-foreground">משלוח חינם</strong> בהזמנות מעל ₪299.</p>
                  <p>עלות משלוח רגיל: <strong className="text-foreground">₪35</strong> בהזמנות מתחת ל-₪299.</p>
                  <p>כל המחירים בשקלים חדשים (ILS), כולל מע"מ.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">יצירת קשר</h2>
                <div className="bg-secondary/50 p-6 rounded-xl border border-border">
                  <ul className="text-muted-foreground space-y-2 leading-relaxed">
                    <li><strong>שם העסק:</strong> FullBody – נדב אונגר, משווק עצמאי של מוצרי הרבלייף בישראל</li>
                    <li><strong>ח.פ / עוסק מורשה:</strong> 200353720</li>
                    <li><strong>כתובת:</strong> רחוב זרחין 1, קומה 3, בניין גב ים, רעננה, ישראל (מיקוד 4366238)</li>
                    <li><strong>טלפון:</strong> <a href="tel:0542008578" className="text-accent hover:underline">054-2008578</a></li>
                    <li><strong>דוא"ל:</strong> <a href="mailto:Nadav@nadavunger.com" className="text-accent hover:underline">Nadav@nadavunger.com</a></li>
                    <li><strong>שעות פעילות:</strong> ימים א'-ה' 09:00 - 19:00, יום ו' 09:00 - 13:00</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <ProFooter />
    </div>
  );
}

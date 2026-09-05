import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, RotateCcw, Clock, Phone, Award } from 'lucide-react';
import ProFooter from '@/components/ProFooter';

export default function ProReturnPolicy() {
  const { pathname } = useLocation();
  const canonical = `https://fullbody.co.il${pathname === '/refund-policy' ? '/refund-policy' : '/return-policy'}`;

  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>מדיניות החזרות וביטולים - תקן הזהב 30 יום | FullBody</title>
        <meta
          name="description"
          content="ערבות שביעות רצון תקן הזהב: 30 ימי התנסות מיום קבלת המוצר, החזר כספי מלא או החלפת מוצר, גם אם המוצר נפתח ונעשה בו שימוש חלקי."
        />
        <link rel="canonical" href={canonical} />
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
            <h1 className="text-3xl md:text-4xl font-black text-primary mb-4">
              מדיניות החזרות וביטולים – ערבות שביעות רצון "תקן הזהב" (30 יום)
            </h1>
            <p className="text-muted-foreground mb-10">
              אנו ב-FullBody מחויבים לשביעות רצונכם המלאה, בהתאם לערבות שביעות הרצון הרשמית של הרבלייף.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { icon: RotateCcw, title: "30 ימי התנסות", text: "מיום קבלת המוצר" },
                { icon: Award, title: "החזר כספי מלא", text: "גם על מוצר פתוח" },
                { icon: Clock, title: "זיכוי תוך 7 ימי עסקים", text: "לאמצעי התשלום המקורי" },
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
                <h2 className="text-2xl font-bold text-foreground mb-4">עיקרי המדיניות</h2>
                <ul className="text-muted-foreground leading-relaxed space-y-3 list-disc pr-5">
                  <li>30 ימי התנסות מלאים מיום קבלת המוצר.</li>
                  <li>
                    החזר כספי מלא (100%) או החלפת מוצר – גם אם המוצר נפתח ונעשה בו שימוש חלקי, במידה ואינכם שבעי רצון
                    מהתוצאה!
                  </li>
                  <li>
                    אופן ביצוע ההחזרה: פנייה ישירה לשירות הלקוחות בטלפון{' '}
                    <a href="tel:0542008578" className="text-accent hover:underline font-bold">054-2008578</a> או במייל{' '}
                    <a href="mailto:Nadav@nadavunger.com" className="text-accent hover:underline font-bold">Nadav@nadavunger.com</a>
                    , ושליחת המוצר/האריזה לכתובת: זרחין 1, קומה 3, רעננה.
                  </li>
                  <li>עיבוד הזיכוי הכספי מתבצע תוך 7 ימי עסקים לאמצעי התשלום המקורי.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">ביטול עסקה</h2>
                <div className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    ניתן לבטל עסקה בכל עת בהתאם לחוק הגנת הצרכן ולתקנות ביטול עסקה, ובנוסף ליהנות מערבות 30 הימים
                    המורחבת המתוארת לעיל.
                  </p>
                  <p>דמי משלוח ששולמו אינם מוחזרים, למעט במקרה של מוצר פגום או אספקה שגויה.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">פרטי העסק</h2>
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

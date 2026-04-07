import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, RotateCcw, Clock, Phone } from 'lucide-react';
import ProFooter from '@/components/ProFooter';

export default function ProReturnPolicy() {
  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>מדיניות החזרים וביטולים | FullBody - הרבלייף</title>
        <meta name="description" content="מדיניות החזרים וביטולים Gold Standard של FullBody. החזרה תוך 30 יום, גם אם האריזה נפתחה, עם החזר כספי מלא." />
        <link rel="canonical" href="https://fullbody.co.il/return-policy" />
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
            <h1 className="text-4xl font-black text-primary mb-4">מדיניות החזרים וביטולים - Gold Standard</h1>
            <p className="text-muted-foreground mb-10">אנו ב-FullBody מחויבים לשביעות רצונכם המלאה.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { icon: RotateCcw, title: "30 יום להחזרה", text: "מיום קבלת המוצר" },
                { icon: Clock, title: "זיכוי תוך 7 ימים", text: "לאמצעי התשלום המקורי" },
                { icon: Phone, title: "יצירת קשר", text: "052-4487537" },
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
                <h2 className="text-2xl font-bold text-foreground mb-4">תנאי ההחזרה</h2>
                <div className="text-muted-foreground leading-relaxed space-y-3">
                  <p>בהתאם לסטנדרט הזהב של הרבלייף, ניתן להחזיר כל מוצר תוך 30 יום מיום קבלתו, <strong>גם אם האריזה נפתחה</strong>, ולקבל החזר כספי מלא (בניכוי דמי משלוח אם היו).</p>
                  <p>כדי לבצע החזר, יש ליצור קשר בטלפון <a href="tel:0524487537" className="text-accent hover:underline font-bold">052-4487537</a>.</p>
                  <p>זיכוי כספי יבוצע לאמצעי התשלום המקורי תוך 7 ימי עסקים מרגע הגעת המוצר אלינו.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">פרטי העסק</h2>
                <div className="bg-secondary/50 p-6 rounded-xl border border-border">
                  <ul className="text-muted-foreground space-y-2 leading-relaxed">
                    <li><strong>שם העסק:</strong> FullBody - נדב אונגר, מפיץ עצמאי הרבלייף</li>
                    <li><strong>ח.פ:</strong> 200353720</li>
                    <li><strong>כתובת:</strong> זרחין 1, רעננה</li>
                    <li><strong>טלפון:</strong> <a href="tel:0524487537" className="text-accent hover:underline">052-4487537</a></li>
                    <li><strong>דוא"ל:</strong> <a href="mailto:info@fullbody.co.il" className="text-accent hover:underline">info@fullbody.co.il</a></li>
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

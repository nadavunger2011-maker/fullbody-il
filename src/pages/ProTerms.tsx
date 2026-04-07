import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import ProFooter from '@/components/ProFooter';

export default function ProTerms() {
  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>תנאי שימוש | FullBody - הרבלייף</title>
        <meta name="description" content="תנאי השימוש של אתר FullBody. מידע על הרכישה, מחירים ותנאי השימוש באתר." />
        <link rel="canonical" href="https://fullbody.co.il/terms-of-use" />
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
            <h1 className="text-4xl font-black text-primary mb-4">תנאי שימוש</h1>
            <p className="text-muted-foreground mb-10">אנא קראו את תנאי השימוש בעיון לפני השימוש באתר.</p>

            <div className="space-y-10">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. כללי</h2>
                <div className="text-muted-foreground leading-relaxed space-y-3">
                  <p>השימוש באתר מותר מגיל 18 ומעלה.</p>
                  <p>הרכישה מבוצעת מול נדב אונגר, מפיץ עצמאי של הרבלייף.</p>
                  <p>מחירי המוצרים כוללים מע"מ.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. הזמנות ורכישה</h2>
                <ul className="text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
                  <li>יש למסור פרטים מדויקים ונכונים בעת ביצוע הזמנה.</li>
                  <li>מסירת פרטים כוזבים הינה עבירה פלילית.</li>
                  <li>החברה שומרת על זכותה לבטל הזמנה במקרה של פרטים שגויים.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. ביטול עסקה</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ניתן לבטל עסקה ולהחזיר מוצרים בהתאם ל<Link to="/return-policy" className="text-accent hover:underline">מדיניות ההחזרים</Link> שלנו. לפרטים נוספים ראו את דף מדיניות ההחזרים וביטולים.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. הגבלת אחריות</h2>
                <p className="text-muted-foreground leading-relaxed">
                  מוצרי הרבלייף אינם מיועדים לדיאגנוזה, לטיפול, לריפוי או למניעה של מחלות. התוצאות הן אישיות ועשויות להשתנות.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. פרטי העסק</h2>
                <div className="bg-secondary/50 p-6 rounded-xl border border-border">
                  <ul className="text-muted-foreground space-y-2 leading-relaxed">
                    <li><strong>שם העסק:</strong> FullBody - נדב אונגר, מפיץ עצמאי הרבלייף</li>
                    <li><strong>ID מפיץ:</strong> 16Y0030013</li>
                    <li><strong>ח.פ:</strong> 200353720</li>
                    <li><strong>כתובת:</strong> זרחין 1, רעננה</li>
                    <li><strong>טלפון:</strong> <a href="tel:0524487537" className="text-accent hover:underline">052-4487537</a></li>
                    <li><strong>דוא"ל:</strong> <a href="mailto:info@fullbody.co.il" className="text-accent hover:underline">info@fullbody.co.il</a></li>
                    <li><strong>שעות פעילות:</strong> א'-ה' 09:00-18:00, ו' 09:00-13:00</li>
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

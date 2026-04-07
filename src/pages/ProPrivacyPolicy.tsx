import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import ProFooter from '@/components/ProFooter';

export default function ProPrivacyPolicy() {
  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>מדיניות פרטיות | FullBody - הרבלייף</title>
        <meta name="description" content="מדיניות הפרטיות של FullBody. מידע על איסוף נתונים, שימוש ב-Cookies והגנה על המידע האישי שלך." />
        <link rel="canonical" href="https://fullbody.co.il/privacy-policy" />
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
            <h1 className="text-4xl font-black text-primary mb-4">מדיניות פרטיות</h1>
            <p className="text-muted-foreground mb-10">אתר FullBody מכבד את פרטיותך ומגן על המידע האישי שלך.</p>

            <div className="space-y-10">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. איסוף מידע</h2>
                <p className="text-muted-foreground leading-relaxed">
                  המידע שתמסור ישמש אך ורק לצורך עיבוד הזמנתך ויצירת קשר בנושא תוכנית התזונה שלך. אנו אוספים פרטים כגון שם, כתובת דוא"ל, מספר טלפון וכתובת למשלוח.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. שימוש ב-Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  אנו משתמשים ב-Cookies לצורך שיפור חוויית המשתמש והתאמת מודעות (Google Ads, Facebook Pixel). ניתן לנהל את העדפות ה-Cookies דרך הגדרות הדפדפן.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. שיתוף מידע עם צד שלישי</h2>
                <p className="text-muted-foreground leading-relaxed">
                  המידע אינו מועבר לצד ג' למעט לצורך שילוח ההזמנה לחברת השליחויות. איננו מוכרים או משכירים את המידע האישי שלך.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. אבטחת מידע</h2>
                <p className="text-muted-foreground leading-relaxed">
                  האתר מוגן בהצפנת SSL 256-bit. אנו נוקטים באמצעי אבטחה מתקדמים להגנה על המידע האישי שלך.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. יצירת קשר</h2>
                <div className="bg-secondary/50 p-6 rounded-xl border border-border">
                  <ul className="text-muted-foreground space-y-2 leading-relaxed">
                    <li><strong>שם העסק:</strong> FullBody - נדב אונגר, מפיץ עצמאי הרבלייף</li>
                    <li><strong>ח.פ:</strong> 200353720</li>
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

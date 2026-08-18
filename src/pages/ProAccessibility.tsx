import greenLogo from '@/assets/logo-green.webp';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Eye, Ear, Hand, Brain, Leaf } from 'lucide-react';
import ProFooter from '@/components/ProFooter';

export default function ProAccessibility() {
  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>הצהרת נגישות | FullBody</title>
        <meta
          name="description"
          content="הצהרת הנגישות של אתר FullBody. האתר נבנה בהתאם לתקן WCAG 2.1 ברמת AA. לפניות בנושא נגישות: 052-4487537."
        />
        <link rel="canonical" href="https://fullbody.co.il/accessibility" />
      </Helmet>

      <header className="sticky top-0 z-40 bg-card shadow-card border-b border-border">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={greenLogo} alt="FullBody" className="h-10" />
            <div className="flex items-center gap-1">
              <Leaf className="w-5 h-5 text-accent" />
              <span className="text-sm font-bold text-accent">PRO</span>
            </div>
          </Link>
          <Link to="/" className="text-accent font-bold flex items-center gap-2 hover:underline">
            חזרה לחנות
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <section className="bg-primary py-14">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-primary-foreground mb-4">הצהרת נגישות</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            אנו מחויבים לאפשר לכל אדם, לרבות אנשים עם מוגבלות, לגלוש באתר בצורה נוחה ועצמאית.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 max-w-4xl space-y-10">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Eye, title: 'לקויי ראייה', text: 'תמיכה בקוראי מסך, ניגודיות מותאמת ואפשרות להגדלת טקסט.' },
              { icon: Ear, title: 'לקויי שמיעה', text: 'התוכן באתר טקסטואלי וויזואלי, ללא תלות בשמע.' },
              { icon: Hand, title: 'לקויי מוטוריקה', text: 'ניווט מלא במקלדת ואזורי לחיצה מוגדלים.' },
              { icon: Brain, title: 'לקויות קוגניטיביות', text: 'מבנה פשוט, ניווט עקבי ושפה ברורה בכל העמודים.' },
            ].map((item, i) => (
              <div key={i} className="bg-card rounded-xl p-6 border border-border shadow-card">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-3">רמת הנגישות באתר</h2>
              <p>
                האתר נבנה בהתאם להנחיות תקן WCAG 2.1 ברמת AA ולתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות
                לשירות), התשע"ג-2013, במידת האפשר הטכני.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-3">התאמות שבוצעו</h2>
              <ul className="list-disc pr-6 space-y-1">
                <li>מבנה כותרות סמנטי (H1-H3) בכל עמוד.</li>
                <li>טקסט חלופי לתמונות המוצרים והתכנים.</li>
                <li>ניווט מלא באמצעות מקלדת וסימון מיקוד ויזואלי.</li>
                <li>ווידג'ט נגישות לשינוי גודל טקסט וניגודיות.</li>
                <li>התאמה מלאה לגלישה במובייל ובטאבלט.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-3">פניות בנושא נגישות</h2>
              <div className="bg-secondary/50 p-6 rounded-xl border border-border">
                <p className="mb-2">
                  נתקלתם בבעיית נגישות? נשמח לטפל בה. רכז הנגישות: נדב אונגר.
                </p>
                <ul className="space-y-1">
                  <li>
                    טלפון:{' '}
                    <a href="tel:0524487537" className="text-accent hover:underline">
                      052-4487537
                    </a>
                  </li>
                  <li>
                    דוא"ל:{' '}
                    <a href="mailto:info@fullbody.co.il" className="text-accent hover:underline">
                      info@fullbody.co.il
                    </a>
                  </li>
                  <li>כתובת: רחוב זרחין 1, רעננה</li>
                </ul>
              </div>
            </div>
            <p className="text-sm">עדכון אחרון של הצהרת הנגישות: {new Date().toLocaleDateString('he-IL')}</p>
          </div>
        </div>
      </section>

      <ProFooter />
    </div>
  );
}

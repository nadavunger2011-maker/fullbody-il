import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Zap } from 'lucide-react';

export default function Privacy() {
  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>מדיניות פרטיות | FullBody - תוספי תזונה</title>
        <meta name="description" content="מדיניות הפרטיות של FullBody בהתאם לתיקון 13 לחוק הגנת הפרטיות. מידע על איסוף מידע, שימוש בנתונים וזכויותיך." />
        <link rel="canonical" href="https://fullbody.co.il/privacy" />
      </Helmet>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card shadow-card border-b border-border">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tighter text-primary flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent fill-current" />
            FULL<span className="text-accent">BODY</span>
          </Link>
          <Link to="/" className="text-accent font-bold flex items-center gap-2 hover:underline">
            חזרה לחנות
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-black text-primary mb-4">מדיניות פרטיות</h1>
            <p className="text-lg text-accent font-bold mb-8">(בהתאם לתיקון 13 לחוק הגנת הפרטיות)</p>
            
            <p className="text-muted-foreground leading-relaxed mb-10">
              באתר FullBody ("האתר"), אנו מכבדים את פרטיותך ומחויבים להגן על המידע האישי שלך. מדיניות זו מסבירה כיצד אנו אוספים, משתמשים ושומרים על המידע שלך.
            </p>

            <div className="space-y-10">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. איסוף מידע</h2>
                <p className="text-muted-foreground leading-relaxed">
                  אנו אוספים מידע שאתה מספק לנו בעת ביצוע הזמנה, הרשמה לניוזלטר או פנייה לשירות הלקוחות (שם, כתובת, טלפון, אימייל). פרטי האשראי אינם נשמרים בשרתי האתר אלא נסלקים בתקן PCI-DSS המחמיר ביותר ע"י ספק חיצוני.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. מטרת השימוש במידע</h2>
                <p className="text-muted-foreground leading-relaxed">
                  המידע משמש לצורך עיבוד ההזמנה, משלוח המוצרים, הפקת חשבונית ויצירת קשר במקרה הצורך. בכפוף לאישורך (Opt-in), נשלח לך עדכונים שיווקיים רלוונטיים.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. מסירת מידע לצד שלישי</h2>
                <p className="text-muted-foreground leading-relaxed">
                  אנו לא מוכרים את המידע שלך. המידע מועבר רק לספקים הדרושים להשלמת השירות: חברת השליחויות (לצורך מסירה), פלטפורמת Shopify (ניהול החנות), ו-Google/Meta (לצורך ניתוח סטטיסטי ושיווק מותאם אישית).
                </p>
              </section>

              <section className="bg-secondary/50 p-6 rounded-xl border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. זכויותיך (תיקון 13)</h2>
                <p className="text-muted-foreground leading-relaxed">
                  זכותך לעיין במידע המוחזק עליך, לבקש לתקנו או לבקש את מחיקתו המלאה ממאגרי המידע שלנו בכל עת, באמצעות פנייה לשירות הלקוחות.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. פרטי בעל המאגר</h2>
                <div className="bg-card p-6 rounded-xl border border-border">
                  <ul className="text-muted-foreground space-y-2 leading-relaxed">
                    <li><strong>בעל המאגר:</strong> FullBody בע"מ</li>
                    <li><strong>ח.פ.:</strong> 516247890</li>
                    <li><strong>כתובת:</strong> רחוב זרחין 1, רעננה</li>
                    <li><strong>טלפון:</strong> <a href="tel:0524487537" className="text-accent hover:underline">052-4487537</a></li>
                    <li><strong>דוא"ל לפניות פרטיות:</strong> <a href="mailto:privacy@fullbody.co.il" className="text-accent hover:underline">privacy@fullbody.co.il</a></li>
                  </ul>
                </div>
              </section>
            </div>

            <p className="text-sm text-muted-foreground mt-10">עדכון אחרון: ינואר 2025</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-80">© {new Date().getFullYear()} FullBody. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  );
}

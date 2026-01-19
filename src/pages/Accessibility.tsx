import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, Eye, Ear, Hand, Brain } from 'lucide-react';

const Accessibility = () => {
  return (
    <div dir="rtl" className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card shadow-card border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-black tracking-tighter text-primary flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent fill-current" />
            FULL<span className="text-accent">BODY</span>
          </Link>
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            חזרה לחנות
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">הצהרת נגישות</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            אנו ב-FullBody מחויבים להנגשת האתר לכלל האוכלוסייה, כולל אנשים עם מוגבלויות
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Accessibility Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: Eye, title: "לקויי ראייה", text: "תמיכה בתוכנות הקראה, ניגודיות צבעים מותאמת, ואפשרות להגדלת טקסט" },
              { icon: Ear, title: "לקויי שמיעה", text: "כל התוכן הוויזואלי מלווה בטקסט חלופי, ללא תלות בתוכן קולי" },
              { icon: Hand, title: "לקויי מוטוריקה", text: "ניווט מלא באמצעות מקלדת, אזורי לחיצה מוגדלים" },
              { icon: Brain, title: "לקויות קוגניטיביות", text: "מבנה אתר ברור ופשוט, ניווט עקבי בכל הדפים" }
            ].map((item, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border border-border shadow-card">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Detailed Statement */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">מחויבות לנגישות</h2>
              <p className="text-muted-foreground leading-relaxed">
                אתר FullBody עוצב ונבנה תוך הקפדה על עמידה בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות 
                (התאמות נגישות לשירות), התשע"ג-2013 ובהתאם להמלצות התקן הבינלאומי WCAG 2.1 ברמה AA.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">התאמות הנגישות באתר</h2>
              <ul className="text-muted-foreground space-y-2">
                <li>• ניווט באמצעות מקלדת בלבד</li>
                <li>• תמיכה בתוכנות קריאת מסך (Screen Readers)</li>
                <li>• טקסט חלופי (alt) לכל התמונות</li>
                <li>• יחס ניגודיות גבוה בין טקסט לרקע</li>
                <li>• מבנה סמנטי תקין (כותרות, רשימות, טפסים)</li>
                <li>• אפשרות להגדלת גודל הטקסט עד 200%</li>
                <li>• אזורי לחיצה מוגדלים לנוחות שימוש</li>
                <li>• תמיכה ב-RTL (עברית מימין לשמאל)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">דרכי פנייה</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                אם נתקלתם בבעיית נגישות באתר, או שיש לכם הצעות לשיפור הנגישות, אנא פנו אלינו:
              </p>
              <div className="bg-secondary rounded-xl p-6">
                <p className="text-foreground"><strong>רכז נגישות:</strong> צוות FullBody</p>
                <p className="text-foreground"><strong>טלפון:</strong> 052-4487537</p>
                <p className="text-foreground"><strong>דוא"ל:</strong> accessibility@fullbody.co.il</p>
                <p className="text-foreground"><strong>כתובת:</strong> רחוב זרחין 1, רעננה</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">עדכון הצהרת הנגישות</h2>
              <p className="text-muted-foreground leading-relaxed">
                הצהרה זו עודכנה לאחרונה בתאריך: ינואר 2025. אנו מתעדכנים באופן שוטף בתקנים ובטכנולוגיות 
                נגישות חדשות, ופועלים באופן מתמיד לשיפור נגישות האתר.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} FullBody. כל הזכויות שמורות.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Accessibility;

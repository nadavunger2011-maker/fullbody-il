import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw, Package, Clock, AlertTriangle, Mail, Phone, MapPin, Zap } from 'lucide-react';

export default function Returns() {
  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
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

      {/* Hero */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-primary-foreground mb-2">מדיניות החזרות והחזר כספי</h1>
          <p className="text-lg text-primary-foreground/80">Return and Refund Policy</p>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-10 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-card rounded-xl p-5 text-center shadow-card">
              <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="font-bold text-foreground text-sm">תקופת ביטול</h3>
              <p className="text-xs text-muted-foreground">14 יום מקבלת המוצר</p>
            </div>
            <div className="bg-card rounded-xl p-5 text-center shadow-card">
              <Package className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="font-bold text-foreground text-sm">תנאי החזרה</h3>
              <p className="text-xs text-muted-foreground">באריזה מקורית סגורה</p>
            </div>
            <div className="bg-card rounded-xl p-5 text-center shadow-card">
              <RotateCcw className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="font-bold text-foreground text-sm">החזר כספי</h3>
              <p className="text-xs text-muted-foreground">עד 14 ימי עסקים</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-12">
            
            {/* Return Policy */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <RotateCcw className="w-6 h-6 text-accent" />
                מדיניות החזרות
              </h2>
              <div className="bg-card rounded-xl p-6 border border-border space-y-5">
                <p className="text-muted-foreground leading-relaxed">
                  בהתאם לחוק הגנת הצרכן, התשמ"א-1981, לקוחות רשאים לבטל עסקה ולהחזיר מוצרים בתנאים הבאים:
                </p>
                
                <div>
                  <h4 className="font-bold text-foreground mb-2">תנאים להחזרת מוצר:</h4>
                  <ul className="text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                      <span>ניתן לבטל עסקה תוך <strong className="text-foreground">14 ימים</strong> מיום קבלת המוצר</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                      <span>המוצר חייב להיות ב<strong className="text-foreground">אריזתו המקורית, סגורה ושלמה</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                      <span>המוצר לא נעשה בו כל שימוש</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Important Notice */}
            <section>
              <div className="bg-accent/10 rounded-xl p-6 border border-accent/20">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-accent" />
                  הגבלות על החזרת תוספי תזונה
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  בהתאם לתקנות משרד הבריאות ולחוק הגנת הצרכן, <strong className="text-foreground">לא ניתן להחזיר או להחליף מוצרי מזון ותוספי תזונה שנפתחו או שאריזתם נפגמה</strong>. 
                  הגבלה זו נועדה להבטיח את בטיחות ואיכות המוצרים לכל לקוחותינו.
                </p>
                <p className="text-muted-foreground mt-3">
                  <strong className="text-foreground">יוצא מן הכלל:</strong> במקרה של פגם ייצור או מוצר פגום, נשמח לבצע החלפה מלאה ללא עלות.
                </p>
              </div>
            </section>

            {/* Refund Process */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-6">תהליך החזר כספי</h2>
              <div className="bg-card rounded-xl p-6 border border-border space-y-4">
                <div className="flex items-start gap-3">
                  <span className="bg-accent text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">פנייה ראשונית:</strong> צרו קשר בטלפון או במייל לתיאום החזרה
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-accent text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">שליחת המוצר:</strong> שלחו את המוצר באריזתו המקורית לכתובת שלנו
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-accent text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">בדיקת המוצר:</strong> נבדוק שהמוצר עומד בתנאי ההחזרה
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-accent text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</span>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">החזר כספי:</strong> ההחזר יבוצע לאמצעי התשלום המקורי תוך עד 14 ימי עסקים
                  </p>
                </div>
              </div>
            </section>

            {/* Contact for Returns */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-6">יצירת קשר להחזרות</h2>
              <div className="bg-card rounded-xl p-6 border border-border">
                <p className="text-muted-foreground mb-6">
                  לביצוע החזרה או בירור בנושא, ניתן לפנות אלינו:
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-accent" />
                    <a href="mailto:support@fullbody.co.il" className="text-accent hover:underline">support@fullbody.co.il</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-accent" />
                    <a href="tel:052-4487537" className="text-accent hover:underline">052-4487537</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-accent" />
                    <span className="text-muted-foreground">רחוב זרחין 1, רעננה</span>
                  </div>
                </div>
              </div>
            </section>

            <p className="text-sm text-muted-foreground text-center">
              עודכן לאחרונה: ינואר 2025
            </p>
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

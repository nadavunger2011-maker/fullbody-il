import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Truck, Clock, Package, RotateCcw } from 'lucide-react';

export default function Shipping() {
  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>משלוחים והחזרות | FullBody - תוספי תזונה</title>
        <meta name="description" content="מדיניות משלוחים והחזרות של FullBody. משלוח חינם מעל ₪299, זמן אספקה עד 5 ימי עסקים, החזרה תוך 14 יום באריזה סגורה." />
        <link rel="canonical" href="https://fullbody.co.il/shipping" />
      </Helmet>
      {/* Header */}
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

      {/* Hero */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-primary-foreground mb-2">תקנון משלוחים והחזרות</h1>
          <p className="text-lg text-primary-foreground/80">כל המידע על משלוחים, ביטולים והחזרות</p>
        </div>
      </section>

      {/* Quick Info Icons */}
      <section className="py-10 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Truck, title: "משלוח חינם", text: "בקנייה מעל ₪299" },
              { icon: Clock, title: "זמן אספקה", text: "עד 5 ימי עסקים" },
              { icon: Package, title: "אריזה והכנה", text: "1-2 ימי עסקים" },
              { icon: RotateCcw, title: "החזרות", text: "14 יום באריזה סגורה" },
            ].map((item, index) => (
              <div key={index} className="bg-card rounded-xl p-5 text-center shadow-card">
                <item.icon className="w-8 h-8 text-accent mx-auto mb-2" />
                <h3 className="font-bold text-foreground text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-12">
            
            {/* Shipping Policy */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <Truck className="w-6 h-6 text-accent" />
                מדיניות משלוחים
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                אנו עושים את מירב המאמצים לספק את ההזמנה במהירות האפשרית.
              </p>
              
              <div className="bg-card rounded-xl p-6 border border-border space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <p className="text-foreground">
                    <strong>זמן אספקה כולל:</strong> <span className="text-muted-foreground">עד 5 ימי עסקים.</span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <p className="text-foreground">
                    <strong>תהליך ההכנה:</strong> <span className="text-muted-foreground">1-2 ימים לאריזה והכנה.</span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <p className="text-foreground">
                    <strong>זמן שילוח:</strong> <span className="text-muted-foreground">1-3 ימי עסקים נוספים.</span>
                  </p>
                </div>
              </div>

              {/* Shipping Costs Table */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-foreground mb-4">עלויות משלוח</h3>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-right py-3 font-bold text-foreground">סכום הזמנה</th>
                        <th className="text-right py-3 font-bold text-foreground">עלות משלוח</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border">
                        <td className="py-3">עד ₪149</td>
                        <td className="py-3">₪29.90</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3">₪150 - ₪298</td>
                        <td className="py-3">₪19.90</td>
                      </tr>
                      <tr>
                        <td className="py-3">₪299 ומעלה</td>
                        <td className="py-3 text-accent font-bold">חינם!</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Returns Policy */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <RotateCcw className="w-6 h-6 text-accent" />
                מדיניות ביטולים והחזרות
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                אנו פועלים בהתאם לחוק הגנת הצרכן הישראלי.
              </p>

              <div className="bg-card rounded-xl p-6 border border-border space-y-5">
                <div>
                  <h4 className="font-bold text-foreground mb-2">החזרת מוצרים</h4>
                  <p className="text-muted-foreground">
                    ניתן לבטל עסקה ולהחזיר מוצר תוך 14 יום מקבלתו, ובלבד שהמוצר ארוז באריזתו המקורית, לא נפתח, ולא נעשה בו שום שימוש.
                  </p>
                </div>

                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <h4 className="font-bold text-foreground mb-2">⚠️ מוצרים פתוחים</h4>
                  <p className="text-muted-foreground">
                    לאור אופי המוצרים (תוספי תזונה ומזון), <strong className="text-foreground">לא ניתן להחזיר או להחליף מוצר שנפתח או שאריזתו נפגמה</strong>, למעט במקרים של פגם בייצור.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2">דמי ביטול</h4>
                  <p className="text-muted-foreground">
                    במקרה של ביטול שלא עקב פגם, יגבו דמי ביטול בשיעור 5% או 100 ש"ח (הנמוך מביניהם) + עלויות המשלוח.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">יצירת קשר לביטולים והחזרות</h2>
              <p className="text-muted-foreground leading-relaxed">
                לביצוע ביטול או בירור בנושא החזרה, ניתן לפנות אלינו:<br />
                דוא"ל: support@fullbody.co.il<br />
                טלפון: 052-4487537<br />
                כתובת: רחוב זרחין 1, רעננה
              </p>
            </section>

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

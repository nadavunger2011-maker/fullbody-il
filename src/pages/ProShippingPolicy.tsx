import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Truck, Clock, Package } from 'lucide-react';
import ProFooter from '@/components/ProFooter';

export default function ProShippingPolicy() {
  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>משלוחים ואספקה | FullBody - הרבלייף</title>
        <meta name="description" content="מדיניות משלוחים של FullBody. משלוח לכל חלקי הארץ תוך 3-5 ימי עסקים. מספר מעקב למייל ולטלפון." />
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
            <p className="text-muted-foreground mb-10">מידע מלא על אפשרויות המשלוח וזמני האספקה שלנו.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { icon: Truck, title: "משלוח ארצי", text: "לכל חלקי הארץ" },
                { icon: Clock, title: "זמן אספקה", text: "3-5 ימי עסקים" },
                { icon: Package, title: "מעקב משלוח", text: "מספר מעקב אוטומטי" },
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
                <h2 className="text-2xl font-bold text-foreground mb-4">פרטי משלוח</h2>
                <div className="text-muted-foreground leading-relaxed space-y-3">
                  <p>אנו שולחים לכל חלקי הארץ באמצעות חברת שליחים.</p>
                  <p>זמן האספקה הוא 3-5 ימי עסקים (לא כולל שישי-שבת וחגים).</p>
                  <p>תקבלו מספר מעקב למייל/SMS מיד עם יציאת המשלוח.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">יצירת קשר</h2>
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

import { Helmet } from 'react-helmet-async';
import { Truck, Clock, Package, MapPin } from 'lucide-react';
import SweetsHeader from '@/components/sweets/SweetsHeader';
import SweetsFooter from '@/components/sweets/SweetsFooter';

export default function SweetsShipping() {
  return (
    <div dir="rtl" className="sweets-theme font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>משלוחים | FullBody מתוקים</title>
        <meta name="description" content="מדיניות משלוחים: 29 ₪, חינם מעל 299 ₪, אספקה 3-5 ימי עסקים ובעומס עד 14 ימי עסקים." />
      </Helmet>
      <SweetsHeader />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-black text-primary mb-8">מדיניות משלוחים</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: MapPin, title: 'עלות משלוח', text: '29 ₪' },
              { icon: Truck, title: 'כל הארץ', text: 'משלוח עד הבית' },
              { icon: Clock, title: 'זמן אספקה', text: '3-5 ימי עסקים' },
              { icon: Package, title: 'מעל 299 ₪', text: 'משלוח חינם' },
            ].map((item, i) => (
              <div key={i} className="bg-card p-6 rounded-xl border border-border text-center">
                <item.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p><strong className="text-foreground">עלות משלוח</strong> - 29 ₪ לכל הארץ.</p>
            <p><strong className="text-foreground">זמן אספקה</strong> - 3-5 ימי עסקים; בתקופות עומס עד 14 ימי עסקים.</p>
            <p><strong className="text-foreground">משלוח חינם</strong> - בהזמנה מעל 299 ₪. אין איסוף עצמי.</p>
            <p>לפרטים נוספים ניתן ליצור קשר בטלפון <a href="tel:0542008578" className="text-accent hover:underline">054-2008578</a>.</p>
          </div>
        </div>
      </section>
      <SweetsFooter />
    </div>
  );
}

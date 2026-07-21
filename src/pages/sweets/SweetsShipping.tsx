import { Helmet } from 'react-helmet-async';
import { Truck, Clock, Package, MapPin } from 'lucide-react';
import SweetsHeader from '@/components/sweets/SweetsHeader';
import SweetsFooter from '@/components/sweets/SweetsFooter';

export default function SweetsShipping() {
  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>משלוחים | FullBody מתוקים</title>
        <meta name="description" content="מדיניות משלוחים של FullBody מתוקים - משלוח לכל הארץ, כולל אזור השרון ב-30 ש״ח, וחינם מעל 300 ש״ח." />
      </Helmet>
      <SweetsHeader />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-black text-primary mb-8">מדיניות משלוחים</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: MapPin, title: 'אזור השרון', text: '30 ש"ח' },
              { icon: Truck, title: 'כל הארץ', text: 'משלוח עד הבית' },
              { icon: Clock, title: 'זמן אספקה', text: '3-5 ימי עסקים' },
              { icon: Package, title: 'מעל 300 ש"ח', text: 'משלוח חינם' },
            ].map((item, i) => (
              <div key={i} className="bg-card p-6 rounded-xl border border-border text-center">
                <item.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p><strong className="text-foreground">משלוח באזור השרון</strong> - עלות 30 ש"ח בלבד. כולל: רעננה, כפר סבא, הוד השרון, רמת השרון, הרצליה, נתניה ואזורים סמוכים.</p>
            <p><strong className="text-foreground">משלוח לכל הארץ</strong> - עד 3-5 ימי עסקים באמצעות חברת שליחים. תקבלו מספר מעקב במייל וב-SMS.</p>
            <p><strong className="text-foreground">משלוח חינם</strong> - בהזמנה מעל 300 ש"ח.</p>
            <p>לפרטים נוספים ניתן ליצור קשר בטלפון <a href="tel:0524487537" className="text-accent hover:underline">052-4487537</a>.</p>
          </div>
        </div>
      </section>
      <SweetsFooter />
    </div>
  );
}

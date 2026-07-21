import { Helmet } from 'react-helmet-async';
import { Phone, Mail, MapPin } from 'lucide-react';
import SweetsHeader from '@/components/sweets/SweetsHeader';
import SweetsFooter from '@/components/sweets/SweetsFooter';

export default function SweetsContact() {
  return (
    <div dir="rtl" className="sweets-theme font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>צור קשר | FullBody מתוקים</title>
        <meta name="description" content="דברו איתנו - FullBody מתוקים. טלפון, מייל וכתובת." />
      </Helmet>
      <SweetsHeader />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-4xl font-black text-primary mb-3">צור קשר</h1>
          <p className="text-muted-foreground mb-10">נשמח לענות לכל שאלה על קו המתוקים.</p>
          <div className="space-y-4">
            <a href="tel:0524487537" className="flex items-center gap-4 bg-card border border-border rounded-xl p-5 hover:shadow-card-hover transition">
              <Phone className="w-6 h-6 text-accent" />
              <div><p className="font-bold">טלפון</p><p className="text-muted-foreground">052-4487537</p></div>
            </a>
            <a href="mailto:info@fullbody.co.il" className="flex items-center gap-4 bg-card border border-border rounded-xl p-5 hover:shadow-card-hover transition">
              <Mail className="w-6 h-6 text-accent" />
              <div><p className="font-bold">דוא"ל</p><p className="text-muted-foreground">info@fullbody.co.il</p></div>
            </a>
            <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-5">
              <MapPin className="w-6 h-6 text-accent" />
              <div><p className="font-bold">כתובת</p><p className="text-muted-foreground">זרחין 1, רעננה</p></div>
            </div>
          </div>
        </div>
      </section>
      <SweetsFooter />
    </div>
  );
}

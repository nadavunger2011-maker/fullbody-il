import { Link } from 'react-router-dom';
import { Zap, Award, Users, Target, ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';

export default function About() {
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
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-primary-foreground mb-4">אודות FullBody</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            אנחנו מאמינים שכל אחד יכול להגיע לשיא הפוטנציאל הפיזי שלו
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-primary mb-6">הסיפור שלנו</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              FullBody נוסדה בשנת 2018 מתוך תשוקה לספורט ורצון להביא לישראל את תוספי התזונה האיכותיים ביותר בעולם. 
              התחלנו כחנות קטנה בתל אביב, והיום אנחנו גאים לשרת אלפי לקוחות מרוצים בכל רחבי הארץ.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              אנחנו מאמינים שתזונה נכונה היא הבסיס להצלחה בספורט. לכן, אנחנו מקפידים לבחור רק מוצרים שעברו 
              בדיקות איכות מחמירות, עם רכיבים טבעיים ובטוחים לשימוש.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              הצוות שלנו מורכב מספורטאים פעילים, תזונאים ומומחי כושר שמבינים את הצרכים שלכם ויכולים לעזור 
              לכם לבחור את המוצרים המתאימים ביותר עבורכם.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black text-primary text-center mb-12">הערכים שלנו</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Award, title: "איכות ללא פשרות", text: "רק מוצרים שעברו את מבחן האיכות המחמיר שלנו" },
              { icon: Users, title: "שירות אישי", text: "צוות מקצועי שזמין לענות על כל שאלה" },
              { icon: Target, title: "תוצאות מוכחות", text: "מוצרים שנבדקו מדעית ומביאים תוצאות אמיתיות" },
            ].map((item, index) => (
              <div key={index} className="bg-card rounded-xl p-8 text-center shadow-card">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-primary mb-4">מוכנים להתחיל?</h2>
          <p className="text-muted-foreground mb-8">גלו את מגוון המוצרים שלנו והתחילו את המסע לגוף בריא יותר</p>
          <Link 
            to="/" 
            className="inline-block bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-4 px-8 rounded-lg shadow-cta transition-all"
          >
            לחנות
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

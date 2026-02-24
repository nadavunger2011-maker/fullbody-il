import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Menu, X, Zap } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const SITE_URL = 'https://fullbody.co.il';

const faqItems = [
  {
    question: 'כמה זמן לוקח המשלוח?',
    answer: 'משלוחים מגיעים תוך 2-5 ימי עסקים לכל רחבי הארץ. משלוח אקספרס זמין תוך 1-2 ימי עסקים בתוספת תשלום.',
  },
  {
    question: 'האם יש משלוח חינם?',
    answer: 'כן! משלוח חינם בקנייה מעל ₪299. מתחת לסכום זה עלות המשלוח היא ₪25.',
  },
  {
    question: 'האם המוצרים שלכם באיכות גבוהה?',
    answer: 'כן, כל המוצרים שלנו עוברים בדיקות איכות מחמירות ומגיעים ממותגים מובילים בתחום.',
  },
  {
    question: 'מה מדיניות ההחזרות?',
    answer: 'ניתן להחזיר מוצרים באריזתם המקורית תוך 14 יום מיום הקנייה לקבלת החזר מלא. מוצרים שנפתחו לא ניתנים להחזרה מסיבות היגייניות.',
  },
  {
    question: 'איך אני יודע איזה מוצר מתאים לי?',
    answer: 'ניתן לפנות אלינו בווצאפ או בטלפון ונשמח לייעץ לכם בהתאם לצרכים האישיים שלכם. בנוסף, בכל עמוד מוצר יש תיאור מפורט והמלצות שימוש.',
  },
  {
    question: 'האם אתם מוכרים לעסקים?',
    answer: 'בהחלט! אנו מציעים מחירים מיוחדים לעסקים, חדרי כושר וקליניקות. צרו קשר לקבלת הצעת מחיר.',
  },
  {
    question: 'איך אני יכול לעקוב אחרי ההזמנה שלי?',
    answer: 'לאחר שליחת ההזמנה תקבלו מייל עם מספר מעקב. ניתן לעקוב אחרי המשלוח דרך אתר חברת השליחויות.',
  },
  {
    question: 'האם יש אחריות על המוצרים?',
    answer: 'כל המוצרים מגיעים עם אחריות יבואן רשמי. במידה ויש בעיה כלשהי, אנא צרו קשר ונטפל בכך מיד.',
  },
];

const FAQ: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div dir="rtl" className="bg-background min-h-screen font-sans text-foreground">
      <Helmet>
        <title>שאלות נפוצות | FullBody - תוספי תזונה</title>
        <meta name="description" content="תשובות לשאלות נפוצות על משלוחים, החזרות ועוד. משלוח חינם מעל ₪299, מוצרים באיכות פרימיום, והחזרה תוך 14 יום." />
        <link rel="canonical" href="https://fullbody.co.il/faq" />
      </Helmet>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card shadow-card border-b border-border">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="תפריט"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/" className="text-2xl font-black tracking-tighter text-primary flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent fill-current" />
            FULL<span className="text-accent">BODY</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 font-bold text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors">ראשי</Link>
            <Link to="/" className="hover:text-accent transition-colors">חנות</Link>
            <Link to="/blog" className="hover:text-accent transition-colors">מאמרים</Link>
            <Link to="/about" className="hover:text-accent transition-colors">אודות</Link>
            <Link to="/contact" className="hover:text-accent transition-colors">צור קשר</Link>
            <Link to="/faq" className="text-accent transition-colors">שאלות נפוצות</Link>
          </nav>

          <div className="w-10 lg:hidden" />
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-card border-t border-border py-4">
            <nav className="container mx-auto px-4 flex flex-col gap-4 font-bold text-muted-foreground">
              <Link to="/" className="hover:text-accent transition-colors py-2">ראשי</Link>
              <Link to="/" className="hover:text-accent transition-colors py-2">חנות</Link>
              <Link to="/blog" className="hover:text-accent transition-colors py-2">מאמרים</Link>
              <Link to="/about" className="hover:text-accent transition-colors py-2">אודות</Link>
              <Link to="/contact" className="hover:text-accent transition-colors py-2">צור קשר</Link>
              <Link to="/faq" className="text-accent transition-colors py-2">שאלות נפוצות</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-6 text-sm font-medium text-muted-foreground">
        <Link to="/" className="hover:text-accent transition">ראשי</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-bold">שאלות נפוצות</span>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 text-center">
            שאלות נפוצות
          </h1>
          <p className="text-muted-foreground text-center mb-12 text-lg">
            מצאו תשובות לשאלות הנפוצות ביותר על המוצרים, המשלוחים והשירות שלנו
          </p>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl overflow-hidden bg-card"
              >
                <AccordionTrigger className="px-6 py-5 text-lg font-bold text-foreground hover:text-accent hover:no-underline [&[data-state=open]]:text-accent">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="mt-16 text-center bg-muted rounded-2xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              לא מצאתם תשובה לשאלה שלכם?
            </h2>
            <p className="text-muted-foreground mb-6">
              צוות התמיכה שלנו ישמח לעזור לכם בכל שאלה
            </p>
            <Link
              to="/contact"
              className="inline-block bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-4 px-8 rounded-xl transition-all shadow-cta"
            >
              צור קשר
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-foreground/60">
            © {new Date().getFullYear()} FullBody. כל הזכויות שמורות.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;

import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SweetsHeader from '@/components/sweets/SweetsHeader';
import SweetsFooter from '@/components/sweets/SweetsFooter';

export default function SweetsStory() {
  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>הסיפור שלנו | FullBody מתוקים</title>
        <meta name="description" content="איך הפכנו מחנות תוספי תזונה ספורטיביים גם למותג של מתוקים בריאים - הסיפור מאחורי FullBody מתוקים." />
      </Helmet>
      <SweetsHeader />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black text-primary mb-6">הסיפור שלנו</h1>
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-5">
            <p>FullBody נולד מתוך צורך אמיתי: לתת למתאמנים ולאנשים פעילים תוספים ומזון שמדבר בשפה שלהם - חלבון איכותי, מרכיבים נקיים, בלי בולשיט.</p>
            <p>אחרי שנים של ליווי, גילינו שהאויב הכי גדול של אנשי הכושר הוא לא האימון - זה הפינוק שאין להם ״גרסה נקייה״ עבורו.</p>
            <p>אז יצרנו את FullBody מתוקים: חטיפי חלבון, שוקולד ללא סוכר ועוגיות שמכניסות אותך בול ליום המאקרו שלך, בלי לוותר על טעם.</p>
            <p>כל מוצר עובר את מבחן ״האם אני עצמי אוכל את זה ביום שאני מתאמן?״. אם התשובה היא לא - הוא לא נכנס לקטלוג.</p>
          </div>
          <Link to="/sweets/products" className="inline-flex items-center gap-2 mt-10 bg-accent text-accent-foreground font-bold px-8 py-4 rounded-full shadow-cta hover:scale-105 transition-all">
            לחנות המתוקים <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>
      <SweetsFooter />
    </div>
  );
}

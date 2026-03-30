import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';

export default function Terms() {
  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>תנאי שימוש | FullBody - תוספי תזונה</title>
        <meta name="description" content="תנאי השימוש של אתר FullBody. מידע על הזמנות, ביטולים, החזרות ופרטי העסק." />
        <link rel="canonical" href="https://fullbody.co.il/terms" />
      </Helmet>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card shadow-card border-b border-border">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/nava" className="flex items-center">
            <span className="text-2xl font-black text-primary">FullBody</span>
          </Link>
          <Link to="/nava" className="text-accent font-bold flex items-center gap-2 hover:underline">
            חזרה לחנות
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-black text-primary mb-4">תנאי שימוש</h1>
            <p className="text-muted-foreground mb-10">
              ביקשנו להעמיד לרשותכם אתר ברמה גבוהה, כדי שנוכל ליצור סביבה משפטית שתאפשר לכם את מירב התועלת. אנא קראו את תנאי השימוש בעיון.
            </p>

            <div className="space-y-10">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. הגדרות</h2>
                <ul className="text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
                  <li><strong>"האתר"</strong> - אתר האינטרנט של החברה, המהווה פלטפורמה לרכישת שירותים ומוצרים.</li>
                  <li><strong>"משתמש"</strong> - כל אדם או ישות אשר מאשרים את ההסכם ונכנסים לאתר.</li>
                  <li><strong>"החברה"</strong> - FullBody ו/או מי מטעמה.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. כללי</h2>
                <ul className="text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
                  <li>השימוש באתר כפוף לתנאי שימוש אלה.</li>
                  <li>המשתמש מעיד על עצמו כי קרא בעיון את פרטי האתר ותנאי השימוש.</li>
                  <li>המשתמש מביע את הסכמתו לשימוש באתר, בהסתמך על הצהרותיו.</li>
                  <li>תנאים אלה חלים על השימוש בכל מכשיר תקשורת.</li>
                  <li>השימוש באתר מהווה הסכם בין החברה למשתמש.</li>
                  <li>החברה שומרת לעצמה את הזכות לשנות את תנאי השימוש מעת לעת, ללא הודעה מראש.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. מטרת האתר</h2>
                <p className="text-muted-foreground leading-relaxed">
                  האתר נועד לספק שירות מקוון לרכישת והזמנת מוצרים ושירותים ("השירותים"), ולאפשר למשתמשים להזמין ולרכוש באופן מקוון את השירותים המוצעים למכירה במסגרת האתר.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. תהליך ביצוע ההזמנה</h2>
                <ul className="text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
                  <li>על מנת להבטיח את ביצוע הרכישה ביעילות, יש להקפיד על מסירת כל הפרטים הנדרשים במדויק.</li>
                  <li>במידה וימסרו פרטים שגויים, לא מובטח כי ההזמנה תבוצע בהצלחה.</li>
                  <li>מסירת פרטים כוזבים הינה עבירה פלילית.</li>
                  <li>החברה שומרת על זכותה לבטל הזמנה בכל מקרה של פרטים לא מדויקים.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. ביטול עסקה והחזרות</h2>
                <ul className="text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
                  <li>המשתמש זכאי לבטל עסקה בהתאם להוראות חוק הגנת הצרכן.</li>
                  <li>הזכות לביטול עסקה תחול בתקופה של 14 ימים ממועד קבלת המוצר.</li>
                  <li>המוצר שיוחזר חייב להיות במצב תקין, באריזתו המקורית.</li>
                  <li><strong>לאור אופי המוצרים (תוספי תזונה ומזון), לא ניתן להחזיר מוצר שנפתח או שאריזתו נפגמה.</strong></li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. יצירת קשר</h2>
                <p className="text-muted-foreground leading-relaxed">
                  לשאלות בנוגע לתקנון זה, ניתן לפנות אלינו:<br />
                  דוא"ל: info@fullbody.co.il<br />
                  טלפון: 052-4487537<br />
                  כתובת: רחוב זרחין 1, רעננה
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">7. פרטי העסק</h2>
                <div className="bg-secondary/50 p-6 rounded-xl border border-border">
                  <ul className="text-muted-foreground space-y-2 leading-relaxed">
                    <li><strong>שם העסק:</strong> FullBody בע"מ</li>
                    <li><strong>ח.פ./עוסק מורשה:</strong> 516247890</li>
                    <li><strong>כתובת:</strong> רחוב זרחין 1, רעננה</li>
                    <li><strong>טלפון:</strong> <a href="tel:0524487537" className="text-accent hover:underline">052-4487537</a></li>
                    <li><strong>דוא"ל:</strong> <a href="mailto:info@fullbody.co.il" className="text-accent hover:underline">info@fullbody.co.il</a></li>
                    <li><strong>שעות פעילות:</strong> א'-ה' 9:00-18:00, ו' 9:00-13:00</li>
                  </ul>
                </div>
              </section>
            </div>
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

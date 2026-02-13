import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Moon, CheckSquare, Sparkles, Gift, Star, Lock, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";

const FLASHY_LIST_ID = 34516;

export default function SleepGuide() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      if (typeof window !== "undefined" && window.flashy?.contacts) {
        window.flashy.contacts.createOrUpdate({
          email,
          lists: { [FLASHY_LIST_ID]: true },
        });
        window.flashy("CustomEvent", { event_name: "sleep_guide_download" });
      }
    } catch {
      // silent – form still shows success
    }
    setSubmitted(true);
    setLoading(false);
  };

  const EmailForm = ({ btnText = "שלחו לי את המדריך" }: { btnText?: string }) => (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <Input
        type="email"
        required
        placeholder="הכנסו את כתובת המייל שלכם"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-12 text-base bg-card border-border text-foreground placeholder:text-muted-foreground"
        dir="ltr"
      />
      <Button type="submit" size="lg" disabled={loading} className="h-12 px-8 shadow-cta whitespace-nowrap font-bold">
        {loading ? "שולח..." : btnText}
      </Button>
    </form>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6" dir="rtl">
        <Helmet>
          <title>תודה! המדריך בדרך אליך - FullBody</title>
        </Helmet>
        <div className="text-center max-w-md animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">המדריך בדרך אליך! 🎉</h1>
          <p className="text-muted-foreground text-lg mb-6">
            בדקו את תיבת המייל שלכם (וגם את תיקיית הספאם). המדריך והצ'קליסט האינטראקטיבי מחכים לכם.
          </p>
          <a href="/" className="text-primary font-semibold hover:underline">חזרה לאתר FullBody ←</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Helmet>
        <title>המדריך לשינה עמוקה והתאוששות - FullBody</title>
        <meta name="description" content="הורד בחינם את מדריך FullBody לשינה עמוקה וקבל צ'קליסט אינטראקטיבי שיעזור לך להתעורר רענן בכל בוקר." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Side */}
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                חדש: מדריך אינטראקטיבי במתנה
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
                די לישון.{" "}
                <span className="text-gradient">הגיע הזמן להתאושש באמת.</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                הורד עכשיו את מדריך ה-FullBody לשינה עמוקה וקבל את הצ'קליסט האינטראקטיבי שיעזור לך לקום רענן, ממוקד וחזק יותר בכל בוקר.
              </p>

              <EmailForm />

              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                אנחנו שונאים ספאם בדיוק כמוך. המדריך יישלח אליך מיידית.
              </p>
            </div>

            {/* Visual Side */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-80 md:w-72 md:h-96 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-2xl flex flex-col items-center justify-center text-primary-foreground p-8">
                  <Moon className="w-16 h-16 mb-4 opacity-80" />
                  <p className="text-2xl font-bold text-center mb-2">המדריך לשינה עמוקה</p>
                  <p className="text-sm opacity-80 text-center">FullBody</p>
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-xl bg-card shadow-card-hover border border-border flex flex-col items-center justify-center p-3">
                  <CheckSquare className="w-8 h-8 text-primary mb-1" />
                  <p className="text-xs font-bold text-foreground text-center">צ'קליסט אינטראקטיבי</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center py-6">
        <ArrowDown className="w-6 h-6 text-muted-foreground animate-bounce" />
      </div>

      {/* Features */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">מה תגלו בתוך המדריך?</h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Moon,
                title: "שיטת 6 השלבים",
                desc: "הרגלים פשוטים ומוכחים מדעית שיהפכו את הלילה שלכם מזמן \"מת\" לזמן התאוששות פעיל.",
              },
              {
                icon: CheckSquare,
                title: "צ'קליסט אינטראקטיבי",
                desc: "כלי מעקב דיגיטלי שיאפשר לכם למדוד את איכות ההכנה שלכם לשינה בכל יום מחדש.",
              },
              {
                icon: Sparkles,
                title: "הסוד של המגנזיום",
                desc: "למה מגנזיום טאורט הוא ה-Game Changer של הספורטאים והאנשים העסוקים ביותר בעולם.",
              },
              {
                icon: Gift,
                title: "הטבה בלעדית",
                desc: "קופון הנחה מיוחד לרכישת המארז החסכוני ביותר בישראל של מגנזיום טאורט (180 כמוסות).",
              },
            ].map((f, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl font-semibold text-foreground mb-4 leading-relaxed">
              "מעולם לא ישנתי טוב יותר. הצ'קליסט עשה לי סדר והמגנזיום פשוט שינה את התמונה."
            </blockquote>
            <p className="text-muted-foreground font-medium">— דניאל ל., מרתוניסט ולקוח FullBody</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">מוכנים להתעורר רעננים?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            הצטרפו למאות לקוחות FullBody שכבר משדרגים את איכות החיים שלהם בכל לילה.
          </p>
          <div className="flex justify-center">
            <EmailForm btnText="אני רוצה את המדריך!" />
          </div>
        </div>
      </section>

      {/* Mini Footer */}
      <footer className="py-6 border-t border-border">
        <div className="container mx-auto px-4 flex flex-col items-center gap-3">
          <img src={logo} alt="FullBody" className="h-8" />
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} FullBody.co.il | כל הזכויות שמורות</p>
        </div>
      </footer>
    </div>
  );
}

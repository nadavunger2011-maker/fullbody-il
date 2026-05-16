import { ShieldCheck, Award, Globe, UserCheck } from "lucide-react";

const trustCards = [
  {
    icon: ShieldCheck,
    title: "באישור משרד הבריאות",
    description:
      "כל מוצרי הרבלייף באתר מיוצרים תחת בקרת איכות מחמירה ומאושרים לשיווק על ידי משרד הבריאות הישראלי.",
  },
  {
    icon: Award,
    title: "ספק התזונה של הספורטאים",
    description:
      "הרבלייף גאה להיות ספק התזונה הרשמי של הוועד האולימפי בישראל ושל ספורטאי עלית ברחבי העולם.",
  },
  {
    icon: Globe,
    title: "מותג התזונה המוביל בעולם",
    description:
      "מעל 40 שנות מומחיות, נוכחות בלמעלה מ-90 מדינות ומיליוני לקוחות מרוצים שמשנים את החיים שלהם בכל יום.",
  },
  {
    icon: UserCheck,
    title: "ליווי אישי של FullBody",
    description:
      "אנחנו לא רק מוכרים מוצרים – אנחנו מעניקים לך מעטפת מלאה, התאמת תוכנית אישית וליווי צמוד בדרך ליעד שלך.",
  },
];

export default function TrustFactors() {
  return (
    <section className="py-16 md:py-20 bg-secondary/30 border-y border-border" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground">
            גורמי אמינות
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm md:text-base">
            הסיבות שאלפי לקוחות בישראל בוחרים בפולבאדי ובמוצרי הרבלייף
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustCards.map((card, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-6 md:p-8 border border-border text-right
                         hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 mb-5 bg-[hsl(142,70%,35%)]/10 rounded-xl flex items-center justify-center
                              text-[hsl(142,70%,35%)] group-hover:bg-[hsl(142,70%,35%)] group-hover:text-white
                              transition-all duration-300">
                <card.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3 leading-snug">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

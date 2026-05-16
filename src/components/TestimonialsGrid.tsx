import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    rating: 5,
    text: "תמיד אהבתי את איך שאני נראית אבל אף פעם לא הצלחתי להתמיד ולהגיע למטרה שלי... עד שהתחלתי את התוכנית של פולבודי עם הרבלייף.",
    name: "מיכל ד.",
  },
  {
    rating: 5,
    text: "נכון שהגעתי לגוף החלומות שלי והשלתי את הקילוגרמים המיותרים, אבל הבנתי שהאנרגטיות, החיוניות והרעננות שקיבלתי בבקרים חשובות אפילו יותר.",
    name: "דניאל א.",
  },
  {
    rating: 5,
    text: "שמתי בעבר המון פוקוס רק על אימונים וספורט ומעט מדי על תזונה. כאן הפכתי את המשוואה, קיבלתי ליווי מדויק והתוצאות האמיתיות סוף סוף הגיעו.",
    name: "יעל ק.",
  },
  {
    rating: 5,
    text: "לא היה לי זמן להכין אוכל, חייתי על קפה ונשנושים מהירים. השייקים והתוכנית של הרבלייף הביאו לי פתרון בריא, מזין ובלי מאמץ. זה מה שעשה את כל ההבדל.",
    name: "רוני מ.",
  },
];

export default function TestimonialsGrid() {
  return (
    <section className="py-16 md:py-20 bg-background" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground">
            סיפורי הצלחה
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm md:text-base">
            לקוחות אמיתיים משתפים את הדרך שלהם
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-6 md:p-8 border border-border text-right
                         hover:shadow-hover hover:-translate-y-1 transition-all duration-300
                         flex flex-col"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-[hsl(142,70%,35%)]/20 mb-4 rotate-180" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[hsl(45,93%,47%)] text-[hsl(45,93%,47%)]"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm md:text-base text-foreground leading-relaxed mb-6 flex-1">
                "{t.text}"
              </p>

              {/* Avatar + Name */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50 mt-auto">
                <div className="w-10 h-10 rounded-full bg-[hsl(142,70%,35%)]/10 flex items-center justify-center text-[hsl(142,70%,35%)] font-bold text-sm shrink-0">
                  {t.name.charAt(0)}
                </div>
                <p className="font-bold text-foreground text-sm">{t.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

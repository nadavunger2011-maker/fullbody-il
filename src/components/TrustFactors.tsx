const trustCards = [
  {
    image: "https://www.herbi.co.il/wp-content/uploads/2023/12/Israeli_Ministry_of_Health_logo-small.webp",
    title: "באישור משרד הבריאות",
    description:
      "כל מוצרי הרבלייף באתר מיוצרים תחת בקרת איכות מחמירה ומאושרים לשיווק על ידי משרד הבריאות הישראלי.",
  },
  {
    image: "https://www.herbi.co.il/wp-content/uploads/2024/01/%D7%90%D7%AA%D7%A8-%D7%94%D7%A8%D7%91%D7%9C%D7%99%D7%99%D7%A3-_6_-1.webp",
    title: "ספק התזונה של הספורטאים",
    description:
      "הרבלייף גאה להיות ספק התזונה הרשמי של הוועד האולימפי בישראל ושל ספורטאי עלית ברחבי העולם.",
  },
  {
    image: "https://www.herbi.co.il/wp-content/uploads/2023/12/%D7%90%D7%AA%D7%A8-%D7%94%D7%A8%D7%91%D7%9C%D7%99%D7%99%D7%A3-_1_-2.webp",
    title: "מותג התזונה המוביל בעולם",
    description:
      "מעל 40 שנות מומחיות, נוכחות בלמעלה מ-90 מדינות ומיליוני לקוחות מרוצים שמשנים את החיים שלהם בכל יום.",
  },
  {
    image: "https://www.herbi.co.il/wp-content/uploads/2023/12/%D7%90%D7%AA%D7%A8-%D7%94%D7%A8%D7%91%D7%9C%D7%99%D7%99%D7%A3_1-1.webp",
    title: "משווק מורשה מטעם הרבלייף",
    description:
      "FullBody – משווק מורשה רשמי של הרבלייף, עם ליווי אישי, התאמת תוכנית והמלצות מקצועיות לכל לקוח.",
  },
];

export default function TrustFactors() {
  return (
    <section className="py-12 md:py-16 bg-secondary/30 border-b border-border" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
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
              className="group bg-card rounded-2xl p-6 md:p-7 border border-border text-right
                         hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="h-20 md:h-24 mb-5 flex items-center justify-center">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                />
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

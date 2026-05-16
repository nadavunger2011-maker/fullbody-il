import { useEffect, useState } from "react";

const trustLogos = [
  {
    src: "/trust/moh.webp",
    alt: "פולבאדי - מוצרי הרבלייף באישור משרד הבריאות הישראלי",
  },
  {
    src: "/trust/olympic-supplier.webp",
    alt: "פולבאדי - הרבלייף ספק התזונה הרשמי של הוועד האולימפי בישראל",
  },
  {
    src: "/trust/olympic-banner.webp",
    alt: "פולבאדי - הרבלייף שותפה רשמית של הוועד האולימפי וספורטאי עלית",
  },
  {
    src: "/trust/authorized.webp",
    alt: "פולבאדי - משווק מורשה רשמי של הרבלייף ישראל עם ליווי אישי",
  },
];

export default function TrustFactors() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % trustLogos.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="py-8 md:py-12 bg-secondary/30 border-b border-border"
      dir="rtl"
      aria-label="גורמי אמינות"
    >
      <div className="container mx-auto px-4">
        {/* Mobile / small: single-slide carousel */}
        <div className="md:hidden relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(${index * 100}%)` }}
          >
            {trustLogos.map((logo) => (
              <div
                key={logo.src}
                className="w-full flex-shrink-0 flex items-center justify-center h-24"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  className="max-h-full max-w-[70%] object-contain"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {trustLogos.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`מעבר לשקופית ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-[hsl(142,70%,35%)]" : "w-2 bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: continuous marquee carousel */}
        <div
          className="hidden md:block overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="flex gap-16 animate-marquee items-center w-max">
            {[...trustLogos, ...trustLogos].map((logo, i) => (
              <div
                key={`${logo.src}-${i}`}
                className="flex items-center justify-center h-24 shrink-0"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  className="max-h-24 max-w-[220px] object-contain opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

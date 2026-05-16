const trustLogos = [
  {
    src: "/trust/moh.webp",
    alt: "פולבאדי - מוצרי הרבלייף באישור משרד הבריאות הישראלי",
  },
  {
    src: "/trust/olympic-supplier.webp",
    alt: "פולבאדי - הרבלייף ספק התזונה הרשמי של הוועד האולימפי בישראל",
  },
];

export default function TrustFactors() {
  // Duplicate enough times to ensure smooth continuous flow on all screens
  const loop = [...trustLogos, ...trustLogos, ...trustLogos, ...trustLogos, ...trustLogos, ...trustLogos];

  return (
    <section
      className="py-8 md:py-12 bg-secondary/30 border-b border-border"
      dir="rtl"
      aria-label="גורמי אמינות"
    >
      <div className="container mx-auto px-4">
        <div
          className="overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="flex gap-12 md:gap-16 animate-marquee items-center w-max">
            {loop.map((logo, i) => (
              <div
                key={`${logo.src}-${i}`}
                className="flex items-center justify-center h-20 md:h-24 shrink-0"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  className="max-h-20 md:max-h-24 max-w-[160px] md:max-w-[220px] object-contain opacity-90"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

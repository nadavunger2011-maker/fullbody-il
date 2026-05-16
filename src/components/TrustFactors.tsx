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
  // Repeat each track many times so it fills wide screens; two identical tracks = seamless -50% loop
  const track = Array.from({ length: 8 }, () => trustLogos).flat();

  return (
    <section
      className="py-8 md:py-12 bg-secondary/30 border-b border-border overflow-hidden"
      dir="ltr"
      aria-label="גורמי אמינות"
    >
      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee">
          {[0, 1].map((trackIdx) => (
            <div key={trackIdx} className="flex shrink-0">
              {track.map((logo, i) => (
                <div
                  key={`${trackIdx}-${logo.src}-${i}`}
                  className="flex items-center justify-center h-20 md:h-24 shrink-0 px-6 md:px-8"
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
          ))}
        </div>
      </div>
    </section>
  );
}

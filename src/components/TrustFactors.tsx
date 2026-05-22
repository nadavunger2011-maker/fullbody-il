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
    src: "/trust/herbalife-distributor.webp",
    alt: "פולבאדי - משווק מורשה מטעם הרבלייף ישראל",
  },
  {
    src: "/trust/one-themarker.webp",
    alt: "פולבאדי בתקשורת - ONE ו-TheMarker",
  },
  {
    src: "/trust/calcalist-ynet.webp",
    alt: "פולבאדי בתקשורת - כלכליסט ו-ynet",
  },
  {
    src: "/trust/israel-hayom-globes.webp",
    alt: "פולבאדי בתקשורת - ישראל היום וגלובס",
  },
  {
    src: "/trust/walla-maariv.webp",
    alt: "פולבאדי בתקשורת - וואלה ומעריב",
  },
];

export default function TrustFactors({ compact = false }: { compact?: boolean }) {
  // Repeat each track many times so it fills wide screens; two identical tracks = seamless -50% loop
  const track = Array.from({ length: 8 }, () => trustLogos).flat();

  const rowH = compact ? "h-12 md:h-14" : "h-20 md:h-24";
  const imgH = compact ? "max-h-12 md:max-h-14" : "max-h-20 md:max-h-24";
  const imgW = compact ? "max-w-[110px] md:max-w-[140px]" : "max-w-[160px] md:max-w-[220px]";
  const pad = compact ? "px-4 md:px-5" : "px-6 md:px-8";
  const sectionPad = compact ? "py-3 md:py-4" : "py-8 md:py-12";
  const sectionBg = compact ? "bg-transparent" : "bg-secondary/30 border-b border-border";

  return (
    <section
      className={`${sectionPad} ${sectionBg} overflow-hidden`}
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
                  className={`flex items-center justify-center ${rowH} shrink-0 ${pad}`}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    loading="lazy"
                    className={`${imgH} ${imgW} object-contain opacity-90`}
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

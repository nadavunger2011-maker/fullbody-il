import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { herbalifeProducts } from '@/data/herbalifeProducts';
import heroSliderBg from '@/assets/hero-slider-bg.jpg';

const proteinProducts = herbalifeProducts.filter(p => p.categoryId === 'weight');

export default function HeroProductSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll-based parallax
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, 1 - rect.bottom / (window.innerHeight + rect.height)));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-play
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % proteinProducts.length);
    }, 4000);
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, []);

  const goTo = (index: number) => {
    setActiveIndex(index);
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % proteinProducts.length);
    }, 4000);
  };

  const prev = () => goTo((activeIndex - 1 + proteinProducts.length) % proteinProducts.length);
  const next = () => goTo((activeIndex + 1) % proteinProducts.length);

  const product = proteinProducts[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="relative h-[600px] flex items-center overflow-hidden"
    >
      {/* Background with parallax */}
      <div
        className="absolute inset-0 z-0 transition-transform duration-100"
        style={{ transform: `translateY(${scrollProgress * 60}px) scale(${1 + scrollProgress * 0.1})` }}
      >
        <img
          src={heroSliderBg}
          alt="Hero background"
          className="w-full h-full object-cover"
          loading="eager"
          width={1920}
          height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-foreground/95 via-foreground/80 to-foreground/50" />
      </div>

      <div className="container mx-auto px-4 z-10 relative flex flex-col md:flex-row items-center gap-8 md:gap-16">
        {/* Text */}
        <div className="flex-1 text-right order-2 md:order-1">
          <span className="bg-[hsl(142,70%,35%)] px-4 py-1.5 rounded-md text-sm font-bold uppercase tracking-wide mb-4 inline-block text-white">
            Herbalife Nutrition
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight text-primary-foreground">
            תזונה חכמה <br />
            <span className="text-[hsl(142,70%,50%)]">לחיים בריאים</span>
          </h1>
          <p className="text-lg md:text-xl mb-6 text-primary-foreground/80 font-light max-w-lg">
            {product.shortHook}
          </p>
          <div className="flex items-center gap-4">
            <Link
              to={`/product/${product.handle}`}
              className="bg-[hsl(142,70%,35%)] hover:bg-[hsl(142,70%,30%)] text-white font-bold py-3 px-8 rounded-lg transition-all shadow-cta"
            >
              ₪{product.price} — לפרטים
            </Link>
            <a
              href="#products"
              className="bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/30 text-primary-foreground font-bold py-3 px-8 rounded-lg transition-all"
            >
              כל המוצרים
            </a>
          </div>
        </div>

        {/* Product image with animation */}
        <div className="flex-shrink-0 order-1 md:order-2 relative w-56 h-56 md:w-80 md:h-80">
          {proteinProducts.map((p, i) => (
            <div
              key={p.handle}
              className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out"
              style={{
                opacity: i === activeIndex ? 1 : 0,
                transform: i === activeIndex
                  ? `translateY(0) scale(1) rotate(0deg)`
                  : i < activeIndex
                    ? `translateY(40px) scale(0.8) rotate(-5deg)`
                    : `translateY(-40px) scale(0.8) rotate(5deg)`,
              }}
            >
              <img
                src={p.image}
                alt={p.title}
                className="max-w-full max-h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                style={{
                  transform: `translateY(${scrollProgress * -20}px)`,
                  transition: 'transform 0.1s linear',
                }}
              />
            </div>
          ))}

          {/* Glow effect behind product */}
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-30 -z-10"
            style={{ background: 'radial-gradient(circle, hsl(142,70%,50%) 0%, transparent 70%)' }}
          />
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground p-2 rounded-full transition-all"
        aria-label="הקודם"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground p-2 rounded-full transition-all"
        aria-label="הבא"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {proteinProducts.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? 'bg-[hsl(142,70%,50%)] w-8'
                : 'bg-primary-foreground/40 hover:bg-primary-foreground/60'
            }`}
            aria-label={`מוצר ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

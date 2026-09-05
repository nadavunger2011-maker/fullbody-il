import { Link } from 'react-router-dom';

interface GoldStandardBadgeProps {
  /** compact = single inline pill, full = wider banner with link */
  variant?: 'compact' | 'full';
  className?: string;
}

/**
 * Herbalife "Gold Standard" 30-day satisfaction guarantee badge.
 * Used on the homepage and product pages.
 */
export default function GoldStandardBadge({ variant = 'full', className = '' }: GoldStandardBadgeProps) {
  const text = '30 ימי אחריות ושביעות רצון מלאה, גם על מוצר פתוח!';

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border border-[hsl(45,90%,45%)]/40 bg-[hsl(45,90%,50%)]/10 px-3 py-1.5 text-xs font-bold text-foreground ${className}`}
      >
        <span aria-hidden="true">⭐️</span>
        <span>{text}</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-[hsl(45,90%,45%)]/40 bg-[hsl(45,90%,50%)]/10 px-4 py-3 text-center ${className}`}
    >
      <p className="text-sm md:text-base font-black text-foreground">
        <span aria-hidden="true">⭐️ </span>
        {text}
      </p>
      <Link to="/return-policy" className="text-xs font-bold text-[hsl(142,70%,35%)] hover:underline">
        לפרטי ערבות שביעות הרצון "תקן הזהב"
      </Link>
    </div>
  );
}

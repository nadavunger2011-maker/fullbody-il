import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Target } from 'lucide-react';

export type BlogCTAVariant = 'inline' | 'conclusion' | 'sticky';

interface BlogCTAWidgetProps {
  title?: string;
  description?: string;
  buttonText?: string;
  /** blog post slug or title, forwarded to /plan?source=... for CRM tracking */
  source?: string;
  variant?: BlogCTAVariant;
}

const DEFAULTS = {
  title: 'רוצה תוכנית אישית שמתאימה בדיוק לך?',
  description: 'שאלון קצר של דקה, ואתה מקבל תוכנית תזונה ואימונים מותאמת ליעד, לגוף ולרמת הניסיון שלך, בחינם.',
  buttonText: 'בנה לי תוכנית אישית',
};

export default function BlogCTAWidget({
  title = DEFAULTS.title,
  description = DEFAULTS.description,
  buttonText = DEFAULTS.buttonText,
  source,
  variant = 'inline',
}: BlogCTAWidgetProps) {
  const href = source ? `/plan?source=${encodeURIComponent(source)}` : '/plan';

  if (variant === 'sticky') {
    return (
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border shadow-hover pb-[env(safe-area-inset-bottom)] not-prose">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{title}</p>
            <p className="text-xs text-muted-foreground truncate">{description}</p>
          </div>
          <Link
            to={href}
            className="shrink-0 bg-[hsl(142,70%,35%)] text-white font-bold text-sm px-4 py-2.5 rounded-xl active:scale-95 transition-transform"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    );
  }

  const isConclusion = variant === 'conclusion';

  return (
    <div
      className={`not-prose my-10 rounded-2xl border overflow-hidden ${
        isConclusion
          ? 'border-[hsl(142,70%,35%)]/40 bg-[hsl(142,70%,35%)]/5'
          : 'border-border bg-secondary/40'
      }`}
    >
      <div className="p-6 sm:p-8 text-center sm:text-right">
        <span className="inline-flex items-center gap-2 text-xs font-bold text-[hsl(142,70%,35%)] bg-[hsl(142,70%,35%)]/10 px-3 py-1 rounded-full mb-4">
          {isConclusion ? <Target className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
          {isConclusion ? 'הצעד הבא שלך' : 'תוכנית אישית בחינם'}
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-foreground mb-2 leading-snug">{title}</h3>
        <p className="text-muted-foreground mb-5 leading-relaxed">{description}</p>
        <Link
          to={href}
          className="inline-flex items-center gap-2 bg-[hsl(142,70%,35%)] text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all"
        >
          {buttonText}
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

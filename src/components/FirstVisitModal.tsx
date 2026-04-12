import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const STORAGE_KEY = "fullbody_first_visit_seen";
const HERBALIFE_URL = "https://www.herbalife.co.il/";

export default function FirstVisitModal() {
  const [visible, setVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  if (isMobile) {
    return (
      <div
        dir="rtl"
        className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 animate-in slide-in-from-bottom duration-300"
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-foreground leading-relaxed">
              כבר יש לך מפיץ אישי של הרבלייף? מומלץ להמשיך את הרכישה מולו. אם לא, נשמח ללוות אותך כחלק מקהילת FullBody!
            </p>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={handleDismiss}
                className="bg-foreground text-background text-xs font-semibold px-4 py-1.5 rounded-md hover:bg-foreground/90 transition-colors whitespace-nowrap"
              >
                הבנתי, המשך
              </button>
              <a
                href={HERBALIFE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDismiss}
                className="text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors whitespace-nowrap"
              >
                יש לי מפיץ
              </a>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0"
            aria-label="סגור"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="fixed bottom-20 left-6 z-40 bg-background border border-border rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.1)] p-4 max-w-xs animate-in slide-in-from-left-4 fade-in duration-300"
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-foreground leading-relaxed">
            כבר יש לך מפיץ אישי של הרבלייף? מומלץ להמשיך את הרכישה מולו. אם לא, נשמח ללוות אותך כחלק מקהילת FullBody!
          </p>
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleDismiss}
              className="bg-foreground text-background text-xs font-semibold px-4 py-1.5 rounded-md hover:bg-foreground/90 transition-colors whitespace-nowrap"
            >
              הבנתי, המשך
            </button>
            <a
              href={HERBALIFE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDismiss}
              className="text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors whitespace-nowrap"
            >
              יש לי מפיץ
            </a>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          aria-label="סגור"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

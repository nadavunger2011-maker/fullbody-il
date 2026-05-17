import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";

const IMAGE_SRC = "/herbalife-disclaimer.jpg";
const VISIBLE_MS = 6000;

export default function FirstVisitModal() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  // Show on every initial mount (per page load), no persistence
  useEffect(() => {
    const showT = setTimeout(() => setVisible(true), 1200);
    const hideT = setTimeout(() => setVisible(false), 1200 + VISIBLE_MS);
    return () => {
      clearTimeout(showT);
      clearTimeout(hideT);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hide on any route change (no popup during navigation)
  useEffect(() => {
    setVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      dir="rtl"
      className="fixed bottom-4 left-4 z-40 bg-background border border-border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.12)] p-2 w-[600px] max-w-[90vw] animate-in slide-in-from-left-4 fade-in duration-300"
    >
      <button
        onClick={() => setVisible(false)}
        className="absolute -top-2 -left-2 bg-background border border-border rounded-full p-1 shadow-sm hover:bg-muted transition-colors z-10"
        aria-label="סגור"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      <img
        src={IMAGE_SRC}
        alt="הצהרת מפיץ עצמאי הרבלייף"
        className="w-full h-auto rounded-md block"
        loading="lazy"
      />
      <div className="px-3 pt-3 pb-2 text-[11px] leading-relaxed text-foreground space-y-2 text-right">
        <div>
          <p className="font-semibold">דיסקליימר תוצאות (עבור תוצאות במלל ו/או בתמונות):</p>
          <p>
            כל ההפניות לבקרת משקל קשורות לתוכנית ניהול משקל של הרבלייף, הכוללת, בין היתר, תזונה מאוזנת, פעילות גופנית קבועה, שתיית נוזלים מספקת בכל יום, תוספי תזונה אם צריך ומנוחה נאותה. תוצאות אישיות עשויות להשתנות.
          </p>
        </div>
        <div>
          <p className="font-semibold">דיסקליימר רווחים (באם מפרסמים באתר את ההזדמנות העסקית):</p>
          <p>
            ההכנסות חלות על הפרטים (או הדוגמאות) המתוארים ואינן מהוות ממוצע. הישגים משמעותיים מגיעים מעבודה קשה, השקעה והתמדה, רוב המפיצים מרוויחים הכנסה נוספת כלשהי.
          </p>
          <p>
            למידע נוסף{" "}
            <a href="https://Herbalife.com/STE" target="_blank" rel="noopener noreferrer" className="underline">
              Herbalife.com/STE
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

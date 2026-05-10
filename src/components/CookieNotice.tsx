import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "fullbody_cookies_ack";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      dir="rtl"
      className="fixed bottom-4 right-4 z-40 bg-background/95 backdrop-blur border border-border rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.1)] px-3 py-2 max-w-[300px] flex items-center gap-2 animate-in slide-in-from-right-4 fade-in duration-300"
    >
      <p className="text-[11px] text-muted-foreground leading-snug flex-1">
        האתר משתמש בקוקיז לשיפור החוויה.{" "}
        <Link to="/privacy" className="underline hover:text-foreground">
          מידע נוסף
        </Link>
      </p>
      <button
        onClick={handleAccept}
        className="bg-foreground text-background text-[11px] font-semibold px-2.5 py-1 rounded hover:bg-foreground/90 transition-colors whitespace-nowrap"
      >
        אישור
      </button>
      <button
        onClick={handleAccept}
        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
        aria-label="סגור"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

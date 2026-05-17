import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";

const STORAGE_KEY = "fullbody_disclaimer_seen";
const IMAGE_SRC = "/herbalife-disclaimer.jpg";
const VISIBLE_MS = 6000;

export default function FirstVisitModal() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Only show once per customer, ever (persisted across sessions)
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    // Only on initial mount — never on route transitions
    const showT = setTimeout(() => setVisible(true), 1200);
    const hideT = setTimeout(() => {
      setVisible(false);
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    }, 1200 + VISIBLE_MS);
    return () => {
      clearTimeout(showT);
      clearTimeout(hideT);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hide immediately on any route change & mark as seen
  useEffect(() => {
    if (visible) {
      setVisible(false);
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleDismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      dir="rtl"
      className="fixed bottom-4 left-4 z-40 bg-background border border-border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.12)] p-2 w-[600px] max-w-[90vw] animate-in slide-in-from-left-4 fade-in duration-300"
    >
      <button
        onClick={handleDismiss}
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
    </div>
  );
}

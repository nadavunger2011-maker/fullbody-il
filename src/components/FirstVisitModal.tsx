import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";

const IMAGE_SRC = "/herbalife-disclaimer.jpg";
const VISIBLE_MS = 12000;

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
    </div>
  );
}

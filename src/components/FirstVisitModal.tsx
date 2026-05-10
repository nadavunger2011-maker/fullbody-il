import { useState, useEffect } from "react";
import { X } from "lucide-react";

const SESSION_KEY = "fullbody_disclaimer_seen";
const IMAGE_SRC = "/herbalife-disclaimer.jpg"; // replace with your compliant image

export default function FirstVisitModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      dir="rtl"
      className="fixed bottom-4 left-4 z-40 bg-background border border-border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.12)] p-2 w-[360px] sm:w-[440px] max-w-[90vw] animate-in slide-in-from-left-4 fade-in duration-300"
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

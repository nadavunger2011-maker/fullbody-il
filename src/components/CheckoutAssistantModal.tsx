import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

const WHATSAPP_URL = "https://wa.link/0g4tht";

export default function CheckoutAssistantModal({
  isOpen,
  onClose,
  onProceed,
}: CheckoutAssistantModalProps) {
  const [isAcknowledged, setIsAcknowledged] = useState(true);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-card rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden animate-in zoom-in-95 fade-in duration-300"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">
              לפני המעבר לקופה
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition"
              aria-label="סגור"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-5">
            {/* Assistant Message */}
            <div className="bg-muted/60 rounded-xl p-4 space-y-3">
              <p className="text-foreground text-sm leading-relaxed text-right">
                הרשו לי לעזור לכם להשיג את מטרותיכם, ללקוחות יש סיכוי טוב יותר להשיג את מטרותיהם עם המוצרים הנכונים, מערכת יחסים עם הרב-לייף העצמאי שלהם, ולהיות חלק מקהילה.
              </p>
            </div>

            {/* Acknowledgment Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group p-2 -m-2 rounded-lg hover:bg-muted/40 transition">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  checked={isAcknowledged}
                  onChange={(e) => setIsAcknowledged(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 border-2 border-[hsl(142,70%,35%)] rounded-md peer-checked:bg-[hsl(142,70%,35%)] peer-checked:border-[hsl(142,70%,35%)] transition-colors flex items-center justify-center">
                  {isAcknowledged && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors select-none">
                אני יודע שאני יכול לקבל תמיכה אישית במידה וארצה
              </span>
            </label>
          </div>

          {/* Footer / Proceed Button */}
          <div className="p-5 pt-0">
            <Button
              onClick={() => {
                onProceed();
                onClose();
              }}
              disabled={!isAcknowledged}
              className="w-full py-6 text-lg font-bold bg-accent hover:bg-accent/90 rounded-xl shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              המשך לקופה
            </Button>
            {!isAcknowledged && (
              <p className="text-[11px] text-muted-foreground text-center mt-2">
                יש לאשר תמיכה אישית כדי להמשיך
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

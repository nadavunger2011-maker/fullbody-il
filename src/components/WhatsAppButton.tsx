import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappUrl = "https://wa.link/0g4tht";

  const handleButtonClick = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      // Open WhatsApp directly on mobile, show popup on desktop
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.open(whatsappUrl, '_blank');
      } else {
        setIsOpen(true);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Popup Message */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-[280px] animate-in slide-in-from-bottom-2 fade-in duration-300 border border-border">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">FullBody</p>
                <p className="text-xs text-muted-foreground">צוות התמיכה</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="סגור"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 mb-3">
            <p className="text-sm text-foreground">
              👋 היי! יש לך שאלות? נשמח לעזור לך בווטסאפ!
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium py-2.5 px-4 rounded-xl transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>התחל שיחה</span>
          </a>
        </div>
      )}

      {/* Floating Button — icon only, compact */}
      <button
        onClick={handleButtonClick}
        className="group flex items-center justify-center w-12 h-12 bg-[#25D366] hover:bg-[#20bd5a] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="פתח צ'אט ווטסאפ"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>
      
      {/* Pulse animation when closed */}
      {!isOpen && (
        <span className="absolute bottom-0 right-0 w-12 h-12 bg-[#25D366] rounded-full animate-ping opacity-20 pointer-events-none" />
      )}
    </div>
  );
};

export default WhatsAppButton;
